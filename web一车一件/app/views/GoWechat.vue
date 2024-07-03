<template>
  <div>
    <div id="wx" class="wx">
      <img :src="image" alt class="img">
      <span id="close" class="close" />
    </div>
  </div>
</template>

<script>
import image from '../images/wx100.png';

export default {
  data: () => ({
    image,
  }),
};
</script>

<style lang="scss">
@import 'public.scss';
</style>

<style lang="scss" scoped>
@function px2rem($px, $base-font-size: 75px) {
  /*设计稿宽度为750，因此此处为75*/
  @if (unitless($px)) {
    @return px2rem($px + 0px);
  } @else if (unit($px) == rem) {
    @return $px;
  }
  @return ($px / $base-font-size) * 1rem;
}

.wx {
  z-index: 10000;
  width: px2rem(20*37.5);
  margin: 0 auto;
  height: px2rem(35.5*37.5);
  position: absolute;
  top: 0;
  display: block;
  left:0;
}

.wx img {
  width: 100%;
  height: px2rem(35.89*37.5);
}

.wx .img {
  margin-top: -px2rem(4.3*37.5);
  vertical-align: middle;
}

.wx span {
  width: px2rem(2.0625*37.5);
  height: px2rem(2.0625*37.5);
}

.wx span img {
  width: px2rem(2.0625*37.5);
  height: px2rem(2.0625*37.5);
  position: absolute;
  /*top:12.8125rem;*/
  top: px2rem(8.5125*37.5);
  right: px2rem(1.5625*37.5);
  border-radius: 50%;
}
</style>
