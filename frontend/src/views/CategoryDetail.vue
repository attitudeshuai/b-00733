<template>
  <div class="category-detail">
    <div class="toolbar">
      <div class="header-left">
        <a-button @click="$router.back()" type="text" shape="circle" style="margin-right: 15px;">
          <template #icon><ArrowLeftOutlined /></template>
        </a-button>
        <h3>{{ categoryName }} - 分类详情</h3>
      </div>
      <div class="header-right">
        <a-tag size="large" color="blue">{{ filteredAnimals.length }} 只动物</a-tag>
      </div>
    </div>

    <a-card :bordered="false" class="table-card">
      <div class="card-content-wrapper">
        <div v-if="categoryInfo" class="category-info">
          <p><strong>描述：</strong> {{ categoryInfo.desc || '暂无描述' }}</p>
        </div>
        
        <a-divider orientation="left">该分类下的动物列表</a-divider>

        <div class="table-wrapper">
          <a-table 
            :dataSource="filteredAnimals" 
            :columns="columns"
            :pagination="paginationConfig"
            rowKey="id"
            bordered
            @change="handleTableChange"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'gender'">
                <a-tag :color="record.gender === '公' ? 'blue' : (record.gender === '母' ? 'pink' : 'default')">
                  {{ record.gender }}
                </a-tag>
              </template>
              <template v-if="column.key === 'health'">
                <a-tag :color="getHealthStatusType(record.health)">{{ record.health }}</a-tag>
              </template>
            </template>
          </a-table>
        </div>

        <a-empty v-if="filteredAnimals.length === 0" description="该分类下暂无动物" />
      </div>
    </a-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAnimalStore } from '../stores/animal'

const route = useRoute()
const router = useRouter()
const animalStore = useAnimalStore()

// Pagination
const currentPage = ref(1)
const pageSize = ref(10)

const categoryName = computed(() => route.params.name)

const categoryInfo = computed(() => {
  return animalStore.categories.find(c => c.name === categoryName.value)
})

const filteredAnimals = computed(() => {
  return animalStore.animals.filter(a => a.type === categoryName.value)
})

const columns = [
  { title: '编号', dataIndex: 'id', key: 'id', width: 80, align: 'center', sorter: (a, b) => a.id - b.id },
  { title: '名称', dataIndex: 'name', key: 'name', width: 120, align: 'center' },
  { title: '品种', dataIndex: 'breed', key: 'breed', width: 120, align: 'center' },
  { title: '性别', dataIndex: 'gender', key: 'gender', width: 80, align: 'center' },
  { title: '年龄', dataIndex: 'age', key: 'age', width: 80, align: 'center', sorter: (a, b) => a.age - b.age },
  { title: '健康状态', dataIndex: 'health', key: 'health', width: 100, align: 'center' },
  { title: '上次体检', dataIndex: 'lastCheckup', key: 'lastCheckup', width: 120, align: 'center', sorter: (a, b) => new Date(a.lastCheckup) - new Date(b.lastCheckup) },
]

const paginationConfig = computed(() => ({
  current: currentPage.value,
  pageSize: pageSize.value,
  total: filteredAnimals.value.length,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '50', '100'],
  showTotal: (total) => `共 ${total} 条`
}))

const handleTableChange = (pagination) => {
  currentPage.value = pagination.current
  pageSize.value = pagination.pageSize
}

const getHealthStatusType = (status) => {
  switch (status) {
    case '健康': return 'success'
    case '一般': return 'warning'
    case '生病': return 'error'
    case '受伤': return 'error'
    default: return 'default'
  }
}
</script>

<style scoped>
.category-detail {
  padding: 0;
  display: flex;
  flex-direction: column;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0,21,41,0.08);
}

.header-left {
  display: flex;
  align-items: center;
}

.header-left h3 {
  margin: 0;
}

.table-card {
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0,21,41,0.08);
  min-height: 500px;
}

.category-info {
  margin-bottom: 20px;
  color: #606266;
  font-size: 14px;
}

.table-wrapper {
  margin-bottom: 20px;
}
</style>
