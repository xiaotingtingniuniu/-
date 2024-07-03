<template>
  <div class="dev-bg">
    <div />
    <span>程序员正在拼命地搬砖中，敬请期待~</span>
  </div>
</template>

<style lang="scss" scoped>
.dev-bg {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  div {
    height: 210px;
    width: 210px;
    margin-bottom: 30px;
    background-image: url('~@/images/dev.png');
    background-size: cover;
  }

  span {
    margin-bottom: 100px;
    color: #616366;
    font-size: 16px;
    line-height: 1;
  }
}
</style>
