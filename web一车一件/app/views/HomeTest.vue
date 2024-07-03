<template>
  <div>
    <img :src="image" alt="" style="width:100%;">
  </div>
</template>

<script>
import image from '../images/hometest.png';

export default {
  data: () => ({
    image,
  }),
};
</script>

<style lang="scss" scoped>
  .hometest{
    width: 100%;
    height:100vh;
  }
</style>
