<template>
  <div class="user-management">
    <!-- 顶部导航栏 -->
    <div class="header">
      <div class="header-left">
        <div class="logo" @click="goToHome" style="cursor: pointer;">
          <el-icon size="24"><home-filled /></el-icon>
        </div>
        <span class="title">用户信息管理</span>
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
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="goToPersonalCenter">个人中心</el-dropdown-item>
              <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <div class="main-container">
      <!-- 左侧组织架构树 -->
      <div class="sidebar">
        <!-- 搜索框 -->
        <div class="search-header">
          <el-input
            v-model="searchKeyword"
            placeholder="请输入部门名称"
            clearable
          >
            <template #append>
              <el-button type="primary">搜索</el-button>
            </template>
          </el-input>
        </div>
        
        <div class="tree-container">
          <el-tree
            :data="treeData"
            :props="treeProps"
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
            @node-click="handleTreeNodeClick"
          >
            <template #default="{ node, data }">
              <div class="tree-node">
                <el-icon v-if="data.type === 'company'" class="tree-icon company-icon">
                  <office-building />
                </el-icon>
                <el-icon v-else-if="data.type === 'department'" class="tree-icon department-icon">
                  <folder />
                </el-icon>
                <el-icon v-else class="tree-icon group-icon">
                  <user />
                </el-icon>
                <span class="node-label">{{ node.label }}</span>
                <span class="node-count" v-if="data.count !== undefined">[{{ data.count }}]</span>
              </div>
            </template>
          </el-tree>
        </div>
      </div>

      <!-- 右侧内容区域 -->
      <div class="main-content">
        <!-- 标签页 -->
        <div class="tabs">
          <el-tabs v-model="activeTab" @tab-click="handleTabClick">
            <el-tab-pane label="用户管理" name="userList">
              <!-- 搜索区域 -->
              <div class="search-area">
                <el-form :model="searchForm" :inline="true" class="search-form">
                  <el-form-item label="人员姓名:">
                    <el-input v-model="searchForm.realName" placeholder="请输入搜索信息" clearable />
                  </el-form-item>
                  <el-form-item label="手机号:">
                    <el-input v-model="searchForm.phone" placeholder="请输入搜索信息" clearable />
                  </el-form-item>
                  <el-form-item label="工号:">
                    <el-input v-model="searchForm.jobNumber" placeholder="请输入搜索信息" clearable />
                  </el-form-item>
                  <el-form-item label="账号状态:">
                    <el-select v-model="searchForm.status" placeholder="全部" clearable style="width: 120px;">
                      <el-option label="全部" value="" />
                      <el-option label="正常" value="1" />
                      <el-option label="禁用" value="0" />
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="handleSearch">搜索</el-button>
                    <el-button @click="handleReset">重置</el-button>
                  </el-form-item>
                </el-form>
              </div>

              <!-- 用户列表标题和操作按钮 -->
              <div class="list-header">
                <h3>用户列表</h3>
                <div class="header-actions">
                  <el-button type="primary" @click="handleSync">手动同步</el-button>
                  <el-button type="primary" @click="handleImport">导入</el-button>
                  <el-button type="success" @click="handleAdd">新增</el-button>
                  <el-button type="warning" @click="handleExport">导出</el-button>
                </div>
              </div>

              <!-- 用户表格 -->
              <div class="table-container">
                <el-table :data="tableData" style="width: 100%">
                  <el-table-column type="selection" width="55" />
                  <el-table-column prop="realName" label="人员姓名" />
                  <el-table-column prop="gender" label="性别" width="80" />
                  <el-table-column prop="phone" label="手机号" />
                  <el-table-column prop="jobNumber" label="工号" />
                  <el-table-column prop="department" label="所属部门" />
                  <el-table-column prop="position" label="职务" />
                  <el-table-column prop="jobTitle" label="职称" />
                  <el-table-column label="账号状态" width="100">
                    <template #default="{ row }">
                      <el-tag :type="row.status === '正常' ? 'success' : 'danger'">
                        {{ row.status }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="createTime" label="创建时间" />
                  <el-table-column label="操作" width="200">
                    <template #default="{ row }">
                      <el-button type="text" size="small" @click="handleView(row)">查看</el-button>
                      <el-button type="text" size="small" @click="handleEdit(row)">编辑</el-button>
                      <el-button type="text" size="small" @click="handleDelete(row)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>

              <!-- 分页 -->
              <div class="pagination-container">
                <el-pagination
                  v-model:current-page="currentPage"
                  v-model:page-size="pageSize"
                  :page-sizes="[10, 20, 50, 100]"
                  :total="total"
                  layout="total, sizes, prev, pager, next, jumper"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                />
              </div>
            </el-tab-pane>

            <el-tab-pane label="组织架构管理" name="organizationManagement">
              <!-- 搜索框 -->
              <div class="search-header">
                <el-input
                  v-model="orgSearchKeyword"
                  placeholder="请输入组织名称"
                  clearable
                >
                  <template #append>
                    <el-button type="primary" @click="handleOrgSearch">搜索</el-button>
                  </template>
                </el-input>
              </div>

              <!-- 操作按钮区域 -->
              <div class="org-action-area">
                <el-button type="primary" @click="handleAddOrgParent" :disabled="!selectedOrgNode">同级</el-button>
                <el-button type="success" @click="handleAddOrgChild" :disabled="!selectedOrgNode">下级</el-button>
                <el-button type="danger" @click="handleDeleteOrg" :disabled="!selectedOrgNode || selectedOrgNode.id === 1">删除</el-button>
              </div>

              <!-- 组织架构树 -->
              <div class="org-tree-container">
                <el-tree
                  ref="orgTreeRef"
                  :data="orgTreeData"
                  :props="orgTreeProps"
                  node-key="id"
                  default-expand-all
                  highlight-current
                  :expand-on-click-node="false"
                  @node-click="handleOrgTreeNodeClick"
                >
                  <template #default="{ node, data }">
                    <div class="tree-node">
                      <el-icon v-if="data.type === 'company'" class="tree-icon company-icon">
                        <office-building />
                      </el-icon>
                      <el-icon v-else-if="data.type === 'department'" class="tree-icon department-icon">
                        <folder />
                      </el-icon>
                      <el-icon v-else class="tree-icon group-icon">
                        <user />
                      </el-icon>
                      <span class="node-label">{{ node.label }}</span>
                      <span class="node-count" v-if="data.count !== undefined">[{{ data.count }}]</span>
                    </div>
                  </template>
                </el-tree>
              </div>

              <!-- 组织详情编辑区域 -->
              <div class="org-detail-area" v-if="selectedOrgNode">
                <div class="detail-header">
                  <h3>{{ selectedOrgNode.label }} - 组织信息</h3>
                  <div class="detail-actions">
                    <el-button v-if="!orgEditMode" type="primary" @click="handleEditOrg">编辑</el-button>
                    <template v-else>
                      <el-button @click="handleCancelOrgEdit">取消</el-button>
                      <el-button type="primary" @click="handleSaveOrg">保存</el-button>
                    </template>
                  </div>
                </div>

                <el-form
                  ref="orgFormRef"
                  :model="orgFormData"
                  :rules="orgFormRules"
                  label-width="120px"
                  class="org-form"
                >
                  <el-row :gutter="24">
                    <el-col :span="12">
                      <el-form-item label="组织名称:" prop="name">
                        <el-input v-model="orgFormData.name" :disabled="!orgEditMode" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="组织编码:" prop="code">
                        <el-input v-model="orgFormData.code" :disabled="!orgEditMode" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="24">
                    <el-col :span="12">
                      <el-form-item label="负责人:" prop="leader">
                        <el-input v-model="orgFormData.leader" :disabled="!orgEditMode" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="联系电话:" prop="phone">
                        <el-input v-model="orgFormData.phone" :disabled="!orgEditMode" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="24">
                    <el-col :span="24">
                      <el-form-item label="组织描述:" prop="description">
                        <el-input
                          v-model="orgFormData.description"
                          type="textarea"
                          :rows="4"
                          :disabled="!orgEditMode"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </div>

              <!-- 组织成员列表 -->
              <div class="org-members-area" v-if="selectedOrgNode">
                <div class="members-header">
                  <h3>组织成员</h3>
                  <el-button type="success" size="small" @click="handleAddOrgMember">添加成员</el-button>
                </div>

                <el-table :data="orgMembersData" class="members-table">
                  <el-table-column prop="realName" label="姓名" />
                  <el-table-column prop="jobNumber" label="工号" />
                  <el-table-column prop="position" label="职务" />
                  <el-table-column prop="phone" label="联系电话" />
                  <el-table-column label="操作" width="120">
                    <template #default="{ row }">
                      <el-button type="text" size="small" @click="handleRemoveOrgMember(row)">移除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-tab-pane>

            <el-tab-pane label="职务管理" name="positionManagement">
              <!-- 搜索区域 -->
              <div class="position-search-area">
                <el-input
                  v-model="positionSearchKeyword"
                  placeholder="请输入职务名称"
                  clearable
                  style="width: 300px;"
                >
                  <template #append>
                    <el-button type="primary" @click="handlePositionSearch">搜索</el-button>
                  </template>
                </el-input>
                <el-button type="success" @click="handleAddPosition" style="margin-left: 15px;">新增职务</el-button>
              </div>

              <!-- 职务表格 -->
              <div class="position-table-container">
                <el-table :data="positionTableData" style="width: 100%">
                  <el-table-column prop="name" label="职务名称" width="200" />
                  <el-table-column prop="description" label="职务描述" />
                  <el-table-column label="操作" width="150">
                    <template #default="{ row }">
                      <el-button type="text" size="small" @click="handleEditPosition(row)">编辑</el-button>
                      <el-button type="text" size="small" @click="handleDeletePosition(row)" style="color: #f56c6c;">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>

              <!-- 分页 -->
              <div class="position-pagination-container">
                <el-pagination
                  v-model:current-page="positionCurrentPage"
                  v-model:page-size="positionPageSize"
                  :page-sizes="[10, 20, 50, 100]"
                  :total="positionTotal"
                  layout="total, sizes, prev, pager, next, jumper"
                  @size-change="handlePositionSizeChange"
                  @current-change="handlePositionCurrentChange"
                />
              </div>
            </el-tab-pane>

            <el-tab-pane label="职称管理" name="titleManagement">
              <!-- 搜索区域 -->
              <div class="title-search-area">
                <el-input
                  v-model="titleSearchKeyword"
                  placeholder="请输入职称名称"
                  clearable
                  style="width: 300px;"
                >
                  <template #append>
                    <el-button type="primary" @click="handleTitleSearch">搜索</el-button>
                  </template>
                </el-input>
                <el-button type="success" @click="handleAddTitle" style="margin-left: 15px;">新增职称</el-button>
              </div>

              <!-- 职称表格 -->
              <div class="title-table-container">
                <el-table :data="titleTableData" style="width: 100%">
                  <el-table-column prop="name" label="职称名称" width="200" />
                  <el-table-column prop="description" label="职称描述" />
                  <el-table-column label="操作" width="150">
                    <template #default="{ row }">
                      <el-button type="text" size="small" @click="handleEditTitle(row)">编辑</el-button>
                      <el-button type="text" size="small" @click="handleDeleteTitle(row)" style="color: #f56c6c;">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>

              <!-- 分页 -->
              <div class="title-pagination-container">
                <el-pagination
                  v-model:current-page="titleCurrentPage"
                  v-model:page-size="titlePageSize"
                  :page-sizes="[10, 20, 50, 100]"
                  :total="titleTotal"
                  layout="total, sizes, prev, pager, next, jumper"
                  @size-change="handleTitleSizeChange"
                  @current-change="handleTitleCurrentChange"
                />
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>

    <!-- 用户详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="用户详情" width="50%">
      <div v-if="currentUser" class="user-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="姓名">{{ currentUser.realName }}</el-descriptions-item>
          <el-descriptions-item label="性别">{{ currentUser.gender }}</el-descriptions-item>
          <el-descriptions-item label="手机号">{{ currentUser.phone }}</el-descriptions-item>
          <el-descriptions-item label="工号">{{ currentUser.jobNumber }}</el-descriptions-item>
          <el-descriptions-item label="所属部门">{{ currentUser.department }}</el-descriptions-item>
          <el-descriptions-item label="职务">{{ currentUser.position }}</el-descriptions-item>
          <el-descriptions-item label="职称">{{ currentUser.jobTitle }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ currentUser.createTime }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>

    <!-- 编辑/新增用户对话框 -->
    <el-dialog v-model="editDialogVisible" :title="isEdit ? '编辑用户' : '新增用户'" width="60%">
      <el-form :model="editForm" :rules="editRules" ref="editFormRef" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="姓名" prop="realName">
              <el-input v-model="editForm.realName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <el-select v-model="editForm.gender" style="width: 100%">
                <el-option label="男" value="男" />
                <el-option label="女" value="女" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="editForm.phone" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工号" prop="jobNumber">
              <el-input v-model="editForm.jobNumber" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所属部门" prop="department">
              <el-input v-model="editForm.department" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职务" prop="position">
              <el-input v-model="editForm.position" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="职称" prop="jobTitle">
              <el-input v-model="editForm.jobTitle" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="账号状态" prop="status">
              <el-select v-model="editForm.status" style="width: 100%">
                <el-option label="正常" value="正常" />
                <el-option label="禁用" value="禁用" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSaveUser">保存</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 添加组织弹窗 -->
    <el-dialog
      v-model="orgDialogVisible"
      :title="orgDialogMode === 'add' ? '新增组织' : '编辑组织'"
      width="500px"
      @close="handleOrgDialogClose"
    >
      <el-form
        ref="orgDialogFormRef"
        :model="orgDialogFormData"
        :rules="orgDialogFormRules"
        label-width="100px"
      >
        <el-form-item label="组织名称:" prop="name">
          <el-input v-model="orgDialogFormData.name" placeholder="请输入组织名称" />
        </el-form-item>
        <el-form-item label="组织编码:" prop="code">
          <el-input v-model="orgDialogFormData.code" placeholder="请输入组织编码" />
        </el-form-item>
        <el-form-item label="负责人:" prop="leader">
          <el-input v-model="orgDialogFormData.leader" placeholder="请输入负责人" />
        </el-form-item>
        <el-form-item label="联系电话:" prop="phone">
          <el-input v-model="orgDialogFormData.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="组织描述:" prop="description">
          <el-input
            v-model="orgDialogFormData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入组织描述"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleOrgDialogClose">取消</el-button>
          <el-button type="primary" @click="handleOrgDialogSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 职务编辑/新增弹窗 -->
    <el-dialog
      v-model="positionDialogVisible"
      :title="positionDialogMode === 'add' ? '新增职务' : '编辑职务'"
      width="500px"
      @close="handlePositionDialogClose"
    >
      <el-form
        ref="positionFormRef"
        :model="positionFormData"
        :rules="positionFormRules"
        label-width="100px"
      >
        <el-form-item label="职务名称:" prop="name">
          <el-input v-model="positionFormData.name" placeholder="请输入职务名称" />
        </el-form-item>
        <el-form-item label="职务描述:" prop="description">
          <el-input
            v-model="positionFormData.description"
            type="textarea"
            :rows="4"
            placeholder="请输入职务描述"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handlePositionDialogClose">取消</el-button>
          <el-button type="primary" @click="handlePositionSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 职称编辑/新增弹窗 -->
    <el-dialog
      v-model="titleDialogVisible"
      :title="titleDialogMode === 'add' ? '新增职称' : '编辑职称'"
      width="500px"
      @close="handleTitleDialogClose"
    >
      <el-form
        ref="titleFormRef"
        :model="titleFormData"
        :rules="titleFormRules"
        label-width="100px"
      >
        <el-form-item label="职称名称:" prop="name">
          <el-input v-model="titleFormData.name" placeholder="请输入职称名称" />
        </el-form-item>
        <el-form-item label="职称描述:" prop="description">
          <el-input
            v-model="titleFormData.description"
            type="textarea"
            :rows="4"
            placeholder="请输入职称描述"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleTitleDialogClose">取消</el-button>
          <el-button type="primary" @click="handleTitleSubmit">确定</el-button>
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
  name: 'UserManagement',
  setup() {
    const router = useRouter()
    
    // 基础数据
    const activeTab = ref('userList')
    const searchKeyword = ref('')
    const currentUser = ref(null)
    const detailDialogVisible = ref(false)
    const editDialogVisible = ref(false)
    const isEdit = ref(false)
    const editFormRef = ref()
    
    // 分页数据
    const currentPage = ref(1)
    const pageSize = ref(10)
    const total = ref(100)
    
    // 组织架构管理相关 ref
    const orgTreeRef = ref()
    const orgFormRef = ref()
    const orgDialogFormRef = ref()
    const orgSearchKeyword = ref('')
    const selectedOrgNode = ref(null)
    const orgEditMode = ref(false)
    const orgDialogVisible = ref(false)
    const orgDialogMode = ref('add') // 'add' or 'edit'
    const orgActionType = ref('')

    // 职务管理相关 ref
    const positionFormRef = ref()
    const positionSearchKeyword = ref('')
    const positionDialogVisible = ref(false)
    const positionDialogMode = ref('add') // 'add' or 'edit'
    const positionCurrentPage = ref(1)
    const positionPageSize = ref(10)
    const positionTotal = ref(50)

    // 职称管理相关 ref
    const titleFormRef = ref()
    const titleSearchKeyword = ref('')
    const titleDialogVisible = ref(false)
    const titleDialogMode = ref('add') // 'add' or 'edit'
    const titleCurrentPage = ref(1)
    const titlePageSize = ref(10)
    const titleTotal = ref(30)

    // 左侧树形数据
    const treeData = ref([
      {
        id: 1,
        label: '总公司',
        type: 'company',
        count: 156,
        children: [
          {
            id: 2,
            label: '技术部',
            type: 'department',
            count: 45,
            children: [
              {
                id: 3,
                label: '前端组',
                type: 'group',
                count: 12
              },
              {
                id: 4,
                label: '后端组',
                type: 'group',
                count: 15
              }
            ]
          },
          {
            id: 5,
            label: '行政部',
            type: 'department',
            count: 25
          }
        ]
      }
    ])

    const treeProps = {
      children: 'children',
      label: 'label'
    }

    // 组织架构树数据
    const orgTreeData = ref([
      {
        id: 1,
        label: '总公司',
        type: 'company',
        count: 156,
        children: [
          {
            id: 2,
            label: '技术部',
            type: 'department',
            count: 45,
            children: [
              {
                id: 3,
                label: '前端组',
                type: 'group',
                count: 12
              },
              {
                id: 4,
                label: '后端组',
                type: 'group',
                count: 15
              }
            ]
          },
          {
            id: 5,
            label: '行政部',
            type: 'department',
            count: 25,
            children: [
              {
                id: 6,
                label: '人事组',
                type: 'group',
                count: 8
              },
              {
                id: 7,
                label: '财务组',
                type: 'group',
                count: 6
              }
            ]
          },
          {
            id: 8,
            label: '市场部',
            type: 'department',
            count: 30
          }
        ]
      }
    ])

    const orgTreeProps = {
      children: 'children',
      label: 'label'
    }

    // 职务表格数据
    const positionTableData = ref([
      {
        id: 1,
        name: '总经理',
        description: '负责公司整体战略规划和日常经营管理'
      },
      {
        id: 2,
        name: '技术总监',
        description: '负责公司技术架构设计和技术团队管理'
      },
      {
        id: 3,
        name: '项目经理',
        description: '负责项目的规划、执行和交付'
      },
      {
        id: 4,
        name: '产品经理',
        description: '负责产品规划、设计和市场推广'
      },
      {
        id: 5,
        name: '前端工程师',
        description: '负责前端页面开发和用户交互实现'
      },
      {
        id: 6,
        name: '后端工程师',
        description: '负责后端系统开发和数据库设计'
      },
      {
        id: 7,
        name: '测试工程师',
        description: '负责软件测试和质量保证'
      },
      {
        id: 8,
        name: '运维工程师',
        description: '负责系统运维和基础设施管理'
      }
    ])

    // 职称表格数据
    const titleTableData = ref([
      {
        id: 1,
        name: '高级工程师',
        description: '具有丰富的技术经验和独立解决复杂问题的能力'
      },
      {
        id: 2,
        name: '中级工程师',
        description: '具有一定的技术经验和解决常规问题的能力'
      },
      {
        id: 3,
        name: '初级工程师',
        description: '刚入职的工程师，需要指导和培训'
      },
      {
        id: 4,
        name: '资深专家',
        description: '在某个领域具有深厚的专业知识和经验'
      },
      {
        id: 5,
        name: '技术专家',
        description: '在技术方面具有专业能力的人员'
      },
      {
        id: 6,
        name: '业务专家',
        description: '在业务方面具有专业能力的人员'
      }
    ])

    // 搜索表单
    const searchForm = reactive({
      realName: '',
      phone: '',
      jobNumber: '',
      status: ''
    })

    // 编辑表单
    const editForm = reactive({
      realName: '',
      gender: '',
      phone: '',
      jobNumber: '',
      department: '',
      position: '',
      jobTitle: '',
      status: '正常'
    })

    // 组织表单数据
    const orgFormData = reactive({
      name: '',
      code: '',
      leader: '',
      phone: '',
      description: ''
    })

    // 组织弹窗表单数据
    const orgDialogFormData = reactive({
      name: '',
      code: '',
      leader: '',
      phone: '',
      description: ''
    })

    // 职务表单数据
    const positionFormData = reactive({
      name: '',
      description: ''
    })

    // 职称表单数据
    const titleFormData = reactive({
      name: '',
      description: ''
    })

    // 组织成员数据
    const orgMembersData = ref([
      {
        id: 1,
        realName: '张三',
        jobNumber: 'JS001',
        position: '前端开发工程师',
        phone: '13800138001'
      },
      {
        id: 2,
        realName: '李四',
        jobNumber: 'JS002',
        position: '后端开发工程师',
        phone: '13800138002'
      }
    ])

    // 表格数据
    const tableData = ref([
      {
        id: 1,
        realName: '张三',
        gender: '男',
        phone: '13800138001',
        jobNumber: 'JS001',
        department: '技术部',
        position: '前端工程师',
        jobTitle: '高级工程师',
        status: '正常',
        createTime: '2023-01-15 10:30:00'
      },
      {
        id: 2,
        realName: '李四',
        gender: '女',
        phone: '13800138002',
        jobNumber: 'JS002',
        department: '行政部',
        position: '人事专员',
        jobTitle: '中级专员',
        status: '正常',
        createTime: '2023-02-20 14:20:00'
      },
      {
        id: 3,
        realName: '王五',
        gender: '男',
        phone: '13800138003',
        jobNumber: 'JS003',
        department: '技术部',
        position: '后端工程师',
        jobTitle: '高级工程师',
        status: '禁用',
        createTime: '2023-03-10 09:15:00'
      }
    ])

    // 表单验证规则
    const editRules = {
      realName: [
        { required: true, message: '请输入姓名', trigger: 'blur' }
      ],
      phone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
      ],
      jobNumber: [
        { required: true, message: '请输入工号', trigger: 'blur' }
      ]
    }

    // 组织表单验证规则
    const orgFormRules = {
      name: [
        { required: true, message: '请输入组织名称', trigger: 'blur' }
      ],
      code: [
        { required: true, message: '请输入组织编码', trigger: 'blur' }
      ]
    }

    const orgDialogFormRules = {
      name: [
        { required: true, message: '请输入组织名称', trigger: 'blur' }
      ],
      code: [
        { required: true, message: '请输入组织编码', trigger: 'blur' }
      ]
    }

    // 职务职称表单验证规则
    const positionFormRules = {
      name: [
        { required: true, message: '请输入职务名称', trigger: 'blur' },
        { min: 2, max: 20, message: '职务名称长度在 2 到 20 个字符', trigger: 'blur' }
      ],
      description: [
        { required: true, message: '请输入职务描述', trigger: 'blur' },
        { min: 5, max: 200, message: '职务描述长度在 5 到 200 个字符', trigger: 'blur' }
      ]
    }

    const titleFormRules = {
      name: [
        { required: true, message: '请输入职称名称', trigger: 'blur' },
        { min: 2, max: 20, message: '职称名称长度在 2 到 20 个字符', trigger: 'blur' }
      ],
      description: [
        { required: true, message: '请输入职称描述', trigger: 'blur' },
        { min: 5, max: 200, message: '职称描述长度在 5 到 200 个字符', trigger: 'blur' }
      ]
    }

    // 基础方法
    const goToHome = () => {
      router.push('/dashboard')
    }

    const goToPersonalCenter = () => {
      router.push('/personal-center')
    }

    const logout = () => {
      console.log('退出登录')
    }

    const handleTreeNodeClick = (data) => {
      console.log('选择部门:', data)
      // 根据选择的部门过滤用户数据
    }

    const handleTabClick = (tab) => {
      console.log('切换标签页:', tab.name)
    }

    // 用户管理方法
    const handleSearch = () => {
      console.log('搜索用户:', searchForm)
    }

    const handleReset = () => {
      Object.assign(searchForm, {
        realName: '',
        phone: '',
        jobNumber: '',
        status: ''
      })
    }

    const handleSync = () => {
      ElMessage.success('同步成功')
    }

    const handleImport = () => {
      console.log('导入用户')
    }

    const handleAdd = () => {
      isEdit.value = false
      Object.assign(editForm, {
        realName: '',
        gender: '',
        phone: '',
        jobNumber: '',
        department: '',
        position: '',
        jobTitle: '',
        status: '正常'
      })
      editDialogVisible.value = true
    }

    const handleExport = () => {
      console.log('导出用户')
    }

    const handleView = (row) => {
      currentUser.value = row
      detailDialogVisible.value = true
    }

    const handleEdit = (row) => {
      isEdit.value = true
      Object.assign(editForm, row)
      editDialogVisible.value = true
    }

    const handleDelete = (row) => {
      ElMessageBox.confirm(`确定要删除用户"${row.realName}"吗？`, '确认删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ElMessage.success('删除成功')
      })
    }

    const handleSaveUser = async () => {
      try {
        await editFormRef.value.validate()
        ElMessage.success(isEdit.value ? '编辑成功' : '新增成功')
        editDialogVisible.value = false
      } catch (error) {
        console.log('表单验证失败:', error)
      }
    }

    const handleSizeChange = (size) => {
      pageSize.value = size
    }

    const handleCurrentChange = (page) => {
      currentPage.value = page
    }

    // 组织架构管理方法
    const handleOrgSearch = () => {
      console.log('搜索组织:', orgSearchKeyword.value)
      // 这里可以实现搜索逻辑
    }

    const handleOrgTreeNodeClick = (data) => {
      selectedOrgNode.value = data
      orgEditMode.value = false
      
      // 加载组织详情数据
      Object.assign(orgFormData, {
        name: data.label,
        code: data.code || `ORG${data.id.toString().padStart(3, '0')}`,
        leader: data.leader || '张三',
        phone: data.phone || '13800138001',
        description: data.description || '这是一个组织描述'
      })
      
      // 加载组织成员数据（这里用模拟数据）
      orgMembersData.value = [
        {
          id: 1,
          realName: '张三',
          jobNumber: 'JS001',
          position: '前端开发工程师',
          phone: '13800138001'
        },
        {
          id: 2,
          realName: '李四',
          jobNumber: 'JS002',
          position: '后端开发工程师',
          phone: '13800138002'
        }
      ]
    }

    const handleAddOrgParent = () => {
      orgActionType.value = 'parent'
      orgDialogMode.value = 'add'
      resetOrgDialogForm()
      orgDialogVisible.value = true
    }

    const handleAddOrgChild = () => {
      orgActionType.value = 'child'
      orgDialogMode.value = 'add'
      resetOrgDialogForm()
      orgDialogVisible.value = true
    }

    const handleDeleteOrg = () => {
      if (!selectedOrgNode.value) return
      
      ElMessageBox.confirm(`确定要删除组织"${selectedOrgNode.value.label}"吗？`, '确认删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ElMessage.success('删除成功')
        // 这里实现删除逻辑
      })
    }

    const handleEditOrg = () => {
      orgEditMode.value = true
    }

    const handleCancelOrgEdit = () => {
      orgEditMode.value = false
      // 重置表单数据
      if (selectedOrgNode.value) {
        handleOrgTreeNodeClick(selectedOrgNode.value)
      }
    }

    const handleSaveOrg = async () => {
      try {
        await orgFormRef.value.validate()
        orgEditMode.value = false
        ElMessage.success('保存成功')
        // 这里实现保存逻辑
      } catch (error) {
        console.log('表单验证失败:', error)
      }
    }

    const handleAddOrgMember = () => {
      console.log('添加组织成员')
      // 这里可以打开添加成员的弹窗
    }

    const handleRemoveOrgMember = (row) => {
      ElMessageBox.confirm(`确定要移除成员"${row.realName}"吗？`, '确认移除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = orgMembersData.value.findIndex(item => item.id === row.id)
        if (index !== -1) {
          orgMembersData.value.splice(index, 1)
        }
        ElMessage.success('移除成功')
      })
    }

    const handleOrgDialogClose = () => {
      orgDialogVisible.value = false
      resetOrgDialogForm()
    }

    const handleOrgDialogSubmit = async () => {
      try {
        await orgDialogFormRef.value.validate()
        ElMessage.success(orgDialogMode.value === 'add' ? '添加成功' : '编辑成功')
        orgDialogVisible.value = false
        resetOrgDialogForm()
        // 这里实现提交逻辑
      } catch (error) {
        console.log('表单验证失败:', error)
      }
    }

    const resetOrgDialogForm = () => {
      Object.assign(orgDialogFormData, {
        name: '',
        code: '',
        leader: '',
        phone: '',
        description: ''
      })
    }

    // 职务管理方法
    const handlePositionSearch = () => {
      console.log('搜索职务:', positionSearchKeyword.value)
      // 这里可以实现搜索逻辑
      if (positionSearchKeyword.value) {
        // 模拟搜索结果
        const filteredData = positionTableData.value.filter(item => 
          item.name.includes(positionSearchKeyword.value)
        )
        positionTableData.value = filteredData
        positionTotal.value = filteredData.length
      } else {
        // 重置为原始数据
        loadPositionData()
      }
    }

    const handleAddPosition = () => {
      positionDialogMode.value = 'add'
      resetPositionForm()
      positionDialogVisible.value = true
    }

    const handleEditPosition = (row) => {
      positionDialogMode.value = 'edit'
      Object.assign(positionFormData, { ...row })
      positionDialogVisible.value = true
    }

    const handleDeletePosition = (row) => {
      ElMessageBox.confirm(`确定要删除职务"${row.name}"吗？`, '确认删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = positionTableData.value.findIndex(item => item.id === row.id)
        if (index !== -1) {
          positionTableData.value.splice(index, 1)
          positionTotal.value -= 1
        }
        ElMessage.success('删除成功')
      }).catch(() => {
        ElMessage.info('已取消删除')
      })
    }

    const handlePositionSizeChange = (size) => {
      positionPageSize.value = size
      positionCurrentPage.value = 1
      loadPositionData()
    }

    const handlePositionCurrentChange = (page) => {
      positionCurrentPage.value = page
      loadPositionData()
    }

    const handlePositionDialogClose = () => {
      positionDialogVisible.value = false
      resetPositionForm()
    }

    const handlePositionSubmit = async () => {
      try {
        await positionFormRef.value.validate()
        
        if (positionDialogMode.value === 'add') {
          // 新增逻辑
          const newPosition = {
            id: Date.now(),
            ...positionFormData
          }
          positionTableData.value.unshift(newPosition)
          positionTotal.value += 1
          ElMessage.success('新增职务成功')
        } else {
          // 编辑逻辑
          const index = positionTableData.value.findIndex(item => item.id === positionFormData.id)
          if (index !== -1) {
            Object.assign(positionTableData.value[index], positionFormData)
          }
          ElMessage.success('编辑职务成功')
        }
        
        positionDialogVisible.value = false
        resetPositionForm()
      } catch (error) {
        console.log('表单验证失败:', error)
      }
    }

    const resetPositionForm = () => {
      Object.assign(positionFormData, {
        name: '',
        description: ''
      })
    }

    const loadPositionData = () => {
      // 这里可以调用API加载数据
      console.log('加载职务数据，当前页:', positionCurrentPage.value, '每页大小:', positionPageSize.value)
    }

    // 职称管理方法
    const handleTitleSearch = () => {
      console.log('搜索职称:', titleSearchKeyword.value)
      // 这里可以实现搜索逻辑
      if (titleSearchKeyword.value) {
        // 模拟搜索结果
        const filteredData = titleTableData.value.filter(item => 
          item.name.includes(titleSearchKeyword.value)
        )
        titleTableData.value = filteredData
        titleTotal.value = filteredData.length
      } else {
        // 重置为原始数据
        loadTitleData()
      }
    }

    const handleAddTitle = () => {
      titleDialogMode.value = 'add'
      resetTitleForm()
      titleDialogVisible.value = true
    }

    const handleEditTitle = (row) => {
      titleDialogMode.value = 'edit'
      Object.assign(titleFormData, { ...row })
      titleDialogVisible.value = true
    }

    const handleDeleteTitle = (row) => {
      ElMessageBox.confirm(`确定要删除职称"${row.name}"吗？`, '确认删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = titleTableData.value.findIndex(item => item.id === row.id)
        if (index !== -1) {
          titleTableData.value.splice(index, 1)
          titleTotal.value -= 1
        }
        ElMessage.success('删除成功')
      }).catch(() => {
        ElMessage.info('已取消删除')
      })
    }

    const handleTitleSizeChange = (size) => {
      titlePageSize.value = size
      titleCurrentPage.value = 1
      loadTitleData()
    }

    const handleTitleCurrentChange = (page) => {
      titleCurrentPage.value = page
      loadTitleData()
    }

    const handleTitleDialogClose = () => {
      titleDialogVisible.value = false
      resetTitleForm()
    }

    const handleTitleSubmit = async () => {
      try {
        await titleFormRef.value.validate()
        
        if (titleDialogMode.value === 'add') {
          // 新增逻辑
          const newTitle = {
            id: Date.now(),
            ...titleFormData
          }
          titleTableData.value.unshift(newTitle)
          titleTotal.value += 1
          ElMessage.success('新增职称成功')
        } else {
          // 编辑逻辑
          const index = titleTableData.value.findIndex(item => item.id === titleFormData.id)
          if (index !== -1) {
            Object.assign(titleTableData.value[index], titleFormData)
          }
          ElMessage.success('编辑职称成功')
        }
        
        titleDialogVisible.value = false
        resetTitleForm()
      } catch (error) {
        console.log('表单验证失败:', error)
      }
    }

    const resetTitleForm = () => {
      Object.assign(titleFormData, {
        name: '',
        description: ''
      })
    }

    const loadTitleData = () => {
      // 这里可以调用API加载数据
      console.log('加载职称数据，当前页:', titleCurrentPage.value, '每页大小:', titlePageSize.value)
    }

    return {
      // 基础数据
      activeTab,
      searchKeyword,
      currentUser,
      detailDialogVisible,
      editDialogVisible,
      isEdit,
      editFormRef,
      currentPage,
      pageSize,
      total,
      
      // 树形数据
      treeData,
      treeProps,
      
      // 表单数据
      searchForm,
      editForm,
      editRules,
      
      // 表格数据
      tableData,
      
      // 组织架构管理相关
      orgTreeRef,
      orgFormRef,
      orgDialogFormRef,
      orgSearchKeyword,
      selectedOrgNode,
      orgEditMode,
      orgDialogVisible,
      orgDialogMode,
      orgTreeData,
      orgTreeProps,
      orgFormData,
      orgDialogFormData,
      orgMembersData,
      orgFormRules,
      orgDialogFormRules,
      
      // 职务管理相关
      positionFormRef,
      positionSearchKeyword,
      positionDialogVisible,
      positionDialogMode,
      positionCurrentPage,
      positionPageSize,
      positionTotal,
      positionTableData,
      positionFormData,
      positionFormRules,
      
      // 职称管理相关
      titleFormRef,
      titleSearchKeyword,
      titleDialogVisible,
      titleDialogMode,
      titleCurrentPage,
      titlePageSize,
      titleTotal,
      titleTableData,
      titleFormData,
      titleFormRules,
      
      // 基础方法
      goToHome,
      goToPersonalCenter,
      logout,
      handleTreeNodeClick,
      handleTabClick,
      
      // 用户管理方法
      handleSearch,
      handleReset,
      handleSync,
      handleImport,
      handleAdd,
      handleExport,
      handleView,
      handleEdit,
      handleDelete,
      handleSaveUser,
      handleSizeChange,
      handleCurrentChange,
      
      // 组织架构管理方法
      handleOrgSearch,
      handleOrgTreeNodeClick,
      handleAddOrgParent,
      handleAddOrgChild,
      handleDeleteOrg,
      handleEditOrg,
      handleCancelOrgEdit,
      handleSaveOrg,
      handleAddOrgMember,
      handleRemoveOrgMember,
      handleOrgDialogClose,
      handleOrgDialogSubmit,
      
      // 职务管理方法
      handlePositionSearch,
      handleAddPosition,
      handleEditPosition,
      handleDeletePosition,
      handlePositionSizeChange,
      handlePositionCurrentChange,
      handlePositionDialogClose,
      handlePositionSubmit,
      
      // 职称管理方法
      handleTitleSearch,
      handleAddTitle,
      handleEditTitle,
      handleDeleteTitle,
      handleTitleSizeChange,
      handleTitleCurrentChange,
      handleTitleDialogClose,
      handleTitleSubmit
    }
  }
}
</script>

