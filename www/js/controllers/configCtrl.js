'use strict';

angular
    .module('starter')
    .controller('configCtrl', ['$scope', '$state', 'LimiteReal', function($scope, $state, LimiteReal){
        console.log('configCtrl')

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

        var d = new Date();
        var mes_ano = '-'+d.getMonth()+'/'+d.getFullYear();

        mes_ano = mes_ano.replace('-0/','01/');
        mes_ano = mes_ano.replace('-1/','02/');
        mes_ano = mes_ano.replace('-2/','03/');
        mes_ano = mes_ano.replace('-3/','04/');
        mes_ano = mes_ano.replace('-4/','05/');
        mes_ano = mes_ano.replace('-5/','06/');
        mes_ano = mes_ano.replace('-6/','07/');
        mes_ano = mes_ano.replace('-7/','08/');
        mes_ano = mes_ano.replace('-8/','09/');
        mes_ano = mes_ano.replace('-9/','10/');
        mes_ano = mes_ano.replace('-10/','11/');
        mes_ano = mes_ano.replace('-11/','12/');

        $scope.message = '';
        $scope.message_mes = '';

        $scope.limreal = {}

        //find, findOne, findById
        function verificarLimReal(){
            LimiteReal.find({filter:{where: {mes_ano_limite: '' + mes_ano + ''}}}).$promise.then(function(res, err){
                $scope.limreal = res;

                if(res.length == 0){
                   $scope.message = 'Não foi encontrado registro para o Limite Real do mes: ';
                   $scope.message_mes = mes_ano
                }
            });
        }

        verificarLimReal();

    }]);