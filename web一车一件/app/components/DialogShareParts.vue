<template>
  <el-dialog
    title="分享给他人"
    :modal-append-to-body="false"
    :visible.sync="isVisibleShareDialog"
    :before-close="handleClose"
    width="850"
    class="dialog_share"
  >
    <div v-if="isVisibleCopyButton===false">
      <ul>
        <li class="share_word">备注-包含 {{ checkedList.length }} 项内容</li>
      </ul>
      <el-input
        v-model="shareTextarea"
        type="textarea"
        :autosize="{ minRows: 5, maxRows: 5}"
        placeholder="给对方留言，做多可输入 300 个字符（选填）"
        resize="none"
        maxlength="300"
        style="font-size:12px;"
      />
      <div class="textarea-btn">
        <button class="cancel" @click="cancel">取消</button>
        <button class="creat_url" @click="creatUrl">创建链接</button>
      </div>
    </div>
    <div v-if="isVisibleCopyButton">
      <ul>
        <li class="share_word">分享链接-包含 {{ checkedList.length }} 项内容</li>
        <li class="remark">
          <span>{{ shareTextarea }}</span>
        </li>
      </ul>
      <div class="share_input">
        <el-input v-model="shareUrl" disabled="disabled" placeholder="请输入内容" clearable />
        <button v-clipboard:copy="shareUrl" v-clipboard:success="onCopy" class="share_copy">复制链接</button>
        <div v-if="isDialogCopy" class="share_tip">
          <button class="know" @click="tipKnow">知道了</button>
        </div>
      </div>
      <div class="copy_word" :class="{copy_word_hidden:hidden}">
        <span>复制链接成功</span>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex';
export default {
  data() {
    return {
      hidden: true, // 是否展示复制链接成功的文字
      isDialogCopy: false,
    };
  },
  computed: {
    ...mapState('partsList', ['partsList', 'isShareAgain', 'shareUrl', 'isVisibleShareDialog', 'isVisibleCopyButton', 'checkedList', 'orderNumber', 'shareTextarea']),
    shareTextarea: {
      get() {
        return this.$store.state.partsList.shareTextarea;
      },
      set(value) {
        this.setShareTextarea(value);
      },
    },
  },
  methods: {
    ...mapMutations('partsList', ['setIsVisibleShareDialog', 'setShareUrl', 'setCheckedList', 'setIsVisibleCopyButton', 'setShareTextarea']),
    ...mapActions('partsList', ['getPartsList', 'countPart', 'submitPartsList', 'getOrderUpdate']),
    creatUrl() {
      if (this.isShareAgain) {
        // 调用 修改历史清单基础信息接口
        const params = {
          orderNumber: this.orderNumber,
          remark: this.shareTextarea,
        };
        this.getOrderUpdate({
          params: params,
          success: value => {
            console.log('value', value);
          },
        });
        return;
      }
      const itemToSubmit = [];
      this.partsList.map(item => {
        item.items.map(item1 => {
          if (item1.isChecked && item1.isChecked === true) {
            itemToSubmit.push(item1.code);
          }
          return item1;
        });
        return item;
      });
      const params = {
        itemToSubmit: itemToSubmit,
        remark: this.shareTextarea,
      };
      console.log('params', params);
      // 调用 提交配件清单
      this.submitPartsList({
        params: params,
        success: value => {
          if (value === true) {
            const isDialogCopy = localStorage.getItem('isDialogCopy');
            if (isDialogCopy === 'true') {
              this.isDialogCopy = true;
            } else if (isDialogCopy === 'false') {
              this.isDialogCopy = false;
            } else {
              localStorage.setItem('isDialogCopy', true);
              this.isDialogCopy = true;
            }
          }
        },
      });
    },
    cancel() {
      this.setIsVisibleShareDialog(false);
    },
    onCopy() {
      this.hidden = false; // 展示
    },
    handleClose() {
      // 关闭按钮
      this.setIsVisibleShareDialog(false);
      if (!this.isShareAgain) {
        if (this.isVisibleCopyButton) {
          window.location.reload();
        }
      } else {
        this.setShareTextarea('');
        this.hidden = true;
        this.setIsVisibleCopyButton(false);
      }
    },
    tipKnow() {
      localStorage.setItem('isDialogCopy', false);
      this.isDialogCopy = false;
    },
  },
};
</script>
<style lang="scss">
.dialog_share {
  z-index: 5;
  .el-dialog {
    height: 300px;
    margin-top: 60px !important;
  }
  .el-dialog__body {
    padding: 16px 20px 40px;
  }
}
/deep/.dialog_share .el-dialog__header .el-dialog__title {
  font-size: 16px;
  color: #303233;
  line-height: 16px;
}
</style>
<style lang="scss" scoped>
/deep/.el-dialog__title {
  font-size: 16px;
  color: #303233;
  line-height: 16px;
}
/deep/.el-input.is-disabled .el-input__inner {
  background-color: #fff;
  color: #919599;
}
.share_word {
  font-size: 12px;
  color: #303233;
  line-height: 16px;
  margin-bottom: 15px;
}
.remark {
  color: #919599;
  line-height: 16px;
  span {
    display: inline-block;
    width: 100%;
    word-wrap: break-word;
    word-break: normal;
    font-size: 12px !important;
    line-height: 16px;
  }
}
.share_input {
  margin-top: 16px;
  position: relative;
  .share_tip {
    position: absolute;
    top: -130px;
    right: 20px;
    background-image: url('../images/share_tip.png');
    background-size: cover;
    width: 406px;
    height: 130px;
    img {
      width: 406px;
    }
    .know {
      width: 74px;
      height: 26px;
      line-height: 24px;
      border: 1px solid #ff9c59;
      border-radius: 4px;
      border-radius: 4px;
      padding: 0;
      font-size: 14px;
      color: #ff9c59;
      background-color: rgba(0, 0, 0, 0.01);
      // background-color: rgba();
      position: absolute;
      top: 18px;
      right: 18px;
    }
  }
}
.share_copy {
  width: 17%;
  height: 40px;
  background: #ff6700;
  border-radius: 4px;
  border-radius: 4px;
  color: #fff;
  font-size: 14px;
}
.share_copy:hover {
  background-color: #f25d00;
}
.copy_word {
  display: flex;
  justify-content: flex-end;
  font-size: 12px;
  color: #ff6700;
  text-align: right;
  line-height: 16px;
  margin-top: 14px;
  span {
    width: 102px;
    text-align: center;
  }
}
.copy_word_hidden {
  display: none;
}
.textarea-btn {
  display: flex;
  justify-content: flex-end;
  margin-top: 19px;
  .cancel {
    background: #edeff0;
    border-radius: 4px;
    border-radius: 4px;
    margin-right: 12px;
    font-size: 14px;
    color: #616366;
    height: 42px;
    line-height: 42px;
    width: 72px;
    padding: 0;
  }
  .creat_url {
    background: #ff6700;
    border-radius: 4px;
    border-radius: 4px;
    font-size: 14px;
    color: #ffffff;
    height: 42px;
    line-height: 42px;
    width: 100px;
    padding: 0;
  }
}
</style>