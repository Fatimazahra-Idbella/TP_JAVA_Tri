require([
    "esri/config", "esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer",
    "esri/widgets/BasemapToggle", "esri/widgets/BasemapGallery",
    "esri/widgets/Locate", "esri/widgets/ScaleBar", 
    "esri/widgets/Legend", "esri/widgets/Measurement",
    "esri/widgets/Search","esri/widgets/LayerList",
    "esri/layers/GraphicsLayer",
  "esri/widgets/Sketch",
  "esri/widgets/Editor"
], function(esriConfig, Map, MapView, FeatureLayer, BasemapToggle, BasemapGallery, Locate, ScaleBar, Legend, Measurement, Search, LayerList, GraphicsLayer, Sketch, Editor) {

    esriConfig.apiKey = "AAPTxy8BH1VEsoebNVZXo8HurIJbcyg--Z0NSed8P7Wqjib8XaB6ReHxsI9uVRBG4mOQo8yGd7pFIe4pcOHlbwR69SinQqy9zTzkZdSz2VTGZ6ECmPcEZ8kcd--Z0_iqF07Rew7TPEdCBEjlP8dMjtQmhSIoMIjiBB_B4wm3cnHnbRlsUluPBOzzA4tsB5fSr7eKATJzbxATPhzkLZLFr1iLD0enWlFYydL-GEQzmLk6uDmp-ANuwxMaMeXG15GF1qUIAT1_HNOoAM8o";

    const map = new Map({
        basemap: "arcgis-topographic"
    });

    const view = new MapView({
        map: map,
        center: [-7.62, 33.59],
        zoom: 10,
        container: "viewDiv"
    });

    // Définition de la couche des communes
    const communesLayer = new FeatureLayer({
        url: "https://services5.arcgis.com/FlfGDAZ77bDVEcE9/arcgis/rest/services/Data/FeatureServer/5",
        title: "Limites des Communes",
        outFields: ["*"],
        popupTemplate: {
            title: "{COMMUNE_AR}",
            content: "Préfecture : {PREFECTURE} <br> Surface : {SURFACE} km²"
        }
    });

    map.add(communesLayer);
    



    const voirieLayer = new FeatureLayer({
        url: "https://services5.arcgis.com/FlfGDAZ77bDVEcE9/arcgis/rest/services/Data/FeatureServer/4",
        title: "Voirie"
    });

    const populationLayer = new FeatureLayer({
        url: "https://services5.arcgis.com/FlfGDAZ77bDVEcE9/arcgis/rest/services/Data/FeatureServer/0",
        title: "Population",
        outFields: ["*"],
        popupTemplate: {
            title: "{PREFECTURE}",
            content: "1994 : {TOTAL1994} <br> 2004 : {TOTAL2004}"
        }
    });

    const hotelsLayer = new FeatureLayer({
        url: "https://services5.arcgis.com/FlfGDAZ77bDVEcE9/arcgis/rest/services/Data/FeatureServer/2",
        title: "Hôtels",
        outFields: ["*"],
        popupTemplate: {
            title: "{HOTEL}",
            content: "Catégorie : {CATÉGORIE} "
        }
    });

    const grandesSurfacesLayer = new FeatureLayer({
        url: "https://services5.arcgis.com/FlfGDAZ77bDVEcE9/arcgis/rest/services/Data/FeatureServer/1",
        title: "Grandes Surfaces",
        outFields: ["*"],
        popupTemplate: {
            title: "{Adresse}",
            content: "Type : {Type}"
        }
    });


    const reclamationsLayer = new FeatureLayer({
        url: "https://services5.arcgis.com/FlfGDAZ77bDVEcE9/arcgis/rest/services/reclamations/FeatureServer",
        title: "Réclamations",
        outFields: ["*"],
        popupTemplate: {
            title: "{Objet}",
            content: "Message : {Message} <br> Contact : {Mail}"
        }
    });

    

    map.addMany([ voirieLayer, populationLayer, 
                 hotelsLayer, grandesSurfacesLayer, reclamationsLayer]);

    // Basemap Toggle (bascule entre 2 fonds de carte)
    let basemapToggle = new BasemapToggle({
        view: view,  
        nextBasemap: "hybrid"
    });
    view.ui.add(basemapToggle, {
        position: "bottom-right",
        index: 2
    });

    // Basemap Gallery (liste de fonds de carte)
    /*let basemapGallery = new BasemapGallery({
        view: view
    });
    view.ui.add(basemapGallery, {
        position: "bottom-left",
        index: 3
    });*/
    // Outil de localisation
    let locateWidget = new Locate({
        view: view
    });
    view.ui.add(locateWidget, "top-left");

    // Barre d'échelle
    let scaleBar = new ScaleBar({
        view: view
    });
    view.ui.add(scaleBar, "bottom-left");

    // Widget de mesure
    let measurementWidget = new Measurement({
        view: view
    });
    view.ui.add(measurementWidget, "top-right");

    // Légende
    let legend = new Legend({
        view: view
    });
    view.ui.add(legend, "bottom-right");

    // Widget de recherche
    let searchWidget = new Search({
        view: view
    });
    view.ui.add(searchWidget, "top-right");

    // Liste des couches
    let layerList = new LayerList({
        view: view
    });
    view.ui.add(layerList, "top-right");

    // Fonction pour interroger la couche des communes
    function queryFeatureLayer(geometry) {
        const communeQuery = communesLayer.createQuery();
        communeQuery.spatialRelationship = "intersects";
        communeQuery.geometry = geometry;
        communeQuery.outFields = ["PREFECTURE", "COMMUNE_AR", "Shape_Area"];
        communeQuery.returnGeometry = true;

        communesLayer.queryFeatures(communeQuery)
            .then((results) => {
                console.log("Nombre de communes trouvées :", results.features.length);
            })
            .catch((error) => {
                console.error("Erreur lors de la requête :", error);
            });
    }

    
    // Filtrage des communes par préfecture, commune ou surface
    document.getElementById("filterSelect").addEventListener("change", function (event) {
        let selectedFilter = event.target.value;
        console.log("Filtre sélectionné :", selectedFilter);

        if (selectedFilter) {
            if (communesLayer) {
                communesLayer.definitionExpression = selectedFilter; // Appliquer le filtre SQL
                console.log("Expression appliquée :", communesLayer.definitionExpression);
            } else {
                console.error("La couche 'communesLayer' n'est pas encore chargée.");
            }
        } else {
            communesLayer.definitionExpression = ""; // Réinitialiser
            console.log("Filtre réinitialisé");
        }
    });

    // Ajouter un événement au clic pour interroger la couche
view.on("click", function(event) {
    queryFeatureLayer(event.mapPoint);
});
 

// Fonction pour interroger la couche Population
function queryPopulationLayer(geometry) {
    const populationQuery = populationLayer.createQuery();
    populationQuery.spatialRelationship = "intersects";
    populationQuery.geometry = geometry;
    populationQuery.outFields = ["TOTAL1994", "TOTAL2004"];
    populationQuery.returnGeometry = true;

    populationLayer.queryFeatures(populationQuery)
        .then((results) => {
            console.log("Nombre de zones de population trouvées :", results.features.length);
            results.features.forEach((feature) => {
                console.log("Population 1994 :", feature.attributes.TOTAL1994);
                console.log("Population 2004 :", feature.attributes.TOTAL2004);
            });
        })
        .catch((error) => {
            console.error("Erreur lors de la requête :", error);
        });
}









// Fonction pour générer la symbologie par classes de population
function getPopulationRenderer(field) {
    return new ClassBreaksRenderer({
        field: field,
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 10000,
                symbol: new SimpleFillSymbol({ color: "#d4f0ff", outline: { color: "#000" } }),
                label: "Moins de 10 000 habitants"
            },
            {
                minValue: 10000,
                maxValue: 50000,
                symbol: new SimpleFillSymbol({ color: "#a0cbe8", outline: { color: "#000" } }),
                label: "10 000 - 50 000 habitants"
            },
            {
                minValue: 50000,
                maxValue: 100000,
                symbol: new SimpleFillSymbol({ color: "#6196cb", outline: { color: "#000" } }),
                label: "50 000 - 100 000 habitants"
            },
            {
                minValue: 100000,
                maxValue: 500000,
                symbol: new SimpleFillSymbol({ color: "#31689f", outline: { color: "#000" } }),
                label: "100 000 - 500 000 habitants"
            },
            {
                minValue: 500000,
                maxValue: 2000000,
                symbol: new SimpleFillSymbol({ color: "#08306b", outline: { color: "#000" } }),
                label: "Plus de 500 000 habitants"
            }
        ]
    });
}

