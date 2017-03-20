'use strict';

angular
    .module('starter')
    .controller('alteraprojCtrl', ['$scope', '$state', 'Projeto', 'Regiao', 'LimiteReal', 'Fase', 'ClassGeral', 'User', function($scope, $state, Projeto, Regiao, LimiteReal, Fase, ClassGeral, User){
        console.log('alteraprojCtrl')

        var d = new Date();
        $scope.subtorre = {};
        $scope.projeto = {};
        $scope.tabela = [];
        $scope.filtroResult = {};
        $scope.formaltproj = {};
        $scope.sistema = [];
        $scope.sortKey = 'projeto';
        $scope.reverse = !$scope.reverse;
        $scope.qnt = [5, 10, 15, 20];

        $scope.baseline= {data: [], valor:[]}; 

        $scope.buscar = true;
        $scope.mostrar = true;
        $scope.mostrar_sel = false;
        $scope.alterar = false;

        $scope.filtroResult.qnt_itens = 5;

        $scope.formaltproj.meses =[{mes: "", valor: 0}]

        var meses = 0;
        var user = {};
        user = {
            familia: ['Torre I - TESTE'],
            perfil: 'Admin'
        }
        var bool = true;

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
        $scope.funcMes = function(valor){
            if(valor==-1){
                $scope.formaltproj.meses.splice($scope.formaltproj.meses.length-1, 1);
            } else {
                if($scope.formaltproj.meses.length<15){
                    $scope.formaltproj.meses.push({mes: "", valor:0});
                }
            }
        }

        //FACTORY
        function alimentaData(data, qnt){
            var date = [];
            //Alimentando os valores de data
            for(var i=0; i<15; i++){
                date.push('-'+data.getMonth()+'/'+data.getFullYear())
                data.setMonth(data.getMonth() + 1);
            }
            for(i=0; i<15; i++){
                date[i] = date[i].replace('-0/','01/');
                date[i] = date[i].replace('-1/','02/');
                date[i] = date[i].replace('-2/','03/');
                date[i] = date[i].replace('-3/','04/');
                date[i] = date[i].replace('-4/','05/');
                date[i] = date[i].replace('-5/','06/');
                date[i] = date[i].replace('-6/','07/');
                date[i] = date[i].replace('-7/','08/');
                date[i] = date[i].replace('-8/','09/');
                date[i] = date[i].replace('-9/','10/');
                date[i] = date[i].replace('-10/','11/');
                date[i] = date[i].replace('-11/','12/');
            }

            return date;
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

        //Option Familia
        $scope.selectOptionFamilia = function(){
            var options = user.familia;
            return options;       
        }

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

        function alimentaValor(vetor, objLimite, busca){
            var valor = [];
            var k;
            var val_baseline = 0;
            var val_mesant = 0;
            var bool_familia = true;
            for(var i=0; i<vetor.length; i++){
                valor.push(0)
            }           

            console.log('limite: ', objLimite)
            angular.forEach(objLimite, function(value, index){
                if(value.familia == busca){
                    bool_familia = false;
                    for(var i=0; i<value.dados.length; i++){
                        for(var j=0; j<vetor.length; j++){
                            if(vetor[j]==value.dados[i].mes){
                                val_baseline = value.dados[i].baseline;
                                val_mesant = 0;
                                if (value.dados[i].dependencia == 'S'){
                                    k = i-1;
                                    if (!angular.isUndefined(value.dados[k])){
                                        if (value.dados[k].gasto_mes >= value.dados[k].baseline + value.dados[k].baseline*-0.01){
                                            val_mesant = value.dados[k].baseline - value.dados[k].gasto_mes;
                                        }
                                    }
                                } 
                                if(val_mesant==0){
                                   val_mesant = (value.dados[i].baseline * value.dados[i].perc_baseline/100)
                                }
                                console.log(val_mesant);
                                valor[i] = val_baseline - value.dados[i].gasto_mes + val_mesant + value.dados[i].baseline_bonus;
                            }
                        }
                    }
                }
            });

            if(bool_familia){
                alert('A família ' + busca + ' não está parametrizada! Entre em contato com o Administrador.')
                return -1;
            }

            if(valor.includes(0)){
                alert('Não há valores de limite real parametrizados para um ou mais meses. Favor, informar ao Administrador.');
            }
            return valor;
        }

        $scope.baseline.data = alimentaData(d,15);

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
                $scope.baseline.valor = alimentaValor($scope.baseline.data, $scope.limite, user.familia[0]);
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