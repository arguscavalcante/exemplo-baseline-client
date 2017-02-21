'use strict';

angular
    .module('starter')
    .controller('configTorreCtrl', ['$scope', '$state', 'Torre',  function($scope, $state, Torre){
        console.log('configTorreCtrl')

        $scope.torre = {};
        $scope.formtorre = {};

        //find, findOne, findById
        function listarTorres(){
            Torre.find().$promise.then(function(res, err){
                $scope.torre = res;
                console.log(res);
            });
            
        }

        listarTorres();

        $scope.ValidaForm = function(){

            if($scope.formtorre.Torre == null || $scope.formtorre.Descricao_Torre == null || $scope.formtorre.Torre.replace(/[\s]/g, '') == '' ||  $scope.formtorre.Descricao_Torre.replace(/[\s]/g, '') == '')
            {
                alert('Favor, preencha todas as informações!');
                return;
            }
            
            angular.forEach($scope.torre,function(value,index){
                if (angular.lowercase(value.Torre).replace(/[\s]/g, '') == angular.lowercase($scope.formtorre.Torre).replace(/[\s]/g, '')){
                    alert('Esse registro já existe.');
                    return;
                }
            })

            Torre.create($scope.formtorre, function(res, err){
                console.log(res);
            })
           
            $state.reload();
        }

    }]);