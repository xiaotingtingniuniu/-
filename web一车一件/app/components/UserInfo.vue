<template>
  <section class="user-info">
    <header>
      <i class="icon-head" />
      <span class="user-name">{{ userName }}</span>
      <div class="btn-user-info" @click="showUserInfo = true">
        <span>个人信息</span>
      </div>
      <div
        :class="{'certified':isCertified, 'pass':isPass, 'verified':isVerified, 'review':isReview}"
        class="identity"
      />
    </header>
    <main>
      <ul>
        <li v-for="(item, index) in pointAndDerogation" :key="index">
          <div v-if="companyType===1" class="item_box">
            <div class="item">
              <div class="item__sum">{{ item.sum }}</div>
              <div class="item__label">
                <span>{{ item.label }}</span>
                <i v-if="item.name!='inviteCode'" class="icon-question" @click="handleQuestion(item.name)" />
              </div>
              <div
                v-if="item.name!='inviteCode'"
                class="item__detail"
                @click="handleExtra(item.name)"
              >
                <span v-if="item.extra">{{ item.extra }}</span>
              </div>
              <div
                v-else-if="item.extra==='复制'"
                class="item__detail"
                @click="inviteCodeTodo(item.extra)"
              >
                <span
                  v-if="item.extra"
                  v-clipboard:copy="inviteCode"
                  v-clipboard:success="onCopy"
                >{{ item.extra }}</span>
              </div>
              <div v-else-if="item.extra==='获取'" class="item__detail aa" @click="getInviteCode()">
                <span v-if="item.extra">{{ item.extra }}</span>
              </div>
            </div>
            <div class="rule" />
          </div>
          <div v-else-if="item.name==='inviteCode'" class="item_box">
            <div class="item">
              <div class="item__sum">{{ item.sum }}</div>
              <div class="item__label">
                <span>{{ item.label }}</span>
                <i v-if="item.name!='inviteCode'" class="icon-question" @click="handleQuestion(item.name)" />
              </div>
              <div
                v-if="item.name!='inviteCode'"
                class="item__detail"
                @click="handleExtra(item.name)"
              >
                <span v-if="item.extra">{{ item.extra }}</span>
              </div>
              <div
                v-else-if="item.extra==='复制'"
                class="item__detail aa"
                @click="inviteCodeTodo(item.extra)"
              >
                <span
                  v-if="item.extra"
                  v-clipboard:copy="inviteCode"
                  v-clipboard:success="onCopy"
                >{{ item.extra }}</span>
              </div>
              <div v-else-if="item.extra==='获取'" class="item__detail aa" @click="getInviteCode()">
                <span v-if="item.extra">{{ item.extra }}</span>
              </div>
            </div>
            <div class="rule" />
          </div>
        </li>
      </ul>
    </main>
    <dialog-user-info :show.sync="showUserInfo" :user-name="userName" />
    <dialog-point-rules :show.sync="showPointRules" />
    <dialog-derogation-rules :show.sync="showDerogationRules" />
    <dialog-point-history :show.sync="showPointHistory" />
  </section>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
