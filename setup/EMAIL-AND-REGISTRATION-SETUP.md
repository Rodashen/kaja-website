# Kaja website — contact email, registration, and social setup

## Included now

- Contact form addressed only to **kajalanguagecenter@gmail.com**. Visitors cannot change the recipient.
- PHP SMTP handler with PHPMailer **7.1.1**, included from its official repository with its license.
- No real email credentials in the website files or ZIP.
- CSRF validation, same-origin checks, field validation, a hidden spam field, a short submission delay, and per-IP rate limiting.
- Visitor text remains in the form if sending fails. A success message appears only after the SMTP server accepts the message; acceptance still does not guarantee inbox placement.
- A Gmail compose link as an alternative. This opens the visitor's own Gmail; it does not send automatically.
- New registration button prepared for a future Google Form. The old form URL has been removed.
- TikTok: https://www.tiktok.com/@kajalanguagetutor
- Facebook: the supplied search URL, labeled **Find Kaja on Facebook**. Replace it with the direct official page URL when available.

## Owner: activate sending on Hostinger

The practice portal remains a no-login static site. Only the main landing page's contact form uses PHP and SMTP. Use a supported PHP 8.x runtime on the hosting account, with OpenSSL and sessions available.

1. Choose an actual mailbox that can send through SMTP. If the hosting plan includes Hostinger or Titan Email, check that mailbox's own connection settings. A Gmail recipient does not require Gmail to be the sending server.
2. Copy `kaja-mail-config.example.php` to **one directory above the main website's public directory**, named `kaja-mail-config.php`. For a public directory named `public_html`, the configuration should be its sibling, not a file inside `public_html`.
3. Fill the configuration privately:
   - `smtp_host`: the email provider's actual server. Hostinger Email commonly uses `smtp.hostinger.com`; use the mailbox's published settings.
   - `smtp_port`: normally `587` with `smtp_security` set to `tls`, or `465` with `ssl`, according to the provider.
   - `smtp_username`: full sending mailbox address.
   - `smtp_password`: that mailbox's password. **Do not use FTP or main Hostinger login credentials.**
   - `from_email`: the authenticated sending mailbox address.
   - `rate_limit_salt`: a fixed random string of at least 32 characters. Generate it once and paste its literal value; do not run a fresh random generator on every request.
   - `allowed_origins`: exact HTTPS origins serving the landing page. The defaults are the main Kaja domain and its `www` version.
   - `enabled`: set to `true` after completing the values.
4. If the configuration cannot live at the default location, the owner may set the server environment variable `KAJA_MAIL_CONFIG` to its absolute private path. Do not put the path or credentials in front-end JavaScript.
5. Upload the landing-page files, including `contact.php` and `vendor/PHPMailer/`. The `vendor/.htaccess` prevents direct web access to library files while PHP can still require them locally.
6. Open the landing page over HTTPS. When configuration is present, the Send message button becomes available.
7. Send one real inquiry with the owner's approval. Confirm its arrival at `kajalanguagecenter@gmail.com`, including Spam. Reply should address the visitor using the submitted email. Check provider delivery logs if it does not arrive.

If sending is not configured, the page says online messaging is unavailable and offers direct email. It will not pretend the message was sent. The local Node preview intentionally does not execute PHP or send mail; it shows that unavailable state.

Hostinger reference: https://www.hostinger.com/ca/tutorials/how-to-send-emails-using-phpmailer/

PHPMailer source/version: https://github.com/PHPMailer/PHPMailer/releases/tag/v7.1.1

## Set the new Google Form link

Create the registration form in Kaja's own Google account. A suggested simple registration form asks for name, email, contact number, preferred class format, current Korean level, and questions for the school. Review its privacy wording with Kaja before collecting submissions.

Once published, edit **`upload/site-config.js`**:

```javascript
registrationUrl: 'PASTE_THE_NEW_PUBLISHED_GOOGLE_FORM_URL_HERE',
```

Use an HTTPS `docs.google.com/forms/` or `forms.gle/` URL. The registration button will then open the new form. While it is blank, the page says registration will open soon and directs visitors to contact Kaja. No old or invented Google Form is linked.

## Change the Facebook link

Replace the Facebook URL in `site-config.js`. The script updates its link on the page. Also update the fallback anchor in `index.html` if supporting browsers without JavaScript. The supplied link is a Facebook search, not a verified direct page address. The TikTok link is a direct profile.

## Validation completed

- Four official HRDK ZIP downloads returned valid ZIP signatures.
- Desktop and phone browser checks for registration, resources, socials, and contact states passed.
- Contact form success/failure display tested with mocked responses; failed messages retained.
- PHP syntax and runtime checks passed, including CSRF, input validation, spam checks, origin checks, throttling, and SMTP failure behavior.
- **Live SMTP delivery is not tested or enabled** because no actual mailbox settings have been supplied. No test email was sent.
