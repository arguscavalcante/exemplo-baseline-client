'use strict';

angular
    .module('starter')
    .controller('configRegiaoCtrl', ['$scope', '$state', 'Regiao',  function($scope, $state, Regiao){
        console.log('configRegiaoCtrl')

        $scope.regiao = {};
        $scope.formregiao = {};
        $scope.formregiao.Sistemas = []
        var bool = true;

        //find, findOne, findById
        function listarRegioes(){
            Regiao.find().$promise.then(function(res, err){
                $scope.regiao = res;
                console.log(res);
            });
            
        }

        listarRegioes();

        $scope.ValidaForm = function(){

            if($scope.formregiao.Regiao_id == null || $scope.formregiao.Descricao == null || $scope.formregiao.Regiao_id.replace(/[\s]/g, '') == '' ||  $scope.formregiao.Descricao.replace(/[\s]/g, '') == '')
            {
                alert('Favor, preencha todas as informações!');
                return;
            }
            
            angular.forEach($scope.regiao,function(value,index){
                if (angular.lowercase(value.Regiao_id).replace(/[\s]/g, '') == angular.lowercase($scope.formregiao.Regiao_id).replace(/[\s]/g, '')){
                    alert('Esse registro já existe.');
                    bool = false;
                }
            })

            if (bool){
                Regiao.create($scope.formregiao, function(res, err){
                    console.log(res);
                })
            }

            $state.reload();
        }

    }]);