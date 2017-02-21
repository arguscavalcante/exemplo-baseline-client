'use strict';

app.controller('loginCtrl', ['$scope', '$state', '$rootScope', 'User', function($scope, $state, $rootScope, User){
    console.log('loginCtrl')
    
 /*   var usuario = {
            "nome":"",
            "senha": ""
    };
*/
    $scope.usuario = {}; //Valida se o usuario foi digitado

    $scope.login = {}; //Grava as informações para realizar a validação

    var valida; //Variavel responsável por armazenar o retorno

/*    function load ()
    {
        $scope.usuario.nome = JSON.parse($window.localStorage.getItem('nome'));
        $scope.usuario.senha = JSON.parse($window.localStorage.getItem('senha'));
    }

    load();*/

    $scope.validaLogin = function(pagina)
    {
        console.log($scope.usuario.nome);

        if($scope.usuario.nome == null || $scope.usuario.senha == null || $scope.usuario.nome.replace(/[\s]/g, '') == '' ||  $scope.usuario.senha.replace(/[\s]/g, '') == '')
        {
            alert('Os campos de login e senha devem ser preenchidos!!');
        }
        else {

            Login();

            if ( valida ){
              
            /*    $window.localStorage.setItem('nome', JSON.stringify($scope.usuario.nome));
                $window.localStorage.setItem('senha', JSON.stringify($scope.usuario.senha));

                $rootScope.usuario = $scope.usuario; */
                console.log($scope.usuario.nome);
                $state.go(pagina);
            }
        }
    };

    //find, findOne, findById
    function Login(){
 
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

