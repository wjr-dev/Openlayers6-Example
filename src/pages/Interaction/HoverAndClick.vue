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
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import { Polygon } from "ol/geom";
// import LineString from "ol/geom/LineString";
import { Stroke, Style, Fill } from "ol/style";
// import Interaction from "ol/interaction";
import { singleClick, pointerMove } from "ol/events/condition";
import { Select, Pointer } from "ol/interaction";
// import { fromLonLat } from "ol/proj";
export default {
  name: "Hover", // Hover
  mixins: [resizeMixin],
  data() {
    return {
      map: null,
      vectorLayer: null,
      points: [
        [
          [928567.4597877879, 5876854.581025382],
          [10874013.673830742, 6805422.040813176],
          [10629653.81599185, -647553.6232730672],
          [586463.6588133369, -232141.86494694836],
          [928567.4597877879, 5876854.581025382],
        ],
      ],
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
          center: [0, 0],
          zoom: 2,
        }),
      });

      this.vectorLayer = this.initFeature();
      this.map.addLayer(this.vectorLayer);

      const pointerMove = this.changeCursor();
      const hover = this.getHover();
      const click = this.getClick();

      this.map.addInteraction(pointerMove);
      this.map.addInteraction(click);
      this.map.addInteraction(hover);
    },
    // 面 Polygon 多边形
    initFeature() {
      const feature = new Feature({
        geometry: new Polygon(this.points),
        style: new Style({
          stroke: new Stroke({
            color: "orange",
            lineDash: [7, 10],
            width: 2,
          }),
          fill: new Fill({
            color: "rgba(0,37,41,.2)",
          }),
        }),
      });
      const vectorLayer = new VectorLayer({
        style: function (feature) {
          return feature.get("style");
        },
        source: new VectorSource({ features: [feature] }),
      });
      return vectorLayer;
    },
    // vectorLayer 的click效果
    getClick() {
      return new Select({
        layers: [this.vectorLayer],
        condition: singleClick,
        style: new Style({
          stroke: new Stroke({
            color: "red",
            // lineDash: [7, 10],
            width: 2,
          }),
          fill: new Fill({
            color: "rgba(0,37,41,.6)",
          }),
        }),
        toggleCondition: function (e) {
          console.log(e);
        },
      });
    },
    // vectorLayer 的hover效果
    getHover() {
      return new Select({
        layers: [this.vectorLayer],
        condition: pointerMove,
        style: new Style({
          stroke: new Stroke({
            color: "pink",
            // lineDash: [7, 10],
            width: 3,
          }),
          fill: new Fill({
            color: "rgba(0,37,41,.8)",
          }),
        }),
      });
    },
    // 改变鼠标样式
    changeCursor() {
      const _this = this
      return new Pointer({
        handleMoveEvent(e) {
          let feature = _this.map.forEachFeatureAtPixel(
            e.pixel,
            (feature) => {
              return feature;
            },
            {
              hitTolerance: 0,
            }
          );
          if (feature) {
            _this.map.getTargetElement().style.cursor = "pointer";
          } else {
            _this.map.getTargetElement().style.cursor = "auto";
          }
        },
      });
    },
  },
};
</script>

<style>
</style>