// Fonction pour générer les symboles pour le ratio 1994/2004
function getRatioRenderer() {
    return new SimpleRenderer({
        symbol: new PictureMarkerSymbol({
            url: "https://example.com/diagram.png", // Remplace avec l'URL réelle du diagramme
            width: "25px",
            height: "25px"
        })
    });
}

// Filtrage de la population par année ou par évolution
document.getElementById("populationFilter").addEventListener("change", function(event) {
    const selectedValue = event.target.value;

    if (selectedValue === "pop2004") {
        populationLayer.renderer = getPopulationRenderer("TOTAL2004");
        console.log("Filtre appliqué : Population 2004");
    } else if (selectedValue === "pop1994") {
        populationLayer.renderer = getPopulationRenderer("TOTAL1994");
        console.log("Filtre appliqué : Population 1994");
    } else if (selectedValue === "ratio") {
        populationLayer.renderer = getRatioRenderer();
        console.log("Filtre appliqué : Évolution 1994-2004");
    } else {
        populationLayer.renderer = null; // Réinitialiser le filtre
        console.log("Filtre réinitialisé");
    }
});





// Ajouter un événement au clic pour interroger la couche Population
view.on("click", function(event) {
    queryPopulationLayer(event.mapPoint);
});

    // Filtrage des hôtels par catégorie
    document.getElementById("hotelFilter").addEventListener("change", function (event) {
        let selectedCategory = event.target.value;
        hotelsLayer.definitionExpression = selectedCategory ? `CATÉGORIE = '${selectedCategory}'` : "";
    });

    // Filtrage des grandes surfaces par type
    document.getElementById("surfaceFilter").addEventListener("change", function (event) {
        let selectedType = event.target.value;
        grandesSurfacesLayer.definitionExpression = selectedType ? `Type = '${selectedType}'` : "";
    });

    // Recherche et affichage des résultats
    view.on("click", function(event) {
        queryLayer(event.mapPoint, hotelsLayer);
        queryLayer(event.mapPoint, grandesSurfacesLayer);
    });

    function queryLayer(geometry, layer) {
        const query = layer.createQuery();
        query.geometry = geometry;
        query.spatialRelationship = "intersects";
        query.returnGeometry = true;
        query.outFields = ["*"];

        layer.queryFeatures(query).then((results) => {
            if (results.features.length > 0) {
                view.popup.open({
                    location: geometry,
                    features: results.features
                });
            }
        });
    }


         // Configuration de l'outil d'édition Editor
         const editor = new Editor({
            view: view,
            layerInfos: [{
                layer: reclamationsLayer,
                formTemplate: {
                    elements: [
                        {
                            type: "field",
                            fieldName: "objet",
                            label: "Objet"
                        },
                        {
                            type: "field",
                            fieldName: "Message",
                            label: "Message"
                        },
                        {
                            type: "field",
                            fieldName: "Mail",
                            label: "Email de contact"
                        }
                    ]
                }
            }],
            enabled: true,
            addEnabled: true,
            updateEnabled: true,
            deleteEnabled: false,
            attributeUpdatesEnabled: true,
            geometryUpdatesEnabled: true
        });

        // Ajout de l'outil Editor à l'interface
        view.ui.add(editor, "top-left");

        // Fonction pour récupérer et afficher les réclamations
        function loadReclamations() {
            reclamationsLayer.queryFeatures({
                where: "1=1",
                outFields: ["Message", "objet", "Mail"],
                returnGeometry: false
            }).then(function(response) {
                const features = response.features;
                const tableBody = document.getElementById("reclamationsTable");
                tableBody.innerHTML = ""; // Vider la table avant de recharger

                features.forEach(function(feature) {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${feature.attributes.objet}</td>
                        <td>${feature.attributes.Message}</td>
                        <td>${feature.attributes.Mail}</td>
                    `;
                    tableBody.appendChild(row);
                });
            }).catch(function(error) {
                console.error("Erreur lors du chargement des réclamations :", error);
            });
        }

        // Charger les réclamations au démarrage
        view.when(loadReclamations);

        // Rafraîchir la liste après l'ajout d'une réclamation
        reclamationsLayer.on("apply-edits", function() {
            loadReclamations();
        });




});
