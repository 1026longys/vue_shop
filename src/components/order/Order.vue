<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        
        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 搜索 -->
            <el-row>
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @change="getOrdersList">
                        <el-button slot="append" icon="el-icon-search" @click="getOrdersList"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <!-- 列表 -->
            <el-table :data="ordersList" border stripe>
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column label="订单编号" prop="order_number"></el-table-column>
                <el-table-column label="订单价格" prop="order_price" width="100px"></el-table-column>
                <el-table-column label="是否付款" prop="pay_status" width="100px">
                    <template v-slot="{row}">
                        <el-tag v-if="row.pay_status === '0'" type="danger">未付款</el-tag>
                        <el-tag v-if="row.pay_status === '1'" type="primary">已付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="是否发货" prop="is_send" width="100px"></el-table-column>
                <el-table-column label="下单时间" prop="create_time" width="150px">
                    <template v-slot="{row}">
                        {{ row.create_time | dataFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="130px">
                    <template>
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showDialog"></el-button>
                        <el-button type="success" icon="el-icon-location-outline" size="mini" @click="showProgressBox"></el-button>
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

        <!-- 修改地址对话框 -->
        <el-dialog title="修改地址" :visible.sync="addressDialogVisible" width="50%" @close="addressDialogColsed">
            <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
                <el-form-item label="省市区/县" prop="address1">
                    <el-cascader v-model="addressForm.address1" :options="cityData"></el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="address2">
                    <el-input v-model="addressForm.address2"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addressDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addressDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 展示物流进度的对话框 -->
        <el-dialog title="物流进度" :visible.sync="progressDialogVisible" width="50%">
            <!-- 时间线 -->
            <el-timeline>
                <el-timeline-item v-for="(activity, index) in progressInfo" :key="index" :timestamp="activity.time">
                    {{ activity.context }}
                </el-timeline-item>
            </el-timeline>
        </el-dialog>
    </div>
</template>

<script>
import cityData from './citydata'
export default {
    data() {
        return {
            // 获取订单列表的参数对象
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 8,
            },
            // 订单列表
            ordersList: [],
            // 总数据条数
            total: 0,
            // 控制修改地址对话框的显示与隐藏
            addressDialogVisible: false,
            // 添加表单数据
            addressForm: {
                address1: [],
                address2: ''
            },
            // 校验规则
            addressFormRules: {
                address1: [{required: true, message: '请选择省市区县', trigger: 'blur'}],
                address2: [{required: true, message: '请填写详细地址', trigger: 'blur'}]
            },
            cityData,
            // 控制显示物流进度对话框的显示与隐藏
            progressDialogVisible: false,
            // 物流信息
            progressInfo: [],
        }
    },
    created(){
        this.getOrdersList()
    },
    methods: {
        // 获取订单数据列表
        async getOrdersList() {
            const { data: res } = await this.$http.get('orders', {params: this.queryInfo})
            if(res.meta.status !== 200) return this.$msg.error('获取订单数据失败！')
            this.ordersList = res.data.goods
            this.total = res.data.total
            // console.log(res.data)
        },
        // 每页展示数据条数发生改变时触发
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getOrdersList()
        },
        // 当前页码发生改变时触发
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            this.getOrdersList()
        },
        // 展示修改地址对话框
        showDialog() {
            this.addressDialogVisible = true
        },
        // 级联选择器关闭时，重置表单
        addressDialogColsed() {
            this.$refs.addressFormRef.resetFields()
        },
        async showProgressBox() {
            const { data: res } = await this.$http.get('/kuaidi/1106975712662')
            if(res.meta.status !== 200) return this.$msg.error('获取物流信息失败！')
            this.$msg.success('物流信息获取成功！')
            this.progressInfo = res.data
            // this.progressInfo = [
            //   {
            //     time: '2018-05-10 09:39:00',
            //     ftime: '2018-05-10 09:39:00',
            //     context: '已签收,感谢使用顺丰,期待再次为您服务',
            //     location: ''
            //   },
            //   {
            //     time: '2018-05-10 08:23:00',
            //     ftime: '2018-05-10 08:23:00',
            //     context: '[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件',
            //     location: ''
            //   },
            //   {
            //     time: '2018-05-10 07:32:00',
            //     ftime: '2018-05-10 07:32:00',
            //     context: '快件到达 [北京海淀育新小区营业点]',
            //     location: ''
            //   },
            //   {
            //     time: '2018-05-10 02:03:00',
            //     ftime: '2018-05-10 02:03:00',
            //     context: '快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]',
            //     location: ''
            //   },
            //   {
            //     time: '2018-05-09 23:05:00',
            //     ftime: '2018-05-09 23:05:00',
            //     context: '快件到达 [北京顺义集散中心]',
            //     location: ''
            //   },
            //   {
            //     time: '2018-05-09 21:21:00',
            //     ftime: '2018-05-09 21:21:00',
            //     context: '快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]',
            //     location: ''
            //   },
            //   {
            //     time: '2018-05-09 13:07:00',
            //     ftime: '2018-05-09 13:07:00',
            //     context: '顺丰速运 已收取快件',
            //     location: ''
            //   },
            //   {
            //     time: '2018-05-09 12:25:03',
            //     ftime: '2018-05-09 12:25:03',
            //     context: '卖家发货',
            //     location: ''
            //   },
            //   {
            //     time: '2018-05-09 12:22:24',
            //     ftime: '2018-05-09 12:22:24',
            //     context: '您的订单将由HLA（北京海淀区清河中街店）门店安排发货。',
            //     location: ''
            //   },
            //   {
            //     time: '2018-05-08 21:36:04',
            //     ftime: '2018-05-08 21:36:04',
            //     context: '商品已经下单',
            //     location: ''
            //   }
            // ]
            this.progressDialogVisible = true
            console.log(this.progressInfo)
        }
    },
}
</script>

<style>
.el-cascader {
    width: 100%;
}
</style>