<template>
    <div>
        <!-- 面包屑导航去 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区 -->
        <el-card>
            <!-- 警告区域 -->
            <el-alert title="注意：只允许为三级分类设置相关参数" type="warning" :closable="false" show-icon>
            </el-alert>
            <!-- 选择商品分类区域 -->
            <el-row class="cat_opt">
                <el-col :span="12">
                    <span>选择商品分类：</span>
                    <!-- 选择商品分类的级联选择框 -->
                    <el-cascader v-model="selectedCateKeys" :options="cateList" 
                                :props="{ expandTrigger: 'hover', ...cateProps }" 
                                @change="handleChange">
                    </el-cascader>
                </el-col>
            </el-row>
            <!-- tab 页签区域 -->
            <el-tabs v-model="activeName" @tab-click="handleTabsClick">
                <!-- 添加动态参数的面板 -->
                <el-tab-pane label="动态参数" name="many">
                    <!-- 添加参数的按钮 -->
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加参数</el-button>
                    <!-- 动态参数表格 -->
                    <el-table :data="manyTableList" border stripe>
                        <!-- 展开行 -->
                        <el-table-column type="expand">
                            <template v-slot="{row}">
                                <el-tag size="medium" :key="i" v-for="(item, i) in row.attr_vals" closable :disable-transitions="false" 
                                        @close="handleClosed(i, row)">
                                    {{item}}
                                </el-tag>
                                <el-input class="input-new-tag" v-if="row.inputVisible" v-model="row.inputValue" ref="saveTagInput" size="small"
                                    @keyup.enter.native="handleInputConfirm(row)" @blur="handleInputConfirm(row)">
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index" label="序号"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template v-slot="{row}">
                                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(row.attr_id)">编辑</el-button>
                                <el-button size="mini" type="danger" icon="el-icon-delete" @click="delParams(row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <!-- 添加静态属性的面板 -->
                <el-tab-pane label="静态管理" name="only">
                    <!-- 添加属性的按钮 -->
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加属性</el-button>
                    <!-- 动态参数表格 -->
                    <el-table :data="onlyTableList" border stripe>
                        <!-- 展开行 -->
                        <el-table-column type="expand">
                            <template v-slot="{row}">
                                <el-tag size="medium" :key="i" v-for="(item, i) in row.attr_vals" closable :disable-transitions="false"
                                        @close="handleClosed(i, row)">
                                    {{item}}
                                </el-tag>
                                <el-input class="input-new-tag" v-if="row.inputVisible" v-model="row.inputValue" ref="saveTagInput" size="small"
                                    @keyup.enter.native="handleInputConfirm(row)" @blur="handleInputConfirm(row)">
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index" label="序号"></el-table-column>
                        <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template v-slot="{row}">
                                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(row.attr_id)">编辑</el-button>
                                <el-button size="mini" type="danger" icon="el-icon-delete" @click="delParams(row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>

        <!-- 添加 -->
        <el-dialog :title="'添加'+titleText" :visible.sync="addDialogVisible" width="50%" @close="addDialogColsed">
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParams">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑 -->
        <el-dialog :title="'修改'+titleText" :visible.sync="editDialogVisible" width="50%">
            <el-form :model="editForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="editForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editParams">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 商品分类列表
            cateList: [],
            // 级联选择框的配置对象
            cateProps: {
                value: 'cat_id',
                label: 'cat_name',
                children: 'children'
            },
            // 级联选择框双向绑定的数组
            selectedCateKeys: [],
            // 被激活的页签名称
            activeName: 'many',
            // 分类动态参数列表
            manyTableList: [],
            // 分类静态属性列表
            onlyTableList: [],
            // 添加框的显示与隐藏
            addDialogVisible: false,
            // 添加表单的数据
            addForm: {
                attr_name: '',
            },
            // 添加表单的规则
            addFormRules: {
                attr_name: [{required: true, message: '请输入参数', trigger: 'blur'}]
            },
            // 编辑表单的数据
            editForm: {},
            // 编辑框的显示与隐藏
            editDialogVisible: false,

        }
    },
    created() {
        this.getCateList()
    },
    methods: {
        // 获取所有的商品分类列表
        async getCateList() {
            const { data: res } = await this.$http.get('categories')
            if (res.meta.status !== 200) return this.$message.error('获取分类信息失败')
            // 数据填充到分类列表中
            this.cateList = res.data
        },
        // 级联选择框变化时，会触发这个函数
        handleChange() {
            this.getParamsData()
        },
        // tabs 页签点击事件的处理函数
        handleTabsClick() {
            this.getParamsData()
        },
        // 获取参数的列表数据
        async getParamsData() {
            if (this.selectedCateKeys.length !== 3) {
                this.selectedCateKeys = []
                this.manyTableList = []
                this.onlyTableList = []
                return
            }
            // 根据所选分类的id，和当前所处的面板，发送请求，获取对应的参数
            const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`,
            { params: { sel: this.activeName } })
            if (res.meta.status !== 200) return this.$message.error('获取参数失败')

            res.data.forEach(item=> {
                item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
                // 控制按钮与文本框的切换显示
                item.inputVisible = false
                // 文本框中输入的内容
                item.inputValue = ''
            })

            console.log(res.data)
            if(this.activeName === 'many'){
                this.manyTableList = res.data
            }else{
                this.onlyTableList = res.data
            }
        },
        // 添加
        addParams() {
            this.$refs.addFormRef.validate(async valid => {
                // 预验证为 false 时
                if (!valid) return
                // 发起添加参数的网络请求
                const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, 
                    {
                        attr_name: this.addForm.attr_name,
                        attr_sel: this.activeName
                    })
                if (res.meta.status !== 201) return this.$message.error('添加参数失败！')
                this.$message.success('添加参数成功！')
                // 添加成功后隐藏表单
                this.addDialogVisible = false
                // 重新渲染列表
                this.getParamsData()
            })
        },
        // 关闭对话框，重置表单
        addDialogColsed() {
            this.$refs.addFormRef.resetFields()
        },
        // 修改
        async showEditDialog(id) {
            const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${id}`, 
            {   params: {
                    attr_sel: this.activeName
                }
            })
            if(res.meta.status !== 200) return this.$message.error('获取参数数据失败')
            this.editForm = res.data
            this.editDialogVisible = true
            console.log(res.data)
        },
        editParams() {
            this.$refs.addFormRef.validate(async valid => {
                // 预验证为 false 时
                if (!valid) return
                // 发起添加参数的网络请求
                const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
                    {
                        attr_name: this.editForm.attr_name,
                        attr_sel: this.activeName,
                    })
                if (res.meta.status !== 200) return this.$message.error('更新参数失败！')
                this.$message.success('更新参数成功！')
                // 重新渲染列表
                this.getParamsData()
                // 添加成功后隐藏表单
                this.editDialogVisible = false
            })
        },
        // 删除
        async delParams(id) {
            // 弹框提示是否删除参数
            const confirmResult = await this.$confirm(
                '此操作将永久删除该参数, 是否继续?',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err)
            if (confirmResult !== 'confirm') {
                return this.$message.info('已取消删除')
            }
            const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
            if (res.meta.status !== 200) return this.$message.error('删除参数失败！')
            this.$message.success('删除参数成功！')
            // 重新渲染列表
            this.getParamsData()
        },
        // 显示输入框
        showInput(row) {
            row.inputVisible = true
            // $nextTick ：当页面元素被重新渲染之后，才会执行回调函数中的代码
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        // 按下 enter 或文本框失去焦点时触发
        handleInputConfirm(row) {
            if(row.inputValue.trim().length === 0) {
                row.inputValue = ''
                row.inputVisible = false
                return
            }
            // 有效输入
            row.attr_vals.push(row.inputValue.trim())
            row.inputValue = ''
            row.inputVisible = false
            this.saveAttrVals(row)
        },
        async saveAttrVals(row) {
            const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,
                {
                    attr_name: row.attr_name,
                    attr_sel: row.attr_sel,
                    attr_vals: row.attr_vals.join(' '),

                })
            if (res.meta.status !== 200) return this.$message.error('更新参数失败！')
            this.$message.success('更新参数成功！')
        },
        // 删除vals
        handleClosed(i, row) {
            row.attr_vals.splice(i, 1)
            this.saveAttrVals(row)
        }
    },
    computed: {
        // 是否启用按钮
        isBtnDisabled() {
            return this.selectedCateKeys.length !== 3
        },
        // 当前选中的三级分类的id
        cateId() {
            if(this.selectedCateKeys.length === 3) {
                return this.selectedCateKeys[this.selectedCateKeys.length - 1]
            }
        },
        // 动态计算标题文本
        titleText() {
            if (this.activeName === "many") {
                return '动态参数'
            }else{
                return '静态属性'
            }
        }
    },
}
</script>

<style lang="less" scoped>
.cat_opt {
    margin: 15px 0;
}
.el-tag {
    margin: 10px;
}
.input-new-tag {
    width: 120px;
}
</style>