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
      <span class="dialog__title">积分规则</span>
    </div>
    <rule-item v-for="(item, index) in rules" :key="index" :rule="item" />
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
  data: () => ({
    rules: [
      '每日访问【+2 积分】',
      '一周访问三天【+5 积分】',
      '一周访问五天【+10 积分】',
      'VIN 查询有效记录一次【+2 积分】（每日最多得 20 积分）',
      'OE 查询有效记录一次【+1 积分】（每日最多得 30 积分）',
      '首次登陆【+20 积分】',
      '完善个人信息 【+50 积分】',
      '首次使用 VIN 查询功能【+10 积分】',
      '首次使用 OE 查询功能【+10 积分】',
      '首次使用江湖名查询【+10 积分】',
    ],
  }),
  methods: {
    handleClose() {
      this.$emit('update:show', false);
    },
  },
};
</script>
