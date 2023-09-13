<?php
require_once('autoload.php');
require_once('config.env');
?>  

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="./src/assets/body.css" />
    <link rel="stylesheet" href="./src/assets/snackbar.css" />
    <link rel="stylesheet" href="./src/assets/login.css" />
    <link rel="stylesheet" href="./src/assets/grid.css" />
    <title>K1Pro</title>
    <link rel="icon" type="image/x-icon" href="./src/assets/favicon.ico" />
  </head>
  <body>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <div id="app" v-cloak>
      <div id="snackbar"></div>
      <!-- Example component below: -->
      <!-- <k1pro></k1pro> -->
      <template v-if="accessToken === undefined">
        <div class="content">
          <div class="loginform">
            <div class="square"></div>
            <div class="inputs">
              <label>Username: </label>
              <input type="text" v-model="username" /><br /><br />
              <label>Password: </label>
              <input type="password" v-model="password" /><br /><br />
              <button type="button" @click="loginFunc(loginEndPt)">
                Log In
              </button>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="grid-container">
          <div class="item1">
            <p>Hi <b>{{ userData.FirstName }}</b>,</p>
            <p>Below is your account info:</p>
            <ul>
              <li v-for="(value, key) in userData">{{ key }}: {{ value }}</li>
            </ul>
            <button type="button" @click="logoutFunc(logoutEndPt)">Log Out</button>
            <p></p>
          </div>
          <div class="item2">User Accounts</div>
          <div class="item3">Email</div>  
          <div class="item4">ProSign</div>
          <div class="item5">Newsletters</div>
        </div>
      </template>
    </div>
    <script src="./src/app.js"></script>
  </body>
</html>
