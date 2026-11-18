# Timo Feddern | Projects

Static sites served together by GitHub Pages. The root `index.html` is the project hub; GymRave is an external link to a separate repository.

## Public routes

The curated build preserves the existing paths rather than publishing the entire repository:

- `/` — project hub
- `/root/` — personal portfolio
- `/ca2/` — HardLeaf WebXR pavilion, including its models
- `/bs1/` — building-systems viewer, including `results/` and `older/`
- `/smdldc/` — urban-heat project, including the review viewer and `review/tiles.json`
- `/site1/`, `/site2/`, `/site3/` — legacy slots, reachable directly
- `/privacy/` — privacy page
- `/assets/` — shared images and locally hosted fonts

## Build and preview

Python 3.10+ and Git are the only build requirements. Run from the repository root:

```sh
python3 scripts/build_public.py
python3 -m http.server 8000 --directory public
```

Open `http://localhost:8000/`. Deployment uploads **only `public/`**, never repository `.`.

### Publication policy

The builder gets its inputs from `git ls-files -z`, then applies a public-path and file-type allowlist. It copies the working-tree contents of tracked files, so local edits are visible without committing. Missing tracked public files fail the build instead of silently removing a route.

**New files must be added to Git before the normal build will copy them.** This includes `assets/fonts/…`, `privacy/index.html`, and `smdldc/img/social-preview.jpg`. Review new images and PDFs before adding them; untracked files are never swept into the default build. In CI, only files present in the checked-out commit can be published.

For local verification before adding approved files, opt in to exact repository-relative paths:

```sh
python3 scripts/build_public.py \
  --include privacy/index.html \
  --include assets/fonts \
  --include smdldc/img/social-preview.jpg
```

`--include` is repeatable, local-preview-only, and is not used by the workflow. A directory includes its descendants only if **every file** passes the publication policy. Absolute paths, traversal, glob patterns, symlinks, forbidden extensions, and files outside approved public routes are refused. An explicit include cannot bypass the policy or publish a registry such as `experiments.json`.

At the repository root, only `index.html`, `favicon.svg`, `robots.txt`, `sitemap.xml`, `llms.txt`, and an existing tracked `CNAME` or intentional `.nojekyll` are eligible. Under approved routes, runtime HTML/CSS/JavaScript, images, fonts, models, PDFs, and media are eligible. JSON is limited to `smdldc/review/tiles.json` and the existing `bs1/results/**/{cfd_points_legend,openings}.json` data. Development files and directories, editor metadata, XML/IML/workspace files, Python, Markdown, example configs, and general text documentation are excluded. Public font notices (`assets/fonts/**/LICENSE`, `LICENSE.txt`, `OFL.txt`), legacy `root/codenerve.txt`, and route `CNAME` files are exceptions.

The build uses a temporary staging directory and validates the inventory before swapping it into `public/`. It replaces an existing `public/` **only when** that directory has the builder's `.staticweb-public` ownership marker. An existing unmarked directory, file, or symlink is refused; move it aside yourself after inspecting its contents. Interrupted `.public-stage-*` or `.public-old-*` directories are ignored by Git and are not published. The marker contains only a fixed ownership identifier; no development-file manifest is shipped.

A successful build prints the published file count and a deterministic SHA-256 over sorted public paths and their contents. Repeat the build without input changes to compare the digest. The ownership marker is excluded from that digest. Inspect output paths locally with:

```sh
find public -type f | sort
```

## Deployment

`.github/workflows/deploy.yml` builds and deploys on pushes to `main` or manual dispatch. In repository **Settings → Pages**, set the source to **GitHub Actions**; do not deploy a branch's repository root. The workflow checks out the commit, configures Pages, runs the Python builder, uploads `public/`, and deploys the artifact.

For a custom domain, add and commit a repository-root `CNAME`, configure its DNS, and configure the domain in Pages settings. GitHub Pages supports one custom domain per repository; a nested `CNAME` does not create another independent domain. Existing nested files are retained for compatibility.

## Adding or updating content

Edit a site's files in place, build, and preview its existing URL. For a new top-level route or runtime file format, explicitly update the policy in `scripts/build_public.py` after reviewing what should be public. Add approved new files to Git, rebuild **without `--include`**, and verify their output before committing and pushing. Keep source scripts, research registries, notes, and private material outside the publication policy.

## Technologies

GitHub Pages, GitHub Actions, and static HTML/CSS/JavaScript.
