<template>
  <div class="room-booking">
    <!-- 顶部导航栏 -->
    <div class="header">
      <div class="header-left">
        <div class="logo">
          <el-icon size="24"><home-filled /></el-icon>
        </div>
        <span class="title">房屋模块</span>
      </div>
      <div class="header-right">
        <div class="avatar">
          <el-icon size="20"><user /></el-icon>
        </div>
        <span class="username">administrator</span>
        <el-dropdown>
          <span class="dropdown-link">
            <el-icon><grid /></el-icon>
          </span>
        </el-dropdown>
      </div>
    </div>

    <!-- 导航标签页 -->
    <div class="nav-tabs-container">
      <div class="nav-tabs">
        <div class="tab-item" :class="{ active: activeTab === '数据看板' }" @click="setActiveTab('数据看板')">数据看板</div>
        <div class="tab-item" :class="{ active: activeTab === '借用管理' }" @click="setActiveTab('借用管理')">借用管理</div>
        <div class="tab-item" :class="{ active: activeTab === '审批管理' }" @click="setActiveTab('审批管理')">审批管理</div>
        <div class="tab-item" :class="{ active: activeTab === '数据记录' }" @click="setActiveTab('数据记录')">数据记录</div>
        <div class="tab-item" :class="{ active: activeTab === '设置' }" @click="setActiveTab('设置')">设置</div>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 数据看板内容 -->
      <div v-if="activeTab === '数据看板'" class="dashboard-content">
        <!-- 借用次数统计 -->
        <div class="stats-section">
          <div class="stats-title">
            <h3>借用次数统计</h3>
            <p class="stats-desc">最近时间为：当前实时时间；借用人数为：老师+学生今日授权人数（合计与明细相关）</p>
          </div>
          
          <div class="stats-grid">
            <!-- 统计数据 -->
            <div class="stats-card">
              <div class="stats-item">
                <span class="label">借用总次数：</span>
                <span class="value">{{ totalBookings }}次</span>
              </div>
              <div class="stats-item">
                <span class="label">教师借用次数：</span>
                <span class="value">{{ teacherBookings }}次</span>
              </div>
              <div class="stats-item">
                <span class="label">学生借用次数：</span>
                <span class="value">{{ studentBookings }}次</span>
              </div>
            </div>

            <!-- 饼图区域 -->
            <div class="chart-section">
              <div class="chart-container">
                <div class="chart-item">
                  <div class="pie-chart" ref="studentChart"></div>
                  <div class="chart-title">学生借用数据</div>
                </div>
                <div class="chart-item">
                  <div class="pie-chart" ref="teacherChart"></div>
                  <div class="chart-title">教师借用数据</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 借用趋势图 -->
        <div class="trend-section">
          <div class="trend-header">
            <div class="trend-title">
              <h3>借用趋势图</h3>
              <p class="trend-desc">暂无内容为：无当天时间，或当趋势图数据（不分学生年级老师）</p>
            </div>
            
            <!-- 时间筛选器 -->
            <div class="time-filter">
              <el-button-group>
                <el-button :class="{ active: activeTimeRange === '近7天' }" @click="setTimeRange('近7天')">近7天</el-button>
                <el-button :class="{ active: activeTimeRange === '近15天' }" @click="setTimeRange('近15天')">近15天</el-button>
                <el-button :class="{ active: activeTimeRange === '近一个月' }" @click="setTimeRange('近一个月')">近一个月</el-button>
                <el-button :class="{ active: activeTimeRange === '近12个月' }" @click="setTimeRange('近12个月')">近12个月</el-button>
              </el-button-group>
              
              <div class="date-range">
                <el-date-picker
                  v-model="startDate"
                  type="date"
                  placeholder="请选择开始时间"
                  size="small"
                />
                <span class="date-separator">至</span>
                <el-date-picker
                  v-model="endDate"
                  type="date"
                  placeholder="请选择结束时间"
                  size="small"
                />
                <el-button type="primary" size="small" @click="queryData">查询</el-button>
              </div>
            </div>
          </div>

          <!-- 趋势图表 -->
          <div class="trend-chart">
            <div class="line-chart" ref="trendChart"></div>
          </div>
        </div>
      </div>

      <!-- 借用管理内容 -->
      <div v-if="activeTab === '借用管理'" class="booking-management">
        <div class="booking-layout">
          <!-- 左侧功能菜单 -->
          <div class="left-sidebar">
            <div class="sidebar-header">
              <h3>房源使用/预约</h3>
            </div>
            <div class="sidebar-menu">
              <div class="menu-item" :class="{ active: activeMenuItem === '借用预约列表' }" @click="setActiveMenuItem('借用预约列表')">
                <el-icon><list /></el-icon>
                <span>借用预约列表</span>
              </div>
              <div class="menu-item" :class="{ active: activeMenuItem === '我的预约' }" @click="setActiveMenuItem('我的预约')">
                <el-icon><user /></el-icon>
                <span>我的预约</span>
              </div>
              <div class="menu-item" :class="{ active: activeMenuItem === '全部借用房源列表' }" @click="setActiveMenuItem('全部借用房源列表')">
                <el-icon><office-building /></el-icon>
                <span>全部借用房源列表</span>
              </div>
            </div>
          </div>

          <!-- 我的预约内容 -->
          <div v-if="activeMenuItem === '我的预约'" class="my-bookings">
            <!-- 搜索筛选区域 -->
            <div class="search-filters">
              <div class="filter-row">
                <div class="filter-item">
                  <label>借用/预约名称：</label>
                  <el-input
                    v-model="searchFilters.name"
                    placeholder="请输入信息"
                    size="small"
                    clearable
                  />
                </div>
                <div class="filter-item">
                  <label>审核类型：</label>
                  <el-select v-model="searchFilters.auditType" placeholder="全部" size="small">
                    <el-option label="全部" value="" />
                    <el-option label="待审核" value="待审核" />
                    <el-option label="已审核" value="已审核" />
                    <el-option label="已拒绝" value="已拒绝" />
                  </el-select>
                </div>
                <div class="filter-item">
                  <label>使用状态：</label>
                  <el-select v-model="searchFilters.useStatus" placeholder="全部" size="small">
                    <el-option label="全部" value="" />
                    <el-option label="未开始" value="未开始" />
                    <el-option label="进行中" value="进行中" />
                    <el-option label="已结束" value="已结束" />
                  </el-select>
                </div>
                <div class="filter-item">
                  <label>预约时间：</label>
                  <el-date-picker
                    v-model="searchFilters.startTime"
                    type="datetime"
                    placeholder="请选择开始时间"
                    size="small"
                    format="YYYY-MM-DD HH:mm"
                    value-format="YYYY-MM-DD HH:mm"
                  />
                </div>
                <div class="filter-item">
                  <el-date-picker
                    v-model="searchFilters.endTime"
                    type="datetime"
                    placeholder="请选择结束时间"
                    size="small"
                    format="YYYY-MM-DD HH:mm"
                    value-format="YYYY-MM-DD HH:mm"
                  />
                </div>
                <div class="filter-actions">
                  <el-button type="primary" size="small" @click="handleSearch">搜索</el-button>
                  <el-button size="small" @click="handleReset">重置</el-button>
                </div>
              </div>
            </div>

            <!-- 数据表格 -->
            <div class="booking-table">
              <el-table
                :data="paginatedBookings"
                style="width: 100%"
                border
                stripe
              >
                <el-table-column prop="bookingName" label="借用/预约名称" min-width="200" />
                <el-table-column prop="bookingTime" label="预约时间" min-width="200" />
                <el-table-column prop="description" label="描述" min-width="300" />
                <el-table-column prop="applicant" label="预约人" width="100" />
                <el-table-column prop="roomName" label="预约教室" width="150" />
                <el-table-column prop="auditStatus" label="审核状态" width="100">
                  <template #default="scope">
                    <el-tag
                      :type="getAuditStatusType(scope.row.auditStatus)"
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
                <el-table-column label="操作" width="200">
                  <template #default="scope">
                    <el-button
                      type="primary"
                      size="small"
                      @click="handleViewDetails(scope.row)"
                    >
                      查看详情
                    </el-button>
                    <el-button
                      v-if="scope.row.auditStatus === '待审核'"
                      type="danger"
                      size="small"
                      @click="handleCancelBooking(scope.row)"
                    >
                      取消预约
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <!-- 分页 -->
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

          <!-- 房间列表内容 -->
          <div v-else class="room-booking-content">
            <!-- 中间楼宇分类 -->
            <div class="middle-sidebar">
              <div class="search-box">
                <el-input 
                  v-model="searchKeyword" 
                  placeholder="请输入关键字搜索"
                  size="small"
                  :prefix-icon="Search"
                />
              </div>
              <div class="category-tree">
                <div class="category-item" :class="{ active: activeCategory === '全部' }" @click="setActiveCategory('全部')">
                  <el-icon><folder /></el-icon>
                  <span>全部</span>
                </div>
                <div class="category-group">
                  <div class="category-item expandable" @click="toggleCategory('达力楼')">
                    <el-icon><folder /></el-icon>
                    <span>达力楼</span>
                    <el-icon class="expand-icon" :class="{ expanded: expandedCategories.includes('达力楼') }">
                      <arrow-down />
                    </el-icon>
                  </div>
                  <div v-show="expandedCategories.includes('达力楼')" class="sub-categories">
                    <div class="sub-category" :class="{ active: activeCategory === 'B2' }" @click="setActiveCategory('B2')">B2</div>
                    <div class="sub-category" :class="{ active: activeCategory === 'B1' }" @click="setActiveCategory('B1')">B1</div>
                    <div class="sub-category" :class="{ active: activeCategory === '1F' }" @click="setActiveCategory('1F')">1F</div>
                    <div class="sub-category" :class="{ active: activeCategory === '2F' }" @click="setActiveCategory('2F')">2F</div>
                    <div class="sub-category" :class="{ active: activeCategory === '3F' }" @click="setActiveCategory('3F')">3F</div>
                    <div class="sub-category" :class="{ active: activeCategory === '4F' }" @click="setActiveCategory('4F')">4F</div>
                    <div class="sub-category" :class="{ active: activeCategory === '5F' }" @click="setActiveCategory('5F')">5F</div>
                    <div class="sub-category" :class="{ active: activeCategory === '6F' }" @click="setActiveCategory('6F')">6F</div>
                  </div>
                </div>
                <div class="category-item expandable" @click="toggleCategory('成为楼')">
                  <el-icon><folder /></el-icon>
                  <span>成为楼</span>
                  <el-icon class="expand-icon" :class="{ expanded: expandedCategories.includes('成为楼') }">
                    <arrow-down />
                  </el-icon>
                </div>
                <div class="category-item expandable" @click="toggleCategory('爱怡楼')">
                  <el-icon><folder /></el-icon>
                  <span>爱怡楼</span>
                  <el-icon class="expand-icon" :class="{ expanded: expandedCategories.includes('爱怡楼') }">
                    <arrow-down />
                  </el-icon>
                </div>
                <div class="category-item expandable" @click="toggleCategory('博学楼')">
                  <el-icon><folder /></el-icon>
                  <span>博学楼</span>
                  <el-icon class="expand-icon" :class="{ expanded: expandedCategories.includes('博学楼') }">
                    <arrow-down />
                  </el-icon>
                </div>
                <div class="category-item expandable" @click="toggleCategory('正安楼')">
                  <el-icon><folder /></el-icon>
                  <span>正安楼</span>
                  <el-icon class="expand-icon" :class="{ expanded: expandedCategories.includes('正安楼') }">
                    <arrow-down />
                  </el-icon>
                </div>
                <div class="category-item expandable" @click="toggleCategory('其他楼')">
                  <el-icon><folder /></el-icon>
                  <span>其他楼</span>
                  <el-icon class="expand-icon" :class="{ expanded: expandedCategories.includes('其他楼') }">
                    <arrow-down />
                  </el-icon>
                </div>
              </div>
            </div>

            <!-- 右侧房间列表 -->
            <div class="room-list">
              <div class="room-grid">
                <div 
                  v-for="room in filteredRooms" 
                  :key="room.id"
                  class="room-card"
                  :class="{ unavailable: !room.available }"
                >
                  <div class="room-header">
                    <h4>{{ room.name }}</h4>
                  </div>
                  <div class="room-info">
                    <span class="capacity">可容纳：{{ room.capacity }}</span>
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
import { ref, onMounted, nextTick, computed, reactive } from 'vue'
import { Search } from '@element-plus/icons-vue'

