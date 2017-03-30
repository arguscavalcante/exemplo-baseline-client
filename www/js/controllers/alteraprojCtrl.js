'use strict';

angular
    .module('starter')
    .controller('alteraprojCtrl', ['$scope', '$state', 'Projeto', 'Regiao', 'LimiteReal', 'Fase', 'ClassGeral', function($scope, $state, Projeto, Regiao, LimiteReal, Fase, ClassGeral){
        console.log('alteraprojCtrl')

         // Controle de sessao
        if(sessionStorage.getItem('login')==null || sessionStorage.getItem('perfil')==null || sessionStorage.getItem('familia')==null ){
            alert('Usuário não autenticado pelo Sistema!!')
            $state.go('login');
        }
        
        if(sessionStorage.getItem('perfil')=='Visitante'){
            alert('Usuário sem permissão para acessar essa página!');
            $state.go('relatorio');
        }

        var d = new Date(15);
        $scope.projeto = [];
        $scope.tabela = [];
        $scope.filtroResult = {};
        $scope.formaltproj = {};
        $scope.sistema = [];
        $scope.classgeral = [];
        $scope.sortKey = 'projeto';
        $scope.reverse = !$scope.reverse;
        $scope.qnt = [5, 10, 15, 20];

        $scope.formLimReal = {};
        $scope.tabelapag = [];
        $scope.baseline_red = [];
        var qnt_meses = 1;

        var num = 15; //centralizando as atribuicoes de loop

        $scope.baseline= {data: [], valor:[]}; 
        $scope.valida_baseline= {data: [], valor:[]}; 

        $scope.buscar = true;
        $scope.mostrar = true;
        $scope.mostrar_sel = false;
        $scope.alterar = false;

        $scope.filtroResult.qnt_itens = 5;

        $scope.formaltproj.meses =[{mes: "", valor: 0}]

        var meses = 0;
        $scope.user = {};
        $scope.mostrar = {};
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

        var bool = true;

         $scope.atualizaPag = function(){
            $state.reload();
        }

        // Alimenta objeto com todos os Projetos
        Projeto.find()
            .$promise
                .then(function(res, err){
                    // $scope.projeto = res;
                    console.log(res);
                    angular.forEach(res, function(value, index){
                        if($scope.user.familia.includes(value.familia)){
                            $scope.projeto.push(value);
                        } 
                })
            // Alimenta objeto com todas as Regiões/Sistemas
            Regiao.find().$promise.then(function(res, err){
                $scope.regiao = res;
                console.log(res);
                
                angular.forEach($scope.regiao, function(value,index){
                    for(var i=0; i<value.sistemas.length; i++){
                        $scope.sistema.push({regiao: value.regiao, sistema: value.sistemas[i], familia: value.familia});
                    }
                });
            });
        });

        //Funcao para incluir e excluir meses
        $scope.funcMes = function(valor){
            if(valor==-1){
                $scope.formaltproj.meses.splice($scope.formaltproj.meses.length-1, 1);
                $scope.baseline_red.push($scope.baseline_red.length-1, 1);
            } else {
                if($scope.formaltproj.meses.length<num){
                    $scope.formaltproj.meses.push({mes: "", valor:0});
                    $scope.baseline_red.push("");
                }
            }
        }

        //FACTORY
        function alimentaData(data, qnt){
            var vetor = [];
            var date = new Date(data);
            var mes;
            var zero = '00'
            //Alimentando os valores de data
             for (var i = 0; i < qnt; i++) {
                mes = date.getMonth()+1;
                mes = mes.toString();
                mes = zero.substring(0, zero.length - mes.length) + mes
                vetor.push( mes + '/' + date.getFullYear());
                date.setMonth(date.getMonth() + 1);
            }

            return vetor;
        }

        //Option Sistema
        $scope.selectOptionSistema = function(){
            var options = [];
            angular.forEach($scope.sistema, function(value,index){
                if (value.regiao == $scope.filtroResult.regiao){
                    options.push(value.sistema);
                }
            })

            return options;       
        }

        $scope.atribuiBaseline = function(value){
            // console.log(value);
            // console.log($scope.formaltproj.meses[value].mes);
            for(var i=0; i<$scope.baseline.data.length; i++){
                if($scope.baseline.data[i] == $scope.formaltproj.meses[value].mes){
                   $scope.baseline_red[value]=$scope.baseline.valor[i] + $scope.formaltproj.meses[value].valor;
                }
            }
            // return value;
        }

        $scope.limparFiltros = function(){
            $scope.filtroResult.familia = "";
            $scope.filtroResult.sistema = "";
            $scope.filtroResult.projeto = "";
            $scope.filtroResult.descricao = "";
        }

        $scope.ordenar = function(keyname){
            $scope.sortKey = keyname;
            $scope.reverse = !$scope.reverse;
        };

        //Option Familia
        $scope.selectOptionFamilia = function(){
            var options = $scope.user.familia;
            return options;       
        }

        //Option Regiao
        $scope.selectOptionRegiao = function(){
            var options = [];
            angular.forEach($scope.regiao, function(value,index){
                if (value.familia == $scope.formaltproj.familia){
                    options.push(value.regiao);
                }
            })

            return options;       
        }

        //Option Sistema
        $scope.selectOptionSistemaform = function(){
            var options = [];
            angular.forEach($scope.sistema, function(value,index){
                if (value.regiao == $scope.formaltproj.regiao && value.familia == $scope.formaltproj.familia){
                    options.push(value.sistema);
                }
            })

            return options;       
        }

        function sumMes(obj){
            var total = 0;
            angular.forEach(obj, function(value, index){
                total = total + value.valor;
            });
            return total;
        }

        $scope.sumMesPage= function(){
            var total = 0;
            angular.forEach($scope.formaltproj.meses, function(value, index){
                total = total + value.valor;
            });
            $scope.formaltproj.valor_total_proj = total;
            return total;
            // console.log(total);
        }

        function alimentaValor(vetor, objLimite, busca, tabela){
            var valor = [];
            var k;
            var val_baseline = 0;
            var val_mesant = 0;
            var bool_familia = true;
            for(var i=0; i<vetor.length; i++){
                valor.push(0)
            }           

            // console.log('limite: ', objLimite)
            angular.forEach(objLimite, function(value, index){
                if(value.familia == busca){
                    bool_familia = false;
                    for(var i=0; i<value.dados.length; i++){
                        for(var j=0; j<vetor.length; j++){
                            if(vetor[j]==value.dados[i].mes){
                                val_baseline = value.dados[i].baseline;
                                val_mesant = 0;
                                if (value.dados[i].dependencia == 'S'){
                                    k = i-1;
                                    if (!angular.isUndefined(value.dados[k])){
                                        if (value.dados[k].gasto_mes >= value.dados[k].baseline + value.dados[k].baseline*value.dados[k].perc_baseline/-100){
                                            val_mesant = value.dados[k].baseline - value.dados[k].gasto_mes;
                                        }
                                    }
                                } 
                                if(val_mesant==0 && !tabela){
                                   val_mesant = (value.dados[i].baseline * value.dados[i].perc_baseline/100)
                                }
                                // console.log(val_mesant);
                                valor[i] = val_baseline - value.dados[i].gasto_mes + val_mesant + value.dados[i].baseline_bonus;
                            }
                        }
                    }
                }
            });

            if(bool_familia){
                alert('A família ' + busca + ' não está parametrizada! Entre em contato com o Administrador.')
                return -1;
            }

            if(valor.includes(0)){
                alert('Não há valores de limite real parametrizados para um ou mais meses. Favor, informar ao Administrador.');
            }
            return valor;
        }

        $scope.baseline.data = alimentaData(d,num);

        function equal(value) {
            var mes;

            for(var i=0; i<value.length; i++){
                mes = value[i].mes;
                for(var j=0; j<value.length; j++){
                    if(i!=j){
                        if(mes==value[j].mes){
                            return true;
                        }
                    }
                }
            }
        }

        function verificaNulo(value){
            for(var i=0; i<value.length; i++){
                if(value[i].mes==null || value[i].mes == ''){
                    return true;
                }
                if(value[i].value<= 0){
                    return true;
                }
            }
            return false;
        }

        $scope.alteraProj = function(value){
            $scope.tabela = [];

            $scope.tabela.push({
                projeto: value.projeto,
                proposta: value.proposta,
                classificacao_geral: value.classificacao_geral,
                fase: value.fase,
                familia: value.familia,
                sistema: value.sistema,
                valor_total_proj: value.valor_total_proj
            });

            $scope.formaltproj = {
                projeto_id: value.projeto_id,
                projeto: value.projeto,
                proposta: value.proposta,
                gerente: value.gerente,
                classificacao_geral: value.classificacao_geral,
                regiao: value.regiao,
                sistema: value.sistema,
                fase: value.fase,
                familia: value.familia,
                sistema: value.sistema,
                valor_total_proj: value.valor_total_proj,
                meses: value.meses
            };

            $scope.projantigo = {
                id: value.projeto_id,
                projeto: value.projeto,
                proposta: value.proposta,
                gerente: value.gerente,
                classificacao_geral: value.classificacao_geral,
                regiao: value.regiao,
                sistema: value.sistema,
                fase: value.fase,
                familia: value.familia,
                sistema: value.sistema,
                valor_total_proj: value.valor_total_proj,
                meses: value.meses
            };

            // console.log($scope.baseline_red)

            // // Alimenta objeto com todas os Gerentes
            // User.find().$promise.then(function(res, err){
            //     $scope.gerentes = res;
            //     //console.log(res);
            // });

            // Alimenta objeto com todas as Fases
            Fase.find().$promise.then(function(res, err){
                $scope.fase = res;
                //console.log(res);
            });

            // Alimenta objeto com todas os Limites Reais
            LimiteReal.find().$promise.then(function(res, err){
                $scope.limite = res;
                //console.log(res);
                $scope.baseline.valor = alimentaValor($scope.baseline.data, $scope.limite, $scope.projantigo.familia, false);
                $scope.tabelapag = alimentaValor($scope.baseline.data, $scope.limite, $scope.projantigo.familia, true);

                for(var i=0; i<$scope.baseline.data.length; i++){
                    for(var j=0; j<$scope.formaltproj.meses.length; j++){
                        if($scope.baseline.data[i] == $scope.formaltproj.meses[j].mes){
                            $scope.baseline_red.push($scope.baseline.valor[i]+ $scope.formaltproj.meses[j].valor);
                        }
                    }               
                }
            });

            ClassGeral.find().$promise.then(function(res, err){         
                $scope.classificacao_geral = res;
                //console.log(res);
                 angular.forEach($scope.classificacao_geral, function(value,index){
                    if(value.Baseline){
                        $scope.classgeral.push(value.ClassGeral_id)
                    }
                })
            });

            //console.log($scope.tabela);
            $scope.buscar = false;
            $scope.mostrar = false;
            $scope.mostrar_sel = true;
            $scope.alterar = true;
        }

        $scope.ValidaForm = function(){
            var bool = true;
            var achei = false;

            //Algum campo indefinido ou Nulo 
            if(angular.isUndefined($scope.formaltproj.proposta) || angular.isUndefined($scope.formaltproj.gerente) || angular.isUndefined($scope.formaltproj.familia) || angular.isUndefined($scope.formaltproj.sistema) || angular.isUndefined($scope.formaltproj.classificacao_geral) || angular.isUndefined($scope.formaltproj.fase))
            {
                alert('Favor, preencha todas as informações!');
                return;
            }

            //Campo vazio com espaço em branco
            if($scope.formaltproj.fase == '' || $scope.formaltproj.familia == '' || $scope.formaltproj.sistema == '' || $scope.formaltproj.gerente == '' || $scope.formaltproj.classificacao_geral == '' || $scope.formaltproj.proposta.replace(/[\s]/g, '') == '' || $scope.formaltproj.valor_total_proj == '' )
            {
                alert('Favor, preencha todas as informações!');
                return;
            }

            //Verificar valor vazio de meses.
            if($scope.formaltproj.meses.length == 0)
            {
                alert('Favor, inclua a distribuição dos valores por mes!');
                return;
            }

            // console.log($scope.formaltproj.meses);
            // console.log(sumMes($scope.formaltproj.meses));
            // console.log($scope.formaltproj.valor_total_proj);
            if(sumMes($scope.formaltproj.meses)!=$scope.formaltproj.valor_total_proj){
                alert('O valor total do projeto é diferente do somatório dos valores informados nos meses!');
                return;
            }

            if(verificaNulo($scope.formaltproj.meses)){
                alert('Informe um valor maior que zero para realizar a inclusão.');
                return;
            }

            if(verificaNulo($scope.formaltproj.meses)){
                alert('Selecione um mes para realizar a inclusão.');
                return;
            }

            if(equal($scope.formaltproj.meses)){
                 alert('Foram informados meses que se repetem, favor olhar os dados informados!');
                return;
            }

            // console.log($scope.formaltproj);
            if ($scope.classgeral.includes($scope.formaltproj.classificacao_geral)){
                angular.forEach($scope.formaltproj.meses, function(value, index){
                    for(var i=0; i<$scope.baseline.data.length; i++){
                        achei = false;
                        if(value.mes==$scope.baseline.data[i]){
                            for(var j=0; j<$scope.projantigo.meses.length; j++){
                                if(value.mes==$scope.projantigo.meses[j].mes){
                                    achei = true;
                                    if(value.valor>$scope.baseline.valor[i]+$scope.projantigo.meses[j].valor){
                                        alert('O valor imposto no mes ' + value.mes + ' é maior que o Baseline!');
                                        bool = false;
                                        return;
                                    }       
                                }
                            }
                            if(!achei){
                                if(value.valor>$scope.baseline.valor[i]){
                                    alert('O valor imposto no mes ' + value.mes + ' é maior que o Baseline!2');
                                    bool = false;
                                    return;
                                }
                            }
                        }
                    }
                })
            }

            // Validacao nivel 2 com o Banco de dados
            LimiteReal.find().$promise.then(function(res, err){
                $scope.limValidacao = res;
                //console.log(res);
                if ($scope.classgeral.includes($scope.formaltproj.classificacao_geral)){
                    $scope.valida_baseline.valor = alimentaValor($scope.valida_baseline.data, $scope.limValidacao, $scope.projantigo.familia, false);
                    angular.forEach($scope.formaltproj.meses, function(value, index){
                        for(var i=0; i<$scope.baseline.data.length; i++){
                            achei = false;
                            if(value.mes==$scope.baseline.data[i]){
                                for(var j=0; j<$scope.projantigo.meses.length; j++){
                                    if(value.mes==$scope.projantigo.meses[j].mes){
                                        achei = true;
                                        if(value.valor>$scope.baseline.valor[i]+$scope.projantigo.meses[j].valor){
                                            alert('O valor imposto no mes ' + value.mes + ' é maior que o Baseline!');
                                            bool = false;
                                            return;
                                        }       
                                    }
                                }
                                if(!achei){
                                    if(value.valor>$scope.baseline.valor[i]){
                                        alert('O valor imposto no mes ' + value.mes + ' é maior que o Baseline!2');
                                        bool = false;
                                        return;
                                    }
                                }
                            }                       
                        }
                    })
                }

                //criando a variavel com os valores atualizados para incluir na tabela de LimiteReal.
                if(bool){
                    $scope.formLimReal.dados = {};
                    $scope.formLimReal = $scope.limValidacao;
                    if ($scope.classgeral.includes($scope.formaltproj.classificacao_geral)){
                        //retirar valores antigos
                        angular.forEach($scope.formLimReal, function(value, index){
                            if(value.familia == $scope.user.familia){
                                for(var j=0; j<value.dados.length; j++){
                                    for(var i=0; i<$scope.projantigo.meses.length; i++){
                                        var k = j+1;
                                        var dependencia = '';
                                        if(value.dados[j].mes==$scope.projantigo.meses[i].mes){
                                            value.dados[j].gasto_mes =  value.dados[j].gasto_mes - $scope.projantigo.meses[i].valor;
                                            if(value.dados[j].gasto_mes >= value.dados[j].baseline+value.dados[j].baseline*value.dados[j].perc_baseline/-100 && value.dados[j].dependencia != 'S'){
                                                dependencia = 'S';
                                            }else{
                                                dependencia = 'N';
                                            }
                                            if(!angular.isUndefined(value.dados[k])){
                                                value.dados[k].dependencia = dependencia;
                                            }
                                        }   
                                    }
                                }
                            }
                        });
                    }
                    //adicnionar valores novos
                    if ($scope.classgeral.includes($scope.formaltproj.classificacao_geral)){
                        angular.forEach($scope.formLimReal, function(value, index){
                            if(value.familia == $scope.user.familia){
                                for(var j=0; j<value.dados.length; j++){
                                    for(var i=0; i<$scope.formaltproj.meses.length; i++){
                                        var k = j+1;
                                        var dependencia = '';
                                        if(value.dados[j].mes==$scope.formaltproj.meses[i].mes){
                                            value.dados[j].gasto_mes =  value.dados[j].gasto_mes + $scope.formaltproj.meses[i].valor;
                                            if(value.dados[j].gasto_mes >= value.dados[j].baseline+value.dados[j].baseline*value.dados[j].perc_baseline/-100 && value.dados[j].dependencia != 'S'){
                                                dependencia = 'S';
                                            }else{
                                                dependencia = 'N';
                                            }
                                            if(!angular.isUndefined(value.dados[k])){
                                                value.dados[k].dependencia = dependencia;
                                            }
                                        }   
                                    }
                                }
                            }
                        });
                    }
                    // console.log('limiteReal: ', $scope.limValidacao);
                    // console.log('limiteReal Alterado: ', $scope.formLimReal);

                    console.log ($scope.formaltproj);
                    console.log($scope.formLimReal[0].dados);
                    Projeto.upsertWithWhere({where: {projeto_id: ''+ $scope.formaltproj.projeto_id +''}}, 
                                                {classificacao_geral: ''+ $scope.formaltproj.classificacao_geral +'', 
                                                familia: ''+ $scope.formaltproj.familia +'', 
                                                fase:''+ $scope.formaltproj.fase +'', 
                                                gerente:''+ $scope.formaltproj.gerente +'', 
                                                projeto:''+ $scope.formaltproj.projeto +'', 
                                                descricao: ''+ $scope.formaltproj.descricao +'',
                                                proposta:''+ $scope.formaltproj.proposta +'', 
                                                regiao: ''+ $scope.formaltproj.regiao +'', 
                                                sistema: ''+ $scope.formaltproj.sistema +'', 
                                                valor_total_proj: ''+ $scope.formaltproj.valor_total_proj +'', 
                                                meses: $scope.formaltproj.meses}, 
                                            function(res, err){
                        // console.log(res);
                        LimiteReal.upsertWithWhere({where: {familia: ''+ $scope.formaltproj.familia +''}}, {dados: $scope.formLimReal[0].dados}, function(info, err) {
                            // console.log(info);
                            $state.reload();
                        })
                    })

                }
            });    
           
        }

    }]);