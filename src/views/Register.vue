<template>
  <div class="registerAll">
    <div class="back" @click="back">返回</div>
    <div class="register">
      <!-- 背景圆 -->
      <div class="circle" style="--x: 0"></div>
      <div class="circle" style="--x: 1"></div>
      <div class="circle" style="--x: 2"></div>

      <div class="registerArea">
        <!-- 头部 -->
        <div class="header">
          <div class="title">网易云注册界面</div>
        </div>

        <!-- 登录表单 -->
        <div class="form">
          <van-form @submit="register">
            <van-field
              v-model="phone"
              name="手机号"
              label="手机号"
              placeholder="手机号"
              :rules="[{ required: true, message: '请填写手机号' }]"
            />
            <van-field
              v-model="password"
              type="password"
              name="密码"
              label="密码"
              placeholder="密码"
              :rules="[{ required: true, message: '请填写密码' }]"
            />

            <van-field
              v-model="nickname"
              name="昵称"
              label="昵称"
              placeholder="昵称"
              :rules="[{ required: true, message: '请填写昵称' }]"
            />

            <van-field
              v-model="captcha"
              name="验证码"
              label="验证码"
              placeholder="验证码"
              :rules="[{ required: true, message: '请填写验证码' }]"
            />

            <span style="margin: 16px">
              <van-button round block type="info" native-type="submit"
                >注册</van-button
              >
            </span>
            <span @click="check" class="check">昵称检测</span>
            <span @click="send" class="send">获取验证码</span>
          </van-form>
        </div>
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
      // 验证码
      captcha: "",
      // 手机号码
      phone: "",
      // 密码
      password: "",
      // 昵称
      nickname: "",
    };
  },
  methods: {
    // 昵称检测
    async check() {
      let data = {
        nickname: this.nickname,
      };
      if (!this.nickname) {
        Dialog.confirm({
          title: "error",
          message: "请输入昵称",
        }).then(() => {});
      } else {
        let res = await get("/nickname/check", data);
        // console.log(res);
        if (!res.duplicated) {
          Dialog.confirm({
            title: "succeed",
            message: "昵称没人占用,请继续你的步骤",
          }).then(() => {});
        } else {
          Dialog.confirm({
            title: "error",
            message: "昵称已被占用，请重新输入",
          }).then(() => {});
        }
      }
    },
    // 发送验证码
    async send() {
      let phoneReg = /^1(3[0-9]|5[0-3,5-9]|7[1-3,5-8]|8[0-9])\d{8}$/;
      let data = {
        phone: this.phone,
      };
      if (phoneReg.test(this.phone)) {
        let res = await get("/captcha/sent", data);
        // console.log(res.message);
        if (res.code !== 200) {
          Dialog.alert({
            message: res.message,
          }).then(() => {
            // on close
          });
        } else {
          Dialog.alert({
            message: "验证码发送成功！",
          }).then(() => {
            // on close
          });
        }
        // });
      } else {
        Dialog.confirm({
          title: "error",
          message: "您输入的手机号格式错误",
        }).then(() => {
          // on confirm
        });
      }
    },
    async register() {
      let phone = this.phone;
      let data = {
        phone: this.phone,
        password: this.password,
        captcha: this.captcha,
        nickname: this.nickname,
      };
      // 正则表达式判断手机号是否合法
      let phoneReg = /^1(3[0-9]|5[0-3,5-9]|7[1-3,5-8]|8[0-9])\d{8}$/;
      if (phoneReg.test(phone)) {
        let res = await get("/register/cellphone", data);
        // console.log(res);
        if (res.code == 200) {
          Dialog.alert({
            title: "succeed",
            message: "注册成功，将跳转至登陆界面",
          }).then(() => {
            // on confirm
            this.$router.push("/");
          });
        } else {
          Dialog.confirm({
            title: "error",
            message: "注册失败，请重新进行注册",
          }).then(() => {
            (this.phone = ""),
              (this.password = ""),
              (this.captcha = ""),
              (this.nickname = "");
          });
        }
      }
    },
    // 返回登陆界面
    back() {
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.back {
  font-size: 20px;
  color: white;
  position: absolute;
  top: 5px;
  left: 5px;
}
/* 底部验证框 */
.send {
  color: white;
  margin-top: 2px;
  text-align: center;
  float: right;
}
.check {
  color: white;
  float: left;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.registerAll {
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
  z-index: 99;
}
/* 登录表单 */
.register .registerArea .form {
  z-index: 98;
  position: relative;
  width: 350px;
  min-height: 150px;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 8px 0 rgba(14, 182, 233, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.5);
}
/* 头部标题的样式 */
.register .registerArea .title {
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
.register .registerArea .title::before {
  content: "";
  position: absolute;
  /* left: 110px; */
  left: 50%;
  margin-left: -30%;
  bottom: -10px;
  width: 0px;
  height: 3px;
  background: #fff;
  transition: 0.5s;
  width: 60%;
}

.register .registerArea .title:hover:before {
  width: 0;
}
.registerArea .van-cell {
  margin-top: 10px;
  height: 45px;
  background-color: transparent;
  color: #86ccfb;
}
.registerArea .van-button--info {
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