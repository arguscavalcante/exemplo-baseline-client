'use strict';

angular
    .module('starter')
    .controller('projetosCtrl', ['$scope', '$state', 'User', 'Projeto', 'LimiteReal', 'Fase', 'Regiao', 'ClassGeral', 'LimiteGrafico', function($scope, $state, User, Projeto, LimiteReal, Fase, Regiao, ClassGeral){
        console.log('projetosCtrl')

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
        var meses = 0;
        var user = {};
        var com_torre = false;
        $scope.mostrar = {};
        $scope.opcoes = true;
        $scope.cadastrar = true;

        var num = 15; //centralizando as atribuicoes de loop

        $scope.user = {};
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
            default:
                alert('Não foi identificado o perfil do usuário!');
        }

        if($scope.user.familias.length > 1){
            $scope.cadastrar = false; 
            // console.log($scope.user)
        } 

        if($scope.user.familias.length == 1){
            $scope.opcoes = false; 
            $scope.user.familia = $scope.user.familias[0];
            $scope.user.subtorre = $scope.user.familia.substring($scope.user.familia.indexOf("-")+2);
            buscaLimiteReal();
        }

        $scope.atribuiFamilia = function(){
            // console.log($scope.user);
            $scope.user.subtorre = $scope.user.familia.substring($scope.user.familia.indexOf("-")+2);
            $scope.opcoes = false; 
            $scope.cadastrar = true;
            buscaLimiteReal();
        }

        $scope.atualizaPag = function(){
            $state.reload();
        }

        $scope.formproj = {};
        $scope.formproj.proposta = 'Sem Linha';
        $scope.formLimReal = {};

        $scope.projetos = {};
        $scope.limite = {};
        $scope.formLimReal = {};
        $scope.classgeral = [];

        $scope.formproj.meses =[{mes: "", valor: 0}]

        $scope.baseline= {data: [], valor:[]}; 
        $scope.valida_baseline= {data: [], valor:[]}; 

        $scope.gerentes = {};
        $scope.fase = {};
        $scope.classificacao_geral = {};
        $scope.regiao = {};
        $scope.sistema = [];
        $scope.tabela = [];
        $scope.tabelagasto = [];
        $scope.tabelabaseline = [];
        $scope.tabeladata = [];
        $scope.torre_baseline = [];

        //Funcao para incluir e excluir meses
        $scope.funcMes = function(valor){
            if(valor==-1){
                $scope.formproj.meses.splice($scope.formproj.meses.length-1, 1);
            } else {
                if($scope.formproj.meses.length<num){
                    $scope.formproj.meses.push({mes: "", valor:0});
                }
            }
        }

        //FACTORY
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

        function alimentaValor(vetor, objLimite, busca, tabela){
            var valor = [];
            var registro = [];
            var k;
            var val_baseline = 0;
            var val_mesant = 0;
            var bool_familia = true;
            for(var i=0; i<vetor.length; i++){
                if((i<12 && tabela) || (!tabela)){
                    valor.push(0);
                    registro.push(false);
                }
            }     
            // console.log(valor)      

            console.log('limite: ', objLimite)
            angular.forEach(objLimite, function(value, index){
                if(value.familia == busca){
                    bool_familia = false;
                    for(var i=0; i<value.dados.length; i++){
                        for(var j=0; j<vetor.length; j++){
                            if((j<12 && tabela) || (!tabela)){
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
                                    registro[j] = true;
                                }
                            }
                        }
                    }
                }
            });

            if(bool_familia && tabela){
                alert('A família ' + busca + ' não está parametrizada! Entre em contato com o Administrador.');
                return -1;
            }

            if(registro.includes(false) && tabela){
                alert('Há um ou mais meses que não possuem parametrização, favor entrar em contato com o Administrador do Sistema.');
            }

            return valor;
        }

        function alimentaValorTorre(vetor, objLimite, busca){ //$scope.baseline.data, $scope.limite, $scope.user.familia
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
        $scope.tabeladata = alimentaData(d,12)

        // Alimenta objeto com todas os Gerentes
        User.find()
            .$promise
                .then(function(res, err){
                    $scope.gerentes = res;
                    //console.log(res);
                });

        // Alimenta objeto com todas as Fases
        Fase.find()
            .$promise
                .then(function(res, err){
                    $scope.fase = res;
                    //console.log(res);
                });

        function retornaId(){
            // Alimenta objeto com todos as Projeto
            Projeto.find({filter:{where: {gerente: '' + $scope.user.gerente + ''}}})
                .$promise
                    .then(function(res, err){
                        if(res[0]==null){
                            $scope.formproj.projeto_id = $scope.user.gerente + 1
                        } else {
                            $scope.formproj.projeto_id = $scope.user.gerente + res.length+1;
                        }
                        //console.log(res);
                    });
        }
        
        
        function buscaLimiteReal(){
            // Alimenta objeto com todas os Limites Reais
            LimiteReal.find()
                .$promise
                    .then(function(res, err){
                        $scope.limite = res;
                        // console.log(res);
                        $scope.baseline.valor = alimentaValor($scope.baseline.data, $scope.limite, $scope.user.familia, false);
                        // console.log($scope.baseline.valor)
                        $scope.tabela = alimentaValor($scope.baseline.data, $scope.limite, $scope.user.familia, true);
                        angular.forEach($scope.limite, function(value, index){
                            if(value.familia == $scope.user.familia){
                                 for(var i=0; i<value.dados.length; i++){
                                    for(var j=0; j<$scope.baseline.data.length; j++){
                                        if($scope.baseline.data[j]==value.dados[i].mes){
                                            if(j<12){
                                                $scope.tabelagasto.push(value.dados[i].gasto_mes);
                                                $scope.tabelabaseline.push(value.dados[i].baseline);
                                            }
                                            // console.log(value.dados[i].torre);
                                            if(value.dados[i].torre!=null){
                                                com_torre = true;
                                                $scope.torre_baseline = alimentaValorTorre($scope.tabeladata, $scope.limite, $scope.user.familia)
                                            }
                                        }
                                    }
                                 }
                            }
                        })
                        // console.log($scope.tabelagasto);
                        // console.log($scope.tabelabaseline);
                    });
            
        }

        // Alimenta objeto com todas as Regiões/Sistemas
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

        ClassGeral.find()
            .$promise
                .then(function(res, err){         
                    $scope.classificacao_geral = res;
                    // console.log(res);
                    angular.forEach($scope.classificacao_geral, function(value,index){
                        if(value.baseline){
                            $scope.classgeral.push(value.classgeral_id)
                        }
                    })
                    // console.log($scope.classgeral)
                });

        //Option Familia
        $scope.selectOptionFamilia = function(){
            var options = []
            options.push($scope.user.familia);
            return options;     
        }        

        //Option Regiao
        $scope.selectOptionRegiao = function(){
            var options = [];
            angular.forEach($scope.regiao, function(value,index){
                if (value.familia == $scope.formproj.familia){
                    options.push(value.regiao);
                }
            })

            return options;       
        }

        //Option Sistema
        $scope.selectOptionSistema = function(){
            var options = [];
            var familia = [];
            angular.forEach($scope.sistema, function(value,index){
                if(com_torre){
                    familia = $scope.formproj.familia.split(' - ');
                    if (value.regiao == $scope.formproj.regiao && value.familia.split(' - ').includes(familia[0])){
                        options.push(value.sistema);
                    }
                } else {
                    if (value.regiao == $scope.formproj.regiao && value.familia == $scope.formproj.familia){
                        options.push(value.sistema);
                    }
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
                total = total + Number(acertaValor(value.valor));
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
            console.log($scope.formproj);
            retornaId();
            //Algum campo indefinido ou Nulo 
            // if(angular.isUndefined($scope.formproj.proposta) || angular.isUndefined($scope.formproj.projeto) || angular.isUndefined($scope.formproj.descricao) || angular.isUndefined($scope.formproj.gerente) || angular.isUndefined($scope.formproj.familia) || angular.isUndefined($scope.formproj.sistema) || angular.isUndefined($scope.formproj.classificacao_geral) || angular.isUndefined($scope.formproj.fase))
            // {
            //     alert('Favor, preencha todas as informações!');
            //     return;
            // }

            // //Campo vazio com espaço em branco
            // if($scope.formproj.fase == '' || $scope.formproj.familia == '' || $scope.formproj.sistema == '' || $scope.formproj.gerente == '' || $scope.formproj.classificacao_geral == '' || $scope.formproj.proposta.replace(/[\s]/g, '') == '' || $scope.formproj.projeto.replace(/[\s]/g, '') == '' || $scope.formproj.descricao.replace(/[\s]/g, '') == '' || $scope.formproj.valor_total_proj == '' )
            // {
            //     alert('Favor, preencha todas as informações!');
            //     return;
            // }

            // //Verificar valor vazio de meses.
            // if($scope.formproj.meses.length == 0)
            // {
            //     alert('Favor, inclua a distribuição dos valores por mes!');
            //     return;
            // }

            // // console.log($scope.formproj.meses);
            // // console.log(sumMes($scope.formproj.meses));
            // // console.log($scope.formproj.valor_total_proj);
            // if(sumMes($scope.formproj.meses)!=Number(acertaValor($scope.formproj.valor_total_proj))){
            //     alert('O valor total do projeto é diferente do somatório dos valores informados nos meses!');
            //     return;
            // }

            // if(verificaNulo($scope.formproj.meses)){
            //     alert('Informe um valor maior que zero para realizar a inclusão.');
            //     return;
            // }

            // if(verificaNulo($scope.formproj.meses)){
            //     alert('Selecione um mes para realizar a inclusão.');
            //     return;
            // }

            // if(equal($scope.formproj.meses)){
            //      alert('Foram informados meses que se repetem, favor olhar os dados informados!');
            //     return;
            // }
            console.log($scope.baseline);       

            // Validacao nivel 2 com o Banco de dados
            
                        
            //criando a variavel com os valores atualizados para incluir na tabela de LimiteReal.
            if(validaValores() && bool){
                console.log('limiteReal Alterado: ', $scope.formLimReal);
                //Acerto dos valores para numeric
                $scope.formproj.valor_total_proj = Number(acertaValor($scope.formproj.valor_total_proj));
                angular.forEach($scope.formproj.meses, function(value, index){
                    value.valor = Number(acertaValor(value.valor));
                });
                // console.log($scope.formproj);
                // console.log($scope.formLimReal);

                // Projeto.create($scope.formproj, function(res, err){
                //     // console.log(res);
                //     // console.log($scope.formproj.familia);
                //     // console.log($scope.formLimReal[0].dados);
                //     if($scope.classgeral.includes($scope.formproj.classificacao_geral)){
                //         LimiteReal.upsertWithWhere({where: {familia: ''+ $scope.formproj.familia +''}}, {dados: $scope.formLimReal[0].dados}, function(info, err) {
                //             $state.reload();
                //         })
                //     }
                //     $state.reload();                               
                // })
            }
           
        };

        function validaValores(){
            LimiteReal.find()
                .$promise
                    .then(function(res, err){
                        $scope.formLimReal = res;
                        
                        //console.log(res);
                        if ($scope.classgeral.includes($scope.formproj.classificacao_geral)){
                            $scope.valida_baseline.valor = alimentaValor($scope.valida_baseline.data, res, $scope.user.familia, false);
                            console.log($scope.valida_baseline);
                            angular.forEach($scope.formLimReal, function(value, index){
                                if(value.familia == $scope.user.familia){
                                    for(var j=0; j<value.dados.length; j++){
                                        for(var i=0; i<$scope.formproj.meses.length; i++){
                                            var k = j+1;
                                            var dependencia = '';
                                            if(value.dados[j].mes==$scope.formproj.meses[i].mes){
                                                //Se encontrar a classificacao geral que influencia no baseline, aumenta seu valor de gasto
                                                if ($scope.classgeral.includes($scope.formproj.classificacao_geral) ){
                                                    value.dados[j].gasto_mes =  value.dados[j].gasto_mes + Number(acertaValor($scope.formproj.meses[i].valor));
                                                } else {
                                                    value.dados[j].gasto_mes =  value.dados[j].gasto_mes;
                                                }
                                                if(value.dados[j].gasto_mes >= value.dados[j].baseline+value.dados[j].baseline*value.dados[j].perc_baseline/-100 && value.dados[j].dependencia != 'S'){
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

                            console.log($scope.formLimReal);
                            angular.forEach($scope.formproj.meses, function(value, index){
                                for(var i=0; i<$scope.valida_baseline.data.length; i++){
                                    if(value.mes==$scope.valida_baseline.data[i]){
                                        // if(value.) EDSON
                                        if(Number(acertaValor(value.valor)) >$scope.valida_baseline.valor[i]){
                                            alert('O valor imposto no mes ' + value.mes + ' é maior que o Baseline!');
                                            bool = false;
                                            return;
                                        }
                                    }
                                }
                            })
                        }

                        
                        

                        if ($scope.classgeral.includes($scope.formproj.classificacao_geral)){
                            angular.forEach($scope.formLimReal.meses, function(value, index){
                                for(var i=0; i<$scope.baseline.data.length; i++){
                                    if(value.mes==$scope.baseline.data[i]){
                                        if(Number(acertaValor(value.valor)) >$scope.baseline.valor[i]){
                                            alert('O valor imposto no mes ' + value.mes + ' é maior que o Baseline!');
                                            bool = false;
                                            return;
                                        }
                                    }
                                }
                            })
                        }
                    });
        }
        
        
    }])

    .directive("monetarioproj",  ['$filter', function($filter) {
        return {
            restrict : "A",
            require: '?ngModel',
            scope: {},
            link: function (scope, elem, attrs, ctrl, ngModel) {
                if (!ctrl) return;

                ctrl.$parsers.unshift(function (viewValue) {
  
                    var plainNumber;
                    var finalNumber; 
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
                    plainNumber = viewValue.replace(/[\.|\,|\R|\$]/g, '');
                    plainNumber = plainNumber.trim();
                    // console.log(plainNumber);
                    finalNumber = parseInt(plainNumber);

                    //PARTE 2 - Tratamento para inclusão do filtro
                    numberString = finalNumber.toString()
                    // console.log (numberString.length);
                    
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

                    elem.val(symbol + thousandsFormatted + centsSeparator + decimalString);

                    return symbol + thousandsFormatted + centsSeparator + decimalString;
                });

                
            }
        };
    }]);
