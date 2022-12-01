<template>
    <div>
        <!-- 面包屑导航去 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        
        <!-- 卡片视图区 -->
        <el-card>
            <!-- 搜索与添加 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @change="getGoodsList">
                        <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4"><el-button type="primary" @click="goAddPage">添加商品</el-button></el-col>
            </el-row>

            <!-- 表格区域 -->
            <el-table :data="goodsList" border stripe>
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column label="商品名称" prop="goods_name"></el-table-column>
                <el-table-column label="商品价格(元)" prop="goods_price" width="95px"></el-table-column>
                <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
                <el-table-column label="创建时间" prop="add_time" width="140px">
                    <template v-slot="{row}">
                        {{ row.add_time | dataFormat }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120px">
                    <template v-slot="{row}">
                        <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="delGoods(row.goods_id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" 
                            :current-page="queryInfo.pagenum" background
                            :page-sizes="[8, 10, 15, 20]" :page-size="queryInfo.pagesize" 
                            layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 获取商品列表的参数对象
            queryInfo: {
                // 搜索关键字
                query: '',
                // 当前页数
                pagenum: 1,
                // 每页展示几条数据
                pagesize: 8,
            },
            // 商品列表
            goodsList: [],
            // 总数据条数
            total: 0,
        }
    },
    created() {
        this.getGoodsList()
    },
    methods: {
        // 获取商品列表
        async getGoodsList() {
            const { data: res } = await this.$http.get('goods', { params: this.queryInfo})
            if(res.meta.status !== 200) return this.$msg.error('获取商品列表数据失败')
            this.goodsList = res.data.goods
            // 商品总数据
            this.total = res.data.total
            // console.log(res.data, this.goodsList)
        },
        // 每页展示数据条数发生改变时触发
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getGoodsList()
        },
        // 当前页码发生改变时触发
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            this.getGoodsList()
        },
        // 跳转到添加页面
        goAddPage() {
            this.$router.push('/add')
        },
        // 删除
        async delGoods(id) {
            // 弹框提示是否删除用户
            const confirmResult = await this.$confirm(
                '此操作将永久删除该商品, 是否继续?',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err)

            if (confirmResult !== 'confirm') {
                return this.$msg.info('已取消删除')
            }
            const { data: res } = await this.$http.delete('goods/'+id)
            if(res.meta.status !== 200) return this.$msg.error('删除商品失败')
            this.$msg.success('删除商品成功')
            this.getGoodsList()
        },
    },
}
</script>

<style>

</style>