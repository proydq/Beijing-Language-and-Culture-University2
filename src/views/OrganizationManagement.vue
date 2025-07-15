<template>
  <Layout>
    <div class="organization-management">
      <div class="main-container">
        <!-- 左侧组织架构树 -->
        <div class="sidebar">
          <div class="tree-header">
            <h3>组织架构</h3>
            <div class="tree-actions">
              <el-button type="primary" size="small" @click="handleAddParent">同级</el-button>
              <el-button type="success" size="small" @click="handleAddChild">下级</el-button>
            </div>
          </div>
          <div class="tree-container">
            <el-tree
              :data="treeData"
              :props="treeProps"
              node-key="id"
              default-expand-all
              @node-click="handleTreeNodeClick"
              @node-contextmenu="handleNodeRightClick"
            >
              <template #default="{ node, data }">
                <div class="tree-node">
                  <el-icon v-if="data.type === 'company'" class="tree-icon company-icon"><office-building /></el-icon>
                  <el-icon v-else-if="data.type === 'department'" class="tree-icon department-icon"><folder /></el-icon>
                  <el-icon v-else class="tree-icon group-icon"><user /></el-icon>
                  <span class="node-label">{{ node.label }}</span>
                  <span v-if="data.count !== undefined" class="node-count">({{ data.count }})</span>
                </div>
              </template>
            </el-tree>
          </div>
        </div>

        <!-- 右侧内容区域 -->
        <div class="main-content">
          <!-- 操作按钮区域 -->
          <div class="action-area">
            <div class="left-actions">
              <span class="title">组织信息</span>
            </div>
            <div class="right-actions">
              <el-button type="primary" @click="handleEdit">编辑</el-button>
              <el-button type="danger" @click="handleDelete">删除</el-button>
            </div>
          </div>

          <!-- 组织详情 -->
          <div class="detail-area">
            <el-card>
              <template #header>
                <div class="card-header">
                  <span>{{ selectedNode?.label || '请选择组织节点' }}</span>
                </div>
              </template>
              <div v-if="selectedNode" class="org-detail">
                <el-descriptions :column="2" border>
                  <el-descriptions-item label="组织名称">{{ selectedNode.label }}</el-descriptions-item>
                  <el-descriptions-item label="组织类型">
                    <el-tag v-if="selectedNode.type === 'company'" type="primary">公司</el-tag>
                    <el-tag v-else-if="selectedNode.type === 'department'" type="success">部门</el-tag>
                    <el-tag v-else type="warning">小组</el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="人员数量">{{ selectedNode.count || 0 }}人</el-descriptions-item>
                  <el-descriptions-item label="创建时间">{{ selectedNode.createTime || '2024-01-01' }}</el-descriptions-item>
                  <el-descriptions-item label="负责人">{{ selectedNode.manager || '未指定' }}</el-descriptions-item>
                  <el-descriptions-item label="联系方式">{{ selectedNode.contact || '未填写' }}</el-descriptions-item>
                  <el-descriptions-item label="描述" :span="2">{{ selectedNode.description || '暂无描述' }}</el-descriptions-item>
                </el-descriptions>
              </div>
              <div v-else class="empty-state">
                <el-empty description="请从左侧选择一个组织节点查看详情" />
              </div>
            </el-card>
          </div>

          <!-- 子组织列表 -->
          <div v-if="selectedNode?.children?.length" class="children-area">
            <h4>下级组织</h4>
            <div class="children-grid">
              <div 
                v-for="child in selectedNode.children" 
                :key="child.id"
                class="child-card"
                @click="handleChildClick(child)"
              >
                <div class="child-icon">
                  <el-icon v-if="child.type === 'department'" class="department-icon"><folder /></el-icon>
                  <el-icon v-else class="group-icon"><user /></el-icon>
                </div>
                <div class="child-info">
                  <h5>{{ child.label }}</h5>
                  <p>{{ child.count || 0 }}人</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 编辑组织对话框 -->
      <el-dialog
        v-model="dialogVisible"
        :title="dialogTitle"
        width="600px"
        @close="handleDialogClose"
      >
        <el-form
          ref="orgFormRef"
          :model="orgForm"
          :rules="orgFormRules"
          label-width="100px"
        >
          <el-form-item label="组织名称" prop="label">
            <el-input v-model="orgForm.label" placeholder="请输入组织名称" />
          </el-form-item>
          <el-form-item label="组织类型" prop="type">
            <el-select v-model="orgForm.type" placeholder="请选择组织类型">
              <el-option label="公司" value="company" />
              <el-option label="部门" value="department" />
              <el-option label="小组" value="group" />
            </el-select>
          </el-form-item>
          <el-form-item label="负责人" prop="manager">
            <el-input v-model="orgForm.manager" placeholder="请输入负责人姓名" />
          </el-form-item>
          <el-form-item label="联系方式" prop="contact">
            <el-input v-model="orgForm.contact" placeholder="请输入联系方式" />
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input 
              v-model="orgForm.description" 
              type="textarea" 
              :rows="3"
              placeholder="请输入组织描述" 
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handleSubmit">确定</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </Layout>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import Layout from '@/components/Layout.vue'

