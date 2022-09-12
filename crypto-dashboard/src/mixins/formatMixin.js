export default {
    methods: {
        formatPrice: function(value) {
            let dollarUS = Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            });
            return dollarUS.format(value)
        },
        formatPercent: function(value) {
            return ((value / 100) * 100).toFixed(2) + '%';
        },
        formatCapitalizeFirstLetter: function(value) {
            var arr = ['usdt', 'usd'];
            var words = value.split("-");

            return words.map((word) => {
                return arr.includes(word) ? word.toUpperCase() : word[0].toUpperCase() + word.slice(1);
            }).join(" ");
        },
    }
};