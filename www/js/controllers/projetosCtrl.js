'use strict';

angular
    .module('starter')
    .controller('projetosCtrl', ['$scope', '$state', 'User', 'Projeto', 'LimiteReal', 'Fase', 'Regiao', 'ClassGeral', function($scope, $state, User, Projeto, LimiteReal, Fase, Regiao, ClassGeral){
        console.log('projetosCtrl')

        var i;
        var d = new Date();
        var meses = 0;
        var user = {};

        user = {
            familia: ['Torre I - TESTE'],
            perfil: 'Admin'
        }

        $scope.formproj = {};
        $scope.formproj.id = 0;
        $scope.formproj.proposta = 'Sem Linha';
        $scope.formLimReal = {};

        $scope.projetos = {};
        $scope.limite = {};
        $scope.limValidacao = {};

        $scope.formproj.meses =[{mes: "", valor: 0}]

        $scope.baseline= {data: [], valor:[]}; 
        $scope.valida_baseline= {data: [], valor:[]}; 

        $scope.subtorre = {};
        $scope.gerentes = {};
        $scope.fase = {};
        $scope.classificacao_geral = {};
        $scope.regiao = {};
        $scope.sistema = [];
        $scope.projHigh = {};

        //Funcao para incluir e excluir meses
        $scope.funcMes = function(valor){
            if(valor==-1){
                $scope.formproj.meses.splice($scope.formproj.meses.length-1, 1);
            } else {
                if($scope.formproj.meses.length<15){
                    $scope.formproj.meses.push({mes: "", valor:0});
                }
            }
        }

        //FACTORY
        function alimentaData(data, qnt){
            var date = [];
            //Alimentando os valores de data
            for(i=0; i<15; i++){
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

        ClassGeral.find().$promise.then(function(res, err){         
             $scope.classificacao_geral = res;
            //console.log(res);
        });


        //Option Familia
        $scope.selectOptionFamilia = function(){
            var options = user.familia;
            return options;       
        }

         //Option Sistema
        $scope.selectOptionSistema = function(){
            var options = [];
            angular.forEach($scope.sistema, function(value,index){
                if (value.regiao == $scope.formproj.regiao){
                    options.push(value.sistema);
                }
            })

            return options;       
        }

        function add(a, b) {
            return a + b;
        }

        function sumMes(obj){
            var total = 0;
            angular.forEach(obj, function(value, index){
                total = total + value.valor;
            });
            return total;
        }

        function equal(value) {
            var mes;

            for(var i=0; i<value.length; i++){
                mes = value[i].mes;
                for(var j=0; j<value.length; j++){
                    if(i!=j){
                        if(mes==value[j].mes){
                            return true;
                        }
                    }
                }
            }
        }

        function verificaNulo(value){
            for(var i=0; i<value.length; i++){
                if(value[i].mes==null || value[i].mes == ''){
                    return true;
                }
                if(value[i].value<= 0){
                    return true;
                }
            }
            return false;
        }

        $scope.ValidaForm = function(){
            var bool = true;

            //Algum campo indefinido ou Nulo 
            if(angular.isUndefined($scope.formproj.proposta) || angular.isUndefined($scope.formproj.gerente) || angular.isUndefined($scope.formproj.familia) || angular.isUndefined($scope.formproj.sistema) || angular.isUndefined($scope.formproj.classificacao_geral) || angular.isUndefined($scope.formproj.fase))
            {
                alert('Favor, preencha todas as informações!');
                return;
            }

            //Campo vazio com espaço em branco
            if($scope.formproj.fase == '' || $scope.formproj.familia == '' || $scope.formproj.sistema == '' || $scope.formproj.gerente == '' || $scope.formproj.classificacao_geral == '' || $scope.formproj.proposta.replace(/[\s]/g, '') == '' || $scope.formproj.valor_total_proj == '' )
            {
                alert('Favor, preencha todas as informações!');
                return;
            }

            //Verificar valor vazio de meses.
            if($scope.formproj.meses.length == 0)
            {
                alert('Favor, inclua a distribuição dos valores por mes!');
                return;
            }

            // console.log($scope.formproj.meses);
            // console.log(sumMes($scope.formproj.meses));
            // console.log($scope.formproj.valor_total_proj);
            if(sumMes($scope.formproj.meses)!=$scope.formproj.valor_total_proj){
                alert('O valor total do projeto é diferente do somatório dos valores informados nos meses!');
                return;
            }

            if(verificaNulo($scope.formproj.meses)){
                alert('Informe um valor maior que zero para realizar a inclusão.');
                return;
            }

            if(verificaNulo($scope.formproj.meses)){
                alert('Selecione um mes para realizar a inclusão.');
                return;
            }

            if(equal($scope.formproj.meses)){
                 alert('Foram informados meses que se repetem, favor olhar os dados informados!');
                return;
            }

            // console.log($scope.formproj);

            angular.forEach($scope.formproj.meses, function(value, index){
                for(var i=0; i<$scope.baseline.data.length; i++){
                    if(value.mes==$scope.baseline.data[i]){
                        if(value.valor>$scope.baseline.valor[i]){
                            alert('O valor imposto no mes ' + value.mes + ' é maior que o Baseline!');
                            bool = false;
                            return;
                        }
                    }
                }
            })

            // Validacao nivel 2 com o Banco de dados
            LimiteReal.find().$promise.then(function(res, err){
                $scope.limValidacao = res;
                //console.log(res);
                $scope.valida_baseline.valor = alimentaValor($scope.valida_baseline.data, $scope.limValidacao, user.familia[0]);
                angular.forEach($scope.formproj.meses, function(value, index){
                    for(var i=0; i<$scope.valida_baseline.data.length; i++){
                        if(value.mes==$scope.valida_baseline.data[i]){
                            if(value.valor>$scope.valida_baseline.valor[i]){
                                alert('O valor imposto no mes ' + value.mes + ' é maior que o Baseline!');
                                bool = false;
                                return;
                            }
                        }
                    }
                })

                //criando a variavel com os valores atualizados para incluir na tabela de LimiteReal.
                if(bool){
                    $scope.formLimReal.dados = {};
                    $scope.formLimReal = $scope.limValidacao;
                    angular.forEach($scope.formLimReal, function(value, index){
                        if(value.familia == user.familia){
                            for(var j=0; j<value.dados.length; j++){
                                for(var i=0; i<$scope.formproj.meses.length; i++){
                                    var k = j+1;
                                    var dependencia = '';
                                    if(value.dados[j].mes==$scope.formproj.meses[i].mes){
                                        value.dados[j].gasto_mes =  value.dados[j].gasto_mes + $scope.formproj.meses[i].valor;
                                        if(value.dados[j].gasto_mes >= value.dados[j].baseline+value.dados[j].baseline*value.dados[j].perc_baseline/-100){
                                            dependencia = 'S';
                                        }else{
                                            dependencia = 'N';
                                        }
                                        if(!angular.isUndefined(value.dados[k])){
                                            value.dados[k].dependencia = dependencia;
                                        }
                                    }   
                                }
                            }
                        }
                    });
                    console.log('limiteReal: ', $scope.limValidacao);
                    console.log('limiteReal Alterado: ', $scope.formLimReal);
                }


                if (bool){
                    Projeto.create($scope.formproj, function(res, err){
                        console.log(res);
                        LimiteReal.updateAll({where: {familia: ""+ $scope.formproj.familia +""}}, {dados: $scope.formLimReal.dados}, function(info, err) {
                                //console.log(info);
                            })
                        if(!err){
                            $state.reload();
                        }
                        
                    })

                }
            });    
           
        }

    }]);