<template>
  <div>
    <div v-if="loading">
      <Loading />
    </div>
    <div v-else id="container">
      <div class="header">
        <div class="header-title">
          Today's Cryptocurrency Prices
        </div>
        <div class="watch-search-subheader">
          <div class="watch-list-container">
            <div class="">
              <i v-if="!watchListFilter" class="fa-regular fa-star watch-list-icon"> </i>
              <i v-if="watchListFilter" class="fa-solid fa-star watch-list-icon watch-list-icon-fill"></i>
            </div>
            <div class="watch-list-text" :class="{ 'watch-list-filter' : watchListFilter}" @click="getWatchlist()">
              Watchlist
            </div>
            <div>
              <i v-if="watchListFilter" class="fa-solid fa-xmark watch-list-filter-icon" @click="getWatchlist()"></i>
            </div>
          </div>
          <div class="search-contaner">
            <span class="search-text">
              Search
            </span>
            <input v-model="search" placeholder="Search for crypto assets" />
          </div>
        </div>
      </div>
      <div id="table-container">
        <table class="table table-striped">
          <colgroup>
            <col style="width:7%">
            <col style="width:7%">
            <col style="width:10%">
            <col style="width:8%">
            <col style="width:9%">
            <col style="width:14%">
            <col style="width:13%">
            <col style="width:7%">
            <col style="width:7%">
            <col style="width:7%">
            <col style="width:9%">
          </colgroup>
          <thead>
            <tr>
              <th id="table-header" v-for="(header, index) in headers" :key="header" @click="sortCol(index)">
                <span class="header-text">{{ header }} </span>
                <i v-if="sortNum === 0 && index === headerSort" class="fa-solid fa-caret-up sort"></i>
                <i v-if="sortNum === 1 && index === headerSort" class="fa-solid fa-caret-down sort"></i>
              </th>
              <th>Watchlist</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in filteredArray" :key="index">
              <td class="rankCol">{{ item['rank'] +1 }}</td>
              <td>
                <img :src="item['icon']" />
              </td>
              <td>
                <router-link :to="{
                  name: 'single',
                  params: {
                    cryptoAsset: item['id'].toLowerCase().replace(/\s/g, '-'),
                  },
                }">
                  {{ item["name"] }}
                </router-link>
              </td>
              <td>{{ item['symbol'] }}</td>
              <td>{{ formatPrice(item['price']) }}</td>
              <td>{{ formatPrice(item['marketCap']) }}</td>
              <td>{{ formatPrice(item['volume']) }}</td>
              <td>{{ formatPercent(item['priceChange1h']) }}</td>
              <td>{{ formatPercent(item['priceChange1d']) }}</td>
              <td>{{ formatPercent(item['priceChange1w']) }}</td>
              <td>
                <div id="heart-animation" :class="{ animate: getWatchlistGetter().includes(item['symbol']) }"
                  @click="addToWatchlist(item['symbol'])"></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <Footer v-model="itemsPerPage" :paginationArray="paginationArray" :pages="pages" :currentPage="currentPage"
          @changePage="change" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Loading from "@/components/Loading.vue";
import Footer from "@/components/Footer.vue";
import "bootstrap/dist/css/bootstrap.min.css";
import formatMixin from "@/mixins/formatMixin";
import { sortBy } from "lodash";

