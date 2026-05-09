<template>
  <a-layout class="layout-container">
    <a-layout-sider width="220" class="aside" :trigger="null" collapsible>
      <div class="logo">
        <img src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" alt="logo" class="logo-img" />
        <h1 class="logo-text">动物管理系统</h1>
      </div>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        theme="dark"
        mode="inline"
        class="ant-menu-vertical"
      >
        <a-menu-item key="/dashboard" @click="navigateTo('/dashboard')">
          <template #icon><DashboardOutlined /></template>
          <span>仪表盘</span>
        </a-menu-item>
        <a-menu-item key="/animals" @click="navigateTo('/animals')">
           <template #icon><UnorderedListOutlined /></template>
          <span>动物列表</span>
        </a-menu-item>
        <a-menu-item key="/categories" @click="navigateTo('/categories')">
           <template #icon><FolderOpenOutlined /></template>
          <span>分类管理</span>
        </a-menu-item>
        <a-menu-item key="/feeding" @click="navigateTo('/feeding')">
           <template #icon><CoffeeOutlined /></template>
          <span>饲养记录</span>
        </a-menu-item>
        <a-menu-item key="/health" @click="navigateTo('/health')">
           <template #icon><MedicineBoxOutlined /></template>
          <span>健康记录</span>
        </a-menu-item>
        <a-menu-item key="/users" v-if="userStore.isAdmin" @click="navigateTo('/users')">
           <template #icon><UserOutlined /></template>
          <span>用户管理</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    
    <a-layout>
      <a-layout-header class="header">
        <div class="header-left">
          <a-breadcrumb separator="/">
            <a-breadcrumb-item href="/">首页</a-breadcrumb-item>
            <a-breadcrumb-item>{{ currentRouteName }}</a-breadcrumb-item>
          </a-breadcrumb>
        </div>
        <div class="header-right">
          <a-dropdown>
            <span class="ant-dropdown-link">
              <a-avatar :size="24" class="user-avatar" icon="user">
                <template #icon><UserOutlined /></template>
              </a-avatar>
              <span class="username">{{ userStore.currentUser?.nickname || userStore.username || '管理员' }}</span>
              <DownOutlined />
            </span>
            <template #overlay>
              <a-menu @click="handleCommand">
                <a-menu-item key="profile">个人中心</a-menu-item>
                <a-menu-divider />
                <a-menu-item key="logout">退出登录</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>
      
      <a-layout-content class="main">
        <div class="content-wrapper">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
        <Footer />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import Footer from '../components/Footer.vue'
import { 
  DashboardOutlined, 
  UnorderedListOutlined, 
  FolderOpenOutlined, 
  MedicineBoxOutlined, 
  DownOutlined, 
  CoffeeOutlined, 
  UserOutlined 
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const selectedKeys = ref([route.path])

watch(() => route.path, (newPath) => {
  selectedKeys.value = [newPath]
})

const currentRouteName = computed(() => {
  if (route.meta && route.meta.title) return route.meta.title
  
  switch (route.path) {
    case '/': return '仪表盘'
    case '/dashboard': return '仪表盘'
    case '/animals': return '动物列表'
    case '/categories': return '分类管理'
    case '/health': return '健康记录'
    default: return ''
  }
})

const navigateTo = (path) => {
  router.push(path)
}

const handleCommand = ({ key }) => {
  if (key === 'logout') {
    userStore.logout()
    message.success('已退出登录')
    router.push('/login')
  } else if (key === 'profile') {
    router.push('/profile')
  }
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.aside {
  background-color: #001529;
  box-shadow: 2px 0 8px 0 rgba(29, 35, 41, 0.05);
  z-index: 10;
}

.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #002140;
  padding: 0 16px;
  overflow: hidden;
  transition: all 0.3s;
}

.logo-img {
  height: 32px;
  margin-right: 12px;
}

.logo-text {
  color: #fff;
  font-size: 18px;
  margin: 0;
  font-weight: 600;
  white-space: nowrap;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* Ant Design Menu Item Styles */
:deep(.ant-menu-item) {
  margin: 4px !important;
  width: auto !important;
  border-radius: 4px;
}

.header {
  background-color: #fff;
  height: 64px;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  z-index: 9;
}

.header-right {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.ant-dropdown-link {
  display: flex;
  align-items: center;
  color: rgba(0, 0, 0, 0.85);
}

.ant-dropdown-link:hover {
  background-color: rgba(0, 0, 0, 0.025);
}

.user-avatar {
  background-color: #1890ff;
  margin-right: 8px;
}

.username {
  font-size: 14px;
  margin-right: 4px;
}

.main {
  background-color: #f0f2f5;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.content-wrapper {
  flex: 1;
  padding: 24px;
}
</style>
