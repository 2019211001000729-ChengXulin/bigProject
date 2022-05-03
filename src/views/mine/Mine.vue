<template>
  <div class="mine">
    <!-- 顶部背景 -->
    <div class="backgc"></div>
    <!-- 顶部用户信息 -->
    <div class="userInfo">
      <!-- 用户头像 -->
      <div class="userFace">
        <img :src="this.userInfo.avatarUrl" alt="" />
      </div>
      <!-- 用户名 -->
      <div class="username">{{ this.userInfo.nickname }}</div>
      <div class="shwo">
        <span class="one"> {{ this.userInfo.follows }} 关注</span>
        <span class="two">{{ this.userInfo.authority }} 粉丝 </span>
        <span class="three">Lv.{{ this.userInfo.follows }}</span>
      </div>
    </div>
    <!-- 操作列表    指示列表-->
    <div class="cellArea">
      <div class="recentPlay">
        <div class="text">最近播放</div>
      </div>
      <div class="recentScroll" v-if="recentPlayList.length > 0">
        <ul class="ul-scroll" v-for="(item, i) in recentPlayList" :key="i">
          <li class="li-scroll">
            <div class="scroll">
              <img :src="item.song.al.picUrl" alt="" @click="toHis(item)" />
            </div>
            <span class="text">{{ item.song.name }}</span>
          </li>
        </ul>
      </div>
      <div v-if="recentPlayList.length == 0">暂时没有播放记录</div>
      <div class="myMusic">我的音乐</div>
      <div class="myCollection">我的收藏</div>
      <div class="myTai">我的电台</div>
    </div>
    <!-- 退出按钮 -->
    <div class="logout" @click="logout">退出登录</div>
  </div>
</template>

<script>
import { get } from "../../http/request";
import { delToken, getToken } from "../../http/tokenUtils";
export default {
  data() {
    return {
      // 传递过来的用户信息
      userInfo: [],
      // 最近的播放记录
      recentPlayList: [],
    };
  },
  created() {
    this.getUserRecentPlayList();
    // console.log(JSON.parse(localStorage.getItem("token")));
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
  },
  methods: {
    // 点击图片跳转
    toHis(item) {
      // console.log(item.song);
      this.$router.push({
        path: "/manage/songDetail",
        query: {
          musicList: item.song,
        },
      });
    },

    async logout() {
      this.$router.push("/login");
      localStorage.removeItem("userInfo");
      localStorage.removeItem("PhoneAndPassword");
    },
    // 获取用户最近的播放记录
    async getUserRecentPlayList() {
      let his = JSON.parse(localStorage.getItem("hisWeekDat"));
      // console.log(his);
      if (his == null) {
        this.recentPlayList = his;
      } else {
        let userId = JSON.parse(localStorage.getItem("userInfo")).userId;
        // console.log(JSON.parse(localStorage.getItem("token")).userId);
        let data = {
          uid: userId,
          type: 1,
        };
        let res = await get("/user/record", data);
        this.recentPlayList = res.weekData;
        localStorage.setItem("hisWeekDat", JSON.stringify(this.recentPlayList));
        // console.log(res.allData);
      }
    },
  },
};
</script>

<style scoped>
/* 设置顶部的背景颜色 */
.mine .backgc {
  background-image: linear-gradient(#f7797d, #86ccfb, #e8ffc6);
  height: 200px;
  border-bottom-left-radius: 50%;
  border-bottom-right-radius: 50%;
}
/* 整个用户区域的样式 */
.mine .userInfo {
  background-color: #ffff;
  /* background-image: linear-gradient(#f7797d, #86ccfb, #e8ffc6); */
  /* background-color: transparent; */
  width: 80%;
  height: 150px;
  /* position: absolute;
  top: 70px;
  left: 50%; */
  margin-left: 10%;
  margin-top: -40%;
  border-radius: 5px;
  /* 透明 */
  opacity: 0.8;
}

.mine .cellArea {
  margin: 40px auto;
  width: 95%;
  box-shadow: 2px 2px 3px 2px rgb(250, 96, 56, 0.5);
}
/* 最近播放 */
.cellArea .recentPlay {
  width: 100%;
  height: 30px;
  line-height: 2;
  border: 1px solid rgb(250, 96, 56, 0.5);
}
/* 我的音乐 */
.cellArea .myMusic {
  width: 100%;
  height: 30px;
  line-height: 2;
  border: 1px solid rgb(250, 96, 56, 0.5);
}
/* 我的收藏 */
.cellArea .myCollection {
  width: 100%;
  height: 30px;
  line-height: 2;
  border: 1px solid rgb(250, 96, 56, 0.5);
}
/* 我的点台 */
.cellArea .myTai {
  width: 100%;
  height: 30px;
  line-height: 2;
  border: 1px solid rgb(250, 96, 56, 0.5);
}
/* 用户头像的样式 */
.mine .userInfo .userFace {
  height: 80px;
  width: 80px;
  margin: 0 auto;
  border-radius: 50%;
}
.userInfo .username {
  /* margin: 0 auto; */
  text-align: center;
  font-size: 30px;
  /* position: absolute;
  top: 50px;
  left: ; */
  margin-top: -40px;
}
.mine .logout {
  width: 50%;
  background-image: linear-gradient(#f7797d, #86ccfb, #e8ffc6);
  text-align: center;
  border-radius: 20px;
  line-height: 2;
  margin: 0 auto;
}
/*  */
.mine .userInfo .userFace img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  /* transform: translate(50%, 50%); */
  margin-top: -50%;
}

.search-icon {
  font-size: 16px;
  line-height: inherit;
}

/* 卡片下面的内容 */
.shwo {
  margin-left: 22%;
  margin-top: 3px;
}
.shwo .one {
  margin-right: 15px;
}
.shwo .two {
  margin-right: 15px;
}
/* 最近播放列表 */
.recentScroll {
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
}
.recentScroll img {
  height: 100px;
  width: 100px;
}
.recentScroll .ul-scroll {
  display: inline-block;
  margin-top: 5px;
  width: 130px;
  height: 120px;
  margin-right: -8px;
}
.ul-scroll .li-scroll {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 5px;
}
.li-scroll .scroll {
  /* background-color: red; */
  width: 100px;
  height: 100px;
  /* border-radius: 50%; */
  display: -webkit-box;
  text-overflow: ellipsis;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.li-scroll .scroll img {
  width: 100%;
  height: 100%;
  border-radius: 20px;
}
.recentScroll .text {
  font-size: 2px;
}
</style>