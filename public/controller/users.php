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

    // if($_SERVER['REQUEST_METHOD'] !== 'POST'){
    //     $response = new Response();
    //     $response->setHttpStatusCode(405);
    //     $response->setSuccess(false);
    //     $response->addMessage('Request method not allowed');
    //     $response->send();
    //     exit;
    // }

// handle options request method for CORS VVVVVV
if($_SERVER['REQUEST_METHOD'] === 'OPTIONS'){
    $response = new Response();
    $response->setHttpStatusCode(200);
    $response->setSuccess(true);
    $response->send();
    exit;
}
// handle options request method for CORS ^^^^^^

// begin authentication script
if(!isset($_SERVER['HTTP_AUTHORIZATION']) || strlen($_SERVER['HTTP_AUTHORIZATION']) < 1) {
    $response = new Response();
    $response->setHttpStatusCode(401);
    $response->setSuccess(false);
    (!isset($_SERVER['HTTP_AUTHORIZATION']) ? $response->addMessage('Access token is missing from the header') : false);
    (strlen($_SERVER['HTTP_AUTHORIZATION']) < 1 ? $response->addMessage('Access token cannot be blank') : false);
    $response->send();
    exit();
}

$accessToken = $_SERVER['HTTP_AUTHORIZATION'];
$accessTokenCount = array();
for ($x = 0; $x < 10; $x++) {
    $accessTokenSearch = $userStore
        ->createQueryBuilder()
        ->where( [ "loginactivity.$x.accesstoken", "=", $accessToken ] )
        ->getQuery()
        ->fetch();
    if(!empty($accessTokenSearch)) {
        array_push($accessTokenCount, $accessTokenSearch);
        $accessTokenRow = $x;
    }  
}
// add accounttype validation here too

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
$returned_accesstokenexpiry = $row["loginactivity"][$accessTokenRow]['accesstokenexpiry'];
$returned_useractive = $row['useractive'];
$returned_loginattempts = $row['loginattempts'];

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

    if(!isset($jsonData->fullname) || !isset($jsonData->username) || !isset($jsonData->password)) {
        $response = new Response();
        $response->setHttpStatusCode(400);
        $response->setSuccess(false);
        (!isset($jsonData->fullname) ? $response->addMessage('Full name not supplied') : false);
        (!isset($jsonData->username) ? $response->addMessage('Username not supplied') : false);
        (!isset($jsonData->password) ? $response->addMessage('Password not supplied') : false);
        $response->send();
        exit;
    }

    // you can insert more password checks here, such as one uppercase, lowercase and number....
    if(strlen($jsonData->fullname) < 1 || strlen($jsonData->fullname) > 255 || strlen($jsonData->username) < 1 || strlen($jsonData->username) > 255 || strlen($jsonData->password) < 1 || strlen($jsonData->password) > 255){
        $response = new Response();
        $response->setHttpStatusCode(400);
        $response->setSuccess(false);
        (strlen($jsonData->fullname) < 1 ? $response->addMessage('Full name cannot be blank') : false);
        (strlen($jsonData->fullname) > 255 ? $response->addMessage('Full name cannot be greater than 255 characters') : false);
        (strlen($jsonData->username) < 1 ? $response->addMessage('Username cannot be blank') : false);
        (strlen($jsonData->username) > 255 ? $response->addMessage('Username cannot be greater than 255 characters') : false);
        (strlen($jsonData->password) < 1 ? $response->addMessage('Password cannot be blank') : false);
        (strlen($jsonData->password) > 255 ? $response->addMessage('Password cannot be greater than 255 characters') : false);
        $response->send();
        exit;
    }
    
    $fullname = trim($jsonData->fullname);
    $username = trim($jsonData->username);
    $email = trim($jsonData->email);
    $password = $jsonData->password;
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    $date = new DateTime();

    try{
        $userinfo = [
            "fullname" => $fullname,
            "username" => $username,
            "password" => $hashed_password,
            "email" => $email,
            "useractive" => "Y",
            "accounttype" => "user",
            "loginattempts" => 0,
            "loginactivity" => null,
            "activity" => [
              ["created" => $date->format('Y-m-d\TH:i:sO')]
            ]
           ];
           
        
        if($results = $userStore->insert($userinfo)) {

            $returnData = array();
            $returnData['fullname'] = $fullname;
            $returnData['username'] = $username;
            $returnData['email'] = $email;

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
    //     $query = $writeDB->prepare('select id from tblusers where username = :username');
    //     $query->bindParam(':username', $username, PDO::PARAM_STR);
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

    //     $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    //     $query = $writeDB->prepare('insert into tblusers (fullname, username, password) values (:fullname, :username, :password)');
    //     $query->bindParam(':fullname', $fullname, PDO::PARAM_STR);
    //     $query->bindParam(':username', $username, PDO::PARAM_STR);
    //     $query->bindParam(':password', $hashed_password, PDO::PARAM_STR);
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
    //     $returnData['fullname'] = $fullname;
    //     $returnData['username'] = $username;

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
        if($allusers = $userStore->findAll()){
            $allUsersNoPassword = array();
            foreach ($allusers as $value) {
                unset($value["password"]);
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
        $userid = $_GET['userid'];

        if($user = $userStore->findById($userid)){
            unset($user["password"]);
            $returnData = array();
            $returnData['user'] = $user;
            
    
            $response = new Response();
            $response->setHttpStatusCode(200);
            $response->setSuccess(true);
            $response->addMessage("User retrieved");
            $response->toCache(true);
            $response->setData($returnData);
            $response->send();
            exit;
        }


    }


} elseif ($_SERVER['REQUEST_METHOD'] === 'PATCH') {


} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {

    if(array_key_exists('userid',$_GET)) {

        $userid = $_GET['userid'];

        if($userStore->deleteById($userid)){
            $response = new Response();
            $response->setHttpStatusCode(200);
            $response->setSuccess(true);
            $response->addMessage("Task deleted");
            $response->send();
            exit;
        }
    }
}

?>