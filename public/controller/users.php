<?php

require_once('db.php');
require_once('../model/Response.php');

// try{
//     $writeDB = DB::connectWriteDB();
// }
// catch(PDOException $ex) {
//     error_log('Connection error: '.$ex, 0);
//     $response = new Response();
//     $response->setHttpStatusCode(500);
//     $response->setSuccess(false);
//     $response->addMessage('Database connection error');
//     $response->send();
//     exit;
// }

if($_SERVER['REQUEST_METHOD'] !== 'OPTIONS' && $_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'GET' && $_SERVER['REQUEST_METHOD'] !== 'PATCH' && $_SERVER['REQUEST_METHOD'] !== 'DELETE'){
    $response = new Response();
    $response->setHttpStatusCode(405);
    $response->setSuccess(false);
    $response->addMessage('Request method not allowed');
    $response->send();
    exit;
}

// handle options request method for CORS VVVVVV
if($_SERVER['REQUEST_METHOD'] === 'OPTIONS'){
    $response = new Response();
    $response->setHttpStatusCode(200);
    $response->setSuccess(true);
    $response->send();
    exit;
}
// handle options request method for CORS ^^^^^^

// begin authentication script ---> use REDIRECT_HTTP_AUTHORIZATION instead of HTTP_AUTHORIZATION online
if(!isset($_SERVER[$CUSTOM_AUTHORIZATION]) || strlen($_SERVER[$CUSTOM_AUTHORIZATION]) < 1) {
    $response = new Response();
    $response->setHttpStatusCode(401);
    $response->setSuccess(false);
    (!isset($_SERVER[$CUSTOM_AUTHORIZATION]) ? $response->addMessage('Access token is missing from the header') : false);
    (strlen($_SERVER[$CUSTOM_AUTHORIZATION]) < 1 ? $response->addMessage('Access token cannot be blank') : false);
    $response->send();
    exit();
}

$accessToken = $_SERVER[$CUSTOM_AUTHORIZATION];

$accessTokenCount = array();
for ($x = 0; $x < 10; $x++) {
    $accessTokenSearch = $userStore
        ->createQueryBuilder()
        ->where( [ "LoginActivity.$x.accesstoken", "=", $accessToken ] )
        ->disableCache()
        ->getQuery()
        ->fetch();
    if(!empty($accessTokenSearch)) {
        array_push($accessTokenCount, $accessTokenSearch);
        $accessTokenRow = $x;
    }  
}

if (empty($accessTokenCount)) {
    $response = new Response();
    $response->setHttpStatusCode(401);
    $response->setSuccess(false);
    $response->addMessage('Invalid access token');
    $response->send();
    exit();
}

$row = $accessTokenCount[0][0];

$returned_userid = $row['_id'];
$returned_accounttype = $row['AccountType'];
$returned_accesstokenexpiry = $row["LoginActivity"][$accessTokenRow]['accesstokenexpiry'];
$returned_useractive = $row['UserActive'];
$returned_loginattempts = $row['LoginAttempts'];

if ($returned_useractive !== 'Y') {
    $response = new Response();
    $response->setHttpStatusCode(401);
    $response->setSuccess(false);
    $response->addMessage('User account not active');
    $response->send();
    exit();
}

if($returned_loginattempts >= 3) {
    $response = new Response();
    $response->setHttpStatusCode(401);
    $response->setSuccess(false);
    $response->addMessage('User account is currently locked out');
    $response->send();
    exit();
}

if (strtotime($returned_accesstokenexpiry) < time()){
    $response = new Response();
    $response->setHttpStatusCode(401);
    $response->setSuccess(false);
    $response->addMessage('Access token expired');
    $response->send();
    exit();
}

// end authentication script

