// Create variable to hold map element, give initial settings to map
var map = L.map('map', {
    center: [18.51, -69.89],
    zoom: 11,
    minZoom: 11,
    scrollWheelZoom: false,
});

map.once('focus', function() { map.scrollWheelZoom.enable(); });

L.easyButton('<img src="images/fullscreen.png">', function (btn, map) {
    var cucu = [18.51, -69.89];
    map.setView(cucu, 11);
}).addTo(map);

var esriAerialUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services' +
    '/World_Imagery/MapServer/tile/{z}/{y}/{x}';
var esriAerialAttrib = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, ' +
    'USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the' +
    ' GIS User Community';
var esriAerial = new L.TileLayer(esriAerialUrl,
    {maxZoom: 18, attribution: esriAerialAttrib}).addTo(map);


var opens = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
});


var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = (props ?
        'Municipio ' + props.MUNI + '<br />' +  '<br />' + 

        '<b>Vivienda </b>' + '<br />' +
        'Vivienda adecuada (material de paredes): ' + props.MAT_PARED.toFixed(0) + ' %' + '<br />' +
        'Hacinamiento extremo: ' + props.IND_10.toFixed(0) + ' %' + '<br />' +
        'Agua mejorada: ' + props.IND_8.toFixed(0) + ' %' + '<br />' +
        'Saneamiento: ' + props.IND_11.toFixed(0) + ' %' + '<br />' +
        'Electricidad: ' + props.IND_13.toFixed(0) + ' %' + '<br />' +
        'Internet: ' + props.IND_19.toFixed(0) + ' %' + '<br />' +  '<br />' +  

        '<b>Salud</b>' + '<br />' +
        'Proximidad equipamientos de salud: ' + props.DxP_SALUD.toFixed(0) + ' m' + '<br />' +
        'Concentración de Pm10: ' + props.PM10.toFixed(2) + ' µg/m3' +  '<br />' +   
        'Contaminación residuos sólidos: ' + props.CON_SOL.toFixed(0) + ' %' + '<br />' +  '<br />' +   

        '<b>Educación, cultura y diversidad </b>' + '<br />' +
        'Proximidad equipamientos educativos: ' + props.DxP_EDUCA.toFixed(0) + ' m' + '<br />' +  '<br />' +  

        '<b>Espacios públicos, seguridad y recreación </b>' + '<br />' +
        'Proximidad espacio público: ' + props.DxP_EP.toFixed(0) + ' m' + '<br />' +
        'M² per capita de espacio público: ' + props.M2_EP_CA.toFixed(2) + '<br />' +
        'Densidad poblacional: ' + props.IND_14.toFixed(2) + '<br />' +
        'Tasa de hurtos x 100mil habitantes: ' + props.IND_26.toFixed(1) + '<br />' +
        'Tasa de homicidios x 100mil habitantes: ' + props.IND_25.toFixed(1) + '<br />' +
        'Diversidad usos del suelo: ' + props.IND_30.toFixed(3) + '/1.61' +'<br />' + '<br />' +

        '<b>Oportunidades económicas </b>' + '<br />' +
        'Proximidad unidades servicios y comerciales: ' + props.DxP_CENTR.toFixed(0) + ' m' + '<br />' +
        'Tasa de desempleo: ' + props.IND_2.toFixed(2) + ' %' + '<br />' +
        'Empleo informal estricto: ' + props.IND_3.toFixed(2) + ' %' : 'Seleccione una manzana');
};
info.addTo(map);


function stylec(feature) {
    return {
        weight: 2,
        opacity: 1,
        color: '#ffffff',
        fillOpacity: 0,
        dashArray: '3',
    };
}

var loc = L.geoJson(localidad, {
    style: stylec,
    onEachFeature: popupText,
}).addTo(map);

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: 'black',
        dashArray: '',
        fillColor: false
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);
}

var manzanas;

