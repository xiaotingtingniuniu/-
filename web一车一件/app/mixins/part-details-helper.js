import axios from 'axios';
import API from '../api/vinQuery';
import { response_code } from '../config/constant';
import BezierEasing from '../utils/bezier-easing';

export default {
  data: () => ({
    loadingImage: true,
    loadingMoreParts: true,
    image: '',
    parts: [],
    selectedPart: {},
    hoverPart: {},
    mouseDown: false,
    startX: 0,
    wrapper: null,
    toastMessage: '',
    cancelToken: [],
    tableWrapper: null,
    animeTime: 0,
    animeId: null,
    startScrollTop: null,
    targetScrollTop: null,
  }),
  computed: {
    loaded() {
      return !this.loadingImage && !this.loadingMoreParts;
    },
  },
  updated() {
    if (!this.$refs.morePartsTable) {
      return;
    }

    this.wrapper = this.$refs.morePartsTable.$el.querySelector('.el-table__body-wrapper');
    this.wrapper.removeEventListener('mousedown', this.handleMousedown);
    this.wrapper.addEventListener('mousedown', this.handleMousedown);
  },
  beforeDestroy() {
    this.cancelToken.map(token => token.cancel('Request canceled'));
  },
  methods: {
    parsePostion(position) {
      /** 匹配 (x,y,w,h) 四个参数的类型均为数字，x 和 y 可以是负数 */
      const regCoordinate = /((-)?\d+(\.\d+)?,(-)?\d+(\.\d+)?,\d+(\.\d+)?,\d+(\.\d+)?)/g;
      const posArr = position.match(regCoordinate) || [];
      const coordinate = [];

      for (const pos of posArr) {
        const coor = pos.split(',');
        coordinate.push({
          x: +coor[0],
          y: +coor[1],
          w: +coor[2],
          h: +coor[3],
        });
      }

      return coordinate;
    },
    isSamePosition(coorsA, coorsB) {
      if (coorsA.length !== coorsB.length) {
        return false;
      }

      for (let i = 0; i < coorsA.length; i++) {
        if (coorsA[i].x !== coorsB[i].x || coorsA[i].y !== coorsB[i].y || coorsA[i].w !== coorsB[i].w || coorsA[i].h !== coorsB[i].h) {
          return false;
        }
      }

      return true;
    },
    tableRowClassName({ row }) {
      const classes = [];
      if (row.hasParent) {
        classes.push('is-child');
      } else if (row.hasChild) {
        classes.push('is-parent');
      }

      if (row.status === 'hover') {
        classes.push('is-hovered');
      } else if (row.status === 'selected') {
        classes.push('is-selected');
      }

      if (row.hideBottomBorder) {
        classes.push('hide-bottom-border');
      }

      return classes.join(' ');
    },
    handleRowClick(row) {
      for (const p of this.parts) {
        if (row.coordinates && p.coordinates && this.isSamePosition(row.coordinates, p.coordinates)) {
          p.status = 'selected';
        } else {
          p.status = '';
        }
      }

      row.status = 'selected';
      this.selectedPart = row;
    },
    handleMousedown(e) {
      this.mouseDown = true;
      this.startX = e.clientX;

      const target = e.target;
      if (!target.classList.contains('cell') && !target.parentElement.classList.contains('cell')) {
        document.addEventListener('mousemove', this.handleMouseMove);
      }
      document.addEventListener('mouseup', this.handleMouseUp);
    },
    handleMouseMove(e) {
      if (!this.mouseDown) {
        return;
      }

      window.getSelection().removeAllRanges();

      const distance = e.clientX - this.startX;
      this.startX = e.clientX;

      let newScrollLeft = this.wrapper.scrollLeft - distance;

      const scrollWidth = this.wrapper.scrollWidth;

      if (newScrollLeft < 0) {
        newScrollLeft = 0;
      } else if (newScrollLeft > scrollWidth) {
        newScrollLeft = scrollWidth;
      }

      this.wrapper.scrollLeft = newScrollLeft;
    },
    handleMouseUp() {
      this.mouseDown = false;
      document.removeEventListener('mousemove', this.handleMouseMove);
      document.removeEventListener('mouseup', this.handleMouseUp);
    },
    handleMouseEnter(row) {
      if (row.status === 'selected') {
        return;
      }

      for (const p of this.parts) {
        if (row.coordinates && p.coordinates && this.isSamePosition(row.coordinates, p.coordinates)) {
          p.status = 'hover';
        } else if (p.status === 'hover') {
          p.status = '';
        }
      }

      row.status = 'hover';
      this.hoverPart = row;
    },
    handleMouseLeave(row) {
      if (row.status !== 'selected') {
        row.status = '';
        this.hoverPart = {};
        for (const p of this.parts) {
          if (p.status === 'hover') {
            p.status = '';
          }
        }
      }
    },
    getPartImage({ prefix, imageName, firstLevelId, secondLevelId, source }) {
      const ctSource = axios.CancelToken.source();
      this.cancelToken.push(ctSource);
      this.loadingImage = true;

      API.getPartImage(
        {
          imagePrePath: prefix,
          imageName,
          firstLevelId,
          secondLevelId,
          source,
        },
        {
          cancelToken: ctSource.token,
        },
      )
        .then(resp => {
          if (!resp) {
            return;
          }

          const { code, toastMessage, imageInfo } = resp.data;

          if (code === response_code.SUCCESS) {
            if (this.imgList) {
              this.imgList[this.selectedThumb] = imageInfo;
            } else {
              this.image = imageInfo || '';
            }
          } else {
            this.toastMessage = toastMessage;
          }

          this.loadingImage = false;
        })
        .catch(error => {
          console.error(error);
        });
    },
    queryPartsByImage({ vinCode, optionCode, mjsid, vehicle, image, source }) {
      const source1 = axios.CancelToken.source();
      this.cancelToken.push(source1);
      this.loadingMoreParts = true;

      API.queryPartsByImage(
        {
          vinCode,
          optionCode,
          mjsid,
          vehicle,
          image,
          source,
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
    handleGetPartListResp(partList, newParts) {
      if (partList && partList.length) {
        this.addMark(partList);
        for (let i = 0; i < partList.length; i++) {
          partList[i].priority = i;
          if (partList[i].position) {
            partList[i].coordinates = this.parsePostion(partList[i].position);
          }
        }

        for (const p of partList) {
          if (p.child && p.child.length) {
            const newPart = Object.assign({}, p, { hasChild: true, hasParent: false, status: '', __child: [] });
            newParts.push(newPart);
            p.__hasPushed = true;

            for (const r of partList) {
              if (p.child.includes(r.partNumber)) {
                newPart.__child.push(Object.assign({}, r, { hasChild: r.child && r.child.length, hasParent: true, status: '' }));
                r.__hasPushed = true;
              }
            }
          } else if (!(p.child && p.child.length) && !(p.parent && p.parent.length)) {
            newParts.push(Object.assign({}, p, { hasChild: false, hasParent: false, status: '' }));
            p.__hasPushed = true;
          }
        }

        partList.forEach(p => {
          if (!p.__hasPushed) {
            newParts.push(Object.assign({}, p, { hasChild: false, hasParent: false, status: '' }));
          }
        });

        newParts.sort((a, b) => a.priority - b.priority);
      }
      for (const p of newParts) {
        if (Array.isArray(p.__child) && p.__child.length) {
          this.parts.push({
            ...p,
            hideBottomBorder: true,
          });

          this.parts.push(
            ...p.__child.map((item, index) => ({
              ...item,
              hideBottomBorder: index < p.__child.length - 1,
            })),
          );
        } else {
          this.parts.push(p);
        }
      }
    },
    addMark(partList) {
      partList.forEach(item => {
        if (this.part && item.partNumber === this.part.partNumber) {
          item.isMarked = true;
        }
      });

      return;
    },
    handleImageLoad() {
      if (!this.$refs.imageBox || !this.$refs.partBox) {
        return;
      }

      const diff = this.$refs.imageBox.clientHeight - this.$refs.partBox.clientHeight;
      if (diff >= 0) {
        this.$refs.partBox.style.marginBottom = diff + 'px';
      }
    },
    handleSelectImage(current) {
      if (!this.$refs.morePartsTable) {
        return;
      }

      const tableWrapper = this.$refs.morePartsTable.$el.querySelector('.el-table__body-wrapper');
      const tableWrapperRect = tableWrapper.getBoundingClientRect();
      const rectTop = tableWrapperRect.top;
      const rectBottom = tableWrapperRect.bottom;

      this.selectedPart = current;
      this.hoverPart = {};

      const selectedRows = this.$refs.morePartsTable.$el.querySelectorAll('.is-selected');

      if (!selectedRows || !selectedRows.length) {
        return;
      }

      for (const row of selectedRows) {
        const rect = row.getBoundingClientRect();
        if (rect.top > rectTop && rect.bottom < rectBottom) {
          return;
        }
      }

      const top = selectedRows[0].getBoundingClientRect().top;
      const bottom = selectedRows[0].getBoundingClientRect().bottom;
      let targetScrollTop = 0;
      const distance = tableWrapper.scrollTop - (tableWrapperRect.bottom + tableWrapperRect.top) / 2;

      if (top < tableWrapperRect.top) {
        targetScrollTop = top + distance;
      } else if (bottom > tableWrapperRect.bottom) {
        targetScrollTop = bottom + distance;
      }

      if (!targetScrollTop) {
        return;
      }

      if (this.animeId) {
        cancelAnimationFrame(this.animeId);
      }

      this.tableWrapper = tableWrapper;
      this.startScrollTop = tableWrapper.scrollTop;
      this.targetScrollTop = targetScrollTop;
      requestAnimationFrame(this.step);
    },
    step(timestamp) {
      this.animeTime = this.animeTime || timestamp;

      if (timestamp - this.animeTime < 3e2) {
        const f = BezierEasing.linear((timestamp - this.animeTime) / 3e2);
        const nextY = f * (this.targetScrollTop - this.startScrollTop) + this.startScrollTop;
        this.tableWrapper.scrollTop = nextY;
        this.animeId = requestAnimationFrame(this.step);
      } else {
        this.animeTime = 0;
      }
    },
    scrollToCurrentPart() {
      const currentParts = this.parts.find(item => item.isMarked);
      if (!currentParts) {
        return;
      }

      setTimeout(() => {
        this.handleRowClick(currentParts);
        this.$nextTick(() => {
          this.handleSelectImage(currentParts);
        });
      }, 1000);
    },
  },
};
