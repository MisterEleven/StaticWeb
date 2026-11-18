#!/usr/bin/env python3
"""Build the curated Pages tree, never a recursive copy of the repository."""

import argparse
import hashlib
import os
from pathlib import Path, PurePosixPath
import shutil
import stat
import subprocess
import sys
import tempfile

ROOT = Path(__file__).resolve().parents[1]
ROUTES = {"assets", "bs1", "ca2", "privacy", "root", "site1", "site2", "site3", "smdldc"}
ENTRIES = {"index.html", "favicon.svg", "robots.txt", "sitemap.xml", "llms.txt", "CNAME", ".nojekyll"}
EXTENSIONS = {
    ".html", ".css", ".js", ".mjs", ".svg", ".ico", ".png", ".jpg", ".jpeg",
    ".webp", ".gif", ".avif", ".glb", ".gltf", ".bin", ".woff", ".woff2",
    ".ttf", ".otf", ".eot", ".pdf", ".mp4", ".webm", ".mp3", ".wav", ".ogg",
}
DEV_DIRS = {"node_modules", "__pycache__", "scripts", "src", "docs", "tests", "inspectionProfiles"}
MARKER = ".staticweb-public"
MARKER_CONTENT = b"StaticWeb curated public build v1\n"


class BuildError(Exception):
    pass


def checked_path(value):
    """Accept only canonical, repository-relative paths (never glob syntax)."""
    path = PurePosixPath(value)
    if (not value or not path.parts or path.is_absolute() or str(path) != value
            or any(part in {".", ".."} for part in path.parts)
            or any(char in value for char in "\\*?[]\x00\r\n")):
        raise BuildError(f"Not an exact repository-relative path: {value!r}")
    return path


def allowed(path):
    if len(path.parts) == 1:
        return str(path) in ENTRIES
    if path.parts[0] not in ROUTES:
        return False
    if any(part.startswith(".") or part in DEV_DIRS for part in path.parts):
        return False
    # JSON is data only at these known runtime locations, not a registry dump.
    if path.suffix.lower() == ".json":
        return (str(path) == "smdldc/review/tiles.json"
                or (path.parts[:2] == ("bs1", "results")
                    and path.name in {"cfd_points_legend.json", "openings.json"}))
    font_path = (path.parts[:2] == ("assets", "fonts")
                 or path.parts[:2] == ("smdldc", "fonts"))
    if font_path and (path.name in {"LICENSE", "LICENSE.txt", "OFL.txt"}
                      or path.name.endswith("-OFL.txt")):
        return True
    if str(path) == "root/codenerve.txt" or path.name == "CNAME":
        return True
    return path.suffix.lower() in EXTENSIONS


def source_path(path):
    """Check every component, including directories, before using a source."""
    source = ROOT
    for part in path.parts:
        source /= part
        if source.is_symlink():
            raise BuildError(f"Symlinks are not allowed: {path}")
    return source


def explicit_files(value):
    path = checked_path(value)
    if not allowed(path) and not (len(path.parts) == 1 and str(path) in ROUTES):
        # Directories under approved routes need not have a file extension.
        if path.parts[0] not in ROUTES or not source_path(path).is_dir():
            raise BuildError(f"Not an approved public path: {value}")
    source = source_path(path)
    if source.is_dir():
        result = []
        # Unlike the normal build, this deliberately opts into untracked files.
        # Every descendant still has to satisfy the public-file policy.
        for directory, directories, files in os.walk(source, followlinks=False):
            for name in sorted(directories + files):
                child = (Path(directory) / name).relative_to(ROOT)
                source_path(PurePosixPath(child.as_posix()))
            for name in sorted(files):
                child = PurePosixPath((Path(directory) / name).relative_to(ROOT).as_posix())
                if not allowed(child):
                    raise BuildError(f"Explicit include contains a forbidden file: {child}")
                result.append(child)
        return result
    if not source.is_file() or not allowed(path):
        raise BuildError(f"Not an approved public file: {value}")
    return [path]


def owned(directory):
    if directory.is_symlink() or not directory.is_dir():
        return False
    marker = directory / MARKER
    return (not marker.is_symlink() and marker.is_file()
            and marker.read_bytes() == MARKER_CONTENT)


def tree_hash(directory, paths):
    """Hash paths and contents in a stable order; do not publish a manifest."""
    digest = hashlib.sha256()
    for path in paths:
        digest.update(str(path).encode("utf-8") + b"\0")
        file_digest = hashlib.sha256()
        with (directory / str(path)).open("rb") as handle:
            for chunk in iter(lambda: handle.read(1024 * 1024), b""):
                file_digest.update(chunk)
        digest.update(file_digest.digest())
    return digest.hexdigest()


def build(includes):
    output = ROOT / "public"
    if os.path.lexists(output) and not owned(output):
        raise BuildError("Refusing to replace public/: it is not an owned build directory")
    tracked = subprocess.check_output(["git", "-C", str(ROOT), "ls-files", "-z"])
    paths = set()
    for name in tracked.split(b"\0"):
        if not name:
            continue
        path = checked_path(os.fsdecode(name))
        if allowed(path):
            paths.add(path)
    for include in includes:
        paths.update(explicit_files(include))
    paths = sorted(paths, key=str)
    if PurePosixPath("index.html") not in paths:
        raise BuildError("The public build must contain tracked index.html")

    staging = Path(tempfile.mkdtemp(prefix=".public-stage-", dir=ROOT))
    backup = None
    try:
        for path in paths:
            source = source_path(path)
            if not source.is_file():
                raise BuildError(f"Tracked public source is missing or not a regular file: {path}")
            target = staging / str(path)
            target.parent.mkdir(parents=True, exist_ok=True)
            # O_NOFOLLOW also refuses a file changed to a symlink since validation.
            descriptor = os.open(source, os.O_RDONLY | os.O_NOFOLLOW)
            with os.fdopen(descriptor, "rb") as handle:
                if not stat.S_ISREG(os.fstat(handle.fileno()).st_mode):
                    raise BuildError(f"Not a regular file: {path}")
                with target.open("wb") as destination:
                    shutil.copyfileobj(handle, destination)
            target.chmod(0o644)
        (staging / MARKER).write_bytes(MARKER_CONTENT)
        actual = {PurePosixPath(p.relative_to(staging).as_posix())
                  for p in staging.rglob("*") if p.is_file() and p.name != MARKER}
        if actual != set(paths):
            raise BuildError("Staged file inventory does not match the approved inputs")
        digest = tree_hash(staging, paths)
        # Only swap after all sources and the complete output have been checked.
        if os.path.lexists(output):
            if not owned(output):
                raise BuildError("public/ ownership changed during the build")
            backup = Path(tempfile.mkdtemp(prefix=".public-old-", dir=ROOT))
            backup.rmdir()
            output.rename(backup)
        try:
            staging.rename(output)
        except BaseException:
            if backup is not None:
                backup.rename(output)
                backup = None
            raise
        if backup is not None:
            shutil.rmtree(backup)
        print(f"Built public/: {len(paths)} files; SHA-256 {digest}")
        if includes:
            print("Local preview includes were used; CI copies tracked files only.")
    finally:
        if staging.exists():
            shutil.rmtree(staging)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--include", action="append", default=[], metavar="PATH",
                        help="local preview only: add an exact approved file/directory (repeatable)")
    args = parser.parse_args()
    try:
        build(args.include)
    except (BuildError, OSError, subprocess.CalledProcessError) as error:
        parser.exit(1, f"Build refused: {error}\n")


if __name__ == "__main__":
    main()
