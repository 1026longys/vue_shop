<template>
    <div>
        <el-button type="info" @click="logout">退出</el-button>
    </div>
</template>

<script>
    export default {
        name: 'Home',
        methods: {
            // 退出登录
            logout() {
                // 清空token
                window.sessionStorage.clear()
                // 跳转到登录页
                this.$router.push('/login')
            },  
        }
    }
</script>

<style>

</style>