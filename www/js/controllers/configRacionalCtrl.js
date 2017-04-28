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
        $scope.projetos = {};
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
        
        var d = new Date();
        d.setDate(15);
        d.setMonth(d.getMonth() -3);
        $scope.date = [];
        $scope.racional = {};
        $scope.classgeral = {};
        $scope.classgeral_pai = [];
        $scope.limreal = [];
        $scope.valorClassgeral = [];
        $scope.tabelaRacional = [];
        $scope.carregouDados = true;
        $scope.familiaTabela = "";
        
        $scope.racional.opcao = true;
        $scope.racional.relatorio = false;
        $scope.racional.busca = false;

        $scope.limreal = {};

        //find, findOne, findById
        LimiteReal.find()
            .$promise
                .then(function(res, err){
                    $scope.limreal = res;
                    // console.log(res);
                    console.log($scope.limreal)
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
            angular.forEach($scope.projetos, function (value, index) {
                if (value.familia == $scope.familiaTabela){
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
            // console.log(dados.splice(0, 0, tipo))
            // dados.splice(0, 0, tipo);
            dados.splice(0, 0, pai)
            return dados; //.splice(0, 0, tipo);
        }

        function gerarRacional(){ 
            $timeout(function(){
                Projeto.find()
                    .$promise
                        .then(function (res, err){
                            $scope.projetos = res;
                            ClassGeral.find()
                                .$promise
                                    .then(function (res, err){
                                        $scope.classgeral = res;
                                        $scope.carregouDados = false;  
                                        var count = 1;
                                        angular.forEach($scope.classgeral, function(value, index){
                                            if(!$scope.classgeral_pai.includes(value.classgeral_pai)){
                                                $scope.classgeral_pai.push(value.classgeral_pai);
                                                $scope.classgeral_pai.push("Delta " + count);
                                                count++;
                                            } 
                                            // if(value.classgeral_pai != null){
                                            //      $scope.valorClassgeral.push(0);
                                            // }
                                        });                               
                                    });
                        });
            }, 500);
        }  

        function tabelaValoresPai(vetor){
            var vetorfim = [];
            var vetordelta = [];
            var bool = true;
            var indice;
            var indicedelta;
            console.log(vetor);
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

                    // pega o delta
                    angular.forEach($scope.classgeral_pai, function(value, index){
                        if(vetor[0]==value){
                            indice = index+1;
                            if(index >0){
                                indicedelta = index-1;
                            }else{
                                indicedelta = index;
                            }
                        }
                    })
                    console.log(indicedelta)
                    console.log($scope.tabelaRacional[indicedelta])
                    angular.forEach($scope.tabelaRacional[indicedelta].valor, function(value, index){
                        vetordelta.push(value - vetorfim[index]);
                    })

                    $scope.tabelaRacional.push({class:$scope.classgeral_pai[indice], valor: vetordelta});
                    
                } else {
                    //  angular.forEach($scope.tabelaRacional, function(value, index){
                    //     if(value.includes(vetor[0])){
                    //         for(var i=1; i<vetor.length; i++){
                    //             vetorfim.push(vetor[i] + value[i])
                    //         }
                            
                    //         vetorfim.splice(0, 0, vetor[0])
                    //         indice = index;

                    //         value = vetorfim;
                    //     }
                    // })
                    // $scope.tabelaRacional[indice] = vetorfim

                }

            

            // $scope.tabelaRacional.push(value);
            // $scope.tabelaRacional = 
        } 

        $scope.gerarTabela = function(){
            var vetor = [];
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
            for (var i = 0; i < $scope.classgeral.length; i++) {
                // console.log($scope.tabelaRacional)
                // $scope.valorClassgeral[i] = atribuirDado($scope.classgeral[i].classgeral_id, $scope.classgeral[i].classgeral_pai); 
                tabelaValoresPai(atribuirDado($scope.classgeral[i].classgeral_id, $scope.classgeral[i].classgeral_pai));
            }           

            // console.log( $scope.tabelaRacional);
            // console.log($scope.classgeral_pai);
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
        }

    }]);