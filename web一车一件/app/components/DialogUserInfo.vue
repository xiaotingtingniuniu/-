<template>
  <el-dialog
    :modal-append-to-body="false"
    :append-to-body="false"
    :visible.sync="show"
    :before-close="handleClose"
    width="640px"
    class="dialog-user-center"
  >
    <div slot="title" class="dialog__header">
      <span class="dialog__title">个人信息</span>
    </div>
    <el-form
      :model="tempUserInfo"
      label-width="120px"
      label-position="right"
      class="form-user-info"
    >
      <el-form-item label="姓名" class="item-name">
        <el-input v-model="tempUserInfo.nickname" class="input-name name" placeholder="请输入真实姓名（最多8个汉字）" maxlength="8" />
        <transition name="fade">
          <div v-if="error.nickname" class="form__msg">
            <i class="el-icon-warning" />
            <span>{{ error.nicknameErrorMsg }}</span>
          </div>
        </transition>
      </el-form-item>
      <el-form-item label="性别" class="item-sex">
        <el-radio v-model="tempUserInfo.sex" :label="1">先生</el-radio>
        <el-radio v-model="tempUserInfo.sex" :label="0">女士</el-radio>
      </el-form-item>
      <el-form-item label="出生日期">
        <el-date-picker
          v-model="tempUserInfo.birthday"
          :default-value="new Date('1990-01-01')"
          :editable="false"
          :clearable="false"
          :picker-options="datePickerOptions"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择出生日期"
          prefix-icon="el-icon-arrow-down"
          class="input-birthday"
          @blur="birthdayBlur"
        />
      </el-form-item>
      <el-form-item label="工作所在地">
        <el-cascader
          ref="cascaderAddr"
          v-model="selectedOptions"
          placeholder="请选择工作所在地"
          class="input-area"
          :options="optionsArea"
          :props="{value:'name', label:'name'}"
          @change="handleChange"
          @blur="areaBlur"
        />
      </el-form-item>
      <!-- <el-form-item label="行业" class="item-profession">
        <span class="name">行业</span>
      </el-form-item>
      <el-form-item label="岗位">
        <el-select
          ref="roleName"
          v-model="tempUserInfo.roleName"
          placeholder="请输入您的岗位名称"
          class="input-job"
        />
      </el-form-item> -->
      <el-form-item label="公司名称" class="item-company">
        <el-input v-model="tempUserInfo.company" class="input-company" placeholder="请输入公司名称（最多80个字符）" maxlength="80" @blur="handleCompany" />
      </el-form-item>
    </el-form>
    <template slot="footer">
      <button class="btn-close" @click="handleClose">放弃修改</button>
      <button class="btn-save" @click="handleSave">确定</button>
    </template>
  </el-dialog>
</template>

<script>
// import _ from 'lodash';
import { mapActions, mapMutations } from 'vuex';
import { regionData } from 'element-china-area-data';
import { getUserInfo, updateUserInfo, getRoleDicCurrent } from '../api/user';
import { response_code, point_types } from '../config/constant';
import Cookies from 'js-cookie';

