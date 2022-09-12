<template>
  <NavigationBar />
  <router-view />
</template>


<script>
import NavigationBar from "@/components/NavigationBar";

export default {
  name: "APP",
  components: {
    NavigationBar,
  },
};
</script>
