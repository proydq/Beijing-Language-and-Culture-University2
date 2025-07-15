<template>
  <div class="house-management">
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
          <el-tab-pane label="房屋列表" name="house"></el-tab-pane>
          <el-tab-pane label="楼宇管理" name="building"></el-tab-pane>
        </el-tabs>

        <!-- 房屋列表内容 -->
        <div v-if="activeTab === 'house'" class="house-list-content">
          <!-- 左侧楼栋架构 -->
          <div class="building-structure">
            <div class="structure-header">
              <span class="title">楼栋架构</span>
            </div>
            <div class="search-building">
              <el-input
                v-model="buildingSearch"
                placeholder="请输入楼栋信息搜索"
                :prefix-icon="Search"
                clearable
              />
            </div>
            <div class="building-list">
              <div class="building-category" v-for="category in buildingCategories" :key="category.id">
                <div 
                  class="category-item" 
                  :class="{ active: selectedCategory === category.id }"
                  @click="selectCategory(category.id)"
                >
                  {{ category.name }}
                </div>
                <div class="floor-list" v-if="category.floors && selectedCategory === category.id">
                  <div 
                    class="floor-item" 
                    v-for="floor in category.floors" 
                    :key="floor"
                    :class="{ active: selectedFloor === floor }"
                    @click="selectFloor(floor)"
                  >
                    {{ floor }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧房屋列表 -->
          <div class="house-list-main">
            <div class="list-header">
              <span class="title">房屋列表</span>
              <div class="header-actions">
                <el-button type="danger" @click="handleBatchDelete">删除房间</el-button>
                <el-button type="primary" @click="handleAddRoom">添加房间</el-button>
                <el-button type="primary" @click="handleImport">导入</el-button>
                <el-button type="warning" @click="handleExport">导出</el-button>
              </div>
            </div>

            <!-- 搜索筛选区域 -->
            <div class="search-filters">
              <el-form :model="searchForm" class="search-form">
                <el-row :gutter="20" align="middle">
                  <el-col :span="6">
                    <el-form-item label="房间编号/名称:" prop="roomNumber">
                      <el-input v-model="searchForm.roomNumber" placeholder="请输入搜索信息" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="房间类型:" prop="roomType">
                      <el-select v-model="searchForm.roomType" placeholder="全部" style="width: 100%">
                        <el-option label="全部" value="" />
                        <el-option label="教室" value="教室" />
                        <el-option label="会议室" value="会议室" />
                        <el-option label="实验室" value="实验室" />
                        <el-option label="办公室" value="办公室" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="房间修改时间:" prop="dateRange">
                      <el-date-picker
                        v-model="searchForm.dateRange"
                        type="datetimerange"
                        range-separator="~"
                        start-placeholder="请选择开始时间"
                        end-placeholder="请选择结束时间"
                        format="YYYY-MM-DD HH:mm"
                        value-format="YYYY-MM-DD HH:mm"
                        style="width: 100%"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item>
                      <div class="search-buttons">
                        <el-button @click="handleResetSearch">重置</el-button>
                        <el-button type="primary" @click="handleSearch">搜索</el-button>
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>

            <!-- 房屋数据表格 -->
            <div class="house-table">
              <el-table 
                :data="houseTableData" 
                style="width: 100%" 
                stripe
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" width="55" />
                <el-table-column prop="roomCode" label="编号" />
                <el-table-column prop="roomName" label="名称" />
                <el-table-column prop="roomNumber" label="房间号" />
                <el-table-column prop="roomType" label="房间类型" />
                <el-table-column prop="roomArea" label="房间面积(㎡)" />
                <el-table-column prop="capacity" label="容纳人数" />
                <el-table-column prop="updateTime" label="修改时间" />
                <el-table-column label="操作" width="150" fixed="right">
                  <template #default="scope">
                    <el-button type="primary" size="small" @click="handleEditRoom(scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDeleteRoom(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <!-- 分页 -->
            <div class="pagination-area">
              <el-pagination
                v-model:current-page="housePagination.currentPage"
                v-model:page-size="housePagination.pageSize"
                :page-sizes="[10, 20, 50, 100]"
                :total="housePagination.total"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleHouseSizeChange"
                @current-change="handleHouseCurrentChange"
              />
            </div>
          </div>
        </div>

        <!-- 楼宇管理内容 -->
        <div v-if="activeTab === 'building'" class="building-management">
          <!-- 操作按钮区域 -->
          <div class="action-area">
            <el-button type="primary" @click="handleAddParent" :disabled="!selectedNode">主题</el-button>
            <el-button type="primary" @click="handleAddChild" :disabled="!selectedNode">子主题</el-button>
            <el-button type="danger" @click="handleDelete" :disabled="!selectedNode || selectedNode.id === 1">删除</el-button>
          </div>

          <!-- 楼宇树形结构 -->
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
                  <el-icon v-if="data.type === 'root'"><office-building /></el-icon>
                  <el-icon v-else-if="data.type === 'building'"><office-building /></el-icon>
                  <el-icon v-else-if="data.type === 'floor'"><menu /></el-icon>
                  <el-icon v-else><home /></el-icon>
                  <span class="node-text">{{ node.label }}</span>
                  <span class="node-count" v-if="data.count !== undefined">[{{ data.count }}]</span>
                </span>
              </template>
            </el-tree>
          </div>
        </div>
      </div>
    </div>

    <!-- 房屋信息编辑弹窗 -->
    <el-dialog
      v-model="roomDialogVisible"
      :title="isEditMode ? '编辑房屋信息' : '添加房屋信息'"
      width="800px"
      :before-close="handleRoomDialogClose"
    >
      <el-form
        ref="roomFormRef"
        :model="roomForm"
        :rules="roomFormRules"
        label-width="120px"
        class="room-form"
      >
        <div class="form-section">
          <h4 class="section-title">基本信息</h4>
          
          <el-form-item label="房屋编号:" prop="roomCode">
            <el-input v-model="roomForm.roomCode" placeholder="系统自动生成，无需填写" disabled />
          </el-form-item>
          
          <el-form-item label="房屋名称:" prop="roomName">
            <el-input v-model="roomForm.roomName" placeholder="请输入实验室名称" />
          </el-form-item>
          
          <el-form-item label="房间号:" prop="roomNumber">
            <el-input v-model="roomForm.roomNumber" placeholder="请输入房间号" />
          </el-form-item>
          
          <el-form-item label="房屋面积(㎡):" prop="roomArea">
            <el-input v-model="roomForm.roomArea" placeholder="请输入纯数字" />
          </el-form-item>
          
          <el-form-item label="可容纳人数:" prop="capacity">
            <el-input v-model="roomForm.capacity" placeholder="请输入纯数字" />
          </el-form-item>
        </div>

        <div class="form-section">
          <h4 class="section-title">房屋类型</h4>
          <p class="section-desc">房屋类型目前仅支持：教室、会议室、实验室、办公室；四种类型；如其他类型请填加类型请联系开发</p>
          
          <el-form-item label="房屋类型:" prop="roomType">
            <el-select v-model="roomForm.roomType" placeholder="请选择" style="width: 100%">
              <el-option label="教室" value="教室" />
              <el-option label="会议室" value="会议室" />
              <el-option label="实验室" value="实验室" />
              <el-option label="办公室" value="办公室" />
            </el-select>
          </el-form-item>
        </div>

        <div class="form-section">
          <h4 class="section-title">房屋规则须知</h4>
          <div class="rules-content">
            <p><strong>一、信息录入规范</strong></p>
            <p>1. <strong>核心字段必填：</strong>添加房间时，"房屋类型" 为关键必选字段，请确保准确填写。</p>
            <p>2. <strong>唯一性要求：</strong>房屋名称与房间号的组合必须具有唯一性，重复信息将无法成录入。</p>
            
            <p><strong>二、业务关联与数据同步</strong></p>
            <p>1. <strong>跨系统数据同步：</strong>房屋添加成功后，如用于工会议预约、实验室预约、教室借用等业务，会在对应业务系统中生成同步房屋信息。同时关联在业务系统新建房屋后，目动同步至房屋管理系统。</p>
            
            <p>2. <strong>类型变更影响：</strong>当房屋类型发生变更（如从"实验室"调整为"会议室"），对应配置类型业务系统（如实验室预约）中的其相配置信息将自动清除，已产生的房</p>
            
            <p><strong>三、房屋删除须知</strong></p>
            <p style="color: red;"><strong>若在房屋管理系统中删除房屋操作，所有关联业务系统中的该房屋信息将同步删除，请谨慎操作。</strong></p>
          </div>
        </div>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleRoomDialogClose">取消</el-button>
          <el-button type="primary" @click="handleRoomSubmit">保存</el-button>
        </div>
      </template>
    </el-dialog>

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
import { Search } from '@element-plus/icons-vue'

export default {
  name: 'HouseManagement',
  setup() {
    const router = useRouter()
    const activeTab = ref('house') // 默认显示房屋列表
    const treeRef = ref()
    const formRef = ref()
    const dialogVisible = ref(false)
    const roomDialogVisible = ref(false)
    const selectedNode = ref(null)
    const actionType = ref('') // 'parent' or 'child'
    let nodeIdCounter = 200 // 用于生成唯一ID

    // 房屋列表相关数据
    const buildingSearch = ref('')
    const selectedCategory = ref('全部')
    const selectedFloor = ref('')
    const selectedRooms = ref([])
    const isEditMode = ref(false)
    const currentRoomData = ref({})

    const searchForm = reactive({
      roomNumber: '',
      roomType: '',
      dateRange: []
    })

    const housePagination = reactive({
      currentPage: 1,
      pageSize: 10,
      total: 2010
    })

    const roomForm = reactive({
      roomCode: '',
      roomName: '',
      roomNumber: '',
      roomArea: '',
      capacity: '',
      roomType: '教室'
    })

    const formData = reactive({
      name: ''
    })

    const formRules = {
      name: [
        { required: true, message: '请输入名称', trigger: 'blur' },
        { min: 1, max: 20, message: '名称长度应为1-20个字符', trigger: 'blur' }
      ]
    }

    const roomFormRules = {
      roomName: [
        { required: true, message: '请输入房屋名称', trigger: 'blur' }
      ],
      roomNumber: [
        { required: true, message: '请输入房间号', trigger: 'blur' }
      ],
      roomArea: [
        { required: true, message: '请输入房屋面积', trigger: 'blur' },
        { pattern: /^\d+(\.\d+)?$/, message: '请输入正确的数字', trigger: 'blur' }
      ],
      capacity: [
        { required: true, message: '请输入可容纳人数', trigger: 'blur' },
        { pattern: /^\d+$/, message: '请输入正确的数字', trigger: 'blur' }
      ],
      roomType: [
        { required: true, message: '请选择房屋类型', trigger: 'change' }
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
        type: 'root',
        count: 150,
        children: [
          {
            id: 2,
            label: '首师大渡中本部',
            type: 'building',
            count: 50,
            children: [
              {
                id: 3,
                label: '达芬楼（1）',
                type: 'floor',
                count: 10,
                children: [
                  { id: 4, label: 'B2', type: 'room' },
                  { id: 5, label: 'B1', type: 'room' },
                  { id: 6, label: '1F', type: 'room' },
                  { id: 7, label: '2F', type: 'room' },
                  { id: 8, label: '3F', type: 'room' },
                  { id: 9, label: '4F', type: 'room' },
                  { id: 10, label: '5F', type: 'room' },
                  { id: 11, label: '6F', type: 'room' }
                ]
              },
              { id: 12, label: '达芬楼（2）', type: 'floor', count: 0 },
              { id: 13, label: '达芬楼（3）', type: 'floor', count: 0 },
              { id: 14, label: '达芬楼（4）', type: 'floor', count: 0 },
              { id: 15, label: '达芬楼（5）', type: 'floor', count: 0 }
            ]
          },
          {
            id: 16,
            label: '首师大渡中北校',
            type: 'building',
            count: 50,
            children: [
              { id: 17, label: '承德楼（1）', type: 'floor', count: 0 },
              { id: 18, label: '承德楼（2）', type: 'floor', count: 0 }
            ]
          }
        ]
      }
    ])

    // 楼栋分类数据
    const buildingCategories = ref([
      {
        id: '全部',
        name: '全部'
      },
      {
        id: '达芬楼',
        name: '达芬楼',
        floors: ['B2', 'B1', '1F', '2F', '3F', '4F', '5F', '6F']
      },
      {
        id: '成德楼',
        name: '成德楼'
      },
      {
        id: '奇才楼',
        name: '奇才楼'
      },
      {
        id: '博雅楼',
        name: '博雅楼'
      },
      {
        id: '正志楼',
        name: '正志楼'
      },
      {
        id: '善华楼',
        name: '善华楼'
      }
    ])

    // 房屋数据
    const houseTableData = ref([
      {
        id: 1,
        roomCode: '010CL010101',
        roomName: '房屋名称1',
        roomNumber: '101',
        roomType: '会议室',
        roomArea: '500',
        capacity: '100',
        updateTime: '2021.12.10 13:34'
      },
      {
        id: 2,
        roomCode: '010CL010102',
        roomName: '房屋名称2',
        roomNumber: '102',
        roomType: '实验室',
        roomArea: '500',
        capacity: '100',
        updateTime: '2021.12.10 13:34'
      },
      {
        id: 3,
        roomCode: '010CL010103',
        roomName: '房屋名称3',
        roomNumber: '103',
        roomType: '教室',
        roomArea: '500',
        capacity: '100',
        updateTime: '2021.12.10 13:34'
      },
      {
        id: 4,
        roomCode: '010CL010104',
        roomName: '房屋名称4',
        roomNumber: '104',
        roomType: '办公室',
        roomArea: '500',
        capacity: '100',
        updateTime: '2021.12.10 13:34'
      },
      {
        id: 5,
        roomCode: '010CL010105',
        roomName: '房屋名称5',
        roomNumber: '105',
        roomType: '会议室',
        roomArea: '500',
        capacity: '100',
        updateTime: '2021.12.10 13:34'
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
      console.log('切换标签页:', tab.props.name)
    }

    // 房屋列表相关方法
    const selectCategory = (categoryId) => {
      selectedCategory.value = categoryId
      selectedFloor.value = ''
      console.log('选择分类:', categoryId)
    }

    const selectFloor = (floor) => {
      selectedFloor.value = floor
      console.log('选择楼层:', floor)
    }

    const handleSelectionChange = (selection) => {
      selectedRooms.value = selection
      console.log('选中的房间:', selection)
    }

    const handleSearch = () => {
      console.log('搜索房屋:', searchForm)
    }

    const handleResetSearch = () => {
      searchForm.roomNumber = ''
      searchForm.roomType = ''
      searchForm.dateRange = []
    }

    const handleBatchDelete = () => {
      if (selectedRooms.value.length === 0) {
        ElMessage.warning('请先选择要删除的房间')
        return
      }
      ElMessageBox.confirm(
        `确定要删除选中的 ${selectedRooms.value.length} 个房间吗？`,
        '确认删除',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(() => {
        // 执行批量删除逻辑
        ElMessage.success('删除成功')
      }).catch(() => {
        ElMessage.info('已取消删除')
      })
    }

    const handleAddRoom = () => {
      isEditMode.value = false
      resetRoomForm()
      roomDialogVisible.value = true
    }

    const handleImport = () => {
      console.log('导入房间数据')
    }

    const handleExport = () => {
      console.log('导出房间数据')
    }

    const handleViewDetails = (row) => {
      console.log('查看房间详情:', row)
    }

    const handleEditRoom = (row) => {
      isEditMode.value = true
      currentRoomData.value = { ...row }
      Object.assign(roomForm, {
        roomCode: row.roomCode,
        roomName: row.roomName,
        roomNumber: row.roomNumber,
        roomArea: row.roomArea,
        capacity: row.capacity,
        roomType: row.roomType
      })
      roomDialogVisible.value = true
    }

    const handleDeleteRoom = (row) => {
      ElMessageBox.confirm(
        `确定要删除房间 "${row.roomName}" 吗？`,
        '确认删除',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(() => {
        // 执行删除逻辑
        const index = houseTableData.value.findIndex(item => item.id === row.id)
        if (index !== -1) {
          houseTableData.value.splice(index, 1)
          housePagination.total -= 1
        }
        ElMessage.success('删除成功')
      }).catch(() => {
        ElMessage.info('已取消删除')
      })
    }

    const handleHouseSizeChange = (size) => {
      housePagination.pageSize = size
    }

    const handleHouseCurrentChange = (page) => {
      housePagination.currentPage = page
    }

    const resetRoomForm = () => {
      roomForm.roomCode = ''
      roomForm.roomName = ''
      roomForm.roomNumber = ''
      roomForm.roomArea = ''
      roomForm.capacity = ''
      roomForm.roomType = '教室'
    }

    const handleRoomDialogClose = () => {
      roomDialogVisible.value = false
      resetRoomForm()
    }

    const handleRoomSubmit = async () => {
      try {
        await formRef.value?.validate()
        
        if (isEditMode.value) {
          // 编辑房间
          const index = houseTableData.value.findIndex(item => item.id === currentRoomData.value.id)
          if (index !== -1) {
            houseTableData.value[index] = {
              ...houseTableData.value[index],
              ...roomForm,
              updateTime: new Date().toISOString().slice(0, 16).replace('T', ' ')
            }
          }
          ElMessage.success('房间信息更新成功')
        } else {
          // 新增房间
          const newRoom = {
            id: houseTableData.value.length + 1,
            ...roomForm,
            roomCode: roomForm.roomCode || `010CL0101${(houseTableData.value.length + 1).toString().padStart(2, '0')}`,
            updateTime: new Date().toISOString().slice(0, 16).replace('T', ' ')
          }
          houseTableData.value.unshift(newRoom)
          housePagination.total += 1
          ElMessage.success('房间添加成功')
        }
        
        handleRoomDialogClose()
      } catch (error) {
        console.log('表单验证失败:', error)
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
        
        // 根据选中节点的类型来确定新节点的类型
        let newNodeType = 'room'
        if (actionType.value === 'child') {
          if (selectedNode.value.type === 'root' || selectedNode.value.type === 'building') {
            newNodeType = selectedNode.value.type === 'root' ? 'building' : 'floor'
          } else if (selectedNode.value.type === 'floor') {
            newNodeType = 'room'
          }
        } else {
          // 兄弟节点，类型与选中节点相同
          newNodeType = selectedNode.value.type
        }

        const newNode = {
          id: ++nodeIdCounter,
          label: formData.name,
          type: newNodeType,
          count: newNodeType !== 'room' ? 0 : undefined,
          children: newNodeType !== 'room' ? [] : undefined
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
      // 房屋列表相关
      buildingSearch,
      selectedCategory,
      selectedFloor,
      selectedRooms,
      searchForm,
      housePagination,
      buildingCategories,
      houseTableData,
      roomDialogVisible,
      isEditMode,
      roomForm,
      roomFormRules,
      Search,
      // 方法
      handleTabClick,
      selectCategory,
      selectFloor,
      handleSelectionChange,
      handleSearch,
      handleResetSearch,
      handleBatchDelete,
      handleAddRoom,
      handleImport,
      handleExport,
      handleViewDetails,
      handleEditRoom,
      handleDeleteRoom,
      handleHouseSizeChange,
      handleHouseCurrentChange,
      handleRoomDialogClose,
      handleRoomSubmit,
      // 楼宇管理方法
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
.house-management {
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

.house-list-content {
  display: flex;
  gap: 20px;
  height: calc(100vh - 200px);
}

.building-structure {
  width: 250px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.structure-header {
  padding: 15px 20px;
  border-bottom: 1px solid #e8e8e8;
}

.structure-header .title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.search-building {
  padding: 15px 20px;
  border-bottom: 1px solid #e8e8e8;
}

.building-list {
  padding: 10px 0;
  max-height: calc(100vh - 350px);
  overflow-y: auto;
}

.building-category {
  margin-bottom: 5px;
}

.category-item {
  padding: 12px 20px;
  cursor: pointer;
  color: #666;
  transition: all 0.3s;
}

.category-item:hover {
  background-color: #f5f7fa;
  color: #409eff;
}

.category-item.active {
  background-color: #4A90E2;
  color: white;
}

.floor-list {
  background-color: #f8f9fa;
}

.floor-item {
  padding: 8px 40px;
  cursor: pointer;
  color: #666;
  font-size: 14px;
  transition: all 0.3s;
}

.floor-item:hover {
  background-color: #e6f3ff;
  color: #409eff;
}

.floor-item.active {
  background-color: #e6f3ff;
  color: #409eff;
  font-weight: 500;
}

.house-list-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.list-header .title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.search-filters {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.search-form {
  width: 100%;
}

.search-buttons {
  display: flex;
  gap: 10px;
  align-items: center;
}

.house-table {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex: 1;
}

/* 表格样式优化 */
:deep(.el-table) {
  table-layout: fixed;
}

:deep(.el-table th) {
  background-color: #fafafa;
  font-weight: 600;
}

:deep(.el-table td) {
  padding: 8px 0;
}

:deep(.el-table .cell) {
  padding: 0 8px;
}

.room-form {
  max-height: 60vh;
  overflow-y: auto;
}

.form-section {
  margin-bottom: 30px;
}

.section-title {
  color: #333;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 8px;
}

.section-desc {
  color: #e74c3c;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 15px;
}

.rules-content {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 6px;
  font-size: 14px;
  line-height: 1.6;
}

.rules-content p {
  margin-bottom: 10px;
}

.rules-content strong {
  color: #333;
}

.coming-soon {
  color: #666;
}

.coming-soon h3 {
  margin: 20px 0 10px 0;
  font-size: 24px;
  color: #333;
}

.coming-soon p {
  margin: 0;
  font-size: 16px;
}

.building-management {
  /* 楼宇管理样式 */
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

:deep(.el-form-item) {
  margin-bottom: 16px;
  width: 100%;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #333;
  width: auto !important;
  min-width: 100px;
  text-align: right;
  padding-right: 12px;
}

:deep(.el-form-item__content) {
  flex: 1;
}

:deep(.el-input) {
  width: 100%;
}

:deep(.el-select) {
  width: 100%;
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