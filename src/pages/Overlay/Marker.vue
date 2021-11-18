<template>
<div class="map-box">
  <div id="map" ref="map" class="map-container"></div>
  <div id="marker" @click="handleClick"></div>
</div>
</template>

<script>
import resizeMixin from "@/mixins/resizeMixin";
import "ol/ol.css";
import Map from "ol/Map";
import OSM from "ol/source/OSM";
import TileLayer from "ol/layer/Tile";
import View from "ol/View";
import Overlay from "ol/Overlay"
import { fromLonLat } from "ol/proj";
export default {
  name: "Marker",
  mixins: [resizeMixin],
  data() {
    return {
      map: null
    };
  },
  mounted() {
    this.initMap();
    this.addMarker()
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
          center: [0, 0],
          zoom: 2,
        }),
      });
    },
    addMarker(){
      const pos = fromLonLat([16.3725, 48.208889])
      const marker = new Overlay({
        element: document.getElementById('marker'),
        position: pos,
        positioning: 'center-center',
        stopEvent: false
      })
      this.map.addOverlay(marker)
    },
    handleClick(){
      alert('Overlay 被点击了')
    }
  },
};
</script>
<style lang="scss" scoped>
#marker{
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  border-radius: 50%;
  background-color: red;
  opacity: 0.5;
  cursor: pointer;
}
</style>
