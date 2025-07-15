<template>
  <Layout>
    <div class="dashboard-content">
      <!-- 基础功能分类 -->
      <div class="category-section">
        <h3 class="category-title">基础功能分类</h3>
        <div class="card-grid">
          <div class="function-card" @click="handleCardClick('用户信息管理')">
            <div class="card-icon">
              <el-icon size="24"><user /></el-icon>
            </div>
            <div class="card-content">
              <h4>用户信息管理</h4>
              <p>主要用于录入用户基本信息、查询、资料修改、删除、用户权限管理</p>
            </div>
          </div>
          <div class="function-card" @click="handleCardClick('房屋信息管理')">
            <div class="card-icon">
              <el-icon size="24"><house /></el-icon>
            </div>
            <div class="card-content">
              <h4>房屋信息管理</h4>
              <p>主要用于房屋基本信息录入、查询、房屋结构分析管理</p>
            </div>
          </div>
          <div class="function-card" @click="handleCardClick('权限管理')">
            <div class="card-icon">
              <el-icon size="24"><key /></el-icon>
            </div>
            <div class="card-content">
              <h4>权限管理</h4>
              <p>主要用于不同角色的权限分配及角色管理</p>
            </div>
          </div>
          <div class="function-card">
            <div class="card-icon">
              <el-icon size="24"><monitor /></el-icon>
            </div>
            <div class="card-content">
              <h4>访问控制管理</h4>
              <p>主要用于控制人员的访问权限，进出管理及实时访问状态查看功能</p>
            </div>
          </div>
          <div class="function-card">
            <div class="card-icon">
              <el-icon size="24"><bell /></el-icon>
            </div>
            <div class="card-content">
              <h4>消息推送管理</h4>
              <p>主要用于系统各类消息的推送管理</p>
            </div>
          </div>
          <div class="function-card">
            <div class="card-icon">
              <el-icon size="24"><files /></el-icon>
            </div>
            <div class="card-content">
              <h4>文档管理</h4>
              <p>主要用于各类文档的上传、下载、查看、删除管理</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 应用功能分类 -->
      <div class="category-section">
        <h3 class="category-title">应用功能分类</h3>
        <div class="card-grid">
          <div class="function-card">
            <div class="card-icon">
              <el-icon size="24"><video-camera /></el-icon>
            </div>
            <div class="card-content">
              <h4>会议管理</h4>
              <p>主要用于会议室的预约，会议管理功能</p>
            </div>
          </div>
          <div class="function-card">
            <div class="card-icon">
              <el-icon size="24"><user /></el-icon>
            </div>
            <div class="card-content">
              <h4>访客管理</h4>
              <p>主要用于来访人员的访问管理、提交登记功能</p>
            </div>
          </div>
          <div class="function-card">
            <div class="card-icon">
              <el-icon size="24"><data-line /></el-icon>
            </div>
            <div class="card-content">
              <h4>图书馆管理</h4>
              <p>主要用于管理书籍的预约情况下、库存管理、订购管理</p>
            </div>
          </div>
          <div class="function-card">
            <div class="card-icon">
              <el-icon size="24"><odometer /></el-icon>
            </div>
            <div class="card-content">
              <h4>实验室管理</h4>
              <p>主要用于实验室的预约，设备、安全检查及实验器管理</p>
            </div>
          </div>
          <div class="function-card">
            <div class="card-icon">
              <el-icon size="24"><graduation-cap /></el-icon>
            </div>
            <div class="card-content">
              <h4>行政效管理</h4>
              <p>主要用于管理效果的应达到情况、学生能效对象、调整松紧达到功能</p>
            </div>
          </div>
          <div class="function-card">
            <div class="card-icon">
              <el-icon size="24"><document /></el-icon>
            </div>
            <div class="card-content">
              <h4>标识管理</h4>
              <p>主要用于宾客道路场大队的管理及宾客信息下发</p>
            </div>
          </div>
          <div class="function-card">
            <div class="card-icon">
              <el-icon size="24"><position /></el-icon>
            </div>
            <div class="card-content">
              <h4>人员去向管理</h4>
              <p>能在提出人员友商模块设备行开标实施管理，系统会以出席人员去向</p>
            </div>
          </div>
          <div class="function-card">
            <div class="card-icon">
              <el-icon size="24"><user /></el-icon>
            </div>
            <div class="card-content">
              <h4>家校互通管理</h4>
              <p>主要用于家长和学校的沟通管理</p>
            </div>
          </div>
          <div class="function-card">
            <div class="card-icon">
              <el-icon size="24"><timer /></el-icon>
            </div>
            <div class="card-content">
              <h4>电子时钟管理</h4>
              <p>主要用于主持时钟功能。升杯、音频主动功能的管理</p>
            </div>
          </div>
          <div class="function-card">
            <div class="card-icon">
              <el-icon size="24"><edit /></el-icon>
            </div>
            <div class="card-content">
              <h4>考务管理</h4>
              <p>主要用于考试信息及考场安排</p>
            </div>
          </div>
          <div class="function-card">
            <div class="card-icon">
              <el-icon size="24"><school /></el-icon>
            </div>
            <div class="card-content">
              <h4>空间教室维保</h4>
              <p>主要用于管理分析室内设备的内部保养及的各类管理</p>
            </div>
          </div>
          <div class="function-card">
            <div class="card-icon">
              <el-icon size="24"><office-building /></el-icon>
            </div>
            <div class="card-content">
              <h4>房屋信用管理</h4>
              <p></p>
            </div>
          </div>
          <div class="function-card">
            <div class="card-icon">
              <el-icon size="24"><tools /></el-icon>
            </div>
            <div class="card-content">
              <h4>报修管理</h4>
              <p>包含已维修管理、数案等各项设备及工单中意见</p>
            </div>
          </div>
          <div class="function-card">
            <div class="card-icon">
              <el-icon size="24"><operation /></el-icon>
            </div>
            <div class="card-content">
              <h4>保洁管理</h4>
              <p>主要用于清洁卫生列目标的实际安全管理</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 统计分类 -->
      <div class="category-section">
        <h3 class="category-title">统计分类</h3>
        <div class="card-grid">
          <div class="function-card">
            <div class="card-icon">
              <el-icon size="24"><data-line /></el-icon>
            </div>
            <div class="card-content">
              <h4>终端统计</h4>
              <p>实施监控后对于终端的数据性进行总监，支持导出功能</p>
            </div>
          </div>
          <div class="function-card">
            <div class="card-icon">
              <el-icon size="24"><data-line /></el-icon>
            </div>
            <div class="card-content">
              <h4>环境统计</h4>
              <p>实时监控环境数据并提供统计分析功能</p>
            </div>
          </div>
          <div class="function-card">
            <div class="card-icon">
              <el-icon size="24"><connection /></el-icon>
            </div>
            <div class="card-content">
              <h4>系统流活管理</h4>
              <p>系统流活的功能配置</p>
            </div>
          </div>
          <div class="function-card">
            <div class="card-icon">
              <el-icon size="24"><grid /></el-icon>
            </div>
            <div class="card-content">
              <h4>体验管理</h4>
              <p>主办体验使用管理数据、客进线数据的、对干操作检管</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 部署实施运维分类 -->
      <div class="category-section">
        <h3 class="category-title">部署实施运维分类</h3>
        <div class="card-grid">
          <div class="function-card">
            <div class="card-icon">
              <el-icon size="24"><connection /></el-icon>
            </div>
            <div class="card-content">
              <h4>终端网络配置</h4>
              <p>主要用于对各设备网络控制的配置</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script>
import { useRouter } from 'vue-router'
import Layout from '@/components/Layout.vue'

export default {
  name: 'Dashboard',
  components: {
    Layout
  },
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
.dashboard-content {
  background-color: #f5f5f5;
  min-height: calc(100vh - 110px);
}

.category-section {
  margin-bottom: 30px;
}

.category-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #4A90E2;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.function-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  cursor: pointer;
  border: 1px solid #e8e8e8;
}

.function-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
  border-color: #4A90E2;
}

.card-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 15px;
}

.card-content h4 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.card-content p {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin: 0;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .card-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 1200px) {
  .card-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}
</style>