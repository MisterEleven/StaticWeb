# Setup Guide for Multi-Website GitHub Pages Repository

This guide will walk you through setting up and deploying your multi-website repository to GitHub Pages.

## 📋 Prerequisites

- A GitHub account
- Git installed on your computer
- (Optional) Custom domain(s) for your sites

## 🚀 Quick Start

### Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `StaticWeb` (or any name you prefer)
3. Make it public (required for free GitHub Pages)
4. Don't initialize with README (we already have one)

### Step 2: Push Your Code

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit: Multi-website setup"

# Add remote repository (replace with your username)
git remote add origin https://github.com/YOUR_USERNAME/StaticWeb.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages** (in the left sidebar)
3. Under **Source**, select:
   - Source: **GitHub Actions**
4. The workflow will automatically deploy your site

### Step 4: Wait for Deployment

1. Go to the **Actions** tab in your repository
2. Wait for the deployment workflow to complete (usually 1-2 minutes)
3. Once complete, your site will be live at:
   ```
   https://YOUR_USERNAME.github.io/StaticWeb/
   ```

## 🌐 Custom Domain Setup

### feddern.dev Setup (Already Configured)

The `root/` directory is already configured with feddern.dev:

1. **CNAME file exists**: `root/CNAME` contains `feddern.dev`

2. **Configure DNS at your domain registrar:**
   
   **Option A - Using A Records (Apex domain):**
   ```
   Type: A
   Name: @
   Value: 185.199.108.153
   
   Type: A
   Name: @
   Value: 185.199.109.153
   
   Type: A
   Name: @
   Value: 185.199.110.153
   
   Type: A
   Name: @
   Value: 185.199.111.153
   ```
   
   **Option B - Using CNAME (if supported):**
   ```
   Type: CNAME
   Name: @
   Value: yourusername.github.io
   ```

3. **Enable in GitHub:**
   - Go to Settings → Pages
   - Custom domain: `feddern.dev`
   - Check "Enforce HTTPS" (after DNS propagates)

4. **Wait for DNS propagation** (up to 48 hours, usually faster)

### Option 1: Custom Domain for Root Hub

To use a custom domain for the entire repository:

1. **Rename the example file:**
   ```bash
   mv CNAME.example CNAME
   ```

2. **Edit CNAME file:**
   ```bash
   echo "yourdomain.com" > CNAME
   ```

3. **Configure DNS (at your domain registrar):**
   - Add A records pointing to GitHub Pages IPs:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
   - Or add a CNAME record:
     ```
     CNAME: YOUR_USERNAME.github.io
     ```

4. **Enable in GitHub:**
   - Go to Settings → Pages
   - Enter your custom domain
   - Check "Enforce HTTPS" (after DNS propagates)

### Option 2: Custom Domains for Individual Sites

To use different domains for each site directory:

1. **For site1:**
   ```bash
   mv site1/CNAME.example site1/CNAME
   echo "portfolio.yourdomain.com" > site1/CNAME
   ```

2. **Configure DNS:**
   - Add CNAME record:
     ```
     Name: portfolio
     Value: YOUR_USERNAME.github.io
     ```

3. **Repeat for other sites** (site2, site3, etc.)

**Note:** GitHub Pages doesn't natively support per-directory custom domains. You'll need to:
- Use subdomain redirects at DNS level, OR
- Deploy each site as a separate repository, OR
- Use a reverse proxy/CDN (like Cloudflare Workers)

## 📝 Adding a New Website

1. **Create a new directory:**
   ```bash
   mkdir site4
   ```

2. **Add an index.html:**
   ```bash
   cat > site4/index.html << 'EOF'
   <!DOCTYPE html>
   <html lang="en">
   <head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>Site 4</title>
   </head>
   <body>
       <h1>Welcome to Site 4</h1>
       <a href="../">Back to Hub</a>
   </body>
   </html>
   EOF
   ```

3. **Update the main index.html** to add a link to the new site

4. **Commit and push:**
   ```bash
   git add .
   git commit -m "Add site4"
   git push
   ```

## 🔧 Customization Tips

### Update Site Links

Edit `index.html` in the root directory to update the site cards:

```html
<a href="./site4/" class="site-card">
    <h2>Site 4</h2>
    <p>Description of your new site</p>
    <span class="badge">Category</span>
    <span class="arrow">→</span>
</a>
```

### Change Repository Name

If you want to use a different repository name:

1. Rename the repository in GitHub Settings
2. Update the remote URL:
   ```bash
   git remote set-url origin https://github.com/YOUR_USERNAME/NEW_NAME.git
   ```
3. Your site URL will change to:
   ```
   https://YOUR_USERNAME.github.io/NEW_NAME/
   ```

### Use as User/Organization Site

To use `YOUR_USERNAME.github.io` as the root URL:

1. Rename repository to: `YOUR_USERNAME.github.io`
2. Your sites will be at:
   - Root: `https://YOUR_USERNAME.github.io/`
   - Site 1: `https://YOUR_USERNAME.github.io/site1/`
   - etc.

## 🐛 Troubleshooting

### Site Not Deploying

1. Check the **Actions** tab for errors
2. Ensure GitHub Pages is enabled in Settings
3. Verify the workflow file is in `.github/workflows/deploy.yml`
4. Make sure the repository is public

### 404 Errors

1. Check that `index.html` exists in each directory
2. Verify file names are lowercase
3. Clear browser cache
4. Wait a few minutes for deployment to complete

### Custom Domain Not Working

1. Verify DNS records are correct (use `dig` or `nslookup`)
2. Wait for DNS propagation (can take up to 48 hours)
3. Check that CNAME file contains only the domain (no http://)
4. Ensure "Enforce HTTPS" is enabled after DNS propagates

### Changes Not Showing

1. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
2. Check Actions tab to ensure deployment completed
3. Wait a few minutes for CDN to update
4. Try incognito/private browsing mode

## 📚 Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Custom Domain Setup](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## 💡 Pro Tips

1. **Use branches for testing:** Create a `dev` branch for testing changes before merging to `main`
2. **Add analytics:** Include Google Analytics or similar in your sites
3. **Optimize images:** Compress images before adding them to reduce load times
4. **Use a CDN:** Consider Cloudflare for additional performance and security
5. **Regular backups:** Keep local copies of your sites
6. **Version control:** Use meaningful commit messages for easier tracking

## 🎉 You're All Set!

Your multi-website repository is now live! Visit your site and start customizing.

Need help? Check the [README.md](README.md) for more information or open an issue on GitHub.