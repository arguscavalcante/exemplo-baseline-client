'use strict';

angular
    .module('starter')
    .controller('configClassGeralCtrl', ['$scope', '$state', 'Fase', 'Projeto',  function($scope, $state, Fase, Projeto){
        console.log('configClassGeralCtrl')

        $scope.fase = {};
        $scope.formfase = {};
        var bool = true;
        var altera = 'N';

        //find, findOne, findById
        function listarFases(){
            Fase.find().$promise.then(function(res, err){
                $scope.fase = res;
                console.log(res);
            });
            
        }

        listarFases();

        $scope.alteraFase = function(value){
            altera = 'S'
            $scope.formfase = {
                Fase: value.Fase,
                Descricao: value.Descricao
            }
        }

        $scope.ValidaForm = function(){
            bool = true;

            if($scope.formfase.Fase == null || $scope.formfase.Descricao == null || $scope.formfase.Fase.replace(/[\s]/g, '') == '' ||  $scope.formfase.Descricao.replace(/[\s]/g, '') == '')
            {
                alert('Favor, preencha todas as informações!');
                return;
            }
            
            angular.forEach($scope.Fase,function(value,index){
                if (angular.lowercase(value.Fase).replace(/[\s]/g, '') == angular.lowercase($scope.formfase.Fase).replace(/[\s]/g, '' && alterar!='S')){
                    alert('Esse registro já existe.');
                    bool = false;
                }
            })

            if(altera == 'S'){ 
                if(confirm('Você deseja alterar essa Fase?') == false){
                    return;
                }
                
                Projeto.find({filter:{where: {fase: '' + $scope.formfase.Fase + ''}}}).$promise.then(function(res, err){
                    //console.log(res);
                    if(res.length != 0){
                        if(confirm('Existem projetos cadastrados com essa Fase, deseja continuar?') == false){
                            bool = false;
                        }else{
                            Fase.updateAll({where: {Fase: ""+ $scope.formfase.Fase +""}}, {Fase: ""+ $scope.formfase.Fase +"" , Descricao: ""+ $scope.formfase.Descricao +""}, function(info, err) {
                                //console.log(info);
                            })
                            bool = false;
                        }
                    }
                });

            }

            if (bool){
                Fase.create($scope.formfase, function(res, err){
                    console.log(res);
                })
            }

            $state.reload();
        }

    }]);