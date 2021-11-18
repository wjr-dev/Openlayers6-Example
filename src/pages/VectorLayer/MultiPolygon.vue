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
import { MultiPolygon } from "ol/geom";
import { Fill, Stroke, Style } from "ol/style";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
export default {
  name: "MultiPolygon", // 多面
  mixins: [resizeMixin],
  data() {
    return {
      map: null,
      polygon1: [
        [
          [13382858.923704674, 3530585.2001267006],
          [13382916.25147589, 3529605.850701797],
          [13383967.260614809, 3529677.510415814],
          [13383957.705986274, 3530599.5320695043],
          [13382858.923704674, 3530585.2001267006],
        ],
      ],
      polygon2: [
        [
          [13384908.39152557, 3529959.3719576155],
          [13384989.605868123, 3529085.123446604],
          [13385878.186321938, 3529128.1192750144],
          [13385816.081236457, 3529816.052529581],
          [13384908.39152557, 3529959.3719576155],
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

      const vectorLayer = this.getMultiPolygon();
      this.map.addLayer(vectorLayer);

      // this.map.on("singleclick", function (e) {
      //   console.log(e.coordinate);
      // });
    },
    getMultiPolygon() {
      const feature = new Feature({
        geometry: new MultiPolygon([this.polygon1, this.polygon2]),
        style: new Style({
          stroke: new Stroke({
            color: "orange",
            // lineDash: [7, 10],
            width: 2,
          }),
          fill: new Fill({
            color: "rgba(0,37,41,.8)",
          }),
        }),
      });

      const vectorLayer = new VectorLayer({
        style: function (feature) {
          return feature.get("style");
        },
        source: new VectorSource({ features: [feature] }),
      });
      return vectorLayer;
    },
  },
};
</script>

<style>
</style>