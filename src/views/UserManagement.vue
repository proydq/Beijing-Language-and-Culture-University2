<template>
  <div class="user-management">
    <!-- 顶部导航栏 -->
    <div class="header">
      <div class="header-left">
        <div class="logo" @click="goToHome" style="cursor: pointer;">
          <el-icon size="24"><home-filled /></el-icon>
        </div>
        <span class="title">用户信息管理</span>
      </div>
      <div class="header-right">
        <div class="avatar">
          <el-icon size="20"><user /></el-icon>
        </div>
        <span class="username">系统管理员</span>
        <el-dropdown>
          <span class="dropdown-link">
            <el-icon><grid /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="goToPersonalCenter">个人中心</el-dropdown-item>
              <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <div class="main-container">
      <!-- 左侧组织架构树 -->
      <div class="sidebar">
        <!-- 搜索框 -->
        <div class="search-header">
          <el-input
            v-model="searchKeyword"
            placeholder="请输入部门名称"
            clearable
          >
            <template #append>
              <el-button type="primary">搜索</el-button>
            </template>
          </el-input>
        </div>
        
        <div class="tree-container">
          <el-tree
            :data="treeData"
            :props="treeProps"
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
            @node-click="handleTreeNodeClick"
          >
            <template #default="{ node, data }">
              <div class="tree-node">
                <el-icon v-if="data.type === 'company'" class="tree-icon company-icon">
                  <office-building />
                </el-icon>
                <el-icon v-else-if="data.type === 'department'" class="tree-icon department-icon">
                  <folder />
                </el-icon>
                <el-icon v-else class="tree-icon group-icon">
                  <user />
                </el-icon>
                <span class="node-label">{{ node.label }}</span>
              </div>
            </template>
          </el-tree>
        </div>
      </div>

      <!-- 右侧内容区域 -->
      <div class="main-content">
        <!-- 标签页 -->
        <div class="tabs">
          <el-tabs v-model="activeTab" @tab-click="handleTabClick">
            <el-tab-pane label="用户管理" name="userList">
              <!-- 搜索区域 -->
              <div class="search-area">
                <el-form :model="searchForm" :inline="true" class="search-form">
                  <el-form-item label="人员姓名:">
                    <el-input v-model="searchForm.realName" placeholder="请输入搜索信息" clearable />
                  </el-form-item>
                  <el-form-item label="手机号:">
                    <el-input v-model="searchForm.phone" placeholder="请输入搜索信息" clearable />
                  </el-form-item>
                  <el-form-item label="工号:">
                    <el-input v-model="searchForm.jobNumber" placeholder="请输入搜索信息" clearable />
                  </el-form-item>
                  <el-form-item label="账号状态:">
                    <el-select v-model="searchForm.status" placeholder="全部" clearable style="width: 120px;">
                      <el-option label="全部" value="" />
                      <el-option label="正常" value="1" />
                      <el-option label="禁用" value="0" />
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="handleSearch">搜索</el-button>
                    <el-button @click="handleReset">重置</el-button>
                  </el-form-item>
                </el-form>
              </div>

              <!-- 用户列表标题和操作按钮 -->
              <div class="list-header">
                <h3>用户列表</h3>
                <div class="header-actions">
                  <el-button type="primary" @click="handleSync">手动同步</el-button>
                  <el-button type="primary" @click="handleImport">导入</el-button>
                  <el-button type="success" @click="handleAdd">新增</el-button>
                  <el-button type="warning" @click="handleExport">导出</el-button>
                </div>
              </div>

              <!-- 表格 -->
              <div class="table-container">
                <el-table :data="tableData" style="width: 100%" stripe table-layout="auto">
                  <el-table-column prop="id" label="序号" width="80" align="center" />
                  <el-table-column label="头像" width="100" align="center">
                    <template #default="scope">
                      <el-avatar :size="40" :src="scope.row.avatar">
                        <el-icon><user /></el-icon>
                      </el-avatar>
                    </template>
                  </el-table-column>
                  <el-table-column label="人脸识别照片" width="120" align="center">
                    <template #default="scope">
                      <el-avatar :size="40" :src="scope.row.facePhoto" shape="square">
                        <el-icon><camera /></el-icon>
                      </el-avatar>
                    </template>
                  </el-table-column>
                  <el-table-column prop="realName" label="姓名" min-width="100" align="center" />
                  <el-table-column prop="gender" label="性别" width="80" align="center" />
                  <el-table-column prop="phone" label="手机号" min-width="130" align="center" />
                  <el-table-column prop="department" label="所属部门" min-width="120" align="center" />
                  <el-table-column prop="jobNumber" label="工号" min-width="120" align="center" />
                  <el-table-column prop="position" label="职务" min-width="120" align="center" />
                  <el-table-column prop="jobTitle" label="职称" width="80" align="center" />
                  <el-table-column prop="createTime" label="账号添加时间" min-width="140" align="center" />
                  <el-table-column label="操作" width="200" align="center" fixed="right">
                    <template #default="scope">
                      <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                      <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>

              <!-- 分页 -->
              <div class="pagination-container">
                <el-pagination
                  v-model:current-page="currentPage"
                  v-model:page-size="pageSize"
                  :page-sizes="[10, 20, 50, 100]"
                  :total="total"
                  layout="total, sizes, prev, pager, next, jumper"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                />
              </div>
            </el-tab-pane>

            <el-tab-pane label="组织架构管理" name="organizationManagement">
              <div style="padding: 20px; text-align: center; color: #666;">
                组织架构管理功能开发中...
              </div>
            </el-tab-pane>

            <el-tab-pane label="职务职称管理" name="positionManagement">
              <div style="padding: 20px; text-align: center; color: #666;">
                职务职称管理功能开发中...
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>

    <!-- 用户详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="用户详情" width="50%">
      <div v-if="currentUser" class="user-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="姓名">{{ currentUser.realName }}</el-descriptions-item>
          <el-descriptions-item label="性别">{{ currentUser.gender }}</el-descriptions-item>
          <el-descriptions-item label="手机号">{{ currentUser.phone }}</el-descriptions-item>
          <el-descriptions-item label="工号">{{ currentUser.jobNumber }}</el-descriptions-item>
          <el-descriptions-item label="所属部门">{{ currentUser.department }}</el-descriptions-item>
          <el-descriptions-item label="职务">{{ currentUser.position }}</el-descriptions-item>
          <el-descriptions-item label="职称">{{ currentUser.jobTitle }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ currentUser.createTime }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>

    <!-- 编辑/新增用户对话框 -->
    <el-dialog v-model="editDialogVisible" :title="isEdit ? '编辑用户' : '新增用户'" width="50%">
      <el-form :model="userForm" :rules="userFormRules" ref="userFormRef" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="姓名" prop="realName">
              <el-input v-model="userForm.realName" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <el-select v-model="userForm.gender" placeholder="请选择性别">
                <el-option label="男" value="男" />
                <el-option label="女" value="女" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="userForm.phone" placeholder="请输入手机号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工号" prop="jobNumber">
              <el-input v-model="userForm.jobNumber" placeholder="请输入工号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所属部门" prop="department">
              <el-select v-model="userForm.department" placeholder="请选择部门">
                <el-option label="产品部" value="产品部" />
                <el-option label="开发部" value="开发部" />
                <el-option label="销售部" value="销售部" />
                <el-option label="市场部" value="市场部" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职务" prop="position">
              <el-input v-model="userForm.position" placeholder="请输入职务" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="职称" prop="jobTitle">
              <el-input v-model="userForm.jobTitle" placeholder="请输入职称" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSaveUser">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  HomeFilled,
  User,
  Grid,
  OfficeBuilding,
  Folder,
  View,
  Camera
} from '@element-plus/icons-vue'

