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
// import { Style } from "ol/style";
// import Feature from "ol/Feature";
// import { LineString, Polygon } from "ol/geom";
import { Style, Fill } from "ol/style";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
// import VectorLayer from "ol/layer/Vector";
// import VectorSource from "ol/source/Vector";
export default {
  name: "Ship", // 船
  mixins: [resizeMixin],
  data() {
    return {
      map: null,
      point: [13379109.654638486, 3530735.805155412],
      speed: 300,
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
          center: [13379109.654638486, 3530735.805155412],
          zoom: 15,
        }),
      });

      const shipFeature = this.getShip();
      this.map.addLayer(shipFeature);
    },
    getShip() {
      const points = this.getShipPoints(this.point);
      const feature = new Feature({
        geometry: new Polygon([points]),
        style: new Style({
          fill: new Fill({
            color: "red",
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
    getShipPoints(point) {
      const header = 80; // 船头斜边大小
      const theta = 30; // 船头一边与船中线的夹角
      const body = 300; // 船身长度

      const footer = 30; // 船尾斜边大小
      const theta2 = 60;
      // 获取船头坐标
      const p1 = point;
      // 计算角度
      const angle = 20;

      const p2 = []; // p2
      const p3 = []; // p3

      const p4 = [];
      const p5 = [];

      const p6 = [];
      const p7 = [];

      p2[0] = p1[0] - Math.cos(((angle + theta) * Math.PI) / 180) * header; // p2对应的X坐标
      p2[1] = p1[1] - Math.sin(((angle + theta) * Math.PI) / 180) * header; // p2对应的Y坐标

      p3[0] = p1[0] - Math.cos(((angle - theta) * Math.PI) / 180) * header; // p3对应的X坐标
      p3[1] = p1[1] - Math.sin(((angle - theta) * Math.PI) / 180) * header; // p3对应的Y坐标

      p4[0] = p2[0] - Math.cos((angle * Math.PI) / 180) * body; // p4对应的X坐标
      p4[1] = p2[1] - Math.sin((angle * Math.PI) / 180) * body; // p4对应的Y坐标

      p5[0] = p3[0] - Math.cos((angle * Math.PI) / 180) * body; // p5对应的X坐标
      p5[1] = p3[1] - Math.sin((angle * Math.PI) / 180) * body; // p5对应的Y坐标

      p6[0] = p4[0] - Math.cos(((angle - theta2) * Math.PI) / 180) * footer; // p6对应的X坐标
      p6[1] = p4[1] - Math.sin(((angle - theta2) * Math.PI) / 180) * footer; // p6对应的Y坐标

      p7[0] = p5[0] - Math.cos(((angle + theta2) * Math.PI) / 180) * footer; // p7对应的X坐标
      p7[1] = p5[1] - Math.sin(((angle + theta2) * Math.PI) / 180) * footer; // p7对应的Y坐标

      return [p1, p2, p4, p6, p7, p5, p3, p1];
    },
  },
};
</script>

<style>
</style>