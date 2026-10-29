# KAJA website and EPS practice portal

Main school website and no-login EPS-TOPIK practice portal for Kaja Language Tutorial Center. Prepared from the KAJA design and the existing tested static exam engine.

## Project layout

| Path | Purpose | Intended destination |
| --- | --- | --- |
| Root `index.html`, CSS, JavaScript, `assets/`, `vendor/`, and `contact.php` | Main landing page | `https://kajalanguagecenter.com/` |
| `practice/` | Complete practice portal | `https://practice.kajalanguagecenter.com/` |
| `setup/` | FTP, email, registration, and design notes | Documentation only |
| `tests/` | Exam-engine tests | Development only |
| `tools/` | Local preview server | Development only |

The main landing page includes course tabs, a working sample question, an automatically rolling hall of passers, social links, a registration-link slot, and an SMTP-ready contact form. The registration URL is intentionally blank until the new Google Form is available. The supplied Facebook URL is a search page; a direct official-page URL can replace it in `site-config.js`.

The practice portal includes CBT and UBT exams, Book 1/Book 2 question selection, graph questions, local listening and interview recordings, saved browser progress, results downloads, skill-specific YouTube guides, downloadable textbook links, interview practice, and non-diagnostic color-dot exercises.

## Preview on your computer

Install Node.js, then run from this directory:

```sh
node tools/preview.cjs
```

Open `http://127.0.0.1:8787/` for the main page and `http://127.0.0.1:8787/practice/` for the practice portal. The local Node server does not execute PHP or send email. It safely reports the contact form as unconfigured.

## Run tests

```sh
node --test tests/*.test.mjs
```

The inherited 28 engine tests cover bank/media integrity, scoring and timing, random selection, the 30/70 Book 1/Book 2 split, graph counts, audio announcements, UBT playback budgets, and color-dot randomization. Browser interaction checks were also completed during preparation.

## Deployment

For the practice subdomain, upload the **contents of `practice/`** into that subdomain's confirmed document root. Do not upload an extra `practice` directory around those files unless the hosting owner has explicitly chosen that directory as the document root.

For the main domain, deploy the main-site files separately. Do not overwrite the current WordPress site without the owner's backup, approval, and redirect plan. Read [FTP upload guide](setup/FTP-UPLOAD-GUIDE.md).

The landing-page exam buttons and EPS practice navigation link use the relative URL `practice/`. For a combined deployment, publish the root website **with the `practice/` folder included**. This keeps exam navigation on the current deployment, including repository-path hosting, and avoids relying on the separately configured practice subdomain.

If the owner chooses separate domain/subdomain deployments instead, configure and verify the practice subdomain before changing these links to an absolute address.

Creating or pushing this repository does not automatically publish the website. No automated deployment or GitHub Pages hosting is configured here.

## Email and registration

Read [Email and registration setup](setup/EMAIL-AND-REGISTRATION-SETUP.md). The contact recipient is fixed to `kajalanguagecenter@gmail.com`. An authenticated sender mailbox must be configured privately by the hosting owner before messages can be sent. PHP 8.x, sessions, and OpenSSL are needed for this handler; the practice portal does not require PHP or an account service.

The example SMTP configuration contains no credentials. Real configuration belongs outside the public web directory and must never be committed. Set the new Google Form link in `site-config.js` when ready.

## Security and scope

- No real FTP, SMTP, Cloudflare, or email-service credentials are included.
- No JCAN login service, student database, admin bypass, or paid-access controls are included.
- Practice progress is local to the browser; there is no cross-device account or cloud synchronization.
- With no login, practice resources are publicly accessible and answer keys are part of the client-side data.
- Current availability on Hostinger depends on the owner's DNS, document-root mapping, HTTPS, and MIME configuration.

## Sources

Kaja logo, photographs, school content, and published passers originate from the school's existing website and supplied project materials. HRDK textbooks, recordings, question references, and video guides retain their source attributions. Bootstrap Icons and PHPMailer retain their bundled licenses. No blanket open-source license is granted over third-party school or textbook materials by this repository.

These are preparation tools, not an official HRDK examination. Color-dot practice is not a medical diagnosis or an eligibility assessment.

## KAJA enrollment and interview reviewer

The landing page enrollment button opens the published KAJA Google Form configured in `site-config.js`. The practice portal links to `practice/reviewer.html`, with the supplied 47-page PDF, original tool/pictogram visuals, 177 Korean question-and-answer cards, 37 commands, and 30 safety topics. Existing recorded interview practice, HRDK tools, safety material, and video guides remain available in `practice/skills.html`. Reviewer sample answers are study examples, not official exam guarantees.
