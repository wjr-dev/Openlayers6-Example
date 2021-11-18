<template>
  <div class="map-box">
    <div id="map" ref="map" class="map-container"></div>
    <div :id="key" v-for="(item, key) in featureIds" :key="key" class="delete">
      <span class="delete-btn">
        <a-icon type="delete" @click="handleDelete(item, key)" />
      </span>
      <span class="text"> 总长: {{ item[item.length - 1].length }} m </span>
    </div>
  </div>
</template>

<script>
import resizeMixin from "@/mixins/resizeMixin"; // 监听地图容器大小变化,调用 map.updateSize() 方法使地图撑满容器
import "ol/ol.css";
import Map from "ol/Map";
import OSM from "ol/source/OSM";
import TileLayer from "ol/layer/Tile";
import View from "ol/View";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Fill, Stroke, Style, Text } from "ol/style";
import CircleStyle from "ol/style/Circle";
import { Draw, Modify, Snap } from "ol/interaction";
// import Feature from "ol/Feature";
import { LineString, Point } from "ol/geom";
import Overlay from "ol/Overlay";
import Feature from "ol/Feature";
export default {
  name: "MeasureDistance", // 测距
  mixins: [resizeMixin],
  data() {
    return {
      map: null,
      vectorLayer: null,
      vectorSource: null,
      drawLineString: null,
      drawPoint: null,
      snap: null,
      modify: null,
      featureIds: {},
      points: [],
      pointId: [],
    };
  },
  mounted() {
    this.initMap();
  },
  beforeDestroy() {
    // 卸载监听
    this.drawPoint && this.drawPoint.un("drawend", this.drawPointEnd);
    this.drawLineString &&
      this.drawLineString.un("drawend", this.drawLineStringEnd);
    this.modify && this.modify.un("modifyend", this.modifyEnd);
  },
  methods: {
    initMap() {
      // 先准备一个绘制的矢量图层
      const { vectorLayer, vectorSource } = this.getVectorLayer();
      this.vectorLayer = vectorLayer;
      this.vectorSource = vectorSource;
      this.map = new Map({
        target: "map",
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          vectorLayer,
        ],
        view: new View({
          center: [13384755.517469, 3529894.878215],
          zoom: 15,
        }),
        controls: [],
      });
      // 添加交互
      this.addInteractions(vectorSource);
    },
    getVectorLayer() {
      const vectorSource = new VectorSource();

      const vectorLayer = new VectorLayer({
        source: vectorSource,
        style: new Style({
          fill: new Fill({
            color: "rgba(255, 255, 255, 0.2)",
          }),
          stroke: new Stroke({
            color: "red",
            width: 2,
          }),
          image: new CircleStyle({
            radius: 5,
            fill: new Fill({
              color: "#fff",
            }),
            stroke: new Stroke({
              color: "red",
              width: 2,
            }),
          }),
        }),
      });

      return {
        vectorLayer,
        vectorSource,
      };
    },
    addInteractions(source) {
      // 捕捉
      this.snap = new Snap({ source });
      // 修改
      this.modify = new Modify({ source });
      // 绘制线
      this.drawLineString = new Draw({
        source,
        type: "LineString",
        id: "draw-LineString",
      });
      // 绘制点
      this.drawPoint = new Draw({
        source,
        type: "Point",
      });

      this.map.addInteraction(this.modify);
      this.map.addInteraction(this.snap);
      this.map.addInteraction(this.drawLineString);
      this.map.addInteraction(this.drawPoint);

      // setTimeout(() => {
      //   // 移除交互
      //   this.map.removeInteraction(this.modify);
      //   this.map.removeInteraction(this.snap);
      //   this.map.removeInteraction(this.drawLineString);
      //   this.map.removeInteraction(this.drawPoint);

      //   this.drawPoint.un("drawend", this.drawPointEnd);
      //   this.drawLineString.un("drawend", this.drawLineStringEnd);
      //   this.modify.un("modifyend", this.modifyEnd);
      // }, 10000);

      this.drawPoint.on("drawend", this.drawPointEnd);
      this.drawLineString.on("drawend", this.drawLineStringEnd);
      this.modify.on("modifyend", this.modifyEnd);
    },
    // 绘制 point 交互
    drawPointEnd(e) {
      const point = e.feature.getGeometry().getCoordinates();
      const index = this.points.findIndex(
        (item) => item[0] === point[0] && item[1] === point[1]
      );
      if (index === -1) {
        this.points.push(point);
      }
      // 线段长度
      const length =
        Math.round(new LineString(this.points).getLength() * 100) / 100;
      // 添加点ID
      const id = `point_${e.feature.ol_uid}`;
      e.feature.setId(id);

      if (!this.pointId.includes(id)) {
        this.pointId.push({
          id,
          length,
        });
      }

      e.feature.setStyle(this.getPointStyle(length));
    },
    // 绘制 lineString 交互
    drawLineStringEnd(e) {
      // 由于绘制线结束时需要点击两下,所以最后会绘制两个点,这里需要删除其中一个
      const lastPointId = this.pointId.slice(-1)[0].id;
      const lastPointFeature = this.vectorSource.getFeatureById(lastPointId);
      this.vectorSource.removeFeature(lastPointFeature);
      this.pointId.pop();

      // 添加线ID
      const id = `line_${e.feature.ol_uid}`;
      e.feature.setId(id);

      this.featureIds = { ...this.featureIds, ...{ [id]: this.pointId } };
      this.points = []; // 用完要清空
      this.pointId = []; // 用完要清空
      this.$nextTick(() => {
        this.getOverayDelete(id, e.feature.getGeometry().getLastCoordinate());
      });
    },
    // 修改交互
    modifyEnd(e) {
      e.features.forEach((feature) => {
        if (feature.getGeometry() instanceof LineString) {
          const id = feature.getId();
          this.featureIds[id].map((item) => {
            // 清除线上的点
            const feature = this.vectorSource.getFeatureById(item.id);
            this.vectorSource.removeFeature(feature);
          });
          const pointFeatures = feature
            .getGeometry()
            .getCoordinates()
            .map((item) => {
              this.points.push(item);
              const pointFeature = new Feature({
                geometry: new Point(item),
              });
              // 线段长度
              const length =
                Math.round(new LineString(this.points).getLength() * 100) / 100;
              // 添加点ID
              const id = `point_${pointFeature.ol_uid}`;
              pointFeature.setId(id);
              this.pointId.push({
                id,
                length,
              });
              pointFeature.setStyle(this.getPointStyle(length));

              return pointFeature;
            });

          this.vectorSource.addFeatures(pointFeatures);
          this.featureIds[id] = [...this.pointId];
          this.points = []; // 用完要清空
          this.pointId = []; // 用完要清空
        }
      });
    },
    getOverayDelete(id, position) {
      const overlay = new Overlay({
        id,
        element: document.getElementById(id),
        position,
        positioning: "right-center",
        stopEvent: true,
      });
      this.map.addOverlay(overlay);
    },
    // 删除绘制的线
    handleDelete(pointId, id) {
      // 清除线
      const lineFeature = this.vectorSource.getFeatureById(id);
      this.vectorSource.removeFeature(lineFeature);
      // 清除Overlay
      const overlay = this.map.getOverlayById(id);
      this.map.removeOverlay(overlay);
      // 清除线上的点
      pointId.map((item) => {
        const feature = this.vectorSource.getFeatureById(item.id);
        this.vectorSource.removeFeature(feature);
      });
      // 删除该条线的 featureIds
      const featureIds = { ...this.featureIds };
      delete featureIds[id];
      this.featureIds = featureIds;
    },
    // 点样式
    getPointStyle(length) {
      return new Style({
        image: new CircleStyle({
          radius: 5,
          fill: new Fill({
            color: "#fff",
          }),
          stroke: new Stroke({
            color: "red",
            width: 2,
          }),
        }),
        text: new Text({
          text: length > 0 ? `${String(length)} m` : "起点",
          color: "#333",
          offsetY: -15,
          backgroundFill: new Fill({
            color: "rgba(255,255,255,0.8)",
          }),
        }),
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.delete {
  width: max-content;
  min-width: 100px;
  background: #fff;
  color: #333;
  position: absolute;
  height: 22px;
  line-height: 22px;
  .delete-btn {
    display: inline-block;
    width: 30px;
    text-align: center;
    background: crimson;
    color: #fff;
  }
  .text {
    padding: 0 10px;
  }
}
</style>