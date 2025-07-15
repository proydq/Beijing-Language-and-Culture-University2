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
</template>

<script>
import { ref, onMounted, nextTick, computed } from 'vue'
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
    const activeMenuItem = ref('借用预约列表')
    const activeCategory = ref('全部')
    const expandedCategories = ref(['达力楼'])
    const searchKeyword = ref('')
    
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
        // 这里可以打开预约弹窗或跳转到预约页面
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

    // 绘制饼图（模拟）
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
      
      const dates = []
      const approvedData = []
      const pendingData = []
      
      for (let i = 14; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        dates.push(date.toISOString().split('T')[0])
        
        approvedData.push(Math.floor(Math.random() * 100))
        pendingData.push(Math.floor(Math.random() * 50))
      }
      
      drawLineChart(trendChart.value, dates, approvedData, pendingData)
    }

    // 绘制折线图（模拟）
    const drawLineChart = (element, dates, approvedData, pendingData) => {
      if (!element) return
      
      element.innerHTML = `
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
      queryData
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
  width: 200px;
  background: white;
  border-right: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 15px;
  border-bottom: 1px solid #e8e8e8;
  background: #4A90E2;
  color: white;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}

.sidebar-menu {
  flex: 1;
}

.menu-item {
  padding: 12px 15px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #666;
  border-left: 3px solid transparent;
  transition: all 0.3s;
  font-size: 14px;
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
  width: 250px;
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
}

@media (max-width: 768px) {
  .room-grid {
    grid-template-columns: 1fr;
  }
  
  .left-sidebar, .middle-sidebar {
    max-height: 120px;
  }
}
</style>