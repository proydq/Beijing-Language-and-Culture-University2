<template>
  <div class="setting-section">
    <div class="section-header">
      <div>
        <h2>违规配置</h2>
        <p>配置违规检测规则和处理方式</p>
      </div>
    </div>

    <div class="setting-form">
      <el-form :model="violationForm" label-width="140px">
        <el-form-item label="启用违规检测">
          <el-switch v-model="violationForm.enabled" />
          <span class="form-tip">开启后系统将自动检测用户违规行为</span>
        </el-form-item>

        <el-form-item label="迟到容忍时间">
          <el-input-number
            v-model="violationForm.lateToleranceMinutes"
            :min="0"
            :max="60"
            controls-position="right"
          />
          <span class="form-tip">分钟（超过此时间视为迟到）</span>
        </el-form-item>

        <el-form-item label="早退容忍时间">
          <el-input-number
            v-model="violationForm.earlyLeaveToleranceMinutes"
            :min="0"
            :max="60"
            controls-position="right"
          />
          <span class="form-tip">分钟（提前离开超过此时间视为早退）</span>
        </el-form-item>

        <el-form-item label="缺席处理方式">
          <el-select v-model="violationForm.absenteeismAction" placeholder="请选择">
            <el-option label="仅警告" value="warning" />
            <el-option label="扣除积分" value="deduct_points" />
            <el-option label="暂时禁用预约" value="suspend" />
            <el-option label="加入黑名单" value="blacklist" />
          </el-select>
          <span class="form-tip">用户无故缺席时的处理方式</span>
        </el-form-item>

        <el-form-item label="违规积分阈值">
          <el-input-number
            v-model="violationForm.violationPointsThreshold"
            :min="1"
            :max="100"
            controls-position="right"
          />
          <span class="form-tip">分（达到此积分自动触发处罚）</span>
        </el-form-item>

        <el-form-item label="自动通知">
          <el-switch v-model="violationForm.autoNotify" />
          <span class="form-tip">发生违规时自动发送通知给用户</span>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="saveViolationConfig">保存配置</el-button>
          <el-button @click="resetViolationConfig">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 黑名单管理 -->
    <div class="blacklist-management">
      <div class="section-header">
        <div>
          <h3>黑名单管理</h3>
          <p>管理被禁止预约的用户</p>
        </div>
      </div>

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
</template>

<script>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Refresh } from '@element-plus/icons-vue'

export default {
  name: 'ViolationSettings',
  components: {
    Plus,
    Refresh
  },
  emits: ['save-settings'],
  setup(props, { emit }) {
    // 违规配置表单
    const violationForm = reactive({
      enabled: true,
      lateToleranceMinutes: 15,
      earlyLeaveToleranceMinutes: 10,
      absenteeismAction: 'warning',
      violationPointsThreshold: 10,
      autoNotify: true
    })

    // 黑名单数据
    const blacklistData = ref([
      {
        id: 1,
        username: '张同学',
        userType: '学生',
        violationReason: '连续3次无故缺席预约',
        violationCount: 3,
        addTime: '2024-03-15 14:30:00',
        expireTime: '2024-04-15 14:30:00'
      },
      {
        id: 2,
        username: '李某某',
        userType: '教师',
        violationReason: '恶意占用教室资源',
        violationCount: 1,
        addTime: '2024-03-10 09:20:00',
        expireTime: '永久'
      }
    ])

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
      violationForm,
      blacklistData,
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

.section-header h2, .section-header h3 {
  margin: 0;
  font-size: 20px;
  color: #333;
  font-weight: 600;
}

.section-header h3 {
  font-size: 18px;
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

.blacklist-management {
  margin-top: 40px;
}

.blacklist-actions {
  margin-bottom: 16px;
  text-align: left;
}

.blacklist-table {
  margin-top: 16px;
}
</style>