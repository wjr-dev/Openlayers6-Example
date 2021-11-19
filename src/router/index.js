import VueRouter from 'vue-router'
import Home from '@/pages/Home.vue'

const router = new VueRouter({
  routes: [{
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      label: '首页',
      root: null,
      current: 'Home'
    }
  }, {
    path: '/baseMap',
    name: 'BaseMap',
    component: () => import('@/pages/BaseMap.vue'),
    meta: {
      label: '基础地图',
      root: null,
      current: 'BaseMap'
    }
  }, {
    path: '/overlay/',
    name: 'Overlay',
    component: () => import('@/pages/Overlay/index.vue'),
    meta: {
      label: 'Overlay 叠加层',
      root: null,
      current: 'Overlay'
    },
    children: [{
      path: 'marker',
      name: 'Marker',
      component: () => import('@/pages/Overlay/Marker.vue'),
      meta: {
        label: '标记点',
        root: 'Overlay',
        current: 'Marker'
      }
    }]
  }, {
    path: '/vectorLayer/',
    name: 'VectorLayer',
    component: () => import('@/pages/VectorLayer/index.vue'),
    meta: {
      label: 'VectorLayer 矢量图层',
      root: null,
      current: 'VectorLayer'
    },
    children: [{
      path: 'point',
      name: 'Point',
      component: () => import('@/pages/VectorLayer/Point.vue'),
      meta: {
        label: 'Point 点',
        root: 'VectorLayer',
        current: 'Point'
      }
    }, {
      path: 'lineString',
      name: 'LineString',
      component: () => import('@/pages/VectorLayer/LineString.vue'),
      meta: {
        label: 'LineString 线',
        root: 'VectorLayer',
        current: 'LineString'
      }
    }, {
      path: 'polygon',
      name: 'Polygon',
      component: () => import('@/pages/VectorLayer/Polygon.vue'),
      meta: {
        label: 'Polygon 多边形(面)',
        root: 'VectorLayer',
        current: 'Polygon'
      }
    }, {
      path: 'multiPoint',
      name: 'MultiPoint',
      component: () => import('@/pages/VectorLayer/MultiPoint.vue'),
      meta: {
        label: 'MultiPoint 多点',
        root: 'VectorLayer',
        current: 'MultiPoint'
      }
    }, {
      path: 'multiLineString',
      name: 'MultiLineString',
      component: () => import('@/pages/VectorLayer/MultiLineString.vue'),
      meta: {
        label: 'MultiLineString 多线',
        root: 'VectorLayer',
        current: 'MultiLineString'
      }
    }, {
      path: 'multiPolygon',
      name: 'MultiPolygon',
      component: () => import('@/pages/VectorLayer/MultiPolygon.vue'),
      meta: {
        label: 'MultiPolygon 多面',
        root: 'VectorLayer',
        current: 'MultiPolygon'
      }
    }, {
      path: 'arrow',
      name: 'Arrow',
      component: () => import('@/pages/VectorLayer/Arrow.vue'),
      meta: {
        label: '箭头',
        root: 'VectorLayer',
        current: 'Arrow'
      }
    },
    {
      path: 'ship',
      name: 'Ship',
      component: () => import('@/pages/VectorLayer/Ship.vue'),
      meta: {
        label: '船',
        root: 'VectorLayer',
        current: 'Ship'
      }
    }, {
      path: 'sector',
      name: 'Sector',
      component: () => import('@/pages/VectorLayer/Sector.vue'),
      meta: {
        label: '扇形',
        root: 'VectorLayer',
        current: 'Sector'
      }
    }, {
      path: 'radar',
      name: 'Radar',
      component: () => import('@/pages/VectorLayer/Radar.vue'),
      meta: {
        label: '雷达',
        root: 'VectorLayer',
        current: 'Radar'
      }
    },]
  },
  {
    path: '/animation/',
    name: 'Animation',
    component: () => import('@/pages/Animation/index.vue'),
    meta: {
      label: 'Animation 动画'
    },
    children: [{
      path: 'twinklePoint',
      name: 'TwinklePoint',
      component: () => import('@/pages/Animation/TwinklePoint.vue'),
      meta: {
        label: '闪烁点',
        root: 'Animation',
        current: 'TwinklePoint'
      }
    }, {
      path: 'trackLine',
      name: 'TrackLine',
      component: () => import('@/pages/Animation/TrackLine.vue'),
      meta: {
        label: '轨迹线',
        root: 'Animation',
        current: 'TrackLine'
      }
    }, {
      path: 'trackPlayback',
      name: 'TrackPlayback',
      component: () => import('@/pages/Animation/TrackPlayback.vue'),
      meta: {
        label: '轨迹回放',
        root: 'Animation',
        current: 'TrackPlayback'
      }
    }, {
      path: 'radarAnimation',
      name: 'RadarAnimation',
      component: () => import('@/pages/Animation/RadarAnimation.vue'),
      meta: {
        label: '雷达波',
        root: 'Animation',
        current: 'RadarAnimation'
      }
    },]
  },
  {
    path: '/interaction/',
    name: 'Interaction',
    component: () => import('@/pages/Interaction/index.vue'),
    meta: {
      label: 'Interaction 交互'
    },
    children: [{
      path: 'popover',
      name: 'Popover',
      component: () => import('@/pages/Interaction/Popover.vue'),
      meta: {
        label: 'Popover 点击弹窗',
        root: 'Interaction',
        current: 'Popover'
      }
    }, {
      path: 'setCenter',
      name: 'SetCenter',
      component: () => import('@/pages/Interaction/SetCenter.vue'),
      meta: {
        label: 'SetCenter 设置中心',
        root: 'Interaction',
        current: 'SetCenter'
      }
    }, {
      path: 'hoverAndClick',
      name: 'HoverAndClick',
      component: () => import('@/pages/Interaction/HoverAndClick.vue'),
      meta: {
        label: '矢量图层 Hover和Click',
        root: 'Interaction',
        current: 'HoverAndClick'
      }
    }, {
      path: 'switchTileLayer',
      name: 'SwitchTileLayer',
      component: () => import('@/pages/Interaction/SwitchTileLayer.vue'),
      meta: {
        label: '切换瓦片图层',
        root: 'Interaction',
        current: 'SwitchTileLayer'
      }
    }, {
      path: 'showTrackInfo',
      name: 'ShowTrackInfo',
      component: () => import('@/pages/Interaction/ShowTrackInfo.vue'),
      meta: {
        label: '点击轨迹显示信息',
        root: 'Interaction',
        current: 'ShowTrackInfo'
      }
    }, {
      path: 'vectorLayerVisible',
      name: 'VectorLayerVisible',
      component: () => import('@/pages/Interaction/VectorLayerVisible.vue'),
      meta: {
        label: '矢量图层显示隐藏',
        root: 'Interaction',
        current: 'VectorLayerVisible'
      }
    }, {
      path: 'addMarker',
      name: 'AddMarker',
      component: () => import('@/pages/Interaction/AddMarker.vue'),
      meta: {
        label: '添加标记点',
        root: 'Interaction',
        current: 'AddMarker'
      }
    }, {
      path: 'measureDistance',
      name: 'MeasureDistance',
      component: () => import('@/pages/Interaction/MeasureDistance.vue'),
      meta: {
        label: '测距',
        root: 'Interaction',
        current: 'MeasureDistance'
      }
    }, {
      path: 'measureArea',
      name: 'MeasureArea',
      component: () => import('@/pages/Interaction/MeasureArea.vue'),
      meta: {
        label: '测面',
        root: 'Interaction',
        current: 'MeasureArea'
      }
    }, {
      path: 'drawBox',
      name: 'DrawBox',
      component: () => import('@/pages/Interaction/DrawBox.vue'),
      meta: {
        label: '框选',
        root: 'Interaction',
        current: 'DrawBox'
      }
    },]
  },

  ]
})

export default router