<style scoped>
.user-management {
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
  transition: transform 0.2s;
}

.logo:hover {
  transform: scale(1.05);
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
  width: 280px;
  background: white;
  border-right: 1px solid #e8e8e8;
  padding: 20px;
  flex-shrink: 0;
  overflow-y: auto;
}

.search-header {
  margin-bottom: 20px;
}

.tree-container {
  min-height: 500px;
}

.tree-node {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.tree-icon {
  flex-shrink: 0;
}

.company-icon {
  color: #4A90E2;
}

.department-icon {
  color: #F39C12;
}

.group-icon {
  color: #27AE60;
}

.node-label {
  flex: 1;
  font-size: 14px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.node-count {
  color: #999;
  font-size: 12px;
  flex-shrink: 0;
}

.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: white;
}

.tabs {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-area {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 6px;
  margin-bottom: 20px;
}

.search-form {
  margin-bottom: 0;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e8e8e8;
}

.list-header h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.table-container {
  margin-bottom: 20px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
}

.user-detail {
  padding: 20px 0;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* 组织架构管理样式 */
.org-action-area {
  margin: 15px 0;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 6px;
  display: flex;
  gap: 10px;
}

.org-tree-container {
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  padding: 15px;
  margin-bottom: 20px;
  min-height: 300px;
}

.org-detail-area {
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  padding: 20px;
  margin-bottom: 20px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e8e8e8;
}

.detail-header h3 {
  margin: 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
}

.detail-actions {
  display: flex;
  gap: 10px;
}

.org-form {
  margin-top: 20px;
}

.org-members-area {
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  padding: 20px;
}

.members-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e8e8e8;
}

.members-header h3 {
  margin: 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
}

.members-table {
  margin-top: 15px;
}

/* 职务管理样式 */
.position-search-area {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 6px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.position-table-container {
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  margin-bottom: 20px;
}

.position-pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

/* 职称管理样式 */
.title-search-area {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 6px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.title-table-container {
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  margin-bottom: 20px;
}

.title-pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

/* 通用表格样式优化 */
:deep(.el-table) {
  border-radius: 6px;
}

:deep(.el-table th) {
  background-color: #fafafa;
  color: #333;
  font-weight: 600;
}

:deep(.el-table td) {
  border-bottom: 1px solid #f0f0f0;
}

:deep(.el-table__row:hover > td) {
  background-color: #f5f7fa;
}

/* 操作按钮样式 */
:deep(.el-button--text) {
  padding: 4px 8px;
  margin-right: 8px;
}

:deep(.el-button--text:last-child) {
  margin-right: 0;
}

/* 分页样式优化 */
:deep(.el-pagination) {
  padding: 20px 0;
}

:deep(.el-pagination .el-select .el-input) {
  width: 100px;
}

/* 弹窗样式优化 */
:deep(.el-dialog__header) {
  background-color: #f8f9fa;
  padding: 20px 24px;
  border-bottom: 1px solid #e8e8e8;
}

:deep(.el-dialog__title) {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

:deep(.el-dialog__body) {
  padding: 24px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #333;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-container {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    height: auto;
  }
  
  .org-action-area,
  .position-search-area,
  .title-search-area {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }
  
  .position-search-area .el-input,
  .title-search-area .el-input {
    width: 100%;
  }
  
  .position-search-area .el-button,
  .title-search-area .el-button {
    margin-left: 0;
    width: 100%;
  }
  
  .detail-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .members-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .list-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .header-actions {
    width: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
  
  /* 移动端表格滚动 */
  .position-table-container,
  .title-table-container {
    overflow-x: auto;
  }
  
  :deep(.el-table) {
    min-width: 600px;
  }
  
  /* 移动端分页居中 */
  .position-pagination-container,
  .title-pagination-container {
    justify-content: center;
  }
}

/* 搜索输入框样式 */
:deep(.el-input-group__append .el-button) {
  border-left: 0;
}

:deep(.el-input-group__append) {
  background-color: transparent;
}

/* 表格空状态样式 */
:deep(.el-table__empty-text) {
  color: #909399;
  font-size: 14px;
  padding: 40px 0;
}

/* 成功、警告按钮样式统一 */
:deep(.el-button--success) {
  background-color: #67C23A;
  border-color: #67C23A;
}

:deep(.el-button--success:hover) {
  background-color: #85CE61;
  border-color: #85CE61;
}

/* Element Plus 样式覆盖 */
:deep(.el-tree-node__content) {
  height: 36px;
  line-height: 36px;
}

:deep(.el-tree-node__expand-icon) {
  color: #666;
}

:deep(.el-tabs__item) {
  font-size: 16px;
  font-weight: 500;
}

:deep(.el-tabs__active-bar) {
  background-color: #4A90E2;
}

:deep(.el-tabs__item.is-active) {
  color: #4A90E2;
}

:deep(.el-button--primary) {
  background-color: #4A90E2;
  border-color: #4A90E2;
}

:deep(.el-button--primary:hover) {
  background-color: #357ABD;
  border-color: #357ABD;
}
</style>