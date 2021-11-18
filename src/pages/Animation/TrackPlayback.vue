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
import { LineString, Point } from "ol/geom";
import { Style, Stroke, Circle, Fill, Text } from "ol/style";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { getVectorContext } from "ol/render";
export default {
  name: "TrackPlayback", // 轨迹回放
  mixins: [resizeMixin],
  data() {
    return {
      map: null,
      vectorLayer: null,
      moveFeature: null,
      trackObj: [
        { coordinate: [13382758.600105051, 3529634.5145874037], speed: 1.2 },
        { coordinate: [13383231.554217564, 3529644.0692159394], speed: 1.3 },
        { coordinate: [13383393.98290267, 3529648.846530207], speed: 1.1 },
        { coordinate: [13383475.197245223, 3529687.06504435], speed: 0.6 },
        { coordinate: [13383532.525016438, 3529734.838187028], speed: 1.4 },
        { coordinate: [13383575.520844849, 3529820.829843849], speed: 1.2 },
        { coordinate: [13383651.957873134, 3529892.489557866], speed: 1.3 },
        { coordinate: [13383752.281472757, 3529949.81732908], speed: 1.3 },
        { coordinate: [13383905.155529328, 3530007.145100294], speed: 1.2 },
        { coordinate: [13384024.588386023, 3530016.69972883], speed: 1.0 },
        { coordinate: [13384191.794385398, 3530026.2543573654], speed: 1.5 },
        { coordinate: [13384411.550841717, 3530035.808985901], speed: 1.8 },
        { coordinate: [13384636.084612304, 3530097.9140713825], speed: 1.6 },
        { coordinate: [13384841.509125821, 3530193.460356739], speed: 1.7 },
        { coordinate: [13384960.941982517, 3530284.2293278277], speed: 1.2 },
        { coordinate: [13385118.593353355, 3530379.775613184], speed: 1.4 },
        { coordinate: [13385261.91278139, 3530503.9857841474], speed: 1.8 },
        { coordinate: [13385419.564152228, 3530585.2001267006], speed: 1.1 },
        { coordinate: [13385591.54746587, 3530661.6371549857], speed: 1.0 },
        { coordinate: [13385878.186321938, 3530742.851497539], speed: 2.0 },
        { coordinate: [13386174.379806545, 3530809.7338972883], speed: 1.9 },
        { coordinate: [13386461.018662613, 3530881.393611306], speed: 1.6 },
        { coordinate: [13386699.884376004, 3530723.7422404676], speed: 1.7 },
        { coordinate: [13386852.758432575, 3530609.08669804], speed: 1.3 },
        { coordinate: [13386967.413975002, 3530403.6621845234], speed: 1.6 },
        { coordinate: [13387005.632489145, 3530226.901556614], speed: 1.8 },
        { coordinate: [13387010.409803413, 3530083.5821285793], speed: 1.5 },
        { coordinate: [13386981.745917806, 3529964.1492718835], speed: 1.7 },
        { coordinate: [13386890.976946717, 3529844.716415188], speed: 1.9 },
        { coordinate: [13386790.653347094, 3529706.1743014213], speed: 1.4 },
        { coordinate: [13386633.001976255, 3529591.518758993], speed: 1.2 },
        { coordinate: [13386451.464034079, 3529510.3044164404], speed: 1.4 },
        { coordinate: [13386040.615007045, 3529639.2919016713], speed: 1.6 },
        { coordinate: [13385796.971979385, 3529706.1743014213], speed: 1.5 },
        { coordinate: [13385534.219694655, 3529782.6113297064], speed: 1.7 },
        { coordinate: [13385333.572495406, 3529935.4853862766], speed: 1.9 },
        { coordinate: [13385319.240552604, 3530193.460356739], speed: 1.1 },
        { coordinate: [13385118.593353355, 3530437.103384398], speed: 1.8 },
        { coordinate: [13384793.735983143, 3530599.5320695043], speed: 1.3 },
        { coordinate: [13384363.777699038, 3530747.6288118064], speed: 1.7 },
      ],
      lastTime: Date.now(),
      speed: 100,
      distance: 0,
    };
  },
  mounted() {
    this.initMap();
  },
  beforeDestroy() {
    // 组件销毁时要清掉监听 不然会一直运行 导致内存泄漏
    this.vectorLayer.un("postrender", this.animation);
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
      const points = this.trackObj.map((item) => item.coordinate);
      this.vectorLayer = this.getVector(points);
      this.map.addLayer(this.vectorLayer);

      this.vectorLayer.on("postrender", this.animation);
    },
    getVector(linePoints) {
      const lineFeature = new Feature({
        geometry: new LineString(linePoints),
        style: new Style({
          stroke: new Stroke({
            color: "red",
            // lineDash: [7, 10],
            width: 5,
          }),
        }),
      });
      const moveGeom = new Point(linePoints[0]);
      this.moveFeature = new Feature({
        geometry: moveGeom,
        style: new Style({
          image: new Circle({
            radius: 5,
            fill: new Fill({
              color: "blue",
            }),
          }),
          text: new Text({
            text: `targetId: 12`,
            fill: new Fill({
              color: "#fff",
            }),
            backgroundFill: new Fill({
              color: "rgba(43,91,87,0.60)",
            }),
            backgroundStroke: new Stroke({
              color: "#7bb0b5",
            }),
            padding: [5, 6, 5, 6],
            offsetX: 6,
            offsetY: -18,
            textAlign: "start",
            placement: "point",
          }),
        }),
      });

      const vectorLayer = new VectorLayer({
        style: function (feature) {
          return feature.get("style");
        },
        source: new VectorSource({ features: [lineFeature, this.moveFeature] }),
      });
      return vectorLayer;
    },
    animation(event) {
      const time = event.frameState.time;
      const elapsedTime = time - this.lastTime;

      this.distance = (this.distance + (this.speed * elapsedTime) / 1e6) % 2;
      this.lastTime = time;
      const currentCoordinate = new LineString(
        this.trackObj.map((item) => item.coordinate)
      ).getCoordinateAt(this.distance > 1 ? this.distance - 1 : this.distance);

      // const position = this.moveFeature.getGeometry().clone();
      this.moveFeature.getGeometry().setCoordinates(currentCoordinate);

      const vectorContext = getVectorContext(event);
      vectorContext.setStyle(
        new Style({
          image: new Circle({
            radius: 5,
            fill: new Fill({
              color: "black",
            }),
          }),
          text: new Text({
            text: `targetId: 12`,
            fill: new Fill({
              color: "black",
            }),
            backgroundFill: new Fill({
              color: "red",
            }),
            // backgroundStroke: new Stroke({
            //   color: "#7bb0b5",
            // }),
            padding: [5, 6, 5, 6],
            offsetX: -18,
            offsetY: -18,
            textAlign: "start",
            placement: "point",
          }),
        })
      );
      // vectorContext.drawGeometry(position);
      this.map.render();
    },
  },
};
</script>

<style>
</style>