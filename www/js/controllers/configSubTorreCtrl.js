'use strict';

angular
    .module('starter')
    .controller('configSubTorreCtrl', ['$scope', '$state', 'Torre', 'SubTorre',  function($scope, $state, Torre, SubTorre){
        console.log('configSubTorreCtrl')

        $scope.torre = {};
        $scope.subtorre = {};
        $scope.formsubtorre = {};
        var bool = true;

        //find, findOne, findById
        function selectOptionTorres(){
            Torre.find().$promise.then(function(res, err){
                $scope.torre = res;
                //console.log(res);
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

            if($scope.formsubtorre.Torre_id == null || $scope.formsubtorre.subtorre == null || $scope.formsubtorre.Torre_id.replace(/[\s]/g, '') == '' ||  $scope.formsubtorre.subtorre.replace(/[\s]/g, '') == '')
            {
                alert('Favor, preencha todas as informações!');
                return;
            }
            
            angular.forEach($scope.subtorre, function(value,index){
                if (value.Torre_id == $scope.formsubtorre.Torre_id && angular.lowercase(value.subtorre).replace(/[\s]/g, '') == angular.lowercase($scope.formsubtorre.subtorre.replace(/[\s]/g, ''))){
                    alert('Esse registro já existe.');
                    bool = false;
                }
            })

            if (bool){
                SubTorre.create($scope.formsubtorre, function(res, err){
                    //console.log(res);
                })
            
            }
        
            $state.reload();
        }

    }]);