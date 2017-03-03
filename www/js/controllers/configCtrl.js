'use strict';

angular
    .module('starter')
    .controller('configCtrl', ['$scope', '$state', 'LimiteReal', function($scope, $state, LimiteReal){
        console.log('configCtrl')

        var d = new Date();
        var mes_ano = '-'+d.getMonth()+'/'+d.getFullYear();

        mes_ano = mes_ano.replace('-0/','01/');
        mes_ano = mes_ano.replace('-1/','02/');
        mes_ano = mes_ano.replace('-2/','03/');
        mes_ano = mes_ano.replace('-3/','04/');
        mes_ano = mes_ano.replace('-4/','05/');
        mes_ano = mes_ano.replace('-5/','06/');
        mes_ano = mes_ano.replace('-6/','07/');
        mes_ano = mes_ano.replace('-7/','08/');
        mes_ano = mes_ano.replace('-8/','09/');
        mes_ano = mes_ano.replace('-9/','10/');
        mes_ano = mes_ano.replace('-10/','11/');
        mes_ano = mes_ano.replace('-11/','12/');

        $scope.message = '';
        $scope.message_mes = '';

        $scope.limreal = {}

        //find, findOne, findById
        function verificarLimReal(){
            LimiteReal.find({filter:{where: {mes_ano_limite: '' + mes_ano + ''}}}).$promise.then(function(res, err){
                $scope.limreal = res;

                if(res.length == 0){
                   $scope.message = 'Não foi encontrado registro para o Limite Real do mes: ';
                   $scope.message_mes = mes_ano
                }
            });
        }

        verificarLimReal();

    }]);