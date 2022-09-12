<template>
  <CryptoDetails :cryptoAsset="cryptoAsset" />
</template>

<script>
import CryptoDetails from '@/components/CryptoDetails.vue'

export default {
  name: "SingleView",
  components: {
    CryptoDetails
  },
  props: {
    cryptoAsset: {
      type: String,
      required: true
    },
  },
};
</script>
