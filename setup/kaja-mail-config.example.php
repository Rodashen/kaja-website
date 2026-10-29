<?php
// Copy this file OUTSIDE the public web directory, named kaja-mail-config.php.
// Owner fills these values privately. Never commit real passwords to GitHub.
return [
 'enabled' => false,
 'smtp_host' => 'smtp.hostinger.com',
 'smtp_port' => 587,
 'smtp_security' => 'tls',
 'smtp_username' => '', // Full mailbox address. FTP credentials do not work here.
 'smtp_password' => '', // Mailbox password, not Hostinger account password.
 'from_email' => '', // The authenticated mailbox address.
 'rate_limit_salt' => '', // Generate once, paste a fixed random string of at least 32 characters here.
 'allowed_origins' => ['https://kajalanguagecenter.com','https://www.kajalanguagecenter.com'],
];
