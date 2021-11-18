<template>
  <div id="map" class="map-container"></div>
</template>

<script>
// import 'ol/ol.css';
// import Map from "ol/Map";
// import OSM from "ol/source/OSM";
// import TileLayer from "ol/layer/Tile";
// import View from "ol/View";
export default {
  name: "Cesium", // 基础地图
  data() {
    return {
      map: null,
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      // eslint-disable-next-line no-undef
      this.map = new Cesium.Viewer("map", {
        scene3DOnly: true,
        selectionIndicator: false,
        baseLayerPicker: false,
      });
      // Remove default base layer
      // eslint-disable-next-line no-undef
      this.map.imageryLayers.remove(this.map.imageryLayers.get(0));

      // Add Sentinel-2 imagery
      this.map.imageryLayers.addImageryProvider(
        // eslint-disable-next-line no-undef
        new Cesium.IonImageryProvider({ assetId: 3954 })
      );
      this.map.imageryLayers.addImageryProvider(
        // eslint-disable-next-line no-undef
        new Cesium.ArcGisMapServerImageryProvider({
          url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
        })
      );
      // Load Cesium World Terrain
      // eslint-disable-next-line no-undef
      this.map.terrainProvider = Cesium.createWorldTerrain({
        requestWaterMask: true, // required for water effects
        requestVertexNormals: true, // required for terrain lighting
      });

      // Enable depth testing so things behind the terrain disappear.
      this.map.scene.globe.depthTestAgainstTerrain = true;
    },
  },
};
</script>

<style>
</style>