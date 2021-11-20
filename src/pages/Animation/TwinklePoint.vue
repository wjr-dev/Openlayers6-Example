<template>
  <div id="map" ref="map" class="map-container"></div>
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
export default {
  name: 'TwinklePoint', // 闪烁点
  mixins: [resizeMixin],
  data() {
    return {
      map: null,
      pointLayer: null,
      point: [13384755.517469, 3529894.878215],
      speed: 600, // 闪烁速度
      start: Date.now(),
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
      })
      this.pointLayer = this.initFeature()
      this.map.addLayer(this.pointLayer)

      // 动画
      this.pointLayer.on('postrender', this.animation)
    },
    // 点 Point
    initFeature() {
      const feature = new Feature({
        id: 2,
        geometry: new Point(this.point), // 注意自己的经纬度坐标系
        style: new Style({
          image: new Circle({
            radius: 5,
            fill: new Fill({
              color: 'red',
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
      let radius = 5
      let opcatity = 0.6

      if (elapsed > this.speed) {
        radius = 5
        opcatity = 0.6
        this.start = Date.now()
      } else {
        radius = linear(elapsed / this.speed) * 15
        opcatity = opcatity * linear(1 - elapsed / this.speed)
      }

      vectorContext.setStyle(
        new Style({
          image: new Circle({
            radius,
            fill: new Fill({
              color: `rgba(255,0,0,${opcatity * 4})`,
            }),
          }),
        }),
      )

      const geom = new Point(this.point)
      const geom2 = new Point(this.point)
      const geom3 = new Point(this.point)

      vectorContext.drawGeometry(geom)
      vectorContext.setStyle(
        new Style({
          image: new Circle({
            radius: radius * 2,
            fill: new Fill({
              color: `rgba(255,0,0,${opcatity * 2})`,
            }),
          }),
        }),
      )
      vectorContext.drawGeometry(geom2)
      vectorContext.setStyle(
        new Style({
          image: new Circle({
            radius: radius * 4,
            fill: new Fill({
              color: `rgba(255,0,0,${opcatity * 1})`,
            }),
          }),
        }),
      )
      vectorContext.drawGeometry(geom3)
      this.map.render()
    },
  },
}
</script>

<style>
</style>