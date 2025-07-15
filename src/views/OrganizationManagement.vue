<template>
  <div class="organization-management">
    <!-- 顶部导航栏 -->
    <div class="header">
      <div class="header-left">
        <div class="logo">
          <el-icon size="24"><home-filled /></el-icon>
        </div>
        <span class="title">功能模块</span>
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
      <!-- 右侧主内容 -->
      <div class="main-content">
        <!-- 标签页 -->
        <el-tabs v-model="activeTab" class="tabs" @tab-click="handleTabClick">
          <el-tab-pane label="用户管理" name="user"></el-tab-pane>
          <el-tab-pane label="组织架构管理" name="org"></el-tab-pane>
          <el-tab-pane label="职务/职级管理" name="position"></el-tab-pane>
        </el-tabs>

        <!-- 操作按钮区域 -->
        <div class="action-area">
          <el-button type="primary" @click="handleAddParent" :disabled="!selectedNode">主题</el-button>
          <el-button type="primary" @click="handleAddChild" :disabled="!selectedNode">子主题</el-button>
          <el-button type="danger" @click="handleDelete" :disabled="!selectedNode || selectedNode.id === 1">删除</el-button>
        </div>

        <!-- 组织架构树 -->
        <div class="tree-area">
          <el-tree
            ref="treeRef"
            :data="treeData"
            :props="treeProps"
            node-key="id"
            default-expand-all
            highlight-current
            @node-click="handleNodeClick"
          >
            <template #default="{ node, data }">
              <span class="tree-node">
                <el-icon v-if="data.type === 'company'"><office-building /></el-icon>
                <el-icon v-else-if="data.type === 'department'"><menu /></el-icon>
                <el-icon v-else><user /></el-icon>
                <span class="node-text">{{ node.label }}</span>
                <span class="node-count" v-if="data.count !== undefined">[{{ data.count }}]</span>
              </span>
            </template>
          </el-tree>
        </div>
      </div>
    </div>

    <!-- 添加节点弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
      :before-close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="名称:" prop="name">
          <el-input v-model="formData.name" placeholder="请输入名称" />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleDialogClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'OrganizationManagement',
  setup() {
    const router = useRouter()
    const activeTab = ref('org')
    const treeRef = ref()
    const formRef = ref()
    const dialogVisible = ref(false)
    const selectedNode = ref(null)
    const actionType = ref('') // 'parent' or 'child'
    let nodeIdCounter = 100 // 用于生成唯一ID

    const formData = reactive({
      name: ''
    })

    const formRules = {
      name: [
        { required: true, message: '请输入名称', trigger: 'blur' },
        { min: 2, max: 20, message: '名称长度应为2-20个字符', trigger: 'blur' }
      ]
    }

    const treeProps = {
      children: 'children',
      label: 'label'
    }

    const treeData = ref([
      {
        id: 1,
        label: '全部',
        type: 'company',
        count: 150,
        children: [
          {
            id: 2,
            label: '北京分公司',
            type: 'department',
            count: 50,
            children: [
              {
                id: 3,
                label: '研发部',
                type: 'department',
                count: 10,
                children: [
                  { id: 4, label: '研发（1）组', type: 'group', count: undefined },
                  { id: 5, label: '研发（2）组', type: 'group', count: undefined },
                  { id: 6, label: '研发（3）组', type: 'group', count: undefined },
                  { id: 7, label: '研发（4）组', type: 'group', count: undefined },
                  { id: 8, label: '研发（5）组', type: 'group', count: undefined },
                  { id: 9, label: '研发（6）组', type: 'group', count: undefined },
                  { id: 10, label: '研发（7）组', type: 'group', count: undefined },
                  { id: 11, label: '研发（8）组', type: 'group', count: undefined }
                ]
              },
              { id: 12, label: '人事部', type: 'department', count: 10 },
              { id: 13, label: '行政部', type: 'department', count: 10 },
              { id: 14, label: '运维部', type: 'department', count: 10 },
              { id: 15, label: '商务部', type: 'department', count: 10 }
            ]
          },
          {
            id: 16,
            label: '深圳分公司',
            type: 'department',
            count: 50,
            children: [
              { id: 17, label: '生产部', type: 'department', count: 10 },
              { id: 18, label: '采购部', type: 'department', count: 10 }
            ]
          }
        ]
      }
    ])

    const dialogTitle = computed(() => {
      if (actionType.value === 'parent') {
        return selectedNode.value ? `在"${selectedNode.value.label}"同级添加主题` : '添加主题'
      } else {
        return selectedNode.value ? `在"${selectedNode.value.label}"下添加子主题` : '添加子主题'
      }
    })

    // 计算节点数量
    const calculateNodeCount = (node) => {
      if (!node.children || node.children.length === 0) {
        return 0
      }
      let count = 0
      node.children.forEach(child => {
        count += 1
        if (child.children) {
          count += calculateNodeCount(child)
        }
      })
      return count
    }

    // 更新所有父节点的计数
    const updateParentCounts = () => {
      const updateCounts = (nodes) => {
        nodes.forEach(node => {
          if (node.children && node.children.length > 0) {
            node.count = calculateNodeCount(node)
            updateCounts(node.children)
          }
        })
      }
      updateCounts(treeData.value)
    }

    // 查找节点的父节点
    const findParentNode = (nodes, targetId, parent = null) => {
      for (let node of nodes) {
        if (node.id === targetId) {
          return parent
        }
        if (node.children) {
          const result = findParentNode(node.children, targetId, node)
          if (result !== null) {
            return result
          }
        }
      }
      return null
    }

    const handleTabClick = (tab) => {
      if (tab.props.name === 'user') {
        router.push('/user-management')
      } else if (tab.props.name === 'position') {
        router.push('/position-management')
      }
    }

    const handleNodeClick = (data, node) => {
      selectedNode.value = data
      console.log('选中节点:', data)
    }

    const handleAddParent = () => {
      if (!selectedNode.value) {
        ElMessage.warning('请先选择一个节点')
        return
      }
      actionType.value = 'parent'
      formData.name = ''
      dialogVisible.value = true
    }

    const handleAddChild = () => {
      if (!selectedNode.value) {
        ElMessage.warning('请先选择一个节点')
        return
      }
      actionType.value = 'child'
      formData.name = ''
      dialogVisible.value = true
    }

    const handleDelete = () => {
      if (!selectedNode.value || selectedNode.value.id === 1) {
        ElMessage.warning('无法删除根节点')
        return
      }

      ElMessageBox.confirm(
        `确定要删除"${selectedNode.value.label}"吗？删除后该节点及其子节点都将被移除。`,
        '确认删除',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(() => {
        deleteNode(treeData.value, selectedNode.value.id)
        updateParentCounts()
        selectedNode.value = null
        ElMessage.success('删除成功')
      }).catch(() => {
        ElMessage.info('已取消删除')
      })
    }

    const deleteNode = (nodes, nodeId) => {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id === nodeId) {
          nodes.splice(i, 1)
          return true
        }
        if (nodes[i].children) {
          if (deleteNode(nodes[i].children, nodeId)) {
            return true
          }
        }
      }
      return false
    }

    const handleDialogClose = () => {
      dialogVisible.value = false
      formData.name = ''
    }

    const handleSubmit = async () => {
      try {
        await formRef.value.validate()
        
        const newNode = {
          id: ++nodeIdCounter,
          label: formData.name,
          type: 'department',
          count: 0,
          children: []
        }

        if (actionType.value === 'parent') {
          // 添加兄弟节点
          const parentNode = findParentNode(treeData.value, selectedNode.value.id)
          if (parentNode && parentNode.children) {
            parentNode.children.push(newNode)
          } else {
            // 如果是根节点的兄弟，添加到根级别
            treeData.value.push(newNode)
          }
        } else {
          // 添加子节点
          if (!selectedNode.value.children) {
            selectedNode.value.children = []
          }
          selectedNode.value.children.push(newNode)
        }

        updateParentCounts()
        handleDialogClose()
        ElMessage.success('添加成功')
      } catch (error) {
        console.log('表单验证失败:', error)
      }
    }

    return {
      activeTab,
      treeRef,
      formRef,
      dialogVisible,
      dialogTitle,
      selectedNode,
      formData,
      formRules,
      treeProps,
      treeData,
      handleTabClick,
      handleNodeClick,
      handleAddParent,
      handleAddChild,
      handleDelete,
      handleDialogClose,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.organization-management {
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

.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.tabs {
  margin-bottom: 20px;
}

.action-area {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

.tree-area {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-height: 600px;
}

.tree-node {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.node-text {
  flex: 1;
}

.node-count {
  color: #409eff;
  font-weight: 500;
}

.dialog-footer {
  text-align: right;
}

/* Element Plus 组件样式覆盖 */
:deep(.el-tabs__item.is-active) {
  color: #4A90E2;
}

:deep(.el-tabs__active-bar) {
  background-color: #4A90E2;
}

:deep(.el-tree-node__content) {
  padding: 8px 0;
  font-size: 14px;
}

:deep(.el-tree-node__content:hover) {
  background-color: #f5f7fa;
}

:deep(.el-tree-node.is-current > .el-tree-node__content) {
  background-color: #e6f3ff;
  color: #409eff;
}

:deep(.el-tree-node__expand-icon) {
  color: #666;
}

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
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .main-content {
    padding: 15px;
  }
  
  .action-area {
    flex-wrap: wrap;
  }
}
</style>