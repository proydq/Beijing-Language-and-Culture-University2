<template>
  <div class="user-management">
    <!-- 顶部导航栏 -->
    <div class="header">
      <div class="header-left">
        <div class="logo" @click="goToHome" style="cursor: pointer;">
          <el-icon size="24"><home-filled /></el-icon>
        </div>
        <span class="title">用户管理</span>
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
        <!-- 添加首页导航 -->
        <div class="nav-item" @click="goToHome">
          <el-icon><home /></el-icon>
          <span>首页</span>
        </div>
        
        <div class="tree-header">
          <h3>组织架构</h3>
        </div>
        <div class="tree-container">
          <el-tree
            :data="treeData"
            :props="treeProps"
            node-key="id"
            default-expand-all
            @node-click="handleTreeNodeClick"
          >
            <template #default="{ node, data }">
              <div class="tree-node">
                <el-icon v-if="data.type === 'company'" class="tree-icon company-icon"><office-building /></el-icon>
                <el-icon v-else-if="data.type === 'department'" class="tree-icon department-icon"><folder /></el-icon>
                <el-icon v-else class="tree-icon group-icon"><user /></el-icon>
                <span class="node-label">{{ node.label }}</span>
                <span v-if="data.count !== undefined" class="node-count">({{ data.count }})</span>
              </div>
            </template>
          </el-tree>
        </div>
      </div>

      <!-- 右侧内容区域 -->
      <div class="main-content">
        <!-- 面包屑导航 -->
        <div class="breadcrumb">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item @click="goToHome" style="cursor: pointer; color: #4A90E2;">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <!-- 标签页 -->
        <div class="tabs">
          <el-tabs v-model="activeTab" @tab-click="handleTabClick">
            <el-tab-pane label="用户列表" name="userList">
              <!-- 搜索区域 -->
              <div class="search-area">
                <el-form :model="searchForm" label-width="80px" :inline="true">
                  <el-row :gutter="20">
                    <el-col :span="8">
                      <el-form-item label="用户名">
                        <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable />
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="姓名">
                        <el-input v-model="searchForm.realName" placeholder="请输入姓名" clearable />
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="状态">
                        <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
                          <el-option label="启用" value="1" />
                          <el-option label="禁用" value="0" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <div class="search-buttons">
                        <el-button type="primary" @click="handleSearch">查询</el-button>
                        <el-button @click="handleReset">重置</el-button>
                      </div>
                    </el-col>
                  </el-row>
                </el-form>
              </div>

              <!-- 操作按钮区域 -->
              <div class="action-area">
                <div class="left-actions">
                  <el-button type="primary" @click="handleAdd">新增用户</el-button>
                  <el-button @click="handleImport">导入用户</el-button>
                  <el-button @click="handleExport">导出用户</el-button>
                </div>
              </div>

              <!-- 用户表格 -->
              <div class="table-area">
                <el-table :data="tableData" style="width: 100%" stripe>
                  <el-table-column prop="username" label="用户名" />
                  <el-table-column prop="realName" label="姓名" />
                  <el-table-column prop="email" label="邮箱" />
                  <el-table-column prop="phone" label="手机号" />
                  <el-table-column prop="department" label="部门" />
                  <el-table-column prop="position" label="职位" />
                  <el-table-column label="状态">
                    <template #default="scope">
                      <el-tag :type="scope.row.status === '1' ? 'success' : 'danger'">
                        {{ scope.row.status === '1' ? '启用' : '禁用' }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="createTime" label="创建时间" />
                  <el-table-column label="操作" width="200" fixed="right">
                    <template #default="scope">
                      <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                      <el-button type="warning" size="small" @click="handleResetPassword(scope.row)">重置密码</el-button>
                      <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>

              <!-- 分页 -->
              <div class="pagination-area">
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
          </el-tabs>
        </div>
      </div>
    </div>

    <!-- 用户编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form
        ref="userFormRef"
        :model="userForm"
        :rules="userFormRules"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="userForm.username" placeholder="请输入用户名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名" prop="realName">
              <el-input v-model="userForm.realName" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="userForm.email" placeholder="请输入邮箱" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="userForm.phone" placeholder="请输入手机号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门" prop="department">
              <el-input v-model="userForm.department" placeholder="请输入部门" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职位" prop="position">
              <el-input v-model="userForm.position" placeholder="请输入职位" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select v-model="userForm.status" placeholder="请选择状态">
                <el-option label="启用" value="1" />
                <el-option label="禁用" value="0" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'UserManagement',
  setup() {
    const router = useRouter()
    
    // 响应式数据
    const activeTab = ref('userList')
    const dialogVisible = ref(false)
    const editMode = ref(false)
    const currentPage = ref(1)
    const pageSize = ref(10)
    const total = ref(100)

    // 搜索表单
    const searchForm = reactive({
      username: '',
      realName: '',
      status: ''
    })

    // 用户表单
    const userForm = reactive({
      id: null,
      username: '',
      realName: '',
      email: '',
      phone: '',
      department: '',
      position: '',
      status: '1'
    })

    // 表单验证规则
    const userFormRules = {
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
      ],
      realName: [
        { required: true, message: '请输入姓名', trigger: 'blur' }
      ],
      email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
      ],
      phone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
      ]
    }

    // 组织架构树数据
    const treeData = ref([
      {
        id: 1,
        label: '总公司',
        type: 'company',
        count: 156,
        children: [
          {
            id: 2,
            label: '技术部',
            type: 'department',
            count: 45,
            children: [
              {
                id: 3,
                label: '前端组',
                type: 'group',
                count: 12
              },
              {
                id: 4,
                label: '后端组',
                type: 'group',
                count: 18
              }
            ]
          },
          {
            id: 5,
            label: '产品部',
            type: 'department',
            count: 32,
            children: [
              {
                id: 6,
                label: '产品经理组',
                type: 'group',
                count: 15
              },
              {
                id: 7,
                label: '设计组',
                type: 'group',
                count: 17
              }
            ]
          },
          {
            id: 8,
            label: '运营部',
            type: 'department',
            count: 28
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
        username: 'admin',
        realName: '管理员',
        email: 'admin@example.com',
        phone: '13800138000',
        department: '技术部',
        position: '系统管理员',
        status: '1',
        createTime: '2023-01-01 00:00:00'
      },
      {
        id: 2,
        username: 'zhangsan',
        realName: '张三',
        email: 'zhangsan@example.com',
        phone: '13800138001',
        department: '产品部',
        position: '产品经理',
        status: '1',
        createTime: '2023-01-02 00:00:00'
      },
      {
        id: 3,
        username: 'lisi',
        realName: '李四',
        email: 'lisi@example.com',
        phone: '13800138002',
        department: '技术部',
        position: '前端工程师',
        status: '0',
        createTime: '2023-01-03 00:00:00'
      }
    ])

    // 计算属性
    const dialogTitle = computed(() => {
      return editMode.value ? '编辑用户' : '新增用户'
    })

    // 返回首页
    const goToHome = () => {
      router.push('/dashboard')
    }

    const goToPersonalCenter = () => {
      router.push('/personal-center')
    }

    const logout = () => {
      console.log('退出登录')
    }

    // 方法
    const handleTabClick = (tab) => {
      console.log('切换标签页:', tab.name)
    }

    const handleTreeNodeClick = (data) => {
      console.log('选择组织节点:', data)
    }

    const handleSearch = () => {
      console.log('搜索用户:', searchForm)
    }

    const handleReset = () => {
      Object.assign(searchForm, {
        username: '',
        realName: '',
        status: ''
      })
    }

    const handleAdd = () => {
      editMode.value = false
      resetUserForm()
      dialogVisible.value = true
    }

    const handleEdit = (row) => {
      editMode.value = true
      Object.assign(userForm, row)
      dialogVisible.value = true
    }

    const handleDelete = (row) => {
      ElMessageBox.confirm('确认删除该用户吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ElMessage.success('删除成功')
      })
    }

    const handleResetPassword = (row) => {
      ElMessageBox.confirm('确认重置该用户密码吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ElMessage.success('重置密码成功')
      })
    }

    const handleImport = () => {
      console.log('导入用户')
    }

    const handleExport = () => {
      console.log('导出用户')
    }

    const handleSubmit = () => {
      console.log('提交用户表单:', userForm)
      dialogVisible.value = false
      ElMessage.success(editMode.value ? '编辑成功' : '新增成功')
    }

    const handleDialogClose = () => {
      resetUserForm()
    }

    const resetUserForm = () => {
      Object.assign(userForm, {
        id: null,
        username: '',
        realName: '',
        email: '',
        phone: '',
        department: '',
        position: '',
        status: '1'
      })
    }

    const handleSizeChange = (val) => {
      pageSize.value = val
      console.log('每页条数变化:', val)
    }

    const handleCurrentChange = (val) => {
      currentPage.value = val
      console.log('当前页变化:', val)
    }

    return {
      activeTab,
      dialogVisible,
      editMode,
      currentPage,
      pageSize,
      total,
      searchForm,
      userForm,
      userFormRules,
      treeData,
      treeProps,
      tableData,
      dialogTitle,
      goToHome,  // 新增返回首页方法
      goToPersonalCenter,
      logout,
      handleTabClick,
      handleTreeNodeClick,
      handleSearch,
      handleReset,
      handleAdd,
      handleEdit,
      handleDelete,
      handleResetPassword,
      handleImport,
      handleExport,
      handleSubmit,
      handleDialogClose,
      handleSizeChange,
      handleCurrentChange
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
  transition: transform 0.2s;
}

