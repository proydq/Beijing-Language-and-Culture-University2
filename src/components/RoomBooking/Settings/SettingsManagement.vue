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
              <h2>预约人员权限设置</h2>
              <p>配置不同人员的预约权限和限制</p>
            </div>
            
            <div class="personnel-table">
              <el-table :data="personnelData" style="width: 100%" border>
                <el-table-column prop="userType" label="用户类型" width="120" />
                <el-table-column prop="canBook" label="可预约" width="100">
                  <template #default="{ row, $index }">
                    <el-switch v-model="row.canBook" @change="updatePersonnelPermission($index)" />
                  </template>
                </el-table-column>
                <el-table-column prop="maxAdvanceDays" label="最大提前天数" width="150">
                  <template #default="{ row, $index }">
                    <el-input-number 
                      v-model="row.maxAdvanceDays" 
                      :min="1" 
                      :max="30"
                      size="small"
                      @change="updatePersonnelPermission($index)"
                    />
                  </template>
                </el-table-column>
                <el-table-column prop="maxDuration" label="最大预约时长(小时)" width="180">
                  <template #default="{ row, $index }">
                    <el-input-number 
                      v-model="row.maxDuration" 
                      :min="1" 
                      :max="24"
                      size="small"
                      @change="updatePersonnelPermission($index)"
                    />
                  </template>
                </el-table-column>
                <el-table-column prop="requireApproval" label="需要审批" width="100">
                  <template #default="{ row, $index }">
                    <el-switch v-model="row.requireApproval" @change="updatePersonnelPermission($index)" />
                  </template>
                </el-table-column>
                <el-table-column prop="description" label="备注" min-width="200" />
              </el-table>
              <div class="table-actions">
                <el-button type="primary" @click="savePersonnelSettings">保存设置</el-button>
                <el-button @click="resetPersonnelSettings">重置</el-button>
              </div>
            </div>
          </div>

          <!-- 预约时间设置 -->
          <div v-else-if="activeSettingType === 'booking_time_settings'" class="setting-section">
            <div class="section-header">
              <h2>预约时间设置</h2>
              <p>配置预约时间段和时间限制规则</p>
            </div>
            
            <el-form :model="timeSettingsForm" label-width="150px" class="setting-form">
              <el-form-item label="工作日开始时间">
                <el-time-picker
                  v-model="timeSettingsForm.workdayStart"
                  format="HH:mm"
                  placeholder="选择开始时间"
                />
              </el-form-item>
              <el-form-item label="工作日结束时间">
                <el-time-picker
                  v-model="timeSettingsForm.workdayEnd"
                  format="HH:mm"
                  placeholder="选择结束时间"
                />
              </el-form-item>
              <el-form-item label="周末开始时间">
                <el-time-picker
                  v-model="timeSettingsForm.weekendStart"
                  format="HH:mm"
                  placeholder="选择开始时间"
                />
              </el-form-item>
              <el-form-item label="周末结束时间">
                <el-time-picker
                  v-model="timeSettingsForm.weekendEnd"
                  format="HH:mm"
                  placeholder="选择结束时间"
                />
              </el-form-item>
              <el-form-item label="最小预约时长">
                <el-input-number 
                  v-model="timeSettingsForm.minDuration" 
                  :min="0.5" 
                  :max="8"
                  :step="0.5"
                  :precision="1"
                />
                <span class="form-tip">小时</span>
              </el-form-item>
              <el-form-item label="时间段分割">
                <el-select v-model="timeSettingsForm.timeSlot">
                  <el-option label="30分钟" value="30" />
                  <el-option label="1小时" value="60" />
                  <el-option label="2小时" value="120" />
                </el-select>
              </el-form-item>
              <el-form-item label="允许周末预约">
                <el-switch v-model="timeSettingsForm.allowWeekend" />
                <span class="form-tip">开启后用户可以预约周末时间</span>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveTimeSettings">保存设置</el-button>
                <el-button @click="resetTimeSettings">重置</el-button>
              </el-form-item>
            </el-form>
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
import { ref, reactive } from 'vue'
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
    const personnelData = ref([
      {
        userType: '管理员',
        canBook: true,
        maxAdvanceDays: 30,
        maxDuration: 24,
        requireApproval: false,
        description: '拥有全部预约权限，无需审批'
      },
      {
        userType: '教师',
        canBook: true,
        maxAdvanceDays: 14,
        maxDuration: 8,
        requireApproval: false,
        description: '可以预约房间，提前14天，最长8小时'
      },
      {
        userType: '学生',
        canBook: true,
        maxAdvanceDays: 7,
        maxDuration: 4,
        requireApproval: true,
        description: '可以预约房间，需要审批，最长4小时'
      }
    ])

    const timeSettingsForm = reactive({
      workdayStart: '08:00',
      workdayEnd: '18:00',
      weekendStart: '09:00',
      weekendEnd: '17:00',
      minDuration: 1,
      timeSlot: '60',
      allowWeekend: true
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

    const updatePersonnelPermission = (index) => {
      ElMessage.success('权限设置已更新')
    }

    const savePersonnelSettings = () => {
      emit('save-settings', { type: 'booking_personnel', data: personnelData.value })
      ElMessage.success('预约人员设置保存成功')
    }

    const resetPersonnelSettings = () => {
      ElMessage.info('预约人员设置已重置')
    }

    const saveTimeSettings = () => {
      emit('save-settings', { type: 'booking_time_settings', data: timeSettingsForm })
      ElMessage.success('预约时间设置保存成功')
    }

    const resetTimeSettings = () => {
      Object.assign(timeSettingsForm, {
        workdayStart: '08:00',
        workdayEnd: '18:00',
        weekendStart: '09:00',
        weekendEnd: '17:00',
        minDuration: 1,
        timeSlot: '60',
        allowWeekend: true
      })
      ElMessage.info('预约时间设置已重置')
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
      personnelData,
      timeSettingsForm,
      schemeData,
      recycleData,
      violationForm,
      blacklistData,
      toggleGroup,
      setActiveSettingType,
      updatePersonnelPermission,
      savePersonnelSettings,
      resetPersonnelSettings,
      saveTimeSettings,
      resetTimeSettings,
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