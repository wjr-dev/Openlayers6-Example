<template>
  <div id="map" ref="map" class="map-container"></div>
</template>

<script>
import resizeMixin from '@/mixins/resizeMixin' // 监听地图容器大小变化,调用 map.updateSize() 方法使地图撑满容器
import 'ol/ol.css'
import Map from 'ol/Map'
import OSM from 'ol/source/OSM'
import TileLayer from 'ol/layer/Tile'
import View from 'ol/View'
import VectorSource from 'ol/source/Vector'
import Feature from 'ol/Feature'
import { Point } from 'ol/geom'
import WebGLPointsLayer from 'ol/layer/WebGLPoints'
export default {
  name: 'IconPoints', // 海量图标
  mixins: [resizeMixin],
  data() {
    return {
      map: null,
      vectorSource: null,
      webGLPointsLayer: null,
      coordinates: [
        [13382758.600105051, 3529634.5145874037],
        [13383231.554217564, 3529644.0692159394],
        [13383393.98290267, 3529648.846530207],
        [13383475.197245223, 3529687.06504435],
        [13383532.525016438, 3529734.838187028],
        [13383575.520844849, 3529820.829843849],
        [13383651.957873134, 3529892.489557866],
        [13383752.281472757, 3529949.81732908],
        [13383905.155529328, 3530007.145100294],
        [13384024.588386023, 3530016.69972883],
        [13384191.794385398, 3530026.2543573654],
        [13384411.550841717, 3530035.808985901],
        [13384636.084612304, 3530097.9140713825],
        [13384841.509125821, 3530193.460356739],
        [13384960.941982517, 3530284.2293278277],
        [13385118.593353355, 3530379.775613184],
        [13385261.91278139, 3530503.9857841474],
        [13385419.564152228, 3530585.2001267006],
        [13385591.54746587, 3530661.6371549857],
        [13385878.186321938, 3530742.851497539],
        [13386174.379806545, 3530809.7338972883],
        [13386461.018662613, 3530881.393611306],
        [13386699.884376004, 3530723.7422404676],
        [13386852.758432575, 3530609.08669804],
        [13386967.413975002, 3530403.6621845234],
        [13387005.632489145, 3530226.901556614],
        [13387010.409803413, 3530083.5821285793],
        [13386981.745917806, 3529964.1492718835],
        [13386890.976946717, 3529844.716415188],
        [13386790.653347094, 3529706.1743014213],
        [13386633.001976255, 3529591.518758993],
        [13386451.464034079, 3529510.3044164404],
        [13386040.615007045, 3529639.2919016713],
        [13385796.971979385, 3529706.1743014213],
        [13385534.219694655, 3529782.6113297064],
        [13385333.572495406, 3529935.4853862766],
        [13385319.240552604, 3530193.460356739],
        [13385118.593353355, 3530437.103384398],
        [13384793.735983143, 3530599.5320695043],
        [13384363.777699038, 3530747.6288118064],
      ],
      style: {
        // variables: {
        //   filterShape: 'all',
        // },
        // filter: [
        //   'case',
        //   ['!=', ['var', 'filterShape'], 'all'],
        //   ['==', ['get', 'shape'], ['var', 'filterShape']],
        //   true,
        // ],
        symbol: {
          symbolType: 'image',
          src: require('@/assets/imgs/resource/boat.png'),
          size: 16,
          // color: 'red',
          rotateWithView: false,
          offset: [0, 0],
          rotation:['get','rotation']
        },
      },
    }
  },
  mounted() {
    this.initMap()
    this.initSource()
    this.initWebGLPointsLayer()
    this.map.addLayer(this.webGLPointsLayer)
    const features = this.coordinates.map(item => {
      return new Feature({
        geometry: new Point(item),
        rotation: Math.random() * 2 * Math.PI // 随机一个弧度
      })
    })
    this.vectorSource.addFeatures(features)
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
    },
    initSource() {
      this.vectorSource = new VectorSource()
    },
    initWebGLPointsLayer() {
      this.webGLPointsLayer = new WebGLPointsLayer({
        source: this.vectorSource,
        style: this.style,
      })
    },
  },
}
</script>

<style>
</style>