<template>
  <div id="container">
    <h1>{{ initData }}</h1>
    <img src="src/assets/123.jpg">
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      initData: 'Vue环境运行成功～'
    }
  }
}
</script>

<style scoped>
  #container {
    color: red;
    display: flex;
  }
</style>