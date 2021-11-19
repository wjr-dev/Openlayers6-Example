<template>
  <div>
    <h2>Openlayers 基础示例</h2>
    <p>主要技术：Openlayers6 + Vue2 + AntdV</p>
    <p>内容：Openlayers6 部分基础示例</p>
    <p>
      挑选项目中的典型示例做成 Example，方便参考，目前只有部分示例，后期会逐渐增加
    </p>
    <p>若有比较通用的示例可以提 Issues 或 PR</p>
    <br />
    <br />
    <h4>Overlay</h4>
    <p>
      Overlay
      叠加图层：主要是放置一些和地图位置相关的元素，如：infowindow、点标记、图片等，而这些覆盖物都是和html中的element等价的，通过overlay的属性element和html元素绑定同时设定坐标参数——达到将html元素放到地图上的位置，在平移缩放的时候html元素也会随着地图的移动而移动。
    </p>
    <br />
    <h4>VectorLayer</h4>
    <p>
      VectorLayer矢量图层： 矢量图层是在客户端渲染的，在 web
      环境中，对应的就是浏览器。构成一个矢量图层的包含一个数据（source）和一个样式（style），数据构成矢量图层的要素，样式规定要素显示的方式和外观。一个初始化成功的矢量图层包含一个到多个要素（feature），每个要素由地理属（geometry）和多个其他的属性，可能包含名称等。
    </p>
    <br />
    <h4>TODO</h4>
    <h5></h5>
    <p class="delete">框选 Overlay</p>
    <p>框选 Feature</p>
  </div>
</template>

<script>
export default {
  name: "Home",
};
</script>

<style lang="scss" scoped>
.delete{
  text-decoration: line-through;
}
</style>