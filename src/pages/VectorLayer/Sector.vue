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
import VectorLayer from "ol/layer/Vector";
import Feature from "ol/Feature";
import { Polygon } from "ol/geom";
import VectorSource from "ol/source/Vector";
import { Style, Fill } from "ol/style";

export default {
  name: "Sector", // 扇形
  mixins: [resizeMixin],
  data() {
    return {
      map: null,
      center: [13384755.517469, 3529894.878215], // 圆心
      radius: 1500, // 半径
      direction: 45, // 方向
      viewRange: 90, // 夹角
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
            source: new OSM({
              wrapX: false,
            }),
          }),
        ],
        view: new View({
          center: [13384755.517469, 3529894.878215],
          zoom: 15,
        }),
      });

      const sectorLayer = this.getSector();
      this.map.addLayer(sectorLayer);
    },
    getSector() {
      // 扇形 feature
      const sectorPoints = this.getPoints(
        this.center,
        this.radius,
        this.direction,
        this.viewRange
      );
      const feature = new Feature({
        geometry: new Polygon([sectorPoints]),
        style: new Style({
          fill: new Fill({
            color: "rgba(0,37,41,.4)",
          }),
        }),
      });

      // 扇形图层
      return new VectorLayer({
        style: function (feature) {
          return feature.get("style");
        },
        source: new VectorSource({
          features: [feature],
          wrapX: false,
        }),
      });
    },
    // 计算几何图形所需点位
    getPoints(center, radius, direction, viewRange) {
      const points = [];
      points.push(center);
      // 弧线的边数,越大弧边的点越密
      const sides = 5000;
      // 起始点弧度 ，本系统以正东为起始方向 degree2meter
      const startAngle = (direction - viewRange / 2) * (Math.PI / 180);
      // 每个点之间的弧度间隔
      const angle = (viewRange / sides) * (Math.PI / 180);

      for (var i = 0; i <= sides; i++) {
        const rotation = startAngle + i * angle;
        const x = center[0] + radius * Math.cos(rotation);
        const y = center[1] + radius * Math.sin(rotation);

        points.push([x, y]);
      }

      points.push(center);

      return points;
    },
  },
};
</script>

<style>
</style>