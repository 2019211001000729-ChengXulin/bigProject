<template>
  <div>
    <router-view></router-view>
    <van-tabbar v-model="active" class="tabbar" active-color="#ee0a24">
      <van-tabbar-item icon="home-o" to="/manage/home">首页</van-tabbar-item>
      <van-tabbar-item icon="search" to="/manage/search">搜索</van-tabbar-item>
      <van-tabbar-item icon="friends-o" to="/manage/mine">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
    };
  },
};
</script>

<style scoped>
.tabbar {
  background-color: red;
}
</style>