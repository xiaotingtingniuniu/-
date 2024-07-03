<template>
  <section class="user-derogation">
    <header>
      <span>我的减损金额</span>
    </header>
    <main ref="chart" />
  </section>
</template>

<script>
import ECharts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import { mapState } from 'vuex';

import { getChromeVersion } from '../utils/browser';

const LINE_COLOR = '#e6ecf2';
const TITLE_COLOR = '#303233';
const AXIS_LABEL_COLOR = '#919599';
const ITEM_COLOR = '#ffad75';
const ITEM_BORDER_COLOR = 'rgba(255, 173, 117, 0.3)';
const ANIMATION_DURATION = 0;

export default {
  data: () => ({
    myChart: null,
  }),
  computed: {
    ...mapState('user', ['derogationList', 'sevenDayDerogation']),
    chromeVersion() {
      const cv = getChromeVersion();
      return cv > 0 && cv < 50;
    },
    options() {
      return {
        title: {
          text: `近7天共减损：${this.sevenDayDerogation}元`,
          textStyle: {
            color: TITLE_COLOR,
            fontSize: 14,
            fontWeight: 'normal',
          },
          left: 'right',
          padding: [20, 17, 0, 0],
        },
        grid: {
          containLabel: true,
          left: this.chromeVersion <= 49 ? 5 : 0,
          top: 60,
          right: 18,
          bottom: 0,
        },
        xAxis: {
          type: 'time',
          splitNumber: 7,
          axisLine: {
            lineStyle: {
              color: LINE_COLOR,
            },
          },
          splitLine: {
            lineStyle: {
              color: LINE_COLOR,
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: AXIS_LABEL_COLOR,
            formatter: value => {
              const date = new Date(value);
              const texts = [date.getMonth() + 1, date.getDate()];
              return texts.join('.');
            },
          },
        },
        yAxis: {
          type: 'value',
          name: '减损金额（元）',
          nameTextStyle: {
            color: AXIS_LABEL_COLOR,
            padding: [0, 0, 0, 50],
          },
          nameGap: 24,
          axisLine: {
            lineStyle: {
              color: LINE_COLOR,
            },
          },
          splitLine: {
            lineStyle: {
              color: LINE_COLOR,
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: AXIS_LABEL_COLOR,
            formatter: value => String(value).replace(/,/g, ''),
          },
        },
        tooltip: {
          position: 'top',
          enterable: true,
          transitionDuration: 0.5,
          backgroundColor: 'transparent',
          padding: 0,
          textStyle: {
            color: '#ff6700',
            fontSize: 12,
            lineHeight: 12,
          },
          extraCssText: 'border-radius: 100px;',
          formatter: ({ value }) => {
            const text = String(value).split(',')[1] + '元';

            const inner = document.createElement('div');
            inner.className = 'tooltip_inner';

            const textNode = document.createElement('div');
            textNode.innerText = text;

            const arrow = document.createElement('div');
            arrow.className = 'tooltip_arrow';

            inner.appendChild(textNode);
            inner.appendChild(arrow);

            return inner.outerHTML;
          },
        },
        series: [
          {
            data: this.derogationList,
            type: 'line',
            symbol: 'circle',
            symbolSize: 8,
            hoverAnimation: false,
            emphasis: {
              itemStyle: {
                color: ITEM_COLOR,
                borderColor: ITEM_BORDER_COLOR,
                borderWidth: 6,
              },
            },
            animationDuration: ANIMATION_DURATION,
          },
        ],
        color: [ITEM_COLOR],
      };
    },
  },
  watch: {
    derogationList() {
      this.initChart();
    },
  },
  mounted() {
    this.initChart();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    initChart() {
      if (!this.myChart) {
        this.myChart = ECharts.init(this.$refs.chart);
        window.addEventListener('resize', this.handleResize);
      }
      this.myChart.setOption(this.options);
    },
    handleResize() {
      this.myChart.resize();
    },
  },
};
</script>

<style lang="scss" scoped>
.user-derogation {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 377px;
  padding: 30px;
  background-color: white;

  header {
    color: #303233;
    font-size: 18px;
    line-height: 1;
    display: flex;
    align-items: center;
  }

  main {
    height: 100%;
    width: 100%;

    /deep/.tooltip_inner {
      padding: 5px 10px;
      border-radius: 100px;
      margin-bottom: 7px;
      background-color: #fdf2eb;
      color: $--color-main;
      white-space: nowrap;
    }

    /deep/.tooltip_arrow {
      border-top: 5px solid rgb(253, 242, 235);
      border-right: 5px solid transparent;
      border-left: 5px solid transparent;
      border-bottom: 5px solid transparent;
      background-color: transparent;
      position: absolute;
      top: calc(100% - 7px);
      left: calc(50% - 5px);
    }
  }
}
</style>
