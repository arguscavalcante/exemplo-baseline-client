'use strict';

angular
    .module('starter')
    .controller('alteraprojCtrl', ['$scope', '$state', 'SubTorre', 'Projeto',  function($scope, $state, SubTorre, Projeto){
        console.log('alteraprojCtrl')

        $scope.subtorre = {};
        $scope.projeto = {};
        $scope.tabela = {};
        $scope.formtorre = {};
        var user = {};
        user = {
            //torre: 'Torre I',
            subtorre: 'TESTE',
            torre: 'Torre 0',
            //subtorre: 'Subtorre X',
            perfil: 'Admin'
        }
        var bool = true;

        //find, findOne, findById
        function listarSubTorres(){
            SubTorre.find().$promise.then(function(res, err){
                $scope.subtorre = res;
                console.log(res);
            });
            
        }

        listarSubTorres();

        //Alimentar Option
        $scope.selectOptionFamilia = function(){
            var options = [];
            angular.forEach($scope.subtorre, function(value,index){
                if(user.torre == 'Torre 0'){
                    if(user.subtorre == 'Subtorre 0'){
                        options.push(value.Torre_id + " - " + value.Subtorre);
                    } else{
                        if(user.subtorre == value.Subtorre){
                            options.push(value.Torre_id + " - " + value.Subtorre);
                        }
                    }
                } else if(user.subtorre == 'Subtorre 0'){
                        if(user.torre == value.Torre_id){
                            options.push(value.Torre_id + " - " + value.Subtorre);
                        } 
                } else {
                        if(user.torre == value.Torre_id && user.subtorre == value.Subtorre){
                            options.push(value.Torre_id + " - " + value.Subtorre);
                        }
                    }
            })

            return options;       
        }

        function alimentaObjProj(){
            Projeto.find().$promise.then(function(res, err){
                $scope.projeto = res;
                //console.log(res);
            });
        }

        alimentaObjProj();

        $scope.filtraResultado = function(){
            alert($scope.filtroResult);
            angular.forEach($scope.projeto, function (value, index) {
                if(value.familia == $scope.filtroResult){
                    $scope.tabela.push(value);
                }
            });
        }

        $scope.ValidaForm = function(){

            if($scope.formtorre.Torre == null || $scope.formtorre.Descricao_Torre == null || $scope.formtorre.Torre.replace(/[\s]/g, '') == '' ||  $scope.formtorre.Descricao_Torre.replace(/[\s]/g, '') == '')
            {
                alert('Favor, preencha todas as informações!');
                return;
            }
            
            angular.forEach($scope.torre,function(value,index){
                if (angular.lowercase(value.Torre).replace(/[\s]/g, '') == angular.lowercase($scope.formtorre.Torre).replace(/[\s]/g, '')){
                    alert('Esse registro já existe.');
                    bool = false;
                }
            })

            if (bool){
                Torre.create($scope.formtorre, function(res, err){
                    console.log(res);
                })
            }

            $state.reload();
        }

    }]);