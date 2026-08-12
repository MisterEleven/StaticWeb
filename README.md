# Timo Feddern — Projects

This repository hosts a landing page and a small collection of static sites served together from GitHub Pages. `index.html` is a project index that links out to each site.

## 🏗️ Repository Structure

```
StaticWeb/
├── index.html              # Hub landing page (project index)
├── root/                   # Personal Portfolio (feddern.dev)
│   ├── index.html
│   ├── index.css
│   ├── index.js
│   ├── favicon.ico
│   └── CNAME              # feddern.dev
├── ca2/                    # HardLeaf — WebXR pavilion viewer (ETH CA II)
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   ├── a03_design-project.glb
│   ├── final_hexmesh.glb
│   └── skybox_360.jpg
├── site1/, site2/, site3/  # Scratch slots — not linked from the hub
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions deployment
├── README.md
├── SETUP.md
├── .gitignore
└── CNAME.example
```

> **GymRave** (event site at [gymrave.ch](https://gymrave.ch)) is featured on the hub but lives in a **separate repository** — it is only linked out from `index.html`, not hosted here.

## 🌐 How It Works

### URL Structure
- **Hub**: `https://mistereleven.github.io/StaticWeb/`
- **Personal Portfolio**: [`feddern.dev`](https://feddern.dev) (custom domain) or `https://mistereleven.github.io/StaticWeb/root/`
- **HardLeaf (WebXR)**: `https://mistereleven.github.io/StaticWeb/ca2/`
- **GymRave** (external, separate repo): [`gymrave.ch`](https://gymrave.ch)

`site1/`, `site2/`, `site3/` remain reachable by direct URL but are intentionally not linked from the hub.

### Custom Domains

#### feddern.dev (Personal Portfolio)
The `root/` directory is configured with a custom domain:
- **CNAME file**: `root/CNAME` contains `feddern.dev`
- **DNS Configuration**: Point your domain to GitHub Pages
  - Type: A records or CNAME
  - Value: GitHub Pages IPs or `yourusername.github.io`
- **GitHub Settings**: Enable custom domain in repository settings

#### Additional Custom Domains (Optional)
Each subdirectory can have its own custom domain:
1. Add a `CNAME` file in the site directory (e.g., `site1/CNAME`)
2. Configure DNS records to point to GitHub Pages
3. Enable custom domain in repository settings

**Note**: GitHub Pages supports one custom domain per repository by default. For multiple custom domains, consider using DNS redirects or deploying sites as separate repositories.

## 🚀 Deployment

### Automatic Deployment
This repository uses GitHub Actions to automatically deploy to GitHub Pages on every push to the `main` branch.

### Manual Setup
1. Go to repository Settings → Pages
2. Source: Deploy from a branch
3. Branch: `gh-pages` (or `main`)
4. Folder: `/ (root)`

## 📝 Adding a New Site

1. Create a new directory: `mkdir site-name`
2. Add an `index.html` file
3. (Optional) Add a `CNAME` file for custom domain
4. Commit and push changes

## 🎨 Customization

### Root Landing Page
Edit `index.html` to customize the main landing page that lists all your sites.

### Individual Sites
Each site directory is independent and can use:
- Plain HTML/CSS/JS
- Static site generators (build output)
- Any static content

## 🔧 Custom Domain Configuration

### For Individual Sites
1. Create `CNAME` file in site directory:
   ```
   echo "subdomain.yourdomain.com" > site1/CNAME
   ```

2. Configure DNS:
   - Type: CNAME
   - Name: subdomain
   - Value: yourusername.github.io

### For Root Domain
1. Create `CNAME` file in root:
   ```
   echo "yourdomain.com" > CNAME
   ```

2. Configure DNS:
   - Type: A records pointing to GitHub Pages IPs:
     - 185.199.108.153
     - 185.199.109.153
     - 185.199.110.153
     - 185.199.111.153

## 📚 Use Cases

- **Portfolio**: Multiple project showcases
- **Documentation**: Different product docs
- **Landing Pages**: Various marketing pages
- **Experiments**: Test different designs
- **Multi-tenant**: Separate sites for different clients/projects

## 🛠️ Technologies

- GitHub Pages (hosting)
- GitHub Actions (CI/CD)
- Static HTML/CSS/JS

## 📄 License

MIT License - Feel free to use this structure for your projects!