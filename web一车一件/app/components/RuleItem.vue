<template>
  <div class="rule-item">
    <span class="point" />
    <span class="text">{{ rule }}</span>
  </div>
</template>

<script>
export default {
  props: {
    rule: {
      type: String,
      required: false,
      default: '',
    },
  },
};
</script>

<style lang="scss" scoped>
.rule-item {
  display: flex;
  align-items: center;

  .point {
    height: 6px;
    width: 6px;
    border-radius: 6px;
    background: #ffc59e;
  }

  .text {
    margin-left: 8px;
    color: #303233;
    font-size: 14px;
    line-height: 40px;
  }
}
</style>
