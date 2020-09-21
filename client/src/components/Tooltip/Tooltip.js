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
      this.$nextTick(() => {
        const tooltipWidth = this.$refs.tooltip.clientWidth;
        this.$refs.tooltip.style.left = `calc(-${tooltipWidth/2}px + 40px)`;
        this.$refs['tooltip-arrow'].style.left = 'calc(50% - 6px)';
      });
    }
  },
  watch: {
    text() {
      this.setTooltipStyle();
    }
  }
}
