'use strict';

angular
    .module('starter')
    .controller('projetosCtrl', ['$scope', '$state', 'SubTorre', 'User', 'Projeto',  function($scope, $state, SubTorre, User, Projeto){
        console.log('projetosCtrl')

        var i;
        var d = new Date();
        var bool = true;

        $scope.formproj = {};
        $scope.formproj.id = 0;
        $scope.formproj.proposta = 'Sem Linha';

        $scope.projetos = {};

        $scope.date = []; 

        $scope.subtorre = {};
        $scope.gerentes = {};
        $scope.projHigh = {};

        $scope.classificacao_geral = {
            model: null,
            opcoes: [
                {nome: 'Aprovado'},
                {nome: 'Aprovado Autonomia'},
                {nome: 'Pipeline Aprovado com Cronograma'},
                {nome: 'Pipeline Aprovado sem Cronograma'},
                {nome: 'Pipeline Aprovado Autonomia'},
                {nome: 'Pipeline'},
                {nome: 'Extra Baseline'},
                {nome: 'Pipeline Extra Baseline'}
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

        $scope.regiao = {
            model: null,
            opcoes: [
                {nome: 'R1'},
                {nome: 'R2'}
            ]
        };

        $scope.sistema = {
            opcoes: [
                {regiao: 'R1', nome: 'Teste R1 SEL1'},
                {regiao: 'R2', nome: 'Teste R2 SEL1'},
                {regiao: 'R1', nome: 'Teste R1 SEL2'},
                {regiao: 'R2', nome: 'Teste R2 SEL2'},
                {regiao: 'R1', nome: 'Teste R1 SEL3'},
                {regiao: 'R2', nome: 'Teste R2 SEL3'}
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

        //Option Familia
        $scope.selectOptionFamilia = function(){
            var options = [];
            angular.forEach($scope.subtorre, function(value,index){
                options.push(value.Torre_id + " - " + value.Subtorre);
            })

            return options;       
        }

        // Alimenta com todas os Gerentes
        User.find().$promise.then(function(res, err){
            $scope.gerentes = res;
            console.log(res);
        });

         //Option Sistema
        $scope.selectOptionSistema = function(){
            var options = [];
            angular.forEach($scope.sistema.opcoes, function(value,index){
                if (value.regiao == $scope.formproj.regiao){
                    options.push(value.nome);
                }
            })

            return options;       
        }


        $scope.ValidaForm = function(){
            console.log($scope.formproj);
            
            //Algum campo indefinido ou Nulo 
            if(angular.isUndefined($scope.formproj.proposta) || angular.isUndefined($scope.formproj.gerente) || angular.isUndefined($scope.formproj.familia) || angular.isUndefined($scope.formproj.sistema) || angular.isUndefined($scope.formproj.classificacao_geral) || angular.isUndefined($scope.formproj.fase) || angular.isUndefined($scope.formproj.mes_ano) || angular.isUndefined($scope.formproj.valor_mes_ano))
            {
                 alert('Favor, preencha todas as informações!');
                return;
            }

            //Campo vazio com espaço em branco
            if($scope.formproj.mes_ano == '' || $scope.formproj.fase == '' || $scope.formproj.familia == '' || $scope.formproj.sistema == '' || $scope.formproj.gerente == '' || $scope.formproj.classificacao_geral == '' || $scope.formproj.proposta.replace(/[\s]/g, '') == '' ||  $scope.formproj.valor_mes_ano.replace(/[\s]/g, '') == '')
            {
                alert('Favor, preencha todas as informações!');
                return;
            }
            
            /*angular.forEach($scope.usuario, function(value,index){
                if (angular.lowercase(value.login_user).replace(/[\s]/g, '') == angular.lowercase($scope.formusuario.login_user.replace(/[\s]/g, ''))){
                    alert('Esse usuário já existe.');
                    bool = false;
                }
            })*/

            if (bool){
                Projeto.create($scope.formproj, function(res, err){
                    console.log(res);
                })
            
            }
        
            $state.reload();
        }

        //find, findOne, findById
        function listarProjetos(){
            Projeto.find().$promise.then(function(res, err){
                $scope.projetos = res;
            });
            
        }

        listarProjetos();

    }]);