export default {
  name: 'UserManagement',
  components: {
    HomeFilled,
    User,
    Grid,
    OfficeBuilding,
    Folder,
    View,
    Camera
  },
  setup() {
    const router = useRouter()
    
    // 响应式数据
    const activeTab = ref('userList')
    const detailDialogVisible = ref(false)
    const editDialogVisible = ref(false)
    const isEdit = ref(false)
    const currentPage = ref(1)
    const pageSize = ref(10)
    const total = ref(2010)
    const searchKeyword = ref('')
    const currentUser = ref(null)
    const userFormRef = ref(null)

    // 搜索表单
    const searchForm = reactive({
      realName: '',
      phone: '',
      jobNumber: '',
      status: ''
    })

    // 用户表单
    const userForm = reactive({
      id: null,
      realName: '',
      gender: '',
      phone: '',
      jobNumber: '',
      department: '',
      position: '',
      jobTitle: ''
    })

    // 表单验证规则
    const userFormRules = {
      realName: [
        { required: true, message: '请输入姓名', trigger: 'blur' }
      ],
      gender: [
        { required: true, message: '请选择性别', trigger: 'change' }
      ],
      phone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
      ],
      department: [
        { required: true, message: '请选择部门', trigger: 'change' }
      ]
    }

    // 组织架构树数据
    const treeData = ref([
      {
        id: 1,
        label: '北京昔日科技有限公司',
        type: 'company',
        children: [
          {
            id: 2,
            label: '总裁办',
            type: 'department'
          },
          {
            id: 3,
            label: '产品部',
            type: 'department',
            children: [
              {
                id: 4,
                label: '硬件产品部',
                type: 'group',
                children: [
                  { id: 5, label: '硬_产品一组', type: 'group' },
                  { id: 6, label: '硬_产品二组', type: 'group' }
                ]
              },
              {
                id: 7,
                label: '软件产品部',
                type: 'group',
                children: [
                  { id: 8, label: '软_产品一组', type: 'group' },
                  { id: 9, label: '软_产品二组', type: 'group' }
                ]
              }
            ]
          },
          {
            id: 10,
            label: '开发部',
            type: 'department',
            children: [
              {
                id: 11,
                label: '硬件开发部',
                type: 'group',
                children: [
                  { id: 12, label: '硬_开发一组', type: 'group' },
                  { id: 13, label: '硬_开发二组', type: 'group' }
                ]
              },
              {
                id: 14,
                label: '软件开发部',
                type: 'group',
                children: [
                  { id: 15, label: '软_开发一组', type: 'group' },
                  { id: 16, label: '软_开发二组', type: 'group' }
                ]
              }
            ]
          },
          {
            id: 17,
            label: '销售部',
            type: 'department',
            children: [
              { id: 18, label: '销售一部', type: 'group' },
              { id: 19, label: '销售二部', type: 'group' }
            ]
          },
          {
            id: 20,
            label: '市场部',
            type: 'department',
            children: [
              { id: 21, label: '市场一部', type: 'group' },
              { id: 22, label: '市场二部', type: 'group' }
            ]
          }
        ]
      }
    ])

    const treeProps = {
      children: 'children',
      label: 'label'
    }

    // 用户表格数据
    const tableData = ref([
      {
        id: 1,
        realName: '张三',
        gender: '男',
        phone: '13111311131',
        department: '产品部',
        jobNumber: 'k3456789',
        position: '产品经理',
        jobTitle: '/',
        createTime: '2021.12.02',
        avatar: '',
        facePhoto: ''
      },
      {
        id: 2,
        realName: '张四',
        gender: '女',
        phone: '13211321132',
        department: '产品部',
        jobNumber: 'k3456788',
        position: '产品经理',
        jobTitle: '/',
        createTime: '2021.12.02',
        avatar: '',
        facePhoto: ''
      },
      {
        id: 3,
        realName: '张五',
        gender: '男',
        phone: '13311331133',
        department: '产品部',
        jobNumber: 'k3456787',
        position: '产品经理',
        jobTitle: '/',
        createTime: '2021.12.02',
        avatar: '',
        facePhoto: ''
      },
      {
        id: 4,
        realName: '张五',
        gender: '男',
        phone: '13311331133',
        department: '产品部',
        jobNumber: 'k3456787',
        position: '产品经理',
        jobTitle: '/',
        createTime: '2021.12.02',
        avatar: '',
        facePhoto: ''
      },
      {
        id: 5,
        realName: '张五',
        gender: '男',
        phone: '13311331133',
        department: '产品部',
        jobNumber: 'k3456787',
        position: '产品经理',
        jobTitle: '/',
        createTime: '2021.12.02',
        avatar: '',
        facePhoto: ''
      },
      {
        id: 6,
        realName: '张五',
        gender: '男',
        phone: '13311331133',
        department: '产品部',
        jobNumber: 'k3456787',
        position: '产品经理',
        jobTitle: '/',
        createTime: '2021.12.02',
        avatar: '',
        facePhoto: ''
      }
    ])

    // 方法
    const goToHome = () => {
      router.push('/dashboard')
    }

    const goToPersonalCenter = () => {
      router.push('/personal-center')
    }

    const logout = () => {
      ElMessageBox.confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 这里可以添加退出登录的逻辑
        ElMessage.success('退出成功')
        router.push('/login')
      })
    }

    const handleTreeNodeClick = (data) => {
      console.log('点击了树节点:', data)
    }

    const handleTabClick = (tab) => {
      console.log('切换标签页:', tab.name)
    }

    const handleSearch = () => {
      console.log('搜索参数:', searchForm)
      ElMessage.success('搜索功能开发中...')
    }

    const handleReset = () => {
      Object.keys(searchForm).forEach(key => {
        searchForm[key] = ''
      })
      ElMessage.success('重置成功')
    }

    const handleSync = () => {
      ElMessage.success('手动同步功能开发中...')
    }

    const handleImport = () => {
      ElMessage.success('导入功能开发中...')
    }

    const handleAdd = () => {
      isEdit.value = false
      resetUserForm()
      editDialogVisible.value = true
    }

    const handleExport = () => {
      ElMessage.success('导出功能开发中...')
    }

    const handleViewDetail = (row) => {
      currentUser.value = { ...row }
      detailDialogVisible.value = true
    }

    const handleEdit = (row) => {
      isEdit.value = true
      Object.keys(userForm).forEach(key => {
        userForm[key] = row[key] || ''
      })
      editDialogVisible.value = true
    }

    const handleDelete = (row) => {
      ElMessageBox.confirm(`确定要删除用户 "${row.realName}" 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = tableData.value.findIndex(item => item.id === row.id)
        if (index > -1) {
          tableData.value.splice(index, 1)
          total.value -= 1
          ElMessage.success('删除成功')
        }
      })
    }

    const handleSizeChange = (size) => {
      pageSize.value = size
      console.log(`每页显示 ${size} 条`)
    }

    const handleCurrentChange = (page) => {
      currentPage.value = page
      console.log(`当前页: ${page}`)
    }

    const resetUserForm = () => {
      Object.keys(userForm).forEach(key => {
        userForm[key] = key === 'id' ? null : ''
      })
    }

    const handleSaveUser = () => {
      userFormRef.value.validate((valid) => {
        if (valid) {
          if (isEdit.value) {
            // 编辑用户
            const index = tableData.value.findIndex(item => item.id === userForm.id)
            if (index > -1) {
              tableData.value[index] = { ...userForm }
              ElMessage.success('编辑成功')
            }
          } else {
            // 新增用户
            const newUser = {
              ...userForm,
              id: tableData.value.length + 1,
              createTime: new Date().toLocaleDateString().replace(/\//g, '.')
            }
            tableData.value.unshift(newUser)
            total.value += 1
            ElMessage.success('新增成功')
          }
          editDialogVisible.value = false
        }
      })
    }

    onMounted(() => {
      console.log('UserManagement 组件已挂载')
    })

    return {
      activeTab,
      detailDialogVisible,
      editDialogVisible,
      isEdit,
      currentPage,
      pageSize,
      total,
      searchKeyword,
      currentUser,
      userFormRef,
      searchForm,
      userForm,
      userFormRules,
      treeData,
      treeProps,
      tableData,
      goToHome,
      goToPersonalCenter,
      logout,
      handleTreeNodeClick,
      handleTabClick,
      handleSearch,
      handleReset,
      handleSync,
      handleImport,
      handleAdd,
      handleExport,
      handleViewDetail,
      handleEdit,
      handleDelete,
      handleSizeChange,
      handleCurrentChange,
      handleSaveUser
    }
  }
}
</script>

<style scoped>
.user-management {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.header {
  background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
  color: white;
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logo {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: white;
  color: #4A90E2;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.logo:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.title {
  font-size: 20px;
  font-weight: 500;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.username {
  font-size: 14px;
}

.dropdown-link {
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.dropdown-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.main-container {
  display: flex;
  margin-top: 70px;
  min-height: calc(100vh - 70px);
}

.sidebar {
  width: 280px;
  background: white;
  border-right: 1px solid #e6e6e6;
  padding: 20px;
  overflow-y: auto;
}

.search-header {
  margin-bottom: 20px;
}

.tree-container {
  max-height: calc(100vh - 150px);
  overflow-y: auto;
}

.tree-node {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 0;
}

.tree-icon {
  font-size: 16px;
}

.company-icon {
  color: #4A90E2;
}

.department-icon {
  color: #F39C12;
}

.group-icon {
  color: #27AE60;
}

.node-label {
  font-size: 14px;
  color: #333;
}

.main-content {
  flex: 1;
  background: white;
  margin: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

.tabs {
  padding: 20px;
}

.search-area {
  background: #fafafa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.search-form {
  margin: 0;
}

.search-form .el-form-item {
  margin-bottom: 0;
  margin-right: 20px;
}

.search-form .el-input {
  width: 200px;
}

.search-form .el-select {
  min-width: 120px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 20px;
}

.list-header h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.table-container {
  margin-bottom: 20px;
}

.pagination-container {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.user-detail {
  padding: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* 按钮样式优化 */
.header-actions {
  display: flex;
  gap: 10px;
}

.header-actions .el-button {
  font-size: 14px;
  padding: 8px 16px;
}

/* 表格样式优化 */
.table-container {
  margin-bottom: 20px;
  overflow-x: auto;
}

/* Element Plus 自定义样式 */
:deep(.el-table) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.el-table th) {
  background-color: #f8f9fa;
  color: #333;
  font-weight: 500;
}

:deep(.el-tree) {
  background: transparent;
}

:deep(.el-tree-node__content) {
  padding: 8px 0;
  border-radius: 4px;
  margin: 2px 0;
}

:deep(.el-tree-node__content:hover) {
  background-color: #f0f9ff;
}

:deep(.el-tabs__header) {
  margin-bottom: 0;
}

:deep(.el-tabs__content) {
  padding-top: 20px;
}

:deep(.el-button--primary) {
  background: #4A90E2;
  border-color: #4A90E2;
}

:deep(.el-button--primary:hover) {
  background: #357ABD;
  border-color: #357ABD;
}
</style>