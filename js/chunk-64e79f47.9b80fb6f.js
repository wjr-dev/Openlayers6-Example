(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-64e79f47"],{"0710":function(t,e,n){"use strict";var o=n("e269"),i=n("592d"),r={BOTTOM_LEFT:"bottom-left",BOTTOM_CENTER:"bottom-center",BOTTOM_RIGHT:"bottom-right",CENTER_LEFT:"center-left",CENTER_CENTER:"center-center",CENTER_RIGHT:"center-right",TOP_LEFT:"top-left",TOP_CENTER:"top-center",TOP_RIGHT:"top-right"},a=n("cd7e"),s=n("0af5"),p=n("1e8d"),c=n("0999"),l=function(){var t=function(e,n){return t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])},t(e,n)};return function(e,n){if("function"!==typeof n&&null!==n)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");function o(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(o.prototype=n.prototype,new o)}}(),u={ELEMENT:"element",MAP:"map",OFFSET:"offset",POSITION:"position",POSITIONING:"positioning"},d=function(t){function e(e){var n=t.call(this)||this;n.on,n.once,n.un,n.options=e,n.id=e.id,n.insertFirst=void 0===e.insertFirst||e.insertFirst,n.stopEvent=void 0===e.stopEvent||e.stopEvent,n.element=document.createElement("div"),n.element.className=void 0!==e.className?e.className:"ol-overlay-container "+a["d"],n.element.style.position="absolute",n.element.style.pointerEvents="auto";var o=e.autoPan;return o&&"object"!==typeof o&&(o={animation:e.autoPanAnimation,margin:e.autoPanMargin}),n.autoPan=o||!1,n.rendered={transform_:"",visible:!0},n.mapPostrenderListenerKey=null,n.addChangeListener(u.ELEMENT,n.handleElementChanged),n.addChangeListener(u.MAP,n.handleMapChanged),n.addChangeListener(u.OFFSET,n.handleOffsetChanged),n.addChangeListener(u.POSITION,n.handlePositionChanged),n.addChangeListener(u.POSITIONING,n.handlePositioningChanged),void 0!==e.element&&n.setElement(e.element),n.setOffset(void 0!==e.offset?e.offset:[0,0]),n.setPositioning(void 0!==e.positioning?e.positioning:r.TOP_LEFT),void 0!==e.position&&n.setPosition(e.position),n}return l(e,t),e.prototype.getElement=function(){return this.get(u.ELEMENT)},e.prototype.getId=function(){return this.id},e.prototype.getMap=function(){return this.get(u.MAP)},e.prototype.getOffset=function(){return this.get(u.OFFSET)},e.prototype.getPosition=function(){return this.get(u.POSITION)},e.prototype.getPositioning=function(){return this.get(u.POSITIONING)},e.prototype.handleElementChanged=function(){Object(c["d"])(this.element);var t=this.getElement();t&&this.element.appendChild(t)},e.prototype.handleMapChanged=function(){this.mapPostrenderListenerKey&&(Object(c["e"])(this.element),Object(p["c"])(this.mapPostrenderListenerKey),this.mapPostrenderListenerKey=null);var t=this.getMap();if(t){this.mapPostrenderListenerKey=Object(p["a"])(t,i["a"].POSTRENDER,this.render,this),this.updatePixelPosition();var e=this.stopEvent?t.getOverlayContainerStopEvent():t.getOverlayContainer();this.insertFirst?e.insertBefore(this.element,e.childNodes[0]||null):e.appendChild(this.element),this.performAutoPan()}},e.prototype.render=function(){this.updatePixelPosition()},e.prototype.handleOffsetChanged=function(){this.updatePixelPosition()},e.prototype.handlePositionChanged=function(){this.updatePixelPosition(),this.performAutoPan()},e.prototype.handlePositioningChanged=function(){this.updatePixelPosition()},e.prototype.setElement=function(t){this.set(u.ELEMENT,t)},e.prototype.setMap=function(t){this.set(u.MAP,t)},e.prototype.setOffset=function(t){this.set(u.OFFSET,t)},e.prototype.setPosition=function(t){this.set(u.POSITION,t)},e.prototype.performAutoPan=function(){this.autoPan&&this.panIntoView(this.autoPan)},e.prototype.panIntoView=function(t){var e=this.getMap();if(e&&e.getTargetElement()&&this.get(u.POSITION)){var n=this.getRect(e.getTargetElement(),e.getSize()),o=this.getElement(),i=this.getRect(o,[Object(c["c"])(o),Object(c["b"])(o)]),r=t||{},a=void 0===r.margin?20:r.margin;if(!Object(s["g"])(n,i)){var p=i[0]-n[0],l=n[2]-i[2],d=i[1]-n[1],h=n[3]-i[3],f=[0,0];if(p<0?f[0]=p-a:l<0&&(f[0]=Math.abs(l)+a),d<0?f[1]=d-a:h<0&&(f[1]=Math.abs(h)+a),0!==f[0]||0!==f[1]){var m=e.getView().getCenterInternal(),g=e.getPixelFromCoordinateInternal(m);if(!g)return;var E=[g[0]+f[0],g[1]+f[1]],O=r.animation||{};e.getView().animateInternal({center:e.getCoordinateFromPixelInternal(E),duration:O.duration,easing:O.easing})}}}},e.prototype.getRect=function(t,e){var n=t.getBoundingClientRect(),o=n.left+window.pageXOffset,i=n.top+window.pageYOffset;return[o,i,o+e[0],i+e[1]]},e.prototype.setPositioning=function(t){this.set(u.POSITIONING,t)},e.prototype.setVisible=function(t){this.rendered.visible!==t&&(this.element.style.display=t?"":"none",this.rendered.visible=t)},e.prototype.updatePixelPosition=function(){var t=this.getMap(),e=this.getPosition();if(t&&t.isRendered()&&e){var n=t.getPixelFromCoordinate(e),o=t.getSize();this.updateRenderedPosition(n,o)}else this.setVisible(!1)},e.prototype.updateRenderedPosition=function(t,e){var n=this.element.style,o=this.getOffset(),i=this.getPositioning();this.setVisible(!0);var a=Math.round(t[0]+o[0])+"px",s=Math.round(t[1]+o[1])+"px",p="0%",c="0%";i==r.BOTTOM_RIGHT||i==r.CENTER_RIGHT||i==r.TOP_RIGHT?p="-100%":i!=r.BOTTOM_CENTER&&i!=r.CENTER_CENTER&&i!=r.TOP_CENTER||(p="-50%"),i==r.BOTTOM_LEFT||i==r.BOTTOM_CENTER||i==r.BOTTOM_RIGHT?c="-100%":i!=r.CENTER_LEFT&&i!=r.CENTER_CENTER&&i!=r.CENTER_RIGHT||(c="-50%");var l="translate("+p+", "+c+") translate("+a+", "+s+")";this.rendered.transform_!=l&&(this.rendered.transform_=l,n.transform=l,n.msTransform=l)},e.prototype.getOptions=function(){return this.options},e}(o["a"]);e["a"]=d},6280:function(t,e,n){"use strict";n("e935")},d0e9:function(t,e,n){"use strict";var o=n("2ef1"),i=function(){var t=function(e,n){return t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])},t(e,n)};return function(e,n){if("function"!==typeof n&&null!==n)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");function o(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(o.prototype=n.prototype,new o)}}(),r='&#169; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors.',a=function(t){function e(e){var n,o=this,i=e||{},a=void 0===i.imageSmoothing||i.imageSmoothing;void 0!==i.interpolate&&(a=i.interpolate),n=void 0!==i.attributions?i.attributions:[r];var s=void 0!==i.crossOrigin?i.crossOrigin:"anonymous",p=void 0!==i.url?i.url:"https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png";return o=t.call(this,{attributions:n,attributionsCollapsible:!1,cacheSize:i.cacheSize,crossOrigin:s,interpolate:a,maxZoom:void 0!==i.maxZoom?i.maxZoom:19,opaque:void 0===i.opaque||i.opaque,reprojectionErrorThreshold:i.reprojectionErrorThreshold,tileLoadFunction:i.tileLoadFunction,transition:i.transition,url:p,wrapX:i.wrapX,zDirection:i.zDirection})||this,o}return i(e,t),e}(o["a"]);e["a"]=a},d57d:function(t,e,n){"use strict";n.r(e);var o=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"map-box"},[n("div",{ref:"map",staticClass:"map-container",attrs:{id:"map"}}),n("div",{attrs:{id:"marker1"}}),n("div",{attrs:{id:"marker2"}}),n("div",{staticClass:"button-box"},[n("a-button",{attrs:{type:"primary"},on:{click:t.handleSetCenter}},[t._v(" 移动中心并放大层级 ")]),n("a-button",{on:{click:t.handleRecover}},[t._v(" 恢复 ")])],1)])},i=[],r=(n("d81d"),n("69af")),a=(n("5bc0"),n("5eee")),s=n("d0e9"),p=n("480c"),c=n("a2c7"),l=n("0710"),u={name:"SetCenter",mixins:[r["a"]],data:function(){return{map:null}},mounted:function(){this.initMap()},methods:{initMap:function(){var t=new l["a"]({element:document.getElementById("marker1"),position:[0,0],positioning:"center-center",stopEvent:!1}),e=new l["a"]({element:document.getElementById("marker2"),position:[13368091.088894,3556688.839038],positioning:"center-center",stopEvent:!1});this.map=new a["a"]({target:"map",layers:[new p["a"]({source:new s["a"]})],view:new c["a"]({center:[0,0],zoom:2}),overlays:[t,e]})},handleSetCenter:function(){var t=this.map.getView();t.animate({center:[13368091.088894,3556688.839038]},{zoom:10})},handleRecover:function(){var t=this.map.getView();t.animate({zoom:2,duration:2e3},{center:[0,0]})}}},d=u,h=(n("6280"),n("2877")),f=Object(h["a"])(d,o,i,!1,null,null,null);e["default"]=f.exports},e935:function(t,e,n){}}]);