'use strict';

angular
    .module('starter')
    .controller('relatorioCtrl', ['$scope', '$state', 'LimiteGrafico', 'Projeto', function($scope, $state, LimiteGrafico, Projeto){
        
        var i;
        var d = new Date();
        var buscaproj = d.getMonth()+'/'+d.getFullYear()
        //d.setMonth(d.getMonth() + 5);
        $scope.projetos = {};
        $scope.date = []; 
        $scope.limgraf = {};
        $scope.valor_proj = [];

        //Alimenta a variavel do Highcharts
        var objChartProj = 
            {
                render: 'grafproj',
                categorias: $scope.date,
                minimo: 0,
                maximo: 600000,
                serie: [] 
            };

        var aprov = {
            name:'Aprovado',
            data: []
        }

        var aprovauto = {
            name:'Aprovado Autonomia',
            data: []
        }

        var pipeccron = {
            name:'Pipeline Aprovado com Cronograma',
            data: []
        }

        var pipescron = {
            name:'Pipeline Aprovado sem Cronograma',
            data: []
        }

        var pipeauto = {
            name:'Pipeline Aprovado Autonomia',
            data: []
        }

        var pipe = {
            name:'Pipeline',
            data: []
        }

        var extrabase = {
            name:'Extra Baseline',
            data: []
        }

        var pipeextra = {
            name:'Pipeline Extra Baseline',
            data: []
        }

        var linha_lim = {
            type: 'line',
            name: 'Limite',
            data: [],
            marker: {
                enabled: false
            },
            states: {
                hover: {
                    lineWidth: 0
                }
            },
            enableMouseTracking: false
        }

        var linha_lim_neg = {
            type: 'line',
            name: 'Limite -5%',
            data: [],
            marker: {
                enabled: false
            },
            dashStyle: 'shortdot',
            states: {
                hover: {
                    lineWidth: 0
                }
            },
            enableMouseTracking: false
        }

        var linha_lim_pos = {
            type: 'line',
            name: 'Limite +5%',
            data: [],
            marker: {
                enabled: false
            },
            dashStyle: 'dash',
            states: {
                hover: {
                    lineWidth: 0
                }
            },
            enableMouseTracking: false
        }

         objChartProj.serie.push(aprov) 

        //find, findOne, findById
        function listarProjetos(){
            Projeto.find({order: ['classificacao_geral DESC', 'mes_ano ASC']}).$promise.then(function(res, err){
                $scope.projetos = res;
            });
            
        }

        listarProjetos();

        //find, findOne, findById
        LimiteGrafico.find().$promise.then(function(res, err){
            $scope.limgraf = res;
            linha_lim.data = atribuirvalor();
            linha_lim_neg.data = calcularvalorposneg(linha_lim.data, -5);
            linha_lim_pos.data = calcularvalorposneg(linha_lim.data, 5);
            aprov.data = atribuirDado('Aprovado');
            aprovauto.data = atribuirDado('Aprovado Autonomia');
            pipeccron.data = atribuirDado('Pipeline Aprovado com Cronograma');
            pipescron.data = atribuirDado('Pipeline Aprovado sem Cronograma');
            pipeauto.data = atribuirDado('Pipeline Aprovado Autonomia');
            pipe.data = atribuirDado('Pipeline');
            pipeextra.data = atribuirDado('Pipeline Extra Baseline');
            extrabase.data = atribuirDado('Extra Baseline');


            objChartProj.serie.push( extrabase, pipeextra, pipe, aprov, aprovauto, pipeccron, pipescron, pipeauto, linha_lim, linha_lim_neg, linha_lim_pos)
            //Inicializa o Grafico de Projetos
            grafProjetos(objChartProj);
        });
            

        //Alimentando os valores de data
        for(i=0; i<12; i++){
            $scope.date.push('-'+d.getMonth()+'/'+d.getFullYear())
            d.setMonth(d.getMonth() + 1);
        }
        for(i=0; i<12; i++){
            $scope.date[i] = $scope.date[i].replace('-0/','01/');
            $scope.date[i] = $scope.date[i].replace('-1/','02/');
            $scope.date[i] = $scope.date[i].replace('-2/','03/');
            $scope.date[i] = $scope.date[i].replace('-3/','04/');
            $scope.date[i] = $scope.date[i].replace('-4/','05/');
            $scope.date[i] = $scope.date[i].replace('-5/','06/');
            $scope.date[i] = $scope.date[i].replace('-6/','07/');
            $scope.date[i] = $scope.date[i].replace('-7/','08/');
            $scope.date[i] = $scope.date[i].replace('-8/','09/');
            $scope.date[i] = $scope.date[i].replace('-9/','10/');
            $scope.date[i] = $scope.date[i].replace('-10/','11/');
            $scope.date[i] = $scope.date[i].replace('-11/','12/');
        }

        function atribuirvalor(){
            var lim = [];
            $scope.limgraf.sort(function (a, b) {
                if (a.Data_corte < b.Data_corte) {
                    return -1;
                } else if (a.Data_corte > b.Data_corte) {
                    return 1;
                }
                return 0;
            });
            console.log('vetor de datas: %j', $scope.date);
            console.log('Dados do banco: $j', $scope.limgraf);
            var valorAntigo = 0;
            var indice = 0;

            angular.forEach($scope.limgraf, function(value, index){
                if(value.Data_corte < $scope.date[0]){
                    valorAntigo = value.valor_limite;
                }
            });

            console.log(valorAntigo);

            angular.forEach($scope.date,function(value,index){
                var found = false;
                for (var i = 0; i < $scope.limgraf.length; i++) {
                    // console.log('Dados: $s, $s, $s', value, $scope.limgraf[i].Data_corte, (value ==  $scope.limgraf[i].Data_corte));
                    if (value ==  $scope.limgraf[i].Data_corte) {
                        lim.push([ indice , $scope.limgraf[i].valor_limite]);
                        valorAntigo = $scope.limgraf[i].valor_limite
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    lim.push([ indice , valorAntigo]);
                }
                indice++;
            });
            console.log('Array pro grafico: %j', lim);
            return lim;
        }

         function calcularvalorposneg(valor, indicador){
            var indice = 0;
            var conta = 0;
            var calculo = [];

            angular.forEach(valor, function(value, index){
                conta = valor[indice][1] + (valor[indice][1] * (indicador /100));
                calculo.push([indice, conta]);
                indice++;
            })
            return calculo;
         }     

         function atribuirDado(tipo){
            var dados = [0,0,0,0,0,0,0,0,0,0,0,0];
            angular.forEach($scope.projetos, function(value,index){
                if(value.classificacao_geral == tipo){
                    for (var i = 0; i < $scope.date.length; i++) {
                        
                        if ($scope.date[i]==value.mes_ano){
                            dados[i]=dados[i]+value.valor_mes_ano;
                        }
                    }
                }
            });
            console.log('Dados do hightchart: $j', tipo, dados);
            return dados;
         }  

    }]);