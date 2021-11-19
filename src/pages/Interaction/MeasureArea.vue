<template>
  <div class="map-box">
    <div id="map" ref="map" class="map-container"></div>
    <div :id="key" v-for="(item, key) in featureIds" :key="key" class="delete">
      <span class="delete-btn">
        <a-icon type="delete" @click="handleDelete(key)" />
      </span>
      <span class="text"> 面积: {{ item.area }} m<sup>2</sup> </span>
    </div>
  </div>
</template>

<script>
import resizeMixin from '@/mixins/resizeMixin' // 监听地图容器大小变化,调用 map.updateSize() 方法使地图撑满容器
import 'ol/ol.css'
import Map from 'ol/Map'
import OSM from 'ol/source/OSM'
import TileLayer from 'ol/layer/Tile'
import View from 'ol/View'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Fill, Stroke, Style } from 'ol/style'
import CircleStyle from 'ol/style/Circle'
import { Draw, Modify, Snap } from 'ol/interaction'
import Overlay from 'ol/Overlay'
import { MultiPoint } from 'ol/geom'
export default {
  name: 'MeasureArea', // 测面
  mixins: [resizeMixin],
  data() {
    return {
      map: null,
      vectorLayer: null,
      vectorSource: null,
      drawPolygon: null,
      snap: null,
      modify: null,
      featureIds: {},
    }
  },
  mounted() {
    this.initMap()
  },
  beforeDestroy() {
    // 卸载监听
    this.drawPolygon && this.drawPolygon.un('drawend', this.drawPolygonEnd)
    this.modify && this.modify.un('modifyend', this.modifyEnd)
  },
  methods: {
    initMap() {
      // 先准备一个绘制的矢量图层
      const { vectorLayer, vectorSource } = this.getVectorLayer()
      this.vectorLayer = vectorLayer
      this.vectorSource = vectorSource
      this.map = new Map({
        target: 'map',
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          vectorLayer,
        ],
        view: new View({
          center: [13384755.517469, 3529894.878215],
          zoom: 15,
        }),
        controls: [],
      })
      // 添加交互
      this.addInteractions(vectorSource)
    },
    getVectorLayer() {
      const vectorSource = new VectorSource()

      const styles = [
        /* We are using two different styles for the polygons:
         *  - The first style is for the polygons themselves.
         *  - The second style is to draw the vertices of the polygons.
         *    In a custom `geometry` function the vertices of a polygon are
         *    returned as `MultiPoint` geometry, which will be used to render
         *    the style.
         */
        new Style({
          stroke: new Stroke({
            color: 'blue',
            width: 2,
          }),
          fill: new Fill({
            color: 'rgba(0, 0, 255, 0.1)',
          }),
        }),
        new Style({
          image: new CircleStyle({
            radius: 5,
            fill: new Fill({
              color: '#fff',
            }),
            stroke: new Stroke({
              color: 'orange',
              width: 2,
            }),
          }),
          geometry: function (feature) {
            // return the coordinates of the first ring of the polygon
            const coordinates = feature.getGeometry().getCoordinates()[0]
            return new MultiPoint(coordinates)
          },
        }),
      ]

      const vectorLayer = new VectorLayer({
        source: vectorSource,
        style: styles,
      })

      return {
        vectorLayer,
        vectorSource,
      }
    },
    addInteractions(source) {
      // 捕捉
      this.snap = new Snap({ source })
      // 修改
      this.modify = new Modify({ source })
      // 绘制多边形
      this.drawPolygon = new Draw({
        source,
        type: 'Polygon',
        id: 'draw-Polygon',
      })

      this.map.addInteraction(this.modify)
      this.map.addInteraction(this.snap)
      this.map.addInteraction(this.drawPolygon)

      // setTimeout(() => {
      //   // 移除交互
      //   this.map.removeInteraction(this.modify);
      //   this.map.removeInteraction(this.snap);
      //   this.map.removeInteraction(this.drawPolygon);

      //   this.drawPolygon.un("drawend", this.drawPolygonEnd);
      //   this.modify.un("modifyend", this.modifyEnd);
      // }, 10000);

      this.drawPolygon.on('drawend', this.drawPolygonEnd)
      this.modify.on('modifyend', this.modifyEnd)
    },
    // 绘制 Polygon 交互
    drawPolygonEnd(e) {
      // 添加多边形ID
      const id = `polygon_${e.feature.ol_uid}`
      e.feature.setId(id)
      this.featureIds = {
        ...this.featureIds,
        ...{
          [id]: {
            area: Math.round(e.feature.getGeometry().getArea() * 100) / 100,
          },
        },
      }
      // 获取几何图形中心点
      const flatCoordinates = e.feature.getGeometry().getInteriorPoint().flatCoordinates
      const centerPoint = [flatCoordinates[0], flatCoordinates[1]] // 几何图形中心点

      this.$nextTick(() => {
        this.getOverayDelete(id, centerPoint)
      })
    },
    // 修改交互
    modifyEnd(e) {
      const feature = e.features.getArray()[0]
      const id = feature.getId()
      // 获取几何图形中心点
      const flatCoordinates = feature.getGeometry().getInteriorPoint().flatCoordinates
      const centerPoint = [flatCoordinates[0], flatCoordinates[1]] // 几何图形中心点
      this.featureIds[id] = {
        area: Math.round(feature.getGeometry().getArea() * 100) / 100,
      }
      // 重新设置overlay定位
      this.map.getOverlayById(id).setPosition(centerPoint)
    },
    getOverayDelete(id, position) {
      const overlay = new Overlay({
        id,
        element: document.getElementById(id),
        position,
        positioning: 'right-center',
        stopEvent: true,
      })
      this.map.addOverlay(overlay)
    },
    // 删除多边形
    handleDelete(id) {
      // 清除多边形
      const polygonFeature = this.vectorSource.getFeatureById(id)
      this.vectorSource.removeFeature(polygonFeature)
      // 清除Overlay
      const overlay = this.map.getOverlayById(id)
      this.map.removeOverlay(overlay)
      // 删除该条线的 featureIds
      const featureIds = { ...this.featureIds }
      delete featureIds[id]
      this.featureIds = featureIds
    },
  },
}
</script>
<style lang="scss" scoped>
.delete {
  width: max-content;
  min-width: 100px;
  background: #fff;
  color: #333;
  position: absolute;
  height: 22px;
  line-height: 22px;
  .delete-btn {
    display: inline-block;
    width: 30px;
    text-align: center;
    background: crimson;
    color: #fff;
  }
  .text {
    padding: 0 10px;
  }
}
</style>