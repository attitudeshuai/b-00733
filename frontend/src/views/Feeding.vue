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
          <span class="title">饲养记录</span>
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
          <template v-if="column.key === 'amount'">
            {{ record.amount }} {{ record.unit }}
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
      :title="isEdit ? '编辑饲养记录' : '新增饲养记录'"
      @ok="saveRecord"
      width="500px"
    >
      <a-form :model="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }" ref="formRef" :rules="rules">
        <a-form-item label="动物" name="animalId">
          <a-select v-model:value="form.animalId" placeholder="请选择动物" style="width: 100%">
            <a-select-option v-for="animal in animalStore.animals" :key="animal.id" :value="animal.id">
              {{ animal.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="日期" name="date">
          <a-date-picker v-model:value="form.date" placeholder="选择日期" value-format="YYYY-MM-DD" style="width: 100%" />
        </a-form-item>
        <a-form-item label="时间" name="time">
          <a-time-picker v-model:value="form.time" placeholder="选择时间" format="HH:mm" value-format="HH:mm" style="width: 100%" />
        </a-form-item>
        <a-form-item label="食物" name="food">
          <a-input v-model:value="form.food" placeholder="例如：狗粮、竹子" />
        </a-form-item>
        <a-form-item label="投喂量" name="amount">
          <a-row :gutter="10">
            <a-col :span="16">
              <a-input-number v-model:value="form.amount" :min="0" :precision="2" style="width: 100%" />
            </a-col>
            <a-col :span="8">
               <a-select v-model:value="form.unit" placeholder="单位">
                <a-select-option value="kg">kg</a-select-option>
                <a-select-option value="g">g</a-select-option>
                <a-select-option value="个">个</a-select-option>
                <a-select-option value="份">份</a-select-option>
              </a-select>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item label="饲养员" name="feeder">
          <a-input v-model:value="form.feeder" placeholder="请输入饲养员姓名" />
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

const formRef = ref(null)
const form = reactive({
  animalId: undefined,
  date: undefined,
  time: undefined,
  food: '',
  amount: 0,
  unit: 'kg',
  feeder: ''
})

const rules = {
  animalId: [{ required: true, message: '请选择动物', trigger: 'change' }],
  date: [{ required: true, message: '请选择日期', trigger: 'change' }],
  time: [{ required: true, message: '请选择时间', trigger: 'change' }],
  food: [{ required: true, message: '请输入食物名称', trigger: 'blur' }],
  amount: [{ required: true, message: '请输入投喂量', trigger: 'blur' }],
  feeder: [{ required: true, message: '请输入饲养员', trigger: 'blur' }]
}

const filteredRecords = computed(() => {
  let records = animalStore.feedingRecords
  if (selectedAnimal.value) {
    records = records.filter(r => r.animalId === selectedAnimal.value)
  }
  return records
})

const columns = [
  { title: '日期', dataIndex: 'date', key: 'date', width: 120, sorter: (a, b) => new Date(a.date) - new Date(b.date) },
  { title: '时间', dataIndex: 'time', key: 'time', width: 100 },
  { title: '动物名称', key: 'animalName', width: 150 },
  { title: '食物', dataIndex: 'food', key: 'food', width: 150 },
  { title: '投喂量', key: 'amount', width: 120 },
  { title: '饲养员', dataIndex: 'feeder', key: 'feeder', width: 120 },
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
      time: now.format('HH:mm'),
      food: '',
      amount: 0,
      unit: 'kg',
      feeder: userStore.currentUser?.name || ''
    })
  }
  dialogVisible.value = true
}

const saveRecord = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
    if (isEdit.value) {
      animalStore.updateFeedingRecord(currentId.value, { ...form })
      message.success('更新成功')
    } else {
      animalStore.addFeedingRecord({ ...form })
      message.success('添加成功')
    }
    dialogVisible.value = false
  } catch (error) {
    // validation failed
  }
}

const handleDelete = (id) => {
  Modal.confirm({
    title: '提示',
    content: '确定要删除这条记录吗？',
    okText: '确定',
    cancelText: '取消',
    type: 'warning',
    onOk: () => {
      animalStore.deleteFeedingRecord(id)
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
