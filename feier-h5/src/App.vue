<template>
  <div id="app">
    <router-view />
  </div>
</template>
<style lang="scss">
@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  //苹果x
  #app {
    // background-color: yellow !important;
    height: px2rem(1624) !important;
  }
}
@media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) {
  #app {
    // background-color: red !important;
    height: px2rem(1792) !important;
  }
}
@media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) {
  #app {
    height: px2rem(1792) !important;
  }
}
#app {
  position: absolute;
  width:100%;
  top:0;
  height: px2rem(1334);
  background: #f2f3f5;
}
.container {
  max-width: 600px;
  padding: 10px;
  display: block;
  margin: 0 auto;
  overflow: hidden;
}
.text-center {
  text-align: center;
}
.orange {
  color: $feier;
}
</style>
