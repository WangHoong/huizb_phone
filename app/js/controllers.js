'use strict';

/* Controllers */

var domain = 'http://192.168.1.251:3000'

HzbApp.controller('loginControllers', function($scope,$http,$location,ipCookie) {
        $scope.submitForm = function(isValid) {
        if (isValid) {
           var account = $scope.account;
           var password = CryptoJS.MD5($scope.password).toString();
           var params = {
            'account': account,
            'password': password
           }
          $http.post(domain + '/api/user/login',params).success(function(result) {
             if (result.recode == 0){
                var user = result.data;
                ipCookie('user',user);
                $location.path('/items');
             }else{
               alert(result.msg);
               return false;
             }
          });
        }
       };
  });

HzbApp.controller('itemsControllers', function($scope,$http,$location,ipCookie) {
         var token = ipCookie('user').token;
         var type = ipCookie('user').category;
         var city = ipCookie('user').citycode;
         var params = {
          'token': token,'type': type,'city': city
         }

         $http.post(domain + '/api/bidding/list',params).success(function(result) {
           if (result.recode == 0){
                $scope.data = result.data;
            }else if (result.recode == -5) {
              ipCookie.remove('user');
              $location.path('/login');
             return alert(result.msg);

           }
         });

});

HzbApp.controller('logoutControllers', function($scope,$location,ipCookie) {
      ipCookie.remove('user');
      $location.path('/login');
});

HzbApp.controller('registerControllers', function($scope,$http,$location) {

      $scope.submitForm = function(isValid) {
        if (isValid) {
           var account = $scope.account;
           var captcha = $scope.captcha;
           var password = CryptoJS.MD5($scope.password).toString();
           var params = {
            'account': account,
            'password': password,
            'captcha': captcha
          }

          $http.post(domain + '/api/user/validation',params).success(function(result) {
             if (result.recode == 0){
               $location.path('/finish');
             }else{
               alert(result.msg);
               return false;
             }
          });
        }
      };
});


HzbApp.controller('finishControllers', function($scope,$http,$location) {
      $scope.submitForm = function(isValid) {
        if (isValid) {
           var account = $scope.account;
           var captcha = $scope.captcha;
           var password = CryptoJS.MD5($scope.password).toString();
           var params = {
            'account': account,
            'password': password,
            'captcha': captcha
          }
          $http.post(domain + '/api/user/create',params).success(function(res) {
             if (res.recode == 0){
               $location.path('/item');
             }else{
               alert(res.msg);
               return false;
             }
          });
        }

      };
});

HzbApp.controller('qdanControllers', function($scope,$http,ipCookie) {
  $scope.delog = function(id) {
      $('#item_id').val(id);
      $('.bosom').show(200);
   };
  $scope.close = function(){
      $('.bosom').hide(200);
  };
  $scope.submit = function(){
    var item_id = $('#item_id').val();
    var token = ipCookie('user').token;
    $http.get(domain + '/api/items/qiang?token='+token+'&id='+item_id).success(function(res) {
       if (res.recode == 0){
          alert(res.msg);
         $('.bosom').hide(200);
       }else{
         alert(res.msg);
         return false;
       }
    });
  }
});

HzbApp.controller('vendorControllers', function($scope,$http,ipCookie) {

    var token = ipCookie('user').token;
    $http.get(domain + '/api/factories/ranking?token='+token).success(function(res) {
       if (res.recode == 0){
           $scope.data = res.data;
       }else{
         alert(res.msg);
         return false;
       }
    });

});


HzbApp.controller('demandsControllers', function($scope,$http,ipCookie) {
    var token = ipCookie('user').token;
    $http.get(domain + '/api/requireds?token='+token).success(function(res) {
       if (res.recode == 0){
           $scope.data = res.data;
       }else{
         return false;
       }
    });

});



