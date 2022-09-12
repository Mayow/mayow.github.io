<template>
  <div class="container">
    <div v-if="loading">
      <Loading />
    </div>
    <div v-else-if="(!loading && (this.cryptoAssetDetails.length > 0))">
      <div class="detail-header">
        <div class="detail-header-asset">
          <img :src="iconURL" />
          <div>
            {{ formatCapitalizeFirstLetter(cryptoAsset) }}
          </div>

        </div>
        <div class="detail-header-price">
          <div>{{ formatPrice(cryptoAssetDetails[0].price) }} </div>
          <div class="detail-header-exchange">Exchange: {{ cryptoAssetDetails[0].exchange}} </div>
        </div>
      </div>
      <div class="grid-layout">
        <div v-for="(exchange, index) in cryptoAssetDetails" :key='index'>
          <div class="price-item-layout">
            <div class="price-item-layout-col">
              <div>
                <span class="detail-info">Price: </span> {{ formatPrice(exchange.price) }}
              </div>
              <div>
                <span class="detail-info">Volume: </span> {{ formatPrice(exchange.volume) }}
              </div>
            </div>
            <div class="price-item-layout-col">
              <div>
                <span class="detail-info">Exchange: </span> {{ exchange.exchange }}
              </div>
              <div>
                <span class="detail-info">Pair: </span> {{ exchange.pair }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Loading from "@/components/Loading.vue";
import formatMixin from "@/mixins/formatMixin";
import router from '@/router/index'

export default {
  name: "CryptoDetails",
  components: {
    Loading
  },
  props: {
    cryptoAsset: {
      type: String,
      required: true
    },
  },
  mixins: [formatMixin],
  data() {
    return {
      cryptoAssetDetails: null,
      iconURL: ""
    };
  },
  computed: {
    loading() {
      return this.cryptoAssetDetails === null;
    }
  },
  methods: {
    ...mapActions(["getAllCryptosAction", "getCryptoAction"]),
    ...mapGetters(["getCryptoGetter", "getCryptoIconGetter"]),

    async getCryptoAsset() {
      await this.getAllCryptosAction();
      await this.getCryptoAction(this.cryptoAsset);
      const details = this.getCryptoGetter();

      this.iconURL = await this.$store.getters.getCryptoIconGetter(this.cryptoAsset)

      if (details.length === 0) {
        window.location.href = "/crypto-not-found";
      }
      return details;
    },
  },
  async created() {
    const cryptoAsset = this.cryptoAsset.toLowerCase();

    /*the api call can only accept lowercase words 
    so when there is any capital letters in the crypto url slug, it redirects it
     example -> '/assets/biTcoIN' gets redirected to '/assets/bitcoin'*/
    if (cryptoAsset != this.cryptoAsset) {
      router.push({ path: `/asset/${this.cryptoAsset.toLowerCase()}` });
    }

    this.cryptoAssetDetails = await this.getCryptoAsset();
  },

};
</script>

<style scoped>
.container {
  padding: 0px 40px;
}

.detail-header {
  display: flex;
  font-size: 30px;
  margin: 20px 0px;
  height: 70px;
  align-items: center;
}

.detail-header-asset {
  font-size: 35px;
  display: flex;
  grid-gap: 10px;
}

.detail-header-asset>img {
  margin-top: 2px;
  width: 50px;
  height: 50px
}

.detail-header-price {
  font-size: 25px;
  margin-left: auto;
  display: flex;
  flex-direction: column;
  text-align: right;
}

.detail-header-exchange {
  font-size: 12px;
}

.detail-info {
  font-weight: bolder;
  align-content: space-between;
}

.grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  justify-content: space-between;
  grid-gap: 30px;
}

.price-item-layout>div {
  margin-top: 5px;
}

.price-item-layout {
  display: flex;
  align-content: center;
  background-color: #ededed;
  margin-bottom: 10px;
  padding: 20px 20px;
  border: .5px solid #a9a9a9;
  border-radius: 10px;
  grid-gap: 30px;
  height: 120px;
}

.price-item-layout-col {
  justify-content: space-between;
  display: flex;
  flex-direction: column;
}

.price-item-layout:hover {
  box-shadow: 7px 7px 15px #888;
}
</style>
