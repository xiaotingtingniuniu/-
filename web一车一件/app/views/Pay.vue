<template>
  <section class="page-pay">
    <header class="pay_header">
      <navigation />
    </header>
    <main class="pay_main">
      <div class="title">
        <span class="left_strip" />
        <span class="title_word">选择您想要的会员套餐进行购买</span>
        <span class="right_strip" />
      </div>
      <div class="edition_box">
        <div class="edition">
          <div class="edition_title">免费版</div>
          <div class="edition_price_box">
            <div class="edition_price">0</div>
            <div class="edition_wrod">元</div>
          </div>
          <div class="orgin_price" style="visibility:hidden;">原价0元/年</div>
          <div class="edition_button_free">免费</div>
          <div class="edition_describe">
            <div class="vin">
              VIN 查询 5次/天
            </div>
            <div class="oe">
              配件查询 30个/天（*5）
            </div>
            <div class="online_service">
              <div>
                在线客服
              </div>
              <div>
                9:00-18:00（周一至周五）
              </div>
            </div>
            <div class="phone_service">
              <div>
                电话客服
              </div>
              <div>
                无
              </div>
            </div>
          </div>
        </div>
        <div class="edition" style="margin-left:20px;">
          <div class="edition_title">个人版</div>
          <div class="edition_price_box">
            <div class="edition_price">288</div>
            <div class="edition_wrod">元/年</div>
          </div>
          <div class="orgin_price">原价 600 元/年</div>
          <button v-if="productInfo.indexOf('individual') ==-1" class="edition_button" :class="{disabled:productInfo.indexOf('individual') ==-1}" :disabled="productInfo.indexOf('individual') ==-1" @click="goPay('individual')">已购买/已包含</button>
          <button v-else class="edition_button" :class="{disabled:productInfo.indexOf('individual') ==-1}" :disabled="productInfo.indexOf('individual') ==-1" @click="goPay('individual')">立即购买</button>
          <div class="edition_describe">
            <div class="vin">
              VIN 查询 10次/天
            </div>
            <div class="oe">
              配件查询 50个/天（*10）
            </div>
            <div class="online_service">
              <div>
                在线客服
              </div>
              <div>
                8:30-21:00（周一至周日）
              </div>
            </div>
            <div class="phone_service">
              <div>
                电话客服
              </div>
              <div>
                8:30-21:00（周一至周日）
              </div>
            </div>
          </div>
        </div>
        <div class="edition" style="margin-left:20px;">
          <div class="edition_title">标准版</div>
          <div class="edition_price_box">
            <div class="edition_price">660</div>
            <div class="edition_wrod">元/年</div>
          </div>
          <div class="orgin_price">原价 880 元/年</div>
          <button v-if="productInfo.indexOf('standard') ==-1" class="edition_button" :class="{disabled:productInfo.indexOf('standard') ==-1}" :disabled="productInfo.indexOf('standard') ==-1" @click="goPay('standard')">已购买/已包含</button>
          <button v-else class="edition_button" :class="{disabled:productInfo.indexOf('standard') ==-1}" :disabled="productInfo.indexOf('standard') ==-1" @click="goPay('standard')">立即购买</button>
          <div class="edition_describe">
            <div class="vin">
              VIN 查询 20次/天
            </div>
            <div class="oe">
              配件查询 100个/天（*20）
            </div>
            <div class="online_service">
              <div>
                在线客服
              </div>
              <div>
                8:30-21:00（周一至周日）
              </div>
            </div>
            <div class="phone_service">
              <div>
                电话客服
              </div>
              <div>
                8:30-21:00（周一至周日）
              </div>
            </div>
          </div>
        </div>
        <div class="edition" style="margin-left:20px;">
          <div class="edition_title">专业版</div>
          <div class="edition_price_box">
            <div class="edition_price">2000</div>
            <div class="edition_wrod">元/年</div>
          </div>
          <div class="orgin_price">原价 3600 元/年</div>
          <button v-if="productInfo.indexOf('professional') ==-1" class="edition_button" :class="{disabled:productInfo.indexOf('professional') ==-1}" :disabled="productInfo.indexOf('professional') ==-1" @click="goPay('professional')">已购买/已包含</button>
          <button v-else class="edition_button" :class="{disabled:productInfo.indexOf('professional') ==-1}" :disabled="productInfo.indexOf('professional') ==-1" @click="goPay('professional')">立即购买</button>
          <div class="edition_describe">
            <div class="vin">
              VIN 查询 不限
            </div>
            <div class="oe">
              配件查询 不限
            </div>
            <div class="online_service">
              <div>
                在线客服
              </div>
              <div>
                8:30-21:00（周一至周日）
              </div>
            </div>
            <div class="phone_service">
              <div>
                电话客服
              </div>
              <div>
                8:30-21:00（周一至周日）
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="foot">
        <span>
          目前仅支持支付宝，支付成功 5-10 分钟后新权益生效，如有咨询/退款/权益未生效等相关问题，请联系在线客服或拨打
        </span>
        <span class="phone">
          400-008-2128
        </span>
        <span>
          客服电话
        </span>
      </div>
    </main>
  </section>
