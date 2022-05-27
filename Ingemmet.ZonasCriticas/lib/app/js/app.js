var webmapResponse;
require([
    "dojo/parser",
    "dojo/ready",
    "dijit/layout/BorderContainer",
    "dijit/layout/ContentPane",
    "dojo/dom",
    "esri/map",
    "dojo/_base/lang",
    "dojo/_base/array",
    "dojo/on",
    "esri/urlUtils",
    "esri/arcgis/utils",
    "esri/dijit/Legend",
    "esri/dijit/LayerList",
    "esri/dijit/Scalebar",
    "esri/geometry/Extent",
    "esri/tasks/query",
    "esri/tasks/QueryTask",
    "dojo/domReady!"
],
    function (
        parser,
        ready,
        BorderContainer,
        ContentPane,
        dom,
        Map,
        lang,
        array,
        on,
        urlUtils,
        arcgisUtils,
        Legend,
        LayerList,
        Scalebar,
        Extent,
        Query,
        QueryTask) {
        ready(function () {
            parser.parse();

            var config = {
                webmapid: "0d3151a9d6744bd6b21136eea5fb3bb4",
                defaultExtend: { xmin: -9993679.456092682, ymin: -2137772.143967867, xmax: -6706275.743604695, ymax: 207927.38004699827, spatialReference: { wkid: 102100 } },
                layers: ["Departamentos", "Provincias", "Zonas Críticas", "Via Nacional MTC", "Via Vecinal MTC", "Via Departamental MTC", "Informe Técnicos"],
                legend: [
                    { id: "a", margeinLeft: "28%", peligro: "CAÍDA DE ROCAS", resumen: "Bloques de roca que se desprenden de una ladera.", recomendacion: "Eliminar rocas sueltas. Colocar mallas metálicas o barrera dinámica. Anclaje con pernos. Fijar bloque de roca inestable.", pdf: "caida-de-rocas.jpg", background: "#CC0000", },
                    { id: "b", margeinLeft: "26%", peligro: "DERRUMBES", resumen: "Desprendimientos de masas de roca, suelo o ambas.", recomendacion: "Modificar geometría del talud. Controlar saturación de ladera.", pdf: "derrumbes.jpg", background: "#FF0000", },
                    { id: "c", margeinLeft: "24%", peligro: "VUELCOS", resumen: "Rotación de uno o más bloque de roca o suelo que se desprenden por gravedad.", recomendacion: "Modificar geometría del talud. Controlar saturación de ladera.", pdf: "vuelcos.jpg", background: "#FF3300", },
                    { id: "d", margeinLeft: "22%", peligro: "DESLIZAMIENTO", resumen: "Movimiento ladera abajo de una masa de suelo o roca cuyo desplazamiento ocurre predominantemente a lo largo de una superficie de falla.", recomendacion: "Mantenga la calma. Alejarse de inmediato del área. Realizar estudios especializados. Monitorear el deslizamiento.", pdf: "deslizamiento.jpg", background: "#FFC000", },
                    { id: "e", margeinLeft: "20%", peligro: "HUAICOS", resumen: "Flujo muy rápido a extremadamente rápido de detritos saturados, que transcurre principalmente confinado a lo largo de un canal o cauce con pendiente pronunciada. ", recomendacion: "Implementar sistema de alerta temprana. Identifique rutas de evacuación y zonas seguras. Alejarse del cauce de la quebrada. Construir obras hidráulicas transversales de contención o disipación.", pdf: "huaicos.jpg", background: "#CC0099", },
                    { id: "f", margeinLeft: "18%", peligro: "AVALANCHAS", resumen: "Flujo no canalizado de detritos saturados superficiales o rocas muy fracturadas, muy rapidos a extremadamente rapidos, que se inician como deslizamientos o derrumbes.", recomendacion: "Implementar sistema de alerta temprana. Identifique rutas de evacuación y zonas seguras.", pdf: "avalancha.jpg", background: "#9966FF", },
                    { id: "g", margeinLeft: "16%", peligro: "REPTACIÓN", resumen: "Movimientos lentos del terreno en donde no se distingue una superficie de falla.", recomendacion: "Mejorar el drenaje y forestar.", pdf: "reptacion.jpg", background: "#9999FF", },
                    { id: "h", margeinLeft: "14%", peligro: "EROSIÓN DE LADERAS", resumen: "Socavamiento del terreno a manera de surcos.", recomendacion: "Reforestar, Alejarse de los bordes. Construir obras hidráulicas transversales.", pdf: "erosion-de-laderas.jpg", background: "#00B050", },
                    { id: "i", margeinLeft: "12%", peligro: "INUNDACIÓN FLUVIAL", resumen: "Desborde del agua de un río hacia sus márgenes por causas naturales o antrópicas.", recomendacion: "Alejarse de los bordes del río. Realizar estudios hidrológicos e hidráulicos. Implementar sistema de alerta temprana. No construir viviendas en la franja marginal.", pdf: "inundacion.jpg", background: "#C4D79B", },
                    { id: "j", margeinLeft: "10%", peligro: "ARENAMIENTO", resumen: "Fenómeno producido por la migración y acumulación de arenas.", recomendacion: "Construir muros de contención. Forestar y limpieza de arenas.", pdf: "arenamiento.jpg", background: "#969603", },
                    { id: "k", margeinLeft: "8%", peligro: "EROSIÓN FLUVIAL", resumen: "Socavamiento de las riberas del río por acción de las aguas, la cual es capaz de arrancar trozos de roca y suelo.", recomendacion: "Alejarse de los bordes del río. Construir defensas ribereñas.", pdf: "erosion-fluvial.jpg", background: "#76933C", },
                    { id: "l", margeinLeft: "6%", peligro: "ALUVIÓN", resumen: "Materiales con fragmentos depositados por una corriente natural de agua o por un movimiento tipo flujo canalizado, originado por la rotura de una presa o desembalse violento de una laguna.", recomendacion: "Implementar sistema de alerta temprana, señalizar rutas de evacuación y zonas seguras y alejarse del cauce de la quebrada.", pdf: "aluvion.jpg", background: "#CCCCFF", },
                    { id: "m", margeinLeft: "4%", peligro: "EROSIÓN MARINA", resumen: "Desgaste que produce el oleaje y la corriente marina sobre el borde litoral.", recomendacion: "Alejarse de los bordes litorales. No construir viviendas en los bordes litorales.", pdf: "erosion-marina.jpg", background: "#C5D9F1", },
                    { id: "n", margeinLeft: "2%", peligro: "HUNDIMIENTO", resumen: "Desplazamiento vertical brusco de una masa de suelo o roca.", recomendacion: "Reubicación de viviendas.", pdf: "hundimiento.jpg", background: "#C4BD97", },
                    { id: "o", margeinLeft: "0%", peligro: "MOVIMIENTO COMPLEJO", resumen: "Combinación de dos o más tipos de movimientos descritos anteriormente.", recomendacion: "Implementar sistema de alerta temprana.", pdf: "movimiento-complejo.jpg", background: "#DA9694", },
                ]
            }

            arcgisUtils.createMap(config.webmapid, "map").then(function (response) {
                dom.byId("title").innerHTML = response.itemInfo.item.title;
                dom.byId("subtitle").innerHTML = response.itemInfo.item.snippet;
                window.webmapResponse = response;
                window.map = response.map;

                map.setExtent(new Extent(config.defaultExtend));

                //add the scalebar
                var scalebar = new Scalebar({
                    map: map,
                    scalebarUnit: "english"
                });

                array.map(response.itemInfo.itemData.operationalLayers, lang.hitch(this, function (lyr) {
                    if (!lyr.layerObject) return;
                    console.log(lyr.title);
                    if (lyr.title === config.layers[0] || lyr.title === config.layers[6]) {
                        lyr.layerObject.setVisibility(true);
                        lyr.visibility = true;

                        if (lyr.title !== config.layers[0]) return;

                        lyr.layerObject.on('click', function (evt) {
                            var extengGraphic = evt.graphic.geometry.getExtent();

                            //if (parseInt($(window).width()) >= 768)
                            //    $('#map').css('width', '41.66666667%');

                            array.map(response.itemInfo.itemData.operationalLayers, lang.hitch(this, function (lyr) {
                                var criterio = lyr.title == config.layers[2] ? "REGION"
                                    : lyr.title == config.layers[3] ? "CDEPARTAME"
                                        : lyr.title == config.layers[4] || lyr.title == config.layers[5] ? "DEPARTAMEN"
                                            : lyr.title == config.layers[0] || lyr.title == config.layers[1] ? "NM_DEPA" : "";

                                if (criterio.length > 0) {
                                    var layer = lyr.layerObject.setDefinitionExpression("upper(" + criterio + ") = '" + evt.graphic.attributes.NM_DEPA + "'");
                                    lyr.layerObject.setVisibility(true);
                                    lyr.visibility = true;

                                    if (lyr.title == config.layers[2]) {
                                        $.get(lyr.url + "/query?", {
                                            where: "upper(" + criterio + ") = '" + evt.graphic.attributes.NM_DEPA + "'",
                                            outFields: '*',
                                            returnGeometry: true,
                                            f: 'pjson'
                                        }, function (data) {
                                            $(".zone").text(evt.graphic.attributes.NM_DEPA);
                                            $(".event-title").text($('#title').text());

                                            var a = $.map(JSON.parse(data).features, function (a, b) {
                                                return a.attributes.COD_PELIGRO
                                            }).join(',').split(',');

                                            a = a.filter((v, i, a) => a.indexOf(v) === i);

                                            $('.list-group-item')
                                                .hide()
                                                .addClass('not-selected')
                                                .filter(function (index) {
                                                    return $.inArray($(this).attr('data-idpeligro'), a) !== -1;
                                                })
                                                .removeClass('not-selected')
                                                .addClass('selected')
                                                .find('img').show();

                                            //$('#map')
                                            //    .hide(100, function () {
                                            //        map.setExtent(extengGraphic);
                                            //        //$(this).css('width', '100%');
                                            //    })
                                            //    .delay(3000)
                                            //    .fadeIn(300, function () {
                                            //        $('#activeZone').fadeIn();
                                            //    });

                                            //$(".list-group-item.selected").each(function (i) {
                                            //    $(this).delay(1000 * i).fadeIn(1000);
                                            //});
                                            map.setExtent(extengGraphic);
                                            $('#activeZone').fadeIn(3000);
                                            $(".list-group-item.selected").fadeIn(3000);
                                        });
                                    }

                                } else {
                                    lyr.layerObject.setVisibility(false);
                                    lyr.visibility = false;
                                }

                                if (lyr.title === config.layers[6]) {
                                    lyr.layerObject.setVisibility(true);
                                    lyr.visibility = true;
                                }
                            }));
                        });
                    } else {
                        lyr.layerObject.setVisibility(false);
                        lyr.visibility = false;
                    }
                }));

                // var myWidget = new LayerList({
                //     map: response.map,
                //     layers: arcgisUtils.getLayerList(response)
                // }, "layerList");
                //myWidget.startup();

                on(dom.byId("homeButton"), "click", function (evt) {
                    activeLayerDemarcacion();
                    map.setExtent(new Extent(config.defaultExtend));
                    $('.list-group-item')
                        .removeClass('selected')
                        .find('img').hide();
                    $(".region-name").text('');
                    $('#activeZone').hide();
                    $('.list-group-item.not-selected').fadeIn(1000).removeClass('not-selected');
                });

                $("#legend .list-group").hide().append(Handlebars.compile($('#list-layer-template').html())(config.legend)).delay(300).fadeIn(1500);
                $('#homeButton,#header').delay(300).fadeIn(1500);
                $('#legendButton').removeClass('hidden');

                $('#closePanel span ').on('click', function () {
                    $('#legendButton').trigger('click');
                });

                $('#legendButton').on('click', function () {
                    $('#rightPane').find('.list-group').hide().end()
                        .toggle(1000, 'swing', function () {
                            $(this).find('.list-group').fadeIn('slow');
                        });
                });

                $('.list-group').magnificPopup({
                    delegate: 'a',
                    type: 'image'
                });

                $('.message').fadeIn(2000).on('click', function () {
                    $(this).fadeOut();
                });

                $(window).on("resize", function (event) {
                    if (parseInt($(this).width()) >= 768)
                        $('#rightPane').fadeIn('slow');
                });
            });

            function activeLayerDemarcacion() {
                array.map(webmapResponse.itemInfo.itemData.operationalLayers, lang.hitch(this, function (lyr) {
                    if (!lyr.layerObject) return;
                    if (lyr.title === config.layers[0] || lyr.title === config.layers[6]) {
                        if (lyr.title === config.layers[0])
                            lyr.layerObject.setDefinitionExpression();
                        lyr.layerObject.setVisibility(true);
                        lyr.visibility = true;
                    } else {
                        lyr.layerObject.setVisibility(false);
                        lyr.visibility = false;
                    }
                }));
            }
        });

    });