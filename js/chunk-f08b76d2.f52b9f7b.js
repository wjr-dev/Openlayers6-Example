(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-f08b76d2"],{"059b":function(a,t,e){"use strict";e.r(t);var n=function(){var a=this,t=a.$createElement,e=a._self._c||t;return e("div",{staticClass:"map-box"},[e("div",{ref:"map",staticClass:"map-container",attrs:{id:"map"}}),e("div",{staticClass:"button-box"},[e("a-button",{attrs:{type:"primary"},on:{click:function(t){return a.handleChangeLayer("layer1")}}},[a._v(" 矢量地图 ")]),e("a-button",{on:{click:function(t){return a.handleChangeLayer("layer2")}}},[a._v(" 卫星影像 ")])],1)])},i=[],s=(e("d81d"),e("69af")),r=(e("5bc0"),e("5eee")),c=e("2ef1"),l=e("480c"),o=e("a2c7"),u={name:"SwitchTileLayer",mixins:[s["a"]],data:function(){return{map:null,layer1:null,layer2:null}},mounted:function(){this.initMap()},methods:{initMap:function(){this.layer1=new l["a"]({source:new c["a"]({url:"https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}"})}),this.layer2=new l["a"]({source:new c["a"]({url:"https://webst03.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}"})}),this.map=new r["a"]({target:"map",layers:[this.layer1],view:new o["a"]({center:[13384755.517469,3529894.878215],zoom:15}),controls:[]})},handleChangeLayer:function(a){this.map.setLayers([this[a]])}}},p=u,h=(e("7260"),e("2877")),y=Object(h["a"])(p,n,i,!1,null,"03bc1a65",null);t["default"]=y.exports},"61b8":function(a,t,e){},7260:function(a,t,e){"use strict";e("61b8")}}]);