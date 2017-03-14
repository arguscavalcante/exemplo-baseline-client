'use strict';

angular
    .module('starter')
    .controller('projetosCtrl', ['$scope', '$state', 'SubTorre', 'User', 'Projeto', 'LimiteReal', 'Fase', 'Regiao', 'ClassGeral', function($scope, $state, SubTorre, User, Projeto, LimiteReal, Fase, Regiao, ClassGeral){
        console.log('projetosCtrl')

        var i;
        var d = new Date();
        var meses = 0;

        $scope.mostrar =[true, false, false, false, false, false, false, false, false, false, false, false, false, false, false]
        $scope.mostrarbotao = [true, false, false, false, false, false, false, false, false, false, false, false, false, false, false]

        $scope.formproj = {};
        $scope.formproj.id = 0;
        $scope.formproj.proposta = 'Sem Linha';

        $scope.projetos = {};
        $scope.limite = {};

        $scope.date = []; 

        $scope.subtorre = {};
        $scope.gerentes = {};
        $scope.fase = {};
        $scope.classificacao_geral = {};
        $scope.regiao = {};
        $scope.sistema = [];
        $scope.projHigh = {};

        /*$scope.classificacao_geral = {
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
        };*/

        $scope.perfil = {
            model: null,
            opcoes: [
                {nome: 'Superusuario'},
                {nome: 'Gerente'},
                {nome: 'Visitante'}
            ]
        };

        //Funcao para incluir e excluir meses
        $scope.funcMes = function (valor){
            if(meses==0 && valor==-1){
                alert('Não há como desabilitar mais meses.');
                return;
            }

            meses = meses + valor;

            for(var i=0; i<$scope.mostrar.length; i++){                
                if(i<=meses){
                    $scope.mostrar[i] = true;
                } else {
                    $scope.mostrar[i] = false;
                }
                
                if (i==meses){
                    $scope.mostrarbotao[i] = true;
                }else{
                    $scope.mostrarbotao[i] = false;
                }
            }
            //console.log('Mostrar: ', $scope.mostrar)
            //console.log('Mostrar Botoes: ', $scope.mostrarbotao)
        }

        //Alimentando os valores de data
        for(i=0; i<15; i++){
            $scope.date.push('-'+d.getMonth()+'/'+d.getFullYear())
            d.setMonth(d.getMonth() + 1);
        }
        for(i=0; i<15; i++){
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

        // Alimenta objeto com todas as Subtorres
        SubTorre.find().$promise.then(function(res, err){
            $scope.subtorre = res;
            console.log(res);
        });

        // Alimenta objeto com todas os Gerentes
        User.find().$promise.then(function(res, err){
            $scope.gerentes = res;
            //console.log(res);
        });

        // Alimenta objeto com todas as Fases
        Fase.find().$promise.then(function(res, err){
            $scope.fase = res;
            //console.log(res);
        });

        // Alimenta objeto com todas as Regiões/Sistemas
        Regiao.find().$promise.then(function(res, err){
            $scope.regiao = res;
            //console.log(res);
            
            angular.forEach($scope.regiao, function(value,index){
                for(var i=0; i<value.Sistemas.length; i++){
                    $scope.sistema.push({regiao: value.Regiao_id, sistema: value.Sistemas[i]});
                }
            });
        });

        ClassGeral.find().$promise.then(function(res, err){         
             $scope.classificacao_geral = res;
            //console.log(res);
        });


        //Option Familia
        $scope.selectOptionFamilia = function(){
            var options = [];
            angular.forEach($scope.subtorre, function(value,index){
                options.push(value.Torre_id + " - " + value.Subtorre);
            })

            return options;       
        }

         //Option Sistema
        $scope.selectOptionSistema = function(){
            var options = [];
            angular.forEach($scope.sistema, function(value,index){
                if (value.regiao == $scope.formproj.regiao){
                    options.push(value.sistema);
                }
            })

            return options;       
        }

        function add(a, b) {
            return a + b;
        }

        function equal(value) {
            var mes;

            for(var i=0; i<value.length; i++){
                mes = value[i];
                for(var j=0; j<value.length; j++){
                    if(i!=j){
                        if(mes==value[j]){
                            return true;
                        }
                    }
                }
            }
        }

        function verificaNulo(value){
            for(var i=0; i<value.length; i++){
                if(value[i]==null || value[i] == ''){
                    return true;
                }
                if(value[i]<= 0){
                    return true;
                }
            }
            return false;
        }


        $scope.ValidaForm = function(){
            var bool = true;
            $scope.formproj.meses = []
            var dados_valor = []
            var dados_mes = []

            //Algum campo indefinido ou Nulo 
            if(angular.isUndefined($scope.formproj.proposta) || angular.isUndefined($scope.formproj.gerente) || angular.isUndefined($scope.formproj.familia) || angular.isUndefined($scope.formproj.sistema) || angular.isUndefined($scope.formproj.classificacao_geral) || angular.isUndefined($scope.formproj.fase))
            {
                alert('Favor, preencha todas as informações!');
                return;
            }

            //Campo vazio com espaço em branco
            if($scope.formproj.fase == '' || $scope.formproj.familia == '' || $scope.formproj.sistema == '' || $scope.formproj.gerente == '' || $scope.formproj.classificacao_geral == '' || $scope.formproj.proposta.replace(/[\s]/g, '') == '' || $scope.formproj.valor_total_proj == '' )
            {
                alert('Favor, preencha todas as informações!');
                return;
            }

            for(i=0; i<=meses; i++){
                $scope.formproj.meses.push({mes: $scope.meses.mes_ano[i], valor: $scope.meses.valor_mes_ano[i]})
                dados_valor.push($scope.meses.valor_mes_ano[i]);
                dados_mes.push($scope.meses.mes_ano[i])
            }
            //console.log(dados_valor.reduce(add));

            if(dados_valor.reduce(add)!=$scope.formproj.valor_total_proj){
                alert('O valor total do projeto é diferente do somatório dos valores informados nos meses!');
                return;
            }

            if(verificaNulo(dados_valor)){
                alert('Informe um valor maior que zero para realizar a inclusão.');
                return;
            }

            if(verificaNulo(dados_mes)){
                alert('Selecione um mes para realizar a inclusão.');
                return;
            }

            if(equal(dados_mes)){
                 alert('Foram informados meses que se repetem, favor olhar os dados informados!');
                return;
            }

            console.log($scope.formproj);

            if (bool){
                Projeto.create($scope.formproj, function(res, err){
                    console.log(res);
                    if(!err){
                        $state.reload();
                    }
                     
                })
            
            }
        
           
        }
/*
        //find, findOne, findById
        function listarProjetos(){
            Projeto.find().$promise.then(function(res, err){
                $scope.projetos = res;
            });
            
        }

        listarProjetos();

        //find, findOne, findById
        function listarLimites(){
            LimiteGrafico.find().$promise.then(function(res, err){
                $scope.limite = res;
            });
            
        }

        listarLimites(); */

    }]);