import _ from 'lodash';
import BezierEasing from './bezier-easing';
import './canvas';
import { getFireFoxVersion } from './browser';

class ImageViewer {
  /**
   * constructor
   * @param {HTMLCanvasElement} canvas 需要画图的 canvas 元素
   * @param {String} imageSrc 图片的路径或者 Base64 编码
   * @param {Object} data 配件数据
   * @param {Object} opt 可选配置
   */
  constructor(canvas, imageSrc, data, opt) {
    if (!canvas || !imageSrc) {
      return this.handleError();
    }

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.msImageSmoothingEnabled = true;

    this.isFF = getFireFoxVersion() !== -1;

    this.dir = 0;

    this.eventHandlers = {
      down: {
        event: 'mousedown',
        callback: 'onMouseDown',
        element: this.canvas,
      },
      hover: {
        event: 'mousemove',
        callback: 'onHover',
        element: this.canvas,
      },
      drag: {
        event: 'mousemove',
        callback: 'onDrag',
        element: document,
      },
      up: {
        event: 'mouseup',
        callback: 'onMouseUp',
        element: document,
      },
      leave: {
        event: 'mouseleave',
        callback: 'onMouseLeave',
        element: this.canvas,
      },
      scroll: {
        event: this.isFF ? 'DOMMouseScroll' : 'mousewheel',
        callback: 'onWheel',
        element: this.canvas,
      },
      click: {
        event: 'click',
        callback: 'onClick',
        element: this.canvas,
      },
      resize: {
        event: 'resize',
        callback: 'onResize',
        element: window,
      },
      contextmenu: {
        event: 'contextmenu',
        callback: 'onMenu',
        element: this.canvas,
      },
    };

    this.error = false;
    this.image = new Image();
    this.image.src = imageSrc;
    this.image.onload = () => this.init();
    this.image.onerror = () => this.handleError();

    this.parts = data.parts;
    this.hoveredPart = null;
    this.selectedPart = opt.selectedPart;

    this.loaded = opt.loaded;
    this.afterWheel = opt.afterWheel;
    this.afterHover = opt.afterHover;
    this.afterClick = opt.afterClick;

    this.style = {
      fixHeight: opt.fixHeight || 0,
      fixWidth: opt.fixWidth || 0,
    };

    window.img = this;
  }

  /**
   * 初始化
   */
  init() {
    this.initCanvasRect();

    this.initImageInfo();

    this.drawImage(0, 0);

    this.drawPart();

    this.addAllEventListener();

    if (_.isFunction(this.loaded)) {
      this.loaded();
    }
  }

  handleError() {
    this.error = true;
  }

  /**
   * 初始化 canvas 大小
   */
  initCanvasRect() {
    this.dpi = devicePixelRatio || 1;

    const { fixHeight, fixWidth } = this.style;

    const parentElement = this.canvas.parentElement;
    this.canvas.height = (parentElement.clientHeight - fixHeight) * this.dpi;
    this.canvas.width = (parentElement.clientWidth - fixWidth) * this.dpi;

    this.canvas.style.height = `${parentElement.clientHeight - fixHeight}px`;
    this.canvas.style.width = `${parentElement.clientWidth - fixWidth}px`;
  }

  /**
   * 初始化图片的各项参数
   */
  initImageInfo() {
    const naturalHeight = this.image.naturalHeight * this.dpi;
    const naturalWidth = this.image.naturalWidth * this.dpi;

    let currentWidth = 0;
    let currentHeight = 0;
    let minScale = 0;

    // 设容器高度为 Ch ，宽度为 Cw，图片原始高度为 Ph， 宽度为 Pw
    // 则容器宽高比为 Cw / Ch，图片宽高比为 Pw / Ph
    // 如果 Cw / Ch <= Pw / Ph
    // 则在水平方向上缩放
    // 如果 Cw / Ch > Pw / Ph
    // 则在垂直方向上缩放
    if (this.canvas.width / this.canvas.height <= naturalWidth / naturalHeight) {
      currentWidth = this.canvas.width;
      minScale = currentWidth / naturalWidth;
      currentHeight = minScale * naturalHeight;
    } else {
      currentHeight = this.canvas.height;
      minScale = currentHeight / naturalHeight;
      currentWidth = minScale * naturalWidth;
    }

    // 计算图片的初始坐标
    const pos = new Point((this.canvas.width - currentWidth) / 2, (this.canvas.height - currentHeight) / 2);

    this.imageInfo = {
      naturalHeight, // 原始高度
      naturalWidth, // 原始宽度
      currentHeight, // 当前高度
      currentWidth, // 当前宽度
      pos, // 当前图片左上角的坐标
      minScale, // 最小缩放比
      scale: minScale, // 当前缩放比
      level: 0,
    };

    this.updateOverflow();
  }

