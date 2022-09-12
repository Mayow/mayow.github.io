<template>
    <div>
        <div v-if="loading">
            <Loading />
        </div>
        <div v-else>
            <div id="container">
                <div class="header-title">Crypto News</div>
                <div class="news-subheader">
                    <div class="news-subheader-text" @click="changeNews(0)" :class="newsLinkTrending">
                        Trending
                    </div>
                    <div class="news-subheader-text" @click="changeNews(1)" :class="newsLinkLatest">
                        Latest
                    </div>
                </div>
                <div class="grid-layout">
                    <div v-for="(news, index) in cryptoNews" :key="index">
                        <div class="news-item-layout">
                            <div class="news-img">
                                <img :src="news.imgURL" @error="imgLoadFailed" />
                            </div>
                            <div class="news-item">
                                <div class="news-title">
                                    <div>
                                        <a target="_blank" :href="news.link">{{ truncateNewsTitle(news.title) }} </a>
                                    </div>
                                </div>
                                <div>
                                    by
                                    <span class="news-source-text">
                                        {{ news.source }}
                                    </span>
                                </div>
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

export default {
    name: "News",
    components: {
        Loading,
    },
    props: {},
    data() {
        return {
            cryptoNews: null,
            currentLink: 0,
            loading: false,
        };
    },
    computed: {
        newsLinkTrending() {
            return !this.currentLink
                ? "news-subheader-selected"
                : "news-subheader-not-selected";
        },
        newsLinkLatest() {
            return this.currentLink
                ? "news-subheader-selected"
                : "news-subheader-not-selected";
        },

    },
    methods: {
        ...mapActions(["getNewsTrendingAction", "getNewsLatestAction"]),
        ...mapGetters(["getNewsTrendingGetter", "getNewsLatestGetter"]),

        async changeNews(index) {
            if (index === 0) {
                this.cryptoNews = await this.getNewsTrendingGetter();
                this.currentLink = 0;
            } else {
                this.cryptoNews = await this.getNewsLatestGetter();
                this.currentLink = 1;
            }
        },
        imgLoadFailed() {
            event.target.src = "https://www.cvent-assets.com/brand-page-guestside-site/assets/images/venue-card-placeholder.png"
        },
        truncateNewsTitle(str) {
            const n = 120;
            return (str.length > n) ? `${str.slice(0, n - 1)}...` : str;
        }
    },
    async created() {
        this.loading = true;
        await this.getNewsTrendingAction();
        await this.getNewsLatestAction();
        this.cryptoNews = await this.getNewsTrendingGetter();
        this.loading = false;
    },
};
</script>

<style scoped>
#container {
    padding: 50px 70px;
}

.header-title {
    font-size: 2.5em;
    font-weight: 700;
    line-height: 34px;
    margin-bottom: 20px;
}

.news-subheader {
    display: flex;
    align-items: center;
}

.news-subheader-text:first-child {
    margin-right: 20px;
    grid-gap: 10px;
}

.news-subheader-text:hover {
    text-decoration: underline;
    cursor: pointer;
}

.news-subheader-selected {
    text-decoration: underline;
    color: black;
    font-weight: 600;
    font-size: 30px;
}

.news-subheader-not-selected {
    font-size: 20px;
    color: #808080;
    margin-top: 4px;
}

.grid-layout {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(285px, 1fr));
    grid-gap: 20px;
}

.news-item {
    padding: 20px 20px;
    display: flex;
    flex-direction: column;
}

.news-img>img {
    width: 100%;
    height: 230px;
    border-radius: 9px;
}

.news-item-layout {
    background-color: #ededed;
    width: 100%;
    margin: 10px;
    height: 420px;
    border: 0.5px solid #a9a9a9;
    border-radius: 10px;
}

.news-item-layout:hover {
    box-shadow: 7px 7px 15px #888;
}

.news-title {
    font-weight: 600;
    font-size: 0.9rem;
    height: 100px;
}

a:link,
a:visited,
a:active {
    color: black;
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}

.news-source-text {
    font-weight: 600;
}
</style>