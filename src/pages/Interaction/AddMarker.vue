<template>
  <div class="map-box">
    <div id="map" ref="map" class="map-container"></div>
    <div
      v-for="(item, index) in points"
      :key="index"
      :id="`marker_${index}`"
      class="marker"
      @click="handleClick"
    ></div>
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
  name: "AddMarker", // 添加标记点
  mixins: [resizeMixin],
  data() {
    return {
      map: null,
      points: [],
    };
  },
  mounted() {
    this.initMap();
    this.addMarker();
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

      this.map.on("singleclick", this.handleMapClick);
    },
    addMarker(id, position) {
      const marker = new Overlay({
        element: document.getElementById(id),
        position,
        positioning: "center-center",
        stopEvent: false,
      });
      this.map.addOverlay(marker);
      this.map.render();
    },
    handleMapClick(e) {
      const pos = e.coordinate;
      this.points.push(pos);
      const id = `marker_${this.points.length - 1}`;
      this.$nextTick(() => {
        this.addMarker(id, pos);
      });
    },
    handleClick() {
      alert("Overlay 被点击了");
    },
  },
};
</script>
<style lang="scss" scoped>
.marker {
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  border-radius: 50%;
  background-color: red;
  opacity: 0.5;
  cursor: pointer;
  position: absolute;
  transform: translate(-10px, -10px);
}
</style>
