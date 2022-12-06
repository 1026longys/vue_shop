<template>
    <div>
        <!-- 面包屑导航去 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        
        <!-- 卡片视图区 -->
        <el-card>
            <!-- 警告区 -->
            <el-alert title="添加商品信息" type="info" show-icon center :closable="false">
            </el-alert>
            <!-- 步骤条区域 -->
            <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
                <!-- tabs标签页 -->
                <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave="beforeTabLeave" @tab-click="tabClicked">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addForm.goods_number" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                            <!-- 选择商品分类的级联选择框 -->
                            <el-cascader v-model="addForm.goods_cat" :options="cateList" :props="{ expandTrigger: 'hover', ...cateProps }"
                                @change="handleChange">
                            </el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox :label="vals" v-for="(vals, i) in item.attr_vals" :key="i" border size="small"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <el-upload :action="uploadURL" 
                                    :on-preview="handlePreview"
                                    :on-remove="handleRemove" 
                                    list-type="picture" :headers="headersObj"
                                    :on-success="handleSuccess">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <!-- 富文本编辑器 -->
                        <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                        <!-- 添加商品按钮 -->
                        <el-button type="primary" @click="addGoods" class="btnAdd">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>

        <!-- 图片预览 -->
        <el-dialog title="图片预览" :visible.sync="picDialogVisible" width="50%">
            <img :src="previewPath" alt="" class="previewImg">
        </el-dialog>
    </div>
</template>

<script>
import _ from 'lodash'
export default {
    data() {
        return {
            activeIndex: '0', 
            // 添加商品的表单数据对象
            addForm: {
                goods_name: '',
                goods_price: 0,
                goods_weight: 0,
                goods_number: 0,
                // 商品所属的分类列表
                goods_cat: [],
                // 商品图片
                pics: [],
                // 商品介绍
                goods_introduce: '',
                attrs: []
            },
            // 验证规则
            addFormRules: {
                goods_name: [{required: true, message: '请输入商品名称', trigger: 'blur'}],
                goods_price: [{required: true, message: '请输入商品价格', trigger: 'blur'}],
                goods_weight: [{required: true, message: '请输入商品重量', trigger: 'blur'}],
                goods_number: [{required: true, message: '请输入商品数量', trigger: 'blur'}],
                goods_cat: [{ required: true, message: '请选择商品分类', trigger: 'blur' }]
            }, 
            // 商品分类列表
            cateList: [],
            // 级联选择框的配置对象
            cateProps: {
                value: 'cat_id',
                label: 'cat_name',
                children: 'children'
            },
            // 动态参数列表数据
            manyTableData: [],
            // 静态属性列表数据
            onlyTableData: [],
            // 上传图片的地址
            uploadURL: 'https://lianghj.top:8888/api/private/v1/upload',
            // 图片上传组件的 headers 请求头对象
            headersObj: {
                Authorization: window.sessionStorage.getItem('token'),
            },
            previewPath: ' ',
            picDialogVisible: false,
        }
    },
    created() {
        this.getCateList()
    },
    methods: {
        async getCateList() {
            const { data: res } = await this.$http.get('categories')
            if (res.meta.status !== 200) return this.$message.error('获取分类信息失败')
            // 数据填充到分类列表中
            this.cateList = res.data
        },
        handleChange() {
            // console.log(this.addForm.goods_cat)
            if (this.addForm.goods_cat.length !== 3) {
                this.addForm.goods_cat = []
                return
            }
        },
        // 切换标签页是触发
        beforeTabLeave(activeName, oldActiveName) {
            if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
                this.$message.error('请先选择商品分类！');
                return false
            }
        },
        // 点击标签页时
        async tabClicked() {
            // 动态参数列表
            if(this.activeIndex === '1'){
                const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`,
                    { params: { sel: 'many' } })
                if (res.meta.status !== 200) return this.$message.error('获取商品参数列表失败')
                // console.log(res.data)
                res.data.forEach(item => {
                    item.attr_vals = item.attr_vals !== 0 ? item.attr_vals.split(' ') : []
                })
                this.manyTableData = res.data
            }else if(this.activeIndex === '2') {         // 静态属性列表
                const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`,
                    { params: { sel: 'only' } })
                if (res.meta.status !== 200) return this.$message.error('获取商品参数列表失败')
                console.log(res.data)
                this.onlyTableData = res.data
            }
        },
        // 处理图片预览效果
        handlePreview(file) {
            this.previewPath = file.response.data.url
            this.picDialogVisible = true
            console.log(file, this.previewPath)
        },
        // 处理移出图片的操作
        handleRemove(file) {
            // 1．获取将要删除的图片的临时路径
            const picPath = file.response.data.tmp_path
            // 2．从pics数组中，找到这个图片对应的索引值
            const index = this.addForm.pics.findIndex(i=> i.pic === picPath)
            // 3．调用数组的splice方法，把图片信息对象，从pics数组中移除
            this.addForm.pics.splice(index, 1)
            // console.log(this.addForm)
        },
        // 监听图片上传成功的事件
        handleSuccess(response) {
            // 1.拼接得到一个图片信息对象
            const picInfo = { pic: response.data.tmp_path }
            // 2.将图片信息对象push到pics数组中
            this.addForm.pics.push(picInfo)
            // console.log(this.addForm)
        },
        // 添加商品
        addGoods() {
            this.$refs.addFormRef.validate(async vaild=> {
                if(!vaild) return this.$message.error('请填写必要的表单项！')
                // 深拷贝
                const form = _.cloneDeep(this.addForm)
                form.goods_cat  = form.goods_cat.join(',')
                // 处理动态参数
                this.manyTableData.forEach(item=> {
                    const newInfo = {
                        attr_id: item.attr_id,
                        attr_value: item.attr_vals.join(' ')
                    }               
                    this.addForm.attrs.push(newInfo)     
                })
                // 处理静态属性
                this.onlyTableData.forEach(item => {
                    const newInfo = {
                        attr_id: item.attr_id,
                        attr_value: item.attr_vals
                    }               
                    this.addForm.attrs.push(newInfo)         
                })
                form.attrs = this.addForm.attrs
                console.log(form, form.attrs)
                const { data: res } = await this.$http.post('goods', form)
                if(res.meta.status !== 201) return this.$message.error('添加商品失败！')
                this.$message.success('添加商品成功！')
                this.$router.push('/goods')
            })
        }
    },
    computed: {
        cateId() {
            if (this.addForm.goods_cat.length === 3) {
                return this.addForm.goods_cat[this.addForm.goods_cat.length - 1]
            }
            return null
        }
    }
}
</script>

<style lang="less" scoped>
.el-steps {
    margin: 15px 0; 
}
.el-checkbox {
    margin: 0 10px 0 0 !important;
}
.previewImg {
    width: 100%;
}
.btnAdd {
    margin-top: 15px
}
</style>