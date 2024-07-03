<template>
  <section class="user-medal">
    <header>
      <span>我的勋章</span>
      <i class="icon-question" @click="showMedalRules = true" />
    </header>
    <main>
      <ul>
        <li v-for="(item, index) in medalList" :key="index">
          <img :src="item.url" :alt="item.name">
          <span>
            <template v-if="item.awarded">已获得</template>
            <template v-else>未获得</template>
          </span>
        </li>
      </ul>
    </main>
    <dialog-medal-rules :show="showMedalRules" @close="showMedalRules = false" />
  </section>
</template>

<script>
import { mapState } from 'vuex';
import DialogMedalRules from '../components/DialogMedalRules.vue';

export default {
  components: {
    DialogMedalRules,
  },
  data: () => ({
    showMedalRules: false,
  }),
  computed: {
    ...mapState('user', ['medalList']),
  },
};
</script>

<style lang="scss" scoped>
.user-medal {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 214px;
  padding: 30px;
  background-color: white;

  header {
    color: #303233;
    font-size: 18px;
    line-height: 1;
    display: flex;
    align-items: center;

    span {
      margin-right: 6px;
    }
  }

  .icon-question {
    height: 14px;
    width: 14px;
    background-image: url('~@/images/icon_question.png');
    background-size: contain;
    cursor: pointer;

    &:hover {
      background-image: url('~@/images/icon_question--hover.png');
    }
  }

  main {
    padding: 20px 20px 0 20px;

    ul {
      display: flex;
    }

    li {
      margin-right: 60px;
      text-align: center;

      img {
        display: block;
        height: 76px;
        width: 88px;
        margin-bottom: 10px;
      }

      span {
        color: #919599;
        font-size: 14px;
      }
    }
  }
}
</style>
