<template>
  <div class="settings-management">
    <div class="settings-layout">
      <!-- 左侧设置菜单 -->
      <div class="settings-sidebar">
        <div class="sidebar-header">
          <h3>设置</h3>
        </div>
        <div class="sidebar-menu">
          <!-- 房屋类别权限设置分组 -->
          <div class="menu-group">
            <div 
              :class="['menu-group-title', { expanded: expandedGroups.includes('house_permission') }]"
              @click="toggleGroup('house_permission')"
            >
              <el-icon><key /></el-icon>
              <span>房屋类别权限设置</span>
              <el-icon class="expand-icon"><arrow-down /></el-icon>
            </div>
            <div v-show="expandedGroups.includes('house_permission')" class="submenu">
              <div 
                v-for="item in housePermissionSettings" 
                :key="item.key"
                :class="['submenu-item', { active: activeSettingType === item.key }]"
                @click="setActiveSettingType(item.key)"
              >
                <el-icon><component :is="item.icon" /></el-icon>
                <span>{{ item.label }}</span>
              </div>
            </div>
          </div>

          <!-- 房屋管理分组 -->
          <div class="menu-group">
            <div 
              :class="['menu-group-title', { expanded: expandedGroups.includes('house_management') }]"
              @click="toggleGroup('house_management')"
            >
              <el-icon><cpu /></el-icon>
              <span>房屋管理</span>
              <el-icon class="expand-icon"><arrow-down /></el-icon>
            </div>
            <div v-show="expandedGroups.includes('house_management')" class="submenu">
              <div 
                v-for="item in houseManagementSettings" 
                :key="item.key"
                :class="['submenu-item', { active: activeSettingType === item.key }]"
                @click="setActiveSettingType(item.key)"
              >
                <el-icon><component :is="item.icon" /></el-icon>
                <span>{{ item.label }}</span>
              </div>
            </div>
          </div>

          <!-- 违规设置分组 -->
          <div class="menu-group">
            <div 
              :class="['menu-group-title', { expanded: expandedGroups.includes('violation_settings') }]"
              @click="toggleGroup('violation_settings')"
            >
              <el-icon><warning /></el-icon>
              <span>违规设置</span>
              <el-icon class="expand-icon"><arrow-down /></el-icon>
            </div>
            <div v-show="expandedGroups.includes('violation_settings')" class="submenu">
              <div 
                v-for="item in violationSettings" 
                :key="item.key"
                :class="['submenu-item', { active: activeSettingType === item.key }]"
                @click="setActiveSettingType(item.key)"
              >
                <el-icon><component :is="item.icon" /></el-icon>
                <span>{{ item.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 主要内容区域 -->
      <div class="settings-main-content">
        <div class="settings-page">
          <!-- 预约人员设置 -->
          <div v-if="activeSettingType === 'booking_personnel'" class="setting-section">
            <div class="section-header">
              <h2>预约人员权限列表</h2>
              <div class="header-actions">
                <el-button type="primary" @click="addPersonnelPermission">
                  <el-icon><plus /></el-icon>
                  新增
                </el-button>
                <el-button type="success" @click="exportPersonnelList">
                  <el-icon><upload /></el-icon>
                  导出
                </el-button>
              </div>
            </div>
            
            <div class="personnel-list">
              <el-table :data="personnelPermissionData" style="width: 100%" border>
                <el-table-column prop="subject" label="主题" min-width="200" />
                <el-table-column prop="authorizedPersonnel" label="权限人员" min-width="300">
                  <template #default="{ row }">
                    <div class="personnel-list-text">
                      {{ row.authorizedPersonnel }}
                      <el-button type="primary" link @click="viewPersonnelDetails(row)">查看详情</el-button>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="bookableRooms" label="预约教室" min-width="400">
                  <template #default="{ row }">
                    <div class="rooms-list-text">
                      {{ row.bookableRooms }}
                      <el-button type="primary" link @click="viewRoomDetails(row)">查看详情</el-button>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="creator" label="创建人" width="120" />
                <el-table-column prop="createTime" label="创建时间" width="160" />
                <el-table-column label="操作" width="150" fixed="right">
                  <template #default="{ row }">
                    <el-button type="primary" size="small" @click="editPersonnelPermission(row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="deletePersonnelPermission(row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>

          <!-- 预约时间设置 -->
          <div v-else-if="activeSettingType === 'booking_time_settings'" class="setting-section">
            <div class="section-header">
              <h2>预约时间设置</h2>
            </div>
            
            <!-- 选项卡切换 -->
            <div class="time-settings-tabs">
              <div 
                :class="['tab-item', { active: activeTimeTab === 'continuous' }]"
                @click="activeTimeTab = 'continuous'"
              >
                教室连续预约设置
              </div>
              <div 
                :class="['tab-item', { active: activeTimeTab === 'advance' }]"
                @click="activeTimeTab = 'advance'"
              >
                人员提前预约时间设置
              </div>
            </div>

            <!-- 教室连续预约设置 -->
            <div v-if="activeTimeTab === 'continuous'" class="continuous-booking-settings">
              <div class="settings-layout-horizontal">
                <!-- 左侧楼层筛选 -->
                <div class="floor-filter-sidebar">
                  <div class="search-box">
                    <el-input
                      v-model="floorSearchKeyword"
                      placeholder="输入关键字全称"
                      clearable
                      size="small"
                    >
                      <template #suffix>
                        <el-icon><search /></el-icon>
                      </template>
                    </el-input>
                  </div>
                  <div class="floor-list">
                    <div 
                      v-for="floor in floorOptions" 
                      :key="floor"
                      :class="['floor-item', { active: selectedFloor === floor }]"
                      @click="selectedFloor = floor"
                    >
                      {{ floor }}
                    </div>
                  </div>
                </div>

                <!-- 右侧主内容 -->
                <div class="main-content-area">
                  <!-- 提示信息 -->
                  <div class="tips-section">
                    <p class="tips-text">
                      <span class="tips-label">PS：</span>
                      <span class="tips-content">表示当前预约时，房屋连续选择天数的极限值；</span>
                    </p>
                    <p class="example-text">
                      例如：设置可连续预约（16）天，可选择时间为：3月1日-3月16日，第17日是不可选择；重新预约的可选：3月17日-4月11日，4月12日不可选；
                    </p>
                  </div>

                  <!-- 操作按钮 -->
                  <div class="action-buttons">
                    <el-button type="primary" @click="batchSetContinuousDays">批量设置</el-button>
                    <el-button type="success" @click="exportContinuousSettings">导出</el-button>
                  </div>

                  <!-- 教室列表表格 -->
                  <div class="classroom-table">
                    <el-table :data="filteredClassrooms" style="width: 100%" border>
                      <el-table-column type="selection" width="55" />
                      <el-table-column prop="roomName" label="预约教室" width="200" />
                      <el-table-column prop="roomNumber" label="房间号" width="120" />
                      <el-table-column prop="building" label="所属楼" width="120" />
                      <el-table-column prop="continuousDays" label="可连续预约天数" width="180">
                        <template #default="{ row }">
                          <span v-if="row.continuousDays === -1" class="unlimited-text">不可连续预约</span>
                          <span v-else-if="row.continuousDays === 0" class="monthly-text">一月</span>
                          <span v-else-if="row.continuousDays === -2" class="yearly-text">一年</span>
                          <span v-else-if="row.continuousDays === -3" class="no-limit-text">无限制预约</span>
                          <span v-else>{{ row.continuousDays }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="操作" width="120" fixed="right">
                        <template #default="{ row }">
                          <el-button type="primary" size="small" @click="editContinuousDays(row)">编辑</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>

                  <!-- 分页 -->
                  <div class="pagination-section">
                    <el-pagination
                      v-model:current-page="currentPage"
                      v-model:page-size="pageSize"
                      :page-sizes="[10, 20, 50, 100]"
                      :total="totalClassrooms"
                      layout="total, sizes, prev, pager, next, jumper"
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- 人员提前预约时间设置 -->
            <div v-else class="advance-booking-settings">
              <p>人员提前预约时间设置内容（待您提供截图后补充）</p>
            </div>
          </div>

          <!-- 房屋方案设置 -->
          <div v-else-if="activeSettingType === 'house_solutions'" class="setting-section">
            <div class="section-header">
              <h2>房屋方案管理</h2>
              <p>管理房屋配置方案和模板</p>
            </div>
            
            <div class="scheme-management">
              <div class="scheme-actions">
                <el-button type="primary" @click="addScheme">
                  <el-icon><plus /></el-icon>
                  新建方案
                </el-button>
                <el-button type="success" @click="importScheme">
                  <el-icon><upload /></el-icon>
                  导入方案
                </el-button>
              </div>
              
              <el-table :data="schemeData" style="width: 100%" border class="scheme-table">
                <el-table-column prop="name" label="方案名称" width="200" />
                <el-table-column prop="type" label="方案类型" width="120" />
                <el-table-column prop="roomCount" label="房间数量" width="100" />
                <el-table-column prop="createTime" label="创建时间" width="180" />
                <el-table-column prop="status" label="状态" width="100">
                  <template #default="{ row }">
                    <el-tag :type="row.status === '启用' ? 'success' : 'info'">{{ row.status }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作" min-width="200">
                  <template #default="{ row }">
                    <el-button type="primary" size="small" @click="editScheme(row)">编辑</el-button>
                    <el-button type="success" size="small" @click="copyScheme(row)">复制</el-button>
                    <el-button type="warning" size="small" @click="exportScheme(row)">导出</el-button>
                    <el-button type="danger" size="small" @click="deleteScheme(row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>

          <!-- 回收站 -->
          <div v-else-if="activeSettingType === 'recycle_bin'" class="setting-section">
            <div class="section-header">
              <h2>回收站管理</h2>
              <p>管理已删除的数据，支持恢复和彻底删除</p>
            </div>
            
            <div class="recycle-management">
              <div class="recycle-actions">
                <el-button type="danger" @click="clearAll">
                  <el-icon><delete /></el-icon>
                  清空回收站
                </el-button>
                <el-button type="success" @click="batchRestore">
                  <el-icon><refresh /></el-icon>
                  批量恢复
                </el-button>
              </div>
              
              <el-table :data="recycleData" style="width: 100%" border class="recycle-table">
                <el-table-column type="selection" width="55" />
                <el-table-column prop="name" label="名称" width="200" />
                <el-table-column prop="type" label="类型" width="120" />
                <el-table-column prop="deleteTime" label="删除时间" width="180" />
                <el-table-column prop="deleteBy" label="删除人" width="120" />
                <el-table-column label="操作" min-width="150">
                  <template #default="{ row }">
                    <el-button type="success" size="small" @click="restoreItem(row)">恢复</el-button>
                    <el-button type="danger" size="small" @click="permanentDelete(row)">彻底删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>

          <!-- 违规配置设置 -->
          <div v-else-if="activeSettingType === 'violation_config'" class="setting-section">
            <div class="section-header">
              <h2>违规配置设置</h2>
              <p>配置违规行为的判定规则和处理方式</p>
            </div>
            
            <el-form :model="violationForm" label-width="150px" class="setting-form">
              <el-form-item label="启用违规检测">
                <el-switch v-model="violationForm.enabled" />
                <span class="form-tip">开启违规行为自动检测功能</span>
              </el-form-item>
              <el-form-item label="迟到容忍时间">
                <el-input-number 
                  v-model="violationForm.lateToleranceMinutes" 
                  :min="0" 
                  :max="30"
                  suffix="分钟"
                />
                <span class="form-tip">超过此时间视为迟到违规</span>
              </el-form-item>
              <el-form-item label="早退容忍时间">
                <el-input-number 
                  v-model="violationForm.earlyLeaveToleranceMinutes" 
                  :min="0" 
                  :max="30"
                  suffix="分钟"
                />
              </el-form-item>
              <el-form-item label="无故缺席处理">
                <el-select v-model="violationForm.absenteeismAction">
                  <el-option label="警告" value="warning" />
                  <el-option label="扣分" value="deduct_points" />
                  <el-option label="暂停预约权限" value="suspend" />
                </el-select>
              </el-form-item>
              <el-form-item label="违规积分阈值">
                <el-input-number 
                  v-model="violationForm.violationPointsThreshold" 
                  :min="3" 
                  :max="20"
                />
                <span class="form-tip">达到此积分将被加入黑名单</span>
              </el-form-item>
              <el-form-item label="自动通知相关人员">
                <el-switch v-model="violationForm.autoNotify" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveViolationConfig">保存设置</el-button>
                <el-button @click="resetViolationConfig">重置</el-button>
              </el-form-item>
            </el-form>
          </div>

          <!-- 黑名单管理 -->
          <div v-else-if="activeSettingType === 'blacklist'" class="setting-section">
            <div class="section-header">
              <h2>黑名单管理</h2>
              <p>管理违规用户黑名单，限制其预约权限</p>
            </div>
            
            <div class="blacklist-management">
              <div class="blacklist-actions">
                <el-button type="primary" @click="addToBlacklist">
                  <el-icon><plus /></el-icon>
                  添加黑名单
                </el-button>
                <el-button type="success" @click="batchRemoveFromBlacklist">
                  <el-icon><refresh /></el-icon>
                  批量移除
                </el-button>
              </div>
              
              <el-table :data="blacklistData" style="width: 100%" border class="blacklist-table">
                <el-table-column type="selection" width="55" />
                <el-table-column prop="username" label="用户姓名" width="120" />
                <el-table-column prop="userType" label="用户类型" width="100" />
                <el-table-column prop="violationReason" label="违规原因" min-width="200" />
                <el-table-column prop="violationCount" label="违规次数" width="100" />
                <el-table-column prop="addTime" label="加入时间" width="180" />
                <el-table-column prop="expireTime" label="解除时间" width="180" />
                <el-table-column label="操作" width="150">
                  <template #default="{ row }">
                    <el-button type="success" size="small" @click="removeFromBlacklist(row)">解除</el-button>
                    <el-button type="primary" size="small" @click="editBlacklistItem(row)">编辑</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>

          <!-- 默认占位符 -->
          <div v-else class="setting-section">
            <div class="content-placeholder">
              <el-icon size="64" color="#ccc"><setting /></el-icon>
              <h3>请从左侧菜单选择要配置的功能模块</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Setting, 
  ArrowDown, 
  Key, 
  Cpu, 
  User, 
  Clock,
  Document,
  Delete,
  Plus,
  Upload,
  Refresh,
  Bell,
  Warning
} from '@element-plus/icons-vue'

export default {
  name: 'SettingsManagement',
  components: {
    Setting,
    ArrowDown,
    Key,
    Cpu,
    User,
    Clock,
    Document,
    Delete,
    Plus,
    Upload,
    Refresh,
    Bell,
    Warning
  },
  props: {
    settingsData: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['save-settings'],
  setup(props, { emit }) {
    const activeSettingType = ref('booking_personnel')
    const expandedGroups = ref(['house_permission'])

    // 设置菜单定义 - 根据截图修正
    const housePermissionSettings = [
      { key: 'booking_personnel', label: '预约人员', icon: 'User' },
      { key: 'booking_time_settings', label: '预约时间设置', icon: 'Clock' }
    ]

    const houseManagementSettings = [
      { key: 'house_solutions', label: '房屋方案', icon: 'Document' },
      { key: 'recycle_bin', label: '回收站', icon: 'Delete' }
    ]

    const violationSettings = [
      { key: 'violation_config', label: '违规配置', icon: 'Warning' },
      { key: 'blacklist', label: '黑名单', icon: 'User' }
    ]

    // 表单数据
    const personnelPermissionData = ref([
      {
        id: 1,
        subject: '物理实验室一层、二层、三层可预约人员',
        authorizedPersonnel: '杨艳；郭辉；邓伯雪；赵芳；潘欣妍；张圣；吴俊怡；刘敏；孙楠；蓝阳；王丽；陈洁；周涛；赵诗雅；徐莉；王芋针；李强；宋黄；宋敬；张恩睡；雷明轩；郑子豪...',
        bookableRooms: '多媒体教室（101）；多媒体教室（102）；多媒体教室（103）；多媒体教室（104）；多媒体教室（105）；多媒体教室（106）；多媒体教室（107）；多媒体教室（108）；多媒体教室（109）；多媒体教室（110）......',
        creator: '张三',
        createTime: '2024.03.08 09:16:26'
      },
      {
        id: 2,
        subject: '物理实验室四层可预约人员',
        authorizedPersonnel: '杨艳；郭辉；邓伯雪；赵芳；潘欣妍；',
        bookableRooms: '清洁间',
        creator: '张三',
        createTime: '2024.03.08 09:16:26'
      }
    ])

    const activeTimeTab = ref('continuous')
    const selectedFloor = ref('全部')
    const floorSearchKeyword = ref('')
    const currentPage = ref(1)
    const pageSize = ref(10)
    const totalClassrooms = ref(2010)

    const floorOptions = ['全部', '达才楼', 'B2', 'B1', '1F', '2F', '3F', '4F', '5F', '6F', '成凳楼', '富行楼', '博雅楼']

    const classroomsData = ref([
      {
        id: 1,
        roomName: '多媒体教室（101）',
        roomNumber: '101',
        building: '科研楼',
        continuousDays: 16
      },
      {
        id: 2,
        roomName: '多媒体教室（102）',
        roomNumber: '102',
        building: '科研楼',
        continuousDays: 16
      },
      {
        id: 3,
        roomName: '多媒体教室（103）',
        roomNumber: '103',
        building: '科研楼',
        continuousDays: 16
      },
      {
        id: 4,
        roomName: '多媒体教室（104）',
        roomNumber: '104',
        building: '科研楼',
        continuousDays: 16
      },
      {
        id: 5,
        roomName: '多媒体教室（105）',
        roomNumber: '105',
        building: '科研楼',
        continuousDays: -1
      },
      {
        id: 6,
        roomName: '多媒体教室（106）',
        roomNumber: '106',
        building: '科研楼',
        continuousDays: 0
      },
      {
        id: 7,
        roomName: '多媒体教室（107）',
        roomNumber: '107',
        building: '科研楼',
        continuousDays: -2
      },
      {
        id: 8,
        roomName: '多媒体教室（108）',
        roomNumber: '108',
        building: '科研楼',
        continuousDays: 45
      },
      {
        id: 9,
        roomName: '多媒体教室（109）',
        roomNumber: '109',
        building: '科研楼',
        continuousDays: 16
      },
      {
        id: 10,
        roomName: '多媒体教室（110）',
        roomNumber: '110',
        building: '科研楼',
        continuousDays: -3
      }
    ])

    // 计算属性
    const filteredClassrooms = computed(() => {
      let data = classroomsData.value
      
      // 根据楼层筛选
      if (selectedFloor.value !== '全部') {
        data = data.filter(item => item.building === selectedFloor.value)
      }
      
      // 根据搜索关键词筛选
      if (floorSearchKeyword.value) {
        data = data.filter(item =>
          item.roomName.includes(floorSearchKeyword.value) ||
          item.roomNumber.includes(floorSearchKeyword.value) ||
          item.building.includes(floorSearchKeyword.value)
        )
      }
      
      return data
    })

    const schemeData = ref([
      {
        id: 1,
        name: '标准教学楼方案',
        type: '教学',
        roomCount: 50,
        createTime: '2024-01-15 10:30:00',
        status: '启用'
      },
      {
        id: 2,
        name: '办公楼配置方案',
        type: '办公',
        roomCount: 30,
        createTime: '2024-02-10 14:20:00',
        status: '停用'
      }
    ])

    const recycleData = ref([
      {
        id: 1,
        name: '多媒体教室301',
        type: '房间',
        deleteTime: '2024-03-10 16:30:00',
        deleteBy: '管理员'
      },
      {
        id: 2,
        name: '学生活动方案',
        type: '方案',
        deleteTime: '2024-03-08 09:15:00',
        deleteBy: '张老师'
      }
    ])

    const violationForm = reactive({
      enabled: true,
      lateToleranceMinutes: 15,
      earlyLeaveToleranceMinutes: 10,
      absenteeismAction: 'warning',
      violationPointsThreshold: 10,
      autoNotify: true
    })

    const blacklistData = ref([
      {
        id: 1,
        username: '张某某',
        userType: '学生',
        violationReason: '连续3次无故缺席预约',
        violationCount: 3,
        addTime: '2024-03-01 10:30:00',
        expireTime: '2024-04-01 10:30:00'
      },
      {
        id: 2,
        username: '李某某',
        userType: '教师',
        violationReason: '恶意占用教室资源',
        violationCount: 2,
        addTime: '2024-03-05 14:20:00',
        expireTime: '2024-03-20 14:20:00'
      }
    ])

    // 方法
    const toggleGroup = (group) => {
      const index = expandedGroups.value.indexOf(group)
      if (index > -1) {
        expandedGroups.value.splice(index, 1)
      } else {
        expandedGroups.value.push(group)
      }
    }

    const setActiveSettingType = (type) => {
      activeSettingType.value = type
    }

    const addPersonnelPermission = () => {
      ElMessage.info('新增预约人员权限功能开发中...')
    }

    const exportPersonnelList = () => {
      ElMessage.success('正在导出预约人员列表...')
    }

    const viewPersonnelDetails = (row) => {
      ElMessage.info(`查看人员详情: ${row.subject}`)
    }

    const viewRoomDetails = (row) => {
      ElMessage.info(`查看房间详情: ${row.subject}`)
    }

    const editPersonnelPermission = (row) => {
      ElMessage.info(`编辑权限设置: ${row.subject}`)
    }

    const deletePersonnelPermission = async (row) => {
      try {
        await ElMessageBox.confirm(`确认删除"${row.subject}"的权限设置吗？`, '删除确认')
        ElMessage.success('权限设置已删除')
      } catch {
        // 用户取消
      }
    }

    const batchSetContinuousDays = () => {
      ElMessage.info('批量设置功能开发中...')
    }

    const exportContinuousSettings = () => {
      ElMessage.success('正在导出教室设置...')
    }

    const editContinuousDays = (row) => {
      ElMessage.info(`编辑教室: ${row.roomName}`)
    }

    const handleSizeChange = (val) => {
      pageSize.value = val
      currentPage.value = 1
    }

    const handleCurrentChange = (val) => {
      currentPage.value = val
    }

    const addScheme = () => {
      ElMessage.info('新建方案功能开发中...')
    }

    const importScheme = () => {
      ElMessage.info('导入方案功能开发中...')
    }

    const editScheme = (row) => {
      ElMessage.info(`编辑方案: ${row.name}`)
    }

    const copyScheme = (row) => {
      ElMessage.success(`已复制方案: ${row.name}`)
    }

    const exportScheme = (row) => {
      ElMessage.success(`正在导出方案: ${row.name}`)
    }

    const deleteScheme = async (row) => {
      try {
        await ElMessageBox.confirm(`确认删除方案"${row.name}"吗？`, '删除确认')
        ElMessage.success('方案已删除')
      } catch {
        // 用户取消
      }
    }

    const clearAll = async () => {
      try {
        await ElMessageBox.confirm('确认清空回收站吗？此操作不可恢复！', '清空确认')
        ElMessage.success('回收站已清空')
      } catch {
        // 用户取消
      }
    }

    const batchRestore = () => {
      ElMessage.success('批量恢复完成')
    }

    const restoreItem = (row) => {
      ElMessage.success(`已恢复: ${row.name}`)
    }

    const permanentDelete = async (row) => {
      try {
        await ElMessageBox.confirm(`确认彻底删除"${row.name}"吗？此操作不可恢复！`, '删除确认')
        ElMessage.success('已彻底删除')
      } catch {
        // 用户取消
      }
    }

    const saveViolationConfig = () => {
      emit('save-settings', { type: 'violation_config', data: violationForm })
      ElMessage.success('违规配置设置保存成功')
    }

    const resetViolationConfig = () => {
      Object.assign(violationForm, {
        enabled: true,
        lateToleranceMinutes: 15,
        earlyLeaveToleranceMinutes: 10,
        absenteeismAction: 'warning',
        violationPointsThreshold: 10,
        autoNotify: true
      })
      ElMessage.info('违规配置设置已重置')
    }

    const addToBlacklist = () => {
      ElMessage.info('添加黑名单功能开发中...')
    }

    const batchRemoveFromBlacklist = () => {
      ElMessage.success('批量移除完成')
    }

    const removeFromBlacklist = (row) => {
      ElMessage.success(`已将 ${row.username} 移出黑名单`)
    }

    const editBlacklistItem = (row) => {
      ElMessage.info(`编辑黑名单项: ${row.username}`)
    }

    return {
      activeSettingType,
      expandedGroups,
      housePermissionSettings,
      houseManagementSettings,
      violationSettings,
      personnelPermissionData,
      activeTimeTab,
      selectedFloor,
      floorSearchKeyword,
      currentPage,
      pageSize,
      totalClassrooms,
      floorOptions,
      classroomsData,
      filteredClassrooms,
      schemeData,
      recycleData,
      violationForm,
      blacklistData,
      toggleGroup,
      setActiveSettingType,
      addPersonnelPermission,
      exportPersonnelList,
      viewPersonnelDetails,
      viewRoomDetails,
      editPersonnelPermission,
      deletePersonnelPermission,
      batchSetContinuousDays,
      exportContinuousSettings,
      editContinuousDays,
      handleSizeChange,
      handleCurrentChange,
      addScheme,
      importScheme,
      editScheme,
      copyScheme,
      exportScheme,
      deleteScheme,
      clearAll,
      batchRestore,
      restoreItem,
      permanentDelete,
      saveViolationConfig,
      resetViolationConfig,
      addToBlacklist,
      batchRemoveFromBlacklist,
      removeFromBlacklist,
      editBlacklistItem
    }
  }
}
</script>

<style scoped>
.settings-management {
  min-height: calc(100vh - 120px);
  background: #f9f9f9;
}

.settings-layout {
  display: flex;
  height: calc(100vh - 120px);
}

/* 设置左侧导航 */
.settings-sidebar {
  width: 200px;
  background: white;
  border-right: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
}

.settings-sidebar .sidebar-header {
  padding: 15px 18px;
  border-bottom: 1px solid #e8e8e8;
  background: #4A90E2;
  color: white;
}

.settings-sidebar .sidebar-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.settings-sidebar .sidebar-menu {
  flex: 1;
  overflow-y: auto;
}

/* 设置菜单组样式 */
.settings-sidebar .menu-group {
  border-bottom: 1px solid #f0f0f0;
}

.settings-sidebar .menu-group-title {
  padding: 12px 18px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  color: #333;
  background: #fafafa;
  transition: all 0.3s;
  border-left: 3px solid transparent;
}

.settings-sidebar .menu-group-title:hover {
  background: #f0f7ff;
  color: #4A90E2;
}

.settings-sidebar .menu-group-title.expanded {
  background: #e6f3ff;
  color: #4A90E2;
  border-left-color: #4A90E2;
}

.settings-sidebar .menu-group-title .expand-icon {
  margin-left: auto;
  transition: transform 0.3s;
  font-size: 14px;
}

.settings-sidebar .menu-group-title.expanded .expand-icon {
  transform: rotate(180deg);
}

/* 设置子菜单样式 */
.settings-sidebar .submenu {
  background: white;
}

.settings-sidebar .submenu-item {
  padding: 10px 18px 10px 35px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #666;
  font-size: 13px;
  transition: all 0.3s;
  border-left: 3px solid transparent;
}

.settings-sidebar .submenu-item:hover {
  background: #f5f5f5;
  color: #333;
}

.settings-sidebar .submenu-item.active {
  background: #e6f3ff;
  color: #4A90E2;
  border-left-color: #4A90E2;
  font-weight: 500;
}

.settings-sidebar .submenu-item .el-icon {
  font-size: 13px;
}

/* 主要内容区域 */
.settings-main-content {
  flex: 1;
  background: #f9f9f9;
  overflow-y: auto;
}

.settings-page {
  padding: 20px;
  min-height: 100%;
}

.setting-section {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-header h2 {
  margin: 0;
  font-size: 20px;
  color: #333;
  font-weight: 600;
}

.section-header p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.setting-form {
  max-width: 600px;
}

.personnel-list-text,
.rooms-list-text {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.personnel-list-text span,
.rooms-list-text span {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.form-tip {
  margin-left: 10px;
  color: #999;
  font-size: 12px;
}
.time-settings-tabs {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #e8e8e8;
}

.tab-item {
  padding: 12px 24px;
  cursor: pointer;
  background: white;
  border: 1px solid #e8e8e8;
  border-bottom: none;
  color: #666;
  font-size: 14px;
  transition: all 0.3s;
}

.tab-item:first-child {
  border-top-left-radius: 8px;
}

.tab-item:last-child {
  border-top-right-radius: 8px;
}

.tab-item.active {
  background: #4A90E2;
  color: white;
  border-color: #4A90E2;
}

/* 教室连续预约设置布局 */
.settings-layout-horizontal {
  display: flex;
  gap: 20px;
  min-height: 600px;
}

.floor-filter-sidebar {
  width: 200px;
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 16px;
  height: fit-content;
}

.floor-filter-sidebar .search-box {
  margin-bottom: 16px;
}

.floor-filter-sidebar .floor-list {
  max-height: 400px;
  overflow-y: auto;
}

.floor-filter-sidebar .floor-item {
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
  color: #666;
  font-size: 14px;
  margin-bottom: 4px;
}

.floor-filter-sidebar .floor-item:hover {
  background: #f5f5f5;
  color: #333;
}

.floor-filter-sidebar .floor-item.active {
  background: #4A90E2;
  color: white;
}

.main-content-area {
  flex: 1;
}

/* 提示信息 */
.tips-section {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  border-left: 4px solid #4A90E2;
}

.tips-text {
  margin: 0 0 8px 0;
  font-size: 14px;
}

.tips-label {
  color: #e74c3c;
  font-weight: 600;
}

.tips-content {
  color: #333;
}

.example-text {
  margin: 0;
  color: #e74c3c;
  font-size: 13px;
  line-height: 1.5;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-bottom: 16px;
}

/* 教室表格 */
.classroom-table {
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.unlimited-text {
  color: #e74c3c;
}

.monthly-text {
  color: #f39c12;
}

.yearly-text {
  color: #27ae60;
}

.no-limit-text {
  color: #27ae60;
}

/* 分页 */
.pagination-section {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

.blacklist-management,
.scheme-management,
.recycle-management {
  margin-top: 20px;
}

.blacklist-actions,
.scheme-actions,
.recycle-actions {
  margin-bottom: 16px;
  text-align: left;
}

.blacklist-table,
.scheme-table,
.recycle-table {
  margin-top: 16px;
}

.content-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: #999;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .settings-layout {
    flex-direction: column;
  }
  
  .settings-sidebar {
    width: 100%;
    height: auto;
  }
  
  .setting-form {
    max-width: 100%;
  }
}
</style>