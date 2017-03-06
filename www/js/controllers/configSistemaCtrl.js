'use strict';

angular
    .module('starter')
    .controller('configSistemaCtrl', ['$scope', '$state', 'Torre', 'SubTorre',  function($scope, $state, Torre, SubTorre){
        console.log('configSistemaCtrl')

        $scope.torre = {};
        $scope.subtorre = {};
        $scope.formsubtorre = {};
        var bool = true;

        //find, findOne, findById
        function selectOptionTorres(){
            Torre.find().$promise.then(function(res, err){
                $scope.torre = res;
                console.log(res);
            });
            
        }

        selectOptionTorres();

        //find, findOne, findById
        function listarSubTorres(){
            SubTorre.find().$promise.then(function(res, err){
                $scope.subtorre = res;
                console.log(res);
            });
            
        }

        listarSubTorres();

        $scope.ValidaForm = function(){

            if($scope.formsubtorre.Torre_id == null || $scope.formsubtorre.Subtorre == null || $scope.formsubtorre.Torre_id.replace(/[\s]/g, '') == '' ||  $scope.formsubtorre.Subtorre.replace(/[\s]/g, '') == '')
            {
                alert('Favor, preencha todas as informações!');
                return;
            }
            
            angular.forEach($scope.subtorre, function(value,index){
                if (value.Torre_id == $scope.formsubtorre.Torre_id && angular.lowercase(value.Subtorre).replace(/[\s]/g, '') == angular.lowercase($scope.formsubtorre.Subtorre.replace(/[\s]/g, ''))){
                    alert('Esse registro já existe.');
                    bool = false;
                }
            })

            if (bool){
                SubTorre.create($scope.formsubtorre, function(res, err){
                    console.log(res);
                })
            
            }
        
            $state.reload();
        }

    }]);