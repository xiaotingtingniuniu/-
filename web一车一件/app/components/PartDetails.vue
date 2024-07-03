<template>
  <div v-loading="!loaded && !searching" class="part-details">
    <div ref="imageBox" class="part-details__img">
      <image-viewer
        v-if="loaded"
        ref="imageViewer"
        :src="image"
        :parts="parts"
        :selected-item="selectedPart"
        :hovered-item="hoverPart"
        :show-fullscreen="true"
        :message="toastMessage"
        @select="handleSelectImage"
        @load="handleImageLoad"
        @full-screen="showDialog = true"
      />
    </div>
    <div v-if="parts && loaded" ref="partBox" class="part-details__parts">
      <el-table
        ref="morePartsTable"
        :data="parts"
        :row-class-name="tableRowClassName"
        :max-height="maxHeight"
        :class="{ 'is-grabbing': mouseDown }"
        border
        style="width: 100%;"
        @row-click="handleRowClick"
        @cell-mouse-enter="handleMouseEnter"
        @cell-mouse-leave="handleMouseLeave"
      >
        <el-table-column prop="partRefOnImage" label=" " width="40" type="index">
          <div :id="scope.$index" slot-scope="scope" class="table_add" @click="addPartsList(scope.row, scope.$index)" />
        </el-table-column>
        <el-table-column prop="partRefOnImage" label="图中编号" width="99">
          <template slot-scope="scope">
            <template>{{ scope.row.partRefOnImage }}</template>
            <template v-if="scope.row.hasParent">
              <el-tooltip content="局部配件" effect="dark" placement="top" transition="tooltip-fade-in-linear">
                <div class="icon-partial" />
              </el-tooltip>
            </template>
            <el-tooltip content="查询结果" effect="dark" placement="top" transition="tooltip-fade-in-linear">
              <div v-if="scope.row.isMarked" class="icon-current-part" />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="stdPartName" label="标准名" width="130" />
        <el-table-column prop="srcPartName" label="名称" width="120">
          <template slot-scope="scope">
            <span class="is-gray">{{ scope.row.srcPartName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="partPrice" label="4S店价格" width="99" />
        <el-table-column prop="partNumber" label="现用 OE 号" width="175">
          <template slot-scope="scope">
            <div class="oe">
              <template>{{ scope.row.partNumber }}</template>
              <span v-if="showCopy(scope.row.partNumber)" v-clipboard:copy="scope.row.partNumber" v-clipboard:success="onCopy" class="btn-copy">
                <template>复制</template>
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="substitute" label="曾用 OE 号" width="175">
          <template slot-scope="scope">
            <div class="substitute">
              <span class="is-gray">{{ scope.row.substitute }}</span>
              <span v-if="showCopy(scope.row.substitute)" v-clipboard:copy="scope.row.substitute" v-clipboard:success="onCopy" class="btn-copy">
                <template>复制</template>
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="comment" label="备注" width="198" />
      </el-table>
    </div>
    <dialog-part-details v-if="showDialog" :image-src="image" :data="parts" @close="showDialog = false" />
  </div>
</template>

<script>
import ImageViewer from './ImageViewer.vue';
import DialogPartDetails from './DialogPartDetails.vue';
import PartDetailsHelper from '../mixins/part-details-helper';
import TextHelper from '../mixins/text-helper';
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  components: {
    ImageViewer,
    DialogPartDetails,
  },
  mixins: [PartDetailsHelper, TextHelper],
  props: {
    sequenceNumber: {
      type: Number,
      required: false,
      default: -1,
    },
    part: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    maxHeight: 300,
    oldScrollTop: 0,
    fixedTop: 0,
    showDialog: false,
    isImgActive: false,
  }),
  computed: {
    ...mapState('partsList', ['partsListTotal']),
    ...mapState('vinQuery', ['currentVehicle']),
    ...mapGetters('vinQuery', ['searching']),
  },
  watch: {
    loaded(to) {
      if (to) {
        this.$emit('load', this.sequenceNumber);
        this.updateMaxHeight();
        this.scrollToCurrentPart();
      }
    },
  },
  created() {
    console.log('this.currentVehicle', this.currentVehicle);
    this.getPartImage({
      prefix: this.currentVehicle.prefix,
      imageName: this.part.image,
    });
    this.queryPartsByImage({
      vinCode: this.currentVehicle.vinCode,
      optionCode: this.currentVehicle.optionCode,
      mjsid: this.currentVehicle.mjsid,
      vehicle: this.currentVehicle,
      image: this.part.image,
      source: '2', // 0:oe, 1:结构树, 2: 其他
    });
    window.addEventListener('resize', this.updateMaxHeight);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateMaxHeight);
  },
  methods: {
    ...mapMutations('partsList', ['setPartsListTotal']),
    ...mapActions('partsList', ['addPart']),
    updateMaxHeight() {
      this.$nextTick(() => {
        if (!this.$refs.imageViewer) {
          return;
        }
        this.maxHeight = this.$refs.imageViewer.$el.clientHeight + 2;
      });
    },
    addPartsList(item, index) {
      console.log('currentVehicle', this.currentVehicle);
      const addObject = {
        vehicle: this.currentVehicle,
        part: item,
        index: index,
      };
      console.log(document.getElementById(index).classList);
      const classListArr = document.getElementById(index).classList;
      if (classListArr.length === 2) {
        console.log(111);
        // return;
      }
      // 先调用添加接口 如果添加成功 再去执行下面
      console.log(this.addPart);
      this.addPart(addObject);
    },
  },
};
</script>

