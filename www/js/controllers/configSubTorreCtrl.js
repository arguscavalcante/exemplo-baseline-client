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
        var altera = 'N';
        var d = new Date();
        d.setDate(15);

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
            altera = 'S';
            $scope.formsubtorre = {
                torre_id: value.torre_id,
                subtorre: value.subtorre,
                max_grafico: currencyValue(value.max_grafico),
                ano_limite: value.ano_limite,
                id: value.subtorre,
            }


        }

        $scope.ValidaForm = function(){
            var bool = true;
            if($scope.formsubtorre.torre_id == null || $scope.formsubtorre.subtorre == null || $scope.formsubtorre.torre_id.replace(/[\s]/g, '') == '' ||  $scope.formsubtorre.subtorre.replace(/[\s]/g, '') == '' || $scope.formsubtorre.max_grafico == '0' || $scope.formsubtorre.max_grafico == 'R$ 0,00' || $scope.formsubtorre.max_grafico == null || $scope.formsubtorre.max_grafico.replace(/[\s]/g, '') == '' || $scope.formsubtorre.ano_limite == null)
            {
                alert('Favor, preencha todas as informações!');
                return;
            }

            if($scope.formsubtorre.ano_limite<d.getFullYear()){
                alert('O ano informado é menor que o ano atual!');
                return;
            }
            
            angular.forEach($scope.subtorre, function(value,index){
                if (value.torre_id == $scope.formsubtorre.torre_id && angular.lowercase(value.subtorre).replace(/[\s]/g, '') == angular.lowercase($scope.formsubtorre.subtorre.replace(/[\s]/g, '')) && altera!='S'){
                    alert('Esse registro já existe.');
                    bool = false;
                }
            })

            $scope.formsubtorre.max_grafico = acertaValor($scope.formsubtorre.max_grafico);
            if(altera == 'S'){ 
                bool = false;
                if(confirm('Você deseja alterar essa Subtorre?') == false){
                    return;
                }
                
                SubTorre.upsertWithWhere({where: {subtorre: ''+ $scope.formsubtorre.subtorre +''}}, {torre_id: ''+ $scope.formsubtorre.torre_id +'', subtorre: ''+ $scope.formsubtorre.subtorre +'', max_grafico: ''+ $scope.formsubtorre.max_grafico +'', ano_limite: ''+ $scope.formsubtorre.ano_limite +''}, function(info, err) {
                    //console.log(info);
                    if($scope.formsubtorre.id != $scope.formsubtorre.subtorre){
                        SubTorre.destroyById({id: $scope.formsubtorre.id}, function(err){
                            $state.reload();
                            return;
                        });
                    } else {
                        $state.reload();
                        return;
                    }
                    
                })  
            }

            if (bool){
                SubTorre.create($scope.formsubtorre, function(res, err){
                    //console.log(res);
                    $state.reload();
                })
            }
        }

        function currencyValue(valor){
            var numberString;
            var decimalString;
            var integerString;
            var char;
            var leftZero = '000';
            var contThousand = 0;
            var thousandsFormatted = '';
            var centsSeparator = ','
            var thousandsSeparator = '.';
            var symbol = 'R$ ';

            //PARTE 1 - Limpesa dos dos dados de formatação e retirada dos caracteres inválidos
            // console.log(plainNumber);
            if(valor.toString().indexOf(".")==-1){
                numberString = valor.toString() + '00'
            } else {
                numberString = valor.toString().replace('.','')
            }

            //PARTE 2 - Tratamento para inclusão do filtro
            console.log (numberString);
            
            if(numberString.length<3){
                numberString = leftZero.substring(0, leftZero.length - numberString.length) + numberString
            }

            //PARTE 3 - Inclusão do filtro
            integerString = numberString.substring(0, numberString.length-2); // Separando o valor inteiro para ser tratado pelo milhar
            decimalString = numberString.substring(integerString.length, numberString.length);

            if(integerString.length>3){
                //for para milhar
                // console.log(integerString);
                for(var i=integerString.length; i>0; i--){
                    char = integerString.substr(i-1,1);
                    contThousand++;
                    if(contThousand%3==0){
                        char = thousandsSeparator + char;
                    }
                    thousandsFormatted = char + thousandsFormatted;
                    // console.log(thousandsFormatted);
                }
            }else{
                thousandsFormatted = integerString;
            }

            if(thousandsFormatted.substr(0,1)==thousandsSeparator){
                thousandsFormatted = thousandsFormatted.substring(1, thousandsFormatted.length);
            }

            return symbol + thousandsFormatted + centsSeparator + decimalString;
        }

        $scope.deleteSubtorre = function(value) {
            console.log('delete');
            // console.log(value);
             if(confirm('Deseja realmente excluir a SubTorre?') == true){
                SubTorre.destroyById({id: value}, function(err){
                    $state.reload();
                });
             }
        };

        function acertaValor(value){
            if(value.indexOf("$")==-1){
                return value;
            }else{
                value = value.replace(/[\.|\R|\$]/g, '');
                return value.replace(',', '.'); 
            }
        }

    }])

    .directive("monetariosub",  ['$filter', function($filter) {
        return {
            restrict : "A",
            require: '?ngModel',
            scope: {},
            link: function (scope, elem, attrs, ctrl, ngModel) {
                if (!ctrl) return;
                // if (!ngModel) return; // do nothing if no ng-model

                ctrl.$parsers.unshift(function (viewValue) {
                    var plainNumber;
                    var finalNumber; 
                    var numberString;
                    var decimalString;
                    var integerString;
                    var char;

                    var leftZero = '000';
                    var contThousand = 0;
                    var thousandsFormatted = '';
                    var centsSeparator = ','
                    var thousandsSeparator = '.';
                    var symbol = 'R$ ';

                    //PARTE 1 - Limpesa dos dos dados de formatação e retirada dos caracteres inválidos
                    plainNumber = viewValue.replace(/[\.|\,|\R|\$]/g, '');
                    plainNumber = plainNumber.trim();
                    // console.log(plainNumber);
                    finalNumber = parseInt(plainNumber);

                    //PARTE 2 - Tratamento para inclusão do filtro
                    numberString = finalNumber.toString()
                    // console.log (numberString.length);
                    
                    if(numberString.length<3){
                        numberString = leftZero.substring(0, leftZero.length - numberString.length) + numberString
                    }

                    //PARTE 3 - Inclusão do filtro
                    integerString = numberString.substring(0, numberString.length-2); // Separando o valor inteiro para ser tratado pelo milhar
                    decimalString = numberString.substring(integerString.length, numberString.length);

                    if(integerString.length>3){
                        //for para milhar
                        // console.log(integerString);
                        for(var i=integerString.length; i>0; i--){
                            char = integerString.substr(i-1,1);
                            contThousand++;
                            if(contThousand%3==0){
                                char = thousandsSeparator + char;
                            }
                            thousandsFormatted = char + thousandsFormatted;
                            // console.log(thousandsFormatted);
                        }
                    }else{
                        thousandsFormatted = integerString;
                    }

                    if(thousandsFormatted.substr(0,1)==thousandsSeparator){
                        thousandsFormatted = thousandsFormatted.substring(1, thousandsFormatted.length);
                    }

                    // // Specify how UI should be updated
                    // ngModel.$render = function() {
                    //     element.html(ngModel.$viewValue || '');
                    // };
                    // read();

                    // // Write data to the model
                    // function read() {
                    //     ngModel.$setViewValue(elem.val(symbol + thousandsFormatted + centsSeparator + decimalString));
                    // }
                    elem.val(symbol + thousandsFormatted + centsSeparator + decimalString);
                    // valor = symbol + thousandsFormatted + centsSeparator + decimalString
                    return symbol + thousandsFormatted + centsSeparator + decimalString;
                });

                
            }
        };
    }]);