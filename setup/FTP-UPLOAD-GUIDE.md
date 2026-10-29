# KAJA Practice — FTP upload guide

## What this package does

A standalone, public, no-login EPS practice portal using the existing tested exam engine with KAJA branding. It includes CBT and UBT modes, local listening audio, results downloads, manufacturing interview questions/audio, HRDK skills-video embeds, and randomized color-dot practice with a keypad.

There is no password, activation code, email-sending service, database, cloud session, or paid-access restriction. Anyone who can reach the subdomain can use it. Practice state and recent-question history stay in each browser. This is not account-based cross-device progress.

## Upload destination

Intended address: **https://practice.kajalanguagecenter.com/**.

The hosting owner must confirm that the FTP account's starting directory maps to this subdomain's document root. Seeing `/` in an FTP app only identifies the account's allowed starting folder; it does not prove which domain serves it.

1. Connect using the owner's verified FTP server settings and encrypted FTP over TLS. Credentials are deliberately not included in this package.
2. Confirm the destination with the hosting owner. If there are existing files, back them up before replacing anything.
3. Extract `kaja-practice-ftp.zip` on your computer.
4. Upload the **contents** of the extracted archive directly into the confirmed subdomain folder. The remote folder should contain `index.html`, `cbt.html`, `ubt.html`, `skills.html`, `ishihara.html`, `logo.jpg`, `.htaccess`, and the `css`, `js`, `fonts`, `data`, and `media` directories. Do not put them inside an extra `upload` folder.
5. Make sure the transfer queue finishes with no failed files. The audio directory is substantial and must finish uploading before testing listening/interview practice.
6. Open the subdomain over HTTPS. JavaScript module files (`.mjs`) must be served as JavaScript; `.htaccess` includes the MIME rule for Apache/LiteSpeed hosting.

Do not upload the separate main-website archive to the practice subdomain. It has a different `index.html`.

## First checks on the actual host

- Homepage loads with KAJA logo and navy/red branding.
- CBT reading-only practice starts and can submit/download results.
- UBT offers listening-first; the sound check plays; each question and choice has its own audio control.
- Interview questions, tool pictures, and Listen button work.
- English and Tagalog skills guides open, including Service II.
- Color-dot plates load and the keypad advances to the next plate.
- Phone layout fits the screen.
- Browser Network panel shows no requests to JCAN's backend or `/api/session`.

The local build passed browser checks at 1440, 768 and 390 pixels plus 28 automated engine tests. Actual Hostinger routing, HTTPS, MIME behavior, and external YouTube availability still need a check after upload. YouTube playback may be affected by network or browser restrictions; original-video links remain available.

## Hosting notes

- This app must be served over HTTP/HTTPS. Double-clicking its HTML files is not sufficient for loading the question-bank modules and JSON. Use HTTPS for production.
- No local MP4 files are included. Skills videos remain YouTube embeds; listening and interview recordings are local assets.
- `robots.txt` currently keeps the practice portal out of search engines. This is not access protection.
- `.htaccess` sets `index.html` as the directory page, disables directory listing, and asks the browser to revalidate app code and data.
- If the host returns HTTP 500 after upload, inspect its error log with the hosting owner for an unsupported `.htaccess` directive rather than changing unrelated sites.
- Preserve HRDK and other source attributions. These exercises are not an official HRDK assessment. Generated color-dot exercises are not diagnostic.

## Main landing page

The separate `kaja-main-landing-ftp.zip` is prepared for `https://kajalanguagecenter.com/`, based on the approved mockup. It links to the practice subdomain. Do not replace the existing WordPress root until the school approves the page and its current class details. The owner should back up WordPress files/database, decide how existing WordPress URLs will remain available or redirect, and apply any WordPress rewrite changes. The main archive's minimal `.htaccess` is a proposal for a standalone static root, not an automatic WordPress migration script.

The landing page now includes a PHP/PHPMailer contact handler. Follow `outputs/kaja-main/EMAIL-AND-REGISTRATION-SETUP.md` for the owner's one-time private SMTP configuration. The sender mailbox is separate from the fixed Gmail recipient. Until configured, no messages are sent and the page offers direct email. The practice portal still has no PHP or login requirement.

The EPS books section links to four unchanged ZIP downloads hosted directly by HRDK, covering new and previous Books 1 and 2. These books do not increase the local FTP archive size or Kaja's download bandwidth.

## Updates

Keep the source in GitHub. FTP upload is a deployment step, not version control. An automated GitHub-to-FTP workflow can be added later using folder-restricted deployment credentials stored in GitHub Secrets. No credentials or deployment workflow are included in these public files.