  /**
   * 更新图片的移动范围
   */
  updateOverflow() {
    const width = this.canvas.width - this.imageInfo.currentWidth;
    const height = this.canvas.height - this.imageInfo.currentHeight;

    this.posRect = new Rectangle(new Point(0, 0), width, height);
  }

  /**
   * 绑定所有事件
   */
  addAllEventListener() {
    for (const event in this.eventHandlers) {
      if (event === 'mousemove') {
        continue;
      }
      this.addEventListener(event);
    }
  }

  /**
   * 绑定事件
   * @param {String} e 事件名
   */
  addEventListener(e) {
    const { event, callback, element } = this.eventHandlers[e];

    const bind = this[callback].bind(this);
    this.eventHandlers[e].bind = bind;

    element.addEventListener(event, bind, {
      passive: false,
    });
  }

  /**
   * 移除所有事件
   */
  removeAllEventListener() {
    for (const event in this.eventHandlers) {
      this.removeEventListener(event);
    }
  }

  /**
   * 移除事件
   * @param {String} e 事件名
   */
  removeEventListener(e) {
    const { event, bind, element } = this.eventHandlers[e];

    element.removeEventListener(event, bind);
  }

  onMouseDown(e) {
    e.preventDefault();

    this.mouseDown = true;
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.canvas.classList.add('grabbing');

    this.addEventListener('drag');
  }

  onMouseUp(e) {
    e.preventDefault();

    this.mouseDown = false;
    this.canvas.classList.remove('grabbing');

    this.removeEventListener('drag');
  }

  onMouseLeave() {
    this.hoveredPart = null;

    this.drawImage();
    this.drawPart();
  }

  onDrag(e) {
    if (!this.mouseDown) {
      return;
    }

    e.preventDefault();

    const moveX = e.clientX - this.startX,
      moveY = e.clientY - this.startY;
    this.startX = e.clientX;
    this.startY = e.clientY;

    this.imageInfo.pos.add(moveX, moveY);

    this.drawImage();
    this.drawPart();
  }

  onHover(e) {
    const naturalPos = new Point(e.offsetX * this.dpi, e.offsetY * this.dpi);

    const scaledPos = naturalPos.subPoint(this.imageInfo.pos, false);

    const { scale } = this.imageInfo;

    this.hoveredPart = null;
    this.canvas.classList.remove('pointer');

    if (scaledPos) {
      for (const p of this.parts) {
        const { coordinates } = p;

        if (!coordinates) {
          continue;
        }

        for (const c of coordinates) {
          const { x, y, w, h } = c;
          const scaledRect = new Rectangle(new Point(x * scale * this.dpi, y * scale * this.dpi), w * scale * this.dpi, h * scale * this.dpi);
          if (scaledRect.contains(scaledPos).res) {
            this.canvas.classList.add('pointer');
            if (this.selectedPart !== p) {
              this.hoveredPart = p;
            }
            break;
          }
        }
      }
    }

    this.drawImage();
    this.drawPart();

    if (_.isFunction(this.afterHover)) {
      this.afterHover(this.hoveredPart);
    }
  }

