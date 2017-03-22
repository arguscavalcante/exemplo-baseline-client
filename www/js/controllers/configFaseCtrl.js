'use strict';

angular
    .module('starter')
    .controller('configFaseCtrl', ['$scope', '$state', 'Fase', 'Projeto',  function($scope, $state, Fase, Projeto){
        console.log('configFaseCtrl')

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
                fase: value.fase,
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

                bool = false;
                
                Projeto.find({filter:{where: {fase: '' + $scope.formfase.fase + ''}}}).$promise.then(function(res, err){
                    //console.log(res);
                    if(res.length != 0){
                        if(confirm('Existem projetos cadastrados com essa Fase, deseja continuar?') == false){
                            return;
                        }else{
                            Fase.upsertWithWhere({where: {fase: ''+ $scope.formfase.fase +''}}, {fase: ''+ $scope.formfase.fase +'', descricao: ''+ $scope.formfase.descricao +''}, function(info, err) {
                                //console.log(info);
                                $state.reload();
                                return;
                            })  
                        }
                    }
                });

            }

            if (bool){
                Fase.create($scope.formfase, function(res, err){
                    //console.log(res);
                    $state.reload();
                })
            }
        }

    }]);