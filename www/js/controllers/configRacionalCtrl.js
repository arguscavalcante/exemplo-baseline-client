'use strict';

angular
    .module('starter')
    .controller('configRacionalCtrl', ['$scope', '$state', 'LimiteReal', function($scope, $state, LimiteReal){
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
        d.setMonth(d.getMonth() -1);
        var data =[];
        $scope.tabelalimreal = [];
        var classgeral = ["Aprovado","Pipeline Aprovado","Pipeline"]

        $scope.limreal = {};
        $scope.tabelaBase = { familia: "", classgeral: []};

        //find, findOne, findById
        function listarLimReal(){
            LimiteReal.find().$promise.then(function(res, err){
                // console.log(res);
                angular.forEach(res, function(value,index){
                    for(var i=0; i<value.dados.length; i++){
                        $scope.tabelalimreal.push(
                            {   baseline: value.dados[i].baseline, 
                                perc_baseline: value.dados[i].perc_baseline, 
                                familia: value.familia, 
                                baseline_bonus: value.dados[i].baseline_bonus, 
                                mes: value.dados[i].mes, 
                                gasto_mes: value.dados[i].gasto_mes
                            });
                    }
                });
                console.log($scope.tabelalimreal)
            });  
        }

        listarLimReal();

        //FACTORY
        function alimentaData(data, qnt){
            var date = [];
            //Alimentando os valores de data
            for(var i=0; i<qnt; i++){
                date.push('-'+data.getMonth()+'/'+data.getFullYear())
                data.setMonth(data.getMonth() + 1);
            }
            for(var i=0; i<date.length; i++){
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

        data = alimentaData(d, 5)


        angular.forEach(classgeral, function(value, index){
            $scope.tabelaBase.classgeral.push({ name: value, data: atribuirDado(value, data) })
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
        

    }]);