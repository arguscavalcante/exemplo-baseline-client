  
var app = angular.module('starter', ['ui.router', 'lbServices', 'angularUtils.directives.dirPagination'])

    .config(function(LoopBackResourceProvider, $stateProvider, $urlRouterProvider) {
        LoopBackResourceProvider.setUrlBase('https://exemplo-baseline-api.mybluemix.net/api');
        // LoopBackResourceProvider.setUrlBase('http://localhost:7000/api');
    })
  
    .config(function($stateProvider, $urlRouterProvider) {

        $stateProvider

        // LOGIN
        .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'loginCtrl'
        })

        // BLANK - IMPORTACAO
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
        
        // ALTERAÇÃO DE PROJETOS
        .state('alteraproj', {
        url: '/alteraproj',
        templateUrl: 'views/alteraproj.html',
        controller: 'alteraprojCtrl'
        })
        
        // CONFIG
        .state('config', {
        url: '/config',
        templateUrl: 'views/config.html',
        controller: 'configCtrl'
        })
        
        // FASE
        .state('fase', {
        url: '/fase',
        templateUrl: 'views/configfase.html',
        controller: 'configFaseCtrl'
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
        
        // REGIAO
        .state('regiao', {
        url: '/regiao',
        templateUrl: 'views/configregiao.html',
        controller: 'configRegiaoCtrl'
        })

        // SISTEMA
        .state('sistema', {
        url: '/sistema',
        templateUrl: 'views/configsistema.html',
        controller: 'configSistemaCtrl'
        })
        
        // SISTEMA
        .state('classgeral', {
        url: '/classgeral',
        templateUrl: 'views/configclassgeral.html',
        controller: 'configClassGeralCtrl'
        })

        // LIMITE BASELINE
        .state('limitebase', {
        url: '/limitebase',
        templateUrl: 'views/configlimitebase.html',
        controller: 'configLimiteBaseCtrl'
        })

        // RACIONAL
        .state('racional', {
        url: '/racional',
        templateUrl: 'views/configracional.html',
        controller: 'configRacionalCtrl'
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
