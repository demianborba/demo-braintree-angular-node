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

  }]);