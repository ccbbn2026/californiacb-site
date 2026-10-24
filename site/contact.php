<?php
// Contact form handler for californiacb.com
$to      = 'email@californiacb.com';
$from    = 'website@californiacb.com';
$thanks  = '/thank-you/';
// Backup copy of every submission, stored outside the public website folder.
$logfile = dirname(__DIR__) . '/website-leads.log';

$ajax = isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] === 'fetch';

function finish($ok, $message, $redirect, $ajax) {
    if ($ajax) {
        header('Content-Type: application/json');
        echo json_encode(array('ok' => $ok, 'message' => $message, 'redirect' => $redirect));
    } else {
        header('Location: ' . $redirect);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { header('Location: /#contact'); exit; }

function field($key, $max) {
    $v = isset($_POST[$key]) ? trim((string)$_POST[$key]) : '';
    $v = str_replace(array("\r", "\0"), '', $v);
    return function_exists('mb_substr') ? mb_substr($v, 0, $max) : substr($v, 0, $max);
}

// Honeypot: real visitors never fill this in.
if (field('website', 200) !== '') { finish(true, '', $thanks, $ajax); }

$name    = str_replace("\n", ' ', field('name', 120));
$email   = str_replace("\n", '', field('email', 160));
$phone   = str_replace("\n", ' ', field('phone', 40));
$type    = str_replace("\n", ' ', field('project-type', 80));
$details = field('details', 5000);

if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    finish(false, 'Please enter your name and a valid email address.', '/?form=error#contact', $ajax);
}

$subject = 'Website inquiry: ' . ($type !== '' ? $type : 'General') . ' - ' . $name;
$body  = "New inquiry from californiacb.com\n\n";
$body .= "Name:         $name\n";
$body .= "Email:        $email\n";
$body .= "Phone:        " . ($phone !== '' ? $phone : '(not given)') . "\n";
$body .= "Project type: $type\n\n";
$body .= "Details:\n$details\n";

$headers  = "From: California Custom Builders Website <$from>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$sent = @mail($to, $subject, $body, $headers, '-f' . $from);

$entry = "=== " . date('Y-m-d H:i:s T') . " | email " . ($sent ? 'sent' : 'FAILED') . " ===\n" . $body . "\n";
$logged = @file_put_contents($logfile, $entry, FILE_APPEND | LOCK_EX) !== false;

if ($sent || $logged) { finish(true, '', $thanks, $ajax); }
finish(false, 'Sorry, something went wrong on our end. Please call (805) 667-7102.', '/?form=error#contact', $ajax);
