<template>
    <div class="footer">
        <div class="dropdown-number">
            <div>Number of item per page </div>
            <select v-model="items">
                <option disabled value="">Please select number of items</option>
                <option :value="10">10</option>
                <option :value="20">20</option>
                <option :value="30">30</option>
                <option :value="50">50</option>
                <option :value="length">All</option>
            </select>
        </div>

        <div class="pagination">
            <a :class="{ end: currentPage === 0 }" @click="changePageArrow(0)">&laquo;</a>
            <div v-for="(page, index) in paginationArray" :key="index">
                <a :class="{ active: index === currentPage }" @click="changePageDirect(index)">
                    {{ page }}
                </a>
            </div>
            <a :class="{ end: currentPage === this.pages-1 }" @click="changePageArrow(1)">&raquo;</a>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
    data() {
        return {
            length: null
        };
    },
    emits: ['update:modelValue', "changePage"],
    props: {
        modelValue: {
            type: [Number, String],
            required: true
        },
        currentPage: {
            type: Number,
            required: true
        },
        pages: {
            type: Number,
            required: true
        },
        paginationArray: {
            type: Array,
            validator: prop => prop.every(e => typeof e === "number"),
            required: true
        },
    },
    computed: {
        items: {
            get() {
                return this.modelValue;
            },
            set(val) {
                this.$emit('update:modelValue', val);
            }
        }
    },
    methods: {
        ...mapGetters(["getAllCryptoLengthGetter"]),
        changePageDirect(index) {
            this.$emit("changePage", index);
        },
        changePageArrow(direction) {
            if ((direction === 0) && (this.currentPage >= 1)) {
                this.$emit('changePage', this.currentPage - 1);
            }
            else if ((direction === 1) && (this.currentPage < this.pages - 1)) {
                this.$emit('changePage', this.currentPage + 1);
            }
        },
    },
    created() {
        this.length = this.getAllCryptoLengthGetter();
    }
};
</script>

<style>
.footer {
    display: flex;
    grid-gap: 9px;
    align-items: center;
    padding: 20px 50px;
}

.dropdown-number {
    display: flex;
    grid-gap: 10px;
    width: 40%;
}

/* pagination css*/
.pagination {
    display: inline-block;
    display: flex;
    justify-content: space-around;
    width: 60%;
}

.pagination a {
    color: black;
    float: left;
    padding: 6px 16px;
    text-decoration: none;
    transition: background-color 0.5s;
}

.pagination a.active {
    background-color: #253137;
    color: white;
    padding: 6px 16px;
    border-radius: 5px;
}

.pagination a:hover:not(.active) {
    color: black;
}

.pagination a:hover:not(.active, .end) {
    background-color: #ddd;
    border-radius: 5px;
    cursor: pointer;
}

select {
    background-color: white;
    width: 6rem;
    border: 1px solid gray;
    text-align: center;
}

option {
    background-color: white;
    cursor: pointer;
    user-select: none;
}

@media (max-width: 1111px) {
    .dropdown-number {
        justify-content: center;
        width: 100%;
    }

    .pagination {
        width: 100%;
    }

    .footer {
        display: flex;
        flex-direction: column;
        padding: 20px 10px;
        grid-gap: 20px;
    }
}
</style>