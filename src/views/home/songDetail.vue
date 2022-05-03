<template>
  <div class="all">
    <!-- 将头部顶下来 -->
    <div class="box"></div>
    <van-nav-bar :title="musicName" left-text="返回" @click-left="goBack">
    </van-nav-bar>
    <div class="songDetailContainer">
      <!-- 歌名 -->
      <div class="author">{{ musicList.ar[0].name }}</div>
      <div class="circle"></div>
      <!-- 通过双向数据绑定的形式绑定class类 -->
      <img
        :class="{ needle: !isPlay, needle1: isPlay }"
        src="../../assets/needle.png"
        alt=""
      />
      <div class="discContainer">
        <img class="disc" src="../../assets/disc.png" alt="" />
        <img
          :src="musicList.al.picUrl"
          alt=""
          :class="{ musicImg: !isPlay, discAnimation: isPlay }"
        />
      </div>
    </div>
    <div class="maxbox">
      <div class="musicControll">
        <span class="one"><img src="../../assets/for.png" alt="" /></span>
        <span class="two" @click="before"
          ><img src="../../assets/before.png" alt=""
        /></span>
        <span class="three" @click="handleMusicPlay"
          ><img
            v-if="this.isPlay == false"
            src="../../assets/play.png"
            alt="" />
          <img v-else src="../../assets/stop.png" alt=""
        /></span>
        <span class="four" @click="next"
          ><img src="../../assets/next.png" alt=""
        /></span>
        <span class="five"><img src="../../assets/list.png" alt="" /></span>
      </div>

      <div id="auto">
        <audio autoplay ref="audio" id="audio" :src="this.musicUrl"></audio>
      </div>
    </div>
  </div>
</template>

<script>
import { get } from "../../http/request";
export default {
  data() {
    return {
      isPlay: false, //判断音乐是否播放
      //   获取传递过来的歌曲相关信息
      musicList: [],
      //   歌曲名称
      musicName: "nidei ",
      //   歌曲地址
      musicUrl: "",
      musicUrl1: "",
      //   歌曲id
      //   数组下标
      index: 0,
      recentMusicList: [],
      // //歌词
      // lyric: [],
      // //歌词对应的时间
      // lyricTime: 0,
      // //当前歌词对象
      // currentLyric: "",
    };
  },

  created() {
    this.getQueryData();
    this.getQueryData();
    this.getInit();
  },

  methods: {
    async getw() {
      // console.log(this.musicList.id);
      this.musicList.id = this.musicList.id + 1;
      // console.log(this.musicList.id);

      let data = {
        id: this.musicList.id,
      };
      let res = await get("/song/url", data);
      //   console.log(res);
      this.musicUrl = res.data[0].url;
    },
    //   下一首
    async next() {
      //   获取歌曲详情
      this.getw();
      //   this.musicList.id = this.musicList.id + 1;
      let data = {
        ids: this.musicList.id,
      };
      let res = await get("/song/detail", data);
      //   console.log(res1.songs[0]);
      this.musicList = res.songs[0];
      //   console.log(this.musicList);
      //   console.log(this.musicName);
      this.musicName = res.songs[0].name;
      //   console.log(this.musicName);
      this.isPlay = true;
      let recentMusicList = JSON.parse(localStorage.getItem("recMusicList"));
      recentMusicList.push(this.musicList.id);
      localStorage.setItem("recMusicList", JSON.stringify(recentMusicList));
    },

    getInit() {
      let recentMusicList = JSON.parse(localStorage.getItem("recMusicList"));
      this.recentMusicList = recentMusicList;
      let arr = recentMusicList;
      let index = arr.findIndex(
        (arr) => arr === recentMusicList[recentMusicList.length - 1]
      );
      //   console.log(index);
      this.index = index;
    },
    // 前一首
    async getB() {
      if (this.index >= 1) {
        let data = {
          id: this.recentMusicList[this.index - 1],
        };
        let res = await get("/song/url", data);
        // console.log(res);
        this.musicUrl = res.data[0].url;
      }
    },
    async before() {
      this.index--;
      this.getB();
      // console.log(this.recentMusicList);
      // console.log(this.index);
      let uid = this.recentMusicList[this.index];

      let data = {
        ids: uid,
      };
      let res = await get("/song/detail", data);
      // console.log(res);
      //   console.log(res1.songs[0]);
      this.musicList = res.songs[0];
      //   console.log(this.musicList);
      //   console.log(this.musicName);
      this.musicName = res.songs[0].name;
      //   console.log(this.musicName);
      let recentMusicList = JSON.parse(localStorage.getItem("recMusicList"));
      recentMusicList.push(uid);
      localStorage.setItem("recMusicList", JSON.stringify(recentMusicList));
      this.isPlay = true;
    },
    goBack() {
      this.$router.go(-1);
    },
    // 控制歌曲的开放回调
    handleMusicPlay() {
      //   console.log("sss");
      let isPlay = this.isPlay;
      this.isPlay = !isPlay;
      this.musicControll(this.isPlay);
    },
    // 实现歌曲的播放与暂停的功能
    async musicControll(isPlay) {
      //   let audio = document.querySelector("#audio");
      let uid = this.musicList.id;
      //   console.log(uid);
      let data = {
        id: uid,
      };
      if (isPlay) {
        let res = await get("/song/url", data);
        // console.log(res.data[0].url);
        this.musicUrl = res.data[0].url;
        this.$refs.audio.play();
      } else {
        this.$refs.audio.pause();
      }
    },
    // 将获取到的参数渲染出来
    getQueryData() {
      // console.log(this.$route.query.musicList);
      this.musicList = this.$route.query.musicList;
      this.musicName = this.$route.query.musicList.name;
    },
  },
};
</script>