<style lang="scss" scoped>
.part-details {
  position: relative;
  display: flex;
  min-height: 50px;
  padding: 10px;
  background-color: #f7f9fa;

  .part-details__img {
    box-sizing: border-box;
    width: 45%;
    margin-right: 10px;
    border: 1px solid #e6ecf2;

    .image-viewer /deep/.wrapper {
      height: calc(100vh - 287px);
    }
  }

  .part-details__parts {
    width: calc(55% - 10px);

    .el-table {
      border: 1px solid #e6ecf2;
      font-size: 12px;

      // 设置鼠标处于可拖动区域时的样式
      /deep/.el-table__body-wrapper td {
        cursor: grab;

        .cell {
          cursor: text;
        }
      }

      // 设置在表格内按住鼠标时的鼠标样式
      &.is-grabbing {
        /deep/.el-table__body-wrapper td,
        /deep/.el-table__header-wrapper,
        /deep/.el-table__fixed {
          cursor: grabbing;

          .cell {
            cursor: grabbing;
          }
        }
      }

      .table_add {
        height: 16px;
        width: 16px;
        background-image: url('~@/images/icon_add@2x.png');
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
        opacity: 0.6;

        &:hover {
          opacity: 1;
          cursor: pointer;
        }
      }

      /deep/th {
        padding: 10px 0;

        .cell {
          line-height: 1.5;
        }
      }

      /deep/td {
        padding: 10px 0;

        .cell {
          position: relative;
          color: #000;
          line-height: 1.5;

          .is-gray {
            color: #616366;
          }
        }
      }

      /deep/tr {
        transition: background-color 0.2s;

        &.is-hovered {
          background-color: #fff6f0;
        }

        &.is-selected {
          background-color: #ffe5d4;
        }

        // 覆盖 element-ui 原来的背景色
        &:hover > td,
        &.hover-row > td {
          background-color: transparent;
        }

        &.is-hovered,
        &.is-selected {
          .icon-partial {
            background-image: url('~@/images/icon_partial--hover.png');
          }
        }

        &.hide-bottom-border > td {
          border-bottom-width: 0;
        }
      }
    }
  }
}

.icon-partial {
  position: absolute;
  right: 14px;
  top: 50%;
  z-index: 1;
  height: 16px;
  width: 16px;
  background-image: url('~@/images/icon_partial.png');
  background-repeat: no-repeat;
  background-size: contain;
  transform: translateY(-50%);
  transition: background-image 0.2s;
}

.oe,
.substitute {
  display: flex;
  justify-content: space-between;

  .btn-copy {
    color: #ff6700;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.2s;
  }

  &:hover .btn-copy {
    opacity: 1;
  }
}
</style>
