'use strict';

angular
    .module('starter')
    .controller('configUsuarioCtrl', ['$scope', '$state', 'SubTorre', 'User',  function($scope, $state, SubTorre, User){
        console.log('configUsuarioCtrl')

        $scope.subtorre = {};
        $scope.usuario = {};
        $scope.perfil = {
            model: null,
            opcoes: [
                {nome: 'Superusuario'},
                {nome: 'Gerente'},
                {nome: 'Visitante'}
            ]
        };

        var bool = true;

        $scope.formusuario = {};

        $scope.formusuario.login_pass = 'Trocar123';

        var bool = true;

        //Option Familia
        $scope.selectOptionFamilia = function(){
            var options = [];
            angular.forEach($scope.subtorre, function(value,index){
                options.push(value.Torre_id + " - " + value.Subtorre);
            })

            return options;       
        }

        // Alimenta com todas as Subtorres
        SubTorre.find().$promise.then(function(res, err){
            $scope.subtorre = res;
            console.log(res);
        });

        //Listar Usuarios
        function listarUsuarios(){
            User.find().$promise.then(function(res, err){
                $scope.usuario = res;
                console.log(res);
            });
            
        }

        listarUsuarios();

        $scope.ValidaForm = function(){
            console.log($scope.formusuario);
            
            if(angular.isUndefined($scope.formusuario.familia) || angular.isUndefined($scope.formusuario.perfil) || angular.isUndefined($scope.formusuario.login_user) || angular.isUndefined($scope.formusuario.login_nome) )
            {
                alert('Favor, preencha todas as informações!');
                return;
            }

            if($scope.formusuario.familia == '' || $scope.formusuario.perfil == '' || $scope.formusuario.login_user.replace(/[\s]/g, '') == '' ||  $scope.formusuario.login_nome.replace(/[\s]/g, '') == '')
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
                User.create($scope.formusuario, function(res, err){
                    console.log(res);
                })
            
            }
        
            $state.reload();
        }

    }]);