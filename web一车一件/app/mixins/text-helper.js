import { notSupportCopyBtn } from '../utils/browser';

export default {
  methods: {
    onCopy() {
      this.$message({
        message: '复制成功',
        type: 'success',
      });
    },
    showCopy(text) {
      return text && !notSupportCopyBtn();
    },
  },
};
