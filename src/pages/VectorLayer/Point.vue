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
import { Point } from "ol/geom";
import { Fill, Stroke, Style,Circle } from "ol/style";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
export default {
  name: "Point", // 点
  mixins: [resizeMixin],
  data() {
    return {
      map: null,
      point: [13384755.517469, 3529894.878215],
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

      const pointLayer = this.getPoint();
      this.map.addLayer(pointLayer);
    },
    getPoint() {
      const pointFeature = new Feature({
        geometry: new Point(this.point),
        style: new Style({
          image: new Circle({
            radius: 10,
            fill: new Fill({
              color: "red",
            }),
            stroke: new Stroke({
              color: "blue",
              width: 5,
            }),
          }),
        }),
      });

      return new VectorLayer({
        style: function (feature) {
          return feature.get("style");
        },
        source: new VectorSource({ features: [pointFeature] }),
      });
    },
  },
};
</script>

<style>
</style>