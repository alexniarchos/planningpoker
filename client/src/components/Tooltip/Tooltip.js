export default {
  props: {
    text: {
      type: String,
      required: true
    }
  },
  mounted() {
    this.setTooltipStyle();
  },
  methods: {
    setTooltipStyle() {
      const tooltipWidth = this.$refs.tooltip.clientWidth;
      console.log(this.$refs.tooltip.style);
    }
  },
  watch: {
    text() {
      this.setTooltipStyle();
    }
  }
}
