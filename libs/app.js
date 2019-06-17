 // create Leaflet map
 var map = L.map('map', {
     zoomSnap: .1,
     zoomControl: false,
     center: [37.392, -14.855],
     zoom: 2.6,
     noWrap: true,
     minZoom: 2.6

 });

 map.createPane('labels');
 //map.getPane('labels').style.zIndex = 650;
 map.getPane('labels').style.pointerEvents = 'none';
 map.setMaxBounds([
     [-90, -180],
     [90, 180]
 ])

 var basemap = L.tileLayer(
     'https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager_nolabels/{z}/{x}/{y}.png', {
         maxZoom: 18,
         attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy;<a href="https://carto.com/attribution">CARTO</a>'
     }).addTo(map);


 var labels = L.tileLayer(
     'https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager_only_labels/{z}/{x}/{y}.png', {
         maxZoom: 18,
         pane: 'labels'
     }).addTo(map);

 var bboxLayer = new L.FeatureGroup();
 map.addLayer(bboxLayer);

 /*var drawControl = new L.Control.Draw({
     edit: {
         featureGroup: drawnItems
     }
 });
 map.addControl(drawControl); */

 var photoLayer = L.photo.cluster().on('click', function (evt) {

     var photo = evt.layer.photo,
         template =
         '<img src="{thumbnail}"/></a><p><b>{parsedDate}</b></p><br><a href="{fullPic}" targer="_blank"><b>Full Image</b></a>';

     evt.layer.bindPopup(L.Util.template(template, photo), {
         className: 'leaflet-popup-photo',
         minWidth: 300,

     }).openPopup();
 });

 var input = document.getElementById("input");
 input.addEventListener("keyup", function (event) {
     if (event.keyCode === 13) {
         event.preventDefault();
         searchForTags(event);
     }
 })


 function searchForTags() {

     photoLayer.clearLayers();
     map.removeLayer(photoLayer);

     var flickrKey = '&api_key=e4dd71a1bf7d41f467b8dc7aa8e987fd',
         userID = '&user_id=153002014@N03',
         tags = '&tags=' + input.value.toString();
     flickrStart = "https://api.flickr.com/services/rest/?method=",
         flickrFormat = "&extras=media,date_taken,geo,url_n,url_o&format=json&has_geo=1&nojsoncallback=1",
         flickrGetPhotoData = flickrStart + 'flickr.photos.search' + flickrKey + tags + flickrFormat;

     //console.log(flickrGetPhotoData);
     searchForData(flickrGetPhotoData);
     //console.log(input.value);
 }



 //flickr API stuff


 function searchForData(searchString) {
     d3.json(searchString, {
         crossOrigin: "anonymous"
     }).then(function (data) {

         organizePhotos(data.photos)
     });
 }


 function organizePhotos(data) {
     var allPhotos = [];

     data.photo.forEach(function (pic) {

         allPhotos.push({
             date: pic.datetaken,
             parsedDate: pic.datetaken,
             farm: pic.farm,
             id: pic.id,
             secret: pic.secret,
             server: pic.server,
             media: pic.media,
             lat: pic.latitude,
             lng: pic.longitude,
             thumbnail: pic.url_n,
             fullPic: pic.url_o
         });
     })

     mapPhotos(allPhotos);
 }


 function mapPhotos(allPhotos) {


     console.log(allPhotos)
     photoLayer.add(allPhotos).addTo(map);


     //map.setView(photoLayer.getBounds().getCenter(), 14)


 }