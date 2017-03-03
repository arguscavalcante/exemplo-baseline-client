function grafProjetos(objChartProj) {
    var chartOptions = {
        chart: {
            renderTo: objChartProj.render,
            type: 'column'
        },
        title: {
            text: 'Baseline de Projetos'
        },
        xAxis: {
            categories: objChartProj.categorias,
            crosshair: true
        },
        yAxis: { 
            title: {
                text: 'baseline'
            },
            min: objChartProj.minimo,
            max: objChartProj.maximo, //valor passado por subprojeto.
            title: {
                text: 'Valor mensal'
            }
        },
        legend: {
            align: 'right',
            x: 20,
            width: 1050,
            verticalAlign: 'top',
            y: 30,
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
            borderColor: '#CCC',
            borderWidth: 1,
            shadow: false
        },
        tooltip: {
            headerFormat: '<b>{point.x}</b><br/>',
            pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
        },
        plotOptions: {
            column: {
                stacking: 'normal'
            }
        },
        series: [{
            name: 'TESTE',
            data: [50000, 20000, 30000, 70000, 30000, 2000, 50000, 10000, 20000, 50000, 15000, 20000 ]
        }, {
            name: 'Aprovado',
            data: [50000, 20000, 30000, 70000, 30000, 9000, 30000, 30000, 70000, 30000, 9000, 30000 ]
        }, {
            name: 'Aprovado Autonomia',
            data: [50000, 20000, 30000, 70000, 30000, 9000, 30000, 30000, 70000, 30000, 9000, 30000 ]
        }, {
            name: 'Pipeline Aprovado com Cronograma',
            data: [50000, 20000, 30000, 70000, 30000, 9000, 30000, 30000, 70000, 30000, 9000, 30000 ]
        }, {
            name: 'Pipeline Aprovado sem Cronograma',
            data: [50000, 20000, 30000, 70000, 30000, 9000, 30000, 30000, 70000, 30000, 9000, 30000 ]
        }, {
            name: 'Pipeline Aprovado Autonomia',
            data: [50000, 20000, 30000, 70000, 30000, 2000, 50000, 10000, 20000, 50000, 15000, 20000 ]
        }, {
            type: 'line',
            name: 'Limite',
            data: objChartProj.limite,
            marker: {
                enabled: false
            },
            states: {
                hover: {
                    lineWidth: 0
                }
            },
            enableMouseTracking: false
        }, {
            type: 'line',
            name: 'Limite -5%',
            data: objChartProj.limite_neg,
            marker: {
                enabled: false
            },
            dashStyle: 'shortdot',
            states: {
                hover: {
                    lineWidth: 0
                }
            },
            enableMouseTracking: false
        }, {
            type: 'line',
            name: 'Limite +5%',
            data: objChartProj.limite_pos,
            marker: {
                enabled: false
            },
            dashStyle: 'dash',
            states: {
                hover: {
                    lineWidth: 0
                }
            },
            enableMouseTracking: false
        }]
    }

    new Highcharts.chart(chartOptions);
}