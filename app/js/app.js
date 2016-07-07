'use strict';

/* App Module */

var HzbApp = angular.module('HzbApp',['ngRoute','ipCookie','infinite-scroll']);

HzbApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/login', {templateUrl: 'views/login.html', controller: 'loginControllers',
      resolve: {
            app: function(ipCookie) {
               if (!ipCookie('user')){
                   ipCookie.remove('user');
                 }
            }
          }}).
      when('/register', {templateUrl: 'views/register.html', controller: 'registerControllers'}).
      when('/finish', {templateUrl: 'views/finish.html', controller: 'finishControllers'}).
      when('/recover', {templateUrl: 'views/register.html', controller: 'recoverControllers'}).
      when('/items', {templateUrl: 'views/items.html',   controller: 'itemsControllers',
      resolve: {
            app: function($location,ipCookie) {
              console.log(ipCookie('user'));
               if (!ipCookie('user')){
                   ipCookie.remove('user');
                   $location.path('/login');
                 }
            }
          }
       }).
      when('/logout', {templateUrl: 'views/login.html', controller: 'logoutControllers'}).
      when('/vendor', {templateUrl: 'views/vendor.html', controller: 'vendorControllers',
      resolve: {
            app: function($location,ipCookie) {
               if (!ipCookie('user')){
                   ipCookie.remove('user');
                   $location.path('/login');
                 }
            }
          }
    }).
      when('/user_info', {templateUrl: 'views/user_info.html', controller: 'user_infoControllers',
      resolve: {
            app: function($location,ipCookie) {
               if (!ipCookie('user')){
                   ipCookie.remove('user');
                   $location.path('/login');
                 }
            }
          }
    }).
      when('/bidding/:id',{templateUrl: 'views/bidding.html', controller: 'biddingControllers',
      resolve: {
            app: function($location,ipCookie) {
               if (!ipCookie('user')){
                   ipCookie.remove('user');
                   $location.path('/login');
                 }
            }
          }
        }).
      when('/demands', {templateUrl: 'views/demands.html', controller: 'demandsControllers'}).
      when('/offers/:order_id/demand/:id', {templateUrl: 'views/offers/demand.html', controller: 'detailControllers'}).
      when('/offers/:order_id/edit/:id', {templateUrl: 'views/offers/edit.html', controller: 'editControllers'}).
      when('/offers/:id', {templateUrl: 'views/offers/show.html', controller: 'offersControllers'}).
      when('/offers/:id/reback', {templateUrl: 'views/offers/reback.html', controller: 'offersControllers'}).
      when('/user_setting', {templateUrl: 'views/user_setting.html', controller: 'user_settingControllers',resolve: {
            app: function($location,ipCookie) {
               if (!ipCookie('user')){
                   ipCookie.remove('user');
                   $location.path('/login');
                 }
            }
          }
        }).
      when('/upload_avatar', {templateUrl: 'views/upload_avatar.html', controller: 'upload_avatarControllers'}).
      otherwise({redirectTo: '/login'});
}]);
