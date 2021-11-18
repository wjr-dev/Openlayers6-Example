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
import { LineString, Polygon } from "ol/geom";
import { Style, Stroke, Fill } from "ol/style";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
export default {
  name: "Arrow", // 箭头
  mixins: [resizeMixin],
  data() {
    return {
      map: null,
      points: [
        [13383752.281472757, 3529949.81732908],
        [13383905.155529328, 3530007.145100294],
        [13384024.588386023, 3530016.69972883],
        [13384191.794385398, 3530026.2543573654],
        [13384411.550841717, 3530035.808985901],
        [13384636.084612304, 3530097.9140713825],
        [13384841.509125821, 3530193.460356739],
      ],
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
          center: [13384755.517469, 3529894.878215],
          zoom: 15,
        }),
      });
      const pointLayer = this.initFeature();
      this.map.addLayer(pointLayer);
    },
    // 带箭头的线
    initFeature() {
      const lineFeature = new Feature({
        geometry: new LineString(this.points),
        style: new Style({
          stroke: new Stroke({
            color: "red",
            lineDash: [7, 10],
            width: 2,
          }),
        }),
      });
      // 获取箭头关键点坐标
      const point3 = this.getArrowPoints(this.points);
      // 绘制箭头 Polygon
      const arrowFeature = new Feature({
        geometry: new Polygon([point3]),
        style: new Style({
          fill: new Fill({
            color: "red",
          }),
        }),
      });
      // 创建 vector 图层
      const vectorLayer = new VectorLayer({
        style: function (feature) {
          return feature.get("style"); // 注意与方法1的区别
        },
        // source 中添加 线 和 箭头 feature
        source: new VectorSource({ features: [lineFeature, arrowFeature] }),
      });

      return vectorLayer;
    },
    getArrowPoints(linePoints) {
      const headlen = 100; // 箭头斜边大小
      const theta = 15; // 箭头一边与直线的夹角
      const lineLength = linePoints.length;
      // 获取line的最后两个坐标点
      const p1 = linePoints[lineLength - 2];
      const p2 = linePoints[lineLength - 1];
      // 计算角度
      const angle = (Math.atan2(p2[1] - p1[1], p2[0] - p1[0]) * 180) / Math.PI;

      const p3 = []; // p3
      const p4 = []; // p4

      p3[0] = p2[0] - Math.cos(((angle + theta) * Math.PI) / 180) * headlen; // P3对应的X坐标
      p3[1] = p2[1] - Math.sin(((angle + theta) * Math.PI) / 180) * headlen; // P3对应的Y坐标

      p4[0] = p2[0] - Math.cos(((angle - theta) * Math.PI) / 180) * headlen; // P4对应的X坐标
      p4[1] = p2[1] - Math.sin(((angle - theta) * Math.PI) / 180) * headlen; // P4对应的Y坐标

      return [p2, p3, p4, p2];
    },
  },
};
</script>

<style>
</style>