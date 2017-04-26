'use strict';

angular
    .module('starter')
    .controller('configRacionalCtrl', ['$scope', '$state', 'LimiteReal', 'Projeto', 'ClassGeral', function($scope, $state, LimiteReal, Projeto, ClassGeral){
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
        $scope.tabelalimreal = [];
        $scope.valorClassgeral = [{titulo: "", mes1: 0, mes2: 0, mes3: 0, mes4: 0, mes5: 0, mes6: 0, mes7: 0}];
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
                    $scope.tabelalimreal = res;
                    // console.log(res);
                    // console.log($scope.tabelalimreal)
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
        function atribuirDado(tipo) {
            var dados = [];
            for (var i = 0; i < 7; i++) {
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
            console.log(dados.splice(0, 0, tipo))
            return dados; //.splice(0, 0, tipo);
        }

        function gerarRacional(){ 
            Projeto.find()
                .$promise
                    .then(function (res, err){
                        $scope.projetos = res;
                        ClassGeral.find()
                            .$promise
                                .then(function (res, err){
                                    $scope.classgeral = res;
                                    $scope.carregouDados = false;  
                                    $scope.classgeral_pai.push("BASELINE");
                                    var count = 1;
                                    
                                    angular.forEach($scope.classgeral, function(value, index){
                                        if(!$scope.classgeral_pai.includes(value.classgeral_pai)){
                                            $scope.classgeral_pai.push(value.classgeral_pai);
                                            $scope.classgeral_pai.push("Delta " + count);
                                            count++;
                                        } 
                                    });
                                    for (var i = 0; i < $scope.classgeral.length; i++) {
                                        $scope.valorClassgeral.push(0);
                                    }                                 
                                });
                    });
        }   

        $scope.gerarTabela = function(){
        
            console.log($scope.classgeral);
            //atribuindo os valores dos projetos por mes/Classificacao Geral
            for (var i = 0; i < $scope.classgeral.length; i++) {
                $scope.valorClassgeral[i] = atribuirDado($scope.classgeral[i].classgeral_id);                
            }

            console.log($scope.valorClassgeral);

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