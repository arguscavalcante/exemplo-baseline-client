'use strict';

angular
    .module('starter')
    .controller('configLimiteRealCtrl', ['$scope', '$state', 'LimiteReal', 'SubTorre',  function($scope, $state, LimiteReal, SubTorre){
        console.log('configLimiteRealCtrl')

        var i;
        var d = new Date();
        d.setMonth(d.getMonth() -5);
        var bool = true;

        $scope.date = []; 

        $scope.limreal = {};
        $scope.formlimreal = {};
        $scope.subtorre = {};

        $scope.formlimreal.id = 0;

        //find, findOne, findById
        function listarLimReal(){
            LimiteReal.find().$promise.then(function(res, err){
                $scope.limreal = res;
                console.log(res);
            });
            
        }

        listarLimReal();

        //Alimentando os valores de data
        for(i=0; i<17; i++){
            $scope.date.push('-'+d.getMonth()+'/'+d.getFullYear())
            d.setMonth(d.getMonth() + 1);
        }
        for(i=0; i<17; i++){
            $scope.date[i] = $scope.date[i].replace('-0/','01/');
            $scope.date[i] = $scope.date[i].replace('-1/','02/');
            $scope.date[i] = $scope.date[i].replace('-2/','03/');
            $scope.date[i] = $scope.date[i].replace('-3/','04/');
            $scope.date[i] = $scope.date[i].replace('-4/','05/');
            $scope.date[i] = $scope.date[i].replace('-5/','06/');
            $scope.date[i] = $scope.date[i].replace('-6/','07/');
            $scope.date[i] = $scope.date[i].replace('-7/','08/');
            $scope.date[i] = $scope.date[i].replace('-8/','09/');
            $scope.date[i] = $scope.date[i].replace('-9/','10/');
            $scope.date[i] = $scope.date[i].replace('-10/','11/');
            $scope.date[i] = $scope.date[i].replace('-11/','12/');
        }

         // Alimenta com todas as Subtorres
        SubTorre.find().$promise.then(function(res, err){
            $scope.subtorre = res;
            console.log(res);
        });

        // Alimenta a selecao da pagina
        $scope.selectOptionFamilia = function(){
            var options = [];
            angular.forEach($scope.subtorre, function(value,index){
                options.push(value.Torre_id + " - " + value.Subtorre);
            })

            return options;       
        }

        $scope.ValidaForm = function(){

            if($scope.formlimreal.mes_ano_limite == null || $scope.formlimreal.subtorre_limite == null || $scope.formlimreal.valor_limite_mes_ano == null )
            {
                alert('Favor, preencha todas as informações!');
                return;
            }
            if($scope.formlimreal.valor_limite_mes_ano.replace(/[\s]/g, '') == '' || $scope.formlimreal.valor_limite_mes_ano <= 0 )
            {
                alert('O valor do Limite deve ser maior que zero!');
                return;
            }
            
            angular.forEach($scope.limreal,function(value,index){
                if (value.mes_ano_limite == $scope.formlimreal.mes_ano_limite && value.subtorre_limite == $scope.formlimreal.subtorre_limite){
                    alert('Esse registro já existe.');
                    bool = false;
                }
            })

            if (bool){
                LimiteReal.create($scope.formlimreal, function(res, err){
                    console.log(res);
                })
            }

            $state.reload();
        }

    }]);