function resetHighlight(e) {
    manzanas.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

function style(feature) {
    return {
        weight: 0.6,
        opacity: 0.5,
        color: '#ffffff00',
        fillOpacity: 0,
    };
}


function changeLegend(props) {
    var _legend = document.getElementById('legend'); // create a div with a class "info"
    _legend.innerHTML = (props ?
        `<p style="font-size: 11px"><strong>${props.title}</strong></p>
            <p>${props.subtitle}</p>
            <p id='colors'>
                ${props.elem1}
                ${props.elem2}
                ${props.elem3}
                ${props.elem4}
                ${props.elem5}
                ${props.elem6}
                ${props.elem7}<br>
                <span style='color:#000000'>Fuente: </span>${props.elem8}<br>
            </p>` :
        `<p style="font-size: 12px"><strong>Área urbana</strong></p>
            <p id='colors'>
                <span style='color:#c3bfc2'>▉</span>Manzanas<br>
            </p>`);
}

var legends = {
    DxP_SALUD: {
        title: "Proximidad equipamientos de salud",
        subtitle: "Distancia en metros con factor de inclinación del terreno", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>0 - 300</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>301 - 500</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>501 - 1000</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>1001 - 2000</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>2001 - 4030</div>',
        elem6: '<br />Factor de inclinación del terreno <br />A nivel: 1<br /> Ligeramente inclinada: 1.25<br /> Moderadamente inclinada: 1.5<br /> Fuertemente inclinada: 1.75<br /> Escarpada: 2<br />',
        elem7: '',
        elem8: "Google Maps",
    },
    DxP_EDUCA: {
        title: "Proximidad equipamientos de educación",
        subtitle: "Distancia en metros con factor de inclinación del terreno", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>0 - 300</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>301 - 500</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>501 - 1000</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>1001 - 2000</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>2001 - 5132</div>',
        elem6: '<br />Factor de inclinación del terreno <br />A nivel: 1<br /> Ligeramente inclinada: 1.25<br /> Moderadamente inclinada: 1.5<br /> Fuertemente inclinada: 1.75<br /> Escarpada: 2<br />',
        elem7: '',
        elem8: "Google Maps",
    },
    DxP_EP: {
        title: "Proximidad espacio público",
        subtitle: "Distancia en metros con factor de inclinación del terreno", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>0 - 500</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>501 - 1000</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>1001 - 5000</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>5001 - 10000</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>10001 - 16039</div>',
        elem6: '<br />Factor de inclinación del terreno <br />A nivel: 1<br /> Ligeramente inclinada: 1.25<br /> Moderadamente inclinada: 1.5<br /> Fuertemente inclinada: 1.75<br /> Escarpada: 2<br />',
        elem7: '',
        elem8: "Google Maps",
    },
    PM10: {
        title: "Concentración Pm10",
        subtitle: "µg/m3",
        elem1: '<div><span  style= "color:#1a9641">▉</span>55 - 57</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>58 - 60</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>61 - 63</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>64 - 66</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>67 - 69</div>',
        elem6: ' ',
        elem7: ' ',
        elem8: "Ministerio de Ambiente y Recursos Naturales",
    },
    DxP_CENTR: {
        title: "Proximidad zonas de interés económico (servicios y comercio)",
        subtitle: "Distancia en metros con factor de inclinación del terreno", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>0 - 500</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>501 - 1500</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>1501 - 3000</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>3001 - 7500</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>7501 - 11535</div>',
        elem6: '<br />Factor de inclinación del terreno <br />A nivel: 1<br /> Ligeramente inclinada: 1.25<br /> Moderadamente inclinada: 1.5<br /> Fuertemente inclinada: 1.75<br /> Escarpada: 2<br />',
        elem7: '',
        elem8: "Google Maps",
    },
    MAT_PARED: {
        title: "Vivienda con material de paredes adecuado",
        subtitle: "% de Viviendas", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>98.7 - 99.9</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>97.3 - 98.6</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>97.1 - 97.2</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>93.1 - 97.0</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>92.8 - 93.0</div>',
        elem6: '',
        elem7: '',
        elem8: "ONE - Censo Nacional Población y Vivienda 2010",
    },
    IND_13: {
        title: "Acceso a electricidad",
        subtitle: "% Hogares", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>99.38 - 99.76</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>98.59 - 99.37</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>98.10 - 95.58</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>97.96 - 98.09</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>96.40 - 97.95</div>',
        elem6: '',
        elem7: '',
        elem8: "ONE - Censo Nacional Población y Vivienda 2010",
    },
    IND_14: {
        title: "Densidad residencial",
        subtitle: "Población x km2", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>189 - 664</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>665 - 1670</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>1671 - 3473</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>3474 - 8235</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>8236 - 11339</div>',
        elem6: '',
        elem7: '',
        elem8: "ONE - Censo Nacional Población y Vivienda 2010",
    },
    IND_8: {
        title: "Acceso a agua mejorada",
        subtitle: "% de Hogares", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>82.11 - 94.13</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>79.87 - 82.10</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>73.39 - 79.86</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>59.75 - 73.38</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>57.98 - 59.74</div>',
        elem6: '',
        elem7: '',
        elem8: "ONE - Censo Nacional Población y Vivienda 2010",
    },
    IND_10: {
        title: "Hacinamiento extremo",
        subtitle: "% de Hogares", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>2.86 - 3.16</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>3.17 - 3.50</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>3.51 - 3.80</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>3.81 - 4.28</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>4.29 - 4.71</div>',
        elem6: '',
        elem7: '',
        elem8: "ONE - Censo Nacional Población y Vivienda 2010",
    },
    IND_11: {
        title: "Alto grado de saneamiento",
        subtitle: "% de Hogares", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>56.01 - 62.55</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>42.19 - 56.00</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>38.98 - 42.18</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>24.21 - 38.97</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>15.46 - 24.20</div>',
        elem6: '',
        elem7: '',
        elem8: "ONE - Censo Nacional Población y Vivienda 2010",
    },
    IND_19: {
        title: "Acceso a internet",
        subtitle: "% de Hogares", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>23.01 - 33.29</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>13.87 - 23.00</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>8.23 - 13.86</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>4.05 - 8.22</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>3.72 - 4.04</div>',
        elem6: '',
        elem7: '',
        elem8: "ONE - Censo Nacional Población y Vivienda 2010",
    },
    IND_25: {
        title: "Tasa de homicidios",
        subtitle: "Homicidios x 100mil habitantes",
        elem1: '<div><span  style= "color:#1a9641">▉</span>2.90 - 8.10</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>8.11 - 9.80</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>9.81 - 11.90</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>11.91 - 17.30</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>17.31 - 22.50</div>',
        elem6: '',
        elem7: '',
        elem8: "Encuesta Nacional Continua de Fuerza de Trabajo 2019",
    },
    IND_26: {
        title: "Tasa de hurtos",
        subtitle: "Hurtos x 100mil habitantes",
        elem1: '<div><span  style= "color:#1a9641">▉</span>5.97 - 36.46</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>5.98 - 66.28</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>66.29 - 117.00</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>117.01 - 122.36</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>122.37 - 187.41</div>',
        elem6: '',
        elem7: '',
        elem8: "Encuesta Nacional Continua de Fuerza de Trabajo 2019",
    },
    IND_2: {
        title: "Tasa de desempleo",
        subtitle: "% de Personas", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>5.81 - 6.60</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>6.61 - 7.00</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>7.01 - 7.73</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>7.74 - 8.10</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>8.11 - 8.60</div>',
        elem6: '',
        elem7: '',
        elem8: "ONE - Censo Nacional Población y Vivienda 2010",
    },
    IND_3: {
        title: "Tasa de empleo informal",
        subtitle: "% de Personas", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>29.76 - 30.41</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>30.42 - 30.91</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>30.92 - 33.04</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>33.05 - 33.65</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>33.66 - 36.68</div>',
        elem6: '',
        elem7: '',
        elem8: "ONE - Censo Nacional Población y Vivienda 2010",
    },
    M2_EP_CA: {
        title: "M² per capita de espacio público",
        subtitle: "m²/habitante",
        elem1: '<div><span  style= "color:#1a9641">▉</span>2.84 - 6.31</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>1.89 - 2.83</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>0.72 - 1.88</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>0.29 - 0.71</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>0.09 - 0.28</div>',
        elem6: '',
        elem7: '',
        elem8: "Google Earth - Imagen Satelital Landsat",
    },
    CON_SOL: {
        title: "Contaminación residuos sólidos",
        subtitle: "% de Hogares",
        elem1: '<div><span  style= "color:#1a9641">▉</span>5 - 6</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>7 - 8</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>9 - 14</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>15 - 16</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>17 - 31</div>',
        elem6: '',
        elem7: '',
        elem8: "ONE - Censo Nacional Población y Vivienda 2010",
    },
    IND_30: {
        title: "Diversidad usos del suelo",
        subtitle: "Índice de Shannon-Wienner -  Nivel de diversidad por manzana",
        elem1: '<div><span  style= "color:#1a9641">▉</span>0.141 - 0.280</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>0.131 - 0.140</div>',
        elem3: '<div><span  style= "color:#f4f466">▉</span>0.041 - 0.130</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>0.036 - 0.040</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>0.030 - 0.035</div>',
        elem6: '',
        elem7: '',
        elem8: "Gobierno local",
    },
}

var indi = L.geoJson(Manzana, {
    style: legends.IND_14,
}).addTo(map);

var currentStyle = 'IND_14';

manzanas = L.geoJson(Manzana, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);


function setProColor(d) {
    if (currentStyle === 'DxP_SALUD') {
        return d > 2000 ? '#d7191c' :
            d > 1000 ? '#fdae61' :
                d > 500 ? '#f4f466' :
                    d > 300 ? '#a6d96a' :
                    '#1a9641';
    }else if (currentStyle === 'DxP_EDUCA') {
        return d > 2000 ? '#d7191c' :
            d > 1000 ? '#fdae61' :
                d > 500 ? '#f4f466' :
                    d > 300 ? '#a6d96a' :
                    '#1a9641';
    } 
    else if (currentStyle === 'DxP_EP') {
        return d > 5000 ? '#d7191c' :
            d > 2000 ? '#fdae61' :
                d > 1000 ? '#f4f466' :
                    d > 500 ? '#a6d96a' :
                    '#1a9641';
    }
    else if (currentStyle === 'DxP_CENTR') {
        return d > 7500 ? '#d7191c' :
            d > 3000 ? '#fdae61' :
                d > 1500 ? '#f4f466' :
                    d > 500 ? '#a6d96a' :
                    '#1a9641';
    }
    else if (currentStyle === 'MAT_PARED') {
        return d > 98.6 ? '#1a9641' :
            d > 97.2 ? '#a6d96a' :
                d > 97 ? '#f4f466' :
                    d > 93 ? '#fdae61' :
                    '#d7191c';
    }
    else if (currentStyle === 'IND_13') {
        return d > 99.37 ? '#1a9641' :
            d > 98.58? '#a6d96a' :
                d > 98.09 ? '#f4f466' :
                    d > 97.95 ? '#fdae61' :
                    '#d7191c';
    }
    else if (currentStyle === 'IND_14') {
        return d > 8235 ? '#d7191c' :
            d > 3473 ? '#fdae61' :
                d > 1670 ? '#f4f466' :
                    d > 664 ? '#a6d96a' :
                    '#1a9641';
    }
    else if (currentStyle === 'IND_8') {
        return d > 82.10 ? '#1a9641' :
            d > 79.86 ? '#a6d96a' :
                d > 73.38 ? '#f4f466' :
                    d > 59.74 ? '#fdae61' :
                    '#d7191c';
    }
    else if (currentStyle === 'IND_10') {
        return d > 4.28 ? '#d7191c' :
            d > 3.80 ? '#fdae61' :
                d > 3.50 ? '#f4f466' :
                    d > 3.16 ? '#a6d96a' :
                    '#1a9641';
    }
    else if (currentStyle === 'IND_11') {
        return d > 56 ? '#d7191c' :
            d > 42.18 ? '#fdae61' :
                d > 38.97 ? '#f4f466' :
                    d > 24.20 ? '#a6d96a' :
                    '#1a9641';
    }
    else if (currentStyle === 'IND_19') {
        return d > 23 ? '#1a9641' :
            d > 13.86 ? '#a6d96a' :
                d > 8.22 ? '#f4f466' :
                    d > 4.04 ? '#fdae61' :
                    '#d7191c';
    }
    else if (currentStyle === 'IND_25') {
        return d > 17.3 ? '#d7191c' :
            d > 11.9 ? '#fdae61' :
                d > 9.8 ? '#f4f466' :
                    d > 8.1 ? '#a6d96a' :
                    '#1a9641';
    }
    else if (currentStyle === 'IND_26') {
        return d > 122.36 ? '#d7191c' :
            d > 117 ? '#fdae61' :
                d > 66.28 ? '#f4f466' :
                    d > 36.46 ? '#a6d96a' :
                    '#1a9641';
    }
    else if (currentStyle === 'IND_2') {
        return d > 8.1 ? '#d7191c' :
            d > 7.73 ? '#fdae61' :
                d > 7 ? '#f4f466' :
                    d > 6.6 ? '#a6d96a' :
                    '#1a9641';
    }
    else if (currentStyle === 'IND_3') {
        return d > 33.65 ? '#d7191c' :
            d > 33.04 ? '#fdae61' :
                d > 30.91 ? '#f4f466' :
                    d > 30.41 ? '#a6d96a' :
                    '#1a9641';
    }
    else if (currentStyle === 'M2_EP_CA') {
        return d > 2.83 ? '#1a9641' :
            d > 1.88 ? '#a6d96a' :
                d > 0.71 ? '#f4f466' :
                    d > 0.28 ? '#fdae61' :
                    '#d7191c';
    }
    else if (currentStyle === 'IND_30') {
        return d > 0.140 ? '#1a9641' :
            d > 0.130 ? '#a6d96a' :
                d > 0.040 ? '#f4f466' :
                    d > 0.035 ? '#fdae61' :
                    '#d7191c';
    }
    else if (currentStyle === 'CON_SOL') {
        return d > 16 ? '#d7191c' :
            d > 14 ? '#fdae61' :
                d > 8 ? '#f4f466' :
                    d > 6 ? '#a6d96a' :
                    '#1a9641';
    }
    else {
        return d > 66 ? '#d7191c' :
            d > 62.5 ? '#fdae61' :
                d > 59.5 ? '#f4f466' :
                    d > 57 ? '#a6d96a' :
                    '#1a9641';
    }

}


function fillColor(feature) {
    return {
        fillColor:  setProColor(feature.properties[currentStyle]),
        weight: 0.6,
        opacity: 0.1,
        color: (currentStyle) ? '#ffffff00' : '#c3bfc2', 
        fillOpacity: (currentStyle) ? 0.9 : 0.5,
    };
}

function changeIndi(style) {
    currentStyle = style.value;
    indi.setStyle(fillColor);
    changeLegend((style.value && legends[style.value]) ? legends[style.value] :
        {
            
        });
}

var baseMaps = {
    'Esri Satellite': esriAerial,
    'Open Street Map': opens

};

// Defines the overlay maps. For now this variable is empty, because we haven't created any overlay layers
var overlayMaps = {
    //'Comunas': comu,
    //'Límite fronterizo con Venezuela': lim
};

// Adds a Leaflet layer control, using basemaps and overlay maps defined above
var layersControl = new L.Control.Layers(baseMaps, overlayMaps, {
    collapsed: true,
});
map.addControl(layersControl);
changeIndi({value: 'IND_14'});

function popupText(feature, layer) {
    layer.bindPopup('Municipio ' + feature.properties.NAME + '<br />')
}
