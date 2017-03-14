'use strict';

angular
    .module('starter')
    .controller('configClassGeralCtrl', ['$scope', '$state', 'ClassGeral', 'Projeto',  function($scope, $state, ClassGeral, Projeto){
        console.log('configClassGeralCtrl')

        $scope.classgeral = {};
        $scope.formclassgeral = {};
        var bool = true;
        var altera = 'N';

        //find, findOne, findById
        function listarClassGeral(){
            ClassGeral.find().$promise.then(function(res, err){
                $scope.classgeral = res;
                console.log(res);
            });
            
        }

        listarClassGeral();

        $scope.alteraClassGeral = function(value){
            altera = 'S'
            $scope.formclassgeral = {
                ClassGeral_id: value.ClassGeral_id,
                Descricao: value.Descricao
            }
        }

        $scope.ValidaForm = function(){
            bool = true;

            if($scope.formclassgeral.ClassGeral_id == null || $scope.formclassgeral.Descricao == null || $scope.formclassgeral.ClassGeral_id.replace(/[\s]/g, '') == '' ||  $scope.formclassgeral.Descricao.replace(/[\s]/g, '') == '')
            {
                alert('Favor, preencha todas as informações!');
                return;
            }
            
            angular.forEach($scope.classgeral,function(value,index){
                if (angular.lowercase(value.ClassGeral_id).replace(/[\s]/g, '') == angular.lowercase($scope.formclassgeral.ClassGeral_id).replace(/[\s]/g, '' && alterar!='S')){
                    alert('Esse registro já existe.');
                    bool = false;
                }
            })

            if(altera == 'S'){ 
                if(confirm('Você deseja alterar essa Classificação Geral?') == false){
                    return;
                }
                
                Projeto.find({filter:{where: {classificacao_geral: '' + $scope.formclassgeral.ClassGeral_id + ''}}}).$promise.then(function(res, err){
                    //console.log(res);
                    if(res.length != 0){
                        if(confirm('Existem projetos cadastrados com essa Classificação geral, deseja continuar?') == false){
                            bool = false;
                        }else{
                            ClassGeral.updateAll({where: {ClassGeral_id: ""+ $scope.formclassgeral.ClassGeral_id +""}}, {ClassGeral_id: ""+ $scope.formclassgeral.ClassGeral_id +"" , Descricao: ""+ $scope.formclassgeral.Descricao +""}, function(info, err) {
                                //console.log(info);
                                $state.reload();
                            })
                            bool = false;
                        }
                    }
                });

            }

            if (bool){
                ClassGeral.create($scope.formclassgeral, function(res, err){
                    console.log(res);
                    $state.reload();
                })
            }
        }

    }]);