HzbApp.controller('user_settingControllers', function($scope,$http,ipCookie) {
    var token = ipCookie('user').token;
    var params = {'token': token}

    var head = ipCookie('user').head;
    if (head){
       $scope.theFile = head;
    } else{
       $scope.theFile = 'images/2x/3.png';
    }

    $http.post(domain + '/api/uptoken',params).success(function(result) {
      if (result.recode == 0){
         var data = result.data;
         var uptoken =  data.uptoken;
        $scope.uptoken = uptoken;
      }else{
        alert(result.msg);
        return false;
      }
    });

    $scope.setFile = function(element) {
        var photofile = element.files[0];
        var reader = new FileReader();

         reader.onload = function(e) {
            $scope.$apply(function($scope) {
                var file = e.target.result;
  					  	$scope.theFile =  file;
                var pic = file.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
                var url = "http://up.qiniu.com/putb64/-1";
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        var str = xhr.responseText;
                        var obj = JSON.parse(str);

                        if (obj.hash) {
                           var image = obj.hash;
                           $http.post(domain + '/api/user/upload_avatar',{'token': token, 'head': image}).success(function(res) {
                             if (res.recode == 0){
                                ipCookie('user',res.data)
                              }else{
                               alert(res.msg);
                               return false;
                             }
                           });
                        }
                    }
                };
                xhr.open("POST", url, true);
                xhr.setRequestHeader("Content-Type", "application/octet-stream");
                xhr.setRequestHeader("Authorization", "UpToken " + $scope.uptoken);
                xhr.send(pic);

            });
				  };

      //  reader.readAsText(photofile);
          reader.readAsDataURL(photofile);

          $(".popup").slideToggle('slow');
     };

});



HzbApp.controller('offersControllers', function($scope,$http,$routeParams,ipCookie) {
    var token = ipCookie('user').token;
    var order_id = $routeParams.id;
    var offer = "offers_"+order_id;
    $scope.order_id = order_id;
    $scope.rate = ipCookie('user').rate;
    var offers = ipCookie(offer)
    if (offers){
      $scope.data = offers;
    }else{
    $http.get(domain + '/api/order/bidding?order_id='+order_id+'&token='+token).success(function(res) {
       if (res.recode == 0){
           ipCookie(offer,res.data);
           $scope.data = res.data;
       }else{
         return false;
       }
    });
  }
});

HzbApp.controller('biddingControllers', function($scope,$routeParams, Reddit) {
  var state = $routeParams.id;
  $scope.state = state;
  $scope.reddit = new Reddit(state);
});

HzbApp.factory('Reddit', function($http,ipCookie) {
  var token = ipCookie('user').token;
  var Reddit = function(state) {
    this.items = [];
    this.busy = false;
    this.state = state;
    this.curpage = 1;
  };

  Reddit.prototype.nextPage = function() {
    if (this.busy) return;
    this.busy = true;
    $http.get(domain + '/api/order/list?state='+this.state+'&token='+token+'&curpage='+this.curpage).success(function(res) {
      if (res.recode == 0){
        var items = res.data.orders;
        for (var i = 0; i < items.length; i++) {
          this.items.push(items[i]);
        }
        this.curpage =  this.curpage + 1;
        this.busy = false;
     }
    }.bind(this));
  };

  return Reddit;
});

HzbApp.controller('editControllers', function($scope,$http,$location,$routeParams,$filter,ipCookie) {
    var token = ipCookie('user').token;
    var id = $routeParams.id;
    var order_id = $routeParams.order_id
    var item_price = $routeParams.price
    $http.get(domain + '/api/order/bidding/detail?id='+id+'&token='+token).success(function(res) {
       if (res.recode == 0){
           $scope.rate = ipCookie('user').rate;
           var key = $routeParams.name;
           $scope.name = key;
          var item = $filter('filter')(res.data.items, {'demand': key})[0];
          var count =  $filter('filter')(res.data.items, {'name': '数量'})[0];
          $scope.item = item;
          $scope.count = count;
          $scope.order_id = order_id;
          $scope.price = item_price;
          //alert($scope.price);
          $scope.SubmitPrice = function(price) {
            var price = parseInt(price);
            var offer = "offers_"+order_id;
            var offers = ipCookie(offer)
            var item = $filter('filter')(offers.items, {'id': id })[0];
            var result = {};
            $scope.objects = [];
            angular.forEach(offers, function(value, key) {
              if (key == 'items'){
                 angular.forEach(offers.items, function(v, k) {
                   if (item.id == v.id ){
                     item.price = price;
                     $scope.price = item.price;
                     $scope.objects.push(item);
                   }else{
                    $scope.objects.push(v);
                   }
                 });

                 Array.prototype.sum = function (prop) {
                  var total = 0
                  for ( var i = 0, _len = this.length; i < _len; i++ ) {
                      total += this[i][prop]
                  }
                   return total
                 }

                 result['items'] = $scope.objects;
                 var sum_price = $scope.objects;
                 result['sum_price'] = sum_price.sum("price");
                 result['tax'] = Math.round(result['sum_price'] * ($scope.rate / 100));
                 result['total_price'] = result['sum_price'] + result['tax']
              }else{
                result[key] = value;
              }
            });
            ipCookie(offer,result);
            $location.path('/offers/'+order_id+'/reback');
          }

          $scope.FetchViewData = function(price) {
           $http.get(domain + '/api/bidding/ask/price?id='+ id +'&token='+token+'&price='+price).success(function(res) {
              if (res.recode == 0){
                if (res.data.result == 3){
                  alert("报价最低");
                }else if (res.data.result == 1){
                  alert("报价最高");
                } else{
                  alert("报价适中");
                }
              }
           });
         };
       }else{
         return false;
       }
    });
});


