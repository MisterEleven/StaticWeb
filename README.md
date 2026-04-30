# Multi-Website GitHub Pages Repository

This repository hosts multiple static websites served from different directories, all under one GitHub Pages deployment.

## 🏗️ Repository Structure

```
StaticWeb/
├── index.html              # Root landing page (lists all sites)
├── ca2/                    # WebXR 3D Model Viewer
│   ├── a03_extra_webxr.html
│   ├── a03_design-project.glb
│   └── skybox_360.jpg
├── site1/                  # Portfolio website
│   ├── index.html
│   └── CNAME.example
├── site2/                  # Documentation website
│   ├── index.html
│   └── CNAME.example
├── site3/                  # Landing page website
│   ├── index.html
│   └── CNAME.example
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions deployment
├── README.md
├── SETUP.md
├── .gitignore
└── CNAME.example
```

## 🌐 How It Works

### URL Structure
- **Root**: `https://yourusername.github.io/StaticWeb/`
- **Leaf Pavilion (WebXR)**: `https://yourusername.github.io/StaticWeb/ca2/a03_extra_webxr.html`
- **Site 1**: `https://yourusername.github.io/StaticWeb/site1/`
- **Site 2**: `https://yourusername.github.io/StaticWeb/site2/`
- **Site 3**: `https://yourusername.github.io/StaticWeb/site3/`

### Custom Domains (Optional)
Each subdirectory can have its own custom domain:
1. Add a `CNAME` file in the site directory (e.g., `site1/CNAME`)
2. Configure DNS records to point to GitHub Pages
3. Enable custom domain in repository settings

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