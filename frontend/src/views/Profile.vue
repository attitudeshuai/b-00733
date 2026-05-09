<template>
  <div class="profile-container">
    <a-row :gutter="24">
      <a-col :span="8">
        <a-card hoverable class="profile-card">
          <div class="avatar-wrapper">
            <a-avatar :size="100" class="user-avatar-large">
              <template #icon><UserOutlined /></template>
            </a-avatar>
            <h2 class="username-large">{{ userStore.username || '管理员' }}</h2>
            <p class="role-tag">{{ userStore.role === 'admin' ? '系统管理员' : '普通用户' }}</p>
          </div>
          <a-divider />
          <div class="user-detail">
            <p><UserOutlined /> 用户ID: {{ userStore.currentUser?.id || '1' }}</p>
            <p><TeamOutlined /> 所属部门: 动物管理部</p>
            <p><EnvironmentOutlined /> 工作地点: 园区A区</p>
          </div>
        </a-card>
      </a-col>
      
      <a-col :span="16">
        <a-card title="个人信息" :bordered="false">
          <a-descriptions bordered :column="1">
            <a-descriptions-item label="用户名">
              {{ userStore.username }}
            </a-descriptions-item>
            <a-descriptions-item label="昵称">
              {{ userStore.currentUser?.nickname || userStore.username }}
            </a-descriptions-item>
            <a-descriptions-item label="邮箱">
              {{ userStore.currentUser?.email || '暂无' }}
            </a-descriptions-item>
            <a-descriptions-item label="角色">
              <a-tag :color="userStore.role === 'admin' ? 'red' : 'green'">
                {{ userStore.role === 'admin' ? '系统管理员' : '普通用户' }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="个人简介">
              {{ userStore.currentUser?.bio || '暂无简介' }}
            </a-descriptions-item>
          </a-descriptions>
        </a-card>
      </a-col>
    </a-row>

    <!-- Modify Modal Removed -->
  </div>
</template>

<script setup>
import { useUserStore } from '../stores/user'
import { UserOutlined, TeamOutlined, EnvironmentOutlined } from '@ant-design/icons-vue'

const userStore = useUserStore()
</script>

<style scoped>
.profile-container {
  /* padding is handled by layout */
}

.profile-card {
  text-align: center;
}

.avatar-wrapper {
  padding: 20px 0;
}

.user-avatar-large {
  background-color: #1890ff;
  margin-bottom: 20px;
}

.username-large {
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 4px;
}

.role-tag {
  color: rgba(0, 0, 0, 0.45);
}

.user-detail {
  text-align: left;
  padding: 0 20px;
}

.user-detail p {
  margin-bottom: 12px;
  color: rgba(0, 0, 0, 0.65);
}

.user-detail .anticon {
  margin-right: 8px;
}

.setting-form {
  max-width: 600px;
}
</style>
