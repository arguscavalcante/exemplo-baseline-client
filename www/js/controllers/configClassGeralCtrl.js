'use strict';

angular
    .module('starter')
    .controller('configClassGeralCtrl', ['$scope', '$state', 'ClassGeral', 'Projeto',  function($scope, $state, ClassGeral, Projeto){
        console.log('configClassGeralCtrl')

        // Controle de sessao
        if(sessionStorage.getItem('login')==null || sessionStorage.getItem('perfil')==null || sessionStorage.getItem('familia')==null ){
            alert('Usuário não autenticado pelo Sistema!!')
            $state.go('login');
        }
        
        if(sessionStorage.getItem('perfil')=='Visitante'){
            alert('Usuário sem permissão para acessar essa página!');
            $state.go('relatorio');
        }

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

        $scope.classgeral = {};
        $scope.formclassgeral = {};
        var bool = true;
        var altera = 'N';

        //find, findOne, findById
        function listarClassGeral(){
            ClassGeral.find().$promise.then(function(res, err){
                $scope.classgeral = res;
                console.log(res);
                angular.forEach($scope.classgeral, function(value, index){
                    if(value.Baseline){
                        value.BaseTabela = 'SIM';
                    }else{
                        value.BaseTabela = 'NÃO';
                    }                
                })
            });
            
        }

        listarClassGeral();

        $scope.alteraClassGeral = function(value){
            altera = 'S'
            $scope.formclassgeral = {
                ClassGeral_id: value.ClassGeral_id,
                Descricao: value.Descricao,
                Baseline: value.Baseline
            }
        }

        $scope.ValidaForm = function(){
            bool = true;



            if($scope.formclassgeral.ClassGeral_id == null || $scope.formclassgeral.Descricao == null || $scope.formclassgeral.ClassGeral_id.replace(/[\s]/g, '') == '' ||  $scope.formclassgeral.Descricao.replace(/[\s]/g, '') == '')
            {
                alert('Favor, preencha todas as informações!');
                return;
            }

            if(altera == 'S'){ 
                if(confirm('Você deseja alterar essa Classificação Geral?') == false){
                    return;
                }
                console.log($scope.formclassgeral);
                Projeto.find({filter:{where: {classificacao_geral: '' + $scope.formclassgeral.ClassGeral_id + ''}}}).$promise.then(function(res, err){
                    //console.log(res);
                    if(res.length != 0){
                        if(confirm('Existem projetos cadastrados com essa Classificação geral, deseja continuar?') == false){
                            bool = false;
                        }else{
                            ClassGeral.updateAll({where: {ClassGeral_id: ""+ $scope.formclassgeral.ClassGeral_id +""}}, {ClassGeral_id: ""+ $scope.formclassgeral.ClassGeral_id +"" , Descricao: ""+ $scope.formclassgeral.Descricao +"", Baseline: ""+ $scope.formclassgeral.Baseline +""}, function(info, err) {
                                //console.log(info);
                                $state.reload();
                            })
                            bool = false;
                        }
                    }
                });

            }else{
                angular.forEach($scope.classgeral,function(value,index){
                    if (angular.lowercase(value.ClassGeral_id).replace(/[\s]/g, '') == angular.lowercase($scope.formclassgeral.ClassGeral_id).replace(/[\s]/g, '')){
                        alert('Esse registro já existe.');
                        bool = false;
                    }
                })
            }

            if (bool){
                ClassGeral.create($scope.formclassgeral, function(res, err){
                    console.log(res);
                    $state.reload();
                })
            }
        }

    }]);