# KAJA practice portal and production landing page

Reuse the working JCAN static exam engine without changing question assembly, timers, answer review, or audio budgets. KAJA intentionally has no login. No authentication services, secrets, database bindings, or JCAN account/session calls are included.

## Shared design direction

Preserve the original KAJA red/navy logo, the approved mockup's open white/light-blue layout, real school content, and existing enrollment/contact links. The production school page and practice subdomain remain separate upload packages.

UI UX Pro Max guidance: visible focus, touch targets, semantic labels, reduced motion, responsive layout checks, and honest progress/error states. Taste app guidance: readable controls, a clear next action, no invented student statistics, and product-specific identity. Adapt the achromatic workspace direction to KAJA's approved red/navy brand. Awwwards guidance is scaled to a school practice product: authentic content, decisive hierarchy, and purposeful interaction without unnecessary visual effects.

## KAJA pre-exam setup

The setup screen answers: what will I practise, and am I ready to start?

Replace JCAN's intro-grid with a horizontal KAJA title and mode-dependent count/time summary, a session-building form, a navy headphone-check panel, a red start button, optional candidate fields in a native disclosure, and a curved study guide featuring the Korean phrase 가자.

Question totals derive from the template questions and time totals from the section duration. Reading-only hides the headphone check. Listening requires actual sample playback and the student's confirmation. UBT retains the reading-first/listening-first selector.

The `kaja-setup` body class scopes setup layout and is removed on exam launch or results. In-exam question and answer behavior stays intact. Source attribution remains in a native disclosure.

## Packaging and verification

Portable HTML/CSS/JavaScript modules and local audio. HTTPS and correct JavaScript MIME types are required on the actual host. Skills videos stay on YouTube. The main page's contact form is separately prepared with PHP/SMTP and needs private owner configuration.

The setup was checked at 1440, 768, and 390 pixels, with real audio playback, required confirmation, mode changes, CBT/UBT launches, and listening-first behavior. The 28 exam-engine tests pass. Files are packaged for FTP; actual-host verification follows upload.