  onWheel(e) {
    e.preventDefault();

    const deltaDir = e.detail * 11 || -e.wheelDelta;

    if (this.dir * deltaDir < 0) {
      this.dir = deltaDir;
    } else {
      this.dir += deltaDir;
    }

    const center = new Point(e.offsetX, e.offsetY);

    if (this.dir < -30) {
      this.zoomIn(center);
      this.dir = 0;
    } else if (this.dir > 30) {
      this.zoomOut(center);
      this.dir = 0;
    }

    if (_.isFunction(this.afterWheel)) {
      this.afterWheel();
    }
  }

  onClick(e) {
    const naturalPos = new Point(e.offsetX * this.dpi, e.offsetY * this.dpi);

    const scaledPos = naturalPos.subPoint(this.imageInfo.pos, false);

    const { scale } = this.imageInfo;

    if (scaledPos) {
      for (const p of this.parts) {
        const { coordinates } = p;

        if (!coordinates) {
          continue;
        }

        for (const c of coordinates) {
          const { x, y, w, h } = c;
          const scaledRect = new Rectangle(new Point(x * scale * this.dpi, y * scale * this.dpi), w * scale * this.dpi, h * scale * this.dpi);
          if (scaledRect.contains(scaledPos).res && this.selectedPart !== p) {
            this.selectedPart = p;
            break;
          }
        }
      }
    }

    this.drawImage();
    this.drawPart(scaledPos);

    if (_.isFunction(this.afterClick) && this.selectedPart) {
      this.afterClick(this.selectedPart);
    }
  }

  onMenu(e) {
    e.preventDefault();
  }

  onResize() {
    this.initCanvasRect();
    this.reset();
  }

  /**
   * 绘制图片
   */
  drawImage() {
    if (this.error || !this.imageInfo) {
      return;
    }

    const { pos } = this.imageInfo;

    // 判断图片是否在允许范围内，否则调整位置
    const { posOnX, posOnY } = this.posRect.contains(pos);

    if (posOnX > 0) {
      pos.x = this.posRect.x + this.posRect.width;
    } else if (posOnX < 0) {
      pos.x = this.posRect.x;
    }

    if (posOnY > 0) {
      pos.y = this.posRect.y + this.posRect.height;
    } else if (posOnY < 0) {
      pos.y = this.posRect.y;
    }

    this.imageInfo.pos = pos;

    this.clearCanvas();

    // 绘制背景色
    this.ctx.fillStyle = '#fff';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // 绘制图片
    const { currentWidth, currentHeight } = this.imageInfo;
    this.ctx.drawImage(this.image, pos.x, pos.y, currentWidth, currentHeight);
  }

  /**
   * 绘制配件编号
   */
  drawPart() {
    if (this.hoveredPart) {
      this.drawPartWithStyle(this.hoveredPart, '#ffa366', '#fff');
    }

    if (this.selectedPart) {
      this.drawPartWithStyle(this.selectedPart, '#ff6600', '#fff');
    }
  }

  /**
   * 绘制配件编号
   * @param {Object} part 配件
   * @param {String} bgColor 背景色
   * @param {String} fontColor 字体颜色
   */
  drawPartWithStyle(part, bgColor, fontColor) {
    if (!part.coordinates || this.error || !this.imageInfo) {
      return;
    }

    const { scale, pos } = this.imageInfo;

    for (const c of part.coordinates) {
      const x = c.x * this.dpi;
      const y = c.y * this.dpi;
      const w = c.w * this.dpi;
      const h = c.h * this.dpi;

      // const { x, y, w, h } = c;

      const scaledRect = new Rectangle(new Point(x * scale, y * scale), w * scale, h * scale);

      this.ctx.fillStyle = bgColor;
      this.ctx.fillRoundRect(scaledRect.x + pos.x, scaledRect.y + pos.y, scaledRect.width, scaledRect.height, scaledRect.height / 5);

      this.ctx.font = `normal ${Math.floor(scaledRect.height * 0.8)}px Arial`;
      this.ctx.fillStyle = fontColor;
      const text = this.ctx.measureText(part.partRefOnImage);
      this.ctx.fillText(part.partRefOnImage, scaledRect.x + pos.x + (scaledRect.width - text.width) / 2, scaledRect.y + pos.y + scaledRect.height * 0.8);
    }
  }

