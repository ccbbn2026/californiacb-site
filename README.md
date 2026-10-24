# californiacb.com

Website for California Custom Builders (CA License #929421).

## How it's laid out
- `site/` - everything that goes live: the home page, one folder per page, `assets/` (images, CSS, JS) and `contact.php` (contact form handler).
- `.cpanel.yml` - tells Bluehost cPanel to copy `site/` into `public_html` when you deploy.

## How to publish a change
1. Changes are committed and pushed to the `main` branch on GitHub.
2. In Bluehost cPanel, open **Git Version Control**, click **Manage** next to this repo.
3. Open the **Pull or Deploy** tab: click **Update from Remote**, then **Deploy HEAD Commit**.

Deploying only adds or overwrites files. Server-managed files (`.htaccess`, `.well-known`, `cgi-bin`) and the `old-2022-site` backup are not in this repo and are never touched.
