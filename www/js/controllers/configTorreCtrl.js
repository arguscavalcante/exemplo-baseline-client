'use strict';

angular
    .module('starter')
    .controller('configTorreCtrl', ['$scope', '$state', 'Torre',  function($scope, $state, Torre){
        console.log('configTorreCtrl')

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
        
        $scope.torre = {};
        $scope.formtorre = {};
        var bool = true;

        //find, findOne, findById
        function listarTorres(){
            Torre.find().$promise.then(function(res, err){
                $scope.torre = res;
                console.log(res);
            });
            
        }

        listarTorres();

        $scope.ValidaForm = function(){
            bool = true;
            if($scope.formtorre.torre == null || $scope.formtorre.descricao_torre == null || $scope.formtorre.torre.replace(/[\s]/g, '') == '' ||  $scope.formtorre.descricao_torre.replace(/[\s]/g, '') == '')
            {
                alert('Favor, preencha todas as informações!');
                return;
            }
            
            angular.forEach($scope.torre,function(value,index){
                if (angular.lowercase(value.torre).replace(/[\s]/g, '') == angular.lowercase($scope.formtorre.torre).replace(/[\s]/g, '')){
                    alert('Esse registro já existe.');
                    bool = false;
                }
            })

            if (bool){
                Torre.create($scope.formtorre, function(res, err){
                    console.log(res);
                    $state.reload();
                })
            }
        }

        $scope.deleteTorre = function(value) {
            console.log('delete');
            // console.log(value);
             if(confirm('Deseja realmente excluir a Torre?') == true){
                Torre.destroyById({id: value}, function(err){
                    $state.reload();
                });
             }
        };

    }]);