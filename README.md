# demo-braintree-angular-node
Transaction sale with Angular Material (server in Node, client with Angular using dropin and custom integration)

### 1. Setup a Braintree Sandbox Account
- Visit [https://www.braintreepayments.com/v.zero](https://www.braintreepayments.com/v.zero)
- Click on `log in` then choose `sandbox`
- Click on `sign up`
- Fill out the form and click on `sign up`
- Check your inbox, open the *Braintree Sandbox Account Creation* message
- Click on the link in the email to finish the sign up process
- Fill out the form and then you will be prompted to provide your phone number
- You will get a *Braintree verification code* via text message
- Type the verification code and click on `confirm`
- Done! Now you have Braintree Sandbox Account up and running.
- To get your credentials, click on `account` then `my user`, scroll down and click on `api keys`
- Under *Private*, click on `view`
- You are now able to get your credentials (the default code sample is shown in *Java*, but you can switch to view it in *.NET*, *Node*, *Perl*, *PHP*, *Python* or *Ruby*)

Sample credentials in Node:

```javascript
var gateway = braintree.connect({
    environment:  braintree.Environment.Sandbox,
 merchantId:   'ffdqc9fyffn7yn2j',
    publicKey:    'qj65nndbnn6qyjkp',
    privateKey:   'a3de3bb7dddf68ed3c33f4eb6d9579ca'
});
```

### Before moving forward
- Make sure you have **Node** installed, if not download+install: [nodejs.org/download](http://nodejs.org/download) *(we need Node.js to write and run our server)*
- Make sure you have **Bower** installed, if not download+install by running `npm install bower -g` *(we need Bower to manage our UI packages such as Angular, Angular-Material and Braintree-web)*
- To check if Node is installed correctly, in terminal, type `node -v`
- To check if Bower is installed correctly, in terminal, type `bower -v`

### 2. Setup a server (sample using Node)
- In your project folder, create a folder called `server`
- Navigate to */server* and type `npm init` to create our project *package.json*
- For this project we will need to install some packages using *npm*, do it with: `npm install body-parser braintree express util --save`
- Your *package.json* will look similar to:

```javascript
{
  "name": "server",
  "version": "1.0.0",
  "description": "A server to process a sale transaction with Braintree",
  "main": "app.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Demian Borba (dborba@paypal.com)",
  "license": "Apache",
  "dependencies": {
    "body-parser": "^1.12.0",
    "braintree": "^1.23.0",
    "express": "^4.12.0",
    "util": "^0.10.3"
  }
}
```

- Create a file named `app.js` and write the code for your server:

```javascript
'use strict';

var util = require('util');
var express = require('express');
var braintree = require('braintree');
var bodyParser = require('body-parser');

/**
 * Instantiate your server and a JSON parser to parse all incoming requests
 */
var app = express();
var jsonParser = bodyParser.json();

/**
 * Instantiate your gateway (update here with your Braintree API Keys)
 */
var gateway = braintree.connect({
    environment:  braintree.Environment.Sandbox,
    merchantId:   '6dr2nwjy8f56mqyt',
    publicKey:    'yxhwjftm8t34rcmg',
    privateKey:   '21fa3101d6721f02312a2503985db88c'
});

/**
 * Enable CORS (http://enable-cors.org/server_expressjs.html)
 * to allow different clients to request data from your server
 */
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/**
 * Route that returns a token to be used on the client side to tokenize payment details
 */
app.post('/api/v1/token', function (request, response) {
  gateway.clientToken.generate({}, function (err, res) {
    if (err) throw err;
    response.json({
      "client_token": res.clientToken
    });
  });
});

/**
 * Route to process a sale transaction
 */
app.post('/api/v1/process', jsonParser, function (request, response) {
  var transaction = request.body;
  gateway.transaction.sale({
    amount: '100',
    paymentMethodNonce: transaction.payment_method_nonce
  }, function (err, result) {
    if (err) throw err;
    console.log(util.inspect(result));
    response.json(result);
  });
});
```

app.listen(3000, function () {
  console.log('Listening on port 3000');
});

- Start your server with `node app`
- Make a test request to check if token in being returned, by opening a new terminal window and typing `curl -X POST http://localhost:3000/api/v1/token`

### 3. Setup a client app (sample using Angular)
- In your project folder, create a folder called `client`
- Navigate to */client* and type `bower init` to create our project *bower.json*
- For this project we will need to install some UI packages using *Bower*, do it with: `bower install angular angular-material braintree-web --save`
- Your *bower.json* will look similar to:

        {
          "name": "client",
          "version": "1.0.0",
          "authors": [
            "Demian Borba <demian.borba@actioncreations.com>"
          ],
          "description": "A client to request a sale transaction with Braintree",
          "main": "index.html",
          "license": "Apache",
          "ignore": [
            "**/.*",
            "node_modules",
            "bower_components",
            "test",
            "tests"
          ],
          "dependencies": {
            "angular": "~1.3.14",
            "angular-material": "~0.8.1",
            "braintree-web": "~2.5.1"
          }
        }

- In your page, create 3 html files: `index.html`, `dropin.html` and `customintegration.html`
- Open `index.html` and write a simple page to have links to `dropin.html` and `customintegration.html`:

        <!DOCTYPE html>
        <html lang="en" ng-app="IndexApp">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
          <title>Demo BH</title>
          <link rel="stylesheet" href="bower_components/angular-material/angular-        material.min.css">
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=RobotoDraft:400,500,700,400italic">
          <link rel="stylesheet" href="styles.css">
        </head>
        <body layout="column" layout-align="top center" ng-controller="IndexController">

          <md-toolbar>
            <div class="md-toolbar-tools">
              <span class="md-flex">Battle Hack Demo</span>
            </div>
          </md-toolbar>

          <md-content>
            <md-list>
              <md-item ng-repeat="sample in samples">
                <md-item-content ng-click="openPage(sample.link)">
                  <div class="md-tile-left">
                    <img ng-src="{{sample.icon}}" alt="{{sample.title}}">
                  </div>
                  <div class="md-tile-content">
                    <h3><strong>{{sample.title}}</strong></h3>
                    <h4>{{sample.description}}</h4>
                    <p>Tap to view this sample.</p>
                  </div>
                </md-item-content>
                <md-divider></md-divider>
              </md-item>
            </md-list>
          </md-content>

          <!-- Angular Material Dependencies -->
          <script src="bower_components/angular/angular.min.js"></script>
          <script src="bower_components/angular-animate/angular-animate.min.js"></script>
          <script src="bower_components/angular-aria/angular-aria.min.js"></script>
          <script src="bower_components/angular-material/angular-material.min.js"></script>
          <!-- Project-specific Angular code -->
          <script src="index.js"></script>
        </body>
        </html>

- Then write the Angular code for your `index.html` page in a file called `index.js`:

        angular.module('IndexApp', ['ngMaterial'])
          .config(function ($mdThemingProvider) {
            $mdThemingProvider.theme('default')
              .primaryPalette('blue-grey');
          })
          .controller('IndexController', ['$scope', function ($scope) {
            $scope.samples = [
              {
                icon: 'dropin.png',
                title: 'Dropin Sample',
                description: 'A client to request a sale transaction with Braintree using Dropin',
                link: 'dropin.html'
              },
              {
                icon: 'customintegration.png',
                title: 'Custom Integration Sample',
                description: 'A client to request a sale transaction with Braintree using Custom Integration',
                link: 'customintegration.html'
              }
            ];
            $scope.openPage = function (page) {
              window.location.href = page;
            };
          }]);

- To make things prettier, create a file called `styles.css` with some css:

        md-content {   height: 100%; }
        md-item-content { cursor: pointer; }
        img { padding: 15px; height: 100px; }
        md-content { height: 100%; }
        md-whiteframe { padding: 5px 20px; }
        .dropin-container { width: 100%; }
        form { width: 100%; padding: 0 10px 35px 10px; }
        .md-button { margin: 30px 0 0 0; width: 100%; padding: 15px; }
        md-input-container { width: 100%; }
        md-progress-linear { padding: 10px; }
        .error { background: #e03b3b; color: #fff; }
        .success { background: #2db441; color: #fff; }

#### 3.1 Setting up a client app using v.zero's Dropin
- The code for `dropin.html` is:

        <!DOCTYPE html>
        <html lang="en" ng-app="DropinApp">

        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
          <title>Demo BH - Dropin</title>
          <link rel="stylesheet" href="bower_components/angular-material/angular-material.min.css">
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=RobotoDraft:400,500,700,400italic">
          <link rel="stylesheet" href="styles.css">
        </head>

        <body layout="column" layout-align="top center" ng-controller="DropinController">

          <md-toolbar>
            <div class="md-toolbar-tools">
              <span class="md-flex">Battle Hack Demo : Dropin Sample</span>
            </div>
          </md-toolbar>

          <md-content class="md-padding">

            <md-whiteframe class="md-whiteframe-z1" layout="column" layout-align="center center" ng-class="{error: isError, success: isPaid}">

              <span><p ng-bind="message"></p></span>

              <div class="dropin-container" ng-show="showDropinContainer">

                <form name="payment">
                  <md-input-container>
                    <label>Amount (XX.XX)</label>
                    <input type="number" ng-model="amount"/>
                  </md-input-container>

                  <!-- Add Dropin here -->
                  <div id="checkout"></div>

                  <md-button class="md-raised md-primary" type="submit">Pay Now</md-button>
                </form>
              </div>

            </md-whiteframe>

          </md-content>

          <!-- Braintree Web -->
          <script src="bower_components/braintree-web/dist/braintree.js"></script>
          <!-- Angular Material Dependencies -->
          <script src="bower_components/angular/angular.min.js"></script>
          <script src="bower_components/angular-animate/angular-animate.min.js"></script>
          <script src="bower_components/angular-aria/angular-aria.min.js"></script>
          <script src="bower_components/angular-material/angular-material.min.js"></script>
          <!-- Project-specific Angular code -->
          <script src="dropin.js"></script>
        </body>

        </html>

- The code for `dropin.js` is:

        angular.module('DropinApp', ['ngMaterial'])
          .config(function ($mdThemingProvider) {
            $mdThemingProvider.theme('default')
              .primaryPalette('blue-grey');
          })
          .controller('DropinController', ['$scope', '$http', function ($scope, $http) {

            $scope.message = 'Please use the form below to pay:';
            $scope.showDropinContainer = true;
            $scope.isError = false;
            $scope.isPaid = false;

            $scope.getToken = function () {

              $http({
                method: 'POST',
                url: 'http://localhost:3000/api/v1/token'
              }).success(function (data) {

                console.log(data.client_token);

                braintree.setup(data.client_token, 'dropin', {
                  container: 'checkout',
                  // Form is not submitted by default when paymentMethodNonceReceived is implemented
                  paymentMethodNonceReceived: function (event, nonce) {

                    $scope.message = 'Processing your payment...';
                    $scope.showDropinContainer = false;

                    $http({
                      method: 'POST',
                      url: 'http://localhost:3000/api/v1/process',
                      data: {
                        amount: $scope.amount,
                        payment_method_nonce: nonce
                      }
                    }).success(function (data) {

                      console.log(data.success);

                      if (data.success) {
                        $scope.message = 'Payment authorized, thanks.';
                        $scope.showDropinContainer = false;
                        $scope.isError = false;
                        $scope.isPaid = true;

                      } else {
                        // implement your solution to handle payment failures
                        $scope.message = 'Payment failed: ' + data.message + ' Please refresh the page and try again.';
                        $scope.isError = true;
                      }

                    }).error(function (error) {
                      $scope.message = 'Error: cannot connect to server. Please make sure your server is running.';
                      $scope.showDropinContainer = false;
                      $scope.isError = true;
                    });

                  }
                });

              }).error(function (error) {
                $scope.message = 'Error: cannot connect to server. Please make sure your server is running.';
                $scope.showDropinContainer = false;
                $scope.isError = true;
              });

            };

            $scope.getToken();

          }]);

#### 3.2 Setting up a client app using v.zero's Custom Integration
- The code for `customintegration.html` is:

        <!DOCTYPE html>
        <html lang="en" ng-app="CustomIntegrationApp">

        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
          <title>Demo BH - Dropin</title>
          <link rel="stylesheet" href="bower_components/angular-material/angular-material.min.css">
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=RobotoDraft:400,500,700,400italic">
          <link rel="stylesheet" href="styles.css">
        </head>

        <body layout="column" layout-align="top center" ng-controller="CustomIntegrationController">

          <md-toolbar>
            <div class="md-toolbar-tools">
              <span class="md-flex">Battle Hack Demo : Custom Integration Sample</span>
            </div>
          </md-toolbar>

          <md-content class="md-padding">

            <!-- Custom integration here -->

            <md-whiteframe class="md-whiteframe-z1" layout="column" layout-align="center center" ng-class="{error: isError, success: isPaid}">

              <span><p ng-bind="message"></p></span>

              <form name="payment" ng-submit="processPayment()" ng-show="showForm">
                <md-input-container>
                  <label>Amount (X.XX)</label>
                  <input type="number" ng-model="amount"/>
                </md-input-container>
                <md-input-container>
                  <label>Credit Card Number (XXXX XXXX XXXX XXXX)</label>
                  <input type="number" ng-model="creditCardNumber"/>
                </md-input-container>
                <md-input-container>
                  <label>Expiration Date (MM/YY)</label>
                  <input type="text" ng-model="expirationDate"/>
                </md-input-container>
                <md-button class="md-raised md-primary" type="submit">Pay Now</md-button>
              </form>

            </md-whiteframe>

          </md-content>

          <!-- Braintree Web -->
          <script src="bower_components/braintree-web/dist/braintree.js"></script>
          <!-- Angular Material Dependencies -->
          <script src="bower_components/angular/angular.min.js"></script>
          <script src="bower_components/angular-animate/angular-animate.min.js"></script>
          <script src="bower_components/angular-aria/angular-aria.min.js"></script>
          <script src="bower_components/angular-material/angular-material.min.js"></script>
          <!-- Project-specific Angular code -->
          <script src="customintegration.js"></script>
        </body>

        </html>

- The code for `customintegration.js` is

        angular.module('CustomIntegrationApp', ['ngMaterial'])
          .config(function ($mdThemingProvider) {
            $mdThemingProvider.theme('default')
              .primaryPalette('blue-grey');
          })
          .controller('CustomIntegrationController', ['$scope', '$http', function ($scope, $http) {

            $scope.message = 'Please use the form below to pay:';

            $scope.message = 'Please use the form below to pay:';
            $scope.isError = false;
            $scope.isPaid = false;
            $scope.showForm = true;

            $scope.processPayment = function () {

              $scope.message = 'Processing payment...';
              $scope.showForm = false;

              // send request to get token, then use the token to tokenize credit card info and process a transaction
              $http({
                method: 'POST',
                url: 'http://localhost:3000/api/v1/token'
              }).success(function (data) {

                // create new client and tokenize card
                var client = new braintree.api.Client({clientToken: data.client_token});
                client.tokenizeCard({
                  number: $scope.creditCardNumber,
                  expirationDate: $scope.expirationDate
                }, function (err, nonce) {

                  $http({
                    method: 'POST',
                    url: 'http://localhost:3000/api/v1/process',
                    data: {
                      amount: $scope.amount,
                      payment_method_nonce: nonce
                    }
                  }).success(function (data) {

                    console.log(data.success);
                    $scope.showForm = false;

                    if (data.success) {
                      $scope.message = 'Payment authorized, thanks.';
                      $scope.isError = false;
                      $scope.isPaid = true;

                    } else {
                      // implement your solution to handle payment failures
                      $scope.message = 'Payment failed: ' + data.message + ' Please refresh the page and try again.';
                      $scope.isError = true;
                    }

                  }).error(function (error) {
                    $scope.message = 'Error: cannot connect to server. Please make sure your server is running.';
                    $scope.isError = true;
                    $scope.showForm = false;
                  });

                });

              }).error(function (error) {
                $scope.message = 'Error: cannot connect to server. Please make sure your server is running.';
                $scope.isError = true;
                $scope.showForm = false;
              });

            };

          }]);# demo-braintree-angular-node
