
(function(){
    "use strict";
    var myApp = angular.module('moneyDemo',['moneyHelperModule']);

    myApp.controller('demoController', DemoController);
    DemoController.$inject = ['$scope','moneyHelper'];
    function DemoController($scope, moneyHelper){

        $scope.result = "";
        $scope.amount = "1234.56";
        $scope.cultureInfo = {};
        $scope.cultureInfo.decimalSeparator = ".";
        $scope.cultureInfo.currencySymbol = "$";
        $scope.cultureInfo.thousandsSeparator = ",";
        $scope.cultureInfo.currencyPosition = "l";
        $scope.cultureInfo.precision = '2';

        $scope.selectPositionList = [{value:'l',text:'Left'},{value:'r',text:'Right'}];
        $scope.selectPrecisionList = [{value:'2',text:'2'},{value:'3',text:'3'},{value:'4',text:'4'}];

        $scope.formatCurrency = function(){
            $scope.resultCurrency = moneyHelper.formatCurrency($scope.currencyAmount, $scope.cultureInfo);
        }

        $scope.formatNumber = function(){
            $scope.resultNumber = moneyHelper.formatNumber($scope.numberAmount, $scope.cultureInfo);
        }

        $scope.getValue = function(){
            // Pass culture info for case of "1 234,56"
            $scope.resultGetValue = moneyHelper.getValue($scope.getValueAmount, $scope.cultureInfo);
        }
    };

})();