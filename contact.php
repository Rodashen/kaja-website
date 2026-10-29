<?php
declare(strict_types=1);
// SMTP credentials live outside the public website directory.
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
ini_set('display_errors', '0');
session_set_cookie_params(['httponly'=>true,'secure'=>!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off','samesite'=>'Strict']);
session_start();
function reply(int $status, array $body): void { http_response_code($status); echo json_encode($body); exit; }
$path = getenv('KAJA_MAIL_CONFIG') ?: dirname(__DIR__) . '/kaja-mail-config.php';
$cfg = is_file($path) ? require $path : [];
$ready = is_array($cfg) && !empty($cfg['enabled']) && !empty($cfg['smtp_host']) && !empty($cfg['smtp_username']) && !empty($cfg['smtp_password']) && filter_var($cfg['from_email'] ?? '', FILTER_VALIDATE_EMAIL) && strlen($cfg['rate_limit_salt'] ?? '') >= 32 && in_array($cfg['smtp_security'] ?? '', ['tls','ssl'], true);
if (empty($_SESSION['csrf'])) { $_SESSION['csrf'] = bin2hex(random_bytes(32)); }
if (empty($_SESSION['form_started'])) { $_SESSION['form_started'] = time(); }
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method === 'GET') { reply(200, ['ready'=>(bool)$ready,'csrf'=>$_SESSION['csrf']]); }
if ($method !== 'POST') { header('Allow: GET, POST'); reply(405, ['error'=>'Method not allowed.']); }
if (!$ready) { reply(503, ['error'=>'Online messaging is not available yet. Please email kajalanguagecenter@gmail.com.']); }
if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 16000) { reply(413, ['error'=>'Your message is too long.']); }
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = $cfg['allowed_origins'] ?? ['https://kajalanguagecenter.com','https://www.kajalanguagecenter.com'];
if ($origin !== '' && !in_array($origin, $allowed, true)) { reply(403, ['error'=>'Please send your message from the Kaja website.']); }
$raw = file_get_contents('php://input');
if (strlen($raw) > 16000) { reply(413, ['error'=>'Your message is too long.']); }
$input = json_decode($raw, true);
if (!is_array($input)) { reply(400, ['error'=>'Please check your message and try again.']); }
if (!is_string($input['csrf'] ?? null) || !hash_equals($_SESSION['csrf'], $input['csrf'])) { reply(403, ['error'=>'Please reload this page and try again. Your message has not been sent.']); }
if (!empty($input['website']) || time() - (int)$_SESSION['form_started'] < 3) { reply(400, ['error'=>'Please wait a moment and try again.']); }
foreach (['name','email','subject','message'] as $field) { if (!is_string($input[$field] ?? null)) { reply(422, ['error'=>'Please complete all message fields.']); } }
$name = trim($input['name']); $email = trim($input['email']); $subject = trim($input['subject']); $message = trim($input['message']);
if ($name === '' || strlen($name) > 160 || preg_match('/[\r\n]/', $name) || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 254 || !in_array($subject, ['Classes and enrollment','EPS practice','General inquiry'], true) || strlen($message) < 10 || strlen($message) > 8000) { reply(422, ['error'=>'Enter your name, a valid email address, and a message of 10–8000 characters.']); }
// Limit submission attempts per IP without storing message contents or raw IPs.
$key = hash_hmac('sha256', $_SERVER['REMOTE_ADDR'] ?? 'unknown', $cfg['rate_limit_salt']);
$file = sys_get_temp_dir() . '/kaja-contact-' . $key . '.json';
$handle = fopen($file, 'c+');
if (!$handle || !flock($handle, LOCK_EX)) { reply(503, ['error'=>'Please try again later, or email Kaja directly.']); }
@chmod($file, 0600);
$times = json_decode(stream_get_contents($handle), true);
$now = time(); $times = array_values(array_filter(is_array($times) ? $times : [], static function ($value) use ($now) { return is_int($value) && $value > $now - 3600; }));
if (count($times) >= 5 || ($times && $now - end($times) < 60)) { flock($handle, LOCK_UN); fclose($handle); reply(429, ['error'=>'Please wait before sending another message. You can also email Kaja directly.']); }
$times[] = $now; rewind($handle); ftruncate($handle, 0); fwrite($handle, json_encode($times)); fflush($handle); flock($handle, LOCK_UN); fclose($handle);
session_write_close();
require_once __DIR__ . '/vendor/PHPMailer/src/Exception.php';
require_once __DIR__ . '/vendor/PHPMailer/src/PHPMailer.php';
require_once __DIR__ . '/vendor/PHPMailer/src/SMTP.php';
try {
 $mail = new \PHPMailer\PHPMailer\PHPMailer(true);
 $mail->isSMTP(); $mail->Host = $cfg['smtp_host']; $mail->SMTPAuth = true;
 $mail->Username = $cfg['smtp_username']; $mail->Password = $cfg['smtp_password'];
 $mail->SMTPSecure = $cfg['smtp_security'] === 'ssl' ? \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS : \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
 $mail->Port = (int)($cfg['smtp_port'] ?? 587); $mail->Timeout = 20;
 $mail->CharSet = 'UTF-8'; $mail->SMTPDebug = 0;
 $mail->setFrom($cfg['from_email'], 'Kaja Language Tutorial Center');
 $mail->addAddress('kajalanguagecenter@gmail.com');
 $mail->addReplyTo($email, $name);
 $mail->Subject = 'Website inquiry: ' . $subject;
 $mail->Body = "Name: {$name}\nEmail: {$email}\nTopic: {$subject}\n\n{$message}\n\nSent from the Kaja website contact form.";
 $mail->send();
 reply(200, ['ok'=>true]);
} catch (\Throwable $error) {
 // Do not expose SMTP credentials, server errors, or the visitor's message.
 error_log('Kaja contact delivery failed. Check private SMTP configuration and provider logs.');
 reply(502, ['error'=>'Your message could not be sent. Your text is still here; please try again later or use the email link below.']);
}
