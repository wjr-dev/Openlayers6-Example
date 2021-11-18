<template>
  <div class="map-box">
    <div id="map" ref="map" class="map-container"></div>
    <div id="popover" ref="popover">
      <a-icon class="popover-close" type="close" @click="handleClosePopover" />
      <p>当前经纬度：</p>
      <span>{{ hdms }}</span>
    </div>
  </div>
</template>

<script>
import resizeMixin from "@/mixins/resizeMixin";
import "ol/ol.css";
import Map from "ol/Map";
// import TileJSON from "ol/source/TileJSON";
// import OSM from "ol/source/OSM";
import XYZ from "ol/source/XYZ";
import Overlay from "ol/Overlay";
import TileLayer from "ol/layer/Tile";
import View from "ol/View";
import { toLonLat } from "ol/proj";
import { toStringHDMS } from "ol/coordinate";
export default {
  name: "Popover", // 点击弹出气泡弹窗
  mixins: [resizeMixin],
  data() {
    return {
      map: null, // map 对象
      popover: null, // 弹窗对象
      hdms: "", // 经纬度
    };
  },
  mounted() {
    this.initMap();
  },
  beforeDestroy() {
    this.map.un("singleclick", this.handleSingleClick);
  },
  methods: {
    initMap() {
      // 弹窗的 Overlay
      this.popover = new Overlay({
        element: document.getElementById("popover"),
        autoPan: true, // 边缘自动拖拽
        autoPanAnimation: {
          // 拖拽动画
          duration: 250, // 动画时间
        },
      });

      this.map = new Map({
        target: "map",
        layers: [
          new TileLayer({
            // 加载mapbox地图
            // source: new TileJSON({
            //   url: "https://api.tiles.mapbox.com/v4/mapbox.natural-earth-hypso-bathy.json?secure&access_token=pk.eyJ1Ijoid2pyLTMxNyIsImEiOiJja3Y5ZjcyZzAyMTRkMm5sdXc5ejRnZzIwIn0.pFtB_-6p_nCiM_5d3Mmx-g",
            //   crossOrigin: "anonymous",
            // }),
            // 加载高德地图
            source: new XYZ({
              urls: [
                // "https://webrd03.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}",
                // "https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
                'https://webst03.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}'
                // "http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}",
              ],
            }),
            // source: new OSM(),
          }),
        ],
        view: new View({
          center: [13384755.517469, 3529894.878215],
          zoom: 13,
        }),
        overlays: [this.popover],
      });
      this.map.on("singleclick", this.handleSingleClick);
    },
    // 关闭弹窗
    handleClosePopover() {
      this.popover.setPosition(undefined);
    },
    // 地图单击事件
    handleSingleClick(event) {
      const coordinate = event.coordinate; // 获取经纬度
      console.log(coordinate);
      this.hdms = toStringHDMS(toLonLat(coordinate)); // 坐标转换
      this.popover.setPosition(coordinate);
    },
  },
};
</script>

<style lang="scss" scoped>
#popover {
  position: absolute;
  background-color: #fff;
  -webkit-filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #ccc;
  bottom: 12px;
  left: -50px;
  min-width: 280px;
  .popover-close {
    position: absolute;
    right: 10px;
    top: 6px;
    cursor: pointer;
  }
  &::after,
  &::before {
    top: 100%;
    border: solid transparent;
    content: "";
    width: 0;
    height: 0;
    position: absolute;
    pointer-events: none;
  }
  &::after {
    border-top-color: #fff;
    border-width: 10px;
    left: 48px;
    margin-left: -10px;
  }
  &::before {
    border-top-color: #ccc;
    border-width: 11px;
    left: 48px;
    margin-left: -11px;
  }
}
</style>