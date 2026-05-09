<template>
  <div class="page-container">
    <a-card :bordered="false" class="table-card">
      <template #title>
        <div class="card-header">
          <span class="title">用户管理</span>
          <div class="header-actions">
            <a-button type="primary" @click="openDialog()">
              <template #icon><PlusOutlined /></template>
              新增用户
            </a-button>
          </div>
        </div>
      </template>

      <a-table :dataSource="userStore.users" :columns="columns" rowKey="id">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'username'">
            <div style="display: flex; align-items: center;">
              <a-avatar size="small" style="margin-right: 12px; background-color: #1890ff;">
                <template #icon><UserOutlined /></template>
              </a-avatar>
              <span style="font-weight: 500;">{{ record.username }}</span>
            </div>
          </template>
          <template v-if="column.key === 'role'">
            <a-tag :color="record.role === 'admin' ? 'red' : 'green'">
              {{ record.role === 'admin' ? '管理员' : '普通用户' }}
            </a-tag>
          </template>
          <template v-if="column.key === 'password'">
            <span style="color: #999;">******</span>
          </template>
          <template v-if="column.key === 'action'">
            <a-button type="link" size="small" @click="openDialog(record)">编辑</a-button>
            <a-divider type="vertical" />
            <a-button type="link" danger size="small" @click="handleDelete(record.id)" :disabled="record.username === 'admin'">删除</a-button>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- Add/Edit User Dialog -->
    <a-modal
      v-model:open="dialogVisible"
      :title="isEdit ? '编辑用户' : '新增用户'"
      @ok="saveUser"
      width="400px"
    >
      <a-form :model="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }" ref="formRef" :rules="rules">
        <a-form-item label="用户名" name="username">
          <a-input v-model:value="form.username" :disabled="isEdit" placeholder="请输入用户名" />
        </a-form-item>
        <a-form-item label="密码" name="password">
          <a-input-password v-model:value="form.password" placeholder="请输入密码" />
        </a-form-item>
        <a-form-item label="角色" name="role">
          <a-select v-model:value="form.role" placeholder="请选择角色" style="width: 100%">
            <a-select-option value="admin">管理员</a-select-option>
            <a-select-option value="visitor">普通用户</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useUserStore } from '../stores/user'
import { message, Modal } from 'ant-design-vue'

const userStore = useUserStore()
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref(null)

const form = reactive({
  id: null,
  username: '',
  password: '',
  role: 'visitor'
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }]
}

const columns = [
  { title: '用户名', dataIndex: 'username', key: 'username', width: 200 },
  { title: '角色', dataIndex: 'role', key: 'role', width: 120 },
  { title: '密码', dataIndex: 'password', key: 'password', width: 200 },
  { title: '操作', key: 'action', width: 150, fixed: 'right' },
]

const openDialog = (user = null) => {
  if (user) {
    isEdit.value = true
    form.id = user.id
    form.username = user.username
    form.password = user.password
    form.role = user.role
  } else {
    isEdit.value = false
    form.id = null
    form.username = ''
    form.password = ''
    form.role = 'visitor'
  }
  dialogVisible.value = true
}

const saveUser = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
    if (isEdit.value) {
      userStore.updateUser(form)
      message.success('用户更新成功')
    } else {
      const success = userStore.addUser({ ...form })
      if (success) {
        message.success('用户添加成功')
      } else {
        message.error('用户名已存在')
        return
      }
    }
    dialogVisible.value = false
  } catch (error) {
    // validation failed
  }
}

const handleDelete = (id) => {
  Modal.confirm({
    title: '提示',
    content: '确定要删除该用户吗？',
    okText: '确定',
    cancelText: '取消',
    type: 'warning',
    onOk: () => {
      userStore.deleteUser(id)
      message.success('删除成功')
    }
  })
}
</script>

<style scoped>
.page-container {
  /* padding is handled by Layout main */
}

.table-card {
  min-height: 500px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 16px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
}
</style>
