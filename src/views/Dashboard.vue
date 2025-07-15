<template>
  <div class="dashboard">
    <!-- 顶部导航栏 -->
    <div class="header">
      <div class="header-left">
        <div class="logo">
          <el-icon size="24"><home-filled /></el-icon>
        </div>
      </div>
      <div class="header-right">
        <div class="user-info">
          <div class="avatar">
            <el-icon size="20"><user /></el-icon>
          </div>
          <span class="username">张三</span>
          <span class="user-role">管理员</span>
        </div>
        <el-dropdown>
          <span class="dropdown-link">
            中文
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>中文</el-dropdown-item>
              <el-dropdown-item>English</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <div class="grid-menu">
          <el-icon size="20"><grid /></el-icon>
        </div>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 基础分类 -->
      <div class="category-section">
        <h3 class="category-title">基础分类</h3>
        <div class="card-grid">
          <div class="function-card" @click="handleCardClick('主题管理')">
            <div class="card-icon">
              <el-icon size="32"><setting /></el-icon>
            </div>
            <div class="card-content">
              <h4>主题管理</h4>
              <p>主要用于主题配置界面的设计方案，实现其自主功能，说明作者及具体工作</p>
            </div>
          </div>
          <div class="function-card" @click="handleCardClick('信息发布管理')">
            <div class="card-icon">
              <el-icon size="32"><message /></el-icon>
            </div>
            <div class="card-content">
              <h4>信息发布管理</h4>
              <p>主要用于各类播出式的信息，提供模块信息及其发布的功能</p>
            </div>
          </div>
          <div class="function-card" @click="handleCardClick('用户信息管理')">
            <div class="card-icon">
              <el-icon size="32"><user /></el-icon>
            </div>
            <div class="card-content">
              <h4>用户信息管理</h4>
              <p>包含用户信息、新开户信息等基础信息配置与储存功能</p>
            </div>
          </div>
          <div class="function-card" @click="handleCardClick('媒体资源管理')">
            <div class="card-icon">
              <el-icon size="32"><picture /></el-icon>
            </div>
            <div class="card-content">
              <h4>媒体资源管理</h4>
              <p>用于管理文档、图片、录像音频文件及存储管理</p>
            </div>
          </div>
          <div class="function-card" @click="handleCardClick('房屋信息管理')">
            <div class="card-icon">
              <el-icon size="32"><house /></el-icon>
            </div>
            <div class="card-content">
              <h4>房屋信息管理</h4>
              <p>包含房屋基本信息录入及信息储存等管理功能</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 控制分类 -->
      <div class="category-section">
        <h3 class="category-title">控制分类</h3>
        <div class="card-grid">
          <div class="function-card" @click="handleCardClick('终端管理')">
            <div class="card-icon">
              <el-icon size="32"><monitor /></el-icon>
            </div>
            <div class="card-content">
              <h4>终端管理</h4>
              <p>对于终端的管理、包含开发管理、通过终端命令等配置管理</p>
            </div>
          </div>
          <div class="function-card active" @click="handleCardClick('门禁管理')">
            <div class="card-icon">
              <el-icon size="32"><lock /></el-icon>
            </div>
            <div class="card-content">
              <h4>门禁管理</h4>
              <p>对门禁的等监控器、支持水印权限+密码的研发设备及历史管理记录等</p>
            </div>
          </div>
          <div class="function-card" @click="handleCardClick('摄像头管理')">
            <div class="card-icon">
              <el-icon size="32"><video-camera /></el-icon>
            </div>
            <div class="card-content">
              <h4>摄像头管理</h4>
              <p>主要进行对摄像设备全流程的基础建设</p>
            </div>
          </div>
          <div class="function-card" @click="handleCardClick('可视对讲管理')">
            <div class="card-icon">
              <el-icon size="32"><phone /></el-icon>
            </div>
            <div class="card-content">
              <h4>可视对讲管理</h4>
              <p>主要实现监控对讲口直播的的基础功能</p>
            </div>
          </div>
          <div class="function-card" @click="handleCardClick('中控管理')">
            <div class="card-icon">
              <el-icon size="32"><operation /></el-icon>
            </div>
            <div class="card-content">
              <h4>中控管理</h4>
              <p>主要用于中等设备的控制系统及测试设备与相关测试服务</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 业务分类 -->
      <div class="category-section">
        <h3 class="category-title">业务分类</h3>
        <div class="card-grid">
          <div class="function-card" @click="handleCardClick('会议管理')">
            <div class="card-icon">
              <el-icon size="32"><video-camera /></el-icon>
            </div>
            <div class="card-content">
              <h4>会议管理</h4>
              <p>主要用于会议室的预约，会议，监督等功能</p>
            </div>
          </div>
          <div class="function-card" @click="handleCardClick('访客管理')">
            <div class="card-icon">
              <el-icon size="32"><user /></el-icon>
            </div>
            <div class="card-content">
              <h4>访客管理</h4>
              <p>主要用于来访人员的预约，申请等功能</p>
            </div>
          </div>
          <div class="function-card" @click="handleCardClick('图书馆管理')">
            <div class="card-icon">
              <el-icon size="32"><reading /></el-icon>
            </div>
            <div class="card-content">
              <h4>图书馆管理</h4>
              <p>主要进行图书预约的内程序，阅读信息等，书籍管理等各类管理</p>
            </div>
          </div>
          <div class="function-card" @click="handleCardClick('实验室管理')">
            <div class="card-icon">
              <el-icon size="32"><data-analysis /></el-icon>
            </div>
            <div class="card-content">
              <h4>实验室管理</h4>
              <p>主要用于实验室的预约，设备，安全检查及实验器管理</p>
            </div>
          </div>
          <div class="function-card" @click="handleCardClick('行政班管理')">
            <div class="card-icon">
              <el-icon size="32"><office-building /></el-icon>
            </div>
            <div class="card-content">
              <h4>行政班管理</h4>
              <p>主要用于管理效果的应达到情况、学生能效对象、调整松紧达到功能</p>
            </div>
          </div>
          <div class="function-card" @click="handleCardClick('标识管理')">
            <div class="card-icon">
              <el-icon size="32"><document /></el-icon>
            </div>
            <div class="card-content">
              <h4>标识管理</h4>
              <p>主要用于管理单位的标识类型和部门设等</p>
            </div>
          </div>
          <div class="function-card" @click="handleCardClick('人员去向管理')">
            <div class="card-icon">
              <el-icon size="32"><position /></el-icon>
            </div>
            <div class="card-content">
              <h4>人员去向管理</h4>
              <p>能够查询人员去向表单集器集行于标准实施管理，系统会以出站人员去向</p>
            </div>
          </div>
          <div class="function-card" @click="handleCardClick('家校互通管理')">
            <div class="card-icon">
              <el-icon size="32"><connection /></el-icon>
            </div>
            <div class="card-content">
              <h4>家校互通管理</h4>
              <p>主要用于家长和学校的沟通管理</p>
            </div>
          </div>
          <div class="function-card" @click="handleCardClick('电子时钟管理')">
            <div class="card-icon">
              <el-icon size="32"><timer /></el-icon>
            </div>
            <div class="card-content">
              <h4>电子时钟管理</h4>
              <p>主要用于平时时钟的主持、内容、远程功能的管理</p>
            </div>
          </div>
          <div class="function-card" @click="handleCardClick('考务管理')">
            <div class="card-icon">
              <el-icon size="32"><edit /></el-icon>
            </div>
            <div class="card-content">
              <h4>考务管理</h4>
              <p>主要用于考试信息及考场安排</p>
            </div>
          </div>
          <div class="function-card" @click="handleCardClick('空间教室维保')">
            <div class="card-icon">
              <el-icon size="32"><house /></el-icon>
            </div>
            <div class="card-content">
              <h4>空间教室维保</h4>
              <p>主要用于管理分析室内设备的内部保养及的各类管理</p>
            </div>
          </div>
          <div class="function-card" @click="handleCardClick('房屋信用管理')">
            <div class="card-icon">
              <el-icon size="32"><office-building /></el-icon>
            </div>
            <div class="card-content">
              <h4>房屋信用管理</h4>
              <p>主要用于房屋信息的管理，约台信息管理</p>
            </div>
          </div>
          <div class="function-card" @click="handleCardClick('报修管理')">
            <div class="card-icon">
              <el-icon size="32"><tools /></el-icon>
            </div>
            <div class="card-content">
              <h4>报修管理</h4>
              <p>包含已维修管理、数案等各项设备及工单中意见</p>
            </div>
          </div>
          <div class="function-card" @click="handleCardClick('保洁管理')">
            <div class="card-icon">
              <el-icon size="32"><operation /></el-icon>
            </div>
            <div class="card-content">
              <h4>保洁管理</h4>
              <p>主要用于清洁卫生目标的实际安全管理</p>
            </div>
          </div>
          <div class="function-card" @click="handleCardClick('环境管理')">
            <div class="card-icon">
              <el-icon size="32"><sunny /></el-icon>
            </div>
            <div class="card-content">
              <h4>环境管理</h4>
              <p>主要用于对室内控制面或者功能的各类监测与数据及实务</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 统计分类 -->
      <div class="category-section">
        <h3 class="category-title">统计分类</h3>
        <div class="card-grid">
          <div class="function-card" @click="handleCardClick('终端统计')">
            <div class="card-icon">
              <el-icon size="32"><data-line /></el-icon>
            </div>
            <div class="card-content">
              <h4>终端统计</h4>
              <p>记录监控的定时上报数据进行统计概览功能，支持导出</p>
            </div>
          </div>
          <div class="function-card" @click="handleCardClick('环境统计')">
            <div class="card-icon">
              <el-icon size="32"><data-line /></el-icon>
            </div>
            <div class="card-content">
              <h4>环境统计</h4>
              <p>以监控的定时上报环境统计数据统计概览，支持导出</p>
            </div>
          </div>
          <div class="function-card" @click="handleCardClick('预约统计')">
            <div class="card-icon">
              <el-icon size="32"><data-line /></el-icon>
            </div>
            <div class="card-content">
              <h4>预约统计</h4>
              <p>对各监控的定时上报统计环境的监控概览，支持导出功能</p>
            </div>
          </div>
          <div class="function-card" @click="handleCardClick('用户画像统计')">
            <div class="card-icon">
              <el-icon size="32"><data-line /></el-icon>
            </div>
            <div class="card-content">
              <h4>用户画像统计</h4>
              <p>对监控的定时上报数据进行用户信息的概览，支持导出功能</p>
            </div>
          </div>
          <div class="function-card" @click="handleCardClick('访客统计')">
            <div class="card-icon">
              <el-icon size="32"><data-line /></el-icon>
            </div>
            <div class="card-content">
              <h4>访客统计</h4>
              <p>实施监控后对于终端访客数据性进行总监，支持导出功能</p>
            </div>
          </div>
          <div class="function-card" @click="handleCardClick('门禁统计')">
            <div class="card-icon">
              <el-icon size="32"><data-line /></el-icon>
            </div>
            <div class="card-content">
              <h4>门禁统计</h4>
              <p>记录监控的定时上报数据进行的门禁行为统计，支持导出功能</p>
            </div>
          </div>
          <div class="function-card" @click="handleCardClick('日志统计')">
            <div class="card-icon">
              <el-icon size="32"><data-line /></el-icon>
            </div>
            <div class="card-content">
              <h4>日志统计</h4>
              <p>记录日志的管理</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 权限分类 -->
      <div class="category-section">
        <h3 class="category-title">权限分类</h3>
        <div class="card-grid">
          <div class="function-card" @click="handleCardClick('权限管理')">
            <div class="card-icon">
              <el-icon size="32"><user /></el-icon>
            </div>
            <div class="card-content">
              <h4>权限管理</h4>
              <p>主要是对用户的权限，登录案列的管理</p>
            </div>
          </div>
          <div class="function-card" @click="handleCardClick('控件管理')">
            <div class="card-icon">
              <el-icon size="32"><grid /></el-icon>
            </div>
            <div class="card-content">
              <h4>控件管理</h4>
              <p>控件、软件器管理，工具权限管理，可自主配置管理</p>
            </div>
          </div>
          <div class="function-card" @click="handleCardClick('系统流活管理')">
            <div class="card-icon">
              <el-icon size="32"><connection /></el-icon>
            </div>
            <div class="card-content">
              <h4>系统流活管理</h4>
              <p>系统流活的功能配置</p>
            </div>
          </div>
          <div class="function-card" @click="handleCardClick('体验管理')">
            <div class="card-icon">
              <el-icon size="32"><grid /></el-icon>
            </div>
            <div class="card-content">
              <h4>体验管理</h4>
              <p>各类体验的维护管理，推出系统到期期间功能，流行的指控管理等</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 部署实施运维分类 -->
      <div class="category-section">
        <h3 class="category-title">部署实施运维分类</h3>
        <div class="card-grid">
          <div class="function-card" @click="handleCardClick('终端网络配置')">
            <div class="card-icon">
              <el-icon size="32"><connection /></el-icon>
            </div>
            <div class="card-content">
              <h4>终端网络配置</h4>
              <p>主要用于对各设备网络控制的配置</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'Dashboard',
  setup() {
    const router = useRouter()

    const handleCardClick = (cardName) => {
      switch(cardName) {
        case '用户信息管理':
          router.push('/user-management')
          break
        case '房屋信息管理':
          router.push('/house-management')
          break
        case '权限管理':
          router.push('/role-management')
          break
        case '门禁管理':
          router.push('/access-control/dashboard')
          break
        // 可以添加更多卡片的跳转逻辑
        default:
          console.log('点击了:', cardName)
      }
    }

    return {
      handleCardClick
    }
  }
}
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background-color: #f0f2f5;
}

