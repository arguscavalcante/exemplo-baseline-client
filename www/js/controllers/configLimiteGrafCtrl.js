'use strict';

angular
    .module('starter')
    .controller('configLimiteGrafCtrl', ['$scope', '$state', 'LimiteGrafico', 'SubTorre',  function($scope, $state, LimiteGrafico, SubTorre){
        console.log('configLimiteGrafCtrl')

        var i;
        var d = new Date();
        var bool = true;

        $scope.date = []; 

        $scope.limgrafico = {};
        $scope.formlimgraf = {};
        $scope.subtorre = {};

        $scope.formlimgraf.id = 0;

        //find, findOne, findById
        function listarLimGraf(){
            LimiteGrafico.find().$promise.then(function(res, err){
                $scope.limgrafico = res;
                console.log(res);
            });
            
        }

        listarLimGraf();

        //Alimentando os valores de data
        for(i=0; i<12; i++){
            $scope.date.push('-'+d.getMonth()+'/'+d.getFullYear())
            d.setMonth(d.getMonth() + 1);
        }
        for(i=0; i<12; i++){
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

            if($scope.formlimgraf.Data_corte == null || $scope.formlimgraf.familia == null || $scope.formlimgraf.valor_limite == null || $scope.formlimgraf.variacao == null )
            {
                alert('Favor, preencha todas as informações!');
                return;
            }
            if($scope.formlimgraf.valor_limite.replace(/[\s]/g, '') == '' || $scope.formlimgraf.valor_limite <= 0 )
            {
                alert('O valor do Limite deve ser maior que zero!');
                return;
            }
            if($scope.formlimgraf.variacao.replace(/[\s]/g, '') == '' || $scope.formlimgraf.variacao < 0 )
            {
                alert('O valor mímino da variacao é zero!');
                return;
            }
            
            angular.forEach($scope.limgrafico,function(value,index){
                if (value.Data_corte == $scope.formlimgraf.Data_corte && value.familia == $scope.formlimgraf.familia){
                    alert('Esse registro já existe.');
                    bool = false;
                }
            })

            if (bool){
                LimiteGrafico.create($scope.formlimgraf, function(res, err){
                    console.log(res);
                })
            }

            $state.reload();
            $state.reload();
        }

    }]);