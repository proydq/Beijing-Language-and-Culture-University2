<template>
  <div class="settings-management">
    <div class="settings-layout">
      <!-- 左侧设置菜单 -->
      <div class="settings-sidebar">
        <div class="sidebar-header">
          <h3>系统设置</h3>
        </div>
        <div class="sidebar-menu">
          <!-- 基础设置分组 -->
          <div class="menu-group">
            <div 
              :class="['menu-group-title', { expanded: expandedGroups.includes('basic') }]"
              @click="toggleGroup('basic')"
            >
              <el-icon><setting /></el-icon>
              <span>基础设置</span>
              <el-icon class="expand-icon"><arrow-down /></el-icon>
            </div>
            <div v-show="expandedGroups.includes('basic')" class="submenu">
              <div 
                v-for="item in basicSettings" 
                :key="item.key"
                :class="['submenu-item', { active: activeSettingType === item.key }]"
                @click="setActiveSettingType(item.key)"
              >
                <el-icon><component :is="item.icon" /></el-icon>
                <span>{{ item.label }}</span>
              </div>
            </div>
          </div>

          <!-- 权限设置分组 -->
          <div class="menu-group">
            <div 
              :class="['menu-group-title', { expanded: expandedGroups.includes('permission') }]"
              @click="toggleGroup('permission')"
            >
              <el-icon><key /></el-icon>
              <span>权限设置</span>
              <el-icon class="expand-icon"><arrow-down /></el-icon>
            </div>
            <div v-show="expandedGroups.includes('permission')" class="submenu">
              <div 
                v-for="item in permissionSettings" 
                :key="item.key"
                :class="['submenu-item', { active: activeSettingType === item.key }]"
                @click="setActiveSettingType(item.key)"
              >
                <el-icon><component :is="item.icon" /></el-icon>
                <span>{{ item.label }}</span>
              </div>
            </div>
          </div>

          <!-- 系统维护分组 -->
          <div class="menu-group">
            <div 
              :class="['menu-group-title', { expanded: expandedGroups.includes('maintenance') }]"
              @click="toggleGroup('maintenance')"
            >
              <el-icon><cpu /></el-icon>
              <span>系统维护</span>
              <el-icon class="expand-icon"><arrow-down /></el-icon>
            </div>
            <div v-show="expandedGroups.includes('maintenance')" class="submenu">
              <div 
                v-for="item in maintenanceSettings" 
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
          <!-- 系统信息设置 -->
          <div v-if="activeSettingType === 'system_info'" class="setting-section">
            <div class="section-header">
              <h2>系统信息设置</h2>
              <p>配置系统基本信息和显示参数</p>
            </div>
            
            <el-form :model="systemInfoForm" label-width="120px" class="setting-form">
              <el-form-item label="系统名称">
                <el-input v-model="systemInfoForm.systemName" placeholder="请输入系统名称" />
              </el-form-item>
              <el-form-item label="系统版本">
                <el-input v-model="systemInfoForm.version" placeholder="请输入系统版本" />
              </el-form-item>
              <el-form-item label="管理员邮箱">
                <el-input v-model="systemInfoForm.adminEmail" placeholder="请输入管理员邮箱" />
              </el-form-item>
              <el-form-item label="系统描述">
                <el-input 
                  v-model="systemInfoForm.description" 
                  type="textarea" 
                  :rows="3"
                  placeholder="请输入系统描述"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveSystemInfo">保存设置</el-button>
                <el-button @click="resetSystemInfo">重置</el-button>
              </el-form-item>
            </el-form>
          </div>

          <!-- 预约规则设置 -->
          <div v-else-if="activeSettingType === 'booking_rules'" class="setting-section">
            <div class="section-header">
              <h2>预约规则设置</h2>
              <p>配置房间预约的规则和限制</p>
            </div>
            
            <el-form :model="bookingRulesForm" label-width="120px" class="setting-form">
              <el-form-item label="提前预约天数">
                <el-input-number 
                  v-model="bookingRulesForm.advanceDays" 
                  :min="1" 
                  :max="30"
                />
                <span class="form-tip">用户最多可以提前多少天进行预约</span>
              </el-form-item>
              <el-form-item label="最长预约时长">
                <el-input-number 
                  v-model="bookingRulesForm.maxDuration" 
                  :min="1" 
                  :max="24"
                />
                <span class="form-tip">单次预约最长时长（小时）</span>
              </el-form-item>
              <el-form-item label="允许重复预约">
                <el-switch v-model="bookingRulesForm.allowRepeat" />
                <span class="form-tip">是否允许用户重复预约同一房间</span>
              </el-form-item>
              <el-form-item label="需要审批">
                <el-switch v-model="bookingRulesForm.requireApproval" />
                <span class="form-tip">预约是否需要管理员审批</span>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveBookingRules">保存设置</el-button>
                <el-button @click="resetBookingRules">重置</el-button>
              </el-form-item>
            </el-form>
          </div>

          <!-- 通知设置 -->
          <div v-else-if="activeSettingType === 'notifications'" class="setting-section">
            <div class="section-header">
              <h2>通知设置</h2>
              <p>配置系统通知和邮件发送规则</p>
            </div>
            
            <el-form :model="notificationForm" label-width="120px" class="setting-form">
              <el-form-item label="邮件通知">
                <el-switch v-model="notificationForm.emailEnabled" />
                <span class="form-tip">开启邮件通知功能</span>
              </el-form-item>
              <el-form-item label="短信通知">
                <el-switch v-model="notificationForm.smsEnabled" />
                <span class="form-tip">开启短信通知功能</span>
              </el-form-item>
              <el-form-item label="预约成功通知">
                <el-switch v-model="notificationForm.bookingSuccess" />
              </el-form-item>
              <el-form-item label="审批结果通知">
                <el-switch v-model="notificationForm.approvalResult" />
              </el-form-item>
              <el-form-item label="提醒时间">
                <el-select v-model="notificationForm.reminderTime">
                  <el-option label="提前1小时" value="1" />
                  <el-option label="提前2小时" value="2" />
                  <el-option label="提前4小时" value="4" />
                  <el-option label="提前1天" value="24" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveNotifications">保存设置</el-button>
                <el-button @click="resetNotifications">重置</el-button>
              </el-form-item>
            </el-form>
          </div>

          <!-- 用户权限设置 -->
          <div v-else-if="activeSettingType === 'user_permissions'" class="setting-section">
            <div class="section-header">
              <h2>用户权限设置</h2>
              <p>配置不同用户角色的权限</p>
            </div>
            
            <div class="permission-table">
              <el-table :data="permissionData" border>
                <el-table-column prop="role" label="用户角色" width="120" />
                <el-table-column prop="canBook" label="预约权限" width="100">
                  <template #default="scope">
                    <el-switch v-model="scope.row.canBook" />
                  </template>
                </el-table-column>
                <el-table-column prop="canApprove" label="审批权限" width="100">
                  <template #default="scope">
                    <el-switch v-model="scope.row.canApprove" />
                  </template>
                </el-table-column>
                <el-table-column prop="canManage" label="管理权限" width="100">
                  <template #default="scope">
                    <el-switch v-model="scope.row.canManage" />
                  </template>
                </el-table-column>
                <el-table-column prop="description" label="权限描述" />
              </el-table>
              <div class="table-actions">
                <el-button type="primary" @click="savePermissions">保存权限设置</el-button>
              </div>
            </div>
          </div>

          <!-- 数据备份设置 -->
          <div v-else-if="activeSettingType === 'data_backup'" class="setting-section">
            <div class="section-header">
              <h2>数据备份设置</h2>
              <p>配置系统数据备份策略</p>
            </div>
            
            <el-form :model="backupForm" label-width="120px" class="setting-form">
              <el-form-item label="自动备份">
                <el-switch v-model="backupForm.autoBackup" />
                <span class="form-tip">开启自动备份功能</span>
              </el-form-item>
              <el-form-item label="备份频率">
                <el-select v-model="backupForm.frequency">
                  <el-option label="每天" value="daily" />
                  <el-option label="每周" value="weekly" />
                  <el-option label="每月" value="monthly" />
                </el-select>
              </el-form-item>
              <el-form-item label="保留天数">
                <el-input-number 
                  v-model="backupForm.retentionDays" 
                  :min="7" 
                  :max="365"
                />
                <span class="form-tip">备份文件保留天数</span>
              </el-form-item>
              <el-form-item label="备份路径">
                <el-input v-model="backupForm.backupPath" placeholder="请输入备份文件存储路径" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveBackupSettings">保存设置</el-button>
                <el-button type="success" @click="performBackup">立即备份</el-button>
              </el-form-item>
            </el-form>
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
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  Setting, 
  ArrowDown, 
  Key, 
  Cpu, 
  User, 
  Connection, 
  Document,
  Bell,
  Shield,
  FolderOpened
} from '@element-plus/icons-vue'

