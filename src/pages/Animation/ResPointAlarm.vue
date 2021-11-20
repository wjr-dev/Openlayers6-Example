<template>
  <div class="map-box">
    <div id="map" ref="map" class="map-container"></div>
    <div id="resource" :class="{ resource: true, alarming }">
      <div class="res-bg"></div>
      <span class="iconfont icon-qiuji"></span>
    </div>
    <div class="button-box">
      <a-button type="primary" @click="handleAlarm"> 报警 </a-button>
      <a-button @click="handleCancel">取消</a-button>
    </div>
  </div>
</template>

<script>
import resizeMixin from '@/mixins/resizeMixin'
import 'ol/ol.css'
import Map from 'ol/Map'
import OSM from 'ol/source/OSM'
import TileLayer from 'ol/layer/Tile'
import View from 'ol/View'
import Feature from 'ol/Feature'
import { Point } from 'ol/geom'
import { Style, Circle, Fill } from 'ol/style'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { getVectorContext } from 'ol/render'
import { linear } from 'ol/easing'
import Overlay from 'ol/Overlay'
//==================================
import IconFont from '@/components/MyFont.js'
export default {
  name: 'ResPointAlarm', // 资源点报警
  mixins: [resizeMixin],
  components: { IconFont },
  data() {
    return {
      map: null,
      pointLayer: null,
      point: [13384755.517469, 3529894.878215],
      resPoint: null,
      speed: 600, // 闪烁速度
      start: Date.now(),
      alarming: false,
    }
  },
  mounted() {
    this.initMap()
  },
  beforeDestroy() {
    // 销毁前取消动画
    this.pointLayer.un('postrender', this.animation)
  },
  methods: {
    initMap() {
      this.map = new Map({
        target: 'map',
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
      })
      this.getResourceOverlay()
      // this.pointLayer = this.initFeature()
      // this.map.addLayer(this.pointLayer)

      // 动画
      // this.pointLayer.on('postrender', this.animation)
    },
    getResourceOverlay() {
      const resPoint = new Overlay({
        element: document.getElementById('resource'),
        position: this.point,
        positioning: 'center-center',
        stopEvent: true,
      })

      this.map.addOverlay(resPoint)
    },
    // 点 Point
    initFeature() {
      const feature = new Feature({
        id: 2,
        geometry: new Point(this.point), // 注意自己的经纬度坐标系
        style: new Style({
          image: new Circle({
            radius: 18,
            fill: new Fill({
              color: 'transparent',
            }),
          }),
        }),
      })
      const vectorLayer = new VectorLayer({
        style: function (feature) {
          return feature.get('style') // 注意与方法1的区别
        },
        source: new VectorSource({ features: [feature] }),
      })

      return vectorLayer
    },
    // 动画
    animation(event) {
      const vectorContext = getVectorContext(event)
      const frameState = event.frameState

      const elapsed = frameState.time - this.start
      let radius = 18
      let opcatity = 0.6

      if (elapsed > this.speed) {
        radius = 18
        opcatity = 0.6
        this.start = Date.now()
      } else {
        radius = linear(elapsed / this.speed) * 30
        opcatity = opcatity * linear(1 - elapsed / this.speed)
      }

      const geom = new Point(this.point)
      const geom2 = new Point(this.point)
      const geom3 = new Point(this.point)

      vectorContext.setStyle(this.getPointStyle(radius, opcatity * 2.5))
      vectorContext.drawGeometry(geom)

      vectorContext.setStyle(this.getPointStyle(radius * 1.5, opcatity * 1.5))
      vectorContext.drawGeometry(geom2)

      vectorContext.setStyle(this.getPointStyle(radius * 2.5, opcatity))
      vectorContext.drawGeometry(geom3)
      this.map.render()
    },
    getPointStyle(radius, opcatity) {
      return new Style({
        image: new Circle({
          radius: radius,
          fill: new Fill({
            color: `rgba(255,0,0,${opcatity})`,
          }),
        }),
      })
    },
    handleAlarm() {
      this.alarming = true
      this.pointLayer = this.initFeature()
      this.map.addLayer(this.pointLayer)
      // 动画
      this.pointLayer.on('postrender', this.animation)
    },
    handleCancel() {
      if (this.alarming) {
        this.alarming = false
        this.map.removeLayer(this.pointLayer)
        this.pointLayer.un('postrender', this.animation)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.resource {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: url('../../assets/imgs/resource/res_bg.png') no-repeat;
  background-size: 36px 36px;
  cursor: pointer;
  font-size: 18px;
  text-align: center;
  line-height: 36px;
  color: #fff;
  position: relative;
  .res-bg{
    position: absolute;
    width: 42px;
    height: 42px;
    top: 0;
    left: 0;
    background: url('../../assets/imgs/resource/res_hover.png') no-repeat;
    background-size: 42px 42px;
    margin-top: -3px;
    margin-left: -3px;
    z-index: -1;
    display: none;
  }
  .iconfont {
    font-size: 18px;
  }
  &:hover {
    .res-bg{
      animation: hover 2s linear infinite;
      display: block;
    }
  }
  &.alarming {
    animation: alarming 0.6s infinite;
  }
}
@keyframes alarming {
  0% {
    color: rgb(255, 255, 255);
  }
  100% {
    color: rgb(255, 0, 0);
  }
}
@keyframes hover {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>