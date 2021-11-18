<template>
  <div class="map-box">
    <div id="map" ref="map" class="map-container"></div>
    <div class="button-box">
      <a-button type="primary" @click="handleClick"> {{ visible ? "隐藏" : "显示" }} </a-button>
    </div>
  </div>
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
import { Fill, Style, Circle } from "ol/style";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
export default {
  name: "VectorLayerVisible", // 矢量图层显示隐藏
  mixins: [resizeMixin],
  data() {
    return {
      map: null,
      pointLayer:null,
      point: [13384755.517469, 3529894.878215],
      visible: true,
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
        controls: [],
      });

      this.pointLayer = this.getPoint();
      this.map.addLayer(this.pointLayer);
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
    handleClick(){
      this.visible = !this.visible
      this.pointLayer.setVisible(this.visible)
    }
  },
};
</script>

<style lang="scss" scoped>
.button-box {
  position: absolute;
  top: 0;
  left: 20px;
}
</style>