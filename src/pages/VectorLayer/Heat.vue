<!--
 * @Author: wangwenchao6
 * @Date: 2022-01-10 19:41:12
 * @LastEditTime: 2022-01-10 20:08:08
 * @LastEditors: wangwenchao6
 * @Description: 
-->
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
import { Fill, Stroke, Style, Circle } from 'ol/style'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Heatmap from 'ol/layer/Heatmap'
export default {
  name: 'Heat', // 热力图
  mixins: [resizeMixin],
  data() {
    return {
      map: null,
      layer: null,
      source: null,
      // point: [13384755.517469, 3529894.878215],
      points: [
        [13377991.027382, 3522092.58304],
        [13377991.027382, 3522092.58304],
        [13376144.040088, 3527217.042776],
        [13376144.040088, 3527217.042776],
        [13376144.040088, 3527217.042776],
        [13376144.040088, 3527217.042776],
        [13376144.040088, 3527217.042776],
        [13376144.040088, 3527217.042776],
        [13376144.040088, 3527217.042776],
        [13376144.040088, 3527217.042776],
        [13376144.040088, 3527217.042776],
        [13376144.040088, 3527217.042776],
        [13376144.040088, 3527217.042776],
        [13377819.069169, 3528834.668683],
        [13377819.069169, 3528834.668683],
        [13377819.069169, 3528834.668683],
        [13377819.069169, 3528834.668683],
        [13377819.069169, 3528834.668683],
        [13377819.069169, 3528834.668683],
        [13377819.069169, 3528834.668683],
        [13377819.069169, 3528834.668683],
        [13377819.069169, 3528834.668683],
        [13369200.769129, 3530156.689524],
        [13369200.769129, 3530156.689524],
        [13369200.769129, 3530156.689524],
        [13370920.602266, 3526908.115822],
        [13370920.602266, 3526908.115822],
        [13370920.602266, 3526908.115822],
        [13370920.602266, 3526908.115822],
      ],
    }
  },
  mounted() {
    this.initMap()
    this.getLayer()
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
          center: [13380169.479899, 3523481.708657],
          zoom: 10,
        }),
      })

      // const pointLayer = this.getPoint()
      // this.map.addLayer(pointLayer)
    },
    getLayer() {
      let colors = ['#2200FF', '#16D9CC', '#4DEE12', '#E8D225', '#EF1616']
      this.source = new VectorSource()
      this.layer = new Heatmap({
        source: this.source,
        blur: 30,
        radius: 15,
        gradient: colors
      })

      this.map.addLayer(this.layer)

      const features = this.points.map(item => {
        return new Feature({
          geometry: new Point(item),
        })
      })
      console.log(features);
      this.source.addFeatures(features)
    },
  },
}
</script>

<style>
</style>
