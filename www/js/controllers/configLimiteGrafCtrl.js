'use strict';

angular
    .module('starter')
    .controller('configLimiteGrafCtrl', ['$scope', '$state', 'LimiteGrafico', 'SubTorre', 'LimiteReal', 'Projeto', 'ClassGeral',  function($scope, $state, LimiteGrafico, SubTorre, LimiteReal, Projeto, ClassGeral){
        console.log('configLimiteGrafCtrl')

        var i;
        var d = new Date();
        var bool = true;

        $scope.date = []; 

        $scope.limgrafico = {};
        $scope.formlimgraf = {};
        $scope.subtorre = {};
        $scope.projeto = {};
        $scope.classgeral =[];
        $scope.limreal = {};

        $scope.formlimgraf.id = 0;

        //find, findOne, findById
        function listarLimGraf(){
            LimiteGrafico.find().$promise.then(function(res, err){
                $scope.limgrafico = res
                //angular.forEach(res, function(value, index){
                //    $scope.limgrafico.Data_corte = trasformVizualDate(value.Data_corte)
                //});
                //console.log($scope.limgrafico)
            });

            LimiteReal.find().$promise.then(function(res, err){
                $scope.limreal = res;
            })
            
        }

        listarLimGraf();

        function alimentaData(d, qnt){
            //Alimentando os valores de data
            for(i=0; i < qnt; i++){
                $scope.date.push({valor:d.getFullYear()+'/-'+d.getMonth(), texto:'-'+d.getMonth()+'/'+d.getFullYear()})
                d.setMonth(d.getMonth() + 1);
            }
            //console.log($scope.date);
            for(i=0; i<qnt; i++){
                $scope.date[i].texto = $scope.date[i].texto.replace('-0/','01/');
                $scope.date[i].texto = $scope.date[i].texto.replace('-1/','02/');
                $scope.date[i].texto = $scope.date[i].texto.replace('-2/','03/');
                $scope.date[i].texto = $scope.date[i].texto.replace('-3/','04/');
                $scope.date[i].texto = $scope.date[i].texto.replace('-4/','05/');
                $scope.date[i].texto = $scope.date[i].texto.replace('-5/','06/');
                $scope.date[i].texto = $scope.date[i].texto.replace('-6/','07/');
                $scope.date[i].texto = $scope.date[i].texto.replace('-7/','08/');
                $scope.date[i].texto = $scope.date[i].texto.replace('-8/','09/');
                $scope.date[i].texto = $scope.date[i].texto.replace('-9/','10/');
                $scope.date[i].texto = $scope.date[i].texto.replace('-10/','11/');
                $scope.date[i].texto = $scope.date[i].texto.replace('-11/','12/');

                $scope.date[i].valor = $scope.date[i].valor.replace('/-0','01');
                $scope.date[i].valor = $scope.date[i].valor.replace('/-11','12');
                $scope.date[i].valor = $scope.date[i].valor.replace('/-10','11');
                $scope.date[i].valor = $scope.date[i].valor.replace('/-1','02');
                $scope.date[i].valor = $scope.date[i].valor.replace('/-2','03');
                $scope.date[i].valor = $scope.date[i].valor.replace('/-3','04');
                $scope.date[i].valor = $scope.date[i].valor.replace('/-4','05');
                $scope.date[i].valor = $scope.date[i].valor.replace('/-5','06');
                $scope.date[i].valor = $scope.date[i].valor.replace('/-6','07');
                $scope.date[i].valor = $scope.date[i].valor.replace('/-7','08');
                $scope.date[i].valor = $scope.date[i].valor.replace('/-8','09');
                $scope.date[i].valor = $scope.date[i].valor.replace('/-9','10');
            }
        }

        alimentaData(d, 15);

        function alimentaData2(data, qnt){
            
            var vetor = [];
            for(i=0; i<15; i++){
                vetor.push('-'+data.getMonth()+'/'+data.getFullYear())
                data.setMonth(data.getMonth() + 1);
            }
            for(i=0; i<15; i++){
                vetor[i] = vetor[i].replace('-0/','01/');
                vetor[i] = vetor[i].replace('-1/','02/');
                vetor[i] = vetor[i].replace('-2/','03/');
                vetor[i] = vetor[i].replace('-3/','04/');
                vetor[i] = vetor[i].replace('-4/','05/');
                vetor[i] = vetor[i].replace('-5/','06/');
                vetor[i] = vetor[i].replace('-6/','07/');
                vetor[i] = vetor[i].replace('-7/','08/');
                vetor[i] = vetor[i].replace('-8/','09/');
                vetor[i] = vetor[i].replace('-9/','10/');
                vetor[i] = vetor[i].replace('-10/','11/');
                vetor[i] = vetor[i].replace('-11/','12/');
            }
            return vetor;
        }
        
        function criarObjLimiteReal(form){

            $scope.formlimreal = {id: 0,familia: form.familia, dados:[]};
            var data;
            var data_vetor = [];
            var dados_proj = [];
            var meses_acima = "";
            var ret = true;
            var val_baseline = 0;

            for(var i=0; i< $scope.date.length; i++){
                if($scope.date[i].valor==form.Data_corte){
                    data = new Date(trasformParDate($scope.date[i].texto))
                }
            }
            // console.log(data);
            data_vetor = alimentaData2(data, 15);
             //console.log(data_vetor);

             for (var i = 0; i < data_vetor.length; i++) {
                dados_proj.push(0);
            }

            angular.forEach($scope.projeto, function (value, index) {
                //console.log($scope.classgeral.includes(value.classificacao_geral));
                if ($scope.classgeral.includes(value.classificacao_geral) && value.familia == form.familia) {
                    for (var i = 0; i < data_vetor.length; i++) {
                        for(var j=0; j<value.meses.length; j++){
                            if (data_vetor[i] == value.meses[j].mes) {
                                dados_proj[i] = dados_proj[i] + value.meses[j].valor;
                            }
                        }
                    }
                }
            });
            console.log('Valores dos Projetos: ', dados_proj);
            //console.log('projetos',$scope.projeto);

            val_baseline = form.valor_limite 
            //console.log(val_baseline);
            for(var i=0; i<dados_proj.length; i++){
                if(dados_proj[i]>val_baseline){
                    meses_acima = data_vetor[i] + ', ' + meses_acima;
                    ret = false;
                }
            }
            
            if(!ret){
                alert('Os meses esão com seu baseline ultrapassando o limite sugerido! \n' + meses_acima.substring(0, meses_acima.length -2));
                return ret;
            }
            
            for(var i=0; i<data_vetor.length; i++){
                $scope.formlimreal.dados.push(
                        {   mes: data_vetor[i], 
                            baseline: val_baseline,
                            baseline_bonus: 0,
                            gasto_mes: dados_proj[i], 
                            perc_baseline: $scope.formlimgraf.variacao,
                            dependencia: 'N',
                            torre: $scope.formlimgraf.torre,
                            perc_torre: $scope.formlimgraf.variacao_torre
                        });
            }
            return ret;
            //console.log($scope.formlimreal);
        }

        //funcao de trasnformação para data -- FACTORY
        function trasformParDate(value) {
            return value.substring(3, value.length) + '-' + value.substring(0, 2) + '-15';
        }

        // Alimenta com todas as Subtorres
        SubTorre.find().$promise.then(function(res, err){
            $scope.subtorre = res;
            //console.log(res);
        });

        // Alimenta a selecao da pagina
        $scope.selectOptionFamilia = function(){
            var options = [];
            angular.forEach($scope.subtorre, function(value,index){
                options.push(value.Torre_id + " - " + value.subtorre);
            })

            return options;       
        }

         // Alimenta com os Projetos
        Projeto.find().$promise.then(function(res, err){
            $scope.projeto = res;
            //console.log(res);
        });

        // Alimenta com todas as Classificacoes Gerais que interferem no baseline
        ClassGeral.find({ filter: { where: {Baseline: true}} }).$promise.then(function(res, err){
            //console.log(res);
            angular.forEach(res, function(value,index){
                $scope.classgeral.push(value.ClassGeral_id)
            })
        });

        //funcao de trasnformação para data para vizualizacao em tela -- FACTORY
        function trasformVizualDate(value) {
            //console.log(value.substring(0, 4) + '/' + value.substring(5, value.length));
            return value.substring(0, 4) + '/' + value.substring(5, value.length) ;
        }

        $scope.atribuirTorre = function(){
            $scope.formlimgraf.torre = $scope.formlimgraf.familia.substring(0, $scope.formlimgraf.familia.indexOf("-")-1);
        }

        $scope.ValidaForm = function(){

            if($scope.formlimgraf.Data_corte == null || $scope.formlimgraf.familia == null || $scope.formlimgraf.valor_limite == null || $scope.formlimgraf.variacao == null )
            {
                alert('Favor, preencha todas as informações!');
                return;
            }
            if($scope.formlimgraf.valor_limite == '' || $scope.formlimgraf.valor_limite <= 0 )
            {
                alert('O valor do Limite deve ser maior que zero!');
                return;
            }
            if($scope.formlimgraf.variacao == '' || $scope.formlimgraf.variacao < 0 )
            {
                alert('O valor mímino da variação é zero!');
                return;
            }
            
            angular.forEach($scope.limgrafico,function(value,index){
                if (value.Data_corte == $scope.formlimgraf.Data_corte && value.familia == $scope.formlimgraf.familia){
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
            //console.log($scope.formlimgraf)

            bool = criarObjLimiteReal($scope.formlimgraf);

            console.log($scope.formlimreal)
            console.log(bool);
            if (bool){
                LimiteGrafico.create($scope.formlimgraf, function(res, err){
                    //console.log(res);
                    LimiteReal.create($scope.formlimreal, function(res, err){
                        $state.reload();
                    })
                })
            }
        }

    }]);