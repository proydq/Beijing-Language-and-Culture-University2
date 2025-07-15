<template>
  <Layout>
    <div class="access-control-records">
      <!-- 顶部导航标签 -->
      <div class="top-tabs">
        <div class="tab-item" @click="navigateTo('dashboard')">首页</div>
        <div class="tab-item active" @click="navigateTo('records')">通行记录</div>
        <div class="tab-item" @click="navigateTo('permissions')">权限分配</div>
        <div class="tab-item" @click="navigateTo('device-management')">门禁控制管理</div>
      </div>

      <!-- 左侧导航 -->
      <div class="sub-nav">
        <div class="nav-item active">通行记录</div>
        <div class="nav-item">黑名单通行记录</div>
      </div>

      <div class="main-container">
        <!-- 左侧设备列表 -->
        <div class="sidebar">
          <div class="sidebar-header">
            <h3>终端信息</h3>
          </div>
          <div class="device-search">
            <el-input
              v-model="deviceSearch"
              placeholder="请输入设备名称"
              size="small"
              clearable
            >
              <template #prefix>
                <el-icon><search /></el-icon>
              </template>
            </el-input>
          </div>
          <div class="device-list">
            <div class="device-group">
              <div class="group-title">保安室名称</div>
              <div 
                v-for="device in deviceList" 
                :key="device.id"
                class="device-item"
                :class="{ active: selectedDevice?.id === device.id }"
                @click="selectDevice(device)"
              >
                <div class="device-name">{{ device.name }}</div>
                <div class="device-count">({{ device.count }})</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧记录信息 -->
        <div class="main-content">
          <div class="content-header">
            <el-button type="primary" @click="exportRecords">导出</el-button>
          </div>

          <!-- 查询条件 -->
          <div class="search-area">
            <div class="search-row">
              <div class="search-item">
                <label>基础信息：</label>
                <el-input
                  v-model="searchForm.keyword"
                  placeholder="请输入人员姓名/工号/联系方式"
                  clearable
                  style="width: 200px"
                />
              </div>
              <div class="search-item">
                <label>开门方式：</label>
                <el-select v-model="searchForm.openMethod" placeholder="全部" style="width: 120px">
                  <el-option label="全部" value="" />
                  <el-option label="人脸识别" value="face" />
                  <el-option label="刷卡" value="card" />
                  <el-option label="远程开门" value="remote" />
                </el-select>
              </div>
              <div class="search-item">
                <label>通行类型：</label>
                <el-select v-model="searchForm.accessType" placeholder="全部" style="width: 120px">
                  <el-option label="全部" value="" />
                  <el-option label="会议权限" value="meeting" />
                  <el-option label="临时权限" value="temporary" />
                  <el-option label="永久权限" value="permanent" />
                </el-select>
              </div>
              <div class="search-item">
                <label>通行时间：</label>
                <el-date-picker
                  v-model="searchForm.startTime"
                  type="datetime"
                  placeholder="请选择开始时间"
                  format="YYYY-MM-DD HH:mm:ss"
                  style="width: 160px"
                />
                <span class="separator">~</span>
                <el-date-picker
                  v-model="searchForm.endTime"
                  type="datetime"
                  placeholder="请选择结束时间"
                  format="YYYY-MM-DD HH:mm:ss"
                  style="width: 160px"
                />
              </div>
              <div class="search-buttons">
                <el-button type="primary" @click="handleSearch">搜索</el-button>
                <el-button @click="handleReset">重置</el-button>
              </div>
            </div>
          </div>

          <!-- 记录表格 -->
          <div class="table-area">
            <el-table :data="recordsList" style="width: 100%" stripe>
              <el-table-column prop="name" label="姓名" width="100" />
              <el-table-column prop="gender" label="性别" width="80" />
              <el-table-column prop="jobNumber" label="工号" width="120" />
              <el-table-column prop="contactMethod" label="联系方式" width="140" />
              <el-table-column prop="openMethod" label="开门方式" width="120">
                <template #default="scope">
                  <el-tag v-if="scope.row.openMethod === '人脸识别'" type="success" size="small">人脸识别</el-tag>
                  <el-tag v-else-if="scope.row.openMethod === '刷卡'" type="primary" size="small">刷卡</el-tag>
                  <el-tag v-else-if="scope.row.openMethod === '远程开门'" type="warning" size="small">远程开门</el-tag>
                  <el-tag v-else size="small">{{ scope.row.openMethod }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="accessTime" label="通行时间" width="160" />
              <el-table-column prop="accessType" label="通行类型">
                <template #default="scope">
                  <el-tag v-if="scope.row.accessType === '会议权限'" type="success" size="small">会议权限</el-tag>
                  <el-tag v-else-if="scope.row.accessType === '临时权限'" type="warning" size="small">临时权限</el-tag>
                  <el-tag v-else-if="scope.row.accessType === '永久权限'" type="primary" size="small">永久权限</el-tag>
                  <el-tag v-else size="small">{{ scope.row.accessType }}</el-tag>
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
    </div>
  </Layout>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import Layout from '@/components/Layout.vue'

export default {
  name: 'AccessControlRecords',
  components: {
    Layout
  },
  setup() {
    const router = useRouter()
    
    // 设备搜索
    const deviceSearch = ref('')
    const selectedDevice = ref(null)
    
    // 分页
    const currentPage = ref(1)
    const pageSize = ref(10)
    const total = ref(200)

    // 搜索表单
    const searchForm = reactive({
      keyword: '',
      openMethod: '',
      accessType: '',
      startTime: '',
      endTime: ''
    })

    // 设备列表
    const deviceList = ref([
      { id: 1, name: '23.8寸福林办证的刷脸联系测试设备', count: 140 },
      { id: 2, name: '23.8寸福林办证的刷脸', count: 0 },
      { id: 3, name: '23.9寸福林办证的刷脸', count: 0 },
      { id: 4, name: '23.8寸福林办证的刷脸联系测试设备内容', count: 140 },
      { id: 5, name: '23.8寸福林办证的刷脸联系测试', count: 0 },
      { id: 6, name: '23.8寸福林办证的刷脸联系测试设备内容详细描述', count: 0 },
      { id: 7, name: '23.8寸福林办证的刷脸联系测试设备', count: 140 },
      { id: 8, name: '23.8寸福林办证的刷脸', count: 0 },
      { id: 9, name: '23.9寸福林办证的刷脸', count: 0 }
    ])

    // 记录列表
    const recordsList = ref([
      {
        id: 1,
        name: '张1',
        gender: '男',
        jobNumber: '12315461',
        contactMethod: '13111311131',
        openMethod: '人脸识别',
        accessTime: '2024.06.27 10:23:23',
        accessType: '会议权限'
      },
      {
        id: 2,
        name: '张2',
        gender: '女',
        jobNumber: '12315462',
        contactMethod: '13111311132',
        openMethod: '人脸识别',
        accessTime: '2024.06.27 10:23:23',
        accessType: '临时权限'
      },
      {
        id: 3,
        name: '张3',
        gender: '男',
        jobNumber: '12315463',
        contactMethod: '13111311133',
        openMethod: '刷卡',
        accessTime: '2024.06.27 10:23:23',
        accessType: '永久权限'
      },
      {
        id: 4,
        name: '张4',
        gender: '男',
        jobNumber: '12315464',
        contactMethod: '13111311134',
        openMethod: '刷卡',
        accessTime: '2024.06.27 10:23:23',
        accessType: '会议权限'
      },
      {
        id: 5,
        name: 'administrator',
        gender: '/',
        jobNumber: '/',
        contactMethod: '/',
        openMethod: '远程开门',
        accessTime: '2024.06.27 10:23:23',
        accessType: '/'
      },
      {
        id: 6,
        name: 'administrator',
        gender: '/',
        jobNumber: '/',
        contactMethod: '/',
        openMethod: '远程开门',
        accessTime: '2024.06.27 10:23:23',
        accessType: '/'
      },
      {
        id: 7,
        name: '张7',
        gender: '男',
        jobNumber: '12315467',
        contactMethod: '13111311137',
        openMethod: '人脸识别',
        accessTime: '2024.06.27 10:23:23',
        accessType: '会议权限'
      },
      {
        id: 8,
        name: '张8',
        gender: '女',
        jobNumber: '12315468',
        contactMethod: '13111311138',
        openMethod: '人脸识别',
        accessTime: '2024.06.27 10:23:23',
        accessType: '临时权限'
      },
      {
        id: 9,
        name: '张9',
        gender: '女',
        jobNumber: '12315469',
        contactMethod: '13111311139',
        openMethod: '刷卡',
        accessTime: '2024.06.27 10:23:23',
        accessType: '永久权限'
      },
      {
        id: 10,
        name: '张10',
        gender: '女',
        jobNumber: '12315470',
        contactMethod: '13111311140',
        openMethod: '刷卡',
        accessTime: '2024.06.27 10:23:23',
        accessType: '会议权限'
      }
    ])

    // 导航方法
    const navigateTo = (type) => {
      switch(type) {
        case 'dashboard':
          router.push('/access-control/dashboard')
          break
        case 'records':
          // 当前页面，不需要跳转
          break
        case 'permissions':
          router.push('/access-control/permissions')
          break
        case 'device-management':
          router.push('/access-control/device-management')
          break
      }
    }

    // 选择设备
    const selectDevice = (device) => {
      selectedDevice.value = device
      console.log('选择设备:', device)
      // 这里可以根据选择的设备重新加载记录数据
    }

    // 搜索
    const handleSearch = () => {
      console.log('搜索条件:', searchForm)
      ElMessage.success('搜索完成')
    }

    // 重置搜索
    const handleReset = () => {
      Object.assign(searchForm, {
        keyword: '',
        openMethod: '',
        accessType: '',
        startTime: '',
        endTime: ''
      })
      ElMessage.info('搜索条件已重置')
    }

    // 导出记录
    const exportRecords = () => {
      ElMessage.success('导出成功')
    }

    // 分页处理
    const handleSizeChange = (val) => {
      pageSize.value = val
      console.log('每页条数变化:', val)
    }

    const handleCurrentChange = (val) => {
      currentPage.value = val
      console.log('当前页变化:', val)
    }

    onMounted(() => {
      // 默认选择第一个设备
      if (deviceList.value.length > 0) {
        selectedDevice.value = deviceList.value[0]
      }
    })

    return {
      deviceSearch,
      selectedDevice,
      currentPage,
      pageSize,
      total,
      searchForm,
      deviceList,
      recordsList,
      navigateTo,
      selectDevice,
      handleSearch,
      handleReset,
      exportRecords,
      handleSizeChange,
      handleCurrentChange
    }
  }
}
</script>

<style scoped>
.access-control-records {
  background-color: #f5f5f5;
  min-height: calc(100vh - 110px);
}

.top-tabs {
  background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
  display: flex;
  padding: 0;
  border-radius: 0;
}

.tab-item {
  padding: 15px 30px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s;
  border-right: 1px solid rgba(255, 255, 255, 0.2);
}

.tab-item:hover {
  color: white;
  background-color: rgba(255, 255, 255, 0.1);
}

.tab-item.active {
  color: white;
  background-color: rgba(255, 255, 255, 0.2);
  position: relative;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background-color: #fff;
}

.sub-nav {
  background: #2980b9;
  display: flex;
  padding: 0;
}

.nav-item {
  padding: 10px 20px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
  border-right: 1px solid rgba(255, 255, 255, 0.2);
}

.nav-item:hover {
  color: white;
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-item.active {
  color: white;
  background-color: rgba(255, 255, 255, 0.2);
}

.main-container {
  display: flex;
  height: calc(100vh - 180px);
}

.sidebar {
  width: 350px;
  background: white;
  border-right: 1px solid #e8e8e8;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 15px 20px;
  border-bottom: 1px solid #e8e8e8;
  background: #f8f9fa;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.device-search {
  padding: 15px 20px;
  border-bottom: 1px solid #e8e8e8;
}

.device-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px 0;
}

.group-title {
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  color: #666;
  background: #f8f9fa;
  border-bottom: 1px solid #e8e8e8;
}

.device-item {
  padding: 12px 20px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.3s;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.device-item:hover {
  background-color: #f8f9fa;
}

.device-item.active {
  background-color: #e3f2fd;
  border-left: 3px solid #4A90E2;
}

.device-name {
  font-size: 14px;
  color: #333;
  flex: 1;
  word-break: break-all;
}

.device-count {
  font-size: 12px;
  color: #666;
  margin-left: 10px;
}

.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.content-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 20px;
}

.search-area {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.search-row {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.search-item {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.search-item label {
  white-space: nowrap;
  font-size: 14px;
  color: #333;
  font-weight: 500;
  min-width: 70px;
}

.separator {
  color: #666;
  margin: 0 8px;
}

.search-buttons {
  display: flex;
  gap: 10px;
  margin-left: auto;
}

.table-area {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex: 1;
}

.pagination-area {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

/* Element Plus 组件样式覆盖 */
:deep(.el-input) {
  width: auto;
}

:deep(.el-select) {
  width: auto;
}

:deep(.el-date-editor) {
  width: auto;
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
@media (max-width: 1400px) {
  .search-row {
    gap: 10px;
  }
}

@media (max-width: 1200px) {
  .main-container {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    height: 300px;
  }
  
  .search-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-item {
    justify-content: space-between;
  }
  
  .table-area {
    overflow-x: auto;
  }
}

@media (max-width: 768px) {
  .top-tabs {
    flex-wrap: wrap;
  }
  
  .tab-item {
    flex: 1;
    text-align: center;
    min-width: 120px;
  }
  
  .content-header {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }
}
</style>