'use strict';

angular
    .module('starter')
    .controller('relatorioCtrl', ['$scope', '$state', 'LimiteGrafico', 'Projeto', 'SubTorre', 'User', function ($scope, $state, LimiteGrafico, Projeto, SubTorre, User) {

        var i;
        var d = new Date();
        d.setMonth(d.getMonth() - 3);
        var od = new Date();
        od.setMonth(od.getMonth() - 3);
        var datasel;
        var user = {};

        user = {
            torre: 'Torre I',
            subtorre: 'TESTE',
            perfil: 'Admin'
        }

        var idDivgraf = 'grafproj';
        var familia = user.torre + ' - ' + user.subtorre;
        var qnt_meses = 15;
        var objChartProj = {}

        //d.setMonth(d.getMonth() + 1);
        $scope.formfiltro = {}; //filtro para regerar o Grafico
        $scope.subtorre = {};
        $scope.gerentes = {};
        $scope.projetos = {};
        $scope.date = [];
        $scope.opcaoqnt = [];
        $scope.opcaodate = [];
        $scope.limgraf = {};
        $scope.valor_proj = [];
        $scope.projBase = [];
        $scope.projLimite = [];

        $scope.classgeral = []; //montar vetor com banco Classificacao Geral colocar ordenação extrabase, pipeextra, pipe, aprov, aprovauto, pipeccron, pipescron, pipeauto
        $scope.classgeral = ['Extra Baseline', 'Pipeline Extra Baseline', 'Pipeline', 'Aprovado', 'Aprovado Autonomia', 'Pipeline Aprovado com Cronograma', 'Pipeline Aprovado sem Cronograma', 'Pipeline Aprovado Autonomia'];
        //$scope.classgeral = ['Extra Baseline', 'Pipeline Extra Baseline', 'Pipeline']
        $scope.limite = [{
            nome: 'Limite', tipoLinha: 'line', variacao: 0
        }, {
            nome: 'Limite Mínimo', tipoLinha: 'shortdot', variacao: -1
        }, {
            nome: 'Limite Máximo', tipoLinha: 'dash', variacao: 1
        }]

        $scope.opcaodate = alimentaData(od, qnt_meses);

        for (var i = 1; i <= qnt_meses; i++) {
            $scope.opcaoqnt.push(i);
        }

        //Funcao para buscar na subtorre o valor do limite do grafico
        function buscaValLimiteGraf(){
            SubTorre.find({ filter: { where: {Subtorre: '' + user.subtorre + ''}} }).$promise.then(function (res, err) {
            //SubTorre.find().$promise.then(function (res, err) {
                $scope.subtorre = res;
            })            
        }

        //Funcao para buscar na subtorre o valor do limite do grafico
        function buscaUsuarios(){
            //SubTorre.find({ filter: { where: {Subtorre: '' + user.subtorre + ''}} }).$promise.then(function (res, err) {
            User.find().$promise.then(function (res, err) {
                $scope.gerentes = res;
            })            
        }
        buscaUsuarios();

        //Funcao para buscar na subtorre o valor do limite do grafico
        /*function buscaclassgeral(){
            Fase.find().$promise.then(function (res, err) {
                $scope.fase = res;

                angular.forEach($scope.fase, function (value, index){
                    $scope.classgeral.push(value.Fase);
                })
                console.log('classgeral: ',  $scope.classgeral)
                
            })
            
        }
        buscaclassgeral();*/

        //Funcao para incluir os valores dos projetos.
        function alimentaProjetos(qnt) {
            $scope.projBase = []; //reinicia variavel

            //inicia a variavel do Highchart
            objChartProj =
                {
                    render: idDivgraf,
                    categorias: $scope.date,
                    minimo: 0,
                    maximo: $scope.subtorre[0].Limite_grafico,
                    serie: []
                };

            //criando a variavel de projeto
            for (var i = 0; i < $scope.classgeral.length; i++) {
                console.log('FASE: ', $scope.classgeral[i]);
                $scope.projBase.push({ name: $scope.classgeral[i], data: [] })
            }
            //atribuindo os valores dos projetos por mes/fase
            for (var i = 0; i < $scope.classgeral.length; i++) {
                $scope.projBase[i].data = atribuirDado($scope.classgeral[i], qnt);
            }
        }

        //atribui valores do projetos
        function atribuirDado(tipo, qnt) {
            var dados = [];
            var gerente = $scope.formfiltro.ger_resp;
            for (var i = 0; i < qnt; i++) {
                dados.push(0);
            }

            angular.forEach($scope.projetos, function (value, index) {
                if (gerente==null || gerente==value.gerente){
                    if (value.classificacao_geral == tipo) {
                        for (var i = 0; i < $scope.date.length; i++) {
                            for(var j=0; j<value.meses.mes.length; j++){
                                if ($scope.date[i] == value.meses.mes[j]) {
                                    dados[i] = dados[i] + value.meses.valor[j];
                                }
                            }
                        }
                    }
                }
            });
            console.log('Dados do hightchart: $j', tipo, dados);
            return dados;
        }

        //Funcao para incluir os valores dos limites.
        function alimentaLimites(valor) {
            $scope.projLimite = []; //reinicia variavel
            //atribui os valores dos limites e porcentagens -- $scope.valor_proj
            atribuirvalorBaseline();
            //criando a variável de 
            for (var i = 0; i < $scope.limite.length; i++) {
                //incluir um if para torre de BI E DW?
                $scope.projLimite.push(
                    {
                        type: 'line',
                        name: $scope.limite[i].nome,
                        data: [],
                        marker: {
                            enabled: false
                        },
                        dashStyle: $scope.limite[i].tipoLinha,
                        states: {
                            hover: {
                                lineWidth: 0
                            }
                        },
                        enableMouseTracking: false
                    }
                )
            }
            //Alimentando variáveis com os valores do banco
            for (var i = 0; i < $scope.limite.length; i++) {
                $scope.projLimite[i].data = calcularLimites($scope.valor_proj, $scope.limite[i].variacao);
            }
            //incluindo esse vetor no vetor no projeto 
            for (var i = 0; i < $scope.projLimite.length; i++) {
                $scope.projBase.push($scope.projLimite[i]);
            }
        }

        //Calcula valor dos limites
        function calcularLimites(valor, indicador) {
            var indice = 0;
            var conta = 0;
            var calculo = [];

            console.log('vetor da variacao: ', valor);
            console.log('variacao: ', indicador);
            angular.forEach(valor, function (value, index) {
                conta = valor[indice][1] + (valor[indice][1] * (valor[indice][2] * indicador / 100));
                calculo.push([indice, conta]);
                indice++;
            })

            return calculo;
        }

        //Atribui os valores do Baseline
        function atribuirvalorBaseline() {
            var lim = [];
            $scope.valor_proj = []; //reseta variavel
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
            var variacao = 0;
            var indice = 0;

            angular.forEach($scope.limgraf, function (value, index) {
                if (value.Data_corte < trasformParInt($scope.date[0])) {
                    valorAntigo = value.valor_limite;
                    variacao = value.variacao;
                }
            });

            console.log(valorAntigo);

            angular.forEach($scope.date, function (value, index) {
                var found = false;
                for (var i = 0; i < $scope.limgraf.length; i++) {
                    //console.log('Dados: $s, $s, $s', value, $scope.limgraf[i].Data_corte, (value ==  $scope.limgraf[i].Data_corte));
                    if (trasformParInt(value) == $scope.limgraf[i].Data_corte) {
                        $scope.valor_proj.push([indice, $scope.limgraf[i].valor_limite, $scope.limgraf[i].variacao]);
                        valorAntigo = $scope.limgraf[i].valor_limite;
                        variacao = $scope.limgraf[i].variacao;
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    $scope.valor_proj.push([indice, valorAntigo, variacao]);
                }
                indice++;
            });
            console.log('Array pro grafico: %j', $scope.valor_proj);
        }

        //find, findOne, findById
        function listarProjetos() {

            $scope.date = alimentaData(d, qnt_meses);
            buscaValLimiteGraf();

            Projeto.find({ filter: { where: { familia: '' + familia + '' } } }).$promise.then(function (res, err) {
            //Projeto.find().$promise.then(function (res, err) {
                $scope.projetos = res;

                LimiteGrafico.find({ filter: { where: { familia: '' + familia + '' } } }).$promise.then(function (res, err) {
                //LimiteGrafico.find().$promise.then(function (res, err) {
                    $scope.limgraf = res;

                    alimentaProjetos(qnt_meses);//alimenta os dados dos projetos
                    alimentaLimites();//alimenta os dados dos limites

                    objChartProj.serie = $scope.projBase;
                    console.log(objChartProj.serie);
                    //Inicializa o Grafico de Projetos
                    grafProjetos(objChartProj);

                });
            });

        }

        listarProjetos();

        //funcao do filtro da pagina 
        $scope.redesenharGraf = function () {

            var qnt;
            if ($scope.formfiltro.qnt_meses_pos != null || $scope.formfiltro.mes_ano_inicio != null) {

                if ($scope.formfiltro.mes_ano_inicio == null) {
                    datasel = new Date();
                    datasel.setMonth(od.getMonth() - 3);
                } else {
                    datasel = new Date(trasformParDate($scope.formfiltro.mes_ano_inicio));
                }

                if ($scope.formfiltro.qnt_meses_pos == null) {
                    qnt = 15;
                } else {
                    qnt = $scope.formfiltro.qnt_meses_pos;
                }

                $scope.date = alimentaData(datasel, qnt);

                alimentaProjetos(qnt);//alimenta os dados dos projetos
                alimentaLimites();//alimenta os dados dos limites

                objChartProj.serie = $scope.projBase;
                console.log(objChartProj.serie);
                //Inicializa o Grafico de Projetos
                grafProjetos(objChartProj);

                //Inicializa o Grafico de Projetos
                grafProjetos(objChartProj);
            }
        }

        //funcao de trasnformação para integer -- FACTORY
        function trasformParInt(value) {
            return value.substring(3, value.length) + value.substring(0, 2);
        }

        //funcao de trasnformação para data -- FACTORY
        function trasformParDate(value) {
            return value.substring(3, value.length) + '-' + value.substring(0, 2) + '-02';
        }

        //Acerto das datas por função -- FACTORY
        function alimentaData(data, qnt) {
            var vetor = [];
            //Alimentando os valores de data
            for (i = 0; i < qnt; i++) {
                vetor.push('-' + data.getMonth() + '/' + data.getFullYear())
                data.setMonth(data.getMonth() + 1);
            }
            for (i = 0; i < qnt; i++) {
                vetor[i] = vetor[i].replace('-0/', '01/');
                vetor[i] = vetor[i].replace('-1/', '02/');
                vetor[i] = vetor[i].replace('-2/', '03/');
                vetor[i] = vetor[i].replace('-3/', '04/');
                vetor[i] = vetor[i].replace('-4/', '05/');
                vetor[i] = vetor[i].replace('-5/', '06/');
                vetor[i] = vetor[i].replace('-6/', '07/');
                vetor[i] = vetor[i].replace('-7/', '08/');
                vetor[i] = vetor[i].replace('-8/', '09/');
                vetor[i] = vetor[i].replace('-9/', '10/');
                vetor[i] = vetor[i].replace('-10/', '11/');
                vetor[i] = vetor[i].replace('-11/', '12/');
            }

            return vetor;
        }

    }]);