export default {
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    optionsArea: [],
    options: regionData,
    selectedOptions: [],
    userInfo: {
      nickname: null,
      sex: '1',
      birthday: null,
      province: null,
      city: null,
      district: null,
      roleName: null,
      company: null,
    },
    tempUserInfo: {},
    error: {
      nickname: false,
      nicknameErrorMsg: '',
    },
    isSaving: false,
    datePickerOptions: {
      disabledDate(time) {
        return time.getTime() < new Date('1939-12-31') || time.getTime() > Date.now();
      },
    },
    provinceCity: [],
  }),
  computed: {
    couldSave() {
      return !this.error.nickname;
    },
  },
  watch: {
    show(to) {
      if (!to) {
        return;
      }
      this.tempUserInfo = {
        nickname: this.userInfo.nickname,
        sex: this.userInfo.sex,
        birthday: this.userInfo.birthday,
        province: this.userInfo.province,
        city: this.userInfo.city,
        district: this.userInfo.district,
        roleName: this.userInfo.roleName,
        company: this.userInfo.company,
      };
      console.log('tempUserInfo', this.tempUserInfo);
    },
  },
  created() {
    // 获取用户信息
    this.getUserInfo();
    // 获取行业信息 (当前用户角色)
    // this.getRoleDicCurrent();
    // 获取省市区信息
    // this.getAllAreaInfo({});
    const _this = this;
    this.getAllAreaInfo(function (areaInfor) {
      const { areaList } = areaInfor;
      _this.optionsArea = areaList;
    });
  },
  methods: {
    ...mapActions('user', ['addPointByType', 'getAllAreaInfo']),
    // ...mapMutations('user', ['getAllAreaInfo']),
    ...mapMutations('user', ['setUserName']),
    getUserInfo() {
      getUserInfo({}).then(response => {
        console.log('response', response);
        const { data } = response.data;
        console.log('data', data);
        const { nickname, birthday, province, city, district, roleName, company } = data;
        let { sex } = data;
        if (sex === null || sex ==='') {
          sex = '1';
        }
        this.setUserInfo({ nickname, sex, birthday, province, city, district, roleName, company });
        console.log('userInfo', this.userInfo);
      }).catch(error => {
        console.error(error);
      });
    },
    getRoleDicCurrent() {
      getRoleDicCurrent({}).then(response => {
        console.log('response', response);
        const { data } = response.data;
        console.log('data', data);
      }).catch(error => {
        console.error(error);
      });
    },
    // getAllAreaInfo(params) {
    //   getAllAreaInfo(params).then(response => {
    //     console.log('response', response);
    //     const { upToDate } = response.data.data;
    //     console.log('upToDate', upToDate);
    //     if (!upToDate) {
    //       const { areaList } = response.data.data;
    //       console.log('areaList', areaList);
    //       this.optionsArea = areaList;
    //     };
    //   }).catch(error => {
    //     console.error(error);
    //   });
    // },
    handleChange(value) {
      this.tempUserInfo.province = value[0];
      this.tempUserInfo.city = value[1];
      this.tempUserInfo.district = value[2];
    },
    handleChangeArea(value) {
      console.log('value', value);
    },
    setUserInfo({ nickname, sex, birthday, province, city, district, roleName, company }) {
      const newUserInfo = {};
      newUserInfo.nickname = nickname;
      newUserInfo.sex = Number(sex);
      newUserInfo.birthday = birthday;
      newUserInfo.province = province;
      newUserInfo.city = city;
      newUserInfo.district = district;
      newUserInfo.roleName = roleName;
      newUserInfo.company = company;
      this.userInfo = newUserInfo;
      // try {
      //   if (province!==null&&province!=='') {
      //     const provinceName = TextToCode[province].code;
      //     if (city!==null&&city!=='') {
      //       const cityName = TextToCode[province][city].code;
      //       if (district!==null&&district!=='') {
      //         const districtName = TextToCode[province][city][district].code;
      //         this.selectedOptions = [provinceName, cityName, districtName];
      //       }
      //     }
      //   }
      // } catch (err) {
      //   console.log('err', err);
      //   this.selectedOptions = [];
      // }
      this.selectedOptions = [province, city, district];

    },
    birthdayBlur() {
      if (this.tempUserInfo.birthday === '' || this.tempUserInfo.birthday === null) {
        this.tempUserInfo.birthday = '1990-01-01';
      }
    },
    areaBlur() {
      console.log(111);
      console.log('selectedOptions', this.selectedOptions);
      console.log('cascaderAddr', this.$refs['cascaderAddr'].currentLabels);
      if (this.$refs['cascaderAddr'].currentLabels.length<=0) {
        this.selectedOptions = ['北京市', '市辖区', '东城区'];
        this.tempUserInfo.province = '北京市';
        this.tempUserInfo.city = '市辖区';
        this.tempUserInfo.district = '东城区';
      }
    },
    handleCompany() {
      const company = this.tempUserInfo.company;
      console.log('company', company);
    },
    handleClose() {
      if (this.isSaving) {
        return;
      }
      const province = this.userInfo.province;
      const city = this.userInfo.city;
      const district = this.userInfo.district;
      this.error.nicknameErrorMsg = '';
      this.error.nickname = false;
      this.$emit('update:show', false);
      try {
        console.log('district', district);
        this.selectedOptions= [province, city, district];
      } catch (err) {
        console.log('err', err);
        this.selectedOptions = [];
      }
    },
    validate() {
      this.error.nickname = false;
      if (!this.tempUserInfo.nickname) {
        this.error.nickname = true;
        this.error.nicknameErrorMsg = '请填写真实姓名';
        return false;
      } else if (!/^[\u4e00-\u9fa5]+$/.test(this.tempUserInfo.nickname)) {
        this.error.nickname = true;
        this.error.nicknameErrorMsg = '姓名仅支持中文，请修改';
        return false;
      } else {
        return true;
      }
    },
    handleSave() {
      if (this.isSaving) {
        return;
      }
      if (this.validate()) {
        // 通过验证
        if (!this.couldSave) {
          return;
        }
        const { nickname, sex, birthday, province, city, district, roleName, company } = this.tempUserInfo;
        this.isSaving = true;
        updateUserInfo({
          nickname,
          sex,
          birthday,
          province,
          city,
          district,
          roleName,
          company,
        }).then(response => {
          const { code } = response.data;
          if (code === response_code.SUCCESS) {
            this.addPointByType({ type: point_types.USER_INFO });
            this.$message({
              message: '保存成功',
              type: 'success',
            });
            this.setUserInfo({ nickname, sex, birthday, province, city, district, roleName, company });
            const Cookies_auth = Cookies.getJSON('auth');
            const auth = {
              token: Cookies_auth.token, // 票据
              uid: Cookies_auth.uid, // 用户id
              businessId: Cookies_auth.businessId, // 用户所在企业ID
              userName: nickname, // 用户名
              phoneNumber: Cookies_auth.phoneNumber, // 登录手机号
              company: company, // 所在分组（传给GroingIO使用）
              registerType: Cookies_auth.registerType, // 注册类型，1是B2B，2是自注册
              roleName: roleName, // 职位
              userAuthStatus: Cookies_auth.userAuthStatus, // 用户审核状态（1- 未认证，2 - 认证中，3 - 认证失败，4 - 认证成功）
              companyType: Cookies_auth.companyType, // 账户所在企业类型，1保险公司，2修理厂，3配件制造或经销
              inviteCode: Cookies_auth.inviteCode, // 邀请码
              sex: sex, // 1为男，0为女
              birthday: birthday, // 生日
              province: province, // 省
              city: city, // 市
              district: district, // 区
            };
            // 更新 cookies 中的用户信息
            Cookies.set('auth', JSON.stringify(auth), { expires: Cookies_auth.expiresIn ? Cookies_auth.expiresIn / 60 / 60 / 24 : 7 });
            // 更新 姓名
            this.setUserName(nickname);
          }
        }).catch(error => {
          console.error(error);
        }).finally(() => {
          this.isSaving = false;
          this.$emit('update:show', false);
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-dialog__body{
  padding-bottom:0;
}
/deep/.el-dialog__footer{
  padding-bottom:30px;
  padding-top:30px;
}
.form-user-info {
  /deep/.el-form-item {
    margin-bottom: 20px;
    &.item-company{
      margin-bottom:0;
      input{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .el-form-item__label {
      padding: 0 20px 0 0;
      color: #616366;
      line-height: 36px;
    }

    .form__msg {
      display: inline;
      margin-left: 5px;
      color: $--color-error;
    }
    .el-form-item__content{
      line-height: 36px;
      .el-cascader{
        line-height: 36px;
      }
    }
    &.item-name {
      .el-form-item__label,
      .el-form-item__content {
        line-height: 36px;
        vertical-align: top;
      }

      .name {
        color: #303233;
        font-size: 14px;
        line-height: 1;
        vertical-align: top;
      }
    }
    &.item-profession {
      .el-form-item__label,
      .el-form-item__content {
        line-height: 14px;
      }
    }
    &.item-sex {
      .el-form-item__label{
        line-height: 14px;
      }
      .el-form-item__content {
        line-height: 14px;
      }
    }
  }

  .input-birthday,
  .input-name,
  .input-company,
  .input-area,
  .input-job {
    width: 260px;
    /deep/.el-input__inner,
    /deep/.el-cascader{
      height:36px;
      line-height: 36px !important;
      vertical-align: top;
    }
    /deep/.el-input__inner,
    /deep/.el-cascader__label {
      padding: 0 10px;
      cursor: pointer;
    }

    &.is-error /deep/.el-input__inner {
      border-color: $--color-error !important;
    }

    /deep/.el-input__prefix,
    /deep/.el-input__suffix {
      left: 233px;
      right: 2px;

      .el-icon-arrow-down {
        font-size: 8px;
        transform: none;
      }

      .el-input__icon::before {
        position: relative;
        bottom: 1px;
      }
    }
  }

  .input-job /deep/.el-input__inner {
    line-height: inherit;
  }
}

.btn-close {
  height: 36px;
  width: 100px;
  padding: 10px 20px;
  color: #616366;
  background-color: #edeff0;

  &:not([disabled]):hover {
    background-color: #e3e5e6;
  }
}

.btn-save {
  height: 36px;
  width: 100px;
  padding: 10px 20px;
  margin-left: 10px;
  color: #fff;
  background-color: #ff6700;
  box-shadow: 0 3px 6px rgba(255, 72, 0, 0.5);

  &:not([disabled]):hover {
    background-color: #f25d00;
  }
}
</style>
