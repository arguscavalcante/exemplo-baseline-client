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
        
        $scope.mostrar = {};
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
        $scope.alteradesabilita = false;
        $scope.formsistema.id_regiao = 0;
        var altera = 'N';

        //find, findOne, findById
        function alimentaRegiao(){
            Regiao.find().$promise.then(function(res, err){
                $scope.regiao = res;
                console.log(res);
                
                angular.forEach($scope.regiao, function(value,index){
                    for(var i=0; i<value.sistemas.length; i++){
                        $scope.tabelasis.push({id_regiao:value.id_regiao, regiao: value.regiao, familia: value.familia, sistema: value.sistemas[i], descricao: value.descricao, intervalo: i});
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
            $scope.alteradesabilita = true;
        }

        $scope.ValidaForm = function(){
            var bool = true;
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
                if(confirm('Você deseja alterar esse Sistema?') == true){
                    angular.forEach($scope.regiao, function(value,index){
                        if(value.regiao == $scope.formsistema.regiao && value.familia == $scope.formsistema.familia){
                            value.sistemas[$scope.formsistema.intervalo] = $scope.formsistema.sistema
                            $scope.sistemas = value.sistemas;
                            console.log($scope.sistemas);
                        }
                    });
                }

            } else {
                angular.forEach($scope.regiao, function(value,index){
                    if(value.regiao == $scope.formsistema.regiao && value.familia == $scope.formsistema.familia){
                        value.sistemas.push($scope.formsistema.sistema);
                        $scope.sistemas = value.sistemas;
                        console.log($scope.sistemas);
                    }
                });
            }

            angular.forEach($scope.regiao, function(value,index){
                if(value.regiao == $scope.formsistema.regiao && value.familia == $scope.formsistema.familia){
                    $scope.formsistema.id_regiao = value.id_regiao;
                }
            });          
            // console.log($scope.formsistema);
            // console.log($scope.sistemas);
            if (bool){
                Regiao.upsertWithWhere({where: {id_regiao: ""+ $scope.formsistema.id_regiao +""}}, {sistemas: $scope.sistemas, familia: $scope.formsistema.familia, regiao: $scope.formsistema.regiao}).$promise.then(function(info, err) {
                    $state.reload();
                })
            }
        }

        $scope.deleteSistema = function(obj) {
            console.log('delete');
            console.log(obj);
            $scope.reposicao = {};
            var vetor = [];
            // fruits.splice(2, 1);
            angular.forEach($scope.regiao, function(value,index){
                if(value.id_regiao == obj.id_regiao){
                    vetor = value.sistemas;
                    console.log(value.sistemas);
                }
            });

            // console.log(vetor.splice(obj.intervalo, 1));

            // console.log(obj);
            $scope.reposicao.id_regiao = obj.id_regiao;
            $scope.reposicao.descricao = obj.descricao;
            $scope.reposicao.regiao = obj.regiao;
            $scope.reposicao.familia = obj.familia;
            if(vetor.length > 1){
                $scope.reposicao.sistemas = vetor.splice(obj.intervalo-1, 1);
            }else{ 
                $scope.reposicao.sistemas = [];
            }

            console.log($scope.reposicao)

            if(confirm('Deseja realmente excluir o Sistema?') == true){
                 Regiao.destroyById({id: obj.id_regiao}, function(err){ 
                    Regiao.create($scope.reposicao, function(res, err){
                        // console.log(res);
                        $state.reload();
                    })
                });
            }
            
        };

    }]);