.logo:hover {
  transform: scale(1.05);
}

.title {
  font-size: 20px;
  font-weight: 600;
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
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.username {
  font-size: 16px;
  font-weight: 500;
}

.dropdown-link {
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: background-color 0.3s;
}

.dropdown-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.main-container {
  display: flex;
  height: calc(100vh - 70px);
}

.sidebar {
  width: 280px;
  background: white;
  border-right: 1px solid #e8e8e8;
  padding: 15px;
  flex-shrink: 0;
  overflow-y: auto;
}

.nav-item {
  padding: 12px 15px;
  cursor: pointer;
  border-radius: 6px;
  margin-bottom: 8px;
  transition: all 0.3s;
  color: #666;
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-item:hover {
  background-color: #f0f2f5;
  color: #4A90E2;
}

.tree-header {
  margin-top: 20px;
  margin-bottom: 15px;
}

.tree-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.tree-container {
  flex: 1;
}

.tree-node {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.tree-icon {
  font-size: 16px;
}

.company-icon {
  color: #4A90E2;
}

.department-icon {
  color: #67C23A;
}

.group-icon {
  color: #E6A23C;
}

.node-label {
  flex: 1;
  font-size: 14px;
}

.node-count {
  font-size: 12px;
  color: #999;
}

.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.breadcrumb {
  margin-bottom: 20px;
  padding: 15px 0;
}

.breadcrumb :deep(.el-breadcrumb__item:not(:last-child)) {
  cursor: pointer;
}

.breadcrumb :deep(.el-breadcrumb__item:not(:last-child):hover) {
  color: #357ABD;
}

.tabs {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-area {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 6px;
  margin-bottom: 20px;
}

.search-buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.action-area {
  margin-bottom: 20px;
}

.left-actions {
  display: flex;
  gap: 10px;
}

.table-area {
  margin-bottom: 20px;
}

.pagination-area {
  display: flex;
  justify-content: flex-end;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>