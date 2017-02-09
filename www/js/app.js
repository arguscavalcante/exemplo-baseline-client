  
angular.module('starter', ['ui.router', 'lbServices'])

    .config(function(LoopBackResourceProvider, $stateProvider, $urlRouterProvider) {
        LoopBackResourceProvider.setUrlBase('http://ibm-myskills-server.mybluemix.net/api');
        //LoopBackResourceProvider.setUrlBase('http://localhost:7000/api');
    })
  
    .config(function($stateProvider, $urlRouterProvider) {

        $stateProvider


    //      .state('pesquisa', {
    //      url: '/pesquisa',
    //      cache: false,
    //      templateUrl: 'view/pesquisa.html',
    //      controller: 'pesquisaCtrl'
    //    })

        // LOGIN
        .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'loginCtrl'
        })

        //TESTE
        .state('blank', {
        url: '/blank',
        templateUrl: 'views/blank.html',
        controller: 'blankCtrl'
        })

        //TESTE CHAMADA BANCO
        .state('teste', {
        url: '/teste',
        templateUrl: 'views/teste.html',
        controller: 'testeCtrl'
        });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/login');
    });
