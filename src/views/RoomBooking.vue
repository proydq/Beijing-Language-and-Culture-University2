<template>
  <div class="room-booking">
    <!-- 顶部导航栏 -->
    <div class="header">
      <div class="header-left">
        <div class="logo">
          <el-icon size="24"><home-filled /></el-icon>
        </div>
        <span class="title">房屋借用管理</span>
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
              <el-dropdown-item>个人中心</el-dropdown-item>
              <el-dropdown-item>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- 主导航菜单 -->
    <div class="main-nav">
      <div class="nav-tabs">
        <div 
          v-for="tab in mainTabs" 
          :key="tab.key"
          :class="['nav-tab', { active: activeMainTab === tab.key }]"
          @click="setActiveMainTab(tab.key)"
        >
          <el-icon>
            <component :is="tab.icon" />
          </el-icon>
          <span>{{ tab.label }}</span>
        </div>
      </div>
    </div>

    <div class="main-content">
      <!-- 数据看板 -->
      <div v-if="activeMainTab === 'dashboard'" class="dashboard-content">
        <DashboardStats 
          :stats="stats"
          @time-range-change="handleTimeRangeChange"
        />
      </div>

      <!-- 借用管理 -->
      <div v-else-if="activeMainTab === 'booking'" class="booking-management">
        <div class="booking-layout">
          <!-- 左侧功能菜单 -->
          <div class="left-sidebar">
            <div class="sidebar-header">
              <h3>功能菜单</h3>
            </div>
            <div class="sidebar-menu">
              <div 
                v-for="item in menuItems" 
                :key="item"
                :class="['menu-item', { active: activeMenuItem === item }]"
                @click="setActiveMenuItem(item)"
              >
                <el-icon><document /></el-icon>
                <span>{{ item }}</span>
              </div>
            </div>
          </div>

          <!-- 中间楼宇分类（仅在房间预约时显示） -->
          <div v-if="activeMenuItem === '房间预约'" class="middle-sidebar">
            <div class="search-box">
              <el-input
                v-model="searchKeyword"
                placeholder="搜索楼宇"
                :prefix-icon="Search"
                size="small"
              />
            </div>
            <div class="category-tree">
              <div class="category-item" 
                   :class="{ active: activeCategory === '全部' }"
                   @click="setActiveCategory('全部')">
                全部
              </div>
              <div class="category-group">
                <div class="category-item expandable" 
                     :class="{ active: activeCategory === '达力楼' }"
                     @click="toggleCategory('达力楼')">
                  <span @click.stop="setActiveCategory('达力楼')">达力楼</span>
                  <el-icon :class="['expand-icon', { expanded: expandedCategories.includes('达力楼') }]">
                    <arrow-down />
                  </el-icon>
                </div>
                <div v-if="expandedCategories.includes('达力楼')" class="sub-categories">
                  <div v-for="floor in floors" :key="floor" 
                       class="sub-category"
                       :class="{ active: activeCategory === floor }"
                       @click="setActiveCategory(floor)">
                    {{ floor }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="room-booking-content">
            <!-- 我的预约 -->
            <div v-if="activeMenuItem === '我的预约'" class="my-bookings">
              <div class="search-filters">
                <div class="filter-row">
                  <div class="filter-item">
                    <label>预约名称</label>
                    <el-input v-model="searchFilters.name" placeholder="请输入预约名称" />
                  </div>
                  <div class="filter-item">
                    <label>审核状态</label>
                    <el-select v-model="searchFilters.auditType" placeholder="请选择审核状态">
                      <el-option label="全部" value="" />
                      <el-option label="待审核" value="待审核" />
                      <el-option label="通过" value="通过" />
                      <el-option label="拒绝" value="拒绝" />
                    </el-select>
                  </div>
                  <div class="filter-item">
                    <label>使用状态</label>
                    <el-select v-model="searchFilters.useStatus" placeholder="请选择使用状态">
                      <el-option label="全部" value="" />
                      <el-option label="未开始" value="未开始" />
                      <el-option label="进行中" value="进行中" />
                      <el-option label="已结束" value="已结束" />
                    </el-select>
                  </div>
                  <div class="filter-item">
                    <label>时间范围</label>
                    <el-date-picker
                      v-model="searchFilters.timeRange"
                      type="datetimerange"
                      range-separator="至"
                      start-placeholder="开始时间"
                      end-placeholder="结束时间"
                    />
                  </div>
                  <div class="filter-actions">
                    <el-button type="primary" @click="handleSearch">搜索</el-button>
                    <el-button @click="handleResetFilters">重置</el-button>
                  </div>
                </div>
              </div>

              <div class="booking-table">
                <el-table :data="paginatedBookingData" style="width: 100%">
                  <el-table-column prop="bookingName" label="预约名称" width="200" />
                  <el-table-column prop="bookingTime" label="预约时间" width="300" />
                  <el-table-column prop="description" label="预约说明" min-width="200" />
                  <el-table-column prop="roomName" label="房间名称" width="150" />
                  <el-table-column prop="auditStatus" label="审核状态" width="100">
                    <template #default="scope">
                      <el-tag
                        :type="getStatusType(scope.row.auditStatus)"
                        size="small"
                      >
                        {{ scope.row.auditStatus }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="useStatus" label="使用状态" width="100">
                    <template #default="scope">
                      <el-tag
                        :type="getUseStatusType(scope.row.useStatus)"
                        size="small"
                      >
                        {{ scope.row.useStatus }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="150">
                    <template #default="scope">
                      <el-button type="primary" size="small" @click="handleEdit(scope.row)">
                        编辑
                      </el-button>
                      <el-button type="danger" size="small" @click="handleEdit(scope.row)">
                        取消
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>

              <div class="pagination">
                <el-pagination
                  v-model:current-page="bookingPagination.currentPage"
                  v-model:page-size="bookingPagination.pageSize"
                  :page-sizes="[10, 20, 50, 100]"
                  :total="bookingPagination.total"
                  layout="total, sizes, prev, pager, next, jumper"
                  @size-change="handleBookingSizeChange"
                  @current-change="handleBookingCurrentChange"
                />
              </div>
            </div>

            <!-- 全部借用 -->
            <div v-if="activeMenuItem === '全部借用'" class="all-bookings">
              <div class="search-filters">
                <div class="filter-row">
                  <div class="filter-item">
                    <label>预约名称</label>
                    <el-input v-model="allBookingFilters.name" placeholder="请输入预约名称" />
                  </div>
                  <div class="filter-item">
                    <label>申请人</label>
                    <el-input v-model="allBookingFilters.applicant" placeholder="请输入申请人" />
                  </div>
                  <div class="filter-item">
                    <label>审核状态</label>
                    <el-select v-model="allBookingFilters.auditType" placeholder="请选择审核状态">
                      <el-option label="全部" value="" />
                      <el-option label="待审核" value="待审核" />
                      <el-option label="通过" value="通过" />
                      <el-option label="拒绝" value="拒绝" />
                    </el-select>
                  </div>
                  <div class="filter-item">
                    <label>使用状态</label>
                    <el-select v-model="allBookingFilters.useStatus" placeholder="请选择使用状态">
                      <el-option label="全部" value="" />
                      <el-option label="未开始" value="未开始" />
                      <el-option label="进行中" value="进行中" />
                      <el-option label="已结束" value="已结束" />
                    </el-select>
                  </div>
                  <div class="filter-item">
                    <label>时间范围</label>
                    <el-date-picker
                      v-model="allBookingFilters.timeRange"
                      type="datetimerange"
                      range-separator="至"
                      start-placeholder="开始时间"
                      end-placeholder="结束时间"
                    />
                  </div>
                  <div class="filter-actions">
                    <el-button type="primary" @click="handleAllBookingSearch">搜索</el-button>
                    <el-button @click="handleResetAllBookingFilters">重置</el-button>
                  </div>
                </div>
              </div>

              <div class="booking-table">
                <el-table :data="paginatedAllBookingData" style="width: 100%">
                  <el-table-column prop="bookingName" label="预约名称" width="200" />
                  <el-table-column prop="applicant" label="申请人" width="100" />
                  <el-table-column prop="bookingTime" label="预约时间" width="300" />
                  <el-table-column prop="description" label="预约说明" min-width="200" />
                  <el-table-column prop="roomName" label="房间名称" width="150" />
                  <el-table-column prop="auditStatus" label="审核状态" width="100">
                    <template #default="scope">
                      <el-tag
                        :type="getStatusType(scope.row.auditStatus)"
                        size="small"
                      >
                        {{ scope.row.auditStatus }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="useStatus" label="使用状态" width="100">
                    <template #default="scope">
                      <el-tag
                        :type="getUseStatusType(scope.row.useStatus)"
                        size="small"
                      >
                        {{ scope.row.useStatus }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="150">
                    <template #default="scope">
                      <el-button type="success" size="small" @click="handleApprove(scope.row)">
                        审核
                      </el-button>
                      <el-button type="primary" size="small" @click="handleEdit(scope.row)">
                        编辑
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>

              <div class="pagination">
                <el-pagination
                  v-model:current-page="allBookingPagination.currentPage"
                  v-model:page-size="allBookingPagination.pageSize"
                  :page-sizes="[10, 20, 50, 100]"
                  :total="allBookingPagination.total"
                  layout="total, sizes, prev, pager, next, jumper"
                  @size-change="handleAllBookingSizeChange"
                  @current-change="handleAllBookingCurrentChange"
                />
              </div>
            </div>

            <!-- 房间预约 -->
            <div v-if="activeMenuItem === '房间预约'" class="room-list">
              <div class="room-grid">
                <div
                  v-for="room in filteredRooms"
                  :key="room.id"
                  :class="['room-card', { unavailable: !room.available }]"
                >
                  <div class="room-header">
                    <h4>{{ room.name }}</h4>
                  </div>
                  <div class="room-info">
                    <div class="capacity">容纳人数：{{ room.capacity }}</div>
                  </div>
                  <div class="room-actions">
                    <el-button
                      :type="room.available ? 'primary' : 'info'"
                      :disabled="!room.available"
                      @click="bookRoom(room)"
                    >
                      {{ room.available ? '立即预约' : '不可预约' }}
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 审批管理 -->
      <div v-else-if="activeMainTab === 'approval'" class="approval-content">
        <div class="approval-management">
          <div class="approval-layout">
            <!-- 左侧状态导航 -->
            <div class="approval-sidebar">
              <div class="sidebar-header">
                <h3>审批状态</h3>
              </div>
              <div class="sidebar-menu">
                <div 
                  v-for="status in approvalStatusItems" 
                  :key="status.key"
                  :class="['menu-item', { active: activeApprovalStatus === status.key }]"
                  @click="setActiveApprovalStatus(status.key)"
                >
                  <el-icon>
                    <component :is="status.icon" />
                  </el-icon>
                  <span>{{ status.label }}</span>
                  <span class="count">({{ getStatusCount(status.key) }})</span>
                </div>
              </div>
            </div>

            <!-- 右侧主要内容区域 -->
            <div class="approval-main-content">
              <!-- 搜索过滤区域 -->
              <div class="search-filters">
                <div class="filter-row">
                  <div class="filter-item">
                    <label>借用/预约名称</label>
                    <el-input 
                      v-model="approvalFilters.name" 
                      placeholder="请输入信息" 
                      style="width: 200px;"
                    />
                  </div>
                  <div class="filter-item">
                    <label>预约人</label>
                    <el-input 
                      v-model="approvalFilters.applicant" 
                      placeholder="请输入信息" 
                      style="width: 200px;"
                    />
                  </div>
                  <div class="filter-item">
                    <label>预约时间</label>
                    <el-date-picker
                      v-model="approvalFilters.timeRange"
                      type="datetimerange"
                      range-separator="~"
                      start-placeholder="请选择开始时间"
                      end-placeholder="请选择开始时间"
                      style="width: 350px;"
                    />
                  </div>
                  <div class="filter-actions">
                    <el-button type="primary" @click="handleApprovalSearch">搜索</el-button>
                    <el-button @click="handleResetApprovalFilters">重置</el-button>
                  </div>
                </div>
              </div>

              <!-- 审批列表 -->
              <div class="approval-table">
                <el-table :data="filteredApprovalData" style="width: 100%">
                  <el-table-column prop="bookingName" label="借用/预约名称" width="200" />
                  <el-table-column prop="bookingTime" label="预约时间" width="300" />
                  <el-table-column prop="description" label="描述" min-width="200">
                    <template #default="scope">
                      <el-tooltip :content="scope.row.description" placement="top">
                        <span class="truncated-text">{{ scope.row.description }}</span>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column prop="applicant" label="预约人" width="100" />
                  <el-table-column prop="roomName" label="预约对象" width="150" />
                  <el-table-column prop="auditStatus" label="预约状态" width="100">
                    <template #default="scope">
                      <el-tag
                        :type="getApprovalStatusType(scope.row.auditStatus)"
                        size="small"
                      >
                        {{ scope.row.auditStatus }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="150">
                    <template #default="scope">
                      <el-button 
                        v-if="scope.row.auditStatus === '待审核'"
                        type="success" 
                        size="small" 
                        @click="showApprovalDialog(scope.row)"
                      >
                        立即审批
                      </el-button>
                      <el-button 
                        v-else
                        type="info" 
                        size="small" 
                        disabled
                      >
                        已审批
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>

              <!-- 分页 -->
              <div class="pagination">
                <el-pagination
                  v-model:current-page="approvalPagination.currentPage"
                  v-model:page-size="approvalPagination.pageSize"
                  :page-sizes="[10, 20, 50, 100]"
                  :total="approvalPagination.total"
                  layout="total, sizes, prev, pager, next, jumper"
                  @size-change="handleApprovalSizeChange"
                  @current-change="handleApprovalCurrentChange"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 审批对话框 -->
        <el-dialog
          v-model="approvalDialogVisible"
          title="审批申请"
          width="600px"
          :before-close="handleApprovalDialogClose"
        >
          <div v-if="currentApprovalItem" class="approval-dialog-content">
            <div class="approval-info">
              <h4>申请信息</h4>
              <div class="info-grid">
                <div class="info-item">
                  <label>借用名称：</label>
                  <span>{{ currentApprovalItem.bookingName }}</span>
                </div>
                <div class="info-item">
                  <label>申请人：</label>
                  <span>{{ currentApprovalItem.applicant }}</span>
                </div>
                <div class="info-item">
                  <label>预约时间：</label>
                  <span>{{ currentApprovalItem.bookingTime }}</span>
                </div>
                <div class="info-item">
                  <label>预约对象：</label>
                  <span>{{ currentApprovalItem.roomName }}</span>
                </div>
                <div class="info-item full-width">
                  <label>申请说明：</label>
                  <span>{{ currentApprovalItem.description }}</span>
                </div>
              </div>
            </div>

            <div class="approval-action">
              <h4>审批操作</h4>
              <el-form :model="approvalForm" label-width="100px">
                <el-form-item label="审批结果：" required>
                  <el-radio-group v-model="approvalForm.result">
                    <el-radio value="通过" style="color: #67C23A;">
                      <el-icon><check /></el-icon>
                      通过
                    </el-radio>
                    <el-radio value="拒绝" style="color: #F56C6C;">
                      <el-icon><close /></el-icon>
                      拒绝
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="审批意见：">
                  <el-input
                    v-model="approvalForm.comment"
                    type="textarea"
                    :rows="4"
                    placeholder="请输入审批意见（选填）"
                  />
                </el-form-item>
              </el-form>
            </div>
          </div>

          <template #footer>
            <div class="dialog-footer">
              <el-button @click="handleApprovalDialogClose">取消</el-button>
              <el-button 
                type="primary" 
                @click="submitApproval"
                :disabled="!approvalForm.result"
              >
                提交审批
              </el-button>
            </div>
          </template>
        </el-dialog>
      </div>

      <!-- 数据记录 -->
      <div v-else-if="activeMainTab === 'records'" class="records-content">
        <div class="content-placeholder">
          <el-icon size="64"><folder-opened /></el-icon>
          <h3>数据记录</h3>
          <p>数据记录功能正在开发中...</p>
        </div>
      </div>

      <!-- 设置 -->
      <div v-else-if="activeMainTab === 'settings'" class="settings-content">
        <div class="settings-management">
          <div class="settings-layout">
            <!-- 左侧层级导航 -->
            <div class="settings-sidebar">
              <div class="sidebar-header">
                <h3>系统设置</h3>
              </div>
              <div class="sidebar-menu">
                <!-- 房屋类型权限设置 -->
                <div class="menu-group">
                  <div 
                    :class="['menu-group-title', { expanded: expandedGroups.includes('房屋类型权限设置') }]"
                    @click="toggleGroup('房屋类型权限设置')"
                  >
                    <el-icon><arrow-down /></el-icon>
                    <span>房屋类型权限设置</span>
                  </div>
                  <div v-if="expandedGroups.includes('房屋类型权限设置')" class="submenu">
                    <div 
                      :class="['submenu-item', { active: activeSettingsMenu === '预约人员' }]"
                      @click="setActiveSettingsMenu('预约人员')"
                    >
                      <el-icon><user /></el-icon>
                      <span>预约人员</span>
                    </div>
                    <div 
                      :class="['submenu-item', { active: activeSettingsMenu === '预约时间设置' }]"
                      @click="setActiveSettingsMenu('预约时间设置')"
                    >
                      <el-icon><clock /></el-icon>
                      <span>预约时间设置</span>
                    </div>
                  </div>
                </div>

                <!-- 房屋管理 -->
                <div class="menu-group">
                  <div 
                    :class="['menu-group-title', { expanded: expandedGroups.includes('房屋管理') }]"
                    @click="toggleGroup('房屋管理')"
                  >
                    <el-icon><arrow-down /></el-icon>
                    <span>房屋管理</span>
                  </div>
                  <div v-if="expandedGroups.includes('房屋管理')" class="submenu">
                    <div 
                      :class="['submenu-item', { active: activeSettingsMenu === '房屋列表' }]"
                      @click="setActiveSettingsMenu('房屋列表')"
                    >
                      <el-icon><document /></el-icon>
                      <span>房屋列表</span>
                    </div>
                    <div 
                      :class="['submenu-item', { active: activeSettingsMenu === '回收站' }]"
                      @click="setActiveSettingsMenu('回收站')"
                    >
                      <el-icon><delete /></el-icon>
                      <span>回收站</span>
                    </div>
                  </div>
                </div>

                <!-- 违规设置 -->
                <div class="menu-group">
                  <div 
                    :class="['menu-group-title', { expanded: expandedGroups.includes('违规设置') }]"
                    @click="toggleGroup('违规设置')"
                  >
                    <el-icon><arrow-down /></el-icon>
                    <span>违规设置</span>
                  </div>
                  <div v-if="expandedGroups.includes('违规设置')" class="submenu">
                    <div 
                      :class="['submenu-item', { active: activeSettingsMenu === '违规配置' }]"
                      @click="setActiveSettingsMenu('违规配置')"
                    >
                      <el-icon><setting /></el-icon>
                      <span>违规配置</span>
                    </div>
                    <div 
                      :class="['submenu-item', { active: activeSettingsMenu === '黑名单' }]"
                      @click="setActiveSettingsMenu('黑名单')"
                    >
                      <el-icon><warning /></el-icon>
                      <span>黑名单</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 右侧主要内容区域 -->
            <div class="settings-main-content">
              <!-- 预约人员管理 -->
              <div v-if="activeSettingsMenu === '预约人员'" class="settings-page">
                <div class="page-header">
                  <h2>预约人权限列表</h2>
                  <div class="header-actions">
                    <el-button type="primary">新增</el-button>
                    <el-button>导出</el-button>
                  </div>
                </div>

                <div class="content-table">
                  <el-table :data="reservationPersonnel" style="width: 100%">
                    <el-table-column prop="topic" label="主题" width="200" />
                    <el-table-column prop="allowedPersonnel" label="权限人员" min-width="300">
                      <template #default="scope">
                        <div class="personnel-list">
                          <span v-for="(person, index) in scope.row.allowedPersonnel" :key="index" class="person-tag">
                            {{ person }}
                          </span>
                          <el-button type="primary" link size="small" @click="viewMore(scope.row)">
                            查看详情
                          </el-button>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="classrooms" label="预约教室" min-width="300">
                      <template #default="scope">
                        <div class="classroom-list">
                          <span v-for="(classroom, index) in scope.row.classrooms" :key="index" class="classroom-tag">
                            {{ classroom }}
                          </span>
                          <el-button type="primary" link size="small" @click="viewMore(scope.row)">
                            查看详情
                          </el-button>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="creator" label="创建人" width="100" />
                    <el-table-column prop="createTime" label="创建时间" width="160" />
                    <el-table-column label="操作" width="160">
                      <template #default="scope">
                        <el-button type="primary" size="small" @click="editItem(scope.row)">
                          编辑
                        </el-button>
                        <el-button type="danger" size="small" @click="deleteItem(scope.row)">
                          删除
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>

              <!-- 预约时间设置 -->
              <div v-else-if="activeSettingsMenu === '预约时间设置'" class="settings-page">
                <div class="page-header">
                  <h2>预约时间设置</h2>
                  <div class="header-actions">
                    <el-button type="primary">保存设置</el-button>
                  </div>
                </div>

                <div class="settings-form">
                  <el-form :model="timeSettings" label-width="150px">
                    <el-form-item label="预约开放时间：">
                      <el-time-picker
                        v-model="timeSettings.openTime"
                        placeholder="选择开放时间"
                      />
                      <span class="form-desc">设置每日预约系统开放时间</span>
                    </el-form-item>
                    
                    <el-form-item label="预约截止时间：">
                      <el-time-picker
                        v-model="timeSettings.closeTime"
                        placeholder="选择截止时间"
                      />
                      <span class="form-desc">设置每日预约系统关闭时间</span>
                    </el-form-item>

                    <el-form-item label="提前预约天数：">
                      <el-input-number
                        v-model="timeSettings.advanceDays"
                        :min="1"
                        :max="30"
                        style="width: 200px;"
                      />
                      <span class="form-desc">用户最多可提前多少天进行预约</span>
                    </el-form-item>

                    <el-form-item label="取消预约时限：">
                      <el-input-number
                        v-model="timeSettings.cancelHours"
                        :min="1"
                        :max="48"
                        style="width: 200px;"
                      />
                      <span class="form-desc">预约开始前多少小时内不允许取消</span>
                    </el-form-item>
                  </el-form>
                </div>
              </div>

              <!-- 房屋列表 -->
              <div v-else-if="activeSettingsMenu === '房屋列表'" class="settings-page">
                <div class="page-header">
                  <h2>房屋列表管理</h2>
                  <div class="header-actions">
                    <el-button type="primary">添加房屋</el-button>
                  </div>
                </div>

                <div class="content-placeholder">
                  <el-icon size="64"><document /></el-icon>
                  <h3>房屋列表管理</h3>
                  <p>此功能正在开发中，敬请期待...</p>
                </div>
              </div>

              <!-- 回收站 -->
              <div v-else-if="activeSettingsMenu === '回收站'" class="settings-page">
                <div class="page-header">
                  <h2>回收站</h2>
                  <div class="header-actions">
                    <el-button type="danger">清空回收站</el-button>
                  </div>
                </div>

                <div class="content-placeholder">
                  <el-icon size="64"><delete /></el-icon>
                  <h3>回收站</h3>
                  <p>此功能正在开发中，敬请期待...</p>
                </div>
              </div>

              <!-- 违规配置 -->
              <div v-else-if="activeSettingsMenu === '违规配置'" class="settings-page">
                <div class="page-header">
                  <h2>违规配置管理</h2>
                  <div class="header-actions">
                    <el-button type="primary">保存配置</el-button>
                  </div>
                </div>

                <div class="content-placeholder">
                  <el-icon size="64"><setting /></el-icon>
                  <h3>违规配置管理</h3>
                  <p>此功能正在开发中，敬请期待...</p>
                </div>
              </div>

              <!-- 黑名单 -->
              <div v-else-if="activeSettingsMenu === '黑名单'" class="settings-page">
                <div class="page-header">
                  <h2>黑名单管理</h2>
                  <div class="header-actions">
                    <el-button type="primary">添加黑名单</el-button>
                  </div>
                </div>

                <div class="content-placeholder">
                  <el-icon size="64"><warning /></el-icon>
                  <h3>黑名单管理</h3>
                  <p>此功能正在开发中，敬请期待...</p>
                </div>
              </div>

              <!-- 默认页面 -->
              <div v-else class="settings-page">
                <div class="content-placeholder">
                  <el-icon size="64"><setting /></el-icon>
                  <h3>请选择设置项</h3>
                  <p>请从左侧菜单选择要配置的功能模块</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, ArrowDown, Document, DocumentChecked, FolderOpened, Setting, DataLine, Management, Document as DocumentIcon, Grid, User, HomeFilled, Check, Close, Clock, CircleCheck, CircleClose, Connection, Key, Cpu, Delete, Warning } from '@element-plus/icons-vue'
import DashboardStats from '@/components/RoomBooking/DashboardStats.vue'

export default {
  name: 'RoomBooking',
  components: {
    DashboardStats,
    Search,
    ArrowDown,
    Document,
    DocumentChecked,
    FolderOpened,
    Setting,
    DataLine,
    Management,
    DocumentIcon,
    Grid,
    User,
    HomeFilled,
    Check,
    Close,
    Clock,
    CircleCheck,
    CircleClose,
    Connection,
    Key,
    Cpu,
    Delete,
    Warning
  },
  setup() {
    // 主导航标签页
    const mainTabs = [
      { key: 'dashboard', label: '数据看板', icon: 'DataLine' },
      { key: 'booking', label: '借用管理', icon: 'Management' },
      { key: 'approval', label: '审批管理', icon: 'DocumentChecked' },
      { key: 'records', label: '数据记录', icon: 'FolderOpened' },
      { key: 'settings', label: '设置', icon: 'Setting' }
    ]
    
    const activeMainTab = ref('dashboard')
    
    const setActiveMainTab = (tab) => {
      activeMainTab.value = tab
    }

    // 统计数据
    const stats = ref({
      totalBookings: 1234,
      teacherBookings: 34,
      studentBookings: 1200
    })
    
    // 借用管理相关
    const menuItems = ['我的预约', '全部借用', '房间预约']
    const activeMenuItem = ref('我的预约')
    const activeCategory = ref('全部')
    const expandedCategories = ref(['达力楼'])
    const searchKeyword = ref('')
    const floors = ['1F', '2F', '3F', '4F', '5F', '6F', 'B1', 'B2']
    
    // 我的预约相关
    const searchFilters = reactive({
      name: '',
      auditType: '',
      useStatus: '',
      startTime: '',
      endTime: '',
      timeRange: []
    })
    
    const bookingPagination = reactive({
      currentPage: 1,
      pageSize: 10,
      total: 0
    })
    
    // 全部借用列表相关
    const allBookingFilters = reactive({
      name: '',
      applicant: '',
      auditType: '',
      useStatus: '',
      startTime: '',
      endTime: '',
      timeRange: []
    })
    
    const allBookingPagination = reactive({
      currentPage: 1,
      pageSize: 10,
      total: 0
    })
    
    // 预约数据
    const bookingData = ref([
      {
        id: 1,
        bookingName: '【教师人员专】的配置管理',
        bookingTime: '2025.04.24 第一节次、第二节次、第三节次、第四节次',
        description: '各类通过这里发布各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息',
        applicant: '王玲',
        roomName: '多媒体教室（101）',
        auditStatus: '待审核',
        useStatus: '未开始'
      },
      {
        id: 2,
        bookingName: '【教师人员专】的配置管理',
        bookingTime: '2025.04.24 第一节次、第二节次、第三节次、第四节次',
        description: '各类通过这里发布各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息',
        applicant: '王玲',
        roomName: '多媒体教室（102）',
        auditStatus: '待审核',
        useStatus: '未开始'
      },
      {
        id: 3,
        bookingName: '【教师人员专】的配置管理',
        bookingTime: '2025.04.24 第一节次、第二节次、第三节次、第四节次',
        description: '各类通过这里发布各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息',
        applicant: '王玲',
        roomName: '多媒体教室（103）',
        auditStatus: '待审核',
        useStatus: '未开始'
      },
      {
        id: 4,
        bookingName: '【教师人员专】的配置管理',
        bookingTime: '2025.04.24 第一节次、第二节次、第三节次、第四节次',
        description: '各类通过这里发布各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息',
        applicant: '王玲',
        roomName: '多媒体教室（104）',
        auditStatus: '通过',
        useStatus: '未开始'
      },
      {
        id: 5,
        bookingName: '【教师人员专】的配置管理',
        bookingTime: '2025.04.24 第一节次、第二节次、第三节次、第四节次',
        description: '各类通过这里发布各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息',
        applicant: '王玲',
        roomName: '多媒体教室（105）',
        auditStatus: '通过',
        useStatus: '进行中'
      }
    ])

    // 全部借用数据
    const allBookingData = ref([
      {
        id: 1,
        bookingName: '【教师人员专】的配置管理',
        bookingTime: '2025.04.24 第一节次、第二节次、第三节次、第四节次',
        description: '各类通过这里发布各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息',
        applicant: '张老师',
        roomName: '多媒体教室（101）',
        auditStatus: '待审核',
        useStatus: '未开始'
      },
      {
        id: 2,
        bookingName: '【学生活动】社团会议',
        bookingTime: '2025.04.25 第一节次、第二节次',
        description: '学生社团定期会议活动安排',
        applicant: '李同学',
        roomName: '多媒体教室（102）',
        auditStatus: '通过',
        useStatus: '未开始'
      },
      {
        id: 3,
        bookingName: '【教师培训】新教师培训',
        bookingTime: '2025.04.26 第一节次、第二节次、第三节次',
        description: '新入职教师培训活动',
        applicant: '王主任',
        roomName: '多媒体教室（103）',
        auditStatus: '通过',
        useStatus: '进行中'
      }
    ])

    // 房间数据
    const rooms = ref([
      { id: 1, name: '多媒体教室（101）', capacity: '未设置', available: false, building: '达力楼', floor: '1F' },
      { id: 2, name: '多媒体教室（102）', capacity: '20人', available: true, building: '达力楼', floor: '1F' },
      { id: 3, name: '多媒体教室（103）', capacity: '20人', available: true, building: '达力楼', floor: '1F' },
      { id: 4, name: '多媒体教室（104）', capacity: '20人', available: true, building: '达力楼', floor: '1F' },
      { id: 5, name: '多媒体教室（105）', capacity: '20人', available: true, building: '达力楼', floor: '1F' },
      { id: 6, name: '多媒体教室（106）', capacity: '20人', available: true, building: '达力楼', floor: '1F' },
      { id: 7, name: '多媒体教室（107）', capacity: '20人', available: false, building: '达力楼', floor: '1F' },
      { id: 8, name: '多媒体教室（201）', capacity: '20人', available: true, building: '达力楼', floor: '2F' },
      { id: 9, name: '多媒体教室（202）', capacity: '20人', available: true, building: '达力楼', floor: '2F' }
    ])

    // 审批管理相关
    const approvalFilters = reactive({
      name: '',
      applicant: '',
      timeRange: []
    })

    const approvalPagination = reactive({
      currentPage: 1,
      pageSize: 10,
      total: 0
    })

    // 审批状态导航
    const approvalStatusItems = [
      { key: 'all', label: '待审批', icon: 'Clock' },
      { key: 'approved', label: '已通过', icon: 'CircleCheck' },
      { key: 'rejected', label: '已拒绝', icon: 'CircleClose' }
    ]

    const activeApprovalStatus = ref('all')

    // 审批数据
    const approvalData = ref([
      {
        id: 1,
        bookingName: '【教师人员专】的配置管理',
        bookingTime: '2025.04.24 第一节次、第二节次、第三节次、第四节次',
        description: '各类通过这里发布各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息',
        applicant: '王玲',
        roomName: '多媒体教室（101）',
        auditStatus: '待审核'
      },
      {
        id: 2,
        bookingName: '【教师人员专】的配置管理',
        bookingTime: '2025.04.24 第一节次、第二节次、第三节次、第四节次',
        description: '各类通过这里发布各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息',
        applicant: '王玲',
        roomName: '多媒体教室（102）',
        auditStatus: '待审核'
      },
      {
        id: 3,
        bookingName: '【教师人员专】的配置管理',
        bookingTime: '2025.04.24 第一节次、第二节次、第三节次、第四节次',
        description: '各类通过这里发布各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息',
        applicant: '王玲',
        roomName: '多媒体教室（103）',
        auditStatus: '待审核'
      },
      {
        id: 4,
        bookingName: '【教师人员专】的配置管理',
        bookingTime: '2025.04.24 第一节次、第二节次、第三节次、第四节次',
        description: '各类通过这里发布各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息',
        applicant: '张老师',
        roomName: '多媒体教室（104）',
        auditStatus: '通过'
      },
      {
        id: 5,
        bookingName: '【教师人员专】的配置管理',
        bookingTime: '2025.04.24 第一节次、第二节次、第三节次、第四节次',
        description: '各类通过这里发布各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息进行各类信息',
        applicant: '李老师',
        roomName: '多媒体教室（105）',
        auditStatus: '拒绝'
      },
      {
        id: 6,
        bookingName: '【学生活动】社团会议',
        bookingTime: '2025.04.25 第一节次、第二节次',
        description: '学生社团定期会议活动安排',
        applicant: '李同学',
        roomName: '多媒体教室（106）',
        auditStatus: '通过'
      },
      {
        id: 7,
        bookingName: '【教师培训】新教师培训',
        bookingTime: '2025.04.26 第一节次、第二节次、第三节次',
        description: '新入职教师培训活动',
        applicant: '王主任',
        roomName: '多媒体教室（107）',
        auditStatus: '拒绝'
      }
    ])

    // 审批对话框相关
    const approvalDialogVisible = ref(false)
    const currentApprovalItem = ref(null)
    const approvalForm = reactive({
      result: '',
      comment: ''
    })

    // 设置模块相关
    const expandedGroups = ref(['房屋类型权限设置'])
    const activeSettingsMenu = ref('预约人员')

    // 预约人员数据
    const reservationPersonnel = ref([
      {
        id: 1,
        topic: '校园会议室第一、二层、三层可预约人员',
        allowedPersonnel: ['杨培', '郭培', '刘佳君', '赵芳', '演示帐', '王明', '陈东', '周涛', '赵楷强', '张培'],
        classrooms: [
          '多媒体教室（101）', '多媒体教室（102）', '多媒体教室（103）', 
          '多媒体教室（104）', '多媒体教室（105）', '多媒体教室（106）',
          '多媒体教室（107）', '多媒体教室（108）', '多媒体教室（109）', '多媒体教室（110）'
        ],
        creator: '张三',
        createTime: '2024.03.08 09:16:26'
      },
      {
        id: 2,
        topic: '校园会议室四层可预约人员',
        allowedPersonnel: ['杨培', '郭培', '刘佳君', '赵芳', '演示帐'],
        classrooms: ['清洁间'],
        creator: '张三',
        createTime: '2024.03.08 09:16:26'
      }
    ])

    // 时间设置数据
    const timeSettings = reactive({
      openTime: '',
      closeTime: '',
      advanceDays: 7,
      cancelHours: 2
    })

    // 计算属性
    const filteredRooms = computed(() => {
      return rooms.value.filter(room => {
        if (activeCategory.value === '全部') return true
        if (activeCategory.value === '达力楼') return room.building === '达力楼'
        return room.floor === activeCategory.value
      })
    })

    const paginatedBookingData = computed(() => {
      const start = (bookingPagination.currentPage - 1) * bookingPagination.pageSize
      const end = start + bookingPagination.pageSize
      bookingPagination.total = bookingData.value.length
      return bookingData.value.slice(start, end)
    })

    const paginatedAllBookingData = computed(() => {
      const start = (allBookingPagination.currentPage - 1) * allBookingPagination.pageSize
      const end = start + allBookingPagination.pageSize
      allBookingPagination.total = allBookingData.value.length
      return allBookingData.value.slice(start, end)
    })

    const paginatedApprovalData = computed(() => {
      const start = (approvalPagination.currentPage - 1) * approvalPagination.pageSize
      const end = start + approvalPagination.pageSize
      approvalPagination.total = filteredApprovalData.value.length
      return filteredApprovalData.value.slice(start, end)
    })

    // 根据选中状态过滤审批数据
    const filteredApprovalData = computed(() => {
      let filtered = approvalData.value
      
      // 根据状态过滤
      if (activeApprovalStatus.value === 'all') {
        filtered = filtered.filter(item => item.auditStatus === '待审核')
      } else if (activeApprovalStatus.value === 'approved') {
        filtered = filtered.filter(item => item.auditStatus === '通过')
      } else if (activeApprovalStatus.value === 'rejected') {
        filtered = filtered.filter(item => item.auditStatus === '拒绝')
      }

      // 根据搜索条件过滤
      if (approvalFilters.name) {
        filtered = filtered.filter(item => 
          item.bookingName.includes(approvalFilters.name)
        )
      }
      
      if (approvalFilters.applicant) {
        filtered = filtered.filter(item => 
          item.applicant.includes(approvalFilters.applicant)
        )
      }

      return filtered
    })

    // 方法
    const setActiveMenuItem = (item) => {
      activeMenuItem.value = item
    }

    const setActiveCategory = (category) => {
      activeCategory.value = category
    }

    const toggleCategory = (category) => {
      const index = expandedCategories.value.indexOf(category)
      if (index > -1) {
        expandedCategories.value.splice(index, 1)
      } else {
        expandedCategories.value.push(category)
      }
    }

    const bookRoom = (room) => {
      console.log('预约房间:', room)
    }

    const handleTimeRangeChange = (timeRange) => {
      console.log('时间范围变化:', timeRange)
    }

    const getStatusType = (status) => {
      const statusMap = {
        '待审核': 'warning',
        '通过': 'success',
        '拒绝': 'danger'
      }
      return statusMap[status] || 'info'
    }

    const getUseStatusType = (status) => {
      const statusMap = {
        '未开始': 'info',
        '进行中': 'success',
        '已结束': 'warning'
      }
      return statusMap[status] || 'info'
    }

    const handleSearch = () => {
      console.log('搜索:', searchFilters)
    }

    const handleResetFilters = () => {
      searchFilters.name = ''
      searchFilters.auditType = ''
      searchFilters.useStatus = ''
      searchFilters.startTime = ''
      searchFilters.endTime = ''
      searchFilters.timeRange = []
    }

    const handleAllBookingSearch = () => {
      console.log('全部借用搜索:', allBookingFilters)
    }

    const handleResetAllBookingFilters = () => {
      allBookingFilters.name = ''
      allBookingFilters.applicant = ''
      allBookingFilters.auditType = ''
      allBookingFilters.useStatus = ''
      allBookingFilters.startTime = ''
      allBookingFilters.endTime = ''
      allBookingFilters.timeRange = []
    }

    const handleEdit = (row) => {
      console.log('编辑:', row)
    }

    const handleApprove = (row) => {
      console.log('审核:', row)
    }

    const handleBookingSizeChange = (size) => {
      bookingPagination.pageSize = size
    }

    const handleBookingCurrentChange = (page) => {
      bookingPagination.currentPage = page
    }

    const handleAllBookingSizeChange = (size) => {
      allBookingPagination.pageSize = size
    }

    const handleAllBookingCurrentChange = (page) => {
      allBookingPagination.currentPage = page
    }

    // 审批管理相关方法
    const setActiveApprovalStatus = (status) => {
      activeApprovalStatus.value = status
      approvalPagination.currentPage = 1  // 重置到第一页
    }

    const getStatusCount = (status) => {
      if (status === 'all') {
        return approvalData.value.filter(item => item.auditStatus === '待审核').length
      } else if (status === 'approved') {
        return approvalData.value.filter(item => item.auditStatus === '通过').length
      } else if (status === 'rejected') {
        return approvalData.value.filter(item => item.auditStatus === '拒绝').length
      }
      return 0
    }

    const getApprovalStatusType = (status) => {
      const statusMap = {
        '待审核': 'warning',
        '通过': 'success',
        '拒绝': 'danger'
      }
      return statusMap[status] || 'info'
    }

    const handleApprovalSearch = () => {
      console.log('审批搜索:', approvalFilters)
    }

    const handleResetApprovalFilters = () => {
      approvalFilters.name = ''
      approvalFilters.applicant = ''
      approvalFilters.timeRange = []
    }

    const handleApprovalSizeChange = (size) => {
      approvalPagination.pageSize = size
    }

    const handleApprovalCurrentChange = (page) => {
      approvalPagination.currentPage = page
    }

    const showApprovalDialog = (item) => {
      currentApprovalItem.value = item
      approvalForm.result = ''
      approvalForm.comment = ''
      approvalDialogVisible.value = true
    }

    const handleApprovalDialogClose = () => {
      approvalDialogVisible.value = false
      currentApprovalItem.value = null
      approvalForm.result = ''
      approvalForm.comment = ''
    }

    const submitApproval = () => {
      if (!approvalForm.result) {
        return
      }

      // 更新审批状态
      const item = approvalData.value.find(item => item.id === currentApprovalItem.value.id)
      if (item) {
        item.auditStatus = approvalForm.result
      }

      // 这里可以添加API调用
      console.log('提交审批:', {
        id: currentApprovalItem.value.id,
        result: approvalForm.result,
        comment: approvalForm.comment
      })

      handleApprovalDialogClose()
      
      // 显示成功消息
      ElMessage.success('审批提交成功！')
    }

    // 设置模块相关方法
    const toggleGroup = (groupName) => {
      const index = expandedGroups.value.indexOf(groupName)
      if (index > -1) {
        expandedGroups.value.splice(index, 1)
      } else {
        expandedGroups.value.push(groupName)
      }
    }

    const setActiveSettingsMenu = (menu) => {
      activeSettingsMenu.value = menu
    }

    const viewMore = (item) => {
      console.log('查看详情:', item)
    }

    const editItem = (item) => {
      console.log('编辑:', item)
    }

    const deleteItem = (item) => {
      console.log('删除:', item)
    }

    return {
      mainTabs,
      activeMainTab,
      setActiveMainTab,
      stats,
      menuItems,
      activeMenuItem,
      activeCategory,
      expandedCategories,
      searchKeyword,
      floors,
      searchFilters,
      bookingPagination,
      allBookingFilters,
      allBookingPagination,
      bookingData,
      allBookingData,
      rooms,
      filteredRooms,
      paginatedBookingData,
      paginatedAllBookingData,
      paginatedApprovalData,
      filteredApprovalData,
      approvalFilters,
      approvalPagination,
      approvalData,
      approvalStatusItems,
      activeApprovalStatus,
      approvalDialogVisible,
      currentApprovalItem,
      approvalForm,
      expandedGroups,
      activeSettingsMenu,
      reservationPersonnel,
      timeSettings,
      Search,
      setActiveMenuItem,
      setActiveCategory,
      toggleCategory,
      setActiveApprovalStatus,
      getStatusCount,
      toggleGroup,
      setActiveSettingsMenu,
      viewMore,
      editItem,
      deleteItem,
      bookRoom,
      handleTimeRangeChange,
      getStatusType,
      getUseStatusType,
      getApprovalStatusType,
      handleSearch,
      handleResetFilters,
      handleAllBookingSearch,
      handleResetAllBookingFilters,
      handleApprovalSearch,
      handleResetApprovalFilters,
      handleEdit,
      handleApprove,
      handleBookingSizeChange,
      handleBookingCurrentChange,
      handleAllBookingSizeChange,
      handleAllBookingCurrentChange,
      handleApprovalSizeChange,
      handleApprovalCurrentChange,
      showApprovalDialog,
      handleApprovalDialogClose,
      submitApproval
    }
  }
}
</script>

<style scoped>
.room-booking {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.header {
  height: 60px;
  background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-left .title {
  font-size: 18px;
  font-weight: 600;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.username {
  font-size: 14px;
}

.dropdown-link {
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  transition: all 0.3s;
}

.dropdown-link:hover {
  background: rgba(255, 255, 255, 0.1);
}

.main-nav {
  background: white;
  border-bottom: 1px solid #e8e8e8;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.nav-tabs {
  display: flex;
  padding: 0 20px;
}

.nav-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 15px 25px;
  cursor: pointer;
  transition: all 0.3s;
  color: #666;
  font-weight: 500;
  border-bottom: 3px solid transparent;
  position: relative;
}

.nav-tab:hover {
  color: #4A90E2;
  background-color: #f8f9fa;
}

.nav-tab.active {
  color: #4A90E2;
  border-bottom-color: #4A90E2;
  background-color: #f0f7ff;
}

.main-content {
  flex: 1;
  min-height: calc(100vh - 120px);
}

/* 内容占位符样式 */
.content-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: #999;
  background: white;
  margin: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.content-placeholder h3 {
  margin: 20px 0 10px 0;
  color: #666;
  font-size: 24px;
}

.content-placeholder p {
  margin: 0;
  font-size: 16px;
}

/* 审批管理样式 */
.approval-management {
  min-height: calc(100vh - 120px);
}

.approval-layout {
  display: flex;
  height: calc(100vh - 120px);
  gap: 0;
}

/* 审批左侧状态导航 */
.approval-sidebar {
  width: 220px;
  background: white;
  border-right: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
}

.approval-sidebar .sidebar-header {
  padding: 15px 18px;
  border-bottom: 1px solid #e8e8e8;
  background: #4A90E2;
  color: white;
}

.approval-sidebar .sidebar-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.approval-sidebar .sidebar-menu {
  flex: 1;
}

.approval-sidebar .menu-item {
  padding: 12px 18px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #666;
  border-left: 3px solid transparent;
  transition: all 0.3s;
  font-size: 13px;
  line-height: 1.5;
  white-space: nowrap;
  position: relative;
}

.approval-sidebar .menu-item:hover {
  background: #f5f5f5;
  color: #333;
}

.approval-sidebar .menu-item.active {
  background: #e6f3ff;
  color: #4A90E2;
  border-left-color: #4A90E2;
  font-weight: 500;
}

.approval-sidebar .menu-item .count {
  margin-left: auto;
  background: #f0f0f0;
  color: #666;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
}

.approval-sidebar .menu-item.active .count {
  background: #4A90E2;
  color: white;
}

.approval-sidebar .menu-item .el-icon {
  font-size: 13px;
}

/* 审批主要内容区域 */
.approval-main-content {
  flex: 1;
  padding: 20px;
  background: #f9f9f9;
  overflow-y: auto;
}

.approval-table {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 设置模块样式 */
.settings-management {
  min-height: calc(100vh - 120px);
}

.settings-layout {
  display: flex;
  height: calc(100vh - 120px);
  gap: 0;
}

/* 设置左侧层级导航 */
.settings-sidebar {
  width: 260px;
  background: white;
  border-right: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
}

.settings-sidebar .sidebar-header {
  padding: 20px 25px;
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

/* 菜单组样式 */
.menu-group {
  border-bottom: 1px solid #f0f0f0;
}

.menu-group-title {
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

.menu-group-title:hover {
  background: #f0f7ff;
  color: #4A90E2;
}

.menu-group-title.expanded {
  background: #e6f3ff;
  color: #4A90E2;
  border-left-color: #4A90E2;
}

.menu-group-title .el-icon {
  transition: transform 0.3s;
  font-size: 14px;
}

.menu-group-title.expanded .el-icon {
  transform: rotate(180deg);
}

/* 子菜单样式 */
.submenu {
  background: white;
}

.submenu-item {
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

.submenu-item:hover {
  background: #f5f5f5;
  color: #333;
}

.submenu-item.active {
  background: #e6f3ff;
  color: #4A90E2;
  border-left-color: #4A90E2;
  font-weight: 500;
}

.submenu-item .el-icon {
  font-size: 13px;
}

/* 设置主要内容区域 */
.settings-main-content {
  flex: 1;
  background: #f9f9f9;
  overflow-y: auto;
}

.settings-page {
  padding: 20px;
  min-height: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.page-header h2 {
  margin: 0;
  color: #333;
  font-size: 20px;
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 10px;
}

/* 内容表格样式 */
.content-table {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.personnel-list,
.classroom-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  max-width: 300px;
}

.person-tag,
.classroom-tag {
  display: inline-block;
  background: #f0f2f5;
  color: #666;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
}

/* 设置表单样式 */
.settings-form {
  background: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-desc {
  margin-left: 15px;
  color: #999;
  font-size: 13px;
}

.truncated-text {
  display: inline-block;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 审批对话框样式 */
.approval-dialog-content {
  padding: 20px 0;
}

.approval-info {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.approval-info h4,
.approval-action h4 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.info-item.full-width {
  grid-column: 1 / -1;
  flex-direction: column;
  gap: 5px;
}

.info-item label {
  font-weight: 600;
  color: #666;
  min-width: 80px;
  flex-shrink: 0;
}

.info-item span {
  color: #333;
  line-height: 1.5;
}

.approval-action .el-radio {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-right: 30px;
}

.dialog-footer {
  text-align: right;
}

/* 借用管理页面样式 */
.booking-management {
  height: calc(100vh - 120px);
}

.booking-layout {
  display: flex;
  height: 100%;
  gap: 0;
}

/* 左侧功能菜单 */
.left-sidebar {
  width: 260px;
  background: white;
  border-right: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 15px 18px;
  border-bottom: 1px solid #e8e8e8;
  background: #4A90E2;
  color: white;
}

.left-sidebar .sidebar-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.sidebar-menu {
  flex: 1;
}

.menu-item {
  padding: 10px 18px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #666;
  border-left: 3px solid transparent;
  transition: all 0.3s;
  font-size: 13px;
  line-height: 1.5;
  white-space: nowrap;
}

.menu-item:hover {
  background: #f5f5f5;
  color: #333;
}

.menu-item.active {
  background: #e6f3ff;
  color: #4A90E2;
  border-left-color: #4A90E2;
  font-weight: 500;
}

.menu-item .el-icon {
  font-size: 13px;
}

/* 中间楼宇分类 */
.middle-sidebar {
  width: 200px;
  background: white;
  border-right: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
  padding: 15px;
}

.search-box {
  margin-bottom: 15px;
}

.category-tree {
  flex: 1;
  overflow-y: auto;
}

.category-item {
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
  color: #666;
  font-size: 14px;
}

.category-item:hover {
  background: #f5f5f5;
  color: #333;
}

.category-item.active {
  background: #e6f3ff;
  color: #4A90E2;
}

.category-item.expandable {
  justify-content: space-between;
}

.expand-icon {
  transition: transform 0.3s;
}

.expand-icon.expanded {
  transform: rotate(180deg);
}

.category-group {
  margin-bottom: 5px;
}

.sub-categories {
  margin-left: 20px;
  border-left: 1px solid #e8e8e8;
  padding-left: 10px;
}

.sub-category {
  padding: 6px 12px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
  color: #666;
  font-size: 13px;
}

.sub-category:hover {
  background: #f5f5f5;
  color: #333;
}

.sub-category.active {
  background: #e6f3ff;
  color: #4A90E2;
}

.room-booking-content {
  display: flex;
  flex: 1;
}

/* 右侧房间列表 */
.room-list {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: #f9f9f9;
}

.room-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.room-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  border: 2px solid transparent;
}

.room-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.room-card.unavailable {
  background: #ff4d4f;
  color: white;
}

.room-card.unavailable .room-header h4 {
  color: white;
}

.room-card:not(.unavailable) {
  background: #52c41a;
  color: white;
}

.room-card:not(.unavailable) .room-header h4 {
  color: white;
}

.room-header {
  margin-bottom: 15px;
}

.room-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.room-info {
  margin-bottom: 15px;
}

.capacity {
  font-size: 14px;
  opacity: 0.9;
}

.room-actions {
  display: flex;
  justify-content: center;
}

.room-actions .el-button {
  width: 100%;
  border-radius: 20px;
  font-weight: 500;
}

/* 我的预约和全部借用列表页面样式 */
.my-bookings,
.all-bookings {
  flex: 1;
  padding: 20px;
  background: #f9f9f9;
}

.search-filters {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: flex-end;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 200px;
}

.filter-item label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.filter-actions {
  display: flex;
  gap: 10px;
}

.booking-table {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.pagination {
  display: flex;
  justify-content: center;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .booking-layout,
  .approval-layout,
  .settings-layout {
    flex-direction: column;
  }
  
  .left-sidebar, 
  .middle-sidebar,
  .approval-sidebar,
  .settings-sidebar {
    width: 100%;
    height: auto;
  }
  
  .left-sidebar,
  .approval-sidebar,
  .settings-sidebar {
    max-height: 200px;
  }
  
  .middle-sidebar {
    max-height: 200px;
  }
  
  .filter-row {
    flex-direction: column;
    gap: 15px;
  }
  
  .filter-item {
    min-width: 100%;
  }

  .page-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }

  .header-actions {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .nav-tabs {
    overflow-x: auto;
    padding: 0 10px;
  }

  .nav-tab {
    flex-shrink: 0;
    padding: 15px 20px;
  }

  .room-grid {
    grid-template-columns: 1fr;
  }
  
  .left-sidebar, 
  .middle-sidebar,
  .approval-sidebar,
  .settings-sidebar {
    max-height: 150px;
  }
  
  .my-bookings, 
  .all-bookings,
  .approval-main-content,
  .settings-main-content {
    padding: 15px;
  }

  .settings-page {
    padding: 15px;
  }
  
  .search-filters,
  .settings-form {
    padding: 15px;
  }
  
  .booking-table,
  .approval-table,
  .content-table {
    padding: 15px;
  }
  
  .filter-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .filter-actions .el-button {
    width: 100%;
  }

  .personnel-list,
  .classroom-list {
    max-width: 100%;
  }
}
</style>