export default {
  name: 'SettingsManagement',
  components: {
    Setting,
    ArrowDown,
    Key,
    Cpu,
    User,
    Connection,
    Document,
    Bell,
    Shield,
    FolderOpened
  },
  props: {
    settingsData: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['save-settings'],
  setup(props, { emit }) {
    const activeSettingType = ref('system_info')
    const expandedGroups = ref(['basic'])

    // 设置菜单定义
    const basicSettings = [
      { key: 'system_info', label: '系统信息', icon: 'Setting' },
      { key: 'booking_rules', label: '预约规则', icon: 'Document' },
      { key: 'notifications', label: '通知设置', icon: 'Bell' }
    ]

    const permissionSettings = [
      { key: 'user_permissions', label: '用户权限', icon: 'User' },
      { key: 'role_management', label: '角色管理', icon: 'Shield' }
    ]

    const maintenanceSettings = [
      { key: 'data_backup', label: '数据备份', icon: 'FolderOpened' },
      { key: 'system_monitor', label: '系统监控', icon: 'Connection' }
    ]

    // 表单数据
    const systemInfoForm = reactive({
      systemName: '房屋借用管理系统',
      version: 'v1.0.0',
      adminEmail: 'admin@example.com',
      description: '专业的房屋借用管理系统，提供便捷的预约和审批功能'
    })

    const bookingRulesForm = reactive({
      advanceDays: 7,
      maxDuration: 8,
      allowRepeat: true,
      requireApproval: true
    })

    const notificationForm = reactive({
      emailEnabled: true,
      smsEnabled: false,
      bookingSuccess: true,
      approvalResult: true,
      reminderTime: '2'
    })

    const backupForm = reactive({
      autoBackup: true,
      frequency: 'daily',
      retentionDays: 30,
      backupPath: '/data/backup/'
    })

    const permissionData = ref([
      {
        role: '管理员',
        canBook: true,
        canApprove: true,
        canManage: true,
        description: '拥有系统全部权限'
      },
      {
        role: '教师',
        canBook: true,
        canApprove: false,
        canManage: false,
        description: '可以预约房间，无审批权限'
      },
      {
        role: '学生',
        canBook: true,
        canApprove: false,
        canManage: false,
        description: '可以预约房间，需要审批'
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

    const saveSystemInfo = () => {
      emit('save-settings', { type: 'system_info', data: systemInfoForm })
      ElMessage.success('系统信息设置保存成功')
    }

    const resetSystemInfo = () => {
      Object.assign(systemInfoForm, {
        systemName: '房屋借用管理系统',
        version: 'v1.0.0',
        adminEmail: 'admin@example.com',
        description: '专业的房屋借用管理系统，提供便捷的预约和审批功能'
      })
      ElMessage.info('系统信息设置已重置')
    }

    const saveBookingRules = () => {
      emit('save-settings', { type: 'booking_rules', data: bookingRulesForm })
      ElMessage.success('预约规则设置保存成功')
    }

    const resetBookingRules = () => {
      Object.assign(bookingRulesForm, {
        advanceDays: 7,
        maxDuration: 8,
        allowRepeat: true,
        requireApproval: true
      })
      ElMessage.info('预约规则设置已重置')
    }

    const saveNotifications = () => {
      emit('save-settings', { type: 'notifications', data: notificationForm })
      ElMessage.success('通知设置保存成功')
    }

    const resetNotifications = () => {
      Object.assign(notificationForm, {
        emailEnabled: true,
        smsEnabled: false,
        bookingSuccess: true,
        approvalResult: true,
        reminderTime: '2'
      })
      ElMessage.info('通知设置已重置')
    }

    const savePermissions = () => {
      emit('save-settings', { type: 'user_permissions', data: permissionData.value })
      ElMessage.success('用户权限设置保存成功')
    }

    const saveBackupSettings = () => {
      emit('save-settings', { type: 'data_backup', data: backupForm })
      ElMessage.success('数据备份设置保存成功')
    }

    const performBackup = () => {
      ElMessage.success('数据备份已开始，请稍等...')
      // 这里应该调用实际的备份API
      setTimeout(() => {
        ElMessage.success('数据备份完成')
      }, 2000)
    }

    return {
      activeSettingType,
      expandedGroups,
      basicSettings,
      permissionSettings,
      maintenanceSettings,
      systemInfoForm,
      bookingRulesForm,
      notificationForm,
      backupForm,
      permissionData,
      toggleGroup,
      setActiveSettingType,
      saveSystemInfo,
      resetSystemInfo,
      saveBookingRules,
      resetBookingRules,
      saveNotifications,
      resetNotifications,
      savePermissions,
      saveBackupSettings,
      performBackup
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
}

.section-header h2 {
  margin: 0 0 8px 0;
  font-size: 20px;
  color: #333;
  font-weight: 600;
}

.section-header p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.setting-form {
  max-width: 600px;
}

.form-tip {
  margin-left: 10px;
  color: #999;
  font-size: 12px;
}

.permission-table {
  margin-top: 20px;
}

.table-actions {
  margin-top: 16px;
  text-align: right;
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