.header {
  background: white;
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e8e8e8;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-left .logo {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #4A90E2;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-left .logo:hover {
  background: #357ABD;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}

.username {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.user-role {
  font-size: 14px;
  color: #666;
}

.dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  color: #333;
  background: white;
  font-size: 14px;
}

.dropdown-link:hover {
  border-color: #4A90E2;
  color: #4A90E2;
}

.grid-menu {
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  color: #666;
  transition: all 0.3s;
}

.grid-menu:hover {
  background-color: #f0f0f0;
  color: #4A90E2;
}

.main-content {
  padding: 30px;
  max-width: 1400px;
  margin: 0 auto;
}

.category-section {
  margin-bottom: 40px;
}

.category-title {
  font-size: 16px;
  color: #666;
  margin-bottom: 20px;
  padding-left: 0;
  font-weight: 500;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
}

.function-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  min-height: 120px;
}

.function-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: #4A90E2;
}

.function-card.active {
  background: #8B5CF6;
  color: white;
  border-color: #8B5CF6;
}

.function-card.active .card-icon {
  color: white;
}

.card-icon {
  margin-bottom: 12px;
  color: #666;
}

.function-card.active .card-icon {
  color: white;
}

.card-content h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.function-card.active .card-content h4 {
  color: white;
}

.card-content p {
  margin: 0;
  font-size: 12px;
  color: #999;
  line-height: 1.4;
}

.function-card.active .card-content p {
  color: rgba(255, 255, 255, 0.9);
}

/* 响应式调整 */
@media (max-width: 1400px) {
  .card-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 1200px) {
  .card-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .header {
    padding: 15px 20px;
    flex-direction: column;
    gap: 15px;
  }
  
  .main-content {
    padding: 20px;
  }
  
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .function-card {
    padding: 15px;
    min-height: 100px;
  }
}

@media (max-width: 480px) {
  .card-grid {
    grid-template-columns: 1fr;
  }
}
</style>