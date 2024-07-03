<template>
  <div class="cell-group-box">
    <van-cell-group>
      <van-field
        v-model="contactInformation.supplierName"
        label="经销商名称"
        placeholder="点击编辑"
        v-if="headerDistributor==='联系方式'"
      />
      <van-field
        v-model="contactInformation.supplierName"
        label="经销商名称"
        placeholder="暂无"
        v-if="headerDistributor==='联系信息'"
        :readonly="true"
      />

      <van-field
        v-model="contactInformation.address"
        label="地址"
        placeholder="点击编辑"
        v-if="headerDistributor==='联系方式'"
      />
      <van-field
        v-model="contactInformation.address"
        label="地址"
        placeholder="暂无"
        v-if="headerDistributor==='联系信息'"
        :readonly="true"
      />

      <van-field
        v-model="contactInformation.contact"
        label="联系人"
        placeholder="点击编辑"
        v-if="headerDistributor==='联系方式'"
      />
      <van-field
        v-model="contactInformation.contact"
        label="联系人"
        placeholder="暂无"
        v-if="headerDistributor==='联系信息'"
        :readonly="true"
      />

      <van-field
        v-model="contactInformation.mobile"
        type="tel"
        @blur="getTelephone"
        label="联系电话"
        placeholder="点击编辑"
        v-if="headerDistributor==='联系方式'"
        :error-message="contactInformation.phoneErrorMessage"
      />
      <van-field
        v-model="contactInformation.mobile"
        type="tel"
        @blur="getTelephone"
        label="联系电话"
        placeholder="暂无"
        v-if="headerDistributor==='联系信息'"
        :readonly="true"
      />
    </van-cell-group>
    <div class="optional">选填项</div>
    <van-cell-group>
      <van-field
        v-model="contactInformation.wechat"
        label="微信"
        placeholder="点击编辑"
        v-if="headerDistributor==='联系方式'"
      />
      <van-field
        v-model="contactInformation.wechat"
        label="微信"
        placeholder="暂无"
        v-if="headerDistributor==='联系信息'"
        :readonly="true"
      />

      <van-field
        v-model="contactInformation.email"
        label="邮箱"
        placeholder="点击编辑"
        type="email"
        v-if="headerDistributor==='联系方式'"
        :error-message="contactInformation.mailboxErrorMessage"
      />
      <van-field
        v-model="contactInformation.email"
        label="邮箱"
        placeholder="暂无"
        type="email"
        v-if="headerDistributor==='联系信息'"
        :readonly="true"
      />
      <van-field
        v-model="contactInformation.qq"
        type="number"
        label="QQ"
        placeholder="点击编辑"
        v-if="headerDistributor==='联系方式'"
        :error-message="contactInformation.qqErrorMessage"
      />
      <van-field
        v-model="contactInformation.qq"
        type="number"
        label="QQ"
        placeholder="暂无"
        v-if="headerDistributor==='联系信息'"
        :readonly="true"
      />
    </van-cell-group>
  </div>
</template>
<script>
import Vue from "vue";
import { Field, CellGroup, Toast } from "vant";
import { mapMutations } from "vuex";
Vue.use(Field)
  .use(CellGroup)
  .use(Toast);
export default {
  computed: {
    contactInformation: {
      set(value) {
        console.log("set", value);
        this.setContactInformation(value);
      },
      get() {
        return this.$store.state.contactInformation;
      }
    },
    headerDistributor: {
      set(value) {
        console.log("set", value);
        this.setHeaderDistributor(value);
      },
      get() {
        return this.$store.state.headerDistributor;
      }
    }
  },
  data() {
    return {
      supplierName: null, //经销商名称
      address: null, //地址
      contact: null, //联系人
      mobile: null, //电话号码
      wechat: null, //微信号
      phoneErrorMessage: null, //电话号码错误提示
      email: null, //邮箱
      mailboxErrorMessage: null, //邮箱错误提示
      qq: null, //qq号
      qqErrorMessage: null //qq号错误提示
    };
  },
  methods: {
    ...mapMutations(["setCanGoToInformation"]),
    getTelephone() {
      const value = this.contactInformation.mobile;
      const isMob = /^[1][1,2,3,4,5,6,7,8,9][0-9]{9}$/;
      if (isMob.test(value)) {
        //移动电话校验成功
        this.contactInformation.phoneErrorMessage = null;
      } else {
        //移动电话校验失败
        this.contactInformation.phoneErrorMessage = "电话号码有误,请重新输入";
      }
    },
  },
  
  created() {
  }
};
</script>
<style lang="scss" >
#app{
  height: 0 !important;
}
.cell-group-box {
  margin-top: px2rem(88);
  .van-field__control {
    text-align: right;
    font-size: px2rem(28);
    color: rgba(150, 151, 153, 1);
  }
  .optional {
    margin-left: px2rem(33);
    margin-bottom: px2rem(18);
    margin-top: px2rem(31);
    height: px2rem(37);
    font-size: px2rem(26);
    color: rgba(153, 153, 153, 1);
    line-height: px2rem(37);
  }
  .van-field__label {
    font-size: px2rem(32);
    color: rgba(50, 50, 51, 1);
  }
  .van-field__error-message {
    text-align: right;
  }
}
</style>

