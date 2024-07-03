<template>
  <section class="page-user">
    <header class="user__header">
      <navigation />
    </header>
    <main class="user__main">
      <div class="user__main__wrap">
        <user-info />
        <div v-if="companyType===1">
          <user-derogation />
          <user-medal />
        </div>
      </div>
    </main>
  </section>
</template>

<script>
import { mapActions, mapState } from 'vuex';

import Navigation from '../components/Navigation.vue';
import UserDerogation from '../components/UserDerogation.vue';
import UserInfo from '../components/UserInfo.vue';
import UserMedal from '../components/UserMedal.vue';

export default {
  components: {
    Navigation,
    UserDerogation,
    UserInfo,
    UserMedal,
  },
  computed: {
    ...mapState('user', ['companyType']),
  },
  created() {
    if (this.companyType === 1) {
      this.getUserCenterInfo();
    }
  },
  methods: {
    ...mapActions('user', ['getUserCenterInfo']),
  },
};
</script>

<style lang="scss" scoped>
.page-user {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100%;
  min-width: 1024px;
  overflow: hidden;

  .user__main {
    height: calc(100vh - 60px);
    overflow-y: auto;
    background-color: #f5f6f7;
  }
}

.user__main__wrap {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 30px 120px;
}

.user-info {
  margin-bottom: 20px;
}

.user-derogation {
  margin-bottom: 10px;
}
</style>