if($_SERVER['REQUEST_METHOD'] === 'POST') {

    if($_SERVER['CONTENT_TYPE'] !== 'application/json'){
        $response = new Response();
        $response->setHttpStatusCode(400);
        $response->setSuccess(false);
        $response->addMessage('Content type header not set to JSON');
        $response->send();
        exit;
    }

    $rawPostData = file_get_contents('php://input');

    if(!$jsonData = json_decode($rawPostData)) {
        $response = new Response();
        $response->setHttpStatusCode(400);
        $response->setSuccess(false);
        $response->addMessage('Request body is not valid JSON');
        $response->send();
        exit;
    }

    if(!isset($jsonData->FirstName) || !isset($jsonData->Username) || !isset($jsonData->Password)) {
        $response = new Response();
        $response->setHttpStatusCode(400);
        $response->setSuccess(false);
        (!isset($jsonData->FirstName) ? $response->addMessage('First Name not supplied') : false);
        (!isset($jsonData->Username) ? $response->addMessage('Username not supplied') : false);
        (!isset($jsonData->Password) ? $response->addMessage('Password not supplied') : false);
        $response->send();
        exit;
    }

    // you can insert more Password checks here, such as one uppercase, lowercase and number....
    if(strlen($jsonData->FirstName) < 1 || strlen($jsonData->FirstName) > 255 || strlen($jsonData->Username) < 1 || strlen($jsonData->Username) > 255 || strlen($jsonData->Password) < 1 || strlen($jsonData->Password) > 255 || strlen($jsonData->Email) < 1 || strlen($jsonData->Email) > 255){
        $response = new Response();
        $response->setHttpStatusCode(400);
        $response->setSuccess(false);
        (strlen($jsonData->FirstName) < 1 ? $response->addMessage('First Name cannot be blank') : false);
        (strlen($jsonData->FirstName) > 255 ? $response->addMessage('First Name cannot be greater than 255 characters') : false);
        (strlen($jsonData->Username) < 1 ? $response->addMessage('Username cannot be blank') : false);
        (strlen($jsonData->Username) > 255 ? $response->addMessage('Username cannot be greater than 255 characters') : false);
        (strlen($jsonData->Password) < 1 ? $response->addMessage('Password cannot be blank') : false);
        (strlen($jsonData->Password) > 255 ? $response->addMessage('Password cannot be greater than 255 characters') : false);
        (strlen($jsonData->Email) < 1 ? $response->addMessage('Email cannot be blank') : false);
        (strlen($jsonData->Email) > 255 ? $response->addMessage('Email cannot be greater than 255 characters') : false);
        $response->send();
        exit;
    }
    
    $FirstName = trim($jsonData->FirstName);
    $Username = trim($jsonData->Username);
    $Email = trim($jsonData->Email);
    $Password = $jsonData->Password;
    $Hashed_Password = password_hash($Password, PASSWORD_DEFAULT);
    $date = new DateTime();

    try{
        $userinfo = [
            "FirstName" => $FirstName,
            "Username" => $Username,
            "Password" => $Hashed_Password,
            "Email" => $Email,
            "UserActive" => "Y",
            "AccountType" => "User",
            "LoginAttempts" => 0,
            "LoginActivity" => null,
            "Activity" => [
              ["Created" => $date->format('Y-m-d\TH:i:sO')]
            ]
           ];
           
        
        if($results = $userStore->insert($userinfo)) {

            $returnData = array();
            $returnData['FirstName'] = $FirstName;
            $returnData['Username'] = $Username;
            $returnData['Email'] = $Email;

            $response = new Response();
            $response->setHttpStatusCode(201);
            $response->setSuccess(true);
            $response->addMessage('User Created');
            $response->setData($returnData);
            $response->send();
            exit;
        }

    }
    catch(Exception $ex) {
        error_log('Database query error: '.$ex, 0);
        $response = new Response();
        $response->setHttpStatusCode(500);
        $response->setSuccess(false);
        $response->addMessage('There was an issue creating a user account - please try again');
        $response->send();
        exit;
    }



    // try {
    //     $query = $writeDB->prepare('select id from tblusers where Username = :Username');
    //     $query->bindParam(':Username', $Username, PDO::PARAM_STR);
    //     $query->execute();

    //     $rowCount = $query->rowCount();
        
    //     if($rowCount !== 0) {
    //         $response = new Response();
    //         $response->setHttpStatusCode(409);
    //         $response->setSuccess(false);
    //         $response->addMessage('Username already exists');
    //         $response->send();
    //         exit;
    //     }

    //     $Hashed_Password = password_hash($Password, PASSWORD_DEFAULT);

    //     $query = $writeDB->prepare('insert into tblusers (FirstName, Username, Password) values (:FirstName, :Username, :Password)');
    //     $query->bindParam(':FirstName', $FirstName, PDO::PARAM_STR);
    //     $query->bindParam(':Username', $Username, PDO::PARAM_STR);
    //     $query->bindParam(':Password', $Hashed_Password, PDO::PARAM_STR);
    //     $query->execute();

    //     $rowCount = $query->rowCount();

    //     if($rowCount === 0) {
    //         $response = new Response();
    //         $response->setHttpStatusCode(500);
    //         $response->setSuccess(false);
    //         $response->addMessage('There was an issue creating a user account - please try again');
    //         $response->send();
    //         exit;
    //     }
        
    //     $lastUserID = $writeDB->lastInsertId();

    //     $returnData = array();
    //     $returnData['user_id'] = $lastUserID;
    //     $returnData['FirstName'] = $FirstName;
    //     $returnData['Username'] = $Username;

    //     $response = new Response();
    //     $response->setHttpStatusCode(201);
    //     $response->setSuccess(true);
    //     $response->addMessage('User Created');
    //     $response->setData($returnData);
    //     $response->send();
    //     exit;


    // }
    // catch(PDOException $ex) {
    //     error_log('Database query error: '.$ex, 0);
    //     $response = new Response();
    //     $response->setHttpStatusCode(500);
    //     $response->setSuccess(false);
    //     $response->addMessage('There was an issue creating a user account - please try again');
    //     $response->send();
    //     exit;
    // }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if(empty($_GET)){

        if ($returned_accounttype != "Administrator") {
            $response = new Response();
            $response->setHttpStatusCode(401);
            $response->setSuccess(false);
            $response->addMessage('Not authorized');
            $response->send();
            exit();
        }

        if($allusers = $userStore->findAll()){
            $allUsersNoPassword = array();
            foreach ($allusers as $value) {
                unset($value["Password"]);
                array_push($allUsersNoPassword, $value);
            }
            $userCount = $userStore->count();
            $returnData = array();
            $returnData['rows_returned'] = $userCount;
            $returnData['users'] = $allUsersNoPassword;

            $response = new Response();
            $response->setHttpStatusCode(200);
            $response->setSuccess(true);
            $response->addMessage("Users retrieved");
            $response->setData($returnData);
            $response->send();
            exit;
        }
    } elseif(array_key_exists('userid',$_GET)) {
        // This route is if there is no userid
        $userid = $_GET['userid'];

        if (empty($userid) || $userid == $returned_userid) {
            $user = $userStore->findById($returned_userid);
            unset($user["Password"]);
            $returnData = array();
            $returnData['user'] = $user;

            $response = new Response();
            $response->setHttpStatusCode(200);
            $response->setSuccess(true);
            $response->addMessage("Logged In User retrieved");
            // $response->toCache(true);
            $response->setData($returnData);
            $response->send();
            exit;
        }

        if (!is_numeric($userid)) {
            $response = new Response();
            $response->setHttpStatusCode(400);
            $response->setSuccess(false);
            $response->addMessage("User ID must be numeric");
            $response->send();
            exit;
        }

        if ($returned_accounttype != "Administrator") {
            $response = new Response();
            $response->setHttpStatusCode(401);
            $response->setSuccess(false);
            $response->addMessage('Not authorized');
            $response->send();
            exit();
        }

        if(!$user = $userStore->findById($userid)){
            $response = new Response();
            $response->setHttpStatusCode(404);
            $response->setSuccess(false);
            $response->addMessage('User not found');
            $response->send();
            exit;
        } else {
            unset($user["Password"]);
            $returnData = array();
            $returnData['user'] = $user;
    
            $response = new Response();
            $response->setHttpStatusCode(200);
            $response->setSuccess(true);
            $response->addMessage("User retrieved");
            // $response->toCache(true);
            $response->setData($returnData);
            $response->send();
            exit;
        }
    }


} elseif ($_SERVER['REQUEST_METHOD'] === 'PATCH') {


} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // This endpoint deletes a user
    if(array_key_exists('userid',$_GET)) {

        if ($returned_accounttype != "Administrator") {
            $response = new Response();
            $response->setHttpStatusCode(401);
            $response->setSuccess(false);
            $response->addMessage('Not authorized');
            $response->send();
            exit();
        }

        $userid = $_GET['userid'];

        if(!$userStore->deleteById($userid)) {
            $response = new Response();
            $response->setHttpStatusCode(404);
            $response->setSuccess(false);
            $response->addMessage('User not found');
            $response->send();
            exit;
        }

        $response = new Response();
        $response->setHttpStatusCode(200);
        $response->setSuccess(true);
        $response->addMessage("User deleted");
        $response->send();
        exit;
    }
}

?>