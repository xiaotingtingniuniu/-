<template>
  <el-dialog
    :modal-append-to-body="true"
    :append-to-body="true"
    :visible.sync="show"
    :before-close="handleClose"
    width="640px"
    class="dialog-user-center"
  >
    <div slot="title" class="dialog__header">
      <span class="dialog__title">减损规则</span>
    </div>
    <rule-item rule="触发OE纠偏行为时，推荐配件金额小于查询金额，且同一个OE仅记录一次。" />
  </el-dialog>
</template>

<script>
import RuleItem from './RuleItem.vue';

export default {
  components: {
    RuleItem,
  },
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    handleClose() {
      this.$emit('update:show', false);
    },
  },
};
</script>