import DialogUserInfo from './DialogUserInfo.vue';
import DialogPointRules from './DialogPointRules.vue';
import DialogDerogationRules from './DialogDerogationRules.vue';
import DialogPointHistory from './DialogPointHistory.vue';
import TextHelper from '../mixins/text-helper';
export default {
  components: {
    DialogUserInfo,
    DialogPointRules,
    DialogDerogationRules,
    DialogPointHistory,
  },
  mixins: [TextHelper],
  data: () => ({
    showUserInfo: false,
    showPointRules: false,
    showDerogationRules: false,
    showPointHistory: false,
    isCertified: true, // 身份未认证
    isPass: false, // 审核未通过
    isVerified: false, // 身份已认证
    isReview: false, // 审核中
  }),
  computed: {
    ...mapState('user', ['userName', 'point', 'totalPoint', 'totalDerogation', 'userAuthStatus', 'inviteCode', 'companyType', 'registerType']),
    ...mapGetters('user', ['pointAndDerogation']),
  },
  mounted() {
    console.log('userAuthStatus', this.userAuthStatus);
    const userAuthStatus = this.userAuthStatus; // 用户审核状态（1- 未认证，2 - 认证中，3 - 认证失败，4 - 认证成功）
    switch (userAuthStatus) {
      case '1': {
        this.isCertified = true;
        this.isPass = false;
        this.isVerified = false;
        this.isReview = false;
        break;
      }
      case '2': {
        this.isReview = true;
        this.isCertified = false;
        this.isPass = false;
        this.isVerified = false;
        break;
      }
      case '3': {
        this.isPass = true;
        this.isReview = false;
        this.isCertified = false;
        this.isVerified = false;
        break;
      }
      case '4': {
        this.isVerified = true;
        this.isPass = false;
        this.isReview = false;
        this.isCertified = false;

        break;
      }
      default:
        this.isCertified = true;
        this.isPass = false;
        this.isVerified = false;
        this.isReview = false;
    }
    console.log('inviteCode', this.inviteCode);
    const inviteCode = this.inviteCode;
    // 如果邀请码为'' 获取用户邀请码
    if (inviteCode === '') {
      this.$store.commit('user/setInviteTodo', '获取');
      // 获取用户邀请码
      this.getInviteCode();
    } else {
      console.log('store', this.$store);
      this.$store.commit('user/setInviteTodo', '复制');
    }
  },
  methods: {
    ...mapMutations('user', ['setInviteTodo']),
    ...mapActions('user', ['getInviteCode', 'addPointByType']),
    handleQuestion(name) {
      switch (name) {
        case 'point':
          // this.showPointRules = true;
          this.$message('积分体系正在升级，敬请期待');
          break;
        case 'derogation':
          this.showDerogationRules = true;
          break;
        default:
          break;
      }
    },
    handleExtra(name) {
      switch (name) {
        case 'point':
          this.showPointHistory = true;
          break;
        default:
          break;
      }
    },
    inviteCodeTodo(extra) {
      console.log('extra', extra);
    },
  },
};
</script>

<style lang="scss" scoped>
.user-info {
  background-color: white;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.06);

  header {
    height: 50px;
    padding: 0 30px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    background-image: linear-gradient(-90deg, #7a7268, #5f554e 100%, #3d3d3d 0);

    .icon-head {
      height: 24px;
      width: 24px;
      background-image: url('~@/images/icon_head.png');
      background-size: contain;
    }

    .user-name {
      margin: 0 10px;
      color: white;
      font-size: 20px;
      line-height: 1;
    }

    .btn-user-info {
      height: 26px;
      width: 80px;
      border: 1px solid #ffad75;
      box-sizing: border-box;
      @include border-one-px;
      border-radius: 4px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #ffad75;
      cursor: pointer;

      span {
        font-size: 14px;
        line-height: 1;
        user-select: none;
      }

      &:hover {
        border-color: $--color-main;
        background-color: $--color-main;
        color: white;
      }
    }
    .identity {
      width: 76px;
      height: 20px;
      margin-left: 10px;
      background-size: 100%;
      background-repeat: no-repeat;
    }
    .certified {
      background-image: url('../images/icon_not certified@2x.png');
    }
    // .certified:hover {
    //   background-image: url('../images/icon_not certified_hover@2x.png');
    //   cursor: pointer;
    // }
    .pass {
      background-image: url('../images/icon_did not pass@2x.png');
    }
    // .pass:hover {
    //   background-image: url('../images/icon_did not pass_hover@2x.png');
    //   cursor: pointer;
    // }
    .verified {
      background-image: url('../images/icon_ verified @2x.png');
    }
    // .verified:hover {
    //   background-image: url('../images/icon_ verified_hover@2x.png');
    //   cursor: pointer;
    // }
    .review {
      background-image: url('../images/icon_ under review@2x.png');
    }
    // .review:hover {
    //   background-image: url('../images/icon_ under review_hover@2x.png');
    //   cursor: pointer;
    // }
  }

  main {
    height: 148px;

    ul {
      display: flex;
      align-items: center;
      height: 100%;
    }

    li {
      .item_box {
        display: flex;
        align-items: center;
      }

      .item {
        margin: 0 100px;
      }

      .item__sum {
        color: black;
        font-size: 30px;
        line-height: 42px;
        margin-bottom: 2px;
      }

      .item__label {
        display: flex;
        align-items: center;
        margin-bottom: 10px;

        span {
          margin-right: 6px;
          opacity: 0.6;
          color: #303233;
          font-size: 12px;
        }
      }

      .item__detail {
        height: 12px;
        color: #ffad75;
        font-size: 12px;
        line-height: 1;

        &:hover {
          color: $--color-main;
        }

        span {
          cursor: pointer;
        }
      }

      .rule {
        height: 50px;
        border-right: 1px solid #919599;
        @include border-one-px;
        opacity: 0.2;
      }
    }
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
</style>
