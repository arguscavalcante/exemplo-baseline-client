'use strict';

angular
    .module('starter')
    .controller('configSistemaCtrl', ['$scope', '$state', 'Regiao', 'Projeto', 'SubTorre',  function($scope, $state, Regiao, Projeto, SubTorre){
        console.log('configSistemaCtrl')

         // Controle de sessao
        if(sessionStorage.getItem('login')==null || sessionStorage.getItem('perfil')==null || sessionStorage.getItem('familia')==null ){
            alert('Usuário não autenticado pelo Sistema!!')
            $state.go('login');
        }
        
        if(sessionStorage.getItem('perfil')!='Administrador'){
            alert('Usuário sem permissão para acessar essa página!');
            $state.go('relatorio');
        }
         $scope.user = {};
        $scope.user = {
            gerente: sessionStorage.getItem('login'),
            perfil: sessionStorage.getItem('perfil'),
            familia: sessionStorage.getItem('familia').split(","),
            nome: sessionStorage.getItem('nome')
        }

        switch($scope.user.perfil) {
            case 'Administrador':
                $scope.mostrar.config = true;
                $scope.mostrar.cadastproj = true;
                $scope.mostrar.alterproj = true;
                break;
            case 'Gerente':
                $scope.mostrar.cadastproj = true;
                $scope.mostrar.alterproj = true;
                break;
            default:
                alert('Não foi identificado o perfil do usuário!');
        }
        
        $scope.regiao = {};
        $scope.subtorre = {};
        $scope.formsistema = {};
        $scope.tabelasis = [];
        $scope.formsistema.id_regiao = 0;
        var bool = true;
        var altera = 'N';
        var projsist;

        //find, findOne, findById
        function alimentaRegiao(){
            Regiao.find().$promise.then(function(res, err){
                $scope.regiao = res;
                console.log(res);
                
                angular.forEach($scope.regiao, function(value,index){
                    for(var i=0; i<value.sistemas.length; i++){
                        $scope.tabelasis.push({regiao: value.regiao, familia: value.familia, sistema: value.sistemas[i], intervalo: i});
                    }
                });
                console.log($scope.tabelasis);
            });

        }

        alimentaRegiao();

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

        //Option Regiao
        $scope.selectOptionRegiao = function(){
            var options = [];
            angular.forEach($scope.regiao, function(value,index){
                if (value.familia == $scope.formsistema.familia){
                    options.push(value.regiao);
                }
            })

            return options;       
        }

        $scope.alteraSistema = function(value){
            altera = 'S'
            $scope.formsistema = {
                regiao: value.regiao,
                familia: value.familia,
                sistema: value.sistema,
                intervalo: value.intervalo
            }
        }

        $scope.ValidaForm = function(){
            $scope.sistemas = [];
            console.log($scope.formsistema);
            console.log(altera);
            if($scope.formsistema.regiao == null || $scope.formsistema.sistema == null || $scope.formsistema.familia == null || $scope.formsistema.regiao.replace(/[\s]/g, '') == '' || $scope.formsistema.familia == '' ||  $scope.formsistema.sistema.replace(/[\s]/g, '') == '')
            {
                alert('Favor, preencha todas as informações!');
                return;
            }
            
            angular.forEach($scope.tabelasis, function(value,index){
                if (value.regiao == $scope.formsistema.regiao && value.familia == $scope.formsistema.familia && angular.lowercase(value.sistema).replace(/[\s]/g, '') == angular.lowercase($scope.formsistema.sistema.replace(/[\s]/g, '')) && altera != 'S'){
                    alert('Esse registro já existe.');
                    bool = false;
                }
            })

            if(altera == 'S'){ 
                if(confirm('Você deseja alterar esse Sistema?') == false){
                    return;
                }

               angular.forEach($scope.regiao, function(value,index){
                    if(value.regiao == $scope.formsistema.regiao && value.familia == $scope.formsistema.familia){
                        projsist = value.Sistemas[$scope.formsistema.intervalo];
                        //console.log(value.Sistemas[$scope.formsistema.intervalo]);
                    }
                });
                
                Projeto.find({filter:{where: {sistema: '' + projsist + ''}}}).$promise.then(function(res, err){
                    //console.log(res);
                    if(res.length != 0){
                        if(confirm('Existem projetos cadastrados com esse Sistema, deseja continuar?') == false){
                            bool = false;
                        }else{
                            angular.forEach($scope.regiao, function(value,index){
                                if(value.regiao == $scope.formsistema.regiao && value.familia == $scope.formsistema.familia){
                                    value.Sistemas[$scope.formsistema.intervalo] = $scope.formsistema.Sistema
                                    $scope.sistemas = value.Sistemas;
                                    console.log($scope.sistemas);
                                }
                            });
                        }
                     }else{
                        angular.forEach($scope.regiao, function(value,index){
                            if(value.regiao == $scope.formsistema.regiao && value.familia == $scope.formsistema.familia){
                                value.sistemas[$scope.formsistema.intervalo] = $scope.formsistema.sistema
                                $scope.sistemas = value.sistemas;
                                console.log($scope.sistemas);
                            }
                        });
                    }
                });
            } else {
                angular.forEach($scope.regiao, function(value,index){
                    if(value.regiao == $scope.formsistema.regiao && value.familia == $scope.formsistema.familia){
                        value.sistemas.push($scope.formsistema.sistema);
                        $scope.sistemas = value.sistemas;
                        console.log($scope.sistemas);
                    }
                });
            }

            if($scope.formsistema.id_regiao==0){
                angular.forEach($scope.regiao, function(value,index){
                    if(value.regiao == $scope.formsistema.regiao && value.familia == $scope.formsistema.familia){
                        $scope.formsistema.id_regiao = value.id_regiao;
                    }
                });  
            }          

            if (bool){
                Regiao.upsertWithWhere({where: {id_regiao: ""+ $scope.formsistema.id_regiao +""}}, {sistemas: $scope.sistemas}).$promise.then(function(info, err) {
                    $state.reload();
                })
            }
        }

    }]);