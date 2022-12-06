<template>
    <el-container class="home-container">
        <!-- 头部Header区域 -->
        <el-header>
            <div>
                <img src="../assets/logo.png" alt="">
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <!-- 页面主体区域 -->
        <el-container>
            <!-- 侧边栏 -->
            <el-aside :width="isCollapse ? '64px' : '200px'">
                <!-- 展开收缩 -->
                <div class="toggle-button" @click="toggleCollapse">≡≡</div>
                <!-- 侧边栏菜单区域 -->
                <el-menu background-color="#333744" 
                        text-color="#fff" 
                        active-text-color="#409EFF" 
                        unique-opened
                        :collapse="isCollapse" :collapse-transition="false"
                        router
                        :default-active="activePath">
                    <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id" >
                        <!-- 一级菜单 -->
                        <template slot="title">
                            <i :class="iconObj[item.id]"></i>
                            <span>{{item.authName}}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item :index="subItem.path" 
                                    v-for="subItem in item.children" :key="subItem.id"
                                    @click="saveNavState(subItem.path)">
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{ subItem.authName }}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 右侧内容区域 -->
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        name: 'Home',
        data() {
            return {
                // 菜单列表
                menuList: [],
                // 是否水平折叠收起菜单
                isCollapse: false,
                // 图标对象
                iconObj: {
                    '125': 'iconfont icon-user',
                    '103': 'iconfont icon-tijikongjian',
                    '101': 'iconfont icon-shangpin',
                    '102': 'iconfont icon-danju',
                    '145': 'iconfont icon-baobiao',
                },
                // 激活链接的地址
                activePath: '',
            }
        },
        created() {
            // 获取菜单列表信息
            this.getMenuList()
            this.activePath = window.sessionStorage.getItem('activePath')
        },
        methods: {
            // 退出登录
            logout() {
                // 清空token
                window.sessionStorage.clear()
                // 跳转到登录页
                this.$router.push('/login')
            }, 
            // 获取菜单列表信息 
            async getMenuList() {
                const { data : res } = await this.$http.get('menus')
                if(res.meta.status !== 200) return this.$message.error('获取菜单列表失败！')
                this.menuList = res.data
                console.log(res)
            },
            // 切换展开收缩按钮
            toggleCollapse() {
                this.isCollapse = !this.isCollapse
            },
            // 获取index的值并保存在session中
            saveNavState(activePath) {
                window.sessionStorage.setItem('activePath', activePath)
                this.activePath = activePath
            }
        },
    }
</script>

<style lang="less" scoped>
.home-container {
    height: 100%;
}
// 头部
.el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    font-size: 20px;
    div {
        display: flex;
        align-items: center;
        img {
            width: 50px;
        }
        span{
            margin-left: 15px;
        }
    }
}
// 侧边栏
.el-aside {
    background-color: #333744;
    transition: 0.5s;
    // 展开收缩切换按钮
    .toggle-button {
        background-color: #4a5064;
        color: #fff;
        text-align: center;
        cursor: pointer;
        line-height: 24px;
        font-size: 20px;
        letter-spacing: -4px;
    }
    .el-menu {
        border-right: none;
    }
}
// 主内容区
.el-main{
    background-color: #eaedf1;
}
// 图标
.iconfont {
    margin-right: 10px;
}
</style>