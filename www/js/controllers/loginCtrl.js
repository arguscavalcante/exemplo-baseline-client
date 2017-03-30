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

    sessionStorage.clear();

    $scope.validaLogin = function(){
        var valida = true;
        // console.log($scope.usuario.nome);

        if($scope.usuario.nome == null || $scope.usuario.senha == null || $scope.usuario.nome.replace(/[\s]/g, '') == '' ||  $scope.usuario.senha.replace(/[\s]/g, '') == '')
        {
            alert('Os campos de login e senha devem ser preenchidos!!');
            return;
        }
        else {
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
                if ( valida ){
                    // Armazena os dados na Sessão(sessionStorage)
                    sessionStorage.setItem('login', $scope.login.login_user);
                    sessionStorage.setItem('perfil', $scope.login.perfil);
                    sessionStorage.setItem('familia', $scope.login.familia);
                    sessionStorage.setItem('nome', $scope.login.login_nome);
                    // console.log(sessionStorage.getItem('nome'));
                    // console.log(sessionStorage.getItem('perfil'));
                    // console.log(sessionStorage.getItem('familia'));
                    $state.go('relatorio');
                }
            });
        }
    };        
}]);

