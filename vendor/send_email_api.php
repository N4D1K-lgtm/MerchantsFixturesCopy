<?php
// Include PHPMailer library
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require 'autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();
$apiKey = $_ENV['API_KEY'];
$smtp_email = $_ENV['SMTP_EMAIL'];
$smtp_pswd = $_ENV['SMTP_PSWD'];
$smtp_host = $_ENV['SMTP_HOST'];
$smtp_port = $_ENV['SMTP_PORT'];
$smtp_encr = $_ENV['SMTP_ENCR'];
$smtp_auth = $_ENV['SMTP_AUTH'];
$return_msg = "";

header("Access-Control-Allow-Methods: POST");
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');

// Set up your API endpoint and method (POST)
$endpoint = '/send-email';
$method = 'POST';
$auth = false;


// Get the request body
$request_body = file_get_contents('php://input');
// Convert JSON request body to array
$data = json_decode($request_body, true);

if ($data['api-key'] == $apiKey) {
    $auth = true;
} 

// Check for API key
if (empty($data['api-key']) || $data['api-key'] !== $apiKey) {
    http_response_code(401);
    echo 'Error: Invalid API key';
    $auth = false;
    exit;
} else {
    $auth = true;
}
// Continue with API code

if ($auth) {
  // Check if the request is for your endpoint and method
  if ($_SERVER['REQUEST_URI'] === $endpoint && $_SERVER['REQUEST_METHOD'] === $method) {

      // Set up the PHPMailer instance
      $mail = new PHPMailer(true);
      try {
          //Server settings
          $mail->isSMTP();                    // Send using SMTP
          $mail->Host       = $smtp_host;     // Set the SMTP server to send through
          $mail->SMTPAuth   = $smtp_auth;     // Enable SMTP authentication
          $mail->Username   = $smtp_email;    // SMTP username
          $mail->Password   = $smtp_pswd;     // SMTP password
          $mail->SMTPSecure = $smtp_encr;      // Enable TLS encryption; `PHPMailer::ENCRYPTION_SMTPS` encouraged
          $mail->Port       = $smtp_port;     // TCP port to connect to, use 465 for `PHPMailer::ENCRYPTION_SMTPS` above

          //Recipients
          $mail->setFrom($smtp_email, 'Merchants Fixture 3D Designer');
          $mail->addAddress('quotes@merchantsfixture.com', 'Merchants Fixture 3D Designer');
          $mail->addAddress('qthrom@merchantsfixture.com ', 'Quinton Throm');
          //$mail->addAddress('colin@simpaticodesignstudio.com', 'Colin Burch');
          $mail->addBCC('colin@simpaticodesignstudio.com', 'Colin Burch');
          //$mail->addAddress($data['email'], $data['name']);           // Add a recipient

          // Subject
          $mail->Subject = '3D Design Quote Request: '.  $data['name'];

          $phone = $data['phone'];
          $address = $data['address'];
          $address = $data['address'];
          $where = $data['where'];
          $comments = $data['comments'];
          $formFillersQuantity = $data['formFillersQuantity'];
          $formBackSplashLength = $data['formBackSplashLength'];
          $formCoveBase = $data['formCoveBase'];
          $formCountertopOverhang = $data['formCountertopOverhang'];

          $body = 'New design request from '. $data['name'].' ('.$data['email'].')<br><br>';
          if ($phone){
            $body .= '<strong>Phone: </strong>'. $data['phone'].'<br>';
          }
          if ($address){
            $body .= '<strong>Address: </strong>'. $data['address'].'<br>';
          }
          if ($where){
            $body .= '<strong>Where did you here about us? </strong>'. $where.'<br>';
          }
          if ($comments){
            $body .= '<strong>Comments/Questions: </strong>'. $comments.'<br>';
          }
          if ($formFillersQuantity){
            $body .= '<strong>Does this project require any fillers? (Quantity): </strong>'. $formFillersQuantity.'<br>';
          }
          if ($formBackSplashLength){
            $body .= '<strong>Does this project require extra backsplash? (Length): </strong>'. $formBackSplashLength.'<br>';
          }
          if ($formCoveBase){
            $body .= '<strong>Does this project require cove base? (Length)</strong>'. $formCoveBase.'<br>';
          }
          if ($formCountertopOverhang){
            $body .= '<strong>Does this project require additional countertop overhang? (Length): </strong>'. $formCountertopOverhang.'<br>';
          }

          // Message body
          $mail->isHTML(true);                             // Set email format to HTML
          $mail->Body = $body;
          $mail->AltBody = strip_tags($body);              // Plain text message in case the recipient email client doesn't support HTML

          // Screenshot Attachment
          if (!empty($data['screenshot'])) {
            $imageData = $data['screenshot']['value'];
            $imgName = $data['screenshot']['filename'];
            $filePath = '/usr/home/dave567/public_html/hosted/merchantsfixture/customer_3d_files/' . $imgName; // Set the file path

            // Remove the "data:image/png;base64," prefix from the image data
            $imageData = str_replace('data:image/png;base64,', '', $imageData);
            
            // Convert the base64-encoded image data to binary data
            $imageData = base64_decode($imageData);
    
            // Save the image data to a file on the server
            if (file_put_contents($filePath, $imageData)) {
                $mail->addAttachment($filePath,$imgName,'base64','image/png');
                // Return a success message
                $return_msg .= 'Screenshot PNG file saved successfully as ' . $imgName .'/n';
            } else {
                // Return an error message if the file could not be saved
                http_response_code(500);
                $return_msg .= 'Error: Screenshot ('.$imgName.') could not be saved/n';
            }

          }

          // 3D JSON Attachment
          if (!empty($data['json_file'])) {
            // Convert the JSON data to a formatted string
            $formattedJsonData = $data['json_file']['value'];


            // Set the file name & path
            $jsonName = $data['json_file']['filename'];
            $jsonPath = '/usr/home/dave567/public_html/hosted/merchantsfixture/customer_3d_files/' . $jsonName; 
    
            // Save the image data to a file on the server
            if (file_put_contents($jsonPath, $formattedJsonData)) {
                $mail->addAttachment($jsonPath,$jsonName,'base64','image/json');
                // Return a success message
                $return_msg .= '3D Object File saved successfully as ' . $jsonName .'/n';
            } else {
                // Return an error message if the file could not be saved
                http_response_code(500);
                $return_msg .= 'Error: Screenshot ('.$imgName.') could not be saved/n';
            }

          }

          $mail->send();
          $return_msg .= 'Message has been sent';
      } catch (Exception $e) {
          $return_msg .= "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
      }

  } else {
      // Return an error message for requests to other endpoints or methods
      http_response_code(404);
      $return_msg .= 'Error: Endpoint not found or invalid request method<br>';

  }
  echo $return_msg;
}
