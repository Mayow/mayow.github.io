<template>
  <div class="nav">
    <div>
      <a class="toggle-button" @click="toggleButton()">
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </a>
    </div>

    <div class="nav-bar" :class="{ active: isActive }">
      <ul>
        <li>
          <router-link to="/">Home</router-link>
        </li>
        <li>
          <router-link :to="{ name: 'news' }"> Crypto News</router-link>
        </li>
        <li>
          <router-link :to="{ name: 'about' }">About</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "NavigationBar",
  props: {},
  data() {
    return {
      isActive: false,
    };
  },
  methods: {
    toggleButton() {
      this.isActive = !this.isActive;
    },
  },
  created() {
    this.isActive = false;
  },
  watch: {
    $route(to, from) {
      this.isActive = false;
    }
  }

};
</script>

<style scoped>
.nav {
  display: flex;
  justify-content: center;
  height: 80px;
  width: 100%;
}

.toggle-button {
  position: absolute;
  top: 0.75rem;
  right: 1rem;
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 21px;
  cursor: pointer;
}

.toggle-button .bar {
  height: 3px;
  width: 100%;
  background-color: white;
  border-radius: 10px;
}

.nav-bar {
  background-color: #253137;
  width: 100%;
  display: flex;
  align-items: center;
}

.nav-bar li a {
  display: block;
  text-decoration: none;
  color: white;
  grid-gap: 100px;
  font-size: 20px;
}

ul {
  list-style-type: none;
  display: flex;
  grid-gap: 30px;
  margin-bottom: 0px;
  width: 100%
}

a:hover {
  color: white;
  text-decoration: underline;
}

.nav-bar li a:hover {
  text-decoration: underline;
}


@media (max-width: 1200px) {
  .nav {
    background-color: #253137;
    height: 60px;
  }

  .toggle-button {
    display: flex;
    margin-top: 10px;
  }

  .nav-bar {
    background-color: #253137;
    height: 0px;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px 0px;
    margin-top: 53px;
    display: none;
  }

  .nav-bar ul {
    width: 100%;
    flex-direction: column;
    z-index: 3;
    text-align: center;
  }

  ul {
    padding-left: 0px;
    grid-gap: 0px;
  }

  li:hover {
    background-color: #555;
  }

  li {
    padding: 10px 50px;
    background-color: #253137;
  }

  .nav-bar.active {
    display: flex;
    margin-top: 53px;
  }

}
</style>
