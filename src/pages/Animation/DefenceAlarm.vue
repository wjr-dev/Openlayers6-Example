<template>
  <div class="map-box">
    <div id="map" ref="map" class="map-container"></div>
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
import { Polygon } from 'ol/geom'
import { Fill, Stroke, Style } from 'ol/style'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { getVectorContext } from 'ol/render'
import { linear } from 'ol/easing'
export default {
  name: 'DefenceAlarm', // 防区报警
  mixins: [resizeMixin],
  data() {
    return {
      map: null,
      vectorLayer: null,
      vectorSource: null,
      polygonFeature: null,
      polygonGeom: null,
      polygonPoints: [
        [
          [13382858.923704674, 3530585.2001267006],
          [13382916.25147589, 3529605.850701797],
          [13383967.260614809, 3529677.510415814],
          [13383957.705986274, 3530599.5320695043],
          [13382858.923704674, 3530585.2001267006],
        ],
      ],
      alarmFeature: null,
      speed: 600, // 闪烁速度
      start: Date.now(),
      alarming: false,
    }
  },
  mounted() {
    this.initMap()
  },
  beforeDestroy() {
    this.handleCancel()
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

      this.vectorLayer = this.getPolygon()

      this.map.addLayer(this.vectorLayer)
    },
    getPolygon() {
      this.polygonGeom = new Polygon(this.polygonPoints)
      this.polygonFeature = new Feature({
        geometry: this.polygonGeom,
        style: this.getStyle(),
      })
      this.vectorSource = new VectorSource({ features: [this.polygonFeature] })
      return new VectorLayer({
        style: function (feature) {
          return feature.get('style')
        },
        source: this.vectorSource,
      })
    },
    getStyle() {
      return new Style({
        stroke: new Stroke({
          color: 'rgba(250,173,20,1)',
          // lineDash: [7, 10],
          width: 3,
        }),
        fill: new Fill({
          color: 'rgba(250,173,20,0.2)',
        }),
      })
    },
    getAlramStyle(opcatity) {
      return new Style({
        stroke: new Stroke({
          color: `rgba(255,0,0,${opcatity})`,
          // lineDash: [7, 10],
          width: 4 * (opcatity + 0.2),
        }),
        fill: new Fill({
          color: 'rgba(250,0,0,0.3)',
        }),
      })
    },
    animate(event) {
      const vectorContext = getVectorContext(event)
      const frameState = event.frameState

      const elapsed = frameState.time - this.start
      let scale = 1
      let opcatity = 1
      let time = elapsed
      if (elapsed > this.speed) {
        scale = 1
        opcatity = 1
        this.start = Date.now()
      } else {
        opcatity = opcatity * linear(1 - elapsed / this.speed)
        if (time < this.speed) {
          time = this.speed * 1
        }
        scale = linear(time / this.speed) * 1.03
      }

      const geom = this.polygonGeom.clone()
      geom.scale(scale, scale)

      vectorContext.setStyle(this.getAlramStyle(opcatity))
      vectorContext.drawGeometry(geom)

      this.map.render()
    },
    getAlarmFeature() {
      const style = new Style({
        stroke: new Stroke({
          // color: 'rgb(255,0,0)',
          color: 'rgba(255,0,0,0)',
          // lineDash: [7, 10],
          width: 3,
        }),
        fill: new Fill({
          // color: 'rgba(255,0,0,0.2)',
          color: 'rgba(255,0,0,0)',
        }),
      })
      this.alarmFeature = this.polygonFeature.clone()
      this.alarmFeature.setStyle(style)
      return this.alarmFeature
    },
    handleAlarm() {
      this.vectorSource.addFeature(this.getAlarmFeature())
      this.vectorLayer.on('postrender', this.animate)
    },
    handleCancel() {
      this.vectorLayer.un('postrender', this.animate)
      this.vectorSource.removeFeature(this.alarmFeature)
    },
  },
}
</script>

<style>
</style>