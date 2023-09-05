<?php

    require_once('db.php');
    require_once('../model/Response.php');

    // handle options request method for CORS VVVVVV
    // if($_SERVER['REQUEST_METHOD'] === 'OPTIONS'){
    //     $response = new Response();
    //     $response->setHttpStatusCode(200);
    //     $response->setSuccess(true);
    //     $response->send();
    //     exit;
    // }
    // handle options request method for CORS ^^^^^^

    if(array_key_exists("sessionid", $_GET)){
    } elseif(empty($_GET)){
        if($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $response = new Response();
            $response->setHttpStatusCode(405);
            $response->setSuccess(false);
            $response->addMessage('Request method not allowed');
            $response->send();
            exit;
        }

        sleep(1); // delays the whole processing by 1 second so hackers can't do brute force dictionary attack

        if($_SERVER['CONTENT_TYPE'] !== 'application/json') {
            $response = new Response();
            $response->setHttpStatusCode(400);
            $response->setSuccess(false);
            $response->addMessage('Content Type header not set to JSON');
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

        if(!isset($jsonData->username) || !isset($jsonData->password)) {
            $response = new Response();
            $response->setHttpStatusCode(400);
            $response->setSuccess(false);
            (!isset($jsonData->username) ? $response->addMessage('Username not supplied') : false);
            (!isset($jsonData->password) ? $response->addMessage('Password not supplied') : false);
            $response->send();
            exit;
        }
    
        // you can insert more password checks here, such as one uppercase, lowercase and number....
        if(strlen($jsonData->username) < 1 || strlen($jsonData->username) > 255 || strlen($jsonData->password) < 1 || strlen($jsonData->password) > 255){
            $response = new Response();
            $response->setHttpStatusCode(400);
            $response->setSuccess(false);
            (strlen($jsonData->username) < 1 ? $response->addMessage('Username cannot be blank') : false);
            (strlen($jsonData->username) > 255 ? $response->addMessage('Username cannot be greater than 255 characters') : false);
            (strlen($jsonData->password) < 1 ? $response->addMessage('Password cannot be blank') : false);
            (strlen($jsonData->password) > 255 ? $response->addMessage('Password cannot be greater than 255 characters') : false);
            $response->send();
            exit;
        }

        try {
            $username = $jsonData->username;
            $password = $jsonData->password;

            $user = $userStore->findOneBy(["username", "=", $username]); //instead of row count

            if (!$user) {
                $response = new Response();
                $response->setHttpStatusCode(401);
                $response->setSuccess(false);
                $response->addMessage('Username or password is incorrect');
                $response->send();
                exit;
            }

            $returned_id = $user['_id'];
            $returned_fullname = $user['fullname'];
            $returned_username = $user['username'];
            $returned_password = $user['password'];
            $returned_useractive = $user['useractive'];
            $returned_loginattempts = $user['loginattempts'];

            if($returned_useractive !== 'Y') {
                $response = new Response();
                $response->setHttpStatusCode(401);
                $response->setSuccess(false);
                $response->addMessage('User account not active');
                $response->send();
                exit;
            }

            if($returned_loginattempts >= 3) {
                $response = new Response();
                $response->setHttpStatusCode(401);
                $response->setSuccess(false);
                $response->addMessage('User account is currently locked out');
                $response->send();
                exit;
            }

            if(!password_verify($password, $returned_password)) {
                $userStore->updateById($returned_id, [ "loginattempts" => $returned_loginattempts + 1 ]);
    
                $response = new Response();
                $response->setHttpStatusCode(401);
                $response->setSuccess(false);
                $response->addMessage('Username or password is incorrect');
                $response->send();
                exit;
            }

            $accesstoken = base64_encode(bin2hex(openssl_random_pseudo_bytes(24)).time());
            $refreshtoken = base64_encode(bin2hex(openssl_random_pseudo_bytes(24)).time());
    
            $access_token_expiry_seconds = 57600;
            $refresh_token_expiry_seconds = 1209600;
        
        }
        catch(PDOException $ex){
            $response = new Response();
            $response->setHttpStatusCode(500);
            $response->setSuccess(false);
            $response->addMessage('There was an issue logging in');
            $response->send();
            exit;
        }
    
        try {

            $userStore->updateById($returned_id, [ "loginattempts" => 0 ]);
            $userStore->updateById($returned_id, [ "loginactivity" => [[
                "accesstoken" => $accesstoken,
                "accesstokenexpiry" => $access_token_expiry_seconds,
                "refreshtoken" => $refreshtoken,
                "refreshtokenexpiry" => $refresh_token_expiry_seconds,
                ]] 
            ]);
    
            $user = $userStore->findOneBy(["username", "=", $username]); //gets updated version
            unset($user["password"]);
            $returnData = array();
            $returnData['user'] = $user;

            $response = new Response();
            $response->setHttpStatusCode(200);
            $response->setSuccess(true);
            $response->addMessage('User retrieved');
            $response->setData($user);
            $response->send();
            exit;
        }
        catch(PDOException $ex) {
            $writeDB->rollBack();
            $response = new Response();
            $response->setHttpStatusCode(500);
            $response->setSuccess(false);
            $response->addMessage('There was an issue logging in - please try again');
            $response->send();
            exit;
        }



    }

?>