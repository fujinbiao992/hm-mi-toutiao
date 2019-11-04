<template>
  <div class="page-login">
    <van-nav-bar left-arrow @click-left="$router.back()" title="登 录"></van-nav-bar>
    <van-cell-group>
      <!-- 调用校验格式函数checkMobile -->
      <van-field
        label="手机号"
        @blur="checkMobile"
        :error-message="errMsg.mobile"
        v-model.trim="loginForm.mobile"
        placeholder="请输入手机号"
      />
      <!-- 验证码校验 -->
      <van-field
        @blur="checkCode"
        :error-message="errMsg.code"
        v-model.trim="loginForm.code"
        label="验证码"
        placeholder="请输入验证码"
      >
        <van-button class="p5" slot="button" size="mini" type="primary">发送验证码</van-button>
      </van-field>
    </van-cell-group>
    <div class="btn_box">
      <van-button type="info" @click="login" block round>登 录</van-button>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/user'
import { mapMutations } from 'vuex'
export default {
  name: 'user-login',
  data () {
    return {
      // 错误提示
      errMsg: {
        mobile: '',
        code: ''
      },
      // 表单数据
      loginForm: {
        mobile: '13911111111',
        code: '246810'
      }
    }
  },
  methods: {
    // 校验函数
    checkMobile () {
      // 1- 非空验证
      if (!this.loginForm.mobile) {
        this.errMsg.mobile = '请输入一个正确的手机号'
        return false
      }
      // 2- 格式验证
      if (!/^1[3-9]\d{9}$/.test(this.loginForm.mobile)) {
        this.errMsg.mobile = '手机号格式错误了'
        return false
      }
      this.errMsg.mobile = ''
    },
    // 校验验证码
    checkCode () {
      // 1- 非空验证
      if (!this.loginForm.code) {
        this.errMsg.code = '请输入一个正确的验证码'
        return false
      }
      // 格式校验
      if (!/^\d{6}$/.test(this.loginForm.code)) {
        this.errMsg.code = '验证码为6个数字'
        return false
      }
      this.errMsg.code = ''
    },
    ...mapMutations(['setUser']),
    // 整体校验
    async login () {
      // 整体表单的校验
      this.checkMobile()
      this.checkCode()
      // 判断校验结果
      if (this.errMsg.mobile || this.errMsg.code) {
        // 检验失败,直接return false
        return false
      }
      // 校验成功,登录
      try {
        const data = await login(this.loginForm)
        // console.log(this.setUser(data))
        // 1- 登录成功,进行提示
        this.$toast({ type: 'success', message: '登录成功' })
        // 2- 保存token
        this.setUser(data)
        // 3- 根据地址栏是否有跳转的地址,有的话就执行回调,没有,那么回到user
        const url = this.$route.query.redirect || '/user'
        this.$router.push(url)
      } catch (e) {
        // 4- 进行错误提示
        this.$toast({ type: 'fail', message: '登录失败' })
      }
    }
  }
}
</script>

<style scoped lang='less'>
.p5 {
  padding: 0 5px;
}
.btn_box {
  padding: 10px;
  .van-button {
    height: 32px;
    line-height: 30px;
  }
}
</style>
