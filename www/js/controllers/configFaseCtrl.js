'use strict';

angular
    .module('starter')
    .controller('configFaseCtrl', ['$scope', '$state', 'Fase',  function($scope, $state, Fase){
        console.log('configFaseCtrl')

        $scope.fase = {};
        $scope.formfase = {};
        var bool = true;

        //find, findOne, findById
        function listarFases(){
            Fase.find().$promise.then(function(res, err){
                $scope.fase = res;
                console.log(res);
            });
            
        }

        listarFases();

        $scope.ValidaForm = function(){

            if($scope.formfase.Fase == null || $scope.formfase.Descricao == null || $scope.formfase.Fase.replace(/[\s]/g, '') == '' ||  $scope.formfase.Descricao.replace(/[\s]/g, '') == '')
            {
                alert('Favor, preencha todas as informações!');
                return;
            }
            
            angular.forEach($scope.Fase,function(value,index){
                if (angular.lowercase(value.Fase).replace(/[\s]/g, '') == angular.lowercase($scope.formfase.Fase).replace(/[\s]/g, '')){
                    alert('Esse registro já existe.');
                    bool = false;
                }
            })

            if (bool){
                Fase.create($scope.formfase, function(res, err){
                    console.log(res);
                })
            }

            $state.reload();
        }

    }]);