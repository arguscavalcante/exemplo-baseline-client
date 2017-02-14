'use strict';

app.controller('loginCtrl', ['$scope', '$state', '$window', '$rootScope', 'User', function($scope, $state, $window, $rootScope, User){
    console.log('loginCtrl')
    
    var usuario = {
            "nome":"",
            "senha": ""
    };

    $scope.usuario = usuario; //Valida se o usuario foi digitado

    $scope.login = {}; //Valida o usuario cadastrado no banco

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
            if ( validaLogin() ){
                alert('entrei2');
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
        //User.find({where: {and: [{login: 'admin'}, {senha: 'adm123'}]}}), function(res, err, users){
        User.find({ where: {login:'admin'} }), function(res, err){
            console.log(res);
           
        };
    }
        


  /*  User.findOne({email: req.body.email, password: req.body.password}, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            if (user) {
                res.json({
                    type: false,
                    data: "User already exists!"
                });
            } else {
                var userModel = new User();
                userModel.email = req.body.email;
                userModel.password = req.body.password;
                userModel.save(function(err, user) {
                    user.token = jwt.sign(user, process.env.JWT_SECRET);
                    user.save(function(err, user1) {
                        res.json({
                            type: true,
                            data: user1,
                            token: user1.token
                        });
                    });
                })
            }
        }
    });*/

}]);

