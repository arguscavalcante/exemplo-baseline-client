'use strict';

angular
    .module('starter')
    .controller('configRacionalCtrl', ['$scope', '$state', '$timeout', 'LimiteReal', 'Projeto', 'ClassGeral', function($scope, $state, $timeout, LimiteReal, Projeto, ClassGeral){
        console.log('configRacionalCtrl')

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
        $scope.projetos = [];
        $scope.valorAlterado = [];
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
                $scope.mostrar.config = false;
                $scope.mostrar.cadastproj = true;
                $scope.mostrar.alterproj = true;
                break;
            default:
                alert('Não foi identificado o perfil do usuário!');
        }

        var d = new Date();
        d.setDate(15);
        d.setMonth(d.getMonth() -3);
        $scope.date = [];
        $scope.racional = {};
        $scope.filtroBusca = {};
        $scope.classgeral = {};
        $scope.classgeral_pai = [];
        $scope.limreal = [];
        $scope.valorClassgeral = [];
        $scope.tabelaRacional = [];
        $scope.carregouDados = true;
        $scope.familiaTabela = "";
        $scope.familia = [];
        $scope.tabelalimreal = [];
        $scope.class_order = [];
        $scope.selection = [];

        $scope.racional.opcao = true;
        $scope.racional.relatorio = false;
        $scope.racional.busca = false;
        $scope.racional.desBonus = true;

        $scope.filtroBusca.qnt_itens = 10;

        $scope.limreal = {};

        //find, findOne, findById
        LimiteReal.find()
            .$promise
                .then(function(res, err){
                    $scope.limreal = res;
                    // console.log($scope.limreal)
                    $scope.racional.desBonus = false;
                });  

         //Acerto das datas por função -- FACTORY
        function alimentaData(data, qnt) {
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

        $scope.date = alimentaData(d, 7);

        

        //atribui valores do projetos
        function atribuirDado(tipo, pai) {
            var dados = [];

            for (var i = 0; i < $scope.date.length; i++) {
                dados.push(0);
            }

            Projeto.find({filter: {"where": {"familia":''+ $scope.familiaTabela +''}}})
                .$promise
                    .then(function (res, err) {
                        $scope.projetos = res;
                        angular.forEach($scope.projetos, function (value, index) {
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
                        });
                    }); 

            // console.log(dados.splice(0, 0, tipo))
            // dados.splice(0, 0, tipo);
            dados.splice(0, 0, pai)
            // console.log(dados);
            return dados; //.splice(0, 0, tipo);
        }

        function acertaValor(value){
            if(value.toString().indexOf("$")==-1){
                return value;
            }else{
                value = value.replace(/[\.|\R|\$]/g, '');
                return value.replace(',', '.'); 
            }
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

        function buscarBonus(){
            // console.log('entrei');
             angular.forEach($scope.limreal, function(value, index){
                for(var i=0; i<value.dados.length; i++){
                    $scope.tabelalimreal.push({familia: value.familia, 
                                                mes:value.dados[i].mes, 
                                                baseline: value.dados[i].baseline, 
                                                disp_torre: value.dados[i].torre_baseline,
                                                consumo_torre: value.dados[i].torre_gasto,
                                                baseline_bonus: currencyValue(value.dados[i].baseline_bonus)
                                            })
                }
                $scope.familia.push(value.familia);
            })
        }

        function gerarRacional(){ 
            $timeout(function(){
                ClassGeral.find()
                    .$promise
                        .then(function (res, err){
                            $scope.classgeral = res;
                            $scope.carregouDados = false;   
                            var count = 1
                            angular.forEach($scope.classgeral, function(value, index){
                                if(!$scope.class_order.includes(value.classgeral_pai)){
                                    $scope.class_order.push(value.classgeral_pai);
                                    count++;
                                } 
                            });      
                            // console.log( $scope.class_order)                
                        });
            }, 500);
        }  

        function tabelaValoresPai(vetor){
            var vetorfim = [];
            var vetordelta = [];
            var bool = true;
            var indice;
            var indicedelta;
            if(!$scope.classgeral_pai.includes(vetor[0])){
                return;
            }
            console.log('vetor pai ', vetor);
            angular.forEach($scope.tabelaRacional, function(value, index){
                if(value.class == vetor[0]){
                    bool = false
                }
            })
            
                if(bool){ 
                    // console.log('entrei: ', vetor[0]);
                    for(var i=1; i<vetor.length; i++){
                        vetorfim.push(vetor[i])
                    }
                    // vetorfim.splice(0, 0, vetor[0])

                    $scope.tabelaRacional.push({class:vetor[0], valor: vetorfim});
                    
                } else {
                     angular.forEach($scope.tabelaRacional, function(value, index){
                        if(value.class == vetor[0]){
                            for(var i=0; i<value.valor.length; i++){
                                value.valor[i] = vetor[i+1] + value.valor[i];
                            }
                        }
                    })
                }
        } 

        function tabelaValoresDelta(vetor){
            // console.log(vetor)
            var indice_nome;
            var indice_pos;
            var vetordelta = [];
            var vetorfinal = [];
            var contador = 1;
            var vetorexiste = false;
            var contavetor = 0;
            var delta = [];

            angular.forEach(vetor, function(value, index){
                vetordelta = []
                for(var i=0; i<$scope.classgeral_pai.length; i++){ 
                    if($scope.classgeral_pai[i]==value.class){
                        indice_nome = i+1;
                        indice_pos = index+contador;
                        
                        if(vetorexiste){
                            for(var j=0; j<value.valor.length; j++){
                                delta = vetorfinal[contavetor].valor;
                                vetordelta.push(Math.round((delta[j] - value.valor[j]) * 100)/100);
                            }
                            contavetor++;
                        }else{
                            for(var j=0; j<value.valor.length; j++){
                                vetordelta.push(Math.round((vetor[index-1].valor[j] - value.valor[j]) * 100)/100);
                            }
                        }
                        
                        vetorfinal.push({class: $scope.classgeral_pai[indice_nome], valor:vetordelta, indice: indice_pos})
                        vetorexiste = true;
                        contador++;
                    }
                }
                // console.log(indice_nome);
                // console.log($scope.classgeral_pai[indice_nome]);
            })  
            console.log(vetorfinal);   
            angular.forEach(vetorfinal, function(value, index){
                $scope.tabelaRacional.splice(value.indice, 0, {class: value.class, valor: value.valor})       
            })

        }

        $scope.gerarTabela = function(){            
            var vetor = [];
            $scope.tabelaRacional = [];

            if($scope.classgeral_pai.length > 0){
                for(var i=0; i<$scope.date.length; i++){
                    vetor.push(0);
                }           

                angular.forEach($scope.limreal, function(value, index){
                    if(value.familia == $scope.familiaTabela){
                        for(var i=0; i<value.dados.length; i++){
                            // console.log(value.dados[i].mes)
                            for(var j=0; j<$scope.date.length; j++){
                                if(value.dados[i].mes == $scope.date[j]){
                                    // console.log('entrei ', value.dados[i].mes)
                                    // console.log(value.dados[i].baseline)
                                    vetor[j] = value.dados[i].baseline;
                                }
                            }
                        }
                    }
                })

                $scope.tabelaRacional.push({class:"BASELINE", valor: vetor});

                
                // console.log($scope.classgeral);
                //atribuindo os valores dos projetos por mes/Classificacao Geral
                for(var j=0; j<$scope.classgeral_pai.length; j++){
                    for(var i = 0; i < $scope.classgeral.length; i++) {
                        if($scope.classgeral_pai[j]==$scope.classgeral[i].classgeral_pai){
                            tabelaValoresPai(atribuirDado($scope.classgeral[i].classgeral_id, $scope.classgeral[i].classgeral_pai));
                        }  
                    }
                }           

                        tabelaValoresDelta($scope.tabelaRacional);
            }    
        }
        
        $scope.racionalGerar = function(){
            console.log('racionalGerar');
            $scope.racional.opcao = false;
            $scope.racional.relatorio = true;
            gerarRacional();
        }

        $scope.valorBonus = function(){
            console.log('valorBonus');
            $scope.racional.opcao = false;
            $scope.racional.busca = true;
            buscarBonus();
        }

        $scope.salvarBonus = function(){
            console.log('salvar Bonus');
            console.log($scope.limreal);
            console.log($scope.filtroBusca.familia)
            console.log($scope.valorAlterado)
            var gravarLimReal = [];
            if($scope.valorAlterado.length==0){
                alert('Nenhum registro foi selecionado para alteração!')
            }else{
                angular.forEach($scope.limreal, function(value, index){
                    if(value.familia == $scope.filtroBusca.familia){
                        gravarLimReal = value;
                    }
                })

                angular.forEach($scope.valorAlterado, function(value, index){
                    for(var i=0; i<gravarLimReal.dados.length; i++){
                        if(gravarLimReal.dados[i].mes == value.mes){
                            gravarLimReal.dados[i].baseline_bonus = value.valor
                        }
                    }
                })

                // console.log(gravarLimReal);
                LimiteReal.upsertWithWhere({where: {familia: ''+ gravarLimReal.familia +''}}, {dados: gravarLimReal.dados}, function(info, err) {
                    $state.reload();
                })                
            }
           
        }

        $scope.atribuiValor = function(obj){
            // console.log(obj);
            var naoAchei = true;

            if($scope.valorAlterado.length > 0){
                angular.forEach($scope.valorAlterado, function(value, index){
                    if(value.mes == obj.mes){
                        naoAchei = false;
                        value.valor = Number(acertaValor(obj.baseline_bonus));
                    }
                })
            }
                if(naoAchei){
                    $scope.valorAlterado.push({mes: obj.mes, valor:Number(acertaValor(obj.baseline_bonus))})
                }
            
            // console.log($scope.valorAlterado);
        }

        $scope.mostrarTabela = function(id){
            var idx = $scope.selection.indexOf(id);
            var count = 1;
            $scope.classgeral_pai = [];
            // console.log(idx);
            if (idx > -1) {
                $scope.selection.splice(idx, 1);
            }
            else {
                $scope.selection.push(id);
            }

            // console.log($scope.selection);
            angular.forEach($scope.selection, function(value, index){
                if(!$scope.classgeral_pai.includes(value)){
                    $scope.classgeral_pai.push(value);
                    $scope.classgeral_pai.push("Delta " + count);
                    count++;
                } 
                // console.log(value)
            });    
            // console.log($scope.classgeral_pai)
            $scope.gerarTabela();
            // console.log($scope.tabelaRacional)
        }

    }]);