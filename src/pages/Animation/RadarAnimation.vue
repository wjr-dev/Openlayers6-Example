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
import { Polygon, LineString } from "ol/geom";
import VectorSource from "ol/source/Vector";
import { Style, Fill, Stroke, Text } from "ol/style";
import { getVectorContext } from "ol/render";
import { easeOut } from "ol/easing";
export default {
  name: "RadarAnimation", // 雷达波
  mixins: [resizeMixin],
  data() {
    return {
      map: null,
      sectorLayer: null,
      center: [13384755.517469, 3529894.878215], // 圆心
      radius: 1500, // 半径
      direction: 45, // 方向
      viewRange: 90, // 夹角
      labelSpace: 400, // 标注间隔
      start: Date.now(),
      speed: 6000,
    };
  },
  mounted() {
    this.initMap();
  },
  beforeDestroy(){
    this.sectorLayer.un("postrender", this.animation);
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

      this.sectorLayer = this.getSector();
      this.sectorLayer.on("postrender", this.animation);
      this.map.addLayer(this.sectorLayer);
    },
    getSector() {
      // 扇形 feature
      const sectorPoints = this.getPoints(
        this.center,
        this.radius,
        this.direction,
        this.viewRange,
        true
      );
      const feature = new Feature({
        geometry: new Polygon([sectorPoints]),
        style: new Style({
          fill: new Fill({
            color: "rgba(0,37,41,.4)",
          }),
        }),
      });

      // 雷达距离标注
      const lineNum = Math.ceil(this.radius / this.labelSpace); // 距离线条数
      const features = [];
      // 防止距离线条数lineNum不是整数
      const remainder = this.radius % this.labelSpace; // 余数

      for (let i = 0; i < lineNum; i++) {
        const points = this.getPoints(
          this.center,
          remainder === 0
            ? (i + 1) * this.labelSpace
            : i * this.labelSpace + remainder,
          this.direction,
          this.viewRange,
          false
        );
        const feature = new Feature({
          geometry: new LineString(points),
          style: new Style({
            stroke: new Stroke({
              color: "rgba(0,0,0,0.4)",
              width: 1,
            }),
            text: new Text({
              text: `${
                remainder
                  ? (i + 1) * this.labelSpace
                  : i * this.labelSpace + remainder
              }m`,
              placement: "line",
              textBaseline: "bottom",
              rotateWithView: true,
              fill: new Fill({
                color: "rgba(0, 0, 0, 0.4)",
              }),
            }),
          }),
        });
        features.push(feature);
      }

      // 扇形图层
      return new VectorLayer({
        style: function (feature) {
          return feature.get("style");
        },
        source: new VectorSource({
          features: [feature, ...features],
          wrapX: false,
        }),
      });
    },
    // 计算几何图形所需点位
    getPoints(center, radius, direction, viewRange, includeCenter) {
      const points = [];
      if (includeCenter) points.push(center);

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

      if (includeCenter) points.push(center);

      return points;
    },
    animation(event) {
      const vectorContext = getVectorContext(event);
      const frameState = event.frameState;
      let elapsedTime = frameState.time - this.start;
      let radius = 0;
      let opcatity = 0.3;

      if (elapsedTime > this.speed) {
        radius = this.radius;
        opcatity = 0;
        this.start = Date.now();
      } else {
        radius = easeOut(elapsedTime / this.speed) * this.radius;
        opcatity = opcatity * easeOut(1 - elapsedTime / this.speed);
      }
      // 设置样式
      vectorContext.setStyle(
        new Style({
          fill: new Fill({
            color: `rgba(255,0,0,${opcatity})`,
          }),
        })
      );
      const points = this.getPoints(
        this.center,
        radius,
        this.direction,
        this.viewRange,
        true
      );
      const gemo = new Polygon([points]);
      vectorContext.drawGeometry(gemo);
      this.map.render();
    },
  },
};
</script>

<style>
</style>