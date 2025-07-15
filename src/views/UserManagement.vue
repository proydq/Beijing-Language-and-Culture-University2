<template>
  <div class="user-management">
    <!-- 顶部导航栏 -->
    <div class="header">
      <div class="header-left">
        <div class="logo">
          <el-icon size="24"><home-filled /></el-icon>
        </div>
        <span class="title">功能模块</span>
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
        </el-dropdown>
      </div>
    </div>

    <div class="main-container">
      <!-- 左侧导航 -->
      <div class="sidebar">
        <div class="org-search">
          <el-input
            v-model="orgSearch"
            placeholder="请输入部门名称"
            :prefix-icon="Search"
            clearable
          />
          <el-button type="primary" style="margin-top: 10px;">搜索</el-button>
        </div>
        
        <div class="org-tree">
          <div class="company-name">北京青海东方科技有限公司</div>
          <el-tree
            :data="orgData"
            :props="treeProps"
            node-key="id"
            default-expand-all
            highlight-current
            @node-click="handleNodeClick"
          >
            <template #default="{ node, data }">
              <span class="tree-node">
                <el-icon v-if="data.type === 'department'"><office-building /></el-icon>
                <el-icon v-else><user /></el-icon>
                {{ node.label }}
              </span>
            </template>
          </el-tree>
        </div>
      </div>

      <!-- 右侧主内容 -->
      <div class="main-content">
        <!-- 标签页 -->
        <el-tabs v-model="activeTab" class="tabs" @tab-click="handleTabClick">
          <el-tab-pane label="用户管理" name="user"></el-tab-pane>
          <el-tab-pane label="组织架构管理" name="org"></el-tab-pane>
          <el-tab-pane label="职务/职级管理" name="position"></el-tab-pane>
        </el-tabs>

        <!-- 搜索区域 -->
        <div class="search-area">
          <el-form :model="searchForm" class="search-form">
            <el-row :gutter="20" align="middle">
              <el-col :span="5">
                <el-form-item label="人员姓名" prop="name">
                  <el-input v-model="searchForm.name" placeholder="请输入姓名信息" size="default" />
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="手机号" prop="phone">
                  <el-input v-model="searchForm.phone" placeholder="请输入手机信息" size="default" />
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="工号" prop="employeeId">
                  <el-input v-model="searchForm.employeeId" placeholder="请输入工号信息" size="default" />
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="账号状态" prop="status">
                  <el-select v-model="searchForm.status" placeholder="全部" size="default" style="width: 100%">
                    <el-option label="全部" value="all" />
                    <el-option label="启用" value="active" />
                    <el-option label="禁用" value="inactive" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item>
                  <div class="search-buttons">
                    <el-button type="primary" @click="handleSearch">搜索</el-button>
                    <el-button @click="handleReset">重置</el-button>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>

        <!-- 操作按钮区域 -->
        <div class="action-area">
          <div class="left-actions">
            <span class="title">用户列表</span>
          </div>
          <div class="right-actions">
            <el-button type="primary" @click="handleSync">手动同步</el-button>
            <el-button type="primary" @click="handleImport">导入</el-button>
            <el-button type="primary" @click="handleAdd">新增</el-button>
            <el-button type="warning" @click="handleExport">导出</el-button>
          </div>
        </div>

        <!-- 数据表格 -->
        <div class="table-area">
          <el-table :data="tableData" style="width: 100%" stripe>
            <el-table-column prop="id" label="序号" width="60" />
            <el-table-column label="头像" width="80" align="center">
              <template #default>
                <el-avatar :size="30" :icon="UserFilled" />
              </template>
            </el-table-column>
            <el-table-column label="人员证件照" width="120" align="center">
              <template #default>
                <el-avatar :size="30" shape="square" :icon="Picture" />
              </template>
            </el-table-column>
            <el-table-column prop="name" label="姓名" />
            <el-table-column prop="gender" label="性别" />
            <el-table-column prop="phone" label="手机号" />
            <el-table-column prop="department" label="所属部门" />
            <el-table-column prop="employeeId" label="工号" />
            <el-table-column prop="position" label="职务" />
            <el-table-column prop="role" label="职级" />
            <el-table-column prop="createTime" label="帐号创建时间" />
            <el-table-column label="操作" width="150" fixed="right">
              <template #default="scope">
                <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
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
      </div>
    </div>

    <!-- 用户编辑弹窗 -->
    <UserEditDialog
      v-model:visible="dialogVisible"
      :user-data="currentUserData"
      :is-edit="isEdit"
      @submit="handleUserSubmit"
    />
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { Search, UserFilled, Picture } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import UserEditDialog from '../components/UserEditDialog.vue'

