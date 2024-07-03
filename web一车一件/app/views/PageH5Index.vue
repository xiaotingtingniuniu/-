<template>
  <div id="h5" class="h5">
    <router-view />
    <h5footbutton v-if="quoted_status===0||quoted_status===1||quoted_status===2" />
  </div>
</template>
<script>
import H5footbutton from '../components/H5FootButton.vue';
import { mapMutations } from 'vuex';
export default {
  components: {
    H5footbutton,
  },
  data() {
    return {
    };
  },
  computed: {
    quoted_status: {
      get() {
        return this.$store.state.quoted_status;
      },
      set(value) {
        this.setQuoted_status(value);
      },
    },
  },
  methods: {
    ...mapMutations(['setQuoted_status']),
  },
};
</script>
<style lang="scss">
@import 'public.scss';
</style>
<style lang="scss" scoped>
.h5{
  height:100%;
  position: relative;
  max-width: 750px;
  margin: 0 auto;
  overflow: auto;
}
</style>