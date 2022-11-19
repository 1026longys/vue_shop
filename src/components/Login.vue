<template>
  <div class="login_container">
    <div class="login_box">
        <!-- 头像区域 -->
        <div class="avatar_box"><img src="../assets/logo.png" alt=""></div>
        <!-- 登录表单区域 -->
        <el-form :model="loginForm" :rules="loginFormRules" ref="loginFormRef" class="login_form">
            <el-form-item prop="username">
                <el-input v-model="loginForm.username" prefix-icon="el-icon-user-solid"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" type="password"></el-input>
            </el-form-item>
            <el-form-item class="btns">
                <el-button type="primary" @click="login">登录</el-button>
                <el-button type="info" @click="resetLoginForm">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script>
    export default {
        name: 'Login',
        data() {
            return {
                // 登录表单的数据绑定对象
                loginForm: {
                    username: 'admin',
                    password: '123456'
                },
                // 表单的验证规则对象
                loginFormRules: {
                    // 验证用户名是否合法
                    username: [
                        { required: true, message: '请输入活动名称', trigger: 'blur' },
                        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                    ],
                    // 验证密码是否合法
                    password: [
                        { required: true, message: '请输入活动名称', trigger: 'blur' },
                        { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            resetLoginForm() {
                // console.log(this)
                this.$refs.loginFormRef.resetFields()
            },
            // 表单预验证
            login() {
                this.$refs.loginFormRef.validate(async vaild=> {
                    if(!vaild) return;
                    //      解构赋值                           请求地址    请求参数（对象）
                    const {data: res} = await this.$http.post('login', this.loginForm)
                    // console.log(res)
                    if(res.meta.status !== 200) return this.$msg.error('登陆失败') 
                    this.$msg.success('登陆成功')

                    console.log(res)
                    // 记录token信息
                    window.sessionStorage.setItem('token', res.data.token)
                    // 跳转到Home
                    this.$router.push('/home')
                })
            }
        }
    }
</script>

<style lang="less" scoped>
.login_container {
    background-color: #2b4b6b;
    height: 100%;
    .login_box {
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 10px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        // 头像区域
        .avatar_box {
            width: 130px;
            height: 130px;
            border-radius: 50%;
            background-color: #fff;
            border: 1px solid #eee;
            box-shadow: 0 0 10px #ddd;
            padding: 10px;
            position: absolute;
            top: -50%;
            left: 50%;
            transform: translate(-50%, 50%);
            img {
                width: 100%;
                border-radius: 50%;
                background-color: #eee;
            }
        }
        // 登录表单区域
        .login_form {
            position: absolute;
            bottom: 0;
            width: 100%;
            padding: 0 30px;
            box-sizing: border-box;
            .btns {
                display: flex;
                justify-content: space-around;
            }
        }
    }
        
}
</style>