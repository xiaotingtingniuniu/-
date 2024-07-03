<template>
  <section class="page-part-details">
    <header class="part-details__header">
      <navigation-part-details @back="handleBack" />
    </header>
    <main v-loading="pageLoading" class="part-details__main">
      <div v-if="imgNameList.length > 1" class="menu">
        <div v-if="showThumb" class="count">共 {{ imgNameList.length }} 张</div>
        <button v-else :disabled="loadingImage" class="btn-back-to-thumb" @click="hanleBackToThumbs">
          <template>查看缩略图</template>
        </button>
      </div>
      <div class="part-details__main__wrap" :class="{ 'has-padding-top': imgNameList.length === 1 }">
        <div v-loading="!pageLoading && (loadingImage || loadingThumbs)" class="part-details__img">
          <div v-if="showThumb" class="thumbs">
            <div class="thumbs__wrap">
              <template v-if="thumbList.length">
                <div v-for="(item, index) in thumbList" :key="index" class="thumbs__item" :class="{ 'is-selected': index === selectedThumb }" @click="handleSelectThumb(index)">
                  <img :src="item.imgUrl">
                  <div v-if="index === selectedThumb" class="zoom">
                    <span>点击放大</span>
                  </div>
                </div>
              </template>
              <span v-else>{{ toastMessage }}</span>
            </div>
          </div>
          <image-viewer
            v-if="loaded && !showThumb"
            :src="imgSrc"
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
        <div v-loading="!pageLoading && loadingMoreParts" class="part-details__parts">
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
            <el-table-column prop="comment" label="备注" width="245" />
          </el-table>
        </div>
      </div>
      <dialog-part-details v-if="showDialog" :image-src="image || imgList[selectedThumb]" :data="parts" @close="showDialog = false" />
    </main>
  </section>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import axios from 'axios';
import NavigationPartDetails from '../components/NavigationPartDetails.vue';
import ImageViewer from '../components/ImageViewer.vue';
import DialogPartDetails from '../components/DialogPartDetails.vue';
import PartDetailsHelper from '../mixins/part-details-helper';
import TextHelper from '../mixins/text-helper';
import { router_names, response_code } from '../config/constant';
import API from '../api/partDetails';

