'use strict';

angular
    .module('starter')
    .controller('configLimiteBaseCtrl', ['$scope', '$state', '$filter', 'LimiteGrafico', 'SubTorre', 'LimiteReal', 'Projeto', 'ClassGeral', 'Regiao',  function($scope, $state, $filter, LimiteGrafico, SubTorre, LimiteReal, Projeto, ClassGeral, Regiao){
        console.log('configLimiteBaseCtrl')

         // Controle de sessao
        if(sessionStorage.getItem('login')==null || sessionStorage.getItem('perfil')==null || sessionStorage.getItem('familia')==null ){
            alert('Usuário não autenticado pelo Sistema!!')
            $state.go('login');
        }
        
        if(sessionStorage.getItem('perfil')!='Administrador'){
            alert('Usuário sem permissão para acessar essa página!');
            $state.go('relatorio');
        }

        var zero = "00"
        $scope.mostrar = {};
        $scope.user = {};
        $scope.familia = [];
        $scope.sistemas = [];
        $scope.baseline = 0
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
        
        var i;
        var d = new Date();
        d.setDate(15);

        $scope.date = []; 

        $scope.limgrafico = {};
        $scope.formlimgraf = {};
        $scope.subtorre = {};
        $scope.projeto = {};
        $scope.classgeral =[];
        $scope.limreal = {};

        $scope.formlimgraf.valor_limite = 0;

        //find, findOne, findById
        LimiteGrafico.find()
            .$promise
                .then(function(res, err){
                    $scope.limgrafico = res
                    // console.log(res);
                    angular.forEach($scope.limgrafico, function(value, index){
                        if(value.torre == ''){
                            value.utilizatorre = 'SIM';
                        }else{
                            value.utilizatorre = 'NÃO';
                        }   
                        value.data_tab = trasformVizualDate(value.data_corte.toString())             
                    })
                    // console.log($scope.limgrafico)

                    LimiteReal.find()
                        .$promise
                            .then(function(res, err){
                                $scope.limreal = res;
                                console.log(res);
                            });
                });
            
        function alimentaData(data, qnt, obj){
            var date = new Date(data)
            var vetor = [];
            var mes;
            var zero = '00'
            for(i=0; i<qnt; i++){
                mes = date.getMonth()+1;
                mes = mes.toString();
                mes = zero.substring(0, zero.length - mes.length) + mes
                if(obj){
                    vetor.push( {valor:date.getFullYear()+mes, texto: mes + '/' + date.getFullYear()});
                }else{
                    vetor.push( mes + '/' + date.getFullYear());
                }
                date.setMonth(date.getMonth() + 1);
            }
            // console.log(vetor);
            return vetor;
        }

        $scope.date = alimentaData(d, 15, true);
        
        function criarObjLimiteReal(form){
            console.log('formulario da base:', form);
            $scope.formlimreal = {familia: form.familia, dados:[]};
            var data;
            var data_vetor = [];
            var dados_proj = [];
            var dados_depend = [];
            var torre_baseline = 0;
            var dados_torre_gasto = [];
            var meses_acima = "";
            var ret = true;
            var val_baseline = 0;
            var valida_val = 0;
            var selecionado;
            var posicao = 0;
            var prim_dep = 'N';

            data = trasformParDate($scope.formlimgraf.data_corte);
            // console.log('data selecionada:', data);
            // console.log(data);
            data_vetor = alimentaData(data, 48, false);
            console.log(data_vetor);

             for (var i = 0; i < data_vetor.length; i++) {
                dados_proj.push(0);
                dados_depend.push('N');
                dados_torre_gasto.push(0); 
            }
            if(form.torre!=null && form.variacao_torre!=null){
                torre_baseline = form.valor_limite * form.variacao_torre/100;
            }
            
            angular.forEach($scope.projeto, function (value, index) {
                if ($scope.classgeral.includes(value.classificacao_geral) && value.familia == form.familia) {
                    for (var i = 0; i < data_vetor.length; i++) {
                        for(var j=0; j<value.meses.length; j++){
                            if (data_vetor[i] == value.meses[j].mes) {
                                dados_proj[i] = dados_proj[i] + value.meses[j].valor;
                                dados_proj[i] = Math.round(dados_proj[i] * 100)/100;
                                //pegar os dados da torre e verificar seu Sistema verificar para retirada desse loop daqui!!!
                                for(var k=0; k<$scope.sistemas.length; k++){
                                    if($scope.sistemas[k].familia != value.familia && $scope.sistemas[k].torre == form.torre && $scope.sistemas[k].regiao == value.regiao){
                                        if($scope.sistemas[k].sistemas.includes(value.sistema)){
                                            dados_torre_gasto[i] = dados_torre_gasto[i] + value.meses[j].valor;
                                            dados_torre_gasto[i] = Math.round(dados_torre_gasto[i] * 100)/100;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });

            // console.log('Valores dos Projetos: ', dados_proj);

            //Acerto dos valores de dependencia para registros existentes
            if ($scope.limreal.length > 0){

                angular.forEach($scope.date, function(value, index){
                    if (value.valor == $scope.formlimgraf.data_corte){
                        // console.log(value.texto);
                        selecionado = value.texto;
                    }
                })

                angular.forEach($scope.limreal, function(value, index){
                    if(value.familia == form.familia){
                        for(var i=0; i<value.dados.length; i++){
                            if(value.dados[i].mes == selecionado){
                                posicao = i;
                                prim_dep = value.dados[i].dependencia;
                            }    
                        }
                        console.log(posicao);
                        value.dados.splice(posicao, value.dados.length-posicao);
                        console.log($scope.limreal);
                    } 
                });
            }

            //Acertando os valores de dependencia
            val_baseline = form.valor_limite + (form.valor_limite * form.variacao/-100);
            console.log('valor calculado de baseline: ', val_baseline);
            for(var i=0; i<dados_proj.length; i++){
                if(i==0){
                    dados_depend[i] = prim_dep; // atribuindo o primeiro sinal dependendo do retorno da busca do banco
                }
                if(dados_proj[i] >= val_baseline && dados_depend[i] == 'N'){
                    if(!angular.isUndefined(dados_depend[i+1])){
                        dados_depend[i+1] = 'S';
                    }
                }
            }
            console.log('Valores de dependencias: ', dados_depend);

            //Validar valores de projetos x Baseline
            for(var i=0; i<dados_proj.length; i++){

                if(dados_depend[i]=='N'){
                    valida_val = form.valor_limite + (form.valor_limite * form.variacao/100);
                    if(dados_proj[i]>valida_val){
                        meses_acima = data_vetor[i] + ', ' + meses_acima;
                        ret = false;
                    }
                }else{
                    valida_val = form.valor_limite + (form.valor_limite - dados_proj[i-1]);
                    if(dados_proj[i]>valida_val){
                        meses_acima = data_vetor[i] + ', ' + meses_acima;
                        ret = false;
                    }
                }
            }
            
            if(!ret){
                alert('Os meses esão com seu baseline ultrapassando o limite sugerido! \n' + meses_acima.substring(0, meses_acima.length -2));
                return ret;
            }

            //incluir os dados do projeto restantes
            angular.forEach($scope.limreal, function(value, index){
                if(value.familia == form.familia){
                    for(var i=0; i<value.dados.length; i++){
                         $scope.formlimreal.dados.push(value.dados[i]);
                    }
                }
            })
            
            for(var i=0; i<data_vetor.length; i++){
                $scope.formlimreal.dados.push(
                        {   mes: data_vetor[i], 
                            baseline: form.valor_limite,
                            baseline_bonus: 0,
                            gasto_mes: dados_proj[i], 
                            perc_baseline: form.variacao,
                            dependencia: dados_depend[i],
                            torre: form.torre,
                            perc_torre: form.variacao_torre,
                            torre_gasto: dados_torre_gasto[i],
                            torre_baseline: torre_baseline
                        });
            }
            console.log('limite real: ', $scope.formlimreal)
            return ret;
        }

        //funcao de trasnformação para data -- FACTORY
        function trasformParDate(value) {
            return value.substring(0, 4) + '-' + value.substring(4, value.length) + '-15';
        }

        // Alimenta com todas as Subtorres
        SubTorre.find().$promise.then(function(res, err){
            $scope.subtorre = res;
            angular.forEach(res, function(value, index){
                $scope.familia.push({torre: value.torre, familia: value.torre_id + " - " + value.subtorre})
            });
            Regiao.find()
                .$promise
                    .then(function(res, err){
                        for(var i=0; i<$scope.familia.length; i++){
                            angular.forEach(res, function(value, index){
                                if(value.familia == $scope.familia[i].familia){
                                    $scope.sistemas.push({familia: value.familia, torre: $scope.familia[i].torre, regiao:value.regiao, sistemas:value.sistemas})
                                }
                            })
                        }
                    });
            //console.log(res);
        });

        // Alimenta a selecao da pagina
        $scope.selectOptionFamilia = function(){
            var options = [];
            angular.forEach($scope.subtorre, function(value,index){
                options.push(value.torre_id + " - " + value.subtorre);
            })

            return options;       
        }

        // Alimenta com os Projetos
        Projeto.find()
            .$promise
                .then(function(res, err){
                    $scope.projeto = res;
                });

        //funcao de trasnformação para data para vizualizacao em tela -- FACTORY
        function trasformVizualDate(value) {
            var mes;
            mes = value.substring(5, value.length);
            return zero.substring(0, zero.length - mes.length) + mes + '/' + value.substring(0, 4);
        }

        $scope.atribuirTorre = function(){
            $scope.formlimgraf.torre = $scope.formlimgraf.familia.substring(0, $scope.formlimgraf.familia.indexOf("-")-1);
        }

        $scope.ValidaForm = function(){
            console.log($scope.formlimgraf)

            if($scope.formlimgraf.data_corte == null || $scope.formlimgraf.familia == null || $scope.formlimgraf.valor_limite == null || $scope.formlimgraf.variacao == null )
            {
                alert('Favor, preencha todas as informações!');
                return;
            }
            if($scope.baseline == '' || $scope.baseline <= 0 )
            {
                alert('O valor do Baseline deve ser maior que zero!');
                return;
            }else{
                $scope.formlimgraf.valor_limite = $scope.baseline/100;
            }

            if($scope.formlimgraf.variacao == '' || $scope.formlimgraf.variacao < 0 )
            {
                alert('O valor mímino da variação é zero!');
                return;
            }
            
            angular.forEach($scope.limgrafico,function(value,index){
                if (value.data_corte == $scope.formlimgraf.data_corte && value.familia == $scope.formlimgraf.familia){
                    alert('Esse registro já existe.');
                    bool = false;
                }
            })

            //console.log($scope.disptorre);
            if($scope.disptorre){
                 if($scope.formlimgraf.variacao_torre == null || $scope.formlimgraf.variacao_torre < 0){
                    alert('O valor mímino da variação da Torre é zero!');
                    return;
                 }
            } else {
                $scope.formlimgraf.torre = null;
                $scope.formlimgraf.variacao_torre = null;
            }
            console.log($scope.formlimgraf)

            // Alimenta com todas as Classificacoes Gerais que interferem no baseline
            ClassGeral.find({ filter: { where: {baseline: true}} })
                .$promise
                    .then(function(res, err){
                        // console.log(res);
                        angular.forEach(res, function(value,index){
                            $scope.classgeral.push(value.classgeral_id)
                        })
                        
                        if (criarObjLimiteReal($scope.formlimgraf)){

                            $scope.formlimgraf.id = $scope.formlimgraf.data_corte + $scope.formlimgraf.familia.replace(/[\s]/g, '');
                            console.log($scope.formlimreal.dados);
                            LimiteGrafico.create($scope.formlimgraf, function(res, err){
                                //console.log(res);
                                LimiteReal.find({filter:{where: {familia: ''+ $scope.formlimreal.familia +''}}})
                                    .$promise
                                        .then(function(res){
                                            if(res.length > 0){
                                                LimiteReal.upsertWithWhere({where: {familia: ''+ $scope.formlimreal.familia +''}}, {dados: $scope.formlimreal.dados}, function(res, err){
                                                    $state.reload();
                                                })
                                            } else {
                                                LimiteReal.create($scope.formlimreal, function(res, err){
                                                    $state.reload();
                                                })
                                            }
                                        })
                                        .catch(function(err){
                                            alert(err.status);
                                        });
                            })
                        }
                    })
        }
               
        $scope.deleteBaseline = function(value) {
            console.log('delete');

            var mesAno=[];
            var validaData = new Date();
            validaData.setDate(15);

            mesAno = alimentaData(validaData, 1, true);

            if(parseInt(mesAno[0].valor)>value.data_corte){
                alert('O registro não pode ser excluido por ser menor que o mes atual!')
            }else{
                if(confirm('Deseja realmente excluir o Baseline?') == true){
                    LimiteGrafico.destroyById({id: value.id}, function(err){
                        $state.reload();
                    });
                }
            }
        };

    }])

    .directive("monetario",  ['$filter', function($filter) {
        return {
            restrict : "A",
            require: '?ngModel',
            scope: {},
            link: function (scope, elem, attrs, ctrl, ngModel) {
                if (!ctrl) return;
                if (!ngModel) return; // do nothing if no ng-model

                ctrl.$parsers.unshift(function (viewValue) {
                    console.log(viewValue);
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

                    // Specify how UI should be updated
                    ngModel.$render = function() {
                        element.html(ngModel.$viewValue || '');
                    };
                    read();

                    // Write data to the model
                    function read() {
                        ngModel.$setViewValue(elem.val(symbol + thousandsFormatted + centsSeparator + decimalString));
                    }
                    // elem.val(symbol + thousandsFormatted + centsSeparator + decimalString);
                    // valor = symbol + thousandsFormatted + centsSeparator + decimalString
                    return symbol + thousandsFormatted + centsSeparator + decimalString;
                });

                
            }
        };
    }]);