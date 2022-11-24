<template>
    <div>
        <!-- 面包屑导航去 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>角色管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
            <el-table :data="rolesList" border stripe>
                <!-- 展开列 -->
                <el-table-column type="expand" >
                    <template v-slot="{row}">
                        <el-row :class="['bdbottom', 'vcenter', i1 === 0 ? 'bdtop' : '']"
                            v-for="(item1, i1) in row.children" :key="item1.id">
                            <!-- 渲染一级权限 -->
                            <el-col :span="5">
                                <el-tag closable @close="delRightById(row, item1.id)">
                                    {{ item1.authName }}
                                </el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染二级与三级权限 -->
                            <el-col :span="19">
                                <el-row :class="['vcenter', i2 === 0 ? '' : 'bdtop']" 
                                    v-for="(item2, i2) in item1.children" :key="item2.id">
                                    <!-- 二级权限 -->
                                    <el-col :span="6">
                                        <el-tag type="success" 
                                            closable @close="delRightById(row, item2.id)">
                                            {{ item2.authName }}
                                        </el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <!-- 三级权限 -->
                                    <el-col :span="18">
                                        <el-tag type="warning" 
                                            v-for="item3 in item2.children" :key="item3.id"
                                            closable @close="delRightById(row, item3.id)">
                                            {{ item3.authName }}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column prop="roleName" label="角色名称"></el-table-column>
                <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
                <el-table-column label="操作" width="290px" min-width="280px">
                    <template v-slot="{row}">
                        <!-- 修改按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(row.id)">编辑</el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="delRoles(row.id)">删除</el-button>
                        <!-- 分配角色按钮 -->
                        <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 添加角色对话框 -->
            <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
                <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
                    <el-form-item label="角色名称" prop="roleName">
                        <el-input v-model="addForm.roleName"></el-input>
                    </el-form-item>
                    <el-form-item label="角色描述" prop="roleDesc">
                        <el-input v-model="addForm.roleDesc"></el-input>
                    </el-form-item>
                </el-form>
                <!-- 底部区域 -->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addRoles">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 编辑角色对话框 -->
            <el-dialog title="编辑角色" :visible.sync="editDialogVisible" width="50%" @close="addDialogClose">
                <el-form :model="editForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
                    <el-form-item label="角色名称" prop="roleName">
                        <el-input v-model="editForm.roleName"></el-input>
                    </el-form-item>
                    <el-form-item label="角色描述" prop="roleDesc">
                        <el-input v-model="editForm.roleDesc"></el-input>
                    </el-form-item>
                </el-form>
                <!-- 底部区域 -->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="editRoles">确 定</el-button>
                </span>
            </el-dialog>

            <!-- 分配权限对话框 -->
            <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" 
                @close="setRightDialogClosed">
                <!-- 树形控件 -->
                <el-tree :data="rightList" :props="treeProps" 
                        show-checkbox
                        node-key="id"
                        default-expand-all
                        :default-checked-keys="defKeys"
                        ref="treeRef"
                >
                </el-tree>
                <!-- 底部区域 -->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="setRightDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="setRight">确 定</el-button>
                </span>
            </el-dialog>
        </el-card>

    </div>
</template>