export default {
  components: {
    NavigationPartDetails,
    ImageViewer,
    DialogPartDetails,
  },
  mixins: [PartDetailsHelper, TextHelper],
  data: () => ({
    showDialog: false,
    showThumb: true,
    thumbList: [],
    imgList: null,
    selectedThumb: 0,
    pageLoading: true,
    loadingThumbs: false,
  }),
  computed: {
    ...mapState('partDetails', ['prefix', 'imgNameList', 'vehicle', 'oe', 'ref']),
    ...mapGetters('partDetails', ['fromPartTree', 'fromOE']),
    ...mapGetters('partTree', ['currentVehicle', 'firstLevelId', 'secondLevelId']),
    imgSrc() {
      if (this.image || this.imgList) {
        return this.image || this.imgList[this.selectedThumb];
      } else {
        return '';
      }
    },
  },
  watch: {
    loaded(to) {
      if (to) {
        this.pageLoading = false;
        this.scrollToCurrentPart();
      }
    },
  },
  created() {
    if (!this.fromPartTree && !this.fromOE && this.imgNameList) {
      this.$router.push({ name: router_names.HOME });
    } else {
      this.showThumb = this.imgNameList.length > 1;

      if (this.imgNameList.length === 1) {
        this.getPartImage({
          prefix: this.prefix,
          imageName: this.imgNameList[0],
          firstLevelId: this.firstLevelId,
          secondLevelId: this.secondLevelId,
          source: this.fromOE ? '0' : null,
        });
      } else {
        this.imgList = Array(this.imgNameList.length).fill('');
        this.getPartThumb({
          imageNames: this.imgNameList,
          imagePrePath: this.prefix,
          source: '0',
        });
      }
      if (this.fromPartTree) {
        this.queryPartsByImage({
          vinCode: this.currentVehicle.vinCode,
          optionCode: this.currentVehicle.optionCode,
          mjsid: this.currentVehicle.mjsid,
          vehicle: this.currentVehicle,
          image: this.imgNameList[0],
          source: '2', // 0:oe, 1:结构树, 2: 其他
        });
      } else if (this.fromOE) {
        this.queryPartsByImage({
          vinCode: this.currentVehicle.vinCode,
          optionCode: this.currentVehicle.optionCode,
          mjsid: this.currentVehicle.mjsid,
          vehicle: this.vehicle,
          image: this.imgNameList[this.selectedThumb],
          source: '0', // 0:oe, 1:结构树, 2: 其他
        });
      }
    }
  },
  methods: {
    ...mapActions('partsList', ['addPart']),
    handleBack() {
      if (this.fromPartTree) {
        this.$router.push({ name: router_names.PART_TREE });
      } else if (this.fromOE) {
        this.$router.push({ name: router_names.VEHICLE_GROUP });
      }
    },
    hanleBackToThumbs() {
      this.showThumb = true;
    },
    handleSelectThumb(index) {
      if (this.loadingMoreParts) {
        return;
      }

      if (this.selectedThumb === index) {
        return this.handleZoom(index);
      }

      this.selectedThumb = index;
      this.parts = [];
      this.queryPartsByImage({
        vinCode: this.currentVehicle.vinCode,
        optionCode: this.currentVehicle.optionCode,
        mjsid: this.currentVehicle.mjsid,
        vehicle: this.vehicle,
        image: this.imgNameList[index],
        source: '2', // 0:oe, 1:结构树, 2: 其他
      });
    },
    handleZoom(index) {
      this.showThumb = false;
      if (this.imgList[index]) {
        return;
      }

      this.getPartImage({
        prefix: this.prefix,
        imageName: this.imgNameList[index],
        firstLevelId: this.firstLevelId,
        secondLevelId: this.secondLevelId,
        source: this.fromOE ? '0' : null,
      });
    },
    getPartThumb({ imageNames, imagePrePath, source }) {
      const ts = axios.CancelToken.source();
      this.cancelToken.push(ts);
      this.loadingThumbs = true;
      this.loadingImage = true;

      API.getPartThumb(
        {
          imageNames,
          imagePrePath,
          source,
        },
        {
          cancelToken: ts.token,
        },
      )
        .then(resp => {
          if (!resp) {
            return;
          }

          const { code, toastMessage, data } = resp.data;

          if (code === response_code.SUCCESS) {
            this.thumbList = data || [];
          } else {
            this.toastMessage = toastMessage;
          }

          this.loadingThumbs = false;
          this.loadingImage = false;
        })
        .catch(error => {
          console.error(error);
        });
    },
    getPartListByVehicleImg({ vehicle, imageName }) {
      const source1 = axios.CancelToken.source();
      this.cancelToken.push(source1);
      this.loadingMoreParts = true;
      this.parts = [];

      API.getPartListByVehicleImg(
        {
          vehicle,
          imageName,
          pageIndex: 1,
          pageLimit: 200,
        },
        {
          cancelToken: source1.token,
        },
      )
        .then(resp => {
          if (!resp) {
            return;
          }

          const partList = resp.data.data || [];
          const newParts = [];

          this.handleGetPartListResp(partList, newParts);

          this.loadingMoreParts = false;
        })
        .catch(error => {
          console.error(error);
        });
    },
    addMark(partList) {
      let isMarked = false;

      this.oe &&
        partList.forEach(item => {
          if (item.partNumber === this.oe) {
            item.isMarked = isMarked = true;
          }
        });

      if (isMarked) {
        return;
      }

      this.oe &&
        partList.forEach(item => {
          if (item.substitute === this.oe) {
            item.isMarked = isMarked = true;
          }
        });

      if (isMarked) {
        return;
      }

      this.ref &&
        partList.forEach(item => {
          if (item.partRefOnImage === this.ref) {
            item.isMarked = isMarked = true;
          }
        });
    },
    addPartsList(item, index) {
      const addObject = {
        vehicle: JSON.stringify(this.currentVehicle) !== '{}' ? this.currentVehicle : this.vehicle,
        part: item,
        index: index,
      };
      const classListArr = document.getElementById(index).classList;
      if (classListArr.length === 2) {
        // return;
      }
      // 先调用添加接口 如果添加成功 再去执行下面
      this.addPart(addObject);
    },
  },
};
</script>

<style lang="scss" scoped>
.is-ie .thumbs__item img {
  width: 100%;
}

.page-part-details {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100%;
  min-width: 1024px;
  overflow: hidden;

  .part-details__main {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    overflow: hidden;
    height: calc(100vh - 60px);
    background-color: #f5f6f7;

    .menu {
      padding: 6px 10px;

      .count {
        font-size: 14px;
        color: #000;
      }

      .btn-back-to-thumb {
        padding: 0;
        font-size: 14px;
        line-height: 21px;
        color: #ff6700;
        cursor: pointer;
        background-color: transparent;
      }
    }

    .part-details__main__wrap {
      flex: auto;
      display: flex;
      padding: 0 10px 10px 10px;

      &.has-padding-top {
        padding-top: 10px;
      }
    }
  }

  .part-details__img {
    box-sizing: border-box;
    height: 100%;
    width: 45%;
    margin-right: 10px;
    border: 1px solid #e6ecf2;
    background-color: #fff;

    .thumbs {
      box-sizing: border-box;
      height: 100%;
      width: 100%;
      padding: 10px 0;
      overflow-y: auto;

      .thumbs__wrap {
        display: flex;
        flex-wrap: wrap;
        padding: 0 11px;

        .thumbs__item {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          height: 186px;
          width: calc(100% / 3 - 18px);
          border: 1px solid #e6ecf2;
          @include border-one-px;
          margin: 10px 9px;
          transition: box-shadow 0.5s;
          cursor: pointer;

          &:not(.is-selected):hover {
            box-shadow: 0 4px 8px rgba($color: #000, $alpha: 0.1);
          }

          &.is-selected {
            border-color: #ffc59e;
          }

          .zoom {
            position: absolute;
            left: 0;
            bottom: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 24px;
            width: 100%;
            font-size: 12px;
            color: #ff6700;
            background-color: #ffe3d1;
          }

          img {
            max-height: 100%;
            max-width: 100%;
          }
        }
      }
    }

    .image-viewer {
      height: calc(100vh - 105px); // 兼容搜狗 6.0.5
    }
  }

  .part-details__parts {
    height: calc(100vh - 103px); // 兼容搜狗 6.0.5
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
