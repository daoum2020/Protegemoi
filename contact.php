<?php
// Simple PHP contact form handler
header('Content-Type: application/json');
if($_SERVER['REQUEST_METHOD'] !== 'POST'){
  http_response_code(405);
  echo json_encode(['ok'=>false,'error'=>'Method not allowed']); exit;
}
$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$message = $_POST['message'] ?? '';
if(!$email || !$message){
  http_response_code(400);
  echo json_encode(['ok'=>false,'error'=>'Missing fields']); exit;
}
$to = getenv('CONTACT_TO') ?: 'you@example.com';
$subject = 'Contact form - '.($name ?: 'Anonymous');
$headers = 'From: '.$email . "\r\n" . 'Reply-To: '.$email . "\r\n";
if(mail($to, $subject, $message, $headers)){
  echo json_encode(['ok'=>true]);
}else{
  http_response_code(500);
  echo json_encode(['ok'=>false,'error'=>'Mailer failed']);
}
?>
