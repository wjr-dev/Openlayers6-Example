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
import { MultiPoint } from "ol/geom";
import { Fill, Style, Circle } from "ol/style";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
export default {
  name: "MultiPoint", // 多点
  mixins: [resizeMixin],
  data() {
    return {
      map: null,
      points: [
        [13382758.600105051, 3529634.5145874037],
        [13383231.554217564, 3529644.0692159394],
        [13383393.98290267, 3529648.846530207],
        [13383475.197245223, 3529687.06504435],
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
      const multiPoint = this.getMultiPoint();
      this.map.addLayer(multiPoint);
    },
    getMultiPoint() {
      const multiPointFeature = new Feature({
        geometry: new MultiPoint(this.points),
        style: new Style({
          image: new Circle({
            radius: 5,
            fill: new Fill({
              color: "blue",
            }),
          }),
        }),
      });

      return new VectorLayer({
        style: function (feature) {
          return feature.get("style");
        },
        source: new VectorSource({ features: [multiPointFeature] }),
      });
    },
  },
};
</script>

<style>
</style>