<style scoped>
.box {
  height: 15px;
  background-color: red;
}
.van-nav-bar {
  background-color: red;
}
.songDetailContainer {
  height: 100%;
  margin: 0 auto;
  background-image: linear-gradient(#f7797d, #86ccfb, #e8ffc6);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.author {
  color: white;
}
.musicName {
  color: red;
}
/* 底座 */
.circle {
  position: relative;
  z-index: 100;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #fff;
}
/* 遥感 */
.needle {
  width: 100px;
  height: 170px;
  position: relative;
  z-index: 99;
  left: 30px;
  top: -17px;
  transform-origin: 10px 0;
  transform: rotate(-20deg);
  transition: transform 1s;
}
.needle1 {
  width: 100px;
  height: 170px;
  position: relative;
  z-index: 99;
  left: 30px;
  top: -15px;
  transform-origin: 0 15px;
  transition: transform 1s;
  transform: rotate(0deg);
}

/* 磁盘 */
.discContainer {
  width: 200px;
  height: 200px;
  position: relative;
  z-index: 98;
  right: 50px;
  top: -90px;
}

.discAnimation {
  width: 182px;
  height: 182px;
  border-radius: 50%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  /* margin: auto; */
  margin-top: 59px;
  margin-left: 59px;
  animation: disc 10s linear infinite;
  animation-delay: 1s;
}
/*设置动画帧 1.from to(只有起始帧和结束帧)  2.百分比(不止两帧)*/
@keyframes disc {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.discContainer .disc {
  width: 300px;
  height: 300px;
}
.discContainer .musicImg {
  width: 182px;
  height: 182px;
  border-radius: 50%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  /* margin: auto; */
  margin-top: 59px;
  margin-left: 59px;
}
/* 底部控制栏项目 */
.maxbox {
  background-image: linear-gradient(#e8ffc6, #86ccfb, #f7797d);
  height: 150px;
}

.musicControll img {
  width: 20px;
  height: 20px;
  border-top: 1px solid #fff;
  /* margin-top: 95px; */
  /* margin-bottom: -100px; */
  margin-bottom: -27%;
}
.musicControll .one {
  margin-left: 3%;
}
.musicControll .two {
  margin-left: 20%;
}
.musicControll .three img {
  height: 30px;
  width: 30px;
  margin-left: 10%;
}
.musicControll .four {
  margin-left: 10%;
}
.musicControll .five {
  margin-left: 20%;
}
/*  */
#audio {
  position: absolute;
  left: 10%;
  background-image: linear-gradient(#e8ffc6, #86ccfb, #f7797d);
}
</style>