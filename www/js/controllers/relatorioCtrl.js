'use strict';

angular
    .module('starter')
    .controller('relatorioCtrl', ['$scope', '$state', '$timeout', 'LimiteGrafico', 'Projeto', 'SubTorre', 'ClassGeral', function ($scope, $state, $timeout, LimiteGrafico, Projeto, SubTorre, ClassGeral) {
        console.log('relatorioCtrl')

        if(sessionStorage.getItem('login')==null || sessionStorage.getItem('perfil')==null || sessionStorage.getItem('familia')==null ){
            alert('Usuário não autenticado pelo Sistema!!')
            $state.go('login');
        }

        var i;
        var d = new Date();
        $scope.file='';
        d.setDate(15);
        d.setMonth(d.getMonth() - 3);
        var od = new Date();
        od.setDate(15);
        od.setMonth(od.getMonth() - 3);
        var datasel;
        var idDivgraf = 'grafproj';
        var qnt_meses = 15;
        var objChartProj = {};
        var ano_limite;
        $scope.user = {};
        $scope.mostrar = {};
        $scope.familia = [];
        $scope.opcoes = true;
        $scope.grafico = true;
        $scope.formfiltro = {}; //filtro para regerar o Grafico
        $scope.subtorre = [];
        $scope.subtorres = [];
        $scope.projetoscompleto = {};
        $scope.projetos = [];
        $scope.date = [];
        $scope.opcaoqnt = [];
        $scope.opcaoano = [];
        $scope.opcaomeses = [];
        $scope.limgraf = {};
        $scope.valor_proj = [];
        $scope.projBase = [];
        $scope.projLimite = [];
        $scope.classgeral = [];
        $scope.relatorio = {};
        $scope.limite = [{
            nome: 'Limite', tipoLinha: 'line', variacao: 0
            }, {
            nome: 'Limite Mínimo', tipoLinha: 'shortdot', variacao: -1
            }, {
            nome: 'Limite Máximo', tipoLinha: 'dash', variacao: 1
            }]

        // console.log(sessionStorage.getItem('familia'));

        $scope.user = {
            gerente: sessionStorage.getItem('login'),
            perfil: sessionStorage.getItem('perfil'),
            familias: sessionStorage.getItem('familia').split(","),
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
            case 'Visitante':
                $scope.mostrar.cadastproj = false;
                $scope.mostrar.alterproj = false;
                break;
            default:
                alert('Não foi identificado o perfil do usuário!');
        }


        if($scope.user.familias.length > 1){
            $scope.grafico = false; 
            // console.log($scope.user)
        } 

        if($scope.user.familias.length == 1){
            $scope.opcoes = false; 
            $scope.user.familia = $scope.user.familias[0];
            $scope.user.subtorre = $scope.user.familia.substring($scope.user.familia.indexOf("-")+2);
            $scope.relatorio.filtro = true;
            $scope.relatorio.download = true;
            console.log($scope.user);
            $timeout(function(){
                Projeto.find()
                    .$promise
                        .then(function (res, err) {
                            $scope.projetoscompleto = res;
                            $scope.relatorio.filtro = false;
                            angular.forEach($scope.projetoscompleto, function(value, index){
                                if(value.familia == $scope.user.familia){
                                    $scope.projetos.push(value);
                                }
                            })
                            listarProjetos();
                        })
            }, 1000);
        } 

        $scope.atribuiFamilia = function(){
            // console.log($scope.user);
            $scope.user.subtorre = $scope.user.familia.substring($scope.user.familia.indexOf("-")+2);
            $scope.opcoes = false; 
            $scope.grafico = true;
            $scope.relatorio.filtro = true;
            $scope.relatorio.download = true;
            Projeto.find()
                .$promise
                    .then(function (res, err) {
                        $scope.projetoscompleto = res;
                        $scope.relatorio.filtro = false;
                        angular.forEach($scope.projetoscompleto, function(value, index){
                            if(value.familia == $scope.user.familia){
                                $scope.projetos.push(value);
                            }
                        })
                        listarProjetos();
                    });
        }
        
        $scope.atualizaPag = function(){
            $state.reload();
        }

        $scope.opcaomeses = [{valor: '01', mes:'Janeiro'},
                             {valor: '02', mes:'Fevereiro'},
                             {valor: '03', mes:'Março'},
                             {valor: '04', mes:'Abril'},
                             {valor: '05', mes:'Maio'},
                             {valor: '06', mes:'Junho'},
                             {valor: '07', mes:'Julho'},
                             {valor: '08', mes:'Agosto'},
                             {valor: '09', mes:'Setembro'},
                             {valor: '10', mes:'Outubro'},
                             {valor: '11', mes:'Novembro'},
                             {valor: '12', mes:'Dezembro'}] 

        for (var i = 1; i <= qnt_meses; i++) {
            $scope.opcaoqnt.push(i);
        }

        $scope.downloadFile = function(){
            var a = document.createElement("a");
            var fileName 
            var blob = new Blob(["\ufeff", $scope.file]);
            var url = URL.createObjectURL(blob);

            if($scope.user.perfil == 'Administrador'){
                fileName = "Dashboard Controle Baseline - IBM_.xls";
            }else{
                fileName = $scope.user.familia + "_.xls";
            }
            // console.log(url);
            a.href = url;
            a.ContentType = 'text/xls; charset=UTF-8'; 
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
        }

        //Funcao para buscar na subtorre o valor do limite do grafico
        function buscaValLimiteGraf(){
            var achei = false;
            SubTorre.find()
                .$promise
                    .then(function (res, err) {
                        $scope.subtorres = res;                
                            if(angular.isUndefined($scope.subtorres)){
                                    alert('Subtorre não cadastrada no sistema, entre em contado com o administrador do sistema.');
                                    ano_limite = 2020;
                                }else{
                                    angular.forEach($scope.subtorres, function(value, index){
                                        if(value.subtorre == $scope.user.subtorre){
                                            achei = true;
                                            $scope.user.subtorre = value;
                                            ano_limite = value.ano_limite;
                                        }
                                    })

                                    if(!achei){
                                        alert('Subtorre não cadastrada no sistema, entre em contado com o administrador do sistema.');
                                        ano_limite = 2020;
                                    }                                    
                                
                                }
                                $scope.opcaoano = atribuiAno(ano_limite);
                            });
        }

        //Funcao para incluir os valores dos projetos.
        function alimentaProjetos(qnt) {
            $scope.projBase = []; //reinicia variavel
            var graf_max = 0;
            if(angular.isUndefined($scope.subtorre)){
                alert('Parametrização do Gráfico nao encontrada, foi definida a parametrização padrão.');
                graf_max = 700000
            } else {
                graf_max = $scope.subtorre.max_grafico;
            }

            //inicia a variavel do Highchart
            objChartProj =
                {
                    render: idDivgraf,
                    categorias: $scope.date,
                    minimo: 0,
                    maximo: graf_max,
                    serie: []
                };

            //criando a variavel de projeto
            for (var i = 0; i < $scope.classgeral.length; i++) {
                // console.log('Classificacao Geral: ', $scope.classgeral[i]);
                $scope.projBase.push({ name: $scope.classgeral[i], data: [] })
            }
            //atribuindo os valores dos projetos por mes/Classificacao Geral
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
            // console.log($scope.projetos);
            angular.forEach($scope.projetos, function (value, index) {
                if (gerente==null || gerente==value.gerente){
                    if (value.classificacao_geral == tipo) {
                        for (var i = 0; i < $scope.date.length; i++) {
                            for(var j=0; j<value.meses.length; j++){
                                if ($scope.date[i] == value.meses[j].mes) {
                                    dados[i] = dados[i] + value.meses[j].valor;
                                    dados[i] = Math.round(dados[i] * 100)/100;
                                }
                            }
                        }
                    }
                }
            });
            // console.log('Dados do hightchart: $j', tipo, dados);
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

            // console.log('vetor da variacao: ', valor);
            // console.log('variacao: ', indicador);
            angular.forEach(valor, function (value, index) {
                conta = valor[indice][1] + (valor[indice][1] * (valor[indice][2] * indicador / 100));
                calculo.push([indice, conta]);
                indice++;
            })

            return calculo;
        }

        function atribuiAno(value){
            var ano = 2013;
            var vetor = [];

            while(ano<=value){
                vetor.push(ano);
                ano = ano + 1;
            }
            // console.log('quantidade de anos: ', vetor);
            return vetor;
        }

        //Atribui os valores do Baseline
        function atribuirvalorBaseline() {
            var lim = [];
            $scope.valor_proj = []; //reseta variavel
            $scope.limgraf.sort(function (a, b) {
                if (a.data_corte < b.data_corte) {
                    return -1;
                } else if (a.data_corte > b.data_corte) {
                    return 1;
                }
                return 0;
            });
            // console.log('vetor de datas: %j', $scope.date);
            // console.log('Dados do banco: $j', $scope.limgraf);
            var valorAntigo = 0;
            var variacao = 0;
            var indice = 0;

            angular.forEach($scope.limgraf, function (value, index) {
                if (value.data_corte < trasformParInt($scope.date[0])) {
                    valorAntigo = value.valor_limite;
                    variacao = value.variacao;
                }
            });

            // console.log(valorAntigo);

            angular.forEach($scope.date, function (value, index) {
                var found = false;
                for (var i = 0; i < $scope.limgraf.length; i++) {
                    //console.log('Dados: $s, $s, $s', value, $scope.limgraf[i].data_corte, (value ==  $scope.limgraf[i].data_corte));
                    if (trasformParInt(value) == $scope.limgraf[i].data_corte) {
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
            // console.log('Array pro grafico: %j', $scope.valor_proj);
        }

        //find, findOne, findById
        function listarProjetos() {
            $scope.file = '';
            $scope.date = alimentaData(d, qnt_meses);
            buscaValLimiteGraf();

            // console.log(res);
            //Funcao para buscar as classes o valor do limite do grafico
            ClassGeral.find()
                .$promise
                    .then(function (res, err) {
                        angular.forEach(res, function (value, index){
                            if(!value.baseline){
                                $scope.classgeral.push(value.classgeral_id);
                            }
                        });
                        angular.forEach(res, function (value, index){
                            if(value.baseline){
                                $scope.classgeral.push(value.classgeral_id);
                            }
                        });
                        // console.log('classificacao geral: ',  $scope.classgeral)
                        LimiteGrafico.find({ filter: { where: { familia: '' + $scope.user.familia + '' } } })
                            .$promise
                                .then(function (res, err) {
                                    $scope.limgraf = res;
                                    // console.log('limite grafico: ', res);
                                    alimentaProjetos(qnt_meses);//alimenta os dados dos projetos
                                    alimentaLimites();//alimenta os dados dos limites

                                    objChartProj.serie = $scope.projBase;
                                    // console.log(objChartProj.serie);
                                    //Inicializa o Grafico de Projetos
                                    console.log(objChartProj);
                                    grafProjetos(objChartProj);
                                    if($scope.user.perfil == 'Administrador'){
                                        $scope.file = exportaJSON($scope.projetoscompleto, ano_limite);
                                    }else{
                                        $scope.file = exportaJSON($scope.projetos, ano_limite);
                                    }
                        });
                    });

        }

        //funcao do filtro da pagina 
        $scope.redesenharGraf = function () {
            var qnt;
            var mes;
            var ano;
            var zero = "00";
            var pesqdata;

            if ($scope.formfiltro.qnt_meses_pos != null || $scope.formfiltro.mes_inicio != null || $scope.formfiltro.ano_inicio != null) {
                
                if ($scope.formfiltro.mes_inicio == null && $scope.formfiltro.ano_inicio == null) {
                    datasel = new Date();
                    datasel.setDate(15);
                    datasel.setMonth(od.getMonth() - 3);
                } else {

                    mes = $scope.formfiltro.mes_inicio;
                    ano = ano = $scope.formfiltro.ano_inicio;

                    if(ano==null){
                        datasel = new Date();
                        datasel.setDate(15);
                        ano = datasel.getFullYear();
                    }
                    
                    if(mes==null){
                        datasel = new Date();
                        datasel.setDate(15);
                        mes = datasel.getMonth()+1;
                        mes = mes.toString();
                        mes = zero.substring(0, zero.length - mes.length) + mes;
                    }

                    pesqdata = mes + "/" + ano;
                    // console.log(pesqdata);
                    datasel = trasformParDate(pesqdata);
                }
                // console.log(datasel);

                if ($scope.formfiltro.qnt_meses_pos == null) {
                    qnt = 15;
                } else {
                    qnt = $scope.formfiltro.qnt_meses_pos;
                }

                $scope.date = alimentaData(datasel, qnt);

                alimentaProjetos(qnt);//alimenta os dados dos projetos
                alimentaLimites();//alimenta os dados dos limites

                objChartProj.serie = $scope.projBase;
                // console.log(objChartProj.serie);

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
            return value.substring(3, value.length) + '-' + value.substring(0, 2) + '-15';
        }

        //Acerto das datas por função -- FACTORY
        function alimentaData(data, qnt) {
            var vetor = [];
            var date = new Date(data);
            var mes;
            var zero = '00'
            //Alimentando os valores de data
            // console.log(date)
            // console.log(date.getMonth())
            for (var i = 0; i < qnt; i++) {
                mes = date.getMonth()+1;
                mes = mes.toString();
                mes = zero.substring(0, zero.length - mes.length) + mes
                vetor.push( mes + '/' + date.getFullYear());
                date.setMonth(date.getMonth() + 1);
            }
            // console.log(vetor);
            return vetor;
        }

    }]);