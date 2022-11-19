let url =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// get the data with d3
d3.json(url).then(function (data) {
  console.log(data);

  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: colorMaker(feature.geometry.coordinates[2]),
      color: "#000000",
      radius: sizeMaker(feature.properties.mag),
      stroke: true,
      weight: 0.5,
    };
  }
  // define sizemaker function by Magnitude value
  function sizeMaker(mag) {
    if (mag == 0) {
      return 1;
    }
    return mag * 5;
  }
  // define colormaker function by depth value
  function colorMaker(depth) {
    if (depth >= 90) {
      color = "#1f005c";
    } else if (depth >= 70) {
      color = "#5b1060";
    } else if (depth >= 50) {
      color = "#ac255e";
    } else if (depth >= 30) {
      color = "#ca485c";
    } else if (depth >= 10) {
      color = "#e16b5c";
    } else if (depth >= -10) {
      color = "#ffb56b";
    }
    return color;
  }
  // create earthquake layer

  var earthquakes = L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: styleInfo,
    // binding a popup to each layer

    onEachFeature: function (feature, layer) {
      layer.bindPopup(
        "Magnitude: " +
          feature.properties.mag +
          "<br>Depth: " +
          feature.geometry.coordinates[2] +
          "<br>Location: " +
          feature.properties.place
      );
    },
  });
  // create street layer
  let street = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }
  );

  let topo = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
  });

  let plates = new L.layerGroup();

  // create a  basemap that hold the street map and topo map
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo,
  };

  // create a overlaymap that holds the earthquake layer and the tectonic plate layer
  let overlayMaps = {
    Earthquakes: earthquakes,
    "Tectonic Plates": plates,
  };

  // Creating the map object
  let myMap = L.map("map", {
    center: [40.7, -73.95],
    zoom: 3,
    layers: [street, earthquakes, plates],
  });

  // add a control to the map that has the option of all the layers
  L.control
    .layers(baseMaps, overlayMaps, {
      collapsed: false,
    })
    .addTo(myMap);

  let tectonicData =
    "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

  d3.json(tectonicData).then(function (data) {
    // Create GeoJSON layer with the retrieved data.
    L.geoJSON(data, {
      onEachFeature: function (feature, layer) {
        layer.bindPopup(
          "<h3><b> Plate Boundary Name: " +
            feature.properties.Name +
            "</h3></b>"
        );
      },
    }).addTo(plates);
    plates.addTo(myMap);
  });

  // set up the info lengend

  let info = L.control({ position: "bottomright" });
  info.onAdd = function () {
    let div = L.DomUtil.create("div", "legend");

    let range = [-10, 10, 30, 50, 70, 90];
    let colors = [
      "#ffb56b",
      "#e16b5c",
      "#ca485c",
      "#ac255e",
      "#5b1060",
      "#1f005c",
    ];

    for (let i = 0; i < range.length; i++) {
      div.innerHTML +=
        "<i style='background: " +
        colors[i] +
        "'></i> " +
        range[i] +
        (range[i + 1] ? "&ndash;" + range[i + 1] + "<br>" : "+");
    }

    return div;
  };
  // adding info legend to the map
  info.addTo(myMap);
});
