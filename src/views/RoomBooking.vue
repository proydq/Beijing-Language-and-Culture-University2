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
        <div class="tab-item active" @click="setActiveTab('数据看板')">数据看板</div>
        <div class="tab-item" @click="setActiveTab('借用管理')">借用管理</div>
        <div class="tab-item" @click="setActiveTab('审批管理')">审批管理</div>
        <div class="tab-item" @click="setActiveTab('数据记录')">数据记录</div>
        <div class="tab-item" @click="setActiveTab('设置')">设置</div>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="main-content">
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
  </div>
</template>

<script>
import { ref, onMounted, nextTick } from 'vue'

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
    
    // 图表引用
    const studentChart = ref(null)
    const teacherChart = ref(null)
    const trendChart = ref(null)

    // 设置激活的标签页
    const setActiveTab = (tabName) => {
      activeTab.value = tabName
      // 这里可以根据不同的标签页加载不同的内容
      console.log('切换到标签页:', tabName)
    }

    // 设置时间范围
    const setTimeRange = (range) => {
      activeTimeRange.value = range
      // 这里可以根据不同的时间范围加载不同的数据
      loadTrendData()
    }

    // 查询数据
    const queryData = () => {
      console.log('查询数据:', startDate.value, endDate.value)
      loadTrendData()
    }

    // 加载趋势数据
    const loadTrendData = () => {
      // 这里可以调用API获取数据
      console.log('加载趋势数据')
    }

    // 初始化饼图
    const initPieCharts = () => {
      // 模拟饼图数据
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
      
      // 这里可以使用 ECharts 或其他图表库来绘制饼图
      // 由于演示，这里只是模拟
      drawPieChart(studentChart.value, studentData)
      drawPieChart(teacherChart.value, teacherData)
    }

    // 绘制饼图（模拟）
    const drawPieChart = (element, data) => {
      if (!element) return
      
      // 创建简单的饼图视觉效果
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
      
      // 模拟趋势图数据
      const dates = []
      const approvedData = []
      const pendingData = []
      
      // 生成最近15天的数据
      for (let i = 14; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        dates.push(date.toISOString().split('T')[0])
        
        // 模拟数据
        approvedData.push(Math.floor(Math.random() * 100))
        pendingData.push(Math.floor(Math.random() * 50))
      }
      
      // 这里可以使用 ECharts 或其他图表库来绘制折线图
      // 由于演示，这里只是创建一个简单的视觉效果
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
      studentChart,
      teacherChart,
      trendChart,
      setActiveTab,
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

@media (max-width: 768px) {
  .header {
    padding: 15px 20px;
  }
  
  .nav-tabs {
    padding: 0 20px;
    overflow-x: auto;
  }
  
  .main-content {
    padding: 20px;
  }
  
  .stats-grid {
    flex-direction: column;
    gap: 20px;
  }
  
  .chart-container {
    flex-direction: column;
    gap: 20px;
  }
  
  .trend-header {
    flex-direction: column;
    gap: 15px;
  }
  
  .time-filter {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
}
</style>