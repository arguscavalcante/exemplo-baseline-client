'use strict';

angular
    .module('starter')
    .controller('alteraprojCtrl', ['$scope', '$state', 'SubTorre', 'Projeto', 'Regiao', 'LimiteReal', 'Fase', 'ClassGeral', 'User', function($scope, $state, SubTorre, Projeto, Regiao, LimiteReal, Fase, ClassGeral, User){
        console.log('alteraprojCtrl')

        $scope.subtorre = {};
        $scope.projeto = {};
        $scope.tabela = [];
        $scope.filtroResult = {};
        $scope.formaltproj = {};
        $scope.sistema = [];
        $scope.sortKey = 'projeto';
        $scope.reverse = !$scope.reverse;
        $scope.qnt = [5, 10, 15, 20];

        $scope.buscar = true;
        $scope.mostrar = true;
        $scope.mostrar_sel = false;
        $scope.alterar = false;

        $scope.mostrar = [true, false, false, false, false, false, false, false, false, false, false, false, false, false, false]
        $scope.mostrarbotao = [true, false, false, false, false, false, false, false, false, false, false, false, false, false, false]

        $scope.filtroResult.qnt_itens = 5;

        var meses = 0;
        var user = {};
        user = {
            //torre: 'Torre I',
            subtorre: 'TESTE',
            torre: 'Torre 0',
            //subtorre: 'Subtorre X',
            perfil: 'Admin'
        }
        var bool = true;

        // Alimenta objeto com todas as SubTorres
        SubTorre.find().$promise.then(function(res, err){
            $scope.subtorre = res;
            console.log(res);
        });

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

         // Alimenta objeto com todas as Regiões/Sistemas
        Regiao.find().$promise.then(function(res, err){
            $scope.regiao = res;
            //console.log(res);
            
            angular.forEach($scope.regiao, function(value,index){
                for(var i=0; i<value.Sistemas.length; i++){
                    $scope.sistema.push({regiao: value.Regiao_id, sistema: value.Sistemas[i]});
                }
            });
        });

        // Alimenta objeto com todos os Projetos
        Projeto.find().$promise.then(function(res, err){
            $scope.projeto = res;
            console.log(res);
        });

        //Funcao para incluir e excluir meses
        $scope.funcMes = function (valor){
            if(meses==0 && valor==-1){
                alert('Não há como desabilitar mais meses.');
                return;
            }

            meses = meses + valor;

            for(var i=0; i<$scope.mostrar.length; i++){                
                if(i<=meses){
                    $scope.mostrar[i] = true;
                } else {
                    $scope.mostrar[i] = false;
                }
                
                if (i==meses){
                    $scope.mostrarbotao[i] = true;
                }else{
                    $scope.mostrarbotao[i] = false;
                }
            }
            //console.log('Mostrar: ', $scope.mostrar)
            //console.log('Mostrar Botoes: ', $scope.mostrarbotao)
        }

        //Option Sistema
        $scope.selectOptionSistema = function(){
            var options = [];
            angular.forEach($scope.sistema, function(value,index){
                if (value.regiao == $scope.filtroResult.regiao){
                    options.push(value.sistema);
                }
            })

            return options;       
        }


        $scope.limparFiltros = function(){
            $scope.filtroResult.familia = "";
            $scope.filtroResult.sistema = "";
            $scope.filtroResult.projeto = "";
        }

        $scope.ordenar = function(keyname){
            $scope.sortKey = keyname;
            $scope.reverse = !$scope.reverse;
        };

        //Option Sistema
        $scope.selectOptionSistema = function(){
            var options = [];
            angular.forEach($scope.sistema, function(value,index){
                if (value.regiao == $scope.formaltproj.regiao){
                    options.push(value.sistema);
                }
            })

            return options;       
        }

        $scope.alteraProj = function(value){
            $scope.tabela = [];

            $scope.tabela.push({
                projeto: value.projeto,
                proposta: value.proposta,
                classificacao_geral: value.classificacao_geral,
                fase: value.fase,
                familia: value.familia,
                sistema: value.sistema,
                valor_total_proj: value.valor_total_proj
            });

            $scope.formaltproj = {
                projeto: value.projeto,
                proposta: value.proposta,
                gerente: value.gerente,
                classificacao_geral: value.classificacao_geral,
                regiao: value.regiao,
                sistema: value.sistema,
                fase: value.fase,
                familia: value.familia,
                sistema: value.sistema,
                valor_total_proj: value.valor_total_proj,
                meses: value.meses
            };

            
           
            // for(var i=0; i<$scope.formaltproj.meses.length; i++){
            //     $scope.mostrar[i] = true;
            //     meses = i;
            // }

            // $scope.mostrarbotao[0]= false;
            // $scope.mostrarbotao[meses] = true;

            console.log($scope.mostrar);
            console.log($scope.mostrarbotao);

            // Alimenta objeto com todas os Gerentes
            User.find().$promise.then(function(res, err){
                $scope.gerentes = res;
                //console.log(res);
            });

            // Alimenta objeto com todas as Fases
            Fase.find().$promise.then(function(res, err){
                $scope.fase = res;
                //console.log(res);
            });

            // Alimenta objeto com todas os Limites Reais
            LimiteReal.find().$promise.then(function(res, err){
                $scope.limite = res;
                //console.log(res);
            });

            ClassGeral.find().$promise.then(function(res, err){         
                $scope.classificacao_geral = res;
                //console.log(res);
            });

            //console.log($scope.tabela);
            $scope.buscar = false;
            $scope.mostrar = false;
            $scope.mostrar_sel = true;
            $scope.alterar = true;
        }

    }]);