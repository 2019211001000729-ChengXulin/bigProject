<template>
  <div class="home">
    <div class="navBar">
      <van-nav-bar title="首页"> </van-nav-bar>
    </div>
    <!-- 头部标题 -->
    <div class="header">
      <form action="/" class="search">
        <van-search
          background="#FF0000"
          v-model="value"
          shape="round"
          placeholder="请输入搜索关键词"
          @mousedown="toSearch"
        ></van-search>
      </form>
    </div>
    <div class="home-main">
      <!-- 轮播图 -->
      <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
        <van-swipe-item
          v-for="(item, i) in swiperImgs"
          :key="i"
          @click="toSongDetail(item)"
        >
          <img :src="item.pic" alt="" />
        </van-swipe-item>
      </van-swipe>
      <!--圆形图标入口列表-->
      <div class="icon-list">
        <div class="icon-contant">
          <ul class="ul-icon" v-for="(item, i) in iconList" :key="i">
            <li class="li-item">
              <div class="icon">
                <img :src="item.iconUrl" alt="" @click="toOther(i)" />
              </div>
              <span class="text">{{ item.name }}</span>
            </li>
          </ul>
        </div>
      </div>
      <!-- 推荐歌单 -->
      <div class="commendMusic">
        <div class="div-inline">推荐歌单</div>
        <div class="div-inline1">更多 ></div>
        <div class="musicList">
          <ul class="u-list">
            <li class="l-list" v-for="(item, index) in musicList" :key="index">
              <div class="l-cover">
                <img
                  class="musicImg"
                  :src="item.picUrl"
                  alt=""
                  @click="toMusicList(item)"
                />
              </div>
              <div class="l-buttom">
                <span class="video">
                  <van-icon name="service-o" color="#ffff" />
                </span>
                <span class="nb">{{ item.playCount }}</span>
                <span class="videoImg">
                  <van-icon name="play-circle-o" color="#ffff" />
                </span>
              </div>
              <div class="desc">
                {{ item.name }}
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!-- 数字单曲榜单 -->
      <div class="hotPlay">
        <div class="playText">数字单曲榜单</div>
        <van-card
          class="cardShow"
          v-for="item in num"
          :key="item.albumId"
          :desc="'数字专辑名：' + item.albumName"
          :num="item.saleNum"
          :title="item.artistName"
          :thumb="item.coverUrl"
          @card-desc-line-height="2"
        >
        </van-card>
      </div>
    </div>
    <div class="box"></div>
  </div>
</template>

<script>
import { get } from "../../http/request";
export default {
  data() {
    return {
      // 获取轮播图banner数组列表
      swiperImgs: [],
      // 装在icon列表图标
      iconList: [],
      // 搜索框的值
      value: "",
      searchHot: [],
      // 推荐歌单
      musicList: [],
      // 数字榜单
      year: 2020,
      num: [],
    };
  },
  created() {
    // 轮播图
    this.showImg();
    // 菜单栏
    this.showIconList();
    //  推荐歌单的加载
    this.getMusicList();
    // 数字榜单
    this.getNumRank();
  },
  methods: {
    // 轮播图
    // 跳转传参
    async toSongDetail(item) {
      // console.log(item.targetId);
      let data = {
        ids: item.targetId,
      };
      let res = await get("/song/detail", data);
      // console.log(res.songs[0]);
      JSON.stringify("musicList", res.songs[0]);
      this.$router.push({
        path: "/manage/songDetail",
        query: {
          musicList: res.songs[0],
        },
      });
    },
    // 获取轮播图图片
    async showImg() {
      let data = {
        type: 2,
      };
      let res = await get("/banner", data);
      // console.log(res.banners);
      this.swiperImgs = res.banners;
    },
    // 获取圆形图标入口列表
    async showIconList() {
      let res = await get("/homepage/dragon/ball");
      // console.log(res.data);
      this.iconList = res.data;
    },
    // 点击圆形图标进行页面的跳转
    toOther(i) {
      // console.log(i);
      // let recMusicList = [];
      if (i == 0) {
        this.$router.push("/manage/recommendSound");
        // localStorage.setItem("recMusicList", JSON.stringify(recMusicList));
      }
    },
    // 搜索框字
    toSearch() {
      this.$router.push({
        path: "/manage/search",
        query: {
          value: this.value,
        },
      });
    },
    // 推荐歌单
    async getMusicList() {
      let data = {
        limit: 6,
      };
      let res = await get("/personalized", data);
      // console.log(res.result);
      this.musicList = res.result;
    },
    // 跳转至详情
    async toMusicList(item) {
      // console.log(item);
      let data = {
        id: item.id,
        limit: 20,
      };
      let res = await get("/playlist/track/all", data);
      // console.log(res.songs);
      this.$router.push({
        path: "/manage/musicList",
        query: {
          musicList: res.songs,
        },
      });
    },
    // 数字单曲榜单
    async getNumRank() {
      let year = new Date();
      this.year = year.getFullYear();
      let res = await get(
        "/album/songsaleboard?type=" +
          "year" +
          "&year=" +
          this.year +
          "&albumType=0"
      );
      // console.log(res);
      this.num = res.products;
    },
  },
};
</script>

