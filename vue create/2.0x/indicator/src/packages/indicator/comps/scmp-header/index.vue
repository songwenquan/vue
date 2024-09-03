<template>
  <div class="scmp-header">
    <slot name="icon"></slot>
    <slot name="text"></slot>
  </div>
</template>

<script>
export default {
  name: 'ScmpHeader'
};
</script>

<style scoped lang="scss">
.scmp-header {
  width: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
