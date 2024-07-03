<template>
  <div ref="viewer" class="image-viewer">
    <div class="toolbar">
      <div class="zoom">
        <div
          :class="{ 'is-disabled': disableZoomIn }"
          class="viewer__btn btn-in"
          @click="handleZoomIn"
        />
        <div
          :class="{ 'is-disabled': disableZoomOut }"
          class="viewer__btn btn-out"
          @click="handleZoomOut"
        />
      </div>
      <div v-if="!disableReset" class="viewer__btn btn-reset" @click="handleReset">
        <p>还原</p>
      </div>
      <div v-if="showFullscreen" class="viewer__btn btn-full" @click="handleFullscreen">
        <p>全屏</p>
      </div>
      <div v-if="showClose" class="viewer__btn btn-close" @click="handleClose">
        <p>退出全屏</p>
      </div>
    </div>
    <div ref="viewerWrapper" class="wrapper">
      <canvas ref="viewerCanvas" />
    </div>
    <div v-if="message" class="viewer__msg">
      <span>{{ message }}</span>
    </div>
  </div>
</template>

<script>
import '../utils/canvas';
import { getImageViewer } from '../utils/image-viewer';

export default {
  props: {
    src: {
      type: String,
      required: true,
    },
    parts: {
      type: Array,
      required: true,
    },
    selectedItem: {
      type: Object,
      required: true,
    },
    hoveredItem: {
      type: Object,
      required: true,
    },
    showFullscreen: {
      type: Boolean,
      required: false,
      default: false,
    },
    showClose: {
      type: Boolean,
      required: false,
      default: false,
    },
    message: {
      type: String,
      required: false,
      default: '',
    },
  },
  data: () => ({
    disableZoomIn: false,
    disableZoomOut: true,
    imageViewer: null,
  }),
  computed: {
    disableReset() {
      return this.disableZoomOut;
    },
  },
  watch: {
    selectedItem(to) {
      this.imageViewer.selectedPart = to;
      this.imageViewer.moveToSelectedPoint();
    },
    hoveredItem(to) {
      this.imageViewer.hoveredPart = to;
      this.imageViewer.drawImage();
      this.imageViewer.drawPart();
    },
  },
  mounted() {
    this.imageViewer = getImageViewer(
      this.$refs.viewerCanvas,
      this.src,
      {
        parts: this.parts,
      },
      {
        loaded: () => this.$emit('load'),
        selectedPart: this.selectedItem,
        afterWheel: this.updateZoomButton,
        afterHover: this.updateHoverdPart,
        afterClick: this.updateSelectedPart,
      },
    );

    if (this.message) {
      setTimeout(() => {
        this.$emit('load');
      }, 500);
    }
  },
  beforeDestroy() {
    this.imageViewer.removeAllEventListener();
  },
  methods: {
    updateHoverdPart(item) {
      for (const p of this.parts) {
        if (p.status === 'selected') {
          continue;
        }
        if (item && item.position === p.position) {
          p.status = 'hover';
        } else {
          p.status = '';
        }
      }
    },
    updateSelectedPart(item) {
      if (!item.position) {
        return;
      }

      for (const p of this.parts) {
        if (item.position === p.position) {
          p.status = 'selected';
        } else {
          p.status = '';
        }
      }

      this.$nextTick(() => {
        this.$emit('select', item);
      });
    },
    updateZoomButton() {
      if (this.imageViewer.error) {
        return false;
      }

      this.disableZoomIn = this.imageViewer.imageInfo.level === 9;
      this.disableZoomOut = this.imageViewer.imageInfo.level === 0;
    },
    handleZoomIn() {
      if (this.disableZoomIn) {
        return false;
      }

      this.imageViewer.zoomIn();
      this.updateZoomButton();
    },
    handleZoomOut() {
      if (this.disableZoomOut) {
        return false;
      }

      this.imageViewer.zoomOut();
      this.updateZoomButton();
    },
    handleReset() {
      if (this.disableReset) {
        return false;
      }

      this.imageViewer.reset();
      this.updateZoomButton();
    },
    handleFullscreen() {
      this.$emit('full-screen');
    },
    handleClose() {
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss" scoped>
.is-ie .image-viewer .wrapper {
  height: calc(100vh - 123px);
}

.image-viewer {
  position: relative;
  overflow: hidden;
  height: 100%;

  .toolbar {
    overflow: hidden;
    padding: 8px;
    font-size: 12px;
    background-color: #fff;

    .zoom {
      overflow: hidden;
      float: left;
    }
  }

  .wrapper {
    height: calc(100% - 44px);

    canvas {
      user-select: none;
      cursor: grab;

      &.grabbing {
        cursor: grabbing;
      }

      &.pointer {
        cursor: pointer;
      }
    }
  }

  .viewer__btn {
    position: relative;
    height: 26px;
    width: 59px;
    border: 1px solid #ced3d9;
    @include border-one-px;
    border-radius: 4px;
    background-color: $--color-skeleton;
    background-repeat: no-repeat;
    background-position: center;
    color: #616366;
    float: left;
    user-select: none;

    &.is-disabled {
      background-color: #f2f3f5;
    }

    &:not(.is-disabled):hover {
      z-index: 1;
      border-color: $--color-main;
      color: white;
      background-color: $--color-main;
    }

    p {
      position: relative;
      top: 50%;
      text-align: center;
      transform: translateY(-50%);
    }

    &.btn-in {
      border-radius: 4px 0 0 4px;
      margin-right: -1px;
      background-image: url('~@/images/icon_zoom-in.png');
      background-size: 16px;

      &.is-disabled {
        background-image: url('~@/images/icon_zoom-in--disabled.png');
      }

      &:not(.is-disabled):hover {
        background-image: url('~@/images/icon_zoom-in--hover.png');
      }
    }

    &.btn-out {
      border-radius: 0 4px 4px 0;
      background-image: url('~@/images/icon_zoom-out.png');
      background-size: 16px;

      &.is-disabled {
        background-image: url('~@/images/icon_zoom-out--disabled.png');
      }

      &:not(.is-disabled):hover {
        background-image: url('~@/images/icon_zoom-out--hover.png');
      }
    }

    &.btn-reset {
      margin-left: 8px;
    }

    &.btn-full,
    &.btn-close {
      float: right;
    }
  }

  .viewer__msg {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    color: #616366;
    font-size: 14px;
    background-color: white;
  }
}
</style>
