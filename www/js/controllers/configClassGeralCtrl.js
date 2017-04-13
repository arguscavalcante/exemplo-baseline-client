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

        $scope.mostrar = {};
        $scope.user = {};
        $scope.user = {
            gerente: sessionStorage.getItem('login'),
            perfil: sessionStorage.getItem('perfil'),
            familia: sessionStorage.getItem('familia').split(","),
            nome: sessionStorage.getItem('nome')
        }
        $scope.consolidado = false;

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
                    if(value.baseline){
                        value.basetabela = 'SIM';
                    }else{
                        value.basetabela = 'NÃO';
                    }                
                })
                
            });
            
        }

        listarClassGeral();

        $scope.alteraClassGeral = function(value){
            altera = 'S'
            $scope.formclassgeral = {
                classgeral_id: value.classgeral_id,
                baseline: value.baseline,
                classgeral_pai: value.classgeral_pai
            }
            $scope.consolidado = !angular.isUndefined(value.classgeral_pai)
        }

        $scope.ValidaForm = function(){
            bool = true;
   
            if($scope.formclassgeral.classgeral_id == null || $scope.formclassgeral.classgeral_id.replace(/[\s]/g, '') == '')
            {
                alert('Favor, preencha todas as informações!');
                return;
            }
            

            if(altera == 'S'){ 
                bool = false;
                if(confirm('Você deseja alterar essa Classificação Geral?') == false){
                    return;
                }
                console.log($scope.formclassgeral);
                ClassGeral.upsertWithWhere({where: {classgeral_id: ""+ $scope.formclassgeral.classgeral_id +""}}, {classgeral_id: ""+ $scope.formclassgeral.classgeral_id +"", classgeral_pai: ""+ $scope.formclassgeral.classgeral_pai +"", baseline: ""+ $scope.formclassgeral.baseline +""}, function(info, err) {
                    //console.log(info);
                    $state.reload();
                })

            }else{
                angular.forEach($scope.classgeral,function(value,index){
                    if (angular.lowercase(value.classgeral_id).replace(/[\s]/g, '') == angular.lowercase($scope.formclassgeral.classgeral_id).replace(/[\s]/g, '')){
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
        };

        $scope.deleteClassGeral = function(value) {
            console.log('delete');
            // console.log(value);
             if(confirm('Deseja realmente excluir a Classificação Geral?') == true){
                ClassGeral.destroyById({id: value}, function(err){
                    $state.reload();
                });
             }
        };

    }]);