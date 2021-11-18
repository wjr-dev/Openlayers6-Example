export default {
  data() {
    return {
      resizeObserver: null,
    }
  },
  mounted() {
    if (this.$refs.map) {
      this.resizeObserver = new ResizeObserver(() => {
        this.map.updateSize();
      });
      this.resizeObserver.observe(this.$refs.map);
    }
  },
  beforeDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.unobserve(this.$refs.map);
      this.resizeObserver = null;
    }
  },
}