<template>
  <nav>
    <div class="btn-back" @click="handleGoBack">
      <span class="btn-back-text">{{ btnGoBackText }}</span>
    </div>
    <span class="title">{{ navTitle }}</span>
    <div class="part_list" @click="goPartsList">
      <i class="icon_list" />
      <span>配件清单</span>
      <span class="list_total">{{ partsListTotal }}</span>
    </div>
  </nav>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data: () => ({
    btnGoBackText: '< 返回',
  }),
  computed: {
    ...mapState('partDetails', ['navTitle']),
    ...mapState('partsList', ['partsListTotal']),
  },
  methods: {
    handleGoBack() {
      this.$emit('back');
    },
    goPartsList() {
      open('#/parts-list');
    },
  },
};
</script>

<style lang="scss" scoped>
nav {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  height: 60px;
  padding: 0 10px;
  border-bottom: 1px solid #dadfe6;
}

.btn-back {
  height: 36px;
  width: 90px;
  border-radius: 4px;
  background: #edeff0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;

  &:hover {
    background: #e3e5e6;
  }

  .btn-back-text {
    color: #303233;
    font-size: 12px;
    line-height: 1;
  }
}

.title {
  margin-left: 30px;
  color: #616366;
  font-size: 12px;
}
.part_list {
  height: 60px;
  font-size: 0;
  position: absolute;
  right:0;
  top:0;
  span {
    display: inline-block;
    height: 100%;
    vertical-align: middle;
    line-height: 60px;
    font-size: 14px;
  }
  .icon_list {
    font-size: 14px;
    width: 24px;
    height: 24px;
    display: inline-block;
    background-image: url('../images/icon_list@2x.png');
    background-size: contain;
    vertical-align: middle;
    margin-right: 10px;
  }
  .list_total {
    color: #ff6700;
    margin-left: 5px;
    margin-right:10px;
  }
}
.part_list:hover {
  cursor: pointer;
  color: #ff6700;
  .icon_list {
    background-image: url('../images/icon_list_hover@2x.png');
  }
}
</style>