</template>

<script>
import Navigation from '../components/Navigation.vue';
import { mapActions, mapState } from 'vuex';
export default {
  components: {
    Navigation,
  },
  computed: {
    ...mapState('payment', ['productInfo']),
  },
  created() {
    this.getProducts({});
  },
  methods: {
    ...mapActions('payment', ['getProducts', 'pay']),
    /** 立即支付按钮 */
    goPay(params) {
      console.log('params', params);
      this.pay({ productNumber:params });
    },
  },
};
</script>

<style lang="scss">
.page-pay {
  .pay-button,
  .part_list {
    display: none;
  }
}
</style>

<style lang="scss" scoped>
.page-pay {
  .pay_header {
    z-index: 5;
    width: 100%;
    position: fixed;
    top: 0;
  }

  .pay_main {
    height: calc(100vh - 60px);
    padding-top: 60px;
    overflow-y: auto;
    background-color: #f5f6f7;

    .title {
      display: flex;
      justify-content: center;
      padding-top:40px;
      margin-bottom: 30px;

      .left_strip{
        width:123px;
        background-image: url('../images/left_strip.png');
        background-repeat: no-repeat;
        background-position-y: 50%;
      }

      .right_strip{
        width:123px;
        background-image: url('../images/right_strip.png');
        background-repeat: no-repeat;
        background-position-y: 50%;
      }

      .title_word {
        font-size: 18px;
        color: #80684b;
        margin-left:20px;
        margin-right:20px;
      }
    }

    .edition_box {
      display: flex;
      justify-content: center;

      .edition {
        background: #ffffff;
        background: #FFFFFF;
        box-shadow: 0 4px 8px 0 rgba(0,0,0,0.06);
        border-radius: 4px;
        width:240px;
        height:460px;
        box-sizing: border-box;

        .edition_title {
          height: 64px;
          background-image: url('../images/edition_title.png');
          text-align: center;
          font-size: 18px;
          line-height: 64px;
          color: #80684b;
        }

        .edition_price_box {
          text-align: center;
          margin-top: 24px;

          .edition_price {
            font-family: Arial-Black;
            font-size: 40px;
            color: #75470e;
            line-height: 56px;
            font-weight: 600;
          }

          .edition_wrod {
            font-size: 14px;
            color: #616366;
            line-height: 20px;
          }
        }

        .edition_button_free {
          margin-top: 40px;
          margin:0 auto;
          margin-bottom:27px;
          text-align: center;
          font-size: 12px;
          color: #616366;
          margin-top:12px;
          width:200px;
          height:32px;
          line-height: 32px;
        }

        .edition_describe{
          padding:0px 30px 50px;
          font-size: 12px;
          color: #616366;

          .vin,.oe,.online_service{
            line-height: 17px;
            margin-bottom:16px;
          }
        }

        .orgin_price{
          text-align: center;
          margin-top:4px;
          text-decoration:line-through;
          color:#919599;
        }

        .edition_button{
          display: block;
          margin:0 auto;
          margin-bottom:27px;
          text-align: center;
          font-size: 12px;
          color: #616366;
          margin-top:12px;
          width:200px;
          height:32px;
          line-height: 32px;
          background-image: linear-gradient(180deg, #CF9C36 0%, #A16319 100%);
          border-radius: 4px;
          font-size: 14px;
          color: #FFFFFF;
          padding:0;
        }

        .edition_button:hover{
          background-image: linear-gradient(180deg, #D9A948 0%, #B37020 100%);
        }

        .edition_button.disabled:hover{
          background-image: linear-gradient(180deg, #CF9C36 0%, #A16319 100%);
        }

        .edition_button.disabled{
          opacity: 0.5;
        }
      }

      .edition:hover{
        border: 1px solid #A16319;
        cursor: pointer;
      }
    }

    .foot{
      display: flex;
      justify-content: center;
      top:531px;
      font-size: 12px;
      color: #919599;
      line-height: 17px;
      margin-top:30px;
      padding-bottom:30px;

      .phone{
        color: #1890FF;
      }
    }
  }
}
</style>
