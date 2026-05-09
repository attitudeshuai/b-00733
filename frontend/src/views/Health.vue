<template>
  <div class="page-container">
    <a-card :bordered="false" class="search-card">
      <a-form layout="inline" class="search-form">
        <a-form-item label="动物筛选">
          <a-select v-model:value="selectedAnimal" placeholder="全部动物" allowClear style="width: 200px;">
            <a-select-option v-for="animal in animalStore.animals" :key="animal.id" :value="animal.id">
              {{ animal.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="() => {}">
            <template #icon><SearchOutlined /></template>
            查询
          </a-button>
          <a-button @click="selectedAnimal = ''" style="margin-left: 8px;">
            <template #icon><ReloadOutlined /></template>
            重置
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>

    <a-card :bordered="false" class="table-card">
      <template #title>
        <div class="card-header">
          <span class="title">健康记录</span>
          <div class="header-actions">
            <a-button v-if="userStore.isAdmin" type="primary" @click="openDialog()">
              <template #icon><PlusOutlined /></template>
              新增记录
            </a-button>
          </div>
        </div>
      </template>

      <a-table 
        :dataSource="filteredRecords" 
        :columns="columns"
        :pagination="paginationConfig"
        :loading="loading"
        rowKey="id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'animalName'">
            <span style="font-weight: 500;">{{ getAnimalName(record.animalId) }}</span>
          </template>
          <template v-if="column.key === 'status'">
            <a-tag :color="getStatusType(record.status)">
              {{ record.status }}
            </a-tag>
          </template>
          <template v-if="column.key === 'action'">
            <a-button type="link" size="small" @click="openDialog(record)">编辑</a-button>
            <a-divider type="vertical" />
            <a-button type="link" danger size="small" @click="handleDelete(record.id)">删除</a-button>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- Add Record Dialog -->
    <a-modal
      v-model:open="dialogVisible"
      :title="isEdit ? '编辑健康记录' : '新增健康记录'"
      @ok="saveRecord"
      width="500px"
    >
      <a-form :model="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }" ref="formRef">
        <a-form-item label="动物">
          <a-select v-model:value="form.animalId" placeholder="请选择动物" style="width: 100%">
            <a-select-option v-for="animal in animalStore.animals" :key="animal.id" :value="animal.id">
              {{ animal.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="日期">
          <a-date-picker v-model:value="form.date" placeholder="选择日期" value-format="YYYY-MM-DD" style="width: 100%" />
        </a-form-item>
        <a-form-item label="健康状态">
           <a-select v-model:value="form.status" style="width: 100%">
            <a-select-option value="健康">健康</a-select-option>
            <a-select-option value="一般">一般</a-select-option>
            <a-select-option value="生病">生病</a-select-option>
            <a-select-option value="受伤">受伤</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="体重(kg)">
          <a-input-number v-model:value="form.weight" :min="0" :precision="2" style="width: 100%" />
        </a-form-item>
        <a-form-item label="备注">
          <a-textarea v-model:value="form.notes" :rows="3" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useAnimalStore } from '../stores/animal'
import { useUserStore } from '../stores/user'
import { message, Modal } from 'ant-design-vue'
import { SearchOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'

const animalStore = useAnimalStore()
const userStore = useUserStore()
const selectedAnimal = ref(undefined)
const dialogVisible = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const loading = ref(false)
const isEdit = ref(false)
const currentId = ref(null)

const form = reactive({
  animalId: undefined,
  date: undefined,
  status: '健康',
  weight: 0,
  notes: ''
})

const filteredRecords = computed(() => {
  let records = animalStore.healthRecords
  if (selectedAnimal.value) {
    records = records.filter(r => r.animalId === selectedAnimal.value)
  }
  return records
})

const columns = [
  { title: '检查日期', dataIndex: 'date', key: 'date', width: 150, sorter: (a, b) => new Date(a.date) - new Date(b.date) },
  { title: '动物名称', key: 'animalName', width: 150 },
  { title: '健康状态', dataIndex: 'status', key: 'status', width: 120 },
  { title: '体重(kg)', dataIndex: 'weight', key: 'weight', width: 120, align: 'right' },
  { title: '备注', dataIndex: 'notes', key: 'notes', ellipsis: true },
]

if (userStore.isAdmin) {
  columns.push({ title: '操作', key: 'action', width: 150, fixed: 'right' })
}

const paginationConfig = computed(() => ({
  current: currentPage.value,
  pageSize: pageSize.value,
  total: filteredRecords.value.length,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '50', '100'],
  showTotal: (total) => `共 ${total} 条`
}))

const handleTableChange = (pagination) => {
  currentPage.value = pagination.current
  pageSize.value = pagination.pageSize
}

const getAnimalName = (id) => {
  const animal = animalStore.animals.find(a => a.id === id)
  return animal ? animal.name : '未知'
}

const getStatusType = (status) => {
  if (status === '健康') return 'success'
  if (status === '一般') return 'warning'
  return 'error'
}

const openDialog = (record = null) => {
  if (record) {
    isEdit.value = true
    currentId.value = record.id
    Object.assign(form, record)
  } else {
    isEdit.value = false
    currentId.value = null
    const now = dayjs()
    Object.assign(form, {
      animalId: undefined,
      date: now.format('YYYY-MM-DD'),
      status: '健康',
      weight: 0,
      notes: ''
    })
  }
  dialogVisible.value = true
}

const saveRecord = () => {
  if (!form.animalId || !form.date) {
    message.warning('请填写必要信息')
    return
  }
  
  if (isEdit.value) {
    animalStore.updateHealthRecord(currentId.value, { ...form })
    message.success('更新成功')
  } else {
    animalStore.addHealthRecord({ ...form })
    message.success('记录添加成功')
  }
  dialogVisible.value = false
}

const handleDelete = (id) => {
  Modal.confirm({
    title: '提示',
    content: '确定要删除这条健康记录吗？',
    okText: '确定',
    cancelText: '取消',
    type: 'warning',
    onOk: () => {
      animalStore.deleteHealthRecord(id)
      message.success('删除成功')
    }
  })
}
</script>

<style scoped>
.page-container {
  /* padding is handled by Layout main */
}

.search-card {
  margin-bottom: 24px;
}

.search-form :deep(.ant-form-item) {
  margin-bottom: 0;
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