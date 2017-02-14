  
var app = angular.module('starter', ['ui.router', 'lbServices'])

    .config(function(LoopBackResourceProvider, $stateProvider, $urlRouterProvider) {
        //LoopBackResourceProvider.setUrlBase('http://exemplo-baseline-api.mybluemix.net');
        LoopBackResourceProvider.setUrlBase('http://localhost:7000/api');
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

        // BLANK
        .state('blank', {
        url: '/blank',
        templateUrl: 'views/blank.html',
        controller: 'blankCtrl'
        })

        // CONFIG
        .state('config', {
        url: '/config',
        templateUrl: 'views/config.html',
        controller: 'configCtrl'
        })

        // TORRE
        .state('torre', {
        url: '/torre',
        templateUrl: 'views/configtorre.html',
        controller: 'configTorreCtrl'
        })

        // SUBTORRE
        .state('subtorre', {
        url: '/subtorre',
        templateUrl: 'views/configsubtorre.html',
        controller: 'configSubTorreCtrl'
        })

        // USUARIO
        .state('usuario', {
        url: '/usuario',
        templateUrl: 'views/configusuario.html',
        controller: 'configUsuarioCtrl'
        })

        // CONFIG1
        .state('config1', {
        url: '/config1',
        templateUrl: 'views/config.1.html',
        controller: 'configCtrl'
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
