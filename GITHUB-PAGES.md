# Deploy Movie Search with GitHub Pages

Yes — you can host this site for **free** using GitHub Pages. Follow these steps.

---

## 1. Create a GitHub account

- Go to **https://github.com** and sign up (or log in).

---

## 2. Create a new repository

1. Click the **+** (top right) → **New repository**.
2. **Repository name:** e.g. `movie-search` (or `movie`).
3. Choose **Public**.
4. **Do not** check “Add a README” (you’re uploading existing files).
5. Click **Create repository**.

---

## 3. Upload your project files

Your repo will be empty. Add your site files:

### Option A — Upload in the browser

1. On the repo page, click **“uploading an existing file”** (or **Add file** → **Upload files**).
2. Drag and drop (or select) these from your `movie` folder:
   - `index.html`
   - `style.css`
   - `script.js`
   - `robots.txt`
   - `sitemap.xml`
   - `background.mp4` (optional)
3. Scroll down, add a commit message (e.g. “Add Movie Search site”), click **Commit changes**.

### Option B — Using Git on your computer

In a terminal, inside your `movie` folder:

```bash
git init
git add index.html style.css script.js robots.txt sitemap.xml
git add background.mp4
git commit -m "Add Movie Search site"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/movie-search.git
git push -u origin main
```

Replace `YOUR-USERNAME` and `movie-search` with your GitHub username and repo name.

---

## 4. Turn on GitHub Pages

1. In your repository, go to **Settings** (top menu).
2. In the left sidebar, click **Pages** (under “Code and automation”).
3. Under **Build and deployment**:
   - **Source:** Deploy from a branch
   - **Branch:** `main` (or `master`)
   - **Folder:** `/ (root)`
4. Click **Save**.

---

## 5. Get your live URL

- After a minute or two, your site will be at:
  - **https://YOUR-USERNAME.github.io/movie-search/**  
  (Use your GitHub username and your repo name.)

- You’ll see the URL in **Settings → Pages** under “GitHub Pages” (e.g. “Your site is live at …”).

---

## 6. Update URLs for Google (optional)

To get the site on Google, set your real GitHub Pages URL in the project:

1. **index.html** — Find the canonical link and set:
   - `href="https://YOUR-USERNAME.github.io/movie-search/"`

2. **robots.txt** — Change the Sitemap line to:
   - `Sitemap: https://YOUR-USERNAME.github.io/movie-search/sitemap.xml`

3. **sitemap.xml** — Replace `https://YOUR-SITE-URL.com` with:
   - `https://YOUR-USERNAME.github.io/movie-search`

4. Commit and push the changes (or upload the updated files again). Then follow **GOOGLE-SETUP.md** from Step 3 (Google Search Console) to submit your site to Google.

---

## Summary

| Step | Action |
|------|--------|
| 1 | Sign up / log in at github.com |
| 2 | Create a new public repo (e.g. `movie-search`) |
| 3 | Upload `index.html`, `style.css`, `script.js`, `robots.txt`, `sitemap.xml` (and `background.mp4` if you use it) |
| 4 | **Settings → Pages** → Deploy from branch **main**, folder **/ (root)** → Save |
| 5 | Visit **https://YOUR-USERNAME.github.io/movie-search/** |

After that, your Movie Search site is live and you can share the link or add it to Google using GOOGLE-SETUP.md.
