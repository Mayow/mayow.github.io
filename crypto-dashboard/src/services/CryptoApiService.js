import axios from "axios";

export default {
    async getAllCryptos() {
        return await axios('https://api.coinstats.app/public/v1/coins?skip=0&limit=100');;
    },
    async getCrypto(crypto) {
        return await axios(`https://api.coinstats.app/public/v1/markets?coinId=${crypto}`);
    },
    async getCryptoNewsTrending() {
        return await axios(`https://api.coinstats.app/public/v1/news/trending`);
    },
    async getCryptoNewsLatest() {
        return await axios(`https://api.coinstats.app/public/v1/news/latest`);
    },
};