'use strict';

app.controller('loginCtrl', ['$scope', '$state', '$window', '$rootScope', 'User', function($scope, $state, $window, $rootScope, User){
    console.log('loginCtrl')
    
    var usuario = {
            "nome":"",
            "senha": ""
    };

    $scope.usuario = usuario; //Valida se o usuario foi digitado

    $scope.login = {}; //Grava as informações para realizar a validação

    var valida; //Variavel responsável por armazenar o retorno

    function load ()
    {
        $scope.usuario.nome = JSON.parse($window.localStorage.getItem('nome'));
        $scope.usuario.senha = JSON.parse($window.localStorage.getItem('senha'));
    }

    load();

    $scope.goTo = function(pagina)
    {
        if($scope.usuario.nome == null || $scope.usuario.senha == null)
        {
            alert('Os campos de login e senha devem ser preenchidos!!');
        }
        else {

            validaLogin();

            if ( valida ){
                alert('entrei3');
                $window.localStorage.setItem('nome', JSON.stringify($scope.usuario.nome));
                $window.localStorage.setItem('senha', JSON.stringify($scope.usuario.senha));

                $rootScope.usuario = $scope.usuario;
                console.log($scope.usuario.nome);
                $state.go(pagina);
            }
        }
    };

    //find, findOne, findById
    function validaLogin(){
        alert('entrei2');
        User.find({filter:{where: {login_user: '' + $scope.usuario.nome + ''}}}).$promise.then(function(res, err){

            $scope.login = res[0];

            if(res.length == 0){
                alert('Usuário não cadastrado!');
                valida = false;
                return;
            }
            if($scope.login.login_pass != $scope.usuario.senha){
                alert('Senha incorreta!');
                valida = false;
                return;
            }
            valida = true;
        });
    }
        
}]);

