<template>
    <div>
        <!-- 面包屑导航去 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 添加按钮 -->
            <el-button type="primary" @click="showAddDialog">添加分类</el-button>
            <!-- 表格区 -->
            <tree-table class="treeTable" :data="classifyList" :columns="columns"
                        :selection-type="false" :expand-type="false"
                        :show-index="true" :border="true" :show-row-hover="false">
                <!-- 是否有效 -->
                <template v-slot:isok="{row}">
                    <i v-if="!row.cat_deleted" class="el-icon-success" style="color: lightgreen"></i>
                    <i v-if="row.cat_deleted" class="el-icon-error" style="color: red"></i>
                </template>
                <!-- 排序 -->
                <template v-slot:order="{row}">
                    <el-tag v-if="row.cat_level === 0" size="mini">一级</el-tag>
                    <el-tag v-if="row.cat_level === 1" size="mini" type="success">二级</el-tag>
                    <el-tag v-if="row.cat_level === 2" size="mini" type="warning">三级</el-tag>
                </template>
                <!-- 操作 -->
                <template v-slot:opt="{row}">
                    <!-- 修改按钮 -->
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="editClassify(row.cat_id)">修改</el-button>
                    <!-- 删除按钮 -->
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="delClassify(row.cat_id)">删除</el-button>
                </template>
            </tree-table>

            <!-- 分页 -->
            <el-pagination @current-change="handleCurrentChange" :current-page="classifyInfo.pagenum"
                :page-size="classifyInfo.pagesize" layout="total, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>

        <!-- 添加商品按钮 -->
        <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="50%" @close="addCateDialogClosed">
            <!-- 表单内容区 -->
            <el-form :model="addCateForm" :rules="addCateFormRules" ref="cateFormRef" label-width="100px">
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <!-- options: 用来指定数据源  props: 用来指定配置对象 -->
                <el-form-item label="父级分类">
                    <el-cascader v-model="selectedKeys" :options="parentCateList" 
                                :props="{ expandTrigger: 'hover', ...cascaderProps }"
                                @change="parentCateChange" clearable>
                    </el-cascader>
                </el-form-item>
            </el-form>
            <!-- 底部区 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑 -->
        <el-dialog title="修改分类" :visible.sync="editDialogVisible" width="50%">
            <!-- 表单内容区 -->
            <el-form :model="editForm" :rules="addCateFormRules" ref="cateFormRef" label-width="100px">
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="editForm.cat_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editCate(editForm.cat_id)">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 分页信息
            classifyInfo: {
                type: 3,
                pagenum: 1,
                pagesize: 5
            },
            // 总条数
            total: 0,
            // 分类列表
            classifyList: [],
            // 为 table 指定列的定义
            columns: [
                {
                    label: '分类名称',
                    prop: 'cat_name'
                },{
                    label: '是否有效',
                    // 表示降档前列定义为模板列
                    type: 'template',
                    // 表示当前这一列使用的模板名称
                    template: 'isok'
                },{
                    label: '排序',
                    type: 'template',
                    template: 'order'
                },{
                    label: '操作',
                    type: 'template',
                    template: 'opt'
                },
            ],
            // 控制添加商品分类对话框的显示与隐藏
            addDialogVisible: false,
            // 添加分类表单数据
            addCateForm: {
                // 将添加的分类名称
                cat_name: '',
                // 父元素的id，默认一级分类
                cat_pid: 0,
                // 分类的层级，默认一级分类
                cat_level: 0
            },
            // 添加表单的验证规则
            addCateFormRules: {
                cat_name: [{required: true, message: '请输入分类名称', trigger: 'blur'}]
            },
            // 父级分类的列表
            parentCateList: [],
            // 指定级联选择器的配置对象
            cascaderProps: {
                value: 'cat_id',
                label: 'cat_name',
                children: 'children',
                checkStrictly: true,
            },
            // 选中父级分类的id
            selectedKeys: [],
            // 编辑中查询
            editForm: {},
            editDialogVisible: false,
        }
    },
    created() {
        this.getClassifyList()
    },
    methods: {
        async getClassifyList() {
            const { data: res } = await this.$http.get('categories', {params: this.classifyInfo})
            if(res.meta.status !== 200) return this.$msg.error('获取分类信息失败')
            // 数据填充到分类列表中
            this.classifyList = res.data.result
            // 为总数据条数赋值
            this.total = res.data.total
            // console.log(res, this.classifyList)
        },
        // 当前页码发生改变时触发
        handleCurrentChange(newPage) {
            this.classifyInfo.pagenum = newPage
            this.getClassifyList()
        },
        // 显示添加框并渲染
        showAddDialog() {
            // 获取二级以上的所有分类
            this.getParentCateList()
            // 显示对话框
            this.addDialogVisible = true
        },
        // 获取父级分类得数据列表
        async getParentCateList() {
            const { data: res } = await this.$http.get('categories', { params: {type: 2} })
            if (res.meta.status !== 200) return this.$msg.error('获取分类信息失败')
            // 数据填充到分类列表中
            this.parentCateList = res.data
            console.log(res)
        },
        // 级联选择器变化时
        parentCateChange() {
            console.log(this.selectedKeys)
            // 是否选择父类 （二级和三级）
            if(this.selectedKeys.length > 0) {
                // 为父级分类的id赋值
                this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
                // 为当前分类的等级赋值
                this.addCateForm.cat_level = this.selectedKeys.length
                return
            }else {
                // 默认一级分类
                this.addCateForm.cat_pid = 0
                this.addCateForm.cat_level = 0
            }
        },
        // 添加分类
        addCate() {
            this.$refs.cateFormRef.validate(async valid => {
                // 预验证为 false 时
                if (!valid) return
                // 发起添加分类的网络请求
                const { data: res } = await this.$http.post('categories', this.addCateForm)
                if (res.meta.status !== 201) return this.$msg.error('添加分类失败')
                this.$msg.success('添加分类成功')
                this.getClassifyList()
                this.addDialogVisible = false
            })
        },
        // 当对话框关闭时，清空数据
        addCateDialogClosed() {
            // 清空输入框
            this.$refs.cateFormRef.resetFields()
            // 清空级联选择器
            this.selectedKeys = []
            // 重置添加分类表单中的数据
            this.addCateForm.cat_pid = 0
            this.addCateForm.cat_level = 0
        },
        // 编辑
        async editClassify(id) {
            const { data: res } = await this.$http.get('categories/'+id)
            if(res.meta.status !== 200) return this.$msg.error('获取分类失败')
            this.editForm = res.data
            this.editDialogVisible = true
        },
        editCate(id) {
            this.$refs.cateFormRef.validate(async valid => {
                // 预验证为 false 时
                if (!valid) return
                // 发起添加分类的网络请求
                const { data: res } = await this.$http.put('categories/' + id, {cat_name: this.editForm.cat_name})
                if (res.meta.status !== 200) return this.$msg.error('修改分类失败')
                this.$msg.success('修改分类成功')
                this.getClassifyList()
                this.editDialogVisible = false
            })
        },
        // 删除
        async delClassify(id){
            // 弹框提示是否删除用户
            const confirmResult = await this.$confirm(
                '此操作将永久删除该分类, 是否继续?',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err)
                
            if (confirmResult !== 'confirm') {
                return this.$msg.info('已取消删除')
            }
            const { data: res } = await this.$http.delete('categories/'+id)
            if(res.meta.status !== 200) return this.$msg.error('删除失败')
            this.$msg.success('删除成功')
            this.getClassifyList()
        }
    }
}
</script>

<style lang="less" scoped>
.treeTable{
    margin: 20px 0;
}
.el-cascader{
    width: 100%;
}
</style>