export default {
  name: 'UserManagement',
  components: {
    UserEditDialog
  },
  setup() {
    const router = useRouter()
    const activeTab = ref('user')
    const orgSearch = ref('')
    const currentPage = ref(1)
    const pageSize = ref(10)
    const total = ref(2010)

    // 编辑弹窗相关
    const dialogVisible = ref(false)
    const isEdit = ref(false)
    const currentUserData = ref({})

    const searchForm = reactive({
      name: '',
      phone: '',
      employeeId: '',
      status: 'all'
    })

    const treeProps = {
      children: 'children',
      label: 'label'
    }

    const orgData = ref([
      {
        id: 1,
        label: '总部分',
        type: 'department',
        children: [
          {
            id: 11,
            label: '财务部',
            type: 'department'
          }
        ]
      },
      {
        id: 2,
        label: '产品部',
        type: 'department',
        children: [
          {
            id: 21,
            label: '硬件产品部',
            type: 'department',
            children: [
              { id: 211, label: '硬_产品一组', type: 'department' },
              { id: 212, label: '硬_产品二组', type: 'department' }
            ]
          },
          {
            id: 22,
            label: '软件产品部',
            type: 'department',
            children: [
              { id: 221, label: '软_产品一组', type: 'department' },
              { id: 222, label: '软_产品二组', type: 'department' }
            ]
          }
        ]
      },
      {
        id: 3,
        label: '开发部',
        type: 'department',
        children: [
          {
            id: 31,
            label: '硬件开发部',
            type: 'department',
            children: [
              { id: 311, label: '硬_研发一组', type: 'department' },
              { id: 312, label: '硬_研发二组', type: 'department' }
            ]
          },
          {
            id: 32,
            label: '软件开发部',
            type: 'department',
            children: [
              { id: 321, label: '软_研发一组', type: 'department' },
              { id: 322, label: '软_研发二组', type: 'department' }
            ]
          }
        ]
      },
      {
        id: 4,
        label: '销售部',
        type: 'department',
        children: [
          { id: 41, label: '销售一部', type: 'department' },
          { id: 42, label: '销售二部', type: 'department' }
        ]
      },
      {
        id: 5,
        label: '市场部',
        type: 'department',
        children: [
          { id: 51, label: '市场一部', type: 'department' },
          { id: 52, label: '市场二部', type: 'department' }
        ]
      }
    ])

    const tableData = ref([
      {
        id: 1,
        name: '张三',
        gender: '男',
        phone: '13111311131',
        department: '产品部门',
        employeeId: 'k3456789',
        position: '产品经理',
        role: '/',
        createTime: '2021.12.02'
      },
      {
        id: 2,
        name: '张四',
        gender: '女',
        phone: '13211321132',
        department: '产品部门',
        employeeId: 'k3456788',
        position: '产品经理',
        role: '/',
        createTime: '2021.12.02'
      },
      {
        id: 3,
        name: '张五',
        gender: '男',
        phone: '13311331133',
        department: '产品部门',
        employeeId: 'k3456787',
        position: '产品经理',
        role: '/',
        createTime: '2021.12.02'
      },
      {
        id: 4,
        name: '张五',
        gender: '男',
        phone: '13311331133',
        department: '产品部门',
        employeeId: 'k3456787',
        position: '产品经理',
        role: '/',
        createTime: '2021.12.02'
      },
      {
        id: 5,
        name: '张五',
        gender: '男',
        phone: '13311331133',
        department: '产品部门',
        employeeId: 'k3456787',
        position: '产品经理',
        role: '/',
        createTime: '2021.12.02'
      },
      {
        id: 6,
        name: '张五',
        gender: '男',
        phone: '13311331133',
        department: '产品部门',
        employeeId: 'k3456787',
        position: '产品经理',
        role: '/',
        createTime: '2021.12.02'
      }
    ])

    const handleNodeClick = (data) => {
      console.log('点击节点:', data)
    }

    const handleTabClick = (tab) => {
      if (tab.props.name === 'position') {
        router.push('/position-management')
      } else if (tab.props.name === 'org') {
        router.push('/organization-management')
      }
      // 用户管理标签页保持在当前页面，不需要跳转
    }

    const handleSearch = () => {
      console.log('搜索:', searchForm)
    }

    const handleReset = () => {
      Object.keys(searchForm).forEach(key => {
        if (key === 'status') {
          searchForm[key] = 'all'
        } else {
          searchForm[key] = ''
        }
      })
    }

    const handleSync = () => {
      console.log('手动同步')
    }

    const handleImport = () => {
      console.log('导入')
    }

    const handleAdd = () => {
      isEdit.value = false
      currentUserData.value = {}
      dialogVisible.value = true
    }

    const handleExport = () => {
      console.log('导出')
    }

    const handleEdit = (row) => {
      isEdit.value = true
      currentUserData.value = { ...row }
      dialogVisible.value = true
    }

    const handleDelete = (row) => {
      console.log('删除:', row)
    }

    const handleSizeChange = (size) => {
      pageSize.value = size
    }

    const handleCurrentChange = (page) => {
      currentPage.value = page
    }

    const handleUserSubmit = (userData) => {
      if (isEdit.value) {
        // 编辑用户 - 更新表格数据
        const index = tableData.value.findIndex(item => item.id === currentUserData.value.id)
        if (index !== -1) {
          tableData.value[index] = { ...userData, id: currentUserData.value.id }
        }
        console.log('更新用户:', userData)
      } else {
        // 新增用户 - 添加到表格数据
        const newUser = {
          ...userData,
          id: tableData.value.length + 1,
          createTime: new Date().toISOString().split('T')[0].replace(/-/g, '.')
        }
        tableData.value.unshift(newUser)
        total.value += 1
        console.log('新增用户:', userData)
      }
    }

    return {
      activeTab,
      orgSearch,
      searchForm,
      treeProps,
      orgData,
      tableData,
      currentPage,
      pageSize,
      total,
      dialogVisible,
      isEdit,
      currentUserData,
      Search,
      UserFilled,
      Picture,
      handleNodeClick,
      handleTabClick,
      handleSearch,
      handleReset,
      handleSync,
      handleImport,
      handleAdd,
      handleExport,
      handleEdit,
      handleDelete,
      handleSizeChange,
      handleCurrentChange,
      handleUserSubmit
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
  width: 200px;
  background: white;
  border-right: 1px solid #e8e8e8;
  padding: 15px;
  flex-shrink: 0;
}

.org-search {
  margin-bottom: 20px;
}

.company-name {
  font-weight: 600;
  padding: 10px 0;
  border-bottom: 1px solid #e8e8e8;
  margin-bottom: 15px;
  color: #333;
}

.tree-node {
  display: flex;
  align-items: center;
  gap: 5px;
}

.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.tabs {
  margin-bottom: 20px;
}

.search-area {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.search-form {
  width: 100%;
}

.search-buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-start;
  align-items: center;
}

.action-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.left-actions .title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.right-actions {
  display: flex;
  gap: 10px;
}

.table-area {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.pagination-area {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

/* Element Plus 组件样式覆盖 */
:deep(.el-tree-node__content) {
  padding: 8px 0;
}

:deep(.el-form-item) {
  margin-bottom: 16px;
  width: 100%;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #333;
  width: auto !important;
  min-width: 80px;
  text-align: right;
  padding-right: 12px;
}

:deep(.el-form-item__content) {
  flex: 1;
}

:deep(.el-input) {
  width: 100%;
}

:deep(.el-select) {
  width: 100%;
}

/* 表格样式优化 */
:deep(.el-table) {
  table-layout: fixed;
}

:deep(.el-table th) {
  background-color: #fafafa;
  font-weight: 600;
}

:deep(.el-table td) {
  padding: 8px 0;
}

:deep(.el-table .cell) {
  padding: 0 8px;
}

/* 响应式调整 */
@media (max-width: 1400px) {
  .search-area :deep(.el-col) {
    margin-bottom: 10px;
  }
}

@media (max-width: 1200px) {
  .main-container {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    height: auto;
    border-right: none;
    border-bottom: 1px solid #e8e8e8;
  }
  
  .table-area {
    overflow-x: auto;
  }
}
</style>