export default {
  name: 'RoomBooking',
  setup() {
    // 数据统计
    const totalBookings = ref(1234)
    const teacherBookings = ref(34)
    const studentBookings = ref(1200)
    
    // 时间筛选
    const activeTimeRange = ref('近15天')
    const startDate = ref('')
    const endDate = ref('')
    
    // 当前激活的标签页
    const activeTab = ref('数据看板')
    
    // 借用管理相关
    const activeMenuItem = ref('我的预约')
    const activeCategory = ref('全部')
    const expandedCategories = ref(['达力楼'])
    const searchKeyword = ref('')
    
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
      },
      {
        id: 6,
        bookingName: '【教师人员专】的配置管理',
        bookingTime: '2025.04.24 第一节次、第二节次、第三节次、第四节次',
        description: '各类通过这里发布各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息',
        applicant: '王玲',
        roomName: '多媒体教室（106）',
        auditStatus: '拒绝',
        useStatus: '/'
      },
      {
        id: 7,
        bookingName: '【教师人员专】的配置管理',
        bookingTime: '2025.04.24 第一节次、第二节次、第三节次、第四节次',
        description: '各类通过这里发布各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息',
        applicant: '王玲',
        roomName: '多媒体教室（107）',
        auditStatus: '拒绝',
        useStatus: '/'
      },
      {
        id: 8,
        bookingName: '【教师人员专】的配置管理',
        bookingTime: '2025.04.24 第一节次、第二节次、第三节次、第四节次',
        description: '各类通过这里发布各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息',
        applicant: '王玲',
        roomName: '多媒体教室（108）',
        auditStatus: '通过',
        useStatus: '已结束'
      },
      {
        id: 9,
        bookingName: '【教师人员专】的配置管理',
        bookingTime: '2025.04.24 第一节次、第二节次、第三节次、第四节次',
        description: '各类通过这里发布各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息',
        applicant: '王玲',
        roomName: '多媒体教室（109）',
        auditStatus: '通过',
        useStatus: '已结束'
      },
      {
        id: 10,
        bookingName: '【教师人员专】的配置管理',
        bookingTime: '2025.04.24 第一节次、第二节次、第三节次、第四节次',
        description: '各类通过这里发布各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息',
        applicant: '王玲',
        roomName: '多媒体教室（110）',
        auditStatus: '已取消',
        useStatus: '/'
      }
    ])
    
    // 过滤后的预约数据
    const filteredBookings = computed(() => {
      let filtered = bookingData.value
      
      // 按名称筛选
      if (searchFilters.name) {
        filtered = filtered.filter(booking => 
          booking.bookingName.includes(searchFilters.name)
        )
      }
      
      // 按审核类型筛选
      if (searchFilters.auditType) {
        filtered = filtered.filter(booking => 
          booking.auditStatus === searchFilters.auditType
        )
      }
      
      // 按使用状态筛选
      if (searchFilters.useStatus) {
        filtered = filtered.filter(booking => 
          booking.useStatus === searchFilters.useStatus
        )
      }
      
      return filtered
    })
    
    // 分页后的数据
    const paginatedBookings = computed(() => {
      const start = (bookingPagination.currentPage - 1) * bookingPagination.pageSize
      const end = start + bookingPagination.pageSize
      const filtered = filteredBookings.value
      bookingPagination.total = filtered.length
      return filtered.slice(start, end)
    })
    
    // 图表引用
    const studentChart = ref(null)
    const teacherChart = ref(null)
    const trendChart = ref(null)

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

    // 筛选房间
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

    // 设置激活的标签页
    const setActiveTab = (tabName) => {
      activeTab.value = tabName
      console.log('切换到标签页:', tabName)
    }

    // 设置激活的菜单项
    const setActiveMenuItem = (menuItem) => {
      activeMenuItem.value = menuItem
      console.log('切换到菜单项:', menuItem)
    }
    
    // 我的预约相关方法
    const handleSearch = () => {
      bookingPagination.currentPage = 1
      console.log('搜索条件:', searchFilters)
    }
    
    const handleReset = () => {
      Object.assign(searchFilters, {
        name: '',
        auditType: '',
        useStatus: '',
        startTime: '',
        endTime: ''
      })
      bookingPagination.currentPage = 1
    }
    
    const handleBookingSizeChange = (size) => {
      bookingPagination.pageSize = size
      bookingPagination.currentPage = 1
    }
    
    const handleBookingCurrentChange = (page) => {
      bookingPagination.currentPage = page
    }
    
    const getAuditStatusType = (status) => {
      switch (status) {
        case '待审核':
          return 'warning'
        case '通过':
          return 'success'
        case '拒绝':
          return 'danger'
        case '已取消':
          return 'info'
        default:
          return 'info'
      }
    }
    
    const getUseStatusType = (status) => {
      switch (status) {
        case '未开始':
          return 'warning'
        case '进行中':
          return 'success'
        case '已结束':
          return 'info'
        default:
          return 'info'
      }
    }
    
    const handleViewDetails = (booking) => {
      console.log('查看详情:', booking)
    }
    
    const handleCancelBooking = (booking) => {
      console.log('取消预约:', booking)
    }

    // 设置激活的分类
    const setActiveCategory = (category) => {
      activeCategory.value = category
      console.log('切换到分类:', category)
    }

    // 切换分类展开状态
    const toggleCategory = (category) => {
      const index = expandedCategories.value.indexOf(category)
      if (index > -1) {
        expandedCategories.value.splice(index, 1)
      } else {
        expandedCategories.value.push(category)
      }
    }

    // 预约房间
    const bookRoom = (room) => {
      if (room.available) {
        console.log('预约房间:', room.name)
      }
    }

    // 设置时间范围
    const setTimeRange = (range) => {
      activeTimeRange.value = range
      loadTrendData()
    }

    // 查询数据
    const queryData = () => {
      console.log('查询数据:', startDate.value, endDate.value)
      loadTrendData()
    }

    // 加载趋势数据
    const loadTrendData = () => {
      console.log('加载趋势数据')
    }

    // 初始化饼图
    const initPieCharts = () => {
      const studentData = [
        { name: '已审批', value: 50, color: '#52c41a' },
        { name: '配发', value: 30, color: '#faad14' },
        { name: '审批中', value: 20, color: '#ff4d4f' }
      ]
      
      const teacherData = [
        { name: '已审批', value: 60, color: '#52c41a' },
        { name: '配发', value: 25, color: '#faad14' },
        { name: '审批中', value: 15, color: '#ff4d4f' }
      ]
      
      drawPieChart(studentChart.value, studentData)
      drawPieChart(teacherChart.value, teacherData)
    }

    // 绘制饼图
    const drawPieChart = (element, data) => {
      if (!element) return
      
      const colors = ['#52c41a', '#faad14', '#ff4d4f']
      const total = data.reduce((sum, item) => sum + item.value, 0)
      
      let currentAngle = 0
      const radius = 80
      const centerX = 100
      const centerY = 100
      
      element.innerHTML = `
        <svg width="200" height="200" viewBox="0 0 200 200">
          ${data.map((item, index) => {
            const angle = (item.value / total) * 2 * Math.PI
            const x1 = centerX + Math.cos(currentAngle) * radius
            const y1 = centerY + Math.sin(currentAngle) * radius
            const x2 = centerX + Math.cos(currentAngle + angle) * radius
            const y2 = centerY + Math.sin(currentAngle + angle) * radius
            
            const largeArcFlag = angle > Math.PI ? 1 : 0
            
            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ')
            
            currentAngle += angle
            
            return `<path d="${pathData}" fill="${colors[index]}" stroke="#fff" stroke-width="2"/>`
          }).join('')}
        </svg>
      `
    }

    // 初始化趋势图
    const initTrendChart = () => {
      if (!trendChart.value) return
      
      trendChart.value.innerHTML = `
        <div style="width: 100%; height: 300px; background: #f9f9f9; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #666;">
          <div style="text-align: center;">
            <div style="font-size: 16px; margin-bottom: 10px;">趋势图表区域</div>
            <div style="font-size: 12px;">（此处可集成 ECharts 或其他图表库）</div>
          </div>
        </div>
      `
    }

    onMounted(() => {
      nextTick(() => {
        initPieCharts()
        initTrendChart()
      })
    })

    return {
      totalBookings,
      teacherBookings,
      studentBookings,
      activeTimeRange,
      startDate,
      endDate,
      activeTab,
      activeMenuItem,
      activeCategory,
      expandedCategories,
      searchKeyword,
      searchFilters,
      bookingData,
      filteredBookings,
      paginatedBookings,
      bookingPagination,
      rooms,
      filteredRooms,
      studentChart,
      teacherChart,
      trendChart,
      Search,
      setActiveTab,
      setActiveMenuItem,
      setActiveCategory,
      toggleCategory,
      bookRoom,
      setTimeRange,
      queryData,
      handleSearch,
      handleReset,
      handleBookingSizeChange,
      handleBookingCurrentChange,
      getAuditStatusType,
      getUseStatusType,
      handleViewDetails,
      handleCancelBooking
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
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background-color 0.3s;
}