export default {
  name: "CryptoTable",
  components: {
    Loading,
    Footer
  },
  mixins: [formatMixin],
  props: {},
  data() {
    return {
      headers: ["Rank", "Icon", "Name", "Symbol", "Price", "Market Cap", "Volume", "1h %", "24h %", "7d %",],
      headerFields: ["rank", "icon", "name", "symbol", "price", "marketCap", "volume", "priceChange1h", "priceChange1d", "priceChange1w",],
      sortNum: null,
      sortOrder: "",
      array: [],
      arrayAllLength: null,
      headerSort: "",
      loading: false,
      watchListFilter: false,
      paginationArray: [],
      itemsPerPage: 10,
      currentPage: 0,
      search: "",
    };
  },
  computed: {
    pages() {
      return Math.ceil((this.array.length / this.itemsPerPage));
    },
    filteredArray() {
      return this.array.slice((this.currentPage * this.itemsPerPage), ((this.currentPage + 1) * this.itemsPerPage));
    },
    colSortName() {
      switch (this.headerSort) {
        case 0:
          return "rank";
        case 1:
          return "icon";
        case 2:
          return "name";
        case 3:
          return "symbol";
        case 4:
          return "price";
        case 5:
          return "symbol";
        case 5:
          return "marketCap";
        case 6:
          return "volume";
        case 7:
          return "priceChange1h";
        case 8:
          return "priceChange1d";
        case 9:
          return "priceChange1w";
        default:
          return {};
      }
    },
  },
  methods: {
    ...mapActions(["setAllCryptoLengthAction", "getAllCryptosAction", "addWatchlistAction", "removeWatchlistAction"]),
    ...mapGetters(["getAllCryptosGetter", "getAllCryptosGetter", "getWatchlistGetter"]),
    change(page) {
      this.currentPage = page;
    },
    sortCol(col) {
      //2nd icon col should not be sorted
      if (col === 1) return;
      this.sortNum = (this.sortNum + 1) % 2;
      this.headerSort = col;
      this.sortOrder = this.sortNum === 0 ? "asc" : this.sortNum === 1 ? "desc" : "";
      this.array = _.orderBy(this.array, this.colSortName, this.sortOrder);
    },
    addToWatchlist(symbol) {
      if (!this.getWatchlistGetter().includes(symbol)) {
        this.addWatchlistAction(symbol);
      } else {
        this.removeWatchlistAction(symbol);
      }
    },
    async getWatchlist() {
      if (!this.watchListFilter) {
        this.search = "";
        this.array = this.array.filter(asset => this.getWatchlistGetter().includes(asset["symbol"]));
        this.watchListFilter = !this.watchListFilter;
      }
      else {
        this.search = "";
        this.watchListFilter = !this.watchListFilter;
        this.loading = true;
        await this.getAllCryptos();
        this.loading = false;
      }
      this.currentPage = 0;
      this.paginationArray = Array.from({ length: this.pages }, (_, i) => i + 1)

    },
    async getAllCryptos() {
      await this.getAllCryptosAction();
      this.array = await this.getAllCryptosGetter();
      this.setAllCryptoLengthAction(this.array.length);
    },
  },
  watch: {
    itemsPerPage() {
      this.currentPage = 0;
      this.paginationArray = Array.from({ length: this.pages }, (_, i) => i + 1)
    },
    async search() {
      const entireArray = await this.getAllCryptosGetter();
      if (this.watchListFilter) {
        const watchlistArray = entireArray.filter(asset => this.getWatchlistGetter().includes(asset["symbol"]))
        this.array = watchlistArray.filter(e => { return e.name.toLowerCase().includes(this.search.toLowerCase()) });
      }
      else {
        this.array = entireArray.filter(e => { return e.name.toLowerCase().includes(this.search.toLowerCase()) });
      }

      this.currentPage = 0;
      this.itemsPerPage = 20;
      this.paginationArray = Array.from({ length: this.pages }, (_, i) => i + 1);
    },
  },
  async created() {
    this.loading = true;
    await this.getAllCryptos();

    this.loading = false;
    this.paginationArray = Array.from({ length: this.pages }, (_, i) => i + 1)
  },
};
</script>

<style scoped>
#container {
  padding: 50px 70px;
}

.header {
  display: flex;
  grid-gap: 40px;
  margin-bottom: 30px;
  justify-content: space-between;
}

.header-title {
  font-size: 2.5em;
  font-weight: 700;
  line-height: 34px;
}

/* subheader css*/
.watch-search-subheader {
  display: flex;
  align-items: center;
  grid-gap: 20px;
  padding-top: 5px;
}

/*search css */
.search-contaner {
  display: flex;
  align-items: center;
  grid-gap: 10px;
}

.search-text {
  font-size: 15px;
}

.search-contaner input {
  background-color: rgb(239, 242, 245);
  border: 1.3px solid rgb(166, 176, 195);
  border-radius: 4px;
  padding: 4px 25px;
  background: url("@/assets/search-icon.png") no-repeat left;
  background-size: 15px;
  background-position: 7px 8px;
  background-color: #FDFDFD;
}

/*table list css  */

#table-container {
  margin-top: 10px;
  display: flex;
}

table {
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
}

table img {
  width: 40px;
  height: 40px
}

table {
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
}

thead {
  background-color: #333;
  color: white;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 12%;
}

td,
th {
  font-size: 0.85rem;
}

tr {
  vertical-align: middle;
}

.rankCol {
  padding-left: 1.5rem;
}

.sort:hover,
.header-text {
  cursor: pointer;
  margin-right: 5px;
}

/*watch list css  */
.watch-list-icon {
  margin-right: 5px;
}

.watch-list-icon-fill {
  color: goldenrod;
}

.watch-list-container {
  display: flex;
  align-items: center;
}

.watch-list-filter {
  padding: 1px 10px;
  background-color: #ebebeb;
  border-radius: 5px;
}

.watch-list-filter-icon {
  margin-left: 10px;
  margin-top: 7px;
}

.watch-list-filter-icon:hover {
  cursor: pointer;
}

.watch-list-text {
  margin-top: 3px;
}

.watch-list-text:hover {
  text-decoration: underline;
  cursor: pointer;
}

#heart-animation {
  padding-top: 2em;
  background-image: url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/66955/web_heart_animation.png");
  background-repeat: no-repeat;
  background-size: 2900%;
  background-position: left;
  height: 50px;
  width: 50px;
  margin: 0 auto;
  cursor: pointer;
}

.animate {
  animation: heart-burst 0.8s steps(28) forwards;
}

@keyframes heart-burst {
  0% {
    background-position: left;
  }

  100% {
    background-position: right;
  }
}

/* select dropdown css*/


@media (max-width: 1111px) {
  .header-title {
    text-align: center;
  }

  #table-container {
    overflow-x: auto;
  }

  table {
    width: 80%;
    table-layout: auto;
  }

  th,
  td {
    padding: 8px;
  }
}

@media (max-width: 850px) {
  .header {
    flex-direction: column;
    grid-gap: 10px;
  }
  .watch-search-subheader {
    flex-direction: column;
    grid-gap: 10px;
  }
}
</style>