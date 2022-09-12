import { createStore } from 'vuex'
import CryptoApiService from '@/services/CryptoApiService';
import formatMixin from "@/mixins/formatMixin";

export default createStore({
    state: {
        allCryptosStore: [],
        cryptoStore: [],
        allCryptoLengthStore: null,
        newsTrendingStore: [],
        newsLatestStore: [],
        watchlistStore: [],
    },
    getters: {
        getAllCryptosGetter: (state) => {
            return state.allCryptosStore;
        },
        getCryptoGetter: (state) => {
            return state.cryptoStore;
        },
        getAllCryptoLengthGetter: (state) => {
            return state.allCryptoLengthStore;
        },
        getCryptoIconGetter: (state) => (crypto) => {
            return state.allCryptosStore.filter((asset) => {
                return asset.id === crypto;
            })[0].icon
        },
        getNewsTrendingGetter: (state) => {
            return state.newsTrendingStore;
        },
        getNewsLatestGetter: (state) => {
            return state.newsLatestStore;
        },
        getWatchlistGetter: (state) => {
            return state.watchlistStore;
        },
    },
    mutations: {
        getAllCryptosMutation: (state, allCryptosArray) => {
            //these are strange crypto assets that are sent from the api which should be removed
            const invalidCryptos = ['f6-sOHM', 'FRAX3CRV-f', 'G-UNI']
            const filteredArray = allCryptosArray.filter(e => { return !invalidCryptos.includes(e.symbol) });

            //adds a watched property for the watchlist functionality and 
            //fixes the index position of each crypto asset due to the two lines above
            const watchedArray = filteredArray.map((e, index) => ({...e,
                'watch': false,
                'rank': index
            }));
            state.allCryptosStore = watchedArray;
        },
        getCryptoMutation: (state, cryptoArray) => {
            const response = cryptoArray.splice(0, 30).sort((a, b) => { return b.volume - a.volume; });
            state.cryptoStore = response;
        },
        setAllCryptoLengthAction: (state, length) => {
            state.allCryptoLengthStore = length;
        },
        getNewsTrendingMutation: (state, newsArray) => {
            state.newsTrendingStore = newsArray;
        },
        getNewsLatestMutation: (state, newsArray) => {
            state.newsLatestStore = newsArray;
        },
        addWatchlistMutation: (state, symbol) => {
            state.allCryptosStore.map((asset) => {
                if (symbol === asset["symbol"]) {
                    asset["watch"] = !asset["watch"];
                }
            });
            state.watchlistStore.push(symbol);
        },
        removeWatchlistMutation: (state, symbol) => {
            const position = state.watchlistStore.indexOf(symbol);
            state.watchlistStore.splice(position, 1);
        }
    },
    actions: {
        async getAllCryptosAction(state) {
            const response = await CryptoApiService.getAllCryptos();
            state.commit('getAllCryptosMutation', response.data.coins);
        },
        async getCryptoAction(state, crypto) {
            const response = await CryptoApiService.getCrypto(crypto);
            state.commit('getCryptoMutation', response.data);
        },
        setAllCryptoLengthAction(state, length) {
            state.commit('setAllCryptoLengthAction', length);
        },
        async getNewsTrendingAction(state) {
            const response = await CryptoApiService.getCryptoNewsTrending();
            state.commit('getNewsTrendingMutation', response.data.news);
        },
        async getNewsLatestAction(state) {
            const response = await CryptoApiService.getCryptoNewsLatest();
            state.commit('getNewsLatestMutation', response.data.news);
        },
        addWatchlistAction(state, symbol) {
            state.commit('addWatchlistMutation', symbol);
        },
        removeWatchlistAction(state, symbol) {
            state.commit('removeWatchlistMutation', symbol);
        },


    },
    modules: {}
})