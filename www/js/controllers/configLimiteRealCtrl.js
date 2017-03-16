'use strict';

angular
    .module('starter')
    .controller('configLimiteRealCtrl', ['$scope', '$state', 'LimiteReal', 'Projeto',  function($scope, $state, LimiteReal, Projeto){
        console.log('configLimiteRealCtrl')

        var d = new Date();
        d.setMonth(d.getMonth() -1);
        var data =[];
        var classgeral = ["Aprovado","Pipeline Aprovado","Pipeline"]

        $scope.limreal = {};
        $scope.projeto = {};
        $scope.tabelaBase = { familia: "", classgeral: []};

        //find, findOne, findById
        function listarLimReal(){
            LimiteReal.find().$promise.then(function(res, err){
                $scope.limreal = res;
                //console.log(res);
                Projeto.find().$promise.then(function(res, err){
                    $scope.projeto = res;
                });
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

        console.log($scope.tabelaBase);

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