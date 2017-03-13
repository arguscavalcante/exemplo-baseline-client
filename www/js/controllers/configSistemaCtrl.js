'use strict';

angular
    .module('starter')
    .controller('configSistemaCtrl', ['$scope', '$state', 'Sistema', 'Regiao',  function($scope, $state, Sistema, Regiao){
        console.log('configSistemaCtrl')

        $scope.regiao = {};
        $scope.sistema = {};
        $scope.formsistema = {};
        var bool = true;

        //find, findOne, findById
        function selectOptionRegiao(){
            Regiao.find().$promise.then(function(res, err){
                $scope.regiao = res;
                //console.log(res);
            });
            
        }

        selectOptionRegiao();

        //find, findOne, findById
        function listarSistemas(){
            sistema.find().$promise.then(function(res, err){
                $scope.sistema = res;
                console.log(res);
            });
            
        }

        listarSistemas();

        $scope.ValidaForm = function(){

            if($scope.formsistema.Regiao == null || $scope.formsistema.Sistema == null || $scope.formsistema.Regiao.replace(/[\s]/g, '') == '' ||  $scope.formsistema.Sistema.replace(/[\s]/g, '') == '')
            {
                alert('Favor, preencha todas as informações!');
                return;
            }
            
            angular.forEach($scope.sistema, function(value,index){
                if (value.Regiao == $scope.formsistema.Regiao && angular.lowercase(value.Sistema).replace(/[\s]/g, '') == angular.lowercase($scope.formsistema.Sistema.replace(/[\s]/g, ''))){
                    alert('Esse registro já existe.');
                    bool = false;
                }
            })

            if (bool){
                Sistema.create($scope.formsistema, function(res, err){
                    console.log(res);
                })
            
            }
        
            $state.reload();
        }

    }]);