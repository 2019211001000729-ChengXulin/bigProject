<template>
  <div>
    <div class="box1"></div>
    <!-- 头部导航栏 -->
    <div class="van">
      <van-nav-bar
        title="推荐歌单"
        left-text="返回"
        left-arrow
        @click-left="goBack"
      >
        <template #right>
          <van-icon name="search" size="18" />
        </template>
      </van-nav-bar>
    </div>

    <div class="recommendSound">
      <!-- 头部区域 -->
      <div class="header">
        <img
          src="https://pic4.zhimg.com/80/v2-ac8b62bd770fb0b36cdb1b9827953daf_720w.jpg"
          alt=""
        />
        <!-- 日期 -->
        <div class="date">
          <span class="day">{{ day }} / </span>
          <span class="month">{{ month }}</span>
        </div>
      </div>
      <!-- 列表区域 -->
      <div class="listContainer">
        <div class="listHeader">
          <span class="playAll">播放全部</span>
          <span class="changeMore">更多</span>
        </div>
      </div>
      <!-- 内容区域 -->
      <div class="listScroll">
        <div
          class="scrollItem"
          v-for="item in recentList"
          :key="item.id"
          @click="toPlayMusicUI(item)"
        >
          <img :src="item.al.picUrl" alt="" />
          <div class="musicInfo">
            <div class="musicName">{{ item.name }}</div>
            <div class="author">{{ item.ar[0].name }}</div>
          </div>
          <div class="icon">
            <van-icon name="ellipsis" />
          </div>
        </div>
        <div class="box"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { get, getSongs } from "../../http/request";
import { request } from "../../http/request";
import { Dialog } from "vant";

export default {
  data() {
    return {
      day: "",
      month: "",
      recentList: [],
      //   每日推荐的歌曲存储token以方便歌曲的切换
      recMusicList: [],
    };
  },
  created() {
    this.getDate();
    this.getMusicData();
  },

  methods: {
    //   返回回调函数
    goBack() {
      // this.$router.push("/manage/home");
      this.$router.go(-1);
    },
    //   获取每日推荐歌曲的信息
    getMusicData() {
      this.recentList = this.$route.query.musicList;
      // console.log(this.recentList);
      // let musicList = this.recentList;
      // localStorage.setItem("musicList", JSON.stringify(musicList));
      if (this.$route.query.musicList[0].al == null) {
        this.recentList = JSON.parse(localStorage.getItem("musicList"));
      } else {
        this.recentList = this.$route.query.musicList;
        localStorage.setItem("musicList", JSON.stringify(this.recentList));
      }
      // console.log(this.$route.query.musicList[0].al);
      // localStorage.setItem('musicList',)
    },
    // 获取当日的日期
    getDate() {
      var date = new Date();
      this.day = date.getDate();
      this.month = date.getMonth() + 1;
    },

    // 跳转至放歌界面
    toPlayMusicUI(item) {
      // console.log(item);
      // 将歌曲的ID推入数组中  并将相同的数据去除
      this.recentMusicList = JSON.parse(localStorage.getItem("recMusicList"));
      //   console.log(this.recentMusicList);
      let arr = this.recentMusicList;
      let index = arr.findIndex((arr) => arr === item.id);
      //   console.log(index);
      if (index != -1) {
        this.recentMusicList.splice(index, 1);
        this.recentMusicList.push(item.id);
      } else {
        this.recentMusicList.push(item.id);
      }

      localStorage.setItem(
        "recMusicList",
        JSON.stringify(this.recentMusicList)
      );
      this.$router.push({
        path: "/manage/songDetail",
        query: {
          musicList: item,
        },
      });
    },
  },
};
</script>

<style scoped>
.box1 {
  height: 15px;
  background-color: red;
}
.van-nav-bar {
  background: red;
}
.box {
  height: 70px;
}
.recommendSound .header {
  width: 100%;
  position: relative;
}
.recommendSound .header img {
  width: 100%;
  height: 150px;
}
.recommendSound .header .date {
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -75px;
  margin-top: -15px;
  width: 150px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  color: white;
  /* border: 1px solid red; */
}
.recommendSound .header .date .day {
  font-size: 30px;
}
/* 列表区域样式 */
.listHeader .changeMore {
  float: right;
}
.listHeader {
  height: 30px;
  line-height: 2;
}
.listContainer {
  position: relative;
  top: -20px;
  padding: 0 7px;
  border-radius: 20px;
  background-color: white;
}
/* 内容区域样式 */

.scrollItem {
  display: flex;
  position: relative;
  width: 95%;
  height: 70px;
  padding: 0 7px;
  padding-bottom: 5px;
}
.scrollItem img {
  border-radius: 20px;
  height: 70px;
  width: 70px;
}
.musicInfo {
  display: flex;
  flex-direction: column;
  height: 20px;
}

.musicInfo .musicName {
  margin-top: 6px;
  height: 10px;
  line-height: 1;
  margin-left: 15px;
  font-size: 10px;
}
.musicInfo .author {
  margin-top: 15px;
  height: 20px;
  line-height: 1.8;
  /* text-align: center; */
  margin-left: 15px;
  font-size: 10px;
}
.scrollItem .icon {
  position: absolute;
  left: 90%;
  top: 27px;
  width: 30px;
  height: 30px;
  text-align: right;
}
</style>