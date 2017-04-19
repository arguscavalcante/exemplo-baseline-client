'use strict';

angular
    .module('starter')
    .controller('configFaseCtrl', ['$scope', '$state', 'Fase', function($scope, $state, Fase){
        console.log('configFaseCtrl')

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
        
        $scope.fase = {};
        $scope.formfase = {};
        var altera = 'N';

        //find, findOne, findById
        Fase.find()
            .$promise
                .then(function(res){
                    $scope.fase = res;
                    console.log(res);
                })
                .catch(function(err){
                    alert(err.status);
                });

        $scope.alteraFase = function(value){
            altera = 'S'
            $scope.formfase = {
                fase: value.fase,
                descricao: value.descricao,
                id: value.fase
            }
        }

        $scope.ValidaForm = function(){
            var bool = true;

            if($scope.formfase.fase == null || $scope.formfase.descricao == null || $scope.formfase.fase.replace(/[\s]/g, '') == '' ||  $scope.formfase.descricao.replace(/[\s]/g, '') == '')
            {
                alert('Favor, preencha todas as informações!');
                return;
            }
            
            angular.forEach($scope.Fase,function(value,index){
                if (angular.lowercase(value.fase).replace(/[\s]/g, '') == angular.lowercase($scope.formfase.fase).replace(/[\s]/g, '' && alterar!='S')){
                    alert('Esse registro já existe.');
                    bool = false;
                }
            })

            if(altera == 'S'){ 
                bool = false;
                if(confirm('Você deseja alterar essa Fase?') == false){
                    return;
                }

                Fase.upsertWithWhere({where: {fase: ''+ $scope.formfase.fase +''}}, {fase: ''+ $scope.formfase.fase +'', descricao: ''+ $scope.formfase.descricao +''}, function(info, err) {
                    //console.log(info);
                    Fase.destroyById({id: $scope.formfase.id}, function(err){
                        $state.reload();
                        return;
                    });   
                });

            }

            if (bool){
                Fase.create($scope.formfase, function(res, err){
                    $state.reload();
                })
            }
        };

        $scope.deleteFase = function(value) {
            console.log('delete');
            // console.log(value);
             if(confirm('Deseja realmente excluir a Fase?') == true){
                Fase.destroyById({id: value}, function(err){
                    $state.reload();
                });
             }
        };

    }]);