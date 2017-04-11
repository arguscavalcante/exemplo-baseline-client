'use strict';

angular
    .module('starter')
    .controller('configRacionalCtrl', ['$scope', '$state', 'LimiteReal', 'Projeto', function($scope, $state, LimiteReal, Projeto){
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
        $scope.user = {
            gerente: sessionStorage.getItem('login'),
            perfil: sessionStorage.getItem('perfil'),
            familia: sessionStorage.getItem('familia').split(","),
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
        $scope.racional = {}
        $scope.tabelalimreal = [];
        var classgeral = ["Aprovado","Pipeline Aprovado","Pipeline"]
        
        $scope.racional.opcao = true;
        $scope.racional.relatorio = false;
        $scope.racional.busca = false;

        $scope.limreal = {};
        $scope.tabelaBase = { familia: "", classgeral: []};

        //find, findOne, findById
        LimiteReal.find()
            .$promise
                .then(function(res, err){
                    $scope.tabelalimreal = res;
                    // console.log(res);
                    console.log($scope.tabelalimreal)
                });  

        Projeto.find()
            .$promise
                .then(function (res, err){

                });

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

        $scope.date = alimentaData(d, 7);

        angular.forEach(classgeral, function(value, index){
            $scope.tabelaBase.classgeral.push({ name: value, data: atribuirDado(value, $scope.date) })
        });

        // console.log($scope.tabelaBase);

        function atribuirDado(tipo, data) {
            var dados = [];
            for (var i = 0; i < data.length; i++) {
                dados.push(0);
            }

            angular.forEach($scope.projetos, function (value, index) {
                if (value.classificacao_geral == tipo) {
                    for (var i = 0; i < data.length; i++) {
                        for(var j=0; j<value.meses.length; j++){
                            if (data[i] == value.meses[j].mes) {
                                dados[i] = dados[i] + value.meses[j].valor;
                            }
                        }
                    }
                }
            });

            return dados;
        }
        $scope.tabelacriada = '<table><tr><td><b>teste</b></td></tr>'+'</table>';

        $scope.racionalGerar = function(){
            console.log('racionalGerar');
            $scope.racional.opcao = false;
            $scope.racional.relatorio = true;
            building($scope.tabelacriada);
        }

        $scope.valorBonus = function(){
            console.log('valorBonus');
            $scope.racional.opcao = false;
            $scope.racional.busca = true;
        }

        function building(data){
            var chart = angular.element(document.getElementsByTagName('table-show'));
            chart.attr('scope', data);
            // $compile(chart)($scope);
        }

    }])

    .directive('tableShow', function() {
        return {
            transclude: true,
            template: function(attr){
                alert(attr)
            return attr;
            }
        }
        
    });