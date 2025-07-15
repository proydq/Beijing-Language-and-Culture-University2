<template>
  <div class="room-booking">
    <!-- 顶部导航栏 -->
    <div class="header">
      <div class="header-left">
        <div class="logo">
          <el-icon size="24"><home-filled /></el-icon>
        </div>
        <span class="title">房间预订系统</span>
      </div>
      <div class="header-right">
        <div class="avatar">
          <el-icon size="20"><user /></el-icon>
        </div>
        <span class="username">管理员</span>
        <el-dropdown>
          <span class="dropdown-link">
            <el-icon><grid /></el-icon>
          </span>
        </el-dropdown>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 标签页导航 -->
      <div class="tabs">
        <div
          v-for="tab in tabs"
          :key="tab"
          :class="['tab-item', { active: activeTab === tab }]"
          @click="setActiveTab(tab)"
        >
          {{ tab }}
        </div>
      </div>

      <!-- 数据看板 -->
      <div v-if="activeTab === '数据看板'" class="dashboard-content">
        <!-- 使用新的完整仪表盘组件 -->
        <DashboardStats 
          :stats="stats" 
          @time-range-change="handleTimeRangeChange"
        />
      </div>

      <!-- 借用管理 -->
      <div v-if="activeTab === '借用管理'" class="booking-management">
        <div class="booking-layout">
          <!-- 左侧功能菜单 -->
          <div class="left-sidebar">
            <div class="sidebar-header">
              <h3>借用管理</h3>
            </div>
            <div class="sidebar-menu">
              <div
                v-for="menuItem in menuItems"
                :key="menuItem"
                :class="['menu-item', { active: activeMenuItem === menuItem }]"
                @click="setActiveMenuItem(menuItem)"
              >
                <el-icon v-if="menuItem === '我的预约'"><calendar /></el-icon>
                <el-icon v-if="menuItem === '全部借用'"><list /></el-icon>
                <el-icon v-if="menuItem === '房间预约'"><grid /></el-icon>
                {{ menuItem }}
              </div>
            </div>
          </div>

          <!-- 中间楼宇分类（仅在房间预约时显示） -->
          <div v-if="activeMenuItem === '房间预约'" class="middle-sidebar">
            <div class="search-box">
              <el-input
                v-model="searchKeyword"
                placeholder="搜索房间"
                :prefix-icon="Search"
                clearable
              />
            </div>
            <div class="category-tree">
              <div class="category-group">
                <div
                  :class="['category-item', { active: activeCategory === '全部' }]"
                  @click="setActiveCategory('全部')"
                >
                  <el-icon><home /></el-icon>
                  全部
                </div>
              </div>
              <div class="category-group">
                <div
                  :class="['category-item expandable', { active: activeCategory === '达力楼' }]"
                  @click="toggleCategory('达力楼')"
                >
                  <span>
                    <el-icon><office-building /></el-icon>
                    达力楼
                  </span>
                  <el-icon :class="['expand-icon', { expanded: expandedCategories.includes('达力楼') }]">
                    <arrow-down />
                  </el-icon>
                </div>
                <div v-if="expandedCategories.includes('达力楼')" class="sub-categories">
                  <div
                    v-for="floor in floors"
                    :key="floor"
                    :class="['sub-category', { active: activeCategory === floor }]"
                    @click="setActiveCategory(floor)"
                  >
                    {{ floor }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧内容区域 -->
          <div class="room-booking-content">
            <!-- 我的预约 -->
            <div v-if="activeMenuItem === '我的预约'" class="my-bookings">
              <div class="search-filters">
                <div class="filter-row">
                  <div class="filter-item">
                    <label>预约名称</label>
                    <el-input v-model="searchFilters.name" placeholder="请输入预约名称" />
                  </div>
                  <div class="filter-item">
                    <label>审核状态</label>
                    <el-select v-model="searchFilters.auditType" placeholder="全部">
                      <el-option label="全部" value="" />
                      <el-option label="待审核" value="待审核" />
                      <el-option label="通过" value="通过" />
                      <el-option label="拒绝" value="拒绝" />
                    </el-select>
                  </div>
                  <div class="filter-item">
                    <label>使用状态</label>
                    <el-select v-model="searchFilters.useStatus" placeholder="全部">
                      <el-option label="全部" value="" />
                      <el-option label="未开始" value="未开始" />
                      <el-option label="进行中" value="进行中" />
                      <el-option label="已结束" value="已结束" />
                    </el-select>
                  </div>
                  <div class="filter-item">
                    <label>预约时间</label>
                    <el-date-picker
                      v-model="searchFilters.startTime"
                      type="datetime"
                      placeholder="开始时间"
                    />
                  </div>
                  <div class="filter-item">
                    <label>结束时间</label>
                    <el-date-picker
                      v-model="searchFilters.endTime"
                      type="datetime"
                      placeholder="结束时间"
                    />
                  </div>
                  <div class="filter-actions">
                    <el-button type="primary" @click="handleSearch">搜索</el-button>
                    <el-button @click="handleResetFilters">重置</el-button>
                  </div>
                </div>
              </div>

              <div class="booking-table">
                <el-table :data="paginatedBookingData" style="width: 100%">
                  <el-table-column prop="bookingName" label="预约名称" width="200" />
                  <el-table-column prop="bookingTime" label="预约时间" width="300" />
                  <el-table-column prop="description" label="预约说明" />
                  <el-table-column prop="roomName" label="预约房间" width="150" />
                  <el-table-column prop="auditStatus" label="审核状态" width="100">
                    <template #default="scope">
                      <el-tag
                        :type="getStatusType(scope.row.auditStatus)"
                        size="small"
                      >
                        {{ scope.row.auditStatus }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="useStatus" label="使用状态" width="100">
                    <template #default="scope">
                      <el-tag
                        :type="getUseStatusType(scope.row.useStatus)"
                        size="small"
                      >
                        {{ scope.row.useStatus }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="100">
                    <template #default="scope">
                      <el-button type="primary" size="small" @click="handleEdit(scope.row)">
                        编辑
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>

              <div class="pagination">
                <el-pagination
                  v-model:current-page="bookingPagination.currentPage"
                  v-model:page-size="bookingPagination.pageSize"
                  :page-sizes="[10, 20, 50, 100]"
                  :total="bookingPagination.total"
                  layout="total, sizes, prev, pager, next, jumper"
                  @size-change="handleBookingSizeChange"
                  @current-change="handleBookingCurrentChange"
                />
              </div>
            </div>

            <!-- 全部借用 -->
            <div v-if="activeMenuItem === '全部借用'" class="all-bookings">
              <div class="search-filters">
                <div class="filter-row">
                  <div class="filter-item">
                    <label>预约名称</label>
                    <el-input v-model="allBookingFilters.name" placeholder="请输入预约名称" />
                  </div>
                  <div class="filter-item">
                    <label>申请人</label>
                    <el-input v-model="allBookingFilters.applicant" placeholder="请输入申请人" />
                  </div>
                  <div class="filter-item">
                    <label>审核状态</label>
                    <el-select v-model="allBookingFilters.auditType" placeholder="全部">
                      <el-option label="全部" value="" />
                      <el-option label="待审核" value="待审核" />
                      <el-option label="通过" value="通过" />
                      <el-option label="拒绝" value="拒绝" />
                    </el-select>
                  </div>
                  <div class="filter-item">
                    <label>使用状态</label>
                    <el-select v-model="allBookingFilters.useStatus" placeholder="全部">
                      <el-option label="全部" value="" />
                      <el-option label="未开始" value="未开始" />
                      <el-option label="进行中" value="进行中" />
                      <el-option label="已结束" value="已结束" />
                    </el-select>
                  </div>
                  <div class="filter-actions">
                    <el-button type="primary" @click="handleAllBookingSearch">搜索</el-button>
                    <el-button @click="handleResetAllBookingFilters">重置</el-button>
                  </div>
                </div>
              </div>

              <div class="booking-table">
                <el-table :data="paginatedAllBookingData" style="width: 100%">
                  <el-table-column prop="bookingName" label="预约名称" width="200" />
                  <el-table-column prop="applicant" label="申请人" width="100" />
                  <el-table-column prop="bookingTime" label="预约时间" width="300" />
                  <el-table-column prop="description" label="预约说明" />
                  <el-table-column prop="roomName" label="预约房间" width="150" />
                  <el-table-column prop="auditStatus" label="审核状态" width="100">
                    <template #default="scope">
                      <el-tag
                        :type="getStatusType(scope.row.auditStatus)"
                        size="small"
                      >
                        {{ scope.row.auditStatus }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="useStatus" label="使用状态" width="100">
                    <template #default="scope">
                      <el-tag
                        :type="getUseStatusType(scope.row.useStatus)"
                        size="small"
                      >
                        {{ scope.row.useStatus }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="150">
                    <template #default="scope">
                      <el-button type="success" size="small" @click="handleApprove(scope.row)">
                        审核
                      </el-button>
                      <el-button type="primary" size="small" @click="handleEdit(scope.row)">
                        编辑
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>

              <div class="pagination">
                <el-pagination
                  v-model:current-page="allBookingPagination.currentPage"
                  v-model:page-size="allBookingPagination.pageSize"
                  :page-sizes="[10, 20, 50, 100]"
                  :total="allBookingPagination.total"
                  layout="total, sizes, prev, pager, next, jumper"
                  @size-change="handleAllBookingSizeChange"
                  @current-change="handleAllBookingCurrentChange"
                />
              </div>
            </div>

            <!-- 房间预约 -->
            <div v-if="activeMenuItem === '房间预约'" class="room-list">
              <div class="room-grid">
                <div
                  v-for="room in filteredRooms"
                  :key="room.id"
                  :class="['room-card', { unavailable: !room.available }]"
                >
                  <div class="room-header">
                    <h4>{{ room.name }}</h4>
                  </div>
                  <div class="room-info">
                    <div class="capacity">容纳人数：{{ room.capacity }}</div>
                  </div>
                  <div class="room-actions">
                    <el-button
                      :type="room.available ? 'primary' : 'info'"
                      :disabled="!room.available"
                      @click="bookRoom(room)"
                    >
                      {{ room.available ? '立即预约' : '不可预约' }}
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, reactive } from 'vue'
import { Search } from '@element-plus/icons-vue'
import DashboardStats from '@/components/RoomBooking/DashboardStats.vue'

export default {
  name: 'RoomBooking',
  components: {
    DashboardStats
  },
  setup() {
    // 统计数据
    const stats = ref({
      totalBookings: 1234,
      teacherBookings: 34,
      studentBookings: 1200
    })
    
    // 当前激活的标签页
    const tabs = ['数据看板', '借用管理']
    const activeTab = ref('数据看板')
    
    // 借用管理相关
    const menuItems = ['我的预约', '全部借用', '房间预约']
    const activeMenuItem = ref('我的预约')
    const activeCategory = ref('全部')
    const expandedCategories = ref(['达力楼'])
    const searchKeyword = ref('')
    const floors = ['1F', '2F', '3F', '4F', '5F', '6F', 'B1', 'B2']
    
    // 我的预约相关
    const searchFilters = reactive({
      name: '',
      auditType: '',
      useStatus: '',
      startTime: '',
      endTime: ''
    })
    
    const bookingPagination = reactive({
      currentPage: 1,
      pageSize: 10,
      total: 0
    })
    
    // 全部借用列表相关
    const allBookingFilters = reactive({
      name: '',
      applicant: '',
      auditType: '',
      useStatus: '',
      startTime: '',
      endTime: ''
    })
    
    const allBookingPagination = reactive({
      currentPage: 1,
      pageSize: 10,
      total: 0
    })
    
    // 预约数据
    const bookingData = ref([
      {
        id: 1,
        bookingName: '【教师人员专】的配置管理',
        bookingTime: '2025.04.24 第一节次、第二节次、第三节次、第四节次',
        description: '各类通过这里发布各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息',
        applicant: '王玲',
        roomName: '多媒体教室（101）',
        auditStatus: '待审核',
        useStatus: '未开始'
      },
      {
        id: 2,
        bookingName: '【教师人员专】的配置管理',
        bookingTime: '2025.04.24 第一节次、第二节次、第三节次、第四节次',
        description: '各类通过这里发布各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息',
        applicant: '王玲',
        roomName: '多媒体教室（102）',
        auditStatus: '待审核',
        useStatus: '未开始'
      },
      {
        id: 3,
        bookingName: '【教师人员专】的配置管理',
        bookingTime: '2025.04.24 第一节次、第二节次、第三节次、第四节次',
        description: '各类通过这里发布各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息',
        applicant: '王玲',
        roomName: '多媒体教室（103）',
        auditStatus: '待审核',
        useStatus: '未开始'
      },
      {
        id: 4,
        bookingName: '【教师人员专】的配置管理',
        bookingTime: '2025.04.24 第一节次、第二节次、第三节次、第四节次',
        description: '各类通过这里发布各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息',
        applicant: '王玲',
        roomName: '多媒体教室（104）',
        auditStatus: '通过',
        useStatus: '未开始'
      },
      {
        id: 5,
        bookingName: '【教师人员专】的配置管理',
        bookingTime: '2025.04.24 第一节次、第二节次、第三节次、第四节次',
        description: '各类通过这里发布各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息',
        applicant: '王玲',
        roomName: '多媒体教室（105）',
        auditStatus: '通过',
        useStatus: '进行中'
      }
    ])

    // 全部借用数据
    const allBookingData = ref([
      {
        id: 1,
        bookingName: '【教师人员专】的配置管理',
        bookingTime: '2025.04.24 第一节次、第二节次、第三节次、第四节次',
        description: '各类通过这里发布各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息',
        applicant: '张老师',
        roomName: '多媒体教室（101）',
        auditStatus: '待审核',
        useStatus: '未开始'
      },
      {
        id: 2,
        bookingName: '【学生活动】社团会议',
        bookingTime: '2025.04.25 第一节次、第二节次',
        description: '学生社团定期会议活动安排',
        applicant: '李同学',
        roomName: '多媒体教室（102）',
        auditStatus: '通过',
        useStatus: '未开始'
      },
      {
        id: 3,
        bookingName: '【教师培训】新教师培训',
        bookingTime: '2025.04.26 第一节次、第二节次、第三节次',
        description: '新入职教师培训活动',
        applicant: '王主任',
        roomName: '多媒体教室（103）',
        auditStatus: '通过',
        useStatus: '进行中'
      }
    ])

    // 房间数据
    const rooms = ref([
      { id: 1, name: '多媒体教室（101）', capacity: '未设置', available: false, building: '达力楼', floor: '1F' },
      { id: 2, name: '多媒体教室（102）', capacity: '20人', available: true, building: '达力楼', floor: '1F' },
      { id: 3, name: '多媒体教室（103）', capacity: '20人', available: true, building: '达力楼', floor: '1F' },
      { id: 4, name: '多媒体教室（104）', capacity: '20人', available: true, building: '达力楼', floor: '1F' },
      { id: 5, name: '多媒体教室（105）', capacity: '20人', available: true, building: '达力楼', floor: '1F' },
      { id: 6, name: '多媒体教室（106）', capacity: '20人', available: true, building: '达力楼', floor: '1F' },
      { id: 7, name: '多媒体教室（107）', capacity: '20人', available: false, building: '达力楼', floor: '1F' },
      { id: 8, name: '多媒体教室（201）', capacity: '20人', available: true, building: '达力楼', floor: '2F' },
      { id: 9, name: '多媒体教室（202）', capacity: '20人', available: true, building: '达力楼', floor: '2F' }
    ])

    // 计算属性
    const filteredRooms = computed(() => {
      let filtered = rooms.value
      
      // 按分类筛选
      if (activeCategory.value !== '全部') {
        filtered = filtered.filter(room => {
          if (activeCategory.value === '1F' || activeCategory.value === '2F' || activeCategory.value === '3F' || 
              activeCategory.value === '4F' || activeCategory.value === '5F' || activeCategory.value === '6F' ||
              activeCategory.value === 'B1' || activeCategory.value === 'B2') {
            return room.floor === activeCategory.value
          }
          return room.building === activeCategory.value
        })
      }
      
      // 按搜索关键词筛选
      if (searchKeyword.value) {
        filtered = filtered.filter(room => 
          room.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
        )
      }
      
      return filtered
    })

    const filteredBookings = computed(() => {
      let filtered = bookingData.value
      
      if (searchFilters.name) {
        filtered = filtered.filter(booking => 
          booking.bookingName.toLowerCase().includes(searchFilters.name.toLowerCase())
        )
      }
      
      if (searchFilters.auditType) {
        filtered = filtered.filter(booking => booking.auditStatus === searchFilters.auditType)
      }
      
      if (searchFilters.useStatus) {
        filtered = filtered.filter(booking => booking.useStatus === searchFilters.useStatus)
      }
      
      return filtered
    })

    const paginatedBookingData = computed(() => {
      const start = (bookingPagination.currentPage - 1) * bookingPagination.pageSize
      const end = start + bookingPagination.pageSize
      const filtered = filteredBookings.value
      bookingPagination.total = filtered.length
      return filtered.slice(start, end)
    })

    const filteredAllBookings = computed(() => {
      let filtered = allBookingData.value
      
      if (allBookingFilters.name) {
        filtered = filtered.filter(booking => 
          booking.bookingName.toLowerCase().includes(allBookingFilters.name.toLowerCase())
        )
      }
      
      if (allBookingFilters.applicant) {
        filtered = filtered.filter(booking => 
          booking.applicant.toLowerCase().includes(allBookingFilters.applicant.toLowerCase())
        )
      }
      
      if (allBookingFilters.auditType) {
        filtered = filtered.filter(booking => booking.auditStatus === allBookingFilters.auditType)
      }
      
      if (allBookingFilters.useStatus) {
        filtered = filtered.filter(booking => booking.useStatus === allBookingFilters.useStatus)
      }
      
      return filtered
    })

    const paginatedAllBookingData = computed(() => {
      const start = (allBookingPagination.currentPage - 1) * allBookingPagination.pageSize
      const end = start + allBookingPagination.pageSize
      const filtered = filteredAllBookings.value
      allBookingPagination.total = filtered.length
      return filtered.slice(start, end)
    })

    // 方法
    const setActiveTab = (tabName) => {
      activeTab.value = tabName
    }

    const setActiveMenuItem = (menuItem) => {
      activeMenuItem.value = menuItem
    }

    const setActiveCategory = (category) => {
      activeCategory.value = category
    }

    const toggleCategory = (category) => {
      if (expandedCategories.value.includes(category)) {
        expandedCategories.value = expandedCategories.value.filter(c => c !== category)
      } else {
        expandedCategories.value.push(category)
      }
      setActiveCategory(category)
    }

    const bookRoom = (room) => {
      if (room.available) {
        console.log('预约房间:', room)
        // 这里可以添加预约逻辑
      }
    }

    const handleTimeRangeChange = (timeRange) => {
      console.log('时间范围变更:', timeRange)
    }

    const getStatusType = (status) => {
      switch (status) {
        case '待审核':
          return 'warning'
        case '通过':
          return 'success'
        case '拒绝':
          return 'danger'
        default:
          return ''
      }
    }

    const getUseStatusType = (status) => {
      switch (status) {
        case '未开始':
          return 'info'
        case '进行中':
          return 'success'
        case '已结束':
          return ''
        default:
          return ''
      }
    }

    const handleSearch = () => {
      bookingPagination.currentPage = 1
    }

    const handleResetFilters = () => {
      Object.keys(searchFilters).forEach(key => {
        searchFilters[key] = ''
      })
      bookingPagination.currentPage = 1
    }

    const handleAllBookingSearch = () => {
      allBookingPagination.currentPage = 1
    }

    const handleResetAllBookingFilters = () => {
      Object.keys(allBookingFilters).forEach(key => {
        allBookingFilters[key] = ''
      })
      allBookingPagination.currentPage = 1
    }

    const handleEdit = (row) => {
      console.log('编辑:', row)
    }

    const handleApprove = (row) => {
      console.log('审核:', row)
    }

    const handleBookingSizeChange = (size) => {
      bookingPagination.pageSize = size
    }

    const handleBookingCurrentChange = (page) => {
      bookingPagination.currentPage = page
    }

    const handleAllBookingSizeChange = (size) => {
      allBookingPagination.pageSize = size
    }

    const handleAllBookingCurrentChange = (page) => {
      allBookingPagination.currentPage = page
    }

    return {
      stats,
      tabs,
      activeTab,
      menuItems,
      activeMenuItem,
      activeCategory,
      expandedCategories,
      searchKeyword,
      floors,
      searchFilters,
      bookingPagination,
      allBookingFilters,
      allBookingPagination,
      bookingData,
      allBookingData,
      rooms,
      filteredRooms,
      paginatedBookingData,
      paginatedAllBookingData,
      Search,
      setActiveTab,
      setActiveMenuItem,
      setActiveCategory,
      toggleCategory,
      bookRoom,
      handleTimeRangeChange,
      getStatusType,
      getUseStatusType,
      handleSearch,
      handleResetFilters,
      handleAllBookingSearch,
      handleResetAllBookingFilters,
      handleEdit,
      handleApprove,
      handleBookingSizeChange,
      handleBookingCurrentChange,
      handleAllBookingSizeChange,
      handleAllBookingCurrentChange
    }
  }
}
</script>

<style scoped>
.room-booking {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.header {
  height: 60px;
  background: #4A90E2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-left .title {
  font-size: 18px;
  font-weight: 600;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.dropdown-link {
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  transition: all 0.3s;
}

.dropdown-link:hover {
  background: rgba(255, 255, 255, 0.1);
}

.main-content {
  padding: 20px;
}

.tabs {
  display: flex;
  background: white;
  border-radius: 8px 8px 0 0;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 0;
  border-bottom: 1px solid #e8e8e8;
}

.tab-item {
  flex: 1;
  padding: 15px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  background: #f5f5f5;
  color: #666;
  border-bottom: 3px solid transparent;
  font-weight: 500;
}

.tab-item:hover {
  background: #e6f3ff;
  color: #333;
}

.tab-item.active {
  background: #4A90E2;
  color: white;
  border-bottom-color: #4A90E2;
}

.dashboard-content {
  background: white;
  border-radius: 0 0 8px 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 借用管理页面样式 */
.booking-management {
  height: calc(100vh - 160px);
}

.booking-layout {
  display: flex;
  height: 100%;
  gap: 0;
}

/* 左侧功能菜单 */
.left-sidebar {
  width: 300px;
  background: white;
  border-right: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 20px 25px;
  border-bottom: 1px solid #e8e8e8;
  background: #4A90E2;
  color: white;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.sidebar-menu {
  flex: 1;
}

.menu-item {
  padding: 20px 25px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  color: #666;
  border-left: 3px solid transparent;
  transition: all 0.3s;
  font-size: 16px;
  line-height: 1.5;
  white-space: nowrap;
}

.menu-item:hover {
  background: #f5f5f5;
  color: #333;
}

.menu-item.active {
  background: #e6f3ff;
  color: #4A90E2;
  border-left-color: #4A90E2;
}

/* 中间楼宇分类 */
.middle-sidebar {
  width: 200px;
  background: white;
  border-right: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
  padding: 15px;
}

.search-box {
  margin-bottom: 15px;
}

.category-tree {
  flex: 1;
  overflow-y: auto;
}

.category-item {
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
  color: #666;
  font-size: 14px;
}

.category-item:hover {
  background: #f5f5f5;
  color: #333;
}

.category-item.active {
  background: #e6f3ff;
  color: #4A90E2;
}

.category-item.expandable {
  justify-content: space-between;
}

.expand-icon {
  transition: transform 0.3s;
}

.expand-icon.expanded {
  transform: rotate(180deg);
}

.category-group {
  margin-bottom: 5px;
}

.sub-categories {
  margin-left: 20px;
  border-left: 1px solid #e8e8e8;
  padding-left: 10px;
}

.sub-category {
  padding: 6px 12px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
  color: #666;
  font-size: 13px;
}

.sub-category:hover {
  background: #f5f5f5;
  color: #333;
}

.sub-category.active {
  background: #e6f3ff;
  color: #4A90E2;
}

/* 右侧房间列表 */
.room-list {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: #f9f9f9;
}

.room-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.room-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  border: 2px solid transparent;
}

.room-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.room-card.unavailable {
  background: #ff4d4f;
  color: white;
}

.room-card.unavailable .room-header h4 {
  color: white;
}

.room-card:not(.unavailable) {
  background: #52c41a;
  color: white;
}

.room-card:not(.unavailable) .room-header h4 {
  color: white;
}

.room-header {
  margin-bottom: 15px;
}

.room-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.room-info {
  margin-bottom: 15px;
}

.capacity {
  font-size: 14px;
  opacity: 0.9;
}

.room-actions {
  display: flex;
  justify-content: center;
}

.room-actions .el-button {
  width: 100%;
  border-radius: 20px;
  font-weight: 500;
}

/* 我的预约和全部借用列表页面样式 */
.my-bookings,
.all-bookings {
  flex: 1;
  padding: 20px;
  background: #f9f9f9;
}

.search-filters {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: flex-end;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 200px;
}

.filter-item label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.filter-actions {
  display: flex;
  gap: 10px;
}

.booking-table {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.pagination {
  display: flex;
  justify-content: center;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.room-booking-content {
  display: flex;
  flex: 1;
}

@media (max-width: 1200px) {
  .booking-layout {
    flex-direction: column;
  }
  
  .left-sidebar, .middle-sidebar {
    width: 100%;
    height: auto;
  }
  
  .left-sidebar {
    max-height: 150px;
  }
  
  .middle-sidebar {
    max-height: 200px;
  }
  
  .filter-row {
    flex-direction: column;
    gap: 15px;
  }
  
  .filter-item {
    min-width: 100%;
  }
}

@media (max-width: 768px) {
  .room-grid {
    grid-template-columns: 1fr;
  }
  
  .left-sidebar, .middle-sidebar {
    max-height: 120px;
  }
  
  .my-bookings {
    padding: 15px;
  }
  
  .search-filters {
    padding: 15px;
  }
  
  .booking-table {
    padding: 15px;
  }
  
  .filter-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .filter-actions .el-button {
    width: 100%;
  }
}
</style>