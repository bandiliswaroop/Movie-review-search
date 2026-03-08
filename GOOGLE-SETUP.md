# Make Your Movie Search Site Available on Google

Your site is ready for search engines. Follow these steps to get it on Google.

---

## Step 1: Deploy your site online

The site must be on a **public URL** (not just on your computer). Choose one:

### Option A — GitHub Pages (free)

1. Create a GitHub account if you don’t have one: https://github.com  
2. Create a new repository (e.g. `movie-search`).  
3. Upload your project files: `index.html`, `style.css`, `script.js`, `robots.txt`, `sitemap.xml` (and `background.mp4` if you use it).  
4. Go to **Settings → Pages**.  
5. Under **Source**, choose **Deploy from a branch**.  
6. Select branch **main** (or **master**) and folder **/ (root)**. Save.  
7. Your site will be at: `https://YOUR-USERNAME.github.io/movie-search/`

### Option B — Netlify (free)

1. Go to https://www.netlify.com and sign up.  
2. Drag and drop your **movie** folder (with all files inside) onto the Netlify deploy area.  
3. Netlify gives you a URL like `https://random-name-123.netlify.app`.  
4. You can change the site name in **Domain settings**.

### Option C — Vercel (free)

1. Go to https://vercel.com and sign up.  
2. Import your project (e.g. from GitHub or upload).  
3. Deploy. You get a URL like `https://your-project.vercel.app`.

---

## Step 2: Set your real URL in the project

After you have your live URL (e.g. `https://myuser.github.io/movie-search/`):

1. **index.html** — Find the line with `id="canonical-url"` and set:
   - `href="https://YOUR-ACTUAL-URL/"`  
   (Use your full URL with trailing slash.)

2. **robots.txt** — Replace `https://YOUR-SITE-URL.com` with your real URL in the `Sitemap:` line.

3. **sitemap.xml** — Replace both `https://YOUR-SITE-URL.com` with your real URL (no trailing slash in `<loc>` is fine).

4. **Redeploy** (re-upload or push to GitHub / Netlify / Vercel) so the updated files are live.

---

## Step 3: Add your site to Google Search Console

1. Go to **Google Search Console**: https://search.google.com/search-console  
2. Click **Add property**.  
3. Choose **URL prefix** and enter your full site URL (e.g. `https://myuser.github.io/movie-search/`).  
4. Verify ownership using one of the methods Google offers (e.g. HTML file upload or meta tag).  
5. After verification, open **Sitemaps** in the left menu.  
6. Enter: `sitemap.xml` (or your full sitemap URL) and click **Submit**.

---

## Step 4: Ask Google to index your homepage

1. In Search Console, use **URL Inspection** (top search bar).  
2. Enter your homepage URL and press Enter.  
3. Click **Request indexing** so Google crawls your page sooner.

---

## Summary checklist

- [ ] Deploy site to GitHub Pages, Netlify, or Vercel  
- [ ] Replace `YOUR-SITE-URL.com` / `YOUR-ACTUAL-URL` in `index.html`, `robots.txt`, and `sitemap.xml`  
- [ ] Redeploy so updated files are live  
- [ ] Add property in Google Search Console and verify  
- [ ] Submit `sitemap.xml` in Search Console  
- [ ] Use “Request indexing” for your homepage  

After that, your site can appear in Google when people search for **“movie review”**, “movie search”, “find movie by title”, etc. It may take a few days (or weeks) for the first results to show.

---

## Showing up for “movie review” searches

The site is already optimized for the keyword **movie review**:

- **Title & meta:** The page title and description include “movie review” and “film review”.
- **On-page text:** The tagline and intro paragraph use “movie review” and related phrases so Google can match your page to that search.

**To improve your chances:**

1. **Deploy and submit** — Follow Steps 1–4 above so Google can crawl and index your page.
2. **Request indexing** — In Search Console, use “URL Inspection” → “Request indexing” for your homepage to speed up the first crawl.
3. **Share your link** — Share your site on social media, your GitHub profile, or a blog. More visits and links can help over time.
4. **Be patient** — Ranking for “movie review” is competitive. Results can take days or weeks; keep the site live and the content as is.