<script>
export default {
    data() {
        return {
            rolesList: [],
            addDialogVisible: false,
            // 添加角色的表单数据
            addForm: {
                roleName: '',
                roleDesc: ''
            },
            // 添加表单的验证规则对象
            addFormRules: {
                roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' },],
                roleDesc: [{ required: true, message: '请输入角色描述', trigger: 'blur' },]
            },
            // 控制修改用户对话框的显示与隐藏
            editDialogVisible: false,
            // 查询到的用户信息
            editForm: {},
            // 控制分配权限对话框的显示与隐藏
            setRightDialogVisible: false,
            // 获取到的权限列表数据
            rightList: [],
            // 树形控件的绑定对象
            treeProps: {
                label: 'authName',   // 看到的哪一个属性
                children: 'children'
            },
            // 默认选中的节点id值
            defKeys: [],
            // 当前即将分配角色的id
            roleId: '',
        }
    },
    mounted() {
        this.getRolesList()
    },
    methods: {
        // 获取角色列表
        async getRolesList() {
            const { data: res } = await this.$http.get('roles')
            if(res.meta.status !== 200) return this.$msg.error('获取角色信息失败')
            this.rolesList = res.data
            // console.log(res, this.rolesList)
        },
        addDialogClose() {
            this.$refs.addFormRef.resetFields()
        },
        // 添加角色
        addRoles() {
            this.$refs.addFormRef.validate(async valid=> {
                if(!valid) return
                const { data: res } = await this.$http.post('roles', this.addForm)
                if(res.meta.status !== 201) return this.$msg.error('添加角色失败')
                this.$msg.success('添加角色成功')
                this.addDialogVisible = false
                this.getRolesList()
            })
        },
        // 编辑——查询
        async showEditDialog(id) {
            const { data: res } = await this.$http.get('roles/'+id)
            if (res.meta.status !== 200) return this.$msg.error('获取角色信息失败')
            this.editForm = res.data
            this.editDialogVisible = true
            // console.log(id, res)
        },
        // 编辑——修改
        editRoles() {
            this.$refs.addFormRef.validate(async valid=> {
                if(!valid) return
                const { data: res } = await this.$http.put('roles/' + this.editForm.roleId, 
                {
                    roleName: this.editForm.roleName,
                    roleDesc: this.editForm.roleDesc
                })
                // console.log(this.editForm, res)
                if (res.meta.status !== 200) return this.$msg.error('更新角色失败！')
                // 添加成功后隐藏表单
                this.editDialogVisible = false
                // 重新渲染列表
                this.getRolesList()
                this.$msg.success('更新角色成功！')
            })
        },
        // 删除角色
        async delRoles(id) {
            const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err=> err)
            if (confirmResult !== 'confirm') {
                return this.$msg.info('已取消删除')
            }
            const { data: res } = await this.$http.delete('roles/'+id)
            if (res.meta.status !== 200) return this.$msg.error('删除角色失败！')
            this.$msg.success('删除角色成功！')
            // 重新渲染列表
            this.getRolesList()
        },
        // 展开列三级权限的删除
        async delRightById(role, rightId) {
            const confirmResult = await this.$confirm(`此操作将永久删除该权限及以下所有权限, 是否继续?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            if (confirmResult !== 'confirm') {
                return this.$msg.info('已取消删除')
            }
            const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
            if (res.meta.status !== 200) return this.$msg.error('删除权限失败')
            this.$msg.success('删除权限成功')
            role.children = res.data
            
        },
        // 展示分配权限的对话框
        async showSetRightDialog(role) {
            // 保存角色id
            this.roleId = role.id
            const { data: res } = await this.$http.get('rights/tree')
            if (res.meta.status !== 200) return this.$msg.error('获取权限列表失败')
            this.rightList = res.data
            // 递归获取所有三级权限的id
            this.getLeafKeys(role, this.defKeys)
            this.setRightDialogVisible = true
        },
        // 通过递归的形式，获取角色下的所有三级权限的id，并保存到 defKey 中
        getLeafKeys(node, arr) {
            // 判断当前权限是否为三级权限
            if(!node.children) {
                return arr.push(node.id)
            }
            // 递归调用
            node.children.forEach(item => this.getLeafKeys(item, arr))
        },
        // 监听分配权限对话框的关闭事件
        setRightDialogClosed() {
            this.defKeys = []
        },
        // 分配权限
        async setRight() {
            const keys = [
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedNodes(),
            ]
            const strId = keys.join(',')
            const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, {rids: strId})
            if (res.meta.status !== 200) return this.$msg.error('分配权限失败')
            this.$msg.success('分配权限成功')
            this.getRolesList()
            this.setRightDialogVisible = false
            console.log(keys, strId, this.roleId, res)
        }
    },
}
</script>

<style lang="less" scoped>
.el-tag {
    margin: 7px;
}
.bdtop {
    border-top: 1px solid #eee;
}
.bdbottom {
    border-top: 1px solid #eee;
        padding: 0 50px;
}
.vcenter {
    display: flex;
    align-items: center;
}
</style>