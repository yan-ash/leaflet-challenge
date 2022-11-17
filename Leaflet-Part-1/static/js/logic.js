// Creating the map object
let myMap = L.map("map", {
  center: [40.7, -73.95],
  zoom: 11,
});

// Adding the tile layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(myMap);

// url :the link of earthquakes in the past week
let url =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// acess the data from the link
d3.json(url).then(function (data) {
  console.log(data);
});

// define sizemaker function by Magnitude value
function sizeMaker(mag) {
  return mag * 5;
}
function colorMaker(depth) {
  if (depth >= 90) {
    color = "#800080";
  } else if (depth >= 70) {
    color = "#b300b3";
  } else if (depth >= 50) {
    color = "#ff4dff";
  } else if (depth >= 30) {
    color = "#bd0026";
  } else if (depth >= 10) {
    color = "#ffccff";
  } else if (depth >= -10) {
    color = "#fff2e6";
  }
  return color;
}
d3.json(url).then(function (data) {
  x;
  console.log(data);
  // createFeatures(data.features);

  let features = data.features;
  let depth_array = [];
  for (let i = 0; i < features.length; i++) {
    // Set the data location property to a variable.

    let lat = features[i].geometry.coordinates[1];
    let lon = features[i].geometry.coordinates[0];
    let depth = features[i].geometry.coordinates[2];
    depth_array.push(depth);
    let place = features[i].properties.place;
    let mag = features[i].properties.mag;
    let current_time = moment(features[i].properties.time);

    L.circleMarker([lat, lon], {
      color: "black",
      weight: 1,
      fillColor: colorMaker(depth),
      radius: sizeMaker(mag),
      fillOpacity: 1,
    })
      .bindPopup(
        `<h3>${place}</h3><br/>Magnitude:${mag}<br/>Depth:${depth}km <br> Time:${current_time} `
      )
      .addTo(myMap);
  }
});

// Get the data with d3.
// function createFeatures(response) {
//   // Create a new marker cluster group.
//   let markers = L.markerClusterGroup();

//   // Loop through the data.
//   for (let i = 0; i < response.length; i++) {
//     // Set the data location property to a variable.
//     let location = response[i].geometry;

//     // Check for the location property.
//     if (location) {
//       // Add a new marker to the cluster group, and bind a popup.
//       markers.addLayer(
//         L.marker([location.coordinates[1], location.coordinates[0]]).bindPopup(
//           response[i].properties.place
//         )
//       );
//     }
//   }

//   // Add our marker cluster layer to the map.
//   myMap.addLayer(markers);
// }
