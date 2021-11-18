<template>
  <div class="map-box">
    <div id="map" ref="map" class="map-container"></div>
    <div id="marker1"></div>
    <div id="marker2"></div>
    <div class="button-box">
      <a-button type="primary" @click="handleSetCenter">
        移动中心并放大层级
      </a-button>
      <a-button @click="handleRecover"> 恢复 </a-button>
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
import Overlay from "ol/Overlay";
export default {
  name: "SetCenter", // 设置地图中心
  mixins: [resizeMixin],
  data() {
    return {
      map: null,
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      const marker1 = new Overlay({
        element: document.getElementById("marker1"),
        position: [0, 0],
        positioning: "center-center",
        stopEvent: false,
      });
      const marker2 = new Overlay({
        element: document.getElementById("marker2"),
        position: [13368091.088894, 3556688.839038],
        positioning: "center-center",
        stopEvent: false,
      });

      this.map = new Map({
        target: "map",
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          center: [0, 0],
          zoom: 2,
        }),
        overlays: [marker1, marker2],
      });
    },
    handleSetCenter() {
      const view = this.map.getView();
      view.animate({ center: [13368091.088894, 3556688.839038] }, { zoom: 10 });
    },
    handleRecover() {
      const view = this.map.getView();
      view.animate({ zoom: 2, duration: 2000 }, { center: [0, 0] });
    },
  },
};
</script>

<style>
#marker1,
#marker2 {
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  border-radius: 50%;
  background-color: red;
  opacity: 0.5;
}
</style>