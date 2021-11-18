<template>
  <div class="map-box">
    <div id="map" ref="map" class="map-container"></div>
    <div id="popover" ref="popover">
      <a-icon class="popover-close" type="close" @click="handleClosePopover" />
      <p>目标轨迹：</p>
      <span>速度：{{ TrackSpeed }} m/s</span>
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
import { LineString, Polygon, Point } from "ol/geom";
import { Style, Stroke, Fill, Circle } from "ol/style";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { getVectorContext } from "ol/render";
import { easeOut } from "ol/easing";
import { Select, Pointer } from "ol/interaction";
import { singleClick } from "ol/events/condition";
import Overlay from "ol/Overlay";
export default {
  name: "ShowTrackInfo", // 点击轨迹显示轨迹信息
  mixins: [resizeMixin],
  data() {
    return {
      map: null,
      speed: 300,
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
      length: 10,
      trackLayer: null,
      infoOverlay: null,
      start: Date.now(),
      timer: null,
      infoVisible: false,
      TrackSpeed: 0,
    };
  },
  computed: {
    trackData() {
      return this.trackObj.slice(0, this.length);
    },
  },
  mounted() {
    this.initMap();
    this.timer = setInterval(() => {
      if (this.length < 40) {
        this.length++;
      } else {
        this.length = 2;
      }
    }, 500);
  },
  watch: {
    trackData(newValue) {
      if (this.trackLayer) {
        this.trackLayer.un("postrender", this.animation);
        this.map.removeLayer(this.trackLayer);
        this.trackLayer = null;
        this.trackLayer = this.drawTrack(newValue);
        this.map.addLayer(this.trackLayer);

        if (this.infoVisible) {
          this.infoOverlay.setPosition(this.trackData.slice(-1)[0].coordinate);
          this.TrackSpeed = this.trackData.slice(-1)[0].speed;
        }

        this.trackLayer.on("postrender", this.animation);
      }
    },
  },
  beforeDestroy() {
    if (this.trackLayer) {
      // 及时取消监听
      this.trackLayer.un("postrender", this.animation);
    }
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
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
      this.trackLayer = this.drawTrack(this.trackData);
      this.infoOverlay = this.getInfoOverlay();

      this.map.addLayer(this.trackLayer);
      this.map.addOverlay(this.infoOverlay);
      // 鼠标样式交互
      const pointerMove = this.changeCursor();
      // 轨迹点击交互
      const trackClick = this.trackLayerClick();
      this.map.addInteraction(pointerMove);
      this.map.addInteraction(trackClick);

      this.trackLayer.on("postrender", this.animation);
    },
    drawTrack(trackObj) {
      // 获取轨迹的点
      const linePoints = trackObj.map((item) => item.coordinate);
      // 绘制轨迹线
      const lineFeature = new Feature({
        geometry: new LineString(linePoints),
        style: new Style({
          stroke: new Stroke({
            color: "red",
            lineDash: [7, 10],
            width: 2,
          }),
        }),
      });

      // 绘制轨迹箭头
      const arrorPoints = this.getArrowPoints(linePoints);
      const arrowFeature = new Feature({
        geometry: new Polygon([arrorPoints]),
        style: new Style({
          fill: new Fill({
            color: "red",
          }),
        }),
      });

      return new VectorLayer({
        style: function (feature) {
          return feature.get("style"); // 注意与方法1的区别
        },
        source: new VectorSource({
          features: [lineFeature, arrowFeature],
        }),
      });
    },
    getInfoOverlay() {
      return new Overlay({
        element: document.getElementById("popover"),
        autoPan: true, // 边缘自动拖拽
        autoPanAnimation: {
          // 拖拽动画
          duration: 250, // 动画时间
        },
      });
    },
    getArrowPoints(linePoints) {
      const headlen = 66; // 箭头斜边大小
      const theta = 20; // 箭头一边与直线的夹角
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
    animation(event) {
      const vectorContext = getVectorContext(event);
      const frameState = event.frameState;
      const elapsed = frameState.time - this.start;
      let radius = 10;
      let opcatity = 0.5;

      if (elapsed > this.speed) {
        radius = 10;
        opcatity = 0.5;
        this.start = Date.now();
      } else {
        radius = easeOut(elapsed / this.speed) * 10;
        opcatity = opcatity * easeOut(1 - elapsed / this.speed);
      }

      vectorContext.setStyle(
        new Style({
          image: new Circle({
            radius,
            fill: new Fill({
              color: `rgba(255,0,0,${opcatity})`,
            }),
          }),
        })
      );

      const geom = new Point(this.trackData[this.length - 1].coordinate);

      vectorContext.drawGeometry(geom);
      this.map.render();
    },
    trackLayerClick() {
      const _this = this;
      return new Select({
        layers: [_this.trackLayer],
        condition: singleClick,
        style: _this.trackLayer.getStyle(),
        toggleCondition: function (e) {
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
            _this.infoVisible = true;
            _this.TrackSpeed = _this.trackData.slice(-1)[0].speed;
            _this.infoOverlay.setPosition(
              _this.trackData.slice(-1)[0].coordinate
            );
          } else {
            _this.infoVisible = false;
            _this.TrackSpeed = 0;
            _this.infoOverlay.setPosition(undefined);
          }
        },
      });
    },
    // 改变鼠标样式
    changeCursor() {
      const _this = this;
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
    handleClosePopover(){
      this.infoVisible = false
      this.infoOverlay.setPosition(undefined);
    }
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