function grafProjetos(objChartProj, refresh) {
    var chartOptions = {
        chart: {
            renderTo: objChartProj.render,
            type: 'column'
        },
        title: {
            text: ''
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
        series: objChartProj.serie
    }

    new Highcharts.chart(chartOptions);
    
}