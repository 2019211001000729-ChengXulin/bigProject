<template>
  <div searchContainer>
    <router-view></router-view>
    <!-- 顶部导航栏 -->
    <div class="navBar">
      <van-nav-bar title="搜索"> </van-nav-bar>
    </div>
    <!-- 头部 -->
    <div class="header">
      <form action="/" class="search">
        <van-search
          error
          show-action
          background="#fff"
          v-model="inputValue"
          shape="round"
          :placeholder="placeholder"
          @keyup="handleInput"
        >
          <template #action>
            <div @click="cancel" v-show="inputValue">X</div>
          </template>
        </van-search>
      </form>
      <div class="cancle" @click="backToHome">取消</div>
    </div>
    <!-- 搜索内容展示 -->
    <div class="showSearchContent" v-if="this.searchList.length > 0">
      <div class="searchContent">搜索内容：{{ inputValue }}</div>
      <div class="searchList">
        <div class="searchItem" v-for="item in searchList" :key="item.id">
          <span class="searchImg">
            <img src="../../assets/search.png" alt="" />
          </span>
          <span class="searchText" @click="searchToSongDetail(item)">{{
            item.name
          }}</span>
        </div>
      </div>
    </div>
    <!-- 热搜榜 历史记录-->
    <div class="hisAndHot" v-else>
      <!-- 历史记录 -->
      <div class="history" v-if="this.historyList.length > 0">
        <div class="title">历史</div>
        <div
          class="historyItem"
          v-for="(item, index) in historyList"
          :key="index"
        >
          {{ item }}
        </div>
        <div class="delImg">
          <img src="../../assets/del.png" alt="" @click="delHis" />
        </div>
      </div>

      <!-- 热搜 -->
      <div class="hotContainer">
        <div class="title">热搜榜</div>
        <!-- 热搜列表 -->
        <div class="hotList">
          <div class="hotItem" v-for="(item, index) in hotList" :key="index">
            <span class="order">{{ index + 1 }}</span>
            <span @click="hotToSongDetail(item)">{{ item.searchWord }}</span>
            <img
              class="iconImg"
              v-if="item.iconUrl"
              :src="item.iconUrl"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { get } from "../../http/request";
import { Dialog } from "vant";
let isSend = false;
export default {
  data() {
    return {
      inputValue: "",
      placeholder: "",
      // 热搜榜列表
      hotList: [],
      // 模糊匹配的数组
      searchList: [],
      // 搜索历史记录
      historyList: [],
      // 接受搜索列表的值
      searchKey: "",
      // 歌曲详情对象
      songObj: {},
    };
  },
  created() {
    this.getInitData();
    this.getsearchHistory();
  },
  methods: {
    // 取消搜索返回上一级页面
    backToHome() {
      this.$router.go(-1);
    },
    // 获取placeholder、hotList的初始化数据
    async getInitData() {
      let placeholder = await get("/search/default");
      this.placeholder = placeholder.data.showKeyword;
      let hotList = await get("/search/hot/detail");
      this.hotList = hotList.data;
    },
    //删除历史记录
    delHis() {
      Dialog.confirm({
        title: "历史记录",
        message: "你确定删除历史记录？",
      })
        .then(() => {
          // 清除data中的数据
          this.historyList = [];
          // 清楚本地记录
          localStorage.removeItem("searchHistory");
        })
        .catch(() => {});
    },
    //清除搜索框内容
    cancel(val) {
      // console.log(val);
      this.inputValue = "";
      this.searchList = [];
    },
    // 获取本地历史记录
    getsearchHistory() {
      let searchList = JSON.parse(localStorage.getItem("searchHistory"));
      if (searchList) {
        this.historyList = searchList;
      }
      // console.log(searchList);
    },
    handleInput() {
      if (isSend) {
        return;
      }
      isSend = true;
      //发请求获取搜索匹配到的数据
      this.getsearchList();
      //函数节流
      setTimeout(() => {
        isSend = false;
      }, 1000);
    },
    // 获取搜索的内容列表
    async getsearchList() {
      if (!this.inputValue) {
        // 当输入框内没有数据  那么就将列表数组置为空
        this.searchList = [];
        return;
      }
      let data = {
        keywords: this.inputValue,
        limit: 10,
      };
      let res = await get("/search", data);
      this.searchList = res.result.songs;
      // console.log(res.result.songs);

      // 将搜索的关键字添加到历史记录中
      if (this.historyList.indexOf(this.inputValue) !== -1) {
        this.historyList.splice(this.historyList.indexOf(this.inputValue), 1);
      }
      this.historyList.unshift(this.inputValue);
      localStorage.setItem("searchHistory", JSON.stringify(this.historyList));
    },
    // 获取歌曲详情
    // 搜索跳转至播放界面
    async searchToSongDetail(item) {
      let data = {
        ids: item.id,
      };
      let res = await get("/song/detail", data);
      this.songObj = res.songs[0];
      // console.log(this.songObj);
      this.$router.push({
        path: "/manage/songDetail",
        query: {
          musicList: this.songObj,
        },
      });
    },

    // 点击热搜榜跳转到热门音乐列表界面
    async hotToSongDetail(item) {
      // console.log(item.searchWord);
      // /search/suggest?keywords=海阔天空&type=mobile
      let data = {
        keywords: item.searchWord,
        // type: "mobile",
      };
      let res = await get("/search", data);
      let hotMusicList = res.result.songs;

      // console.log(hotMusicList);
      this.$router.push({
        path: "/manage/hotMusicList",
        query: {
          musicList: hotMusicList,
        },
      });
    },
  },
};
</script>

<style scoped>
.van-nav-bar {
  background: red;
}
.searchContainer {
  padding: 7px;
}
.header {
  display: flex;
  height: 40px;
  padding: 3px 0;
  line-height: 1.5;
  margin: 0 auto;
}
.search {
  height: 30px;
  width: 85%;
  margin-top: -3px;
}
.cancle {
  margin-top: 12px;
  margin-left: 10px;
}
/* 搜索样式 */
.searchContent {
  width: 95%;
  margin: 0 auto;
  border-bottom: 1px solid #d43c33;
  line-height: 2;
  color: #d43c33;
}
.searchImg {
  width: 15px;
  height: 15px;
}
.searchImg img {
  width: 15px;
  height: 15px;
}
.searchItem {
  display: flex;
  height: 30px;
  line-height: 2;
  margin-left: 5%;
}
.searchText {
  flex: 1;
  font-size: 15px;
  margin-left: 15px;
  border-bottom: 1px solid #eee;
}

/* 热搜榜样式 */
.hotContainer .title {
  margin-top: 5px;
  margin-left: 15px;
  font-size: 17px;
  height: 40px;
  line-height: 2;
  border-bottom: 1px solid #eee;
}
.hotList {
  display: flex;
  flex-wrap: wrap;
}
.hotItem {
  width: 50%;
  height: 40px;
  line-height: 3;
  font-size: 15px;
}
.hotItem .order {
  margin-right: 5px;
  margin-left: 17px;
}
.hotItem .iconImg {
  width: 20px;
  height: 20px;
  margin-left: 20px;
}
/* 历史记录 */
.history {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  line-height: 1.5;
  margin-left: 15px;
  margin-top: 7px;
}
.history .title {
  font-size: 17px;
}
.history .historyItem {
  font-size: 15px;
  border-radius: 10px;
  background-color: #eee;
  margin-left: 10px;
  padding: 0 7px;
  margin-bottom: 10px;
}
.history .delImg img {
  width: 15px;
  height: 15px;
}
.history .delImg {
  position: absolute;
  bottom: 5px;
  right: 15px;
}
</style>