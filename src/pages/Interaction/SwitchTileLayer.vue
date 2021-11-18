<template>
  <div class="map-box">
    <div id="map" ref="map" class="map-container"></div>
    <div class="button-box">
      <a-button type="primary" @click="handleChangeLayer('layer1')">
        矢量地图
      </a-button>
      <a-button @click="handleChangeLayer('layer2')">
        卫星影像
      </a-button>
    </div>
  </div>
</template>

<script>
import resizeMixin from "@/mixins/resizeMixin"; // 监听地图容器大小变化,调用 map.updateSize() 方法使地图撑满容器
import "ol/ol.css";
import Map from "ol/Map";
// import OSM from "ol/source/OSM";
import XYZ from "ol/source/XYZ";
import TileLayer from "ol/layer/Tile";
import View from "ol/View";
export default {
  name: "SwitchTileLayer", // 切换瓦片图层
  mixins: [resizeMixin],
  data() {
    return {
      map: null,
      layer1: null,
      layer2: null,
      // currentLayer: "",
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      // 矢量地图
      this.layer1 = new TileLayer({
        source: new XYZ({
          url: "https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
        }),
      });
      // 卫星影像
      this.layer2 = new TileLayer({
        source: new XYZ({
          url: "https://webst03.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
        }),
      });

      this.map = new Map({
        target: "map",
        layers: [this.layer1],
        view: new View({
          center: [13384755.517469, 3529894.878215],
          zoom: 15,
        }),
        controls:[] // 清除所有自带控件
      });
      // this.currentLayer = "layer1";
    },
    handleChangeLayer(newLayer) {
      // 下面两种方法都可以实现
      // 先清除所有图层,再设置新图层
      this.map.setLayers([this[newLayer]])
      // 移除某个图层,再添加新图层
      // if ( newLayer === this.currentLayer ) {
      //   return;
      // }
      // this.map.removeLayer(this[this.currentLayer]);
      // this.map.addLayer(this[newLayer]);
      // this.currentLayer = newLayer
    },
  },
};
</script>

<style lang="scss" scoped>
.button-box {
  position: absolute;
  bottom: 10px;
  right: 0px;
}
</style>