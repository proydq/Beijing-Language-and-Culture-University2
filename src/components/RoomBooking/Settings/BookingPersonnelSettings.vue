<template>
  <div class="setting-section">
    <div class="section-header">
      <div>
        <h2>预约人员设置</h2>
        <p>配置不同人员类别的预约权限和访问权限</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="addPersonnelPermission">
          <el-icon><plus /></el-icon>
          新增权限
        </el-button>
        <el-button @click="exportPersonnelList">
          <el-icon><upload /></el-icon>
          导出列表
        </el-button>
      </div>
    </div>

    <el-table :data="personnelPermissionData" style="width: 100%" border>
      <el-table-column prop="subject" label="人员对象" width="200" />
      <el-table-column prop="permission" label="权限设置" min-width="300">
        <template #default="{ row }">
          <div class="personnel-list-text">
            <span>{{ row.permission }}</span>
            <el-button type="primary" size="small" @click="viewPersonnelDetails(row)">查看</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="accessRooms" label="可访问教室" min-width="300">
        <template #default="{ row }">
          <div class="rooms-list-text">
            <span>{{ row.accessRooms }}</span>
            <el-button type="primary" size="small" @click="viewRoomDetails(row)">查看</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="editPersonnelPermission(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="deletePersonnelPermission(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Upload } from '@element-plus/icons-vue'

export default {
  name: 'BookingPersonnelSettings',
  components: {
    Plus,
    Upload
  },
  setup() {
    // 预约人员权限数据
    const personnelPermissionData = ref([
      {
        id: 1,
        subject: '教师人员',
        permission: '可预约所有教室，可查看所有预约记录，可审核学生预约',
        accessRooms: '多媒体教室（101-105）、实验室（201-203）、会议室（301-302）'
      },
      {
        id: 2,
        subject: '学生人员',
        permission: '可预约指定教室，需要审核，仅可查看自己的预约记录',
        accessRooms: '多媒体教室（101-103）、自习室（204-206）'
      },
      {
        id: 3,
        subject: '管理员',
        permission: '可预约所有教室，可管理所有预约，可设置系统参数',
        accessRooms: '所有教室和场所'
      }
    ])

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

    return {
      personnelPermissionData,
      addPersonnelPermission,
      exportPersonnelList,
      viewPersonnelDetails,
      viewRoomDetails,
      editPersonnelPermission,
      deletePersonnelPermission
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
</style>