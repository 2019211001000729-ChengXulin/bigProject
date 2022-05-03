<template>
  <div>
    <div class="login">
      <!-- 背景圆 -->
      <div class="circle" style="--x: 0"></div>
      <div class="circle" style="--x: 1"></div>
      <div class="circle" style="--x: 2"></div>

      <div class="loginArea">
        <!-- 头部 -->
        <div class="header">
          <div class="title">网易云</div>
        </div>

        <!-- 登录表单 -->
        <div class="form">
          <van-form @submit="onSubmit">
            <van-field
              v-model="phoneNum"
              name="手机号码"
              label="手机号码"
              placeholder="手机号码"
              :rules="[{ required: true, message: '请填写手机号码' }]"
            />
            <van-field
              v-model="password"
              type="password"
              name="密码"
              label="密码"
              placeholder="密码"
              :rules="[{ required: true, message: '请填写密码' }]"
            />
            <div style="margin: 16px">
              <van-button round block type="info" native-type="submit"
                >登录</van-button
              >
            </div>
          </van-form>
        </div>
      </div>
      <!-- 注册 -->
      <!-- <div class="register">
        <div class="title" @click="register">注册</div>
      </div> -->
      <div class="reg">
        <span class="registerText">没有账号？</span>
        <span class="register" @click="register">点击注册</span>
      </div>
    </div>
  </div>
</template>

<script>
import { get } from "../http/request";
import { Dialog } from "vant";
export default {
  data() {
    return {
      phoneNum: "",
      password: "",
      token: "",
      userInfo: {},
    };
  },
  created() {
    this.judge();
  },
  methods: {
    // 验证token中是否存在账号密码数据
    judge() {
      let judgeData = localStorage.getItem("PhoneAndPassword");
      if (judgeData) {
        this.$router.push("/manage/home");
      }
    },
    async onSubmit(values) {
      let password = this.password;
      // 正则表达式判断手机号是否合法
      let phoneReg = /^1(3[0-9]|5[0-3,5-9]|7[1-3,5-8]|8[0-9])\d{8}$/;
      if (!phoneReg.test(this.phoneNum)) {
        Dialog.confirm({
          title: "error",
          message: "您输入的手机号格式错误",
        }).then(() => {});
      }
      let data = {
        phone: this.phoneNum,
        password: this.password,
      };
      // 发送请求验证是否登录成功
      let res = await get("/login/cellphone", data);
      this.userInfo = res.profile;
      let userIn = JSON.stringify(res.profile);
      // 存储歌曲的数组
      // console.log(res);
      if (res.code === 200) {
        // console.log("登陆成功");
        // localStorage.setItem("userInfo", userIn);
        let recMusicList = [];
        localStorage.setItem("recMusicList", JSON.stringify(recMusicList));
        localStorage.setItem("userInfo", userIn);
        let cookie = this.$cookies.get("NMTID");
        console.log(cookie);
        // 将账号密码存入token中,方便验证登录状态
        let PhoneAndPassword = [this.phoneNum, this.password];
        localStorage.setItem("PhoneAndPassword", PhoneAndPassword);
        this.$router.push({
          path: "/manage/home",
          // query: {
          //   userInfo: JSON.stringify(this.userInfo),
          // },
        });
        localStorage.setItem("cookie", cookie);
      } else if (res.code === 502) {
        Dialog.confirm({
          title: "error",
          message: "密码错误",
        }).then(() => {});
      } else if (res.code === 400) {
        console.log("手机号错误");
      } else {
        Dialog.confirm({
          title: "error",
          message: "登陆失败，请重新登录",
        }).then(() => {});
      }
    },
    // 注册 或修改密码
    register() {
      // let regToken = localStorage.getItem('token')
      this.$router.push("/register");
    },
  },
};
</script>

<style scoped>
/* 底部注册框 */
.register .title {
  position: absolute;
  top: 183px;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.login {
  z-index: 99;
  width: 100%;
  text-align: center;
  /* 相对定位 */
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  /* linear-gradient() 函数用于创建一个表示两种或多种颜色线性渐变的图片 */
  background-image: linear-gradient(#f7797d, #86ccfb, #e8ffc6);
  overflow: hidden;
}
/* 注册字体位置 */
.reg {
  position: absolute;
  margin-top: 240px;
  z-index: 99;
}
.reg .register {
  color: white;
}
/* 登录表单 */
.login .loginArea .form {
  z-index: 98;
  position: relative;
  width: 350px;
  min-height: 150px;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 6px 8px 0 rgba(14, 182, 233, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.5);
}
/* 头部标题的样式 */
.login .loginArea .title {
  z-index: 97;
  position: relative;
  color: #fff;
  font-size: 24px;
  font-weight: 600;
  letter-spacing: 5px;
  margin-bottom: 30px;
  cursor: pointer;
}
/* 设置头部样式的下划线等 */
.login .loginArea .title::before {
  content: "";
  position: absolute;
  /* left: 110px; */
  left: 50%;
  margin-left: -20%;
  bottom: -10px;
  width: 0px;
  height: 3px;
  background: #fff;
  transition: 0.5s;
  width: 40%;
}

.loginArea .van-cell {
  margin-top: 10px;
  height: 45px;
  background-color: transparent;
  color: #86ccfb;
}
.loginArea .van-button--info {
  margin: 0 auto;
  /* background-color: transparent; */
  width: 100px;
  font-size: 20px;
  background-color: #79c1f2;
  border: 0.5px solid lightsteelblue;
  box-shadow: 0 4px 1px 0 rgba(14, 182, 233, 0.8);
}

/* 背景圆样式 */
.circle {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  /* backdrop-filter属性为一个元素后面区域添加模糊效果 */
  backdrop-filter: blur(5px);
  box-shadow: 0 25px 45px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  filter: hue-rotate(calc(var(--x) * 70deg));
  animation: animate 10s linear infinite;
  animation-delay: calc(var(--x) * -1s);
}
/* 背景圆动画 */
@keyframes animate {
  0%,
  100% {
    transform: translateY(-50px);
  }
  50% {
    transform: translateY(50px);
  }
}

.circle:nth-child(1) {
  top: 50px;
  right: 60px;
  width: 100px;
  height: 100px;
}

.circle:nth-child(2) {
  top: 150px;
  left: -30px;
  width: 120px;
  height: 120px;
  z-index: 2;
}

.circle:nth-child(3) {
  bottom: 50px;
  right: 60px;
  width: 80px;
  height: 80px;
  z-index: 2;
}
</style>