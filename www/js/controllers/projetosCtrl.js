'use strict';

angular
    .module('starter')
    .controller('projetosCtrl', ['$scope', '$state', 'Torre', 'SubTorre', 'User',  function($scope, $state, Torre, SubTorre, User){
        console.log('projetosCtrl')

        var i;
        var d = new Date();
        $scope.date = []; 

        $scope.subtorre = {};

        $scope.classificacao_geral = {
            model: null,
            opcoes: [
                {nome: 'Aprovado'},
                {nome: 'Aprovado Autonomia'},
                {nome: 'Pipeline Aprovado com Cronograma '},
                {nome: 'Pipeline Aprovado sem Cronograma'},
                {nome: 'Pipeline Aprovado Autonomia'}
            ]
        };

        $scope.fase = {
            model: null,
            opcoes: [
                {nome: 'VSOL'},
                {nome: 'DSOL'},
                {nome: 'VDSOL'},
                {nome: 'DESENV'},
                {nome: 'TI-UAT'},
                {nome: 'Suporte TI'}
            ]
        };

        $scope.sistema = {
            model: null,
            opcoes: [
                {nome: 'R1'},
                {nome: 'R2'}
            ]
        };

        $scope.perfil = {
            model: null,
            opcoes: [
                {nome: 'Superusuario'},
                {nome: 'Gerente'},
                {nome: 'Visitante'}
            ]
        };

        var bool = true;

        $scope.formproj = {};

        // Alimenta com todas as Subtorres
        SubTorre.find().$promise.then(function(res, err){
            $scope.subtorre = res;
            console.log(res);
        });

        //Alimentando os valores de data
        $scope.date.push(d)
        for(i=1; i<12; i++){
            //d.add(1, 'month');
            d.setMonth(d.getMonth() + 1);
            $scope.date.push(d)
        }

        console.log($scope.date)
        //Option Familia
        $scope.selectOptionFamilia = function(){
            var options = [];
            angular.forEach($scope.subtorre, function(value,index){
                options.push(value.Torre_id + " - " + value.Subtorre);
            })

            return options;       
        }

        $scope.ValidaForm = function(){
            console.log($scope.formusuario);
            
            if(angular.isUndefined($scope.formusuario.torre) || angular.isUndefined($scope.formusuario.subtorre) || angular.isUndefined($scope.formusuario.perfil) || angular.isUndefined($scope.formusuario.login_user) || angular.isUndefined($scope.formusuario.login_nome) )
            {
                 alert('Favor, preencha todas as informações!');
                return;
            }

            if($scope.formusuario.torre == '' || $scope.formusuario.subtorre == '' || $scope.formusuario.perfil == '' || $scope.formusuario.login_user.replace(/[\s]/g, '') == '' ||  $scope.formusuario.login_nome.replace(/[\s]/g, '') == '')
            {
                alert('Favor, preencha todas as informações!');
                return;
            }
            
            angular.forEach($scope.usuario, function(value,index){
                if (angular.lowercase(value.login_user).replace(/[\s]/g, '') == angular.lowercase($scope.formusuario.login_user.replace(/[\s]/g, ''))){
                    alert('Esse usuário já existe.');
                    bool = false;
                }
            })

            if (bool){
               /* User.create($scope.formusuario, function(res, err){
                    console.log(res);
                })*/
            
            }
        
            $state.reload();
        }

    }]);