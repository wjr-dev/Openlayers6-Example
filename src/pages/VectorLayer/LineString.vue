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
import { LineString } from "ol/geom";
import { Stroke, Style } from "ol/style";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
export default {
  name: "LineString", // 线
  mixins: [resizeMixin],
  data() {
    return {
      map: null,
      linePoints: [
        [13383752.281472757, 3529949.81732908],
        [13383905.155529328, 3530007.145100294],
        [13384024.588386023, 3530016.69972883],
        [13384191.794385398, 3530026.2543573654],
        [13384411.550841717, 3530035.808985901],
        [13384636.084612304, 3530097.9140713825],
        [13384841.509125821, 3530193.460356739],
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

      const lineLayer = this.getLine();
      this.map.addLayer(lineLayer);
    },
    getLine() {
      const lineFeature = new Feature({
        geometry: new LineString(this.linePoints),
        style: new Style({
          stroke: new Stroke({
            color: "red",
            width: 2,
          }),
        }),
      });

      return new VectorLayer({
        style: function (feature) {
          return feature.get("style");
        },
        source: new VectorSource({ features: [lineFeature] }),
      });
    },
  },
};
</script>

<style>
</style>