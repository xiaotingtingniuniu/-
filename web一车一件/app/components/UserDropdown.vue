<template>
  <el-dropdown
    class="user-dropdown"
    trigger="click"
    @visible-change="handleChange"
    @command="handleCommand"
  >
    <span class="user-dropdown__inner">
      <i class="icon-user" />
      <span>{{ userName }}</span>
      <i class="el-icon-arrow-down el-icon--right" />
    </span>
    <el-dropdown-menu slot="dropdown" class="user-dropdown__menu">
      <el-dropdown-item class="item-user-center" command="user">
        <span class="title">个人中心</span>
        <span v-if="companyType===1" class="point">积分 {{ totalPoint }}</span>
      </el-dropdown-item>
      <div class="rule" />
      <el-dropdown-item class="item-logout" command="logout">
        <span>退出登录</span>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { mapState, mapActions } from 'vuex';

import { logout } from '../api';
import { router_names } from '../config/constant';

export default {
  computed: {
    ...mapState('user', ['userName', 'totalPoint', 'companyType']),
  },
  methods: {
    ...mapActions('user', ['getUserCenterInfo']),
    handleChange(show) {
      if (!show) {
        return;
      }

      this.getUserCenterInfo();
    },
    handleCommand(command) {
      switch (command) {
        case 'user':
          if (this.$route.name === router_names.USER) {
            return;
          }

          return this.$router.push({ name: router_names.USER });
        case 'logout':
          return logout();
        default:
          break;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.user-dropdown {
  height: 100%;
  padding: 0 20px;
  color: $--color-title;
  font-size: 14px;
  cursor: pointer;

  .user-dropdown__inner {
    display: flex;
    align-items: center;
    line-height: 60px;
  }

  .icon-user {
    height: 24px;
    width: 24px;
    margin-right: 10px;
    background-image: url('~@/images/icon_user.png');
    background-size: contain;
  }

  &:hover {
    color: $--color-main;

    .icon-user {
      background-image: url('~@/images/icon_user--hover.png');
    }
  }
}

.user-dropdown__menu {
  padding: 0;

  /deep/.el-dropdown-menu__item {
    min-width: 140px;
    margin: 6px 0;
    color: $--color-title;
    font-size: 14px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      background-color: rgba(255, 103, 0, 0.12);
      color: $--color-main;
    }
  }

  .item-user-center {
    padding: 6px 0;
    color: #303233;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .title {
      line-height: 14px;
      margin-bottom: 6px;
    }

    .point {
      font-size: 12px;
      line-height: 1;
    }

    &:hover {
      .title {
        color: $--color-main;
      }

      .point {
        color: #ff9c59;
      }
    }
  }

  .item-logout {
    height: 34px;
  }

  .rule {
    margin: 0 10px;
    border-top: 1px solid #f0f1f2;
    @include border-one-px;
  }
}
</style>