  /**
   * 清空 canvas
   */
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * 放大
   * @param {Point} center 放大的基准点
   */
  zoomIn(center) {
    if (this.error) {
      return;
    }

    this.imageInfo.level = Math.min(this.imageInfo.level + 1, 9);
    const newScale = this.getNewScale(this.imageInfo.level);

    this.zoom(center, newScale);
  }

  /**
   * 缩小
   * @param {Point} center 缩小的基准点
   */
  zoomOut(center) {
    if (this.error) {
      return;
    }

    this.imageInfo.level = Math.max(this.imageInfo.level - 1, 0);
    const newScale = this.getNewScale(this.imageInfo.level);

    this.zoom(center, newScale);
  }

  /**
   * 重置缩放比到 100%
   */
  reset() {
    this.initImageInfo();

    this.drawImage(0, 0);

    this.drawPart();
  }

  /**
   * 缩放图片
   * @param {Point} center 放大的基准点
   * @param {Number} newScale 新的缩放比
   */
  zoom(center, newScale) {
    const scaleRate = newScale / this.imageInfo.scale;

    // 默认以 canvas 的中心点为缩放基准点
    center = center || new Point(this.canvas.width / 2, this.canvas.height / 2);

    // 1. 设 缩放基准点的坐标为 C ，缩放前图片坐标为 P0
    // 2. 设 缩放前后的缩放倍率分别为 S0 和 S1
    // 3. 则 缩放前 基准点 相对于 图片左上角 的坐标为 I0 = C - P0;
    // 4. 设 缩放后 I0 变为 I1 ，则 I1 = I0 * (S1 / S0)
    // 5. 则 缩放后的图片坐标 P1 = C - I1
    // 综上，P1 = C - (C - P0) * (S1 / S0)
    this.imageInfo.pos = center.subPoint(center.subPoint(this.imageInfo.pos, false).multi(scaleRate));

    // 更新图片参数
    this.imageInfo.scale = newScale;
    this.imageInfo.currentHeight = this.imageInfo.naturalHeight * newScale;
    this.imageInfo.currentWidth = this.imageInfo.naturalWidth * newScale;

    // 更新图片的移动范围
    this.updateOverflow();

    // 绘制图片
    this.drawImage();

    // 绘制配件编号
    this.drawPart();
  }

  /**
   * 获取缩放比
   * @param {Number} level 缩放层次
   * @return {Number} 缩放比
   */
  getNewScale(level) {
    const scales = [100, 110, 125, 150, 175, 200, 250, 300, 400, 500];

    return (this.imageInfo.minScale * scales[level]) / 100;
  }

  moveToSelectedPoint() {
    if (!this.selectedPart.coordinates || !this.selectedPart.coordinates.length || this.error) {
      return;
    }

    // 1. 取消正在进行的动画
    window.cancelAnimationFrame(this.animeId);

    // 2. 当前中心点的坐标为 center
    const center = new Point(this.canvas.width / 2, this.canvas.height / 2);

    const { scale, pos } = this.imageInfo;

    let distance = Infinity;
    let closest = null;

    // 3. 计算所有配件坐标，并取距离中心点最近的点
    for (const c of this.selectedPart.coordinates) {
      const x = c.x * this.dpi;
      const y = c.y * this.dpi;
      const w = c.w * this.dpi;
      const h = c.h * this.dpi;

      const pointByImage = new Point(x * scale, y * scale);

      const pointByCanvas = pointByImage.addPoint(pos, false);

      const newDistance = pointByCanvas.distance(center);

      if (newDistance < distance) {
        distance = newDistance;
        closest = new Rectangle(pointByCanvas, w * scale, h * scale);
      }
    }

    if (!closest) {
      return;
    }

    // 4. 如果该点在可视范围外，则移动图片使其所属的方块呈现在可视范围内。
    const visibleRect = new Rectangle(new Point(0, 0), this.canvas.width, this.canvas.height);
    const farest = closest.farest(center);
    if (!visibleRect.contains(farest).res) {
      const target = closest.center();

      this.imageInfo.oldPos = this.imageInfo.pos;
      this.imageInfo.newPos = this.imageInfo.pos.addPoint(center.subPoint(target, false), false);

      this.animeTime = 0;
      this.animeId = window.requestAnimationFrame(this.step.bind(this));
    } else {
      this.drawImage();
      this.drawPart();
    }
  }

