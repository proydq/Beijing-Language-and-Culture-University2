<template>
  <div class="position-management">
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
        <div class="nav-item active">
          <span>职务管理</span>
        </div>
        <div class="nav-item" @click="goToLevel">
          <span>职级管理</span>
        </div>
      </div>

      <!-- 右侧主内容 -->
      <div class="main-content">
        <!-- 标签页 -->
        <el-tabs v-model="activeTab" class="tabs">
          <el-tab-pane label="用户管理" name="user"></el-tab-pane>
          <el-tab-pane label="组织架构管理" name="org"></el-tab-pane>
          <el-tab-pane label="职务/职级管理" name="position" class="active"></el-tab-pane>
        </el-tabs>

        <!-- 搜索区域 -->
        <div class="search-area">
          <el-row :gutter="20" align="middle">
            <el-col :span="6">
              <el-form-item label="职务名称:" label-width="80px">
                <el-input v-model="searchForm.positionName" placeholder="请输入职务名称" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <div class="search-buttons">
                <el-button type="primary" @click="handleSearch">搜索</el-button>
                <el-button @click="handleReset">重置</el-button>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- 操作按钮区域 -->
        <div class="action-area">
          <div class="left-actions">
            <span class="title">职务列表</span>
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
            <el-table-column prop="id" label="序号" width="80" />
            <el-table-column prop="positionName" label="职务名称" />
            <el-table-column prop="positionDesc" label="职务描述" />
            <el-table-column prop="creator" label="创建执行者" />
            <el-table-column prop="createTime" label="创建时间" />
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

    <!-- 职务编辑弹窗 -->
    <PositionEditDialog
      v-model:visible="dialogVisible"
      :position-data="currentPositionData"
      :is-edit="isEdit"
      @submit="handlePositionSubmit"
    />
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import PositionEditDialog from '../components/PositionEditDialog.vue'

export default {
  name: 'PositionManagement',
  components: {
    PositionEditDialog
  },
  setup() {
    const router = useRouter()
    const activeTab = ref('position')
    const currentPage = ref(1)
    const pageSize = ref(10)
    const total = ref(50)

    // 编辑弹窗相关
    const dialogVisible = ref(false)
    const isEdit = ref(false)
    const currentPositionData = ref({})

    const searchForm = reactive({
      positionName: ''
    })

    const tableData = ref([
      {
        id: 1,
        positionName: '产品经理',
        positionDesc: '负责产品设计',
        creator: 'liuyashen',
        createTime: '2023.06.01 10:06:32'
      },
      {
        id: 2,
        positionName: 'java开发工程师',
        positionDesc: '负责java开发',
        creator: 'liuyashen',
        createTime: '2023.06.01 10:06:32'
      },
      {
        id: 3,
        positionName: 'WEB前端开发工程师',
        positionDesc: '负责前端开发',
        creator: 'liuyashen',
        createTime: '2023.06.01 10:06:32'
      },
      {
        id: 4,
        positionName: 'UI设计师',
        positionDesc: '负责界面设计',
        creator: 'liuyashen',
        createTime: '2023.06.01 10:06:32'
      },
      {
        id: 5,
        positionName: '测试',
        positionDesc: '负责项目测试',
        creator: 'liuyashen',
        createTime: '2023.06.01 10:06:32'
      }
    ])

    const goToLevel = () => {
      router.push('/level-management')
    }

    const handleSearch = () => {
      console.log('搜索:', searchForm)
      // 这里实现搜索逻辑
    }

    const handleReset = () => {
      searchForm.positionName = ''
    }

    const handleSync = () => {
      console.log('手动同步')
    }

    const handleImport = () => {
      console.log('导入')
    }

    const handleAdd = () => {
      isEdit.value = false
      currentPositionData.value = {}
      dialogVisible.value = true
    }

    const handleExport = () => {
      console.log('导出')
    }

    const handleEdit = (row) => {
      isEdit.value = true
      currentPositionData.value = { ...row }
      dialogVisible.value = true
    }

    const handleDelete = (row) => {
      console.log('删除:', row)
      // 这里可以添加确认删除的逻辑
    }

    const handleSizeChange = (size) => {
      pageSize.value = size
    }

    const handleCurrentChange = (page) => {
      currentPage.value = page
    }

    const handlePositionSubmit = (positionData) => {
      if (isEdit.value) {
        // 编辑职务 - 更新表格数据
        const index = tableData.value.findIndex(item => item.id === currentPositionData.value.id)
        if (index !== -1) {
          tableData.value[index] = { 
            ...positionData, 
            id: currentPositionData.value.id,
            creator: currentPositionData.value.creator,
            createTime: currentPositionData.value.createTime
          }
        }
        console.log('更新职务:', positionData)
      } else {
        // 新增职务 - 添加到表格数据
        const newPosition = {
          ...positionData,
          id: tableData.value.length + 1,
          creator: 'liuyashen',
          createTime: new Date().toISOString().split('T')[0].replace(/-/g, '.') + ' ' + 
                     new Date().toTimeString().split(' ')[0]
        }
        tableData.value.unshift(newPosition)
        total.value += 1
        console.log('新增职务:', positionData)
      }
    }

    return {
      activeTab,
      searchForm,
      tableData,
      currentPage,
      pageSize,
      total,
      dialogVisible,
      isEdit,
      currentPositionData,
      goToLevel,
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
      handlePositionSubmit
    }
  }
}
</script>

<style scoped>
.position-management {
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

.nav-item {
  padding: 12px 15px;
  cursor: pointer;
  border-radius: 6px;
  margin-bottom: 8px;
  transition: all 0.3s;
  color: #666;
}

.nav-item:hover {
  background-color: #f0f2f5;
  color: #4A90E2;
}

.nav-item.active {
  background-color: #4A90E2;
  color: white;
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

.search-buttons {
  display: flex;
  gap: 10px;
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
:deep(.el-form-item) {
  margin-bottom: 0;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #333;
}

:deep(.el-tabs__item.is-active) {
  color: #4A90E2;
}

:deep(.el-tabs__active-bar) {
  background-color: #4A90E2;
}

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