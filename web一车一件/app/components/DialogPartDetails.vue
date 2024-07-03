<template>
  <el-dialog :modal-append-to-body="false" :visible.sync="visible" :fullscreen="true" :show-close="false" :modal="false" class="dialog-part-details" @closed="handleClose">
    <div class="wrap">
      <div class="part-details__img">
        <image-viewer v-if="image" ref="imageViewer" :src="image" :parts="parts" :selected-item="selectedPart" :hovered-item="hoverPart" :show-close="true" @select="handleSelectImage" @close="visible = false" />
      </div>
      <div v-if="parts" class="part-details__parts">
        <el-table
          ref="morePartsTable"
          :data="parts"
          :row-class-name="tableRowClassName"
          :class="{ 'is-grabbing': mouseDown }"
          border
          height="100%"
          style="width: 100%;"
          @row-click="handleRowClick"
          @cell-mouse-enter="handleMouseEnter"
          @cell-mouse-leave="handleMouseLeave"
        >
          <el-table-column prop="total" label=" " width="40" type="index">
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
          <el-table-column prop="srcPartName" label="名称" width="180">
            <template slot-scope="scope">
              <span class="color--gray">{{ scope.row.srcPartName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="partPrice" label="4S店价格" width="100" />
          <el-table-column prop="partNumber" label="现用 OE 号" width="180">
            <template slot-scope="scope">
              <div class="oe">
                <template>{{ scope.row.partNumber }}</template>
                <span v-if="showCopy(scope.row.partNumber)" v-clipboard:copy="scope.row.partNumber" v-clipboard:success="onCopy" class="btn-copy is-oe">
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
          <el-table-column prop="comment" label="备注" width="200" />
        </el-table>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import ImageViewer from './ImageViewer.vue';
import PartDetailsHelper from '../mixins/part-details-helper';
import TextHelper from '../mixins/text-helper';

export default {
  components: {
    ImageViewer,
  },
  mixins: [PartDetailsHelper, TextHelper],
  props: {
    imageSrc: {
      type: String,
      required: false,
      default: '',
    },
    data: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    visible: true,
  }),
  computed: {
    ...mapState('vinQuery', ['currentVehicle']),
    ...mapState('partDetails', ['prefix', 'imgNameList', 'vehicle', 'oe', 'ref']),
  },
  created() {
    if (this.data && this.data.length) {
      const newParts = [];
      for (const item of this.data) {
        const newItem = Object.assign({}, item);
        newParts.push(newItem);

        if (newItem.status === 'selected') {
          this.selectedPart = newItem;
        }
      }
      this.parts = newParts;
    }

    this.image = this.imageSrc;
  },
  methods: {
    ...mapActions('partsList', ['addPart']),
    handleClose() {
      this.$emit('close');
    },
    addPartsList(item, index) {
      // 配件
      console.log('item', item);
      // 车型
      console.log('vehicle', this.vehicle);
      console.log('currentVehicle', this.currentVehicle);
      const addObject = {
        vehicle: JSON.stringify(this.currentVehicle) !== '{}' ? this.currentVehicle : this.vehicle,
        part: item,
        index: index,
      };
      console.log('addObject', addObject);
      console.log('index', index);
      console.log(document.getElementById(index).classList);
      const classListArr = document.getElementById(index).classList;
      if (classListArr.length === 2) {
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
.dialog-part-details {
  z-index: 5;

  /deep/.el-dialog__header,
  /deep/.el-dialog__body {
    padding: 0;
  }

  /deep/.el-dialog__body {
    height: 100%;
  }
}

.wrap {
  height: 100%;
  display: flex;
  box-sizing: border-box;
  overflow: hidden;

  .part-details__img {
    width: 60%;
    padding: 20px 20px 0 20px;
    overflow: hidden;

    .image-viewer {
      height: calc(100vh - 20px);

      /deep/img {
        width: 100%;
        border: $--border-main;
      }

      /deep/.viewer-toolbar {
        padding: 0 0 16px 0;
      }

      /deep/.viewer-wrapper {
        height: calc(100vh - 65px); // 兼容搜狗 6.0.5
      }
    }
  }

  .part-details__parts {
    height: 100%;
    width: 40%;

    .el-table {
      border: 1px solid #e6ecf2;
      font-size: 12px;
      background-color: #f7f9fa;

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

      /deep/tr {
        background-color: #f7f9fa;
      }

      /deep/th {
        padding: 10px 0;
        background-color: #f7f9fa;

        .cell {
          line-height: 1.5;
        }
      }

      /deep/td {
        position: relative;
        padding: 10px 0;
        background-color: transparent;

        .cell {
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