export default {
  name: 'OrganizationManagement',
  components: {
    Layout
  },
  setup() {
    // 响应式数据
    const dialogVisible = ref(false)
    const editMode = ref(false)
    const actionType = ref('')
    const selectedNode = ref(null)

    // 组织表单
    const orgForm = reactive({
      id: null,
      label: '',
      type: '',
      manager: '',
      contact: '',
      description: ''
    })

    // 表单验证规则
    const orgFormRules = {
      label: [
        { required: true, message: '请输入组织名称', trigger: 'blur' }
      ],
      type: [
        { required: true, message: '请选择组织类型', trigger: 'change' }
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
        manager: '张总',
        contact: '13800138000',
        description: '公司总部',
        createTime: '2020-01-01',
        children: [
          {
            id: 2,
            label: '北京分公司',
            type: 'department',
            count: 50,
            manager: '李经理',
            contact: '13800138001',
            description: '北京分公司',
            createTime: '2021-01-01',
            children: [
              {
                id: 3,
                label: '研发部',
                type: 'department',
                count: 10,
                manager: '王部长',
                contact: '13800138002',
                description: '技术研发部门',
                createTime: '2022-01-01',
                children: [
                  { id: 4, label: '研发（1）组', type: 'group', count: 5, manager: '小李', contact: '13800138003', createTime: '2022-06-01' },
                  { id: 5, label: '研发（2）组', type: 'group', count: 5, manager: '小王', contact: '13800138004', createTime: '2022-06-01' }
                ]
              },
              { id: 12, label: '人事部', type: 'department', count: 10, manager: '陈部长', contact: '13800138005', createTime: '2021-06-01' },
              { id: 13, label: '行政部', type: 'department', count: 10, manager: '赵部长', contact: '13800138006', createTime: '2021-06-01' }
            ]
          },
          {
            id: 16,
            label: '深圳分公司',
            type: 'department',
            count: 50,
            manager: '刘经理',
            contact: '13800138007',
            description: '深圳分公司',
            createTime: '2021-06-01',
            children: [
              { id: 17, label: '生产部', type: 'department', count: 10, manager: '孙部长', contact: '13800138008', createTime: '2022-01-01' },
              { id: 18, label: '采购部', type: 'department', count: 10, manager: '周部长', contact: '13800138009', createTime: '2022-01-01' }
            ]
          }
        ]
      }
    ])

    const dialogTitle = computed(() => {
      if (actionType.value === 'parent') {
        return selectedNode.value ? `在"${selectedNode.value.label}"同级添加组织` : '添加组织'
      } else if (actionType.value === 'child') {
        return selectedNode.value ? `在"${selectedNode.value.label}"下级添加组织` : '添加下级组织'
      } else {
        return editMode.value ? '编辑组织' : '新增组织'
      }
    })

    // 方法
    const handleTreeNodeClick = (data) => {
      selectedNode.value = data
      console.log('选择组织节点:', data)
    }

    const handleNodeRightClick = (event, data) => {
      console.log('右键点击节点:', data)
    }

    const handleAddParent = () => {
      actionType.value = 'parent'
      editMode.value = false
      resetOrgForm()
      dialogVisible.value = true
    }

    const handleAddChild = () => {
      if (!selectedNode.value) {
        ElMessage.warning('请先选择一个组织节点')
        return
      }
      actionType.value = 'child'
      editMode.value = false
      resetOrgForm()
      dialogVisible.value = true
    }

    const handleEdit = () => {
      if (!selectedNode.value) {
        ElMessage.warning('请先选择一个组织节点')
        return
      }
      editMode.value = true
      actionType.value = 'edit'
      Object.assign(orgForm, selectedNode.value)
      dialogVisible.value = true
    }

    const handleDelete = () => {
      if (!selectedNode.value) {
        ElMessage.warning('请先选择一个组织节点')
        return
      }
      ElMessageBox.confirm(`确认删除组织"${selectedNode.value.label}"吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ElMessage.success('删除成功')
        selectedNode.value = null
      })
    }

    const handleChildClick = (child) => {
      selectedNode.value = child
    }

    const handleSubmit = () => {
      console.log('提交组织表单:', orgForm)
      dialogVisible.value = false
      ElMessage.success(editMode.value ? '编辑成功' : '新增成功')
    }

    const handleDialogClose = () => {
      resetOrgForm()
    }

    const resetOrgForm = () => {
      Object.assign(orgForm, {
        id: null,
        label: '',
        type: '',
        manager: '',
        contact: '',
        description: ''
      })
    }

    return {
      dialogVisible,
      editMode,
      actionType,
      selectedNode,
      orgForm,
      orgFormRules,
      treeData,
      treeProps,
      dialogTitle,
      handleTreeNodeClick,
      handleNodeRightClick,
      handleAddParent,
      handleAddChild,
      handleEdit,
      handleDelete,
      handleChildClick,
      handleSubmit,
      handleDialogClose
    }
  }
}
</script>

<style scoped>
.organization-management {
  background-color: #f5f5f5;
  min-height: calc(100vh - 110px);
}

.main-container {
  display: flex;
  height: calc(100vh - 110px);
}

.sidebar {
  width: 300px;
  background: white;
  border-right: 1px solid #e8e8e8;
  padding: 15px;
  flex-shrink: 0;
}

.tree-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e8e8e8;
}

.tree-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.tree-actions {
  display: flex;
  gap: 8px;
}

.tree-container {
  height: calc(100% - 80px);
  overflow-y: auto;
}

.tree-node {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tree-icon {
  font-size: 16px;
}

.company-icon {
  color: #4A90E2;
}

.department-icon {
  color: #67C23A;
}

.group-icon {
  color: #E6A23C;
}

.node-label {
  font-size: 14px;
  color: #333;
}

.node-count {
  font-size: 12px;
  color: #999;
}

.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.action-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.left-actions .title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.right-actions {
  display: flex;
  gap: 10px;
}

.detail-area {
  margin-bottom: 30px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.org-detail {
  padding: 10px 0;
}

.empty-state {
  text-align: center;
  padding: 40px 0;
}

.children-area h4 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
}

.children-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

.child-card {
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 12px;
}

.child-card:hover {
  border-color: #4A90E2;
  box-shadow: 0 2px 8px rgba(74, 144, 226, 0.2);
}

.child-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
}

.child-icon .department-icon {
  color: #67C23A;
  font-size: 20px;
}

.child-icon .group-icon {
  color: #E6A23C;
  font-size: 20px;
}

.child-info h5 {
  margin: 0 0 5px 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.child-info p {
  margin: 0;
  font-size: 12px;
  color: #666;
}

/* Element Plus 组件样式覆盖 */
:deep(.el-tree-node__content) {
  padding: 8px 0;
}

:deep(.el-descriptions-item__label) {
  font-weight: 600;
  color: #333;
}

:deep(.el-card__header) {
  background: #f8f9fa;
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .main-container {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    height: auto;
    border-right: none;
    border-bottom: 1px solid #e8e8e8;
  }
  
  .children-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}
</style>