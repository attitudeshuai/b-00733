<template>
  <div class="login-container">
    <div class="login-content">
      <div class="login-header">
        <img src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" alt="logo" class="logo" />
        <span class="title">动物管理系统</span>
      </div>
      <div class="login-desc">Ant Design 风格的现代化动物园后台管理系统</div>
      
      <a-card class="login-card" :body-style="{ padding: '40px' }" :bordered="false">
        <a-tabs v-model:activeKey="activeTab" class="login-tabs" centered>
          <a-tab-pane key="account" tab="账号密码登录">
            <a-form :model="loginForm" :rules="rules" ref="loginFormRef" layout="vertical" size="large">
              <a-form-item name="username">
                <a-input v-model:value="loginForm.username" placeholder="用户名: admin / visitor">
                  <template #prefix>
                    <UserOutlined />
                  </template>
                </a-input>
              </a-form-item>
              <a-form-item name="password">
                <a-input-password v-model:value="loginForm.password" placeholder="密码: 123456" @keyup.enter="handleLogin">
                  <template #prefix>
                    <LockOutlined />
                  </template>
                </a-input-password>
              </a-form-item>
              <div class="login-options">
                <a-checkbox v-model:checked="rememberMe">自动登录</a-checkbox>
              </div>
              <a-form-item>
                <a-button type="primary" class="login-btn" :loading="loading" @click="handleLogin" block>登录</a-button>
              </a-form-item>
            </a-form>
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </div>
    
    <div class="copyright">
      Copyright &copy; 2025 动物管理系统出品
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

const router = useRouter()
const userStore = useUserStore()
const loginFormRef = ref(null)
const loading = ref(false)
const activeTab = ref('account')
const rememberMe = ref(true)

const loginForm = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  try {
    await loginFormRef.value.validate()
    loading.value = true
    try {
      const success = await userStore.login(loginForm.username, loginForm.password)
      if (success) {
        message.success('登录成功')
        router.push('/')
      } else {
        message.error('用户名或密码错误')
      }
    } finally {
      loading.value = false
    }
  } catch (error) {
    console.log('Validation failed:', error)
  }
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
  background-image: url('https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg');
  background-repeat: no-repeat;
  background-position: center 110px;
  background-size: 100%;
}

.login-content {
  width: 100%;
  max-width: 600px;
  padding: 0 20px;
}

.login-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.logo {
  height: 44px;
  margin-right: 16px;
}

.title {
  font-size: 33px;
  color: rgba(0, 0, 0, 0.85);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-weight: 600;
}

.login-desc {
  margin-bottom: 40px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  text-align: center;
}

.login-card {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.login-tabs {
  margin-bottom: 24px;
}

:deep(.ant-tabs-nav::before) {
  border-bottom: 1px solid #f0f0f0;
}

:deep(.ant-tabs-tab) {
  font-size: 16px;
}

.login-btn {
  height: 40px;
  font-size: 16px;
}

.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.forgot-password {
  color: #1890ff;
  cursor: pointer;
}

.login-footer {
  margin-top: 24px;
  display: flex;
  align-items: center;
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
}

.icon-hover {
  margin-left: 12px;
  font-size: 20px;
  cursor: pointer;
  transition: color 0.3s;
}

.icon-hover:hover {
  color: #1890ff;
}

.register-link {
  flex: 1;
  text-align: right;
  color: #1890ff;
  cursor: pointer;
}

.copyright {
  margin-top: 48px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
}
</style>