HzbApp.controller('detailControllers', function($scope,$http,$location,$routeParams,$filter,ipCookie) {

  var token = ipCookie('user').token;
  var id = $routeParams.id;
  var order_id = $routeParams.order_id
  var img_url = $routeParams.img_url;
  $http.get(domain + '/api/order/bidding/detail?id='+id+'&token='+token).success(function(res) {
     if (res.recode == 0){
         $scope.rate = ipCookie('user').rate;
         var key = $routeParams.name;
         $scope.name = key;
         $scope.id = id;
         $scope.order_id = order_id;
         var items = res.data.items;
         var item = $filter('filter')(items, {'demand': key})[0];
         var count =  $filter('filter')(items, {'name': '数量'})[0];
        $scope.items = items;
        $scope.img_url = img_url;
        $scope.price = res.data.price;

        $scope.SubmitPrice = function(price) {
          var price = parseInt(price);
          var offer = "offers_"+order_id;
          var offers = ipCookie(offer)
          var item = $filter('filter')(offers.items, {'id': id })[0];
          var result = {};
          $scope.objects = [];
          angular.forEach(offers, function(value, key) {
            if (key == 'items'){
               angular.forEach(offers.items, function(v, k) {
                 if (item.id == v.id ){
                   item.price = price;
                   $scope.price = item.price;
                   $scope.objects.push(item);
                 }else{
                  $scope.objects.push(v);
                 }
               });

              Array.prototype.sum = function (prop) {
               var total = 0
               for ( var i = 0, _len = this.length; i < _len; i++ ) {
                   total += this[i][prop]
               }
                return total
              }
              result['items'] = $scope.objects;
              var sum_price = $scope.objects;
              result['sum_price'] = sum_price.sum("price");
              result['tax'] = Math.round(result['sum_price'] * ($scope.rate / 100));
              result['total_price'] = result['sum_price'] + result['tax']
            }else{
              result[key] = value;
            }
          });

          ipCookie(offer,result);
          $location.path('/offers/'+order_id+'/reback');
        }

        $scope.FetchViewData = function(price) {
         $http.get(domain + '/api/bidding/ask/price?id='+ id +'&token='+token+'&price='+price).success(function(res) {
            if (res.recode == 0){
              if (res.data.result == 1){
                alert("报价最低");
              }else if (res.data.result == 3){
                alert("报价最高");
              } else{
                alert("报价适中");
              }
            }
         });
       };
     }else{
       return false;
     }
  });

});


HzbApp.controller('user_infoControllers', function($scope,$http,ipCookie,Timeline) {
  var token = ipCookie('user').token;
  $scope.timeline = new Timeline();
  $http.get(domain + '/api/advertisements').success(function(res_ads) {
     if (res_ads.recode == 0){
       $scope.ads = res_ads.data;
     }
  });
});

HzbApp.factory('Timeline', function($http,ipCookie) {
  var token = ipCookie('user').token;
  var user_id = ipCookie('user').user_id;
  var Timeline = function() {
    this.items = [];
    this.busy = false;
    this.type = 1;
    this.curpage = 1;
  };

  Timeline.prototype.nextPage = function() {

    if (this.busy) return;
    this.busy = true;
    $http.get(domain + '/api/user/dynamic/list?user_id='+user_id+'&type='+this.type +'&token='+token+'&curpage='+this.curpage).success(function(res) {
    if (res.recode == 0){
      var items = res.data.items;

      for (var i = 0; i < items.length; i++) {
        this.items.push(items[i]);
      }
       this.quantity = 4;
      this.curpage =  this.curpage + 1;
      this.busy = false;
     }
    }.bind(this));
  };

  return Timeline;
});
