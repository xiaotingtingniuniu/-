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
      <span class="dialog__title">勋章规则</span>
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
    rules: ['风控达人：累计减损金额达到 10 万元', '业务专家：VIN 及 OE 搜索积分达到 3000 分', '勤劳员工：访问积分累计达到 240 分'],
  }),
  methods: {
    handleClose() {
      this.$emit('close');
    },
  },
};
</script>
