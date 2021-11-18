<template>
  <div id="app">
    <a-layout id="components-layout-demo-custom-trigger">
      <a-layout-sider
        :width="260"
        v-model="collapsed"
        :trigger="null"
        collapsible
        style="overflow: auto"
      >
        <div class="logo">{{ collapsed ? "Ol" : "Openlayers 基础示例" }}</div>
        <a-menu
          v-if="$route.name"
          :defaultOpenKeys="defaultOpenKeys"
          :defaultSelectedKeys="defaultKeys"
          mode="inline"
          theme="dark"
          :inline-collapsed="collapsed"
        >
          <template v-for="item in menus">
            <a-sub-menu :key="item.name" v-if="item.children">
              <span slot="title">
                <icon-font :type="`icon-${item.name}`" />
                <!-- <span :class="`iconfont icon-${item.name}`"></span> -->
                <span>{{ item.meta.label }}</span>
              </span>
              <a-menu-item :key="subItem.name" v-for="subItem in item.children">
                <router-link :to="item.path + subItem.path">
                  <icon-font :type="`icon-${subItem.name}`" />
                  <span>{{ subItem.meta.label }}</span>
                </router-link>
              </a-menu-item>
            </a-sub-menu>

            <a-menu-item v-else :key="item.name">
              <router-link :to="item.path">
                <icon-font :type="`icon-${item.name}`" />
                <span>{{ item.meta.label }}</span>
              </router-link>
            </a-menu-item>
          </template>
        </a-menu>
      </a-layout-sider>
      <a-layout>
        <a-layout-header>
          <div>
            <a-icon
              class="trigger"
              :type="collapsed ? 'menu-unfold' : 'menu-fold'"
              @click="() => (collapsed = !collapsed)"
            />
          </div>
          <div>
            <a
              v-if="currentHref"
              class="link"
              target="_black"
              :href="currentHref"
            >
              当前示例代码
            </a>
            <a class="link" target="_black" href="https://openlayers.org/">
              Openlayers官网
            </a>
            <a
              class="link"
              target="_black"
              href="http://iris.hikvision.com.cn/wangwenchao6/openlayers6-example"
            >
              GitLib
            </a>
          </div>
        </a-layout-header>
        <a-layout-content
          :style="{
            margin: '24px 16px',
            padding: '24px',
            background: '#fff',
            minHeight: '280px',
          }"
        >
          <router-view></router-view>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
import { Icon } from "ant-design-vue";

const IconFont = Icon.createFromIconfontCN({
  // 最终需要换成本地地址
  // scriptUrl: "/icon/iconfont.js",
  scriptUrl: "//at.alicdn.com/t/font_2932920_s1m57dazni.js",
});

export default {
  name: "App",
  components: {
    IconFont,
  },
  data() {
    return {
      collapsed: false,
      openKeys: [],
      gitlab:
        "http://iris.hikvision.com.cn/wangwenchao6/openlayers6-example/-/blob/master/src/pages/",
      currentHref: "",
    };
  },
  watch: {
    $route: {
      handler: function (newVal) {
        let route = "";
        if (newVal.meta.root) {
          route = `${newVal.meta.root}/${newVal.meta.current}.vue`;
        } else {
          route = `${newVal.meta.current}.vue`;
        }
        this.currentHref = this.gitlab + route;
      },
    },
  },
  computed: {
    defaultKeys() {
      return this.$route.meta.current ? [this.$route.meta.current] : [];
    },
    defaultOpenKeys() {
      return this.$route.meta.root ? [this.$route.meta.root] : [];
    },
    menus() {
      return this.$router.options.routes;
    },
  },
};
</script>

<style lang="scss">
html,
body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
#app {
  height: 100%;
  min-height: 100%;
}
#components-layout-demo-custom-trigger {
  height: 100vh;
}
#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
  text-align: center;
  line-height: 32px;
  color: #fff;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.map-box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}
.button-box {
  margin-top: 20px;
  .ant-btn {
    margin-right: 10px;
  }
}
.map-container {
  width: 100%;
  height: 100%;
}
</style>
<style lang="scss" scoped>
::v-deep.ant-layout-header {
  background: #fff;
  padding: 0;
  display: flex;
  justify-content: space-between;
  padding-right: 24px;
}
.iconfont {
  margin-right: 10px;
}
.link {
  color: #2c3e50;
  font-weight: 600;
  margin-left: 20px;
  &:hover {
    color: #1890ff;
  }
}
</style>