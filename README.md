# joelcrowe.co.uk

A simple article site. All the text lives in two files you edit from the admin page:

- `content/site.json`: every piece of text on the site (title, intro, about, contact, credit line)
- `content/articles.json`: your articles (title, date, cover photo, summary, article text)
- `images/`: cover photos you upload

## 1. Put the site on GitHub (free)

1. Create a GitHub account at github.com and turn on two-factor authentication
   (Settings → Password and authentication). This account is what protects your admin login.
2. Create a new **public** repository, e.g. `joelcrowe.co.uk`.
3. Click **Add file → Upload files** and drag in everything from this folder.
   Check that `.pages.yml` and `CNAME` got uploaded. Files starting with a dot are sometimes
   hidden; if it's missing, use **Add file → Create new file**, name it `.pages.yml`,
   and paste in its contents.

## 2. Turn on hosting and connect your domain

1. In the repository: **Settings → Pages**. Under "Build and deployment" choose
   **Deploy from a branch**, branch `main`, folder `/ (root)`, then Save.
2. In the same page, set **Custom domain** to `joelcrowe.co.uk`.
3. Where you bought the domain, open its DNS settings and add:
   - four `A` records for `@` pointing to `185.199.108.153`, `185.199.109.153`,
     `185.199.110.153`, `185.199.111.153`
   - a `CNAME` record for `www` pointing to `YOUR-GITHUB-USERNAME.github.io`
   Don't touch any `MX` records, because those are for your email.
4. Wait for DNS to update (can take up to a day), then tick **Enforce HTTPS** in Settings → Pages.

## 3. Use the admin page

1. Go to `joelcrowe.co.uk/admin` (it sends you to Pages CMS), or straight to https://app.pagescms.org
2. **Sign in with GitHub**, install the Pages CMS app on your repository when asked, and open it.
3. You'll see two sections:
   - **Articles**: add, edit, reorder or delete articles. Upload a cover photo for each one.
     The "web address name" becomes the link, e.g. `my-first-article`.
   - **Site text**: edit every piece of text on the site, including the credit line.
4. Click **Save**. The live site updates within a minute or two.

## Writing maths

In an article, put maths between dollar signs: `$x^2+1$` for inline,
or `$$\frac{n(n+1)}{2}$$` for a displayed equation.

## Credit line

The footer says the articles are written by you and the website was built with the help of Claude.
You can reword it in **Site text → Credit line**, but keep both parts.
