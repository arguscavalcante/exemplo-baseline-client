'use strict';



angular
    .module('starter')
    .controller('blankCtrl', ['$scope', '$state', '$interval', 'Projeto', function($scope, $state, $interval, Projeto){
        console.log('blankCtrl')

        var caminhoProj = 'js/import/projetos.json'
        var proj = [];

        function loadJSON(road, callback) {   

            var xobj = new XMLHttpRequest();
                xobj.overrideMimeType("application/json");
            xobj.open('GET', road, true); // Replace 'my_data' with the path to your file
            xobj.onreadystatechange = function () {
                if (xobj.readyState == 4 && xobj.status == "200") {
                    // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
                    callback(xobj.responseText);
                }
            };
            xobj.send(null);  
        }

        loadJSON(caminhoProj, function(response) {
         // Parse JSON string into object
            proj = JSON.parse(response);
            console.log(proj);
        });
 
        $scope.importProj = function() {
            console.log('import');
            var i =0;
            $interval(function() {
                if(i< proj.length){
                    console.log(proj[i])
                    Projeto.create(proj[i], function(res, err){
                        // console.log(res);
                    });
                    i++;
                } else {
                    $interval.cancel();
                }                
            }, 500);

        };

        $scope.deleteProj = function() {
            console.log('delete');
            Projeto.find().$promise.then(function(res, err){
                var i =0;
                $interval(function() {
                    if(i< res.length){
                        if(res[i].projeto_id.includes("carga")){
                            Projeto.destroyById({id: res[i].projeto_id}, function(err){});
                        }
                        i++;
                    } else {
                        $interval.cancel();
                    }                
                }, 500);
                alert('Todos os projetos foram excluídos do sistema.');
            });
        };

    }]);