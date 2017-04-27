'use strict';

angular
    .module('starter')
    .controller('alteraprojCtrl', ['$scope', '$state', '$timeout', 'Projeto', 'Regiao', 'LimiteReal', 'User', 'Fase', 'ClassGeral', function($scope, $state, $timeout, Projeto, Regiao, LimiteReal, User, Fase, ClassGeral){
        console.log('alteraprojCtrl')

         // Controle de sessao
        if(sessionStorage.getItem('login')==null || sessionStorage.getItem('perfil')==null || sessionStorage.getItem('familia')==null ){
            alert('Usuário não autenticado pelo Sistema!!')
            $state.go('login');
        }
        
        if(sessionStorage.getItem('perfil')=='Visitante'){
            alert('Usuário sem permissão para acessar essa página!');
            $state.go('relatorio');
        }

        var d = new Date();
        d.setDate(15);
        var com_torre = false;
        $scope.projeto = [];
        $scope.tabela = [];
        $scope.filtroResult = {};
        $scope.formaltproj = {};
        $scope.sistema = [];
        $scope.classgeral = [];
        $scope.sortKey = 'projeto';
        $scope.reverse = !$scope.reverse;
        $scope.qnt = [5, 10, 15, 20];

        $scope.formLimReal = {};
        $scope.tabelapag = [];
        $scope.tabelagasto = [];
        $scope.tabelabaseline = [];
        $scope.colordepend = [];
        $scope.baseline_red = [];
        $scope.camposform = true;
        var qnt_meses = 1;

        var num = 12; //centralizando as atribuicoes de loop

        $scope.baseline= {data: [], valor:[]}; 

        $scope.filtroResult.qnt_itens = 5;

        $scope.formaltproj.meses = [];
        $scope.formaltproj.meses.push({mes: "", valor: 'R$ 0,00'});
        $scope.formaltproj.valor_total_proj = 'R$ 0,00'

        var meses = 0;
        $scope.user = {};
        $scope.mostrar = {};
        $scope.user = {
            gerente: sessionStorage.getItem('login'),
            perfil: sessionStorage.getItem('perfil'),
            familias: sessionStorage.getItem('familia').split(","),
            nome: sessionStorage.getItem('nome')
        }
        $scope.buscar = true;
        $scope.mostrar.tabela = true;
        $scope.mostrar.selecao = false;
        $scope.alterar = false;

        switch($scope.user.perfil) {
            case 'Administrador':
                $scope.mostrar.config = true;
                $scope.mostrar.cadastproj = true;
                $scope.mostrar.alterproj = true;
                $scope.camposform = false;
                break;
            case 'Gerente':
                $scope.mostrar.cadastproj = true;
                $scope.mostrar.alterproj = true;
                break;
            default:
                alert('Não foi identificado o perfil do usuário!');
        }

        var bool = true;

         $scope.atualizaPag = function(){
            $state.reload();
        }

        // Alimenta objeto com todos os Projetos
        Projeto.find()
            .$promise
                .then(function(res, err){
                    // $scope.projeto = res;
                    // console.log(res);
                    angular.forEach(res, function(value, index){
                        if($scope.user.familias.includes(value.familia)){
                            $scope.projeto.push(value);
                        } 
                })
                // Alimenta objeto com todas as Regiões/Sistemas
                $timeout(function(){
                    Regiao.find()
                        .$promise
                            .then(function(res, err){
                                $scope.regiao = res;
                                //console.log(res);
                                
                                angular.forEach($scope.regiao, function(value,index){
                                    for(var i=0; i<value.sistemas.length; i++){
                                        $scope.sistema.push({regiao: value.regiao, sistema: value.sistemas[i], familia: value.familia});
                                    }
                                });
                            });
                }, 500);
        });

        //Funcao para incluir e excluir meses
        $scope.funcMes = function(valor){
            if(valor==-1){
                $scope.formaltproj.meses.splice($scope.formaltproj.meses.length-1, 1);
                $scope.baseline_red.push($scope.baseline_red.length-1, 1);
            } else {
                if($scope.formaltproj.meses.length<num){
                    $scope.formaltproj.meses.push({mes: "", valor:0});
                    $scope.baseline_red.push("");
                }
            }
        }

        //FACTORY
        function alimentaData(data, qnt){
            var vetor = [];
            var date = new Date(data);
            var mes;
            var zero = '00'
            //Alimentando os valores de data
             for (var i = 0; i < qnt; i++) {
                mes = date.getMonth()+1;
                mes = mes.toString();
                mes = zero.substring(0, zero.length - mes.length) + mes
                vetor.push( mes + '/' + date.getFullYear());
                date.setMonth(date.getMonth() + 1);
            }

            return vetor;
        }

        //Option Sistema
        $scope.selectOptionSistema = function(){
            var options = [];
            var familia = [];
            // console.log($scope.sistema);
            angular.forEach($scope.sistema, function(value,index){
                if (value.regiao == $scope.filtroResult.regiao && value.familia == $scope.filtroResult.familia){
                    options.push(value.sistema);
                }                
            })

            return options;       
        }

        $scope.atribuiBaseline = function(value){
            // console.log(value);
            // console.log($scope.formaltproj.meses[value].mes);
            for(var i=0; i<$scope.baseline.data.length; i++){
                if($scope.baseline.data[i] == $scope.formaltproj.meses[value].mes){
                   $scope.baseline_red[value]=$scope.baseline.valor[i] + Number(acertaValor($scope.formaltproj.meses[value].valor));
                }
            }
            // return value;
        }

        $scope.limparFiltros = function(){
            $scope.filtroResult.familia = "";
            $scope.filtroResult.sistema = "";
            $scope.filtroResult.projeto = "";
            $scope.filtroResult.descricao = "";
        }

        $scope.ordenar = function(keyname){
            $scope.sortKey = keyname;
            $scope.reverse = !$scope.reverse;
        };

        //Option Familia
        $scope.selectOptionFamilia = function(){
            var options = $scope.user.familias;
            return options;       
        }

        //Option Regiao
        $scope.selectOptionRegiaoForm = function(){
            var options = [];
            angular.forEach($scope.regiao, function(value,index){
                if (value.familia == $scope.formaltproj.familia){
                    options.push(value.regiao);
                }
            })

            return options;       
        }

        //Option Regiao
        $scope.selectOptionRegiao = function(){
            var options = [];
            angular.forEach($scope.regiao, function(value,index){
                if (value.familia == $scope.filtroResult.familia){
                    options.push(value.regiao);
                }
            })

            return options;       
        }

        //Option Sistema
        $scope.selectOptionSistemaform = function(){
            var options = [];
            var familia = [];
            angular.forEach($scope.sistema, function(value,index){
                if(com_torre){
                    familia = $scope.formaltproj.familia.split(' - ');
                    if (value.regiao == $scope.formaltproj.regiao && value.familia.split(' - ').includes(familia[0])){
                        options.push(value.sistema);
                    }
                } else {
                    if (value.regiao == $scope.formaltproj.regiao && value.familia == $scope.formaltproj.familia){
                        options.push(value.sistema);
                    }
                }
                
            })

            return options;       
        }

        function sumMes(obj){
            var total = 0;
            angular.forEach(obj, function(value, index){
                total = total + Number(acertaValor(value.valor));
                total = Math.round(total * 100)/100
            });
            return total;
        }

        function alimentaValor(vetor, objLimite, busca, tabela){
            var valor = [];
            var registro = [];
            var k;
            var val_baseline = 0;
            var val_mesant = 0;
            var bool_familia = true;
            for(var i=0; i<vetor.length; i++){
                valor.push(0);
                registro.push(false);
            }     
            // console.log(valor)      

            // console.log('limite: ', objLimite)
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
                                        if (value.dados[k].gasto_mes >= value.dados[k].baseline + value.dados[k].baseline*value.dados[k].perc_baseline/-100){
                                            val_mesant = value.dados[k].baseline - value.dados[k].gasto_mes;
                                            // console.log(val_mesant)
                                        }
                                    }
                                } 
                                if(val_mesant==0 && !tabela){
                                    val_mesant = (value.dados[i].baseline * value.dados[i].perc_baseline/100);
                                }            
                                valor[j] = val_baseline - value.dados[i].gasto_mes + val_mesant + value.dados[i].baseline_bonus;
                                valor[j] = Math.round(valor[j] * 100)/100
                                registro[j] = true;
                            }
                        }
                    }
                }
            });
            // console.log(valor);
            if(bool_familia){
                alert('A família ' + busca + ' não está parametrizada! Entre em contato com o Administrador.')
                return -1;
            }

            if(registro.includes(false) && tabela){
                alert('Há um ou mais meses que não possuem parametrização, favor entrar em contato com o Administrador do Sistema.');
            }
            return valor;
        }

        function alimentaValorTorre(vetor, objLimite, busca){ //$scope.baseline.data, $scope.limite, $scope.formaltproj.familia
            var valor = [];
            var k;
            var val_baseline = 0;
            var val_gasto = 0;
            var familia;
            for(var i=0; i<vetor.length; i++){
                valor.push({baseline: 0, gasto: 0});
            }     
            // console.log(valor)      

            // console.log('limite: ', objLimite)
            angular.forEach(objLimite, function(value, index){
                if(value.familia.split(' - ').includes(busca.split(' - ')[0])){
                    for(var i=0; i<value.dados.length; i++){
                        for(var j=0; j<vetor.length; j++){
                            if(vetor[j]==value.dados[i].mes){
                                valor[i].baseline = value.dados[i].torre_baseline;
                                valor[i].gasto = value.dados[i].torre_gasto;
                            }
                        }
                    }
                }
            });

            return valor;
        }

        $scope.baseline.data = alimentaData(d,num);

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

        $scope.alteraProj = function(value){
            $scope.tabela = [];

            $scope.tabela.push({
                projeto: value.projeto,
                descricao: value.descricao,
                proposta: value.proposta,
                classificacao_geral: value.classificacao_geral,
                fase: value.fase,
                familia: value.familia,
                sistema: value.sistema,
                valor_total_proj: currencyValue(value.valor_total_proj)
            });

            $scope.formaltproj = {
                projeto_id: value.projeto_id,
                projeto: value.projeto,
                descricao: value.descricao,
                proposta: value.proposta,
                gerente: value.gerente,
                classificacao_geral: value.classificacao_geral,
                regiao: value.regiao,
                sistema: value.sistema,
                fase: value.fase,
                familia: value.familia,
                sistema: value.sistema,
                valor_total_proj: currencyValue(value.valor_total_proj),
                meses: value.meses
            };

            angular.forEach($scope.formaltproj.meses, function(value, index){
                value.valor = currencyValue(value.valor)
            });

            // console.log($scope.formaltproj);
            // console.log($scope.baseline_red)

            // // Alimenta objeto com todas os Gerentes
            User.find().$promise.then(function(res, err){
                $scope.gerentes = res;
                //console.log(res);
            });

            // Alimenta objeto com todas as Fases
            Fase.find().$promise.then(function(res, err){
                $scope.fase = res;
                //console.log(res);
            });

            // Alimenta a data dos SELECT
            $scope.baseline.data2 = []
            $scope.baseline.todos = true;
            for(var i=0; i<$scope.formaltproj.meses.length; i++){
                if(!$scope.baseline.data.includes($scope.formaltproj.meses[i].mes)){
                    $scope.baseline.data2.push({data: $scope.formaltproj.meses[i].mes, desabilitar: true});
                } 
            }
            for(var i=0; i<$scope.baseline.data.length; i++){
                $scope.baseline.data2.push({data: $scope.baseline.data[i], desabilitar: false});
                $scope.baseline.todos = false;
            }

            // console.log($scope.baseline)
            // Alimenta objeto com todas os Limites Reais
            LimiteReal.find()
                .$promise
                    .then(function(res, err){
                        $scope.limite = res;
                        //console.log(res);
                        $scope.baseline.valor = alimentaValor($scope.baseline.data, $scope.limite, $scope.formaltproj.familia, false);
                        $scope.tabelapag = alimentaValor($scope.baseline.data, $scope.limite, $scope.formaltproj.familia, true);

                        angular.forEach($scope.limite, function(value, index){
                            if(value.familia == $scope.formaltproj.familia){
                                for(var i=0; i<value.dados.length; i++){
                                    for(var j=0; j<$scope.baseline.data.length; j++){
                                        if($scope.baseline.data[j]==value.dados[i].mes){
                                            $scope.tabelagasto.push(value.dados[i].gasto_mes);
                                            $scope.tabelabaseline.push(value.dados[i].baseline);
                                            if(value.dados[i].dependencia=='S'){
                                                    $scope.colordepend[i-1] = {'background-color':'red'};
                                                    $scope.colordepend.push({'background-color':'red'});
                                                    $scope.tabelapag[i] = $scope.tabelabaseline[i] - $scope.tabelagasto[i];
                                                }else{
                                                    $scope.colordepend.push({});
                                                }
                                        }
                                    }
                                    if(value.dados[i].torre!=null){
                                        com_torre = true;
                                        $scope.torre_baseline = alimentaValorTorre($scope.baseline.data, $scope.limite, $scope.formaltproj.familia)
                                    }
                                }
                            }
                        })

                        //ACERTO PARA MOSTRAR CONFORME SOLICITADO
                        for(var i=0; i< $scope.tabelapag.length; i++){
                            if($scope.tabelapag[i]<0){
                                $scope.tabelabaseline[i] = $scope.tabelabaseline[i] - $scope.tabelapag[i];
                                $scope.tabelapag[i] = 0;
                            }
                        }

                        for(var i=0; i<$scope.baseline.data.length; i++){
                            for(var j=0; j<$scope.formaltproj.meses.length; j++){
                                if($scope.baseline.data[i] == $scope.formaltproj.meses[j].mes){
                                    $scope.baseline_red.push($scope.baseline.valor[i]+ Number(acertaValor($scope.formaltproj.meses[j].valor)));
                                }
                            }               
                        }
                    });

            ClassGeral.find().$promise.then(function(res, err){         
                $scope.classificacao_geral = res;
                console.log(res);
                 angular.forEach($scope.classificacao_geral, function(value,index){
                    if(value.baseline){
                        $scope.classgeral.push(value.classgeral_id)
                    }
                })
            });

            //console.log($scope.tabela);
            $scope.buscar = false;
            $scope.mostrar.tabela = false;
            $scope.mostrar.selecao = true;
            $scope.alterar = true;
        }


        function acertaValor(value){
            if(value.toString().indexOf("$")==-1){
                return value;
            }else{
                value = value.replace(/[\.|\R|\$]/g, '');
                return value.replace(',', '.'); 
            }
        }

        $scope.ValidaForm = function(){
            var bool = true;
            var achei = false;

            //Algum campo indefinido ou Nulo 
            if(angular.isUndefined($scope.formaltproj.proposta) || angular.isUndefined($scope.formaltproj.projeto) || angular.isUndefined($scope.formaltproj.descricao) || angular.isUndefined($scope.formaltproj.gerente) || angular.isUndefined($scope.formaltproj.familia) || angular.isUndefined($scope.formaltproj.sistema) || angular.isUndefined($scope.formaltproj.classificacao_geral) || angular.isUndefined($scope.formaltproj.fase))
            {
                alert('Favor, preencha todas as informações!');
                bool = false;
                return;
            }

            //Campo vazio com espaço em branco
            if($scope.formaltproj.fase == '' || $scope.formaltproj.familia == '' || $scope.formaltproj.sistema == '' || $scope.formaltproj.gerente == '' || $scope.formaltproj.classificacao_geral == '' || $scope.formaltproj.proposta.replace(/[\s]/g, '') == '' || $scope.formaltproj.projeto.replace(/[\s]/g, '') == '' || $scope.formaltproj.descricao.replace(/[\s]/g, '') == '' || $scope.formaltproj.valor_total_proj == '' )
            {
                alert('Favor, preencha todas as informações!');
                bool = false;
                return;
            }

            //Verificar valor vazio de meses.
            if($scope.formaltproj.meses.length == 0)
            {
                alert('Favor, inclua a distribuição dos valores por mes!');
                bool = false;
                return;
            }

            // console.log($scope.formaltproj.meses);
            // console.log(sumMes($scope.formaltproj.meses));
            // console.log($scope.formaltproj.valor_total_proj);
            if(sumMes($scope.formaltproj.meses)!=Number(acertaValor($scope.formaltproj.valor_total_proj))){
                alert('O valor total do projeto é diferente do somatório dos valores informados nos meses!');
                bool = false;
                return;
            }

            if(verificaNulo($scope.formaltproj.meses)){
                alert('Informe um valor maior que zero para realizar a inclusão.');
                bool = false;
                return;
            }

            if(verificaNulo($scope.formaltproj.meses)){
                alert('Selecione um mes para realizar a inclusão.');
                bool = false;
                return;
            }

            if(equal($scope.formaltproj.meses)){
                alert('Foram informados meses que se repetem, favor olhar os dados informados!');
                bool = false;
                return;
            }
            // console.log('teste: ', $scope.baseline);       

            // Validacao nivel 2 com o Banco de dados

            if(bool){    
                validaValores(); 
            }
        };
        function validaValores(){
            var k;
            var dependencia;
            var sistemas_out = [];
            var bool_apr;
            
            angular.forEach($scope.sistema, function(value, index){
                if(value.familia != $scope.formaltproj.familia && value.regiao == $scope.formaltproj.regiao){
                    sistemas_out.push(value.sistema);
                }
            })

            LimiteReal.find()
                .$promise
                    .then(function(res, err){
                        $scope.formLimReal = res;
                        Projeto.find({filter:{where: {projeto_id: '' + $scope.formaltproj.projeto_id + ''}}}).$promise.then(function(res, err){
                        console.log(res);
                            $scope.projantigo = res;
                        // console.log($scope.formaltproj)
                            if ($scope.classgeral.includes($scope.formaltproj.classificacao_geral)){
                                angular.forEach($scope.formLimReal, function(value, index){
                                    if(value.familia == $scope.formaltproj.familia){
                                        for(var j=0; j<value.dados.length; j++){
                                            angular.forEach($scope.projantigo, function(valor, index){
                                                for(var i=0; i<valor.meses.length; i++){
                                                    var k = j+1;
                                                    var dependencia = '';
                                                    if(value.dados[j].mes==valor.meses[i].mes){
                                                        //Se encontrar a classificacao geral que influencia no baseline, aumenta seu valor de gasto
                                                        if ($scope.classgeral.includes(valor.classificacao_geral) ){
                                                            value.dados[j].gasto_mes =  value.dados[j].gasto_mes - Number(acertaValor(valor.meses[i].valor));
                                                            console.log(value.dados[j].gasto_mes);
                                                            if (sistemas_out.includes(valor.sistema)){
                                                                value.dados[j].torre_gasto = value.dados[j].torre_gasto - Number(acertaValor(valor.meses[i].valor));
                                                            }
                                                        }
                                                    }   
                                                }
                                            })
                                            
                                        }
                                    }
                                });

                                //incluir os valores novos
                                angular.forEach($scope.formLimReal, function(value, index){
                                    if(value.familia == $scope.formaltproj.familia){
                                        for(var j=0; j<value.dados.length; j++){
                                            for(var i=0; i<$scope.formaltproj.meses.length; i++){
                                                k = j+1;
                                                dependencia = '';
                                                if(value.dados[j].mes==$scope.formaltproj.meses[i].mes){
                                                    //Se encontrar a classificacao geral que influencia no baseline, aumenta seu valor de gasto
                                                    if ($scope.classgeral.includes($scope.formaltproj.classificacao_geral) ){
                                                        value.dados[j].gasto_mes =  value.dados[j].gasto_mes + Number(acertaValor($scope.formaltproj.meses[i].valor));
                                                        if (sistemas_out.includes($scope.formaltproj.sistema)){
                                                            value.dados[j].torre_gasto = value.dados[j].torre_gasto + Number(acertaValor($scope.formaltproj.meses[i].valor));
                                                        }
                                                    } else {
                                                        value.dados[j].gasto_mes =  value.dados[j].gasto_mes;
                                                    }
                                                }   
                                            }
                                            value.dados[j].dependencia = 'N';
                                        }
                                    }
                                });


                                console.log('resultado dentro da funcao: ', $scope.formLimReal);
                                //validando se os valores alterados estão conforme regra de baseline
                                angular.forEach($scope.formLimReal, function(value, index){
                                    if(value.familia==$scope.formaltproj.familia){
                                        for(var j=0; j<value.dados.length; j++){
                                            //acertar os valores de dependencia
                                            k=j+1;
                                            if(value.dados[j].gasto_mes >= value.dados[j].baseline+value.dados[j].baseline*value.dados[j].perc_baseline/-100 && value.dados[j].gasto_mes != value.dados[j].baseline && value.dados[j].dependencia != 'S'){
                                                dependencia = 'S';
                                            }else{
                                                dependencia = 'N';
                                            }
                                            if(!angular.isUndefined(value.dados[k])){
                                                value.dados[k].dependencia = dependencia;
                                            }       
                                        }          
                                                                        
                                        for(var j=0; j<value.dados.length; j++){
                                            for(var i=0; i<$scope.formaltproj.meses.length; i++){
                                                bool_apr = true;
                                                if(value.dados[j].mes==$scope.formaltproj.meses[i].mes){
                                                    // console.log(value.dados[j].mes);
                                                    if(value.dados[j].dependencia == 'S'){
                                                        k=j-1;
                                                        if(value.dados[j].gasto_mes>(value.dados[j].baseline + (value.dados[k].baseline - value.dados[k].gasto_mes))){
                                                            alert('O valor imposto no mes' + value.dados[j].mes + ' é maior que o Baseline, por causa de sua dependencia com o mes seguinte.');
                                                            bool_apr = false;
                                                            return;
                                                        }
                                                    }else{
                                                        if(value.dados[j].gasto_mes>value.dados[j].baseline+(value.dados[j].baseline*value.dados[j].perc_baseline/100)){
                                                            alert('O valor imposto no mes ' + value.dados[j].mes + ' é maior que o Baseline.');
                                                            bool_apr = false;
                                                            return;
                                                        }
                                                        k=j+1;
                                                        if(value.dados[k].dependencia == 'S'){
                                                            if(value.dados[k].gasto_mes>(value.dados[k].baseline + (value.dados[j].baseline - value.dados[j].gasto_mes))){
                                                                alert('O valor imposto no mes ' + value.dados[j].mes + ' é maior que o Baseline, por causa de sua dependencia com o mes seguinte.');
                                                                bool_apr = false;
                                                                return;
                                                            }
                                                        }
                                                    }
                                                    if (com_torre){
                                                        if(value.dados[j].torre_gasto > value.dados[j].torre_baseline){
                                                            alert('O valor imposto no mes ' + value.dados[j].mes + ' é maior que o disponivel pela torre.');
                                                            bool_apr = false;
                                                            return;
                                                        }
                                                    }

                                                }
                                            }
                                        }
                                    }
                                });
                                
                                if(bool_apr){
                                    // console.log('limiteReal Alterado: ', $scope.formLimReal);
                                    //Acerto dos valores para numeric
                                    $scope.formaltproj.valor_total_proj = Number(acertaValor($scope.formaltproj.valor_total_proj));
                                    angular.forEach($scope.formaltproj.meses, function(value, index){
                                        value.valor = Number(acertaValor(value.valor));
                                    });
                                    // console.log($scope.formaltproj);
                                    // console.log($scope.formLimReal);
                                    // console.log('passei');

                                //    Projeto.upsertWithWhere({where: {projeto_id: ''+ $scope.formaltproj.projeto_id +''}}, 
                                //                             {classificacao_geral: ''+ $scope.formaltproj.classificacao_geral +'', 
                                //                             familia: ''+ $scope.formaltproj.familia +'', 
                                //                             fase:''+ $scope.formaltproj.fase +'', 
                                //                             gerente:''+ $scope.formaltproj.gerente +'', 
                                //                             projeto:''+ $scope.formaltproj.projeto +'', 
                                //                             descricao: ''+ $scope.formaltproj.descricao +'',
                                //                             proposta:''+ $scope.formaltproj.proposta +'', 
                                //                             regiao: ''+ $scope.formaltproj.regiao +'', 
                                //                             sistema: ''+ $scope.formaltproj.sistema +'', 
                                //                             valor_total_proj: ''+ $scope.formaltproj.valor_total_proj +'', 
                                //                             meses: $scope.formaltproj.meses}, 
                                //                         function(res, err){
                                //         // console.log(res);
                                //         // console.log($scope.formaltproj.familia);
                                //         // console.log($scope.formLimReal[0].dados);
                                //         if($scope.classgeral.includes($scope.formaltproj.classificacao_geral)){
                                //             angular.forEach($scope.formLimReal, function(value, index){
                                //                 if(value.familia==$scope.formaltproj.familia){
                                //                     LimiteReal.upsertWithWhere({where: {familia: ''+ $scope.formaltproj.familia +''}}, {dados: value.dados}, function(info, err) {
                                //                         $state.reload();
                                //                     })
                                //                 }
                                //             });
                                //         }
                                //         $state.reload();                               
                                //     })
                                }
                            } else {
                                console.log('limiteReal Alterado: ', $scope.formLimReal);
                                //Acerto dos valores para numeric
                                $scope.formaltproj.valor_total_proj = Number(acertaValor($scope.formaltproj.valor_total_proj));
                                angular.forEach($scope.formaltproj.meses, function(value, index){
                                    value.valor = Number(acertaValor(value.valor));
                                });
                                // console.log($scope.formaltproj);
                                // console.log($scope.formLimReal);

                                // Projeto.upsertWithWhere({where: {projeto_id: ''+ $scope.formaltproj.projeto_id +''}}, 
                                //                             {classificacao_geral: ''+ $scope.formaltproj.classificacao_geral +'', 
                                //                             familia: ''+ $scope.formaltproj.familia +'', 
                                //                             fase:''+ $scope.formaltproj.fase +'', 
                                //                             gerente:''+ $scope.formaltproj.gerente +'', 
                                //                             projeto:''+ $scope.formaltproj.projeto +'', 
                                //                             descricao: ''+ $scope.formaltproj.descricao +'',
                                //                             proposta:''+ $scope.formaltproj.proposta +'', 
                                //                             regiao: ''+ $scope.formaltproj.regiao +'', 
                                //                             sistema: ''+ $scope.formaltproj.sistema +'', 
                                //                             valor_total_proj: ''+ $scope.formaltproj.valor_total_proj +'', 
                                //                             meses: $scope.formaltproj.meses}, 
                                //                             function(res, err){
                                //                 // console.log(info);
                                //                 $state.reload();
                                //             })
                            }
                    });
                });
        }

        function currencyValue(valor){
            var numberString;
            var decimalString;
            var integerString;
            var char;
            var leftZero = '000';
            var contThousand = 0;
            var thousandsFormatted = '';
            var centsSeparator = ','
            var thousandsSeparator = '.';
            var symbol = 'R$ ';

            //PARTE 1 - Limpesa dos dos dados de formatação e retirada dos caracteres inválidos
            // console.log(plainNumber);
            if(valor.toString().indexOf(".")==-1){
                numberString = valor.toString() + '00'
            } else {
                numberString = valor.toString().replace('.','')
            }

            //PARTE 2 - Tratamento para inclusão do filtro
            // console.log(numberString);
            
            if(numberString.length<3){
                numberString = leftZero.substring(0, leftZero.length - numberString.length) + numberString
            }

            //PARTE 3 - Inclusão do filtro
            integerString = numberString.substring(0, numberString.length-2); // Separando o valor inteiro para ser tratado pelo milhar
            decimalString = numberString.substring(integerString.length, numberString.length);

            if(integerString.length>3){
                //for para milhar
                // console.log(integerString);
                for(var i=integerString.length; i>0; i--){
                    char = integerString.substr(i-1,1);
                    contThousand++;
                    if(contThousand%3==0){
                        char = thousandsSeparator + char;
                    }
                    thousandsFormatted = char + thousandsFormatted;
                    // console.log(thousandsFormatted);
                }
            }else{
                thousandsFormatted = integerString;
            }

            if(thousandsFormatted.substr(0,1)==thousandsSeparator){
                thousandsFormatted = thousandsFormatted.substring(1, thousandsFormatted.length);
            }

            return symbol + thousandsFormatted + centsSeparator + decimalString;
        }

    }]);

    // .directive("monetarioproj",  ['$filter', function($filter) {
    //     return {
    //         restrict : "A",
    //         require: '?ngModel',
    //         scope: {},
    //         link: function (scope, elem, attrs, ctrl, ngModel) {
    //             if (!ctrl) return;

    //             ctrl.$parsers.unshift(function (viewValue) {
  
    //                 var plainNumber;
    //                 var finalNumber; 
    //                 var numberString;
    //                 var decimalString;
    //                 var integerString;
    //                 var char;

    //                 var leftZero = '000';
    //                 var contThousand = 0;
    //                 var thousandsFormatted = '';
    //                 var centsSeparator = ','
    //                 var thousandsSeparator = '.';
    //                 var symbol = 'R$ ';

    //                 //PARTE 1 - Limpesa dos dos dados de formatação e retirada dos caracteres inválidos
    //                 plainNumber = viewValue.replace(/[\.|\,|\R|\$]/g, '');
    //                 plainNumber = plainNumber.trim();
    //                 // console.log(plainNumber);
    //                 finalNumber = parseInt(plainNumber);

    //                 //PARTE 2 - Tratamento para inclusão do filtro
    //                 numberString = finalNumber.toString()
    //                 // console.log (numberString.length);
                    
    //                 if(numberString.length<3){
    //                     numberString = leftZero.substring(0, leftZero.length - numberString.length) + numberString
    //                 }

    //                 //PARTE 3 - Inclusão do filtro
    //                 integerString = numberString.substring(0, numberString.length-2); // Separando o valor inteiro para ser tratado pelo milhar
    //                 decimalString = numberString.substring(integerString.length, numberString.length);

    //                 if(integerString.length>3){
    //                     //for para milhar
    //                     // console.log(integerString);
    //                     for(var i=integerString.length; i>0; i--){
    //                         char = integerString.substr(i-1,1);
    //                         contThousand++;
    //                         if(contThousand%3==0){
    //                             char = thousandsSeparator + char;
    //                         }
    //                         thousandsFormatted = char + thousandsFormatted;
    //                         // console.log(thousandsFormatted);
    //                     }
    //                 }else{
    //                     thousandsFormatted = integerString;
    //                 }

    //                 if(thousandsFormatted.substr(0,1)==thousandsSeparator){
    //                     thousandsFormatted = thousandsFormatted.substring(1, thousandsFormatted.length);
    //                 }

    //                 elem.val(symbol + thousandsFormatted + centsSeparator + decimalString);

    //                 return symbol + thousandsFormatted + centsSeparator + decimalString;
    //             });

                
    //         }
    //     };
    // }]);