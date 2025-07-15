<template>
  <div class="personal-center">
    <!-- 顶部导航栏 -->
    <div class="header">
      <div class="header-left">
        <div class="logo">
          <el-icon size="24"><home-filled /></el-icon>
        </div>
        <span class="title">个人中心</span>
      </div>
      <div class="header-right">
        <div class="avatar">
          <el-icon size="20"><user /></el-icon>
        </div>
        <span class="username">系统管理员</span>
        <el-dropdown>
          <span class="dropdown-link">
            <el-icon><grid /></el-icon>
          </span>
        </el-dropdown>
      </div>
    </div>

    <div class="main-container">
      <!-- 左侧个人信息 -->
      <div class="sidebar">
        <div class="user-profile">
          <!-- 头像区域 -->
          <div class="avatar-section">
            <div class="avatar-container">
              <img v-if="userInfo.avatar" :src="userInfo.avatar" class="user-avatar" />
              <div v-else class="default-avatar">
                <span>头像</span>
              </div>
            </div>
          </div>

          <!-- 用户信息 -->
          <div class="user-info">
            <h3 class="username">{{ userInfo.name }}</h3>
            <p class="user-role">{{ userInfo.role }}</p>
          </div>

          <!-- 功能菜单 -->
          <div class="menu-list">
            <div class="menu-item" @click="handleChangePassword">
              <el-icon><lock /></el-icon>
              <span>修改密码</span>
            </div>
            <div class="menu-item active" @click="handleMessageCenter">
              <el-icon><message /></el-icon>
              <span>消息中心</span>
            </div>
          </div>

          <!-- 退出登录 -->
          <div class="logout-section">
            <el-button class="logout-btn" @click="handleLogout">退出登录</el-button>
          </div>
        </div>
      </div>

      <!-- 右侧内容区域 -->
      <div class="main-content">
        <div class="content-wrapper">
          <!-- 消息列表 -->
          <div class="message-list">
            <div 
              v-for="message in messageList" 
              :key="message.id"
              class="message-item"
              :class="{ unread: !message.isRead }"
            >
              <div class="message-type">
                <div class="type-icon" :class="getMessageTypeClass(message.type)">
                  {{ getMessageTypeLabel(message.type) }}
                </div>
              </div>
              <div class="message-content">
                <div class="message-title">{{ message.content }}</div>
                <div class="message-time">{{ message.time }}</div>
              </div>
              <div class="message-dot" v-if="!message.isRead"></div>
            </div>
          </div>

          <!-- 取消按钮 -->
          <div class="action-bar">
            <el-button class="cancel-btn" @click="handleCancel">取消</el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 修改密码弹窗 -->
    <el-dialog
      v-model="passwordDialogVisible"
      title="修改密码"
      width="500px"
      :before-close="handlePasswordDialogClose"
    >
      <el-form
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        label-width="100px"
      >
        <el-form-item label="原密码:" prop="oldPassword">
          <el-input 
            v-model="passwordForm.oldPassword" 
            type="password"
            placeholder="请输入原密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="新密码:" prop="newPassword">
          <el-input 
            v-model="passwordForm.newPassword" 
            type="password"
            placeholder="请输入新密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="确认密码:" prop="confirmPassword">
          <el-input 
            v-model="passwordForm.confirmPassword" 
            type="password"
            placeholder="请再次输入新密码"
            show-password
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handlePasswordDialogClose">取消</el-button>
          <el-button type="primary" @click="handlePasswordSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'PersonalCenter',
  setup() {
    const router = useRouter()
    const passwordFormRef = ref()
    const passwordDialogVisible = ref(false)

    const userInfo = reactive({
      name: '张三',
      role: '管理员',
      avatar: ''
    })

    const passwordForm = reactive({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    })

    const passwordRules = {
      oldPassword: [
        { required: true, message: '请输入原密码', trigger: 'blur' }
      ],
      newPassword: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, max: 20, message: '密码长度应为6-20个字符', trigger: 'blur' }
      ],
      confirmPassword: [
        { required: true, message: '请确认新密码', trigger: 'blur' },
        {
          validator: (rule, value, callback) => {
            if (value !== passwordForm.newPassword) {
              callback(new Error('两次输入的密码不一致'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ]
    }

    const messageList = ref([
      {
        id: 1,
        type: 'info',
        content: '今天西安高新区全项目均明，市民期盼基础设施行安全',
        time: '2020-10-21 19:58:09',
        isRead: false
      },
      {
        id: 2,
        type: 'important',
        content: '中午12:00集团开会谈管理人员提前5分钟到场准备会议室',
        time: '2020-10-21 19:58:09',
        isRead: false
      },
      {
        id: 3,
        type: 'normal',
        content: '中午12:00集团开会谈管理人员提前5分钟',
        time: '2020-10-21 19:58:09',
        isRead: true
      },
      {
        id: 4,
        type: 'info',
        content: '今天西安高新区全项目均明，市民期盼基础设施行安全',
        time: '2020-10-21 19:58:09',
        isRead: false
      },
      {
        id: 5,
        type: 'important',
        content: '中午12:00集团开会谈管理人员提前5分钟到场准备会议室',
        time: '2020-10-21 19:58:09',
        isRead: false
      },
      {
        id: 6,
        type: 'normal',
        content: '中午12:00集团开会谈管理人员提前5分钟',
        time: '2020-10-21 19:58:09',
        isRead: true
      },
      {
        id: 7,
        type: 'important',
        content: '中午12:00集团开会谈管理人员提前5分钟',
        time: '2020-10-21 19:58:09',
        isRead: false
      }
    ])

    const getMessageTypeClass = (type) => {
      const typeMap = {
        info: 'type-info',
        important: 'type-important',
        normal: 'type-normal'
      }
      return typeMap[type] || 'type-normal'
    }

    const getMessageTypeLabel = (type) => {
      const labelMap = {
        info: '告',
        important: '通',
        normal: '通'
      }
      return labelMap[type] || '通'
    }

    const handleChangePassword = () => {
      passwordDialogVisible.value = true
    }

    const handleMessageCenter = () => {
      console.log('进入消息中心')
    }

    const handleLogout = () => {
      ElMessageBox.confirm(
        '确定要退出登录吗？',
        '确认退出',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(() => {
        ElMessage.success('退出登录成功')
        router.push('/login')
      }).catch(() => {
        ElMessage.info('已取消退出')
      })
    }

    const handleCancel = () => {
      router.back()
    }

    const handlePasswordDialogClose = () => {
      passwordDialogVisible.value = false
      passwordForm.oldPassword = ''
      passwordForm.newPassword = ''
      passwordForm.confirmPassword = ''
    }

    const handlePasswordSubmit = async () => {
      try {
        await passwordFormRef.value.validate()
        // 这里处理密码修改逻辑
        ElMessage.success('密码修改成功')
        handlePasswordDialogClose()
      } catch (error) {
        console.log('表单验证失败:', error)
      }
    }

    return {
      userInfo,
      messageList,
      passwordDialogVisible,
      passwordForm,
      passwordFormRef,
      passwordRules,
      getMessageTypeClass,
      getMessageTypeLabel,
      handleChangePassword,
      handleMessageCenter,
      handleLogout,
      handleCancel,
      handlePasswordDialogClose,
      handlePasswordSubmit
    }
  }
}
</script>

<style scoped>
.personal-center {
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
  padding: 8px;
  border-radius: 6px;
  transition: background-color 0.3s;
}

.dropdown-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.main-container {
  display: flex;
  height: calc(100vh - 70px);
}

.sidebar {
  width: 320px;
  background: white;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}

.user-profile {
  padding: 40px 30px;
  text-align: center;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.avatar-section {
  margin-bottom: 30px;
}

.avatar-container {
  width: 120px;
  height: 120px;
  margin: 0 auto;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #e8e8e8;
}

.user-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.default-avatar {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
}

.user-info {
  margin-bottom: 40px;
}

.user-info .username {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.user-role {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.menu-list {
  flex: 1;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px 20px;
  margin-bottom: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  color: #666;
}

.menu-item:hover {
  background-color: #f0f2f5;
  color: #4A90E2;
}

.menu-item.active {
  background-color: #4A90E2;
  color: white;
}

.logout-section {
  margin-top: auto;
  padding-top: 20px;
}

.logout-btn {
  width: 100%;
  padding: 12px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  color: #666;
}

.logout-btn:hover {
  background-color: #e8e8e8;
  border-color: #ccc;
}

.main-content {
  flex: 1;
  background: white;
  display: flex;
  flex-direction: column;
}

.content-wrapper {
  flex: 1;
  padding: 20px 30px;
  display: flex;
  flex-direction: column;
}

.message-list {
  flex: 1;
  overflow-y: auto;
}

.message-item {
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
  position: relative;
}

.message-item.unread {
  background-color: #fafafa;
}

.message-type {
  margin-right: 15px;
}

.type-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  font-weight: 600;
}

.type-info {
  background-color: #4A90E2;
}

.type-important {
  background-color: #e74c3c;
}

.type-normal {
  background-color: #95a5a6;
}

.message-content {
  flex: 1;
}

.message-title {
  font-size: 16px;
  color: #333;
  line-height: 1.5;
  margin-bottom: 5px;
}

.message-time {
  font-size: 14px;
  color: #999;
}

.message-dot {
  width: 8px;
  height: 8px;
  background-color: #e74c3c;
  border-radius: 50%;
  margin-left: 15px;
}

.action-bar {
  padding: 20px 0;
  text-align: right;
  border-top: 1px solid #f0f0f0;
  margin-top: auto;
}

.cancel-btn {
  padding: 10px 30px;
  background-color: #95a5a6;
  border: none;
  color: white;
}

.cancel-btn:hover {
  background-color: #7f8c8d;
}

.dialog-footer {
  text-align: right;
}

/* Element Plus 组件样式覆盖 */
:deep(.el-form-item) {
  margin-bottom: 20px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #333;
}

:deep(.el-dialog__header) {
  background-color: #f8f9fa;
  padding: 20px 24px;
  border-bottom: 1px solid #e9ecef;
}

:deep(.el-dialog__title) {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .main-container {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    height: auto;
  }
}
</style>