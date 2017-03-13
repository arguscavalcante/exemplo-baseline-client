'use strict';

angular
    .module('starter')
    .controller('configSistemaCtrl', ['$scope', '$state', 'Regiao', 'Projeto',  function($scope, $state, Regiao, Projeto){
        console.log('configSistemaCtrl')

        $scope.regiao = {};
        $scope.formsistema = {};
        $scope.tabelasis = [];
        var bool = true;
        var altera = 'N';
        var projsist;

        //find, findOne, findById
        function selectOptionSistema(){
            Regiao.find().$promise.then(function(res, err){
                $scope.regiao = res;
                console.log(res);
                
                angular.forEach($scope.regiao, function(value,index){
                    for(var i=0; i<value.Sistemas.length; i++){
                        $scope.tabelasis.push({regiao: value.Regiao_id, sistema: value.Sistemas[i], intervalo: i});
                    }
                });
            });

        }

        selectOptionSistema();

        $scope.alteraSistema = function(value){
            altera = 'S'
            $scope.formsistema = {
                Regiao_id: value.regiao,
                Sistema: value.sistema,
                intervalo: value.intervalo
            }
        }

        $scope.ValidaForm = function(){
            $scope.sistemas = [];

            if($scope.formsistema.Regiao_id == null || $scope.formsistema.Sistema == null || $scope.formsistema.Regiao_id.replace(/[\s]/g, '') == '' ||  $scope.formsistema.Sistema.replace(/[\s]/g, '') == '')
            {
                alert('Favor, preencha todas as informações!');
                return;
            }
            
            angular.forEach($scope.tabelasis, function(value,index){
                if (value.Regiao == $scope.formsistema.Regiao_id && angular.lowercase(value.Sistema).replace(/[\s]/g, '') == angular.lowercase($scope.formsistema.Sistema.replace(/[\s]/g, '')) && altera != 'S'){
                    alert('Esse registro já existe.');
                    bool = false;
                }
            })

            if(altera == 'S'){ 
                if(confirm('Você deseja alterar esse Sistema?') == false){
                    return;
                }

               angular.forEach($scope.regiao, function(value,index){
                    if(value.Regiao_id == $scope.formsistema.Regiao_id){
                        projsist = value.Sistema[$scope.formsistema.intervalo];
                    }
                });
                
                Projeto.find({filter:{where: {sistema: '' + projsist + ''}}}).$promise.then(function(res, err){
                    //console.log(res);
                    if(res.length != 0){
                        if(confirm('Existem projetos cadastrados com esse Sistema, deseja continuar?') == false){
                            bool = false;
                        }else{
                            angular.forEach($scope.regiao, function(value,index){
                                if(value.Regiao_id == $scope.formsistema.Regiao_id){
                                    value.Sistema[$scope.formsistema.intervalo] = $scope.formsistema.Sistema
                                    $scope.sistemas = value.Sistemas;
                                    console.log($scope.sistemas);
                                }
                            });
                        }
                    }
                });
            } else {
                angular.forEach($scope.regiao, function(value,index){
                    if(value.Regiao_id == $scope.formsistema.Regiao_id){
                        value.Sistemas.push($scope.formsistema.Sistema);
                        $scope.sistemas = value.Sistemas;
                        console.log($scope.sistemas);
                    }
                });
            }

            if (bool){
                Regiao.updateAll({where: {Regiao_id: ""+ $scope.formsistema.Regiao_id +""}}, {Sistemas: $scope.sistemas}, function(info, err) {
                })
            
            }
        
           // $state.reload();
        }

    }]);