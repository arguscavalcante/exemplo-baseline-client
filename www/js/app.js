  
var app = angular.module('starter', ['ui.router', 'lbServices'])

    .config(function(LoopBackResourceProvider, $stateProvider, $urlRouterProvider) {
        LoopBackResourceProvider.setUrlBase('https://exemplo-baseline-api.mybluemix.net/api');
        //LoopBackResourceProvider.setUrlBase('http://localhost:7000/api');
    })
  
    .config(function($stateProvider, $urlRouterProvider) {

        $stateProvider

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

        // CADASTRO DE PROJETOS
        .state('projetos', {
        url: '/projetos',
        templateUrl: 'views/projetos.html',
        controller: 'projetosCtrl'
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

        // LIMITE GRAFICO
        .state('limitegraf', {
        url: '/limitegraf',
        templateUrl: 'views/configlimitegraf.html',
        controller: 'configLimiteGrafCtrl'
        })

        // LIMITE REAL
        .state('limitereal', {
        url: '/limitereal',
        templateUrl: 'views/configlimitereal.html',
        controller: 'configLimiteRealCtrl'
        })

        // USUARIO
        .state('usuario', {
        url: '/usuario',
        templateUrl: 'views/configusuario.html',
        controller: 'configUsuarioCtrl'
        })

        //RELATORIO
        .state('relatorio', {
        url: '/relatorio',
        templateUrl: 'views/relatorio.html',
        controller: 'relatorioCtrl'
        });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/login');
    });
