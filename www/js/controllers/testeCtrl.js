'use strict';

angular
    .module('starter')
    .controller('testeCtrl', ['$scope', '$state', 'Car', function($scope, $state, Car){
        
        $scope.carro = {};

        //find, findOne, findById
        function listarCarros(){
            Car.find().$promise.then(function(res, err){
                $scope.carro = res;
            });
            
        }

        listarCarros();

    }]);