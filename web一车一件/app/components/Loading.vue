<template>
  <i class="loading">
    <svg viewBox="25 25 50 50">
      <circle cx="50" cy="50" r="20" fill="none" />
    </svg>
  </i>
</template>

<style lang="scss" scoped>
.loading {
  height: 42px;
  width: 42px;
  position: absolute;
  top: 50%;
  right: 21px;
  display: block;
  transform: translateY(-50%);

  svg {
    height: 42px;
    width: 42px;
    animation: loading-rotate 2s linear infinite;
  }

  circle {
    animation: loading-dash 1.5s ease-in-out infinite;
    stroke-dasharray: 90, 150;
    stroke-dashoffset: 0;
    stroke-width: 2;
    stroke: rgba($color: #ff6700, $alpha: 0.7);
    stroke-linecap: round;
  }
}
</style>
