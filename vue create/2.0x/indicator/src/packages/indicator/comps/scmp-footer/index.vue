<template>
  <div class="scmp-footer">
    <p>
      {{ footnote }}
      <slot></slot>
    </p>
  </div>
</template>

<script>
export default {
  name: 'ScmpFooter',
  props: {
    footnote: {
      type: String,
      default: ''
    }
  }
};
</script>

<style lang="scss" scoped>
.scmp-footer {
  z-index: 2;
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 40px;
  background-color: #f5f6fc;
  text-align: center;
  color: #909399;
  p {
    line-height: 40px;
  }
}
</style>
