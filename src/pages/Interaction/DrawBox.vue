<template>
  <div class="map-box">
    <div id="map" ref="map" class="map-container"></div>
    <div id="marker"></div>
  </div>
</template>

<script>
import resizeMixin from '@/mixins/resizeMixin' // 监听地图容器大小变化,调用 map.updateSize() 方法使地图撑满容器
import 'ol/ol.css'
import Map from 'ol/Map'
import OSM from 'ol/source/OSM'
import TileLayer from 'ol/layer/Tile'
import View from 'ol/View'
import { DragBox } from 'ol/interaction'
import Overlay from 'ol/Overlay'
import { always } from 'ol/events/condition'
import { containsCoordinate } from 'ol/extent'
export default {
  name: 'DrawBox', // 框选
  mixins: [resizeMixin],
  data() {
    return {
      map: null,
      dragBox: null,
      selectOverlays: [] // 当前选中的 Overlay
    }
  },
  mounted() {
    this.initMap()
    this.addMarker()
  },
  beforeDestroy(){
    this.dragBox && this.dragBox.un('boxstart', this.dragBoxStart)
    this.dragBox && this.dragBox.un('boxend', this.dragBoxEnd)
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

      this.dragBox = this.initDragBox()

      this.map.addInteraction(this.dragBox)
    },
    addMarker() {
      const pos = [13384755.517469, 3529894.878215]
      const marker = new Overlay({
        element: document.getElementById('marker'),
        position: pos,
        positioning: 'center-center',
        stopEvent: false,
      })
      this.map.addOverlay(marker)
    },
    initDragBox() {
      const dragBox = new DragBox({
        condition: always,
      })
      dragBox.on('boxstart', this.dragBoxStart)
      dragBox.on('boxend', this.dragBoxEnd)
      return dragBox
    },
    dragBoxStart() {
      // 框选前还原所有 Overlay
      this.selectOverlays.map(item => {
        item.getElement().style.backgroundColor = 'red'
      })
    },
    dragBoxEnd() {
      // 获取框选范围
      const extent = this.dragBox.getGeometry().getExtent()
      // 获取 Map 中所有的 Overlay
      const overlays = this.map.getOverlays().getArray()
      // 筛选出所有在当前范围内的 Overlay
      this.selectOverlays = overlays.filter(item => containsCoordinate(extent, item.getPosition()))
      // 改变框选的 Overlay 颜色
      this.selectOverlays.map(item => {
        item.getElement().style.backgroundColor = 'blue'
      })
    },
  },
}
</script>

<style lang="scss" scoped>
#marker {
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  border-radius: 50%;
  background-color: red;
  opacity: 0.5;
  cursor: pointer;
}
</style>