.dropdown-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-tabs-container {
  background: #4A90E2;
  width: 100%;
}

.nav-tabs {
  display: flex;
  gap: 0;
  padding-left: 30px;
  max-width: 1400px;
  margin: 0 auto;
}

.tab-item {
  padding: 12px 20px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.3s;
}

.tab-item.active {
  color: white;
  background: rgba(255, 255, 255, 0.1);
  border-bottom-color: #fff;
}

.tab-item:hover {
  color: white;
  background: rgba(255, 255, 255, 0.05);
}

.main-content {
  padding: 30px;
  max-width: 1400px;
  margin: 0 auto;
}

.stats-section {
  background: white;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stats-title {
  margin-bottom: 20px;
}

.stats-title h3 {
  font-size: 18px;
  color: #333;
  margin: 0 0 8px 0;
  font-weight: 600;
}

.stats-desc {
  color: #ff4d4f;
  font-size: 14px;
  margin: 0;
}

.stats-grid {
  display: flex;
  gap: 30px;
  align-items: flex-start;
}

.stats-card {
  flex: 1;
  max-width: 300px;
}

.stats-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.stats-item .label {
  font-size: 16px;
  color: #666;
  margin-right: 10px;
}

.stats-item .value {
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.chart-section {
  flex: 2;
}

.chart-container {
  display: flex;
  gap: 40px;
  justify-content: center;
}

.chart-item {
  text-align: center;
}

.pie-chart {
  width: 200px;
  height: 200px;
  margin-bottom: 10px;
}

.chart-title {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.trend-section {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.trend-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.trend-title h3 {
  font-size: 18px;
  color: #333;
  margin: 0 0 8px 0;
  font-weight: 600;
}

.trend-desc {
  color: #ff4d4f;
  font-size: 14px;
  margin: 0;
}

.time-filter {
  display: flex;
  align-items: center;
  gap: 20px;
}

.el-button-group .el-button {
  background: #f0f0f0;
  border: 1px solid #d9d9d9;
  color: #666;
}

.el-button-group .el-button.active {
  background: #4A90E2;
  border-color: #4A90E2;
  color: white;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 10px;
}

.date-separator {
  color: #666;
  font-size: 14px;
}

.trend-chart {
  margin-top: 20px;
}

.line-chart {
  width: 100%;
  height: 300px;
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
  width: 250px;
  background: white;
  border-right: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 15px 20px;
  border-bottom: 1px solid #e8e8e8;
  background: #4A90E2;
  color: white;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.sidebar-menu {
  flex: 1;
}

.menu-item {
  padding: 15px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  color: #666;
  border-left: 3px solid transparent;
  transition: all 0.3s;
  font-size: 15px;
  line-height: 1.4;
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
  width: 220px;
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

/* 我的预约页面样式 */
.my-bookings {
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