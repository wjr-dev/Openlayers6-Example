<template>
  <div id="map" ref="map" class="map-container"></div>
</template>

<script>
import resizeMixin from "@/mixins/resizeMixin";
import "ol/ol.css";
import Map from "ol/Map";
import OSM from "ol/source/OSM";
import TileLayer from "ol/layer/Tile";
import View from "ol/View";
import Feature from "ol/Feature";
import { Polygon } from "ol/geom";
import { Fill, Stroke, Style } from "ol/style";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
export default {
  name: "Polygon", // 面
  mixins: [resizeMixin],
  data() {
    return {
      map: null,
      polygonPoints: [
        [
          [13382858.923704674, 3530585.2001267006],
          [13382916.25147589, 3529605.850701797],
          [13383967.260614809, 3529677.510415814],
          [13383957.705986274, 3530599.5320695043],
          [13382858.923704674, 3530585.2001267006],
        ],
      ],
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      this.map = new Map({
        target: "map",
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          center: [13384755.517469, 3529894.878215],
          zoom: 15,
        }),
      });

      const vectorLayer = this.getPolygon();
      this.map.addLayer(vectorLayer);

      // this.map.on("singleclick", function (e) {
      //   console.log(e.coordinate);
      // });
    },
    getPolygon() {
      const feature = new Feature({
        geometry: new Polygon(this.polygonPoints),
        style: new Style({
          stroke: new Stroke({
            color: "red",
            lineDash: [7, 10],
            width: 2,
          }),
          fill: new Fill({
            color: "rgba(0,37,41,.6)",
          }),
        }),
      });

      return new VectorLayer({
        style: function (feature) {
          return feature.get("style");
        },
        source: new VectorSource({ features: [feature] }),
      });
    },
  },
};
</script>

<style>
</style>