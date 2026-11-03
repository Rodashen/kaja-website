# KAJA exam access service

This Worker protects the private exam assets. Public practice pages redirect to it.
The teacher chooses a code valid for 1–7 days (24–168 hours from saving).
Durations are validated on the server. Existing student sessions keep their original expiry.

Deploy using the KAJA Cloudflare account with the existing DB and ASSETS bindings.
Keep ADMIN_PASSWORD_HASH in Cloudflare secrets. Never commit credentials, cookies,
private question banks, or generated asset bundles to this public repository.
The deployment workspace holds the private exam assets separately; do not build them
from the public practice redirect pages. No database migration is required for duration changes.
