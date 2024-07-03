<template>
  <div v-if="show" :class="classes">
    <div class="dlg__modal" />
    <div class="dlg__box">
      <i class="el-icon-close" @click="close" />
      <main>
        <article :class="'step-' + currentStep">
          <p v-for="n in stepCount" :key="n" />
        </article>
      </main>
      <footer>
        <nav>
          <div v-for="n in stepCount" :key="n" :class="{ 'is-active': currentStep === n }" />
        </nav>
        <div v-if="currentStep !== 1" class="toturial__btn btn-pre" @click="back">
          <span>返回</span>
        </div>
        <div v-if="currentStep !== stepCount" class="toturial__btn btn-next" @click="next">
          <span>继续</span>
        </div>
        <div v-else class="toturial__btn btn-close" @click="close">
          <span>知道了</span>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
import { local_types } from '../config/constant';

const TOTURIAL_SHOW = 'show';
const TOTURIAL_CLOSING = 'closing';
const TOTURIAL_CLOSED = 'closed';

export default {
  data: () => ({
    status: TOTURIAL_CLOSED,
    stepCount: 2,
    currentStep: 1,
  }),
  computed: {
    show() {
      return this.status !== TOTURIAL_CLOSED;
    },
    closing() {
      return this.status === TOTURIAL_CLOSING;
    },
    classes() {
      return ['toturial', { 'is-closing': this.closing }];
    },
  },
  created() {
    const showedToturial = localStorage.getItem(local_types.TOTURIAL);
    if (!showedToturial) {
      this.status = TOTURIAL_SHOW;
      localStorage.setItem(local_types.TOTURIAL, true);
    }
  },
  methods: {
    back() {
      if (this.currentStep > 1) {
        this.currentStep--;
      }
    },
    next() {
      if (this.currentStep <= 2) {
        this.currentStep++;
      }
    },
    close() {
      this.status = TOTURIAL_CLOSING;
      setTimeout(() => {
        this.status = TOTURIAL_CLOSED;
      }, 500);
    },
  },
};
</script>

<style lang="scss" scoped>
.toturial {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2000;
  transition: 0.5s;

  &.is-closing {
    opacity: 0;
  }

  .dlg__modal {
    height: 100%;
    width: 100%;
    background: #000;
    opacity: 0.3;
    position: absolute;
  }

  .dlg__box {
    height: 510px;
    width: 960px;
    padding: 28px 26px 20px 26px;
    box-sizing: border-box;
    background: #eeeeee;
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.16);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    i {
      position: absolute;
      right: -58px;
      top: 0;
      font-size: 35px;
      color: white;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      user-select: none;
    }
  }
}

main {
  height: 408px;
  width: 100%;
  overflow: hidden;

  article {
    height: 100%;
    width: calc(908px * 4);
    transition: 0.5s;

    @for $i from 1 through 4 {
      &.step-#{$i} {
        transform: translateX((1 - $i) * 25%);
      }
    }
  }

  p {
    height: 100%;
    width: 908px;
    background-size: cover;
    float: left;
    @for $i from 1 through 2 {
      &:nth-child(#{$i}) {
        background-image: url('~@/images/share_page#{$i}@2x.png');
      }
    }
  }
}

footer {
  height: 40px;
  position: relative;
  display: flex;
  justify-content: flex-end;

  nav {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    display: flex;

    div {
      height: 8px;
      width: 8px;
      border-radius: 5px;
      border: 1px solid #cccccc;
      margin-left: 10px;

      &:first-child {
        margin: 0;
      }

      &.is-active {
        background: #cccccc;
      }
    }
  }

  .toturial__btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100px;
    height: 40px;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    user-select: none;

    &.btn-next,
    &.btn-close {
      margin-right: 4px;
      color: white;
      background: $--color-main;
    }

    &.btn-pre {
      margin-right: 20px;
      color: $--color-main;
      background: white;
    }
  }
}
</style>