<style scoped>
.van-nav-bar {
  background: red;
  height: 40px;
}
.home {
  margin: 0 auto;
  width: 100%;
  height: 100%;
  background-color: red;
}
/* 头部样式 */
.header .search {
  width: 80%;
  margin: 0 auto;
}
/* 轮播图样式 */
.my-swipe .van-swipe-item {
  width: 90%;
  height: 180px;
  /* background-color: transparent; */
}
.my-swipe .van-swipe-item img {
  border-radius: 25px;
  width: 90%;
  height: 180px;
  margin-left: 5%;
  margin-top: 5px;
}
/* 列表 */
.home .icon-list {
  height: 90px;
  overflow: hidden;
}
.icon-list .icon-contant {
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 15px;
  margin-left: 7px;
}
.icon-contant .ul-icon {
  display: inline-block;
  margin-top: 5px;
}
.ul-icon .li-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 10px;
}
.li-item .icon {
  background-color: red;
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.li-item .icon img {
  width: 100%;
  height: 100%;
}
.li-item .text {
  font-size: 14px;
  margin-top: 3px;
  color: white;
}
/* 热门音乐 */
.commendMusic {
  border: 1px solid white;
  margin-top: 5px;
}
.div-inline {
  display: inline;
  color: white;
  margin-left: 5%;
  margin-right: 60%;
}
.div-inline1 {
  display: initial;
  color: white;
  line-height: 2;
}
.musicList .l-cover .musicImg {
  height: 100px;
  width: 100px;
  border-radius: 10px;
}
.musicList {
  background-color: red;
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  /* padding-bottom: 25px; */
  /* margin-left: 7px; */
  padding-left: 7px;
}
.musicList .l-list {
  width: 80px;
  height: 80px;
  margin: 3px;
  display: inline-block;
  margin-top: 10px;
  margin-right: 30px;
}
.l-list .desc {
  margin: 0 auto;
  color: white;
  font-size: 5px;
  display: -webkit-box;
  text-overflow: ellipsis;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  width: 100px;
  margin-top: 5px;
}
.video img {
  height: 15px;
  width: 15px;
}
.videoImg {
  margin-left: 23px;
}
.nb {
  color: white;
  font-size: 5px;
}
.l-buttom {
  /* position: relative;
  bottom: 20px; */
  margin-top: -20px;
}
/* 数字单曲榜单 */
.hotPlay {
  background-color: red;
}
.cardShow {
  background-color: red;
  color: white;
}
.playText {
  font-size: 15px;
  color: white;
  margin-top: 5px;
  margin-left: 3px;
  text-align: center;
}
.box {
  background-color: red;
  height: 100px;
}
</style>