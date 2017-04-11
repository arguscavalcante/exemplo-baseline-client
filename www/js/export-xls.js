//funcao para tratamento do Arquivo JSON
function exportaJSON(arqjson, datafinal){
    var objmeses = {};
    var date = new Date('2013-10-15');
    var mes;
    var zero = '00'
    var strdata = '';
    var tipos = {
        classificacao_geral: "String",
        projeto: "String",
        descricao: "String",
        proposta: "String",
        familia: "String",
        sistema: "String", 
        fase: "String",
        valor_total_proj: "Number"
    }
    var titulos = ['Classificação Geral', '#ID', 'Descrição', 'Proposta', 'Família', 'Sistema', 'Fase', 'Total Distribuído']

    angular.forEach(arqjson, function(value, index){
        objmeses = transformArrObj(value.meses);
        Object.assign(value, objmeses);
        delete value.meses;
        delete value.gerente;
        delete value.regiao;
        delete value.projeto_id;
    })

    
    strdata = '{ "';
    while(date.getFullYear() <= datafinal){
        mes = date.getMonth()+1;
        mes = mes.toString();
        mes = zero.substring(0, zero.length - mes.length) + mes;
        titulos.push( mes + '/' + date.getFullYear());
        strdata = strdata + mes + '/' + date.getFullYear() + '": "Number","';
        date.setMonth(date.getMonth() + 1);
    }
    strdata = strdata.substring(0,strdata.length-2)
    strdata = strdata + ' }'

    Object.assign(tipos, JSON.parse(strdata));

    return jsonParaXml(arqjson, tipos, titulos);
}

function transformArrObj(valor){
    var tratarjson = '';
    
    tratarjson = '{ "'
    angular.forEach(valor, function(value, index){
        tratarjson = tratarjson + value.mes + '": ' + value.valor + ',"'
    })
    tratarjson = tratarjson.substring(0,tratarjson.length-2)
    tratarjson = tratarjson + '}'

    // console.log(tratarjson);
    // console.log(JSON.parse(tratarjson))
    return JSON.parse(tratarjson);
    
}

function montarTipos(valor){
    var tipo = '';
    var campos = '';
    var str = ['classificacao_geral', 'descricao', 'familia', 'fase', 'projeto', 'proposta', 'sistema']

    angular.forEach(valor, function(value, index){
        for(var id in value){
            if(!id.includes('$')){
                if(id != 'toJSON'){
                    // console.log(campos.split(","))
                    if(!campos.split(",").includes(id)){
                        // console.log(id);
                        campos = campos + id + ',';
                    }
                }
            } 
        }
    })
    campos = campos.substr(0, campos.length-1);
    return campos.split(",");
}

//funcao para emitir o cabecalho do XML no padrao XLS
//https://en.wikipedia.org/wiki/Microsoft_Office_XML_formats
function emitXmlCabecalho (value) {
    var headerRow =  '<Row>\n';
    for (var i= 0; i<value.length; i++) {
        headerRow += '<Cell>';
        headerRow += '<Data ss:Type="String">';
        headerRow += value[i] + '</Data>';
        headerRow += '</Cell>\n';        
    }
    headerRow += '</Row>\n';    

    return '<?xml version="1.0" encoding="ISO-8859-1"?><?mso-application progid="Excel.Sheet"?>\n' +
        '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"\n' +
        ' xmlns:x="urn:schemas-microsoft-com:office:excel"\n' +
        ' xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"\n' +
        ' xmlns:html="http://www.w3.org/TR/REC-html40">\n' +
        '<Worksheet ss:Name="Sheet1">\n' +
        '<Table>\n' + 
        '<Column ss:Index="1" ss:AutoFitWidth="1"/>\n' + headerRow;
};

//funcao para emitir o rodape do XML no padrao XLS
//https://en.wikipedia.org/wiki/Microsoft_Office_XML_formats
function emitXmlRodape() {
    return '</Table>\n' +
        '</Worksheet>\n' +
        '</Workbook>\n';
};

//funcao para emitir o XML no padrao XLS
//https://en.wikipedia.org/wiki/Microsoft_Office_XML_formats
function jsonParaXml(jsonObject, tipos, titulos) {
    var row;
    var col;
    var xml;
    var vetor = [];
    var data = typeof jsonObject != "object" 
            ? JSON.parse(jsonObject) 
            : jsonObject;

    xml = emitXmlCabecalho(titulos);

    angular.forEach(data, function(value, index){
        xml += '<Row>\n';
            
            Object.keys(tipos).forEach( function(key){
                xml += '<Cell>';

                if(angular.isUndefined(value[key])){
                    xml += '<Data ss:Type="Number">0</Data>';
                } else {
                    xml += '<Data ss:Type="' + tipos[key]  + '">';
                    xml += value[key] + '</Data>';
                }
                xml += '</Cell>';
            });

        xml += '</Row>\n';
    })

    xml += emitXmlRodape();
    return xml;  
};
            