  step(timestamp) {
    this.animeTime = this.animeTime || timestamp;

    if (timestamp - this.animeTime < 8e2) {
      const f = BezierEasing.easeInOutCubic((timestamp - this.animeTime) / 8e2);
      const nextX = f * (this.imageInfo.newPos.x - this.imageInfo.oldPos.x) + this.imageInfo.oldPos.x;
      const nextY = f * (this.imageInfo.newPos.y - this.imageInfo.oldPos.y) + this.imageInfo.oldPos.y;

      this.imageInfo.pos = new Point(nextX, nextY);
      this.drawImage();
      this.drawPart();

      this.animeId = window.requestAnimationFrame(this.step.bind(this));
    } else {
      this.animeTime = 0;
    }
  }
}

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(deltaX, deltaY, self = true) {
    if (self) {
      this.x += deltaX;
      this.y += deltaY;
      return this;
    }

    return new Point(this.x + deltaX, this.y + deltaY);
  }

  addPoint(point, self = true) {
    if (self) {
      this.x += point.x;
      this.y += point.y;
      return this;
    }

    return new Point(this.x + point.x, this.y + point.y);
  }

  sub(deltaX, deltaY, self = true) {
    if (self) {
      this.x -= deltaX;
      this.y -= deltaY;
      return this;
    }

    return new Point(this.x - deltaX, this.y - deltaY);
  }

  subPoint(point, self = true) {
    if (self) {
      this.x -= point.x;
      this.y -= point.y;
      return this;
    }

    return new Point(this.x - point.x, this.y - point.y);
  }

  multi(factor) {
    this.x *= factor;
    this.y *= factor;
    return this;
  }

  distance(point) {
    return (Math.abs(this.x - point.x) ** 2 + Math.abs(this.y - point.y) ** 2) ** 0.5;
  }
}

class Rectangle {
  constructor(point, width, height) {
    if (width < 0) {
      point.x += width;
    }

    if (height < 0) {
      point.y += height;
    }

    this.x = point.x;
    this.y = point.y;
    this.width = Math.abs(width);
    this.height = Math.abs(height);
  }

  contains(point) {
    const { x, y } = point;

    let posOnX = NaN,
      posOnY = NaN;

    if (x < this.x) {
      posOnX = -1;
    } else if (x > this.x + this.width) {
      posOnX = 1;
    } else {
      posOnX = 0;
    }

    if (y < this.y) {
      posOnY = -1;
    } else if (y > this.y + this.height) {
      posOnY = 1;
    } else {
      posOnY = 0;
    }

    return {
      res: posOnX === 0 && posOnY === 0,
      posOnX,
      posOnY,
    };
  }

  allPoint() {
    const lt = new Point(this.x, this.y);
    const rt = new Point(this.x + this.width, this.y);
    const rb = new Point(this.x + this.width, this.y + this.height);
    const lb = new Point(this.x, this.y + this.height);

    return [lt, rt, rb, lb];
  }

  center() {
    return new Point(this.x + this.width / 2, this.y + this.height / 2);
  }

  farest(point) {
    let distance = 0;
    let res = null;

    const points = this.allPoint();

    for (const p of points) {
      const newDistance = p.distance(point);

      if (newDistance > distance) {
        distance = newDistance;
        res = p;
      }
    }

    return res;
  }
}

const getImageViewer = (canvas, imageSrc, data, opt) => new ImageViewer(canvas, imageSrc, data, opt);

export { getImageViewer };
