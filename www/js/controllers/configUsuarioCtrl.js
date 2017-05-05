'use strict';

angular
    .module('starter')
    .controller('configUsuarioCtrl', ['$scope', '$state', 'SubTorre', 'User',  function($scope, $state, SubTorre, User){
        console.log('configUsuarioCtrl')

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
        
        $scope.subtorre = {};
        $scope.usuario = {};
        $scope.perfil = {
            model: null,
            opcoes: [
                {nome: 'Administrador'},
                {nome: 'Gerente'},
                {nome: 'Visitante'}
            ]
        };

        var bool = true;
        var familia = "";
        var altera = 'N';

        $scope.formusuario = {};

        $scope.formusuario.login_pass = 'Trocar123';

        var bool = true;

        //Option Familia
        $scope.selectOptionFamilia = function(){
            var options = [];
            angular.forEach($scope.subtorre, function(value,index){
                options.push(value.torre_id + " - " + value.subtorre);
            })

            return options;       
        }

        $scope.alteraUsuario = function(value){
            altera = 'S'
            $scope.formusuario = {
                login_pass: value.login_pass,
                login_user: value.login_user,
                login_nome: value.login_nome,
                perfil: value.perfil,
                familia: value.familia
            }
        }

        // Alimenta com todas as Subtorres
        SubTorre.find().$promise.then(function(res, err){
            $scope.subtorre = res;
            console.log(res);
        });

        //Listar Usuarios
        User.find()
            .$promise
                .then(function(res, err){
                    $scope.usuario = res;
                    // console.log(res);
                    angular.forEach($scope.usuario, function(value, index){
                        familia = ""
                        for(var i=0; i<value.familia.length; i++){
                            familia = familia + value.familia[i] + " , ";
                        }
                        familia = familia.substr(0, familia.length-3);
                        value.familiacons = familia;
                    });
                });            

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
                if (angular.lowercase(value.login_user).replace(/[\s]/g, '') == angular.lowercase($scope.formusuario.login_user.replace(/[\s]/g, '') && altera!='S')){
                    alert('Esse usuário já existe.');
                    bool = false;
                }
            })

            if(altera == 'S'){ 
                bool = false;
                if(confirm('Você deseja alterar esse Usuario?') == false){
                    return;
                }

                User.upsertWithWhere({where: {login_user: ''+ $scope.formusuario.login_user +''}}, 
                                                {login_pass: ''+ $scope.formusuario.login_pass +'', 
                                                login_nome: ''+ $scope.formusuario.login_nome +'',
                                                perfil: ''+ $scope.formusuario.perfil +'',
                                                familia: $scope.formusuario.familia}
                                            , function(info, err) {
                    //console.log(info);
                    $state.reload();
                    return;
                });
            }

            if (bool){
                User.create($scope.formusuario, function(res, err){
                    console.log(res);
                })
            
            }
        
            $state.reload();
        }

        $scope.trocaSenha = function(value) {
            console.log('trocarSenha');
            // console.log(value);
             if(confirm('Deseja trocar a senha desse usuário?') == true){
                User.upsertWithWhere({where: {id: value}}, {login_pass:'Trocar123'}, function(info, err) {
                    //console.log(info);
                    $state.reload();
                    return;
                });
             }
        }

        $scope.excluiUser = function(value) {
            console.log('delete');
            // console.log(value);
             if(confirm('Deseja realmente excluir esse usuário?') == true){
                User.destroyById({id: value}, function(err){
                    $state.reload();
                });
             }
        }

    }]);