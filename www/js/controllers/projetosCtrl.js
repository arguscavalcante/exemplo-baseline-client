'use strict';

angular
    .module('starter')
    .controller('projetosCtrl', ['$scope', '$state', 'Torre', 'SubTorre', 'User',  function($scope, $state, Torre, SubTorre, User){
        console.log('projetosCtrl')

        $scope.torre = {};
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

        //Options Torre
        function selectOptionTorres(){
            Torre.find().$promise.then(function(res, err){
                $scope.torre = res;
                console.log(res);
            });
            
        }

        selectOptionTorres();

        // Alimenta com todas as Subtorres
        SubTorre.find().$promise.then(function(res, err){
            $scope.subtorre = res;
            console.log(res);
        });

        //Option SubTorre
        $scope.selectOptionSubTorres = function(){
            var options = [];
            angular.forEach($scope.subtorre, function(value,index){
                if (value.Torre_id == $scope.formusuario.torre){
                    options.push(value.Subtorre);
                }
            })

            return options;       
        }

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