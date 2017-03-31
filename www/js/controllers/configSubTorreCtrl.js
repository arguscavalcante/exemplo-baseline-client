'use strict';

angular
    .module('starter')
    .controller('configSubTorreCtrl', ['$scope', '$state', 'Torre', 'SubTorre',  function($scope, $state, Torre, SubTorre){
        console.log('configSubTorreCtrl')

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
        
        $scope.torre = {};
        $scope.subtorre = {};
        $scope.formsubtorre = {};
        var bool = true;
        var altera = 'N';

        //find, findOne, findById
        Torre.find().$promise.then(function(res, err){
            $scope.torre = res;
            // console.log(res);
        });

        //find, findOne, findById
        SubTorre.find().$promise.then(function(res, err){
            $scope.subtorre = res;
            // console.log(res);
        });

        $scope.alteraSubtorre = function(value){
            altera = 'S'
            $scope.formsubtorre = {
                torre_id: value.torre_id,
                subtorre: value.subtorre,
                max_grafico: value.max_grafico,
                ano_limite: value.ano_limite
            }


        }

        $scope.ValidaForm = function(){

            if($scope.formsubtorre.torre_id == null || $scope.formsubtorre.subtorre == null || $scope.formsubtorre.torre_id.replace(/[\s]/g, '') == '' ||  $scope.formsubtorre.subtorre.replace(/[\s]/g, '') == '')
            {
                alert('Favor, preencha todas as informações!');
                return;
            }
            
            angular.forEach($scope.subtorre, function(value,index){
                if (value.torre_id == $scope.formsubtorre.torre_id && angular.lowercase(value.subtorre).replace(/[\s]/g, '') == angular.lowercase($scope.formsubtorre.subtorre.replace(/[\s]/g, '')) && alterar!='S'){
                    alert('Esse registro já existe.');
                    bool = false;
                }
            })

            if(altera == 'S'){ 
                if(confirm('Você deseja alterar essa Subtorre?') == false){
                    return;
                }

                bool = false;
                
                SubTorre.upsertWithWhere({where: {subtorre: ''+ $scope.formsubtorre.subtorre +''}}, {max_grafico: ''+ $scope.formsubtorre.max_grafico +'', ano_limite: ''+ $scope.formsubtorre.ano_limite +''}, function(info, err) {
                    //console.log(info);
                    $state.reload();
                    return;
                })  
            }

            if (bool){
                SubTorre.create($scope.formsubtorre, function(res, err){
                    //console.log(res);
                    $state.reload();
                })
            
            }
        }

    }]);