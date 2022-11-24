<template>
    <div>
        <!-- 面包屑导航去 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <el-table :data="rightsList" style="width: 100%" border stripe>
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column prop="authName" label="权限名称">
                </el-table-column>
                <el-table-column prop="path" label="路径">
                </el-table-column>
                <el-table-column prop="level" label="权限等级">
                    <template v-slot="{row}">
                        <el-tag v-if="row.level === '0'">一级</el-tag>
                        <el-tag v-if="row.level === '1'" type="success">二级</el-tag>
                        <el-tag v-if="row.level === '2'" type="warning">三级</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

    </div>
</template>

<script>
export default {
    data() {
        return {
            // 权限列表
            rightsList: [],
        }
    },
    methods: {
        // 发送请求，获取权限列表
        async getRightsList() {
            const { data: res } = await this.$http.get('rights/list')
            if (res.meta.status !== 200) return this.$msg.error('获取权限列表失败')
            this.rightsList = res.data
            console.log(res, this.rightsList)
        }
    },
    created() {
        // 获取所有权限
        this.getRightsList()
    }
}
</script>

<style>

</style>