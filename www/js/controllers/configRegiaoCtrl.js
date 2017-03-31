'use strict';

angular
    .module('starter')
    .controller('configRegiaoCtrl', ['$scope', '$state', 'Regiao', 'SubTorre',  function($scope, $state, Regiao, SubTorre){
        console.log('configRegiaoCtrl')

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
        
        $scope.regiao = {};
        $scope.subtorre = {};
        $scope.formregiao = {};

        $scope.formregiao.sistemas = []
        var bool = true;

        // Alimenta com todas as Regioes
        Regiao.find()
            .$promise
                .then(function(res, err){
                    $scope.regiao = res;
                    // console.log(res);
                });

        // Alimenta com todas as Subtorres
        SubTorre.find()
            .$promise
                .then(function(res, err){
                    $scope.subtorre = res;
                    // console.log(res);
                });

        //Option Familia
        $scope.selectOptionFamilia = function(){
            var options = [];
            angular.forEach($scope.subtorre, function(value,index){
                options.push(value.torre_id + " - " + value.subtorre);
            })

            return options;       
        }

        $scope.ValidaForm = function(){
            // console.log($scope.formregiao);

            if($scope.formregiao.regiao == null || $scope.formregiao.descricao == null || $scope.formregiao.familia == null || $scope.formregiao.familia == '' || $scope.formregiao.regiao.replace(/[\s]/g, '') == '' ||  $scope.formregiao.descricao.replace(/[\s]/g, '') == '')
            {
                alert('Favor, preencha todas as informações!');
                return;
            }

            $scope.formregiao.id_regiao = angular.lowercase($scope.formregiao.regiao).replace(/[\s]/g, '') + angular.lowercase($scope.formregiao.familia).replace(/[\s]/g, '');
            // console.log($scope.formregiao.id_regiao);

            angular.forEach($scope.regiao,function(value,index){
                if (angular.lowercase(value.regiao).replace(/[\s]/g, '') == angular.lowercase($scope.formregiao.regiao).replace(/[\s]/g, '') && value.familia == $scope.formregiao.familia){
                    alert('Esse registro já existe.');
                    bool = false;
                }
            })

            if (bool){
                Regiao.create($scope.formregiao, function(res, err){
                    // console.log(res);
                    $state.reload();
                })
            }
        }

    }]);