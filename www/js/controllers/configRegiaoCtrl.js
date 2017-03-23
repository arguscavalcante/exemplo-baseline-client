'use strict';

angular
    .module('starter')
    .controller('configRegiaoCtrl', ['$scope', '$state', 'Regiao', 'SubTorre',  function($scope, $state, Regiao, SubTorre){
        console.log('configRegiaoCtrl')

        $scope.regiao = {};
        $scope.subtorre = {};
        $scope.formregiao = {};

        $scope.formregiao.id_regiao = 0;
        $scope.formregiao.sistemas = []
        var bool = true;

        // Alimenta com todas as Regioes
        Regiao.find().$promise.then(function(res, err){
            $scope.regiao = res;
            // console.log(res);
        });

        // Alimenta com todas as Subtorres
        SubTorre.find().$promise.then(function(res, err){
            $scope.subtorre = res;
            console.log(res);
        });

        //Option Familia
        $scope.selectOptionFamilia = function(){
            var options = [];
            angular.forEach($scope.subtorre, function(value,index){
                options.push(value.torre_id + " - " + value.subtorre);
            })

            return options;       
        }

        $scope.ValidaForm = function(){
            // console.log($scope.formregiao);

            if($scope.formregiao.regiao == null || $scope.formregiao.descricao == null || $scope.formregiao.familia == null || $scope.formregiao.familia == '' || $scope.formregiao.regiao.replace(/[\s]/g, '') == '' ||  $scope.formregiao.descricao.replace(/[\s]/g, '') == '')
            {
                alert('Favor, preencha todas as informações!');
                return;
            }
            
            angular.forEach($scope.regiao,function(value,index){
                if (angular.lowercase(value.regiao).replace(/[\s]/g, '') == angular.lowercase($scope.formregiao.regiao).replace(/[\s]/g, '') && value.familia == $scope.formregiao.familia){
                    alert('Esse registro já existe.');
                    bool = false;
                }
            })

            if (bool){
                Regiao.create($scope.formregiao, function(res, err){
                    // console.log(res);
                    $state.reload();
                })
            }
        }

    }]);