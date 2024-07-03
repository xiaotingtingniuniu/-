
<template>
  <van-collapse v-model="activeNames">
    <van-collapse-item title="标题1" name="1">内容</van-collapse-item>
    <van-collapse-item title="标题2" name="2">内容</van-collapse-item>
    <van-collapse-item title="标题3" name="3" disabled>内容</van-collapse-item>
  </van-collapse>
</template>

<script>
import Vue from "vue";
import { Collapse, CollapseItem } from "vant";

Vue.use(Collapse).use(CollapseItem);
export default {
  data() {
    return {
      activeNames: ['1']
    };
  }
};
</script>


