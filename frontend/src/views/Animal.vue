<template>
  <div class="page-container">
    <a-card :bordered="false" class="search-card">
      <a-form layout="inline" class="search-form">
        <a-form-item label="搜索动物">
          <a-input v-model:value="searchQuery" placeholder="请输入名称或品种" allowClear>
            <template #prefix><SearchOutlined /></template>
          </a-input>
        </a-form-item>
        <a-form-item label="分类筛选">
          <a-select v-model:value="filterType" placeholder="全部" allowClear style="width: 180px;">
            <a-select-option v-for="cat in animalStore.categories" :key="cat.name" :value="cat.name">{{ cat.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="() => {}">
            <template #icon><SearchOutlined /></template>
            查询
          </a-button>
          <a-button style="margin-left: 8px" @click="resetSearch">
            <template #icon><ReloadOutlined /></template>
            重置
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>

    <a-card :bordered="false" class="table-card">
      <template #title>
        <div class="card-header">
          <span class="title">动物列表</span>
          <div class="header-actions">
             <a-button v-if="userStore.isAdmin" type="primary" @click="openDialog()">
               <template #icon><PlusOutlined /></template>
               新增动物
             </a-button>
          </div>
        </div>
      </template>

      <a-table 
        :dataSource="filteredAnimals" 
        :columns="columns" 
        :pagination="paginationConfig"
        :loading="loading"
        rowKey="id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <span style="font-weight: 500; color: #1890ff; cursor: pointer;">{{ record.name }}</span>
          </template>
          <template v-else-if="column.key === 'type'">
            <a-tag>{{ record.type }}</a-tag>
          </template>
          <template v-else-if="column.key === 'gender'">
            <a-tag :color="record.gender === '公' ? 'blue' : (record.gender === '母' ? 'pink' : 'default')">
              {{ record.gender }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'health'">
             <a-badge :status="getHealthStatusType(record.health)" :text="record.health" />
          </template>
          <template v-else-if="column.key === 'action'">
            <a-button type="link" size="small" @click="openDialog(record)">编辑</a-button>
            <a-divider type="vertical" />
            <a-button type="link" danger size="small" @click="handleDelete(record.id)">删除</a-button>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- Add/Edit Dialog -->
    <a-modal v-model:open="dialogVisible" :title="isEdit ? '编辑动物信息' : '新增动物'" width="600px" destroyOnClose centered @ok="saveAnimal">
      <a-form :model="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" class="dialog-form">
        <a-row :gutter="20">
          <a-col :span="12">
             <a-form-item label="名称" required name="name" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
              <a-input v-model:value="form.name" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="分类" required name="type" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
              <a-select v-model:value="form.type" placeholder="请选择分类" style="width: 100%;">
                <a-select-option v-for="cat in animalStore.categories" :key="cat.name" :value="cat.name">{{ cat.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        
        <a-row :gutter="20">
          <a-col :span="12">
            <a-form-item label="品种" name="breed" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
              <a-input v-model:value="form.breed" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
             <a-form-item label="性别" name="gender" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
              <a-radio-group v-model:value="form.gender">
                <a-radio value="公">公</a-radio>
                <a-radio value="母">母</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="20">
          <a-col :span="12">
            <a-form-item label="年龄" name="age" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
              <a-input-number v-model:value="form.age" :min="0" style="width: 100%;" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
             <a-form-item label="体重" name="weight" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
              <a-input-number v-model:value="form.weight" :min="0" :precision="2" style="width: 100%;" addon-after="kg" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="20">
          <a-col :span="12">
            <a-form-item label="健康状态" name="health" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
              <a-select v-model:value="form.health" style="width: 100%;">
                <a-select-option value="健康">健康</a-select-option>
                <a-select-option value="一般">一般</a-select-option>
                <a-select-option value="生病">生病</a-select-option>
                <a-select-option value="受伤">受伤</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="上次体检" name="lastCheckup" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
              <a-date-picker v-model:value="form.lastCheckup" value-format="YYYY-MM-DD" style="width: 100%;" placeholder="选择日期" />
            </a-form-item>
          </a-col>
        </a-row>
        
        <a-form-item label="来源" name="source" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-input v-model:value="form.source" />
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

const animalStore = useAnimalStore()
const userStore = useUserStore()

const searchQuery = ref('')
const filterType = ref(undefined)
const currentPage = ref(1)
const pageSize = ref(10)
const dialogVisible = ref(false)
const isEdit = ref(false)
const loading = ref(false)

const form = reactive({
  id: null,
  name: '',
  type: undefined,
  breed: '',
  gender: '公',
  age: 0,
  weight: 0,
  health: '健康',
  source: '',
  lastCheckup: ''
})

const filteredAnimals = computed(() => {
  const result = animalStore.animals.filter(animal => {
    const matchName = animal.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                      (animal.breed && animal.breed.toLowerCase().includes(searchQuery.value.toLowerCase()))
    const matchType = filterType.value ? animal.type === filterType.value : true
    return matchName && matchType
  })
  return result.sort((a, b) => b.id - a.id)
})

const paginationConfig = computed(() => ({
  total: filteredAnimals.value.length,
  current: currentPage.value,
  pageSize: pageSize.value,
  showSizeChanger: true,
  showTotal: (total) => `共 ${total} 条`,
  onChange: (page, size) => {
    currentPage.value = page
    pageSize.value = size
  }
}))

const columns = [
  { title: '编号', dataIndex: 'id', width: 80, align: 'center', sorter: (a, b) => a.id - b.id },
  { title: '名称', dataIndex: 'name', key: 'name', minWidth: 120 },
  { title: '分类', dataIndex: 'type', key: 'type', width: 120 },
  { title: '品种', dataIndex: 'breed', key: 'breed', minWidth: 120, ellipsis: true },
  { title: '性别', dataIndex: 'gender', key: 'gender', width: 80, align: 'center' },
  { title: '年龄', dataIndex: 'age', key: 'age', width: 80, align: 'center', sorter: (a, b) => a.age - b.age },
  { title: '体重(kg)', dataIndex: 'weight', key: 'weight', width: 100, align: 'right' },
  { title: '健康状态', dataIndex: 'health', key: 'health', width: 120, align: 'center' },
  { title: '上次体检', dataIndex: 'lastCheckup', key: 'lastCheckup', width: 120, align: 'center', sorter: (a, b) => new Date(a.lastCheckup) - new Date(b.lastCheckup) },
  ...(userStore.isAdmin ? [{ title: '操作', key: 'action', width: 150, fixed: 'right', align: 'center' }] : [])
]

const handleTableChange = (pagination) => {
  currentPage.value = pagination.current
  pageSize.value = pagination.pageSize
}

const resetSearch = () => {
  searchQuery.value = ''
  filterType.value = undefined
}

const getHealthStatusType = (status) => {
  if (status === '健康') return 'success'
  if (status === '一般') return 'warning'
  return 'error'
}

const openDialog = (animal = null) => {
  if (animal) {
    isEdit.value = true
    Object.assign(form, {
      ...animal,
      lastCheckup: animal.lastCheckup || ''
    })
  } else {
    isEdit.value = false
    Object.assign(form, {
      id: null,
      name: '',
      type: undefined,
      breed: '',
      gender: '公',
      age: 0,
      weight: 0,
      health: '健康',
      source: '',
      lastCheckup: ''
    })
  }
  dialogVisible.value = true
}

const saveAnimal = () => {
  if (!form.name || !form.type) {
    message.warning('请填写必要信息')
    return
  }

  if (isEdit.value) {
    animalStore.updateAnimal(form.id, { ...form })
    message.success('更新成功')
  } else {
    animalStore.addAnimal({ ...form })
    message.success('添加成功')
  }
  dialogVisible.value = false
}

const handleDelete = (id) => {
  Modal.confirm({
    title: '提示',
    content: '确定要删除这只动物吗？',
    okText: '确定',
    cancelText: '取消',
    type: 'warning',
    onOk: () => {
      animalStore.deleteAnimal(id)
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

.search-form .ant-form-item {
  margin-bottom: 0;
  margin-right: 24px;
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
