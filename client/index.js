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