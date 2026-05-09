<template>
  <div class="dashboard">
    <a-row :gutter="24">
      <a-col :span="6">
        <div class="stat-card">
          <div class="stat-icon-wrapper" style="background-color: #e6f7ff; color: #1890ff;">
            <DashboardOutlined />
          </div>
          <div class="stat-content">
            <div class="stat-title">动物总数</div>
            <div class="stat-value">{{ animalStore.animals.length }}</div>
          </div>
        </div>
      </a-col>
      <a-col :span="6">
        <div class="stat-card">
          <div class="stat-icon-wrapper" style="background-color: #f6ffed; color: #52c41a;">
            <AppstoreOutlined />
          </div>
          <div class="stat-content">
            <div class="stat-title">物种分类</div>
            <div class="stat-value">{{ animalStore.categories.length }}</div>
          </div>
        </div>
      </a-col>
      <a-col :span="6">
        <div class="stat-card">
          <div class="stat-icon-wrapper" style="background-color: #f9f0ff; color: #722ed1;">
            <MedicineBoxOutlined />
          </div>
          <div class="stat-content">
            <div class="stat-title">健康动物</div>
            <div class="stat-value">{{ healthyCount }}</div>
          </div>
        </div>
      </a-col>
      <a-col :span="6">
        <div class="stat-card">
          <div class="stat-icon-wrapper" style="background-color: #fff1f0; color: #f5222d;">
             <AlertOutlined />
          </div>
          <div class="stat-content">
            <div class="stat-title">需要关注</div>
            <div class="stat-value">{{ attentionCount }}</div>
          </div>
        </div>
      </a-col>
    </a-row>

    <a-row :gutter="24" style="margin-top: 24px;">
      <a-col :span="16">
        <a-card class="chart-card" :bordered="false">
          <template #title>
            <div class="card-header">
              <span>月度健康趋势</span>
              <div class="card-extra">
                 <a-radio-group v-model:value="trendPeriod" size="small">
                  <a-radio-button value="week">本周</a-radio-button>
                  <a-radio-button value="month">本月</a-radio-button>
                  <a-radio-button value="year">全年</a-radio-button>
                </a-radio-group>
              </div>
            </div>
          </template>
          <div ref="lineChart" style="height: 360px;"></div>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card class="chart-card" :bordered="false">
          <template #title>
            <div class="card-header">
              <span>动物分类分布</span>
            </div>
          </template>
          <div ref="pieChart" style="height: 360px;"></div>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="24" style="margin-top: 24px;">
      <a-col :span="14">
        <a-card class="list-card" :bordered="false">
          <template #title>
            <div class="card-header">
              <span>最新健康记录</span>
              <a class="more-link" @click="$router.push('/health')">查看更多</a>
            </div>
          </template>
          <a-table :dataSource="recentHealth" :columns="healthColumns" :pagination="false" size="small">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'status'">
                 <a-tag :color="getStatusColor(record.status)">{{ record.status }}</a-tag>
              </template>
              <template v-else-if="column.key === 'animalName'">
                <span style="font-weight: 500;">{{ record.animalName }}</span>
              </template>
            </template>
          </a-table>
        </a-card>
      </a-col>
      <a-col :span="10">
        <a-card class="quick-nav-card" :bordered="false">
           <template #title>
            <div class="card-header">
              <span>快捷导航</span>
            </div>
          </template>
          <div class="nav-grid">
            <div class="nav-item" @click="$router.push('/animals')">
              <div class="nav-icon" style="background-color: #e6f7ff; color: #1890ff;"><UnorderedListOutlined /></div>
              <span>动物列表</span>
            </div>
            <div class="nav-item" @click="$router.push('/feeding')">
              <div class="nav-icon" style="background-color: #fff7e6; color: #faad14;"><CoffeeOutlined /></div>
              <span>饲养记录</span>
            </div>
            <div class="nav-item" @click="$router.push('/categories')">
              <div class="nav-icon" style="background-color: #f0f5ff; color: #2f54eb;"><AppstoreOutlined /></div>
              <span>分类管理</span>
            </div>
            <div class="nav-item" @click="$router.push('/health')">
              <div class="nav-icon" style="background-color: #fff1f0; color: #ff4d4f;"><MedicineBoxOutlined /></div>
              <span>健康记录</span>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick, onUnmounted } from 'vue'
import { useAnimalStore } from '../stores/animal'
import * as echarts from 'echarts'
import { 
  DashboardOutlined, 
  AppstoreOutlined, 
  MedicineBoxOutlined, 
  AlertOutlined,
  UnorderedListOutlined,
  CoffeeOutlined
} from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const animalStore = useAnimalStore()
const pieChart = ref(null)
const lineChart = ref(null)
const trendPeriod = ref('year')
let pieInstance = null
let lineInstance = null

const healthyCount = computed(() => {
  return animalStore.animals.filter(a => a.health === '健康').length
})

const attentionCount = computed(() => {
  return animalStore.animals.filter(a => a.health !== '健康').length
})

const recentHealth = computed(() => {
  return animalStore.healthRecords.slice(-5).reverse().map(r => {
    const animal = animalStore.animals.find(a => a.id === r.animalId)
    return {
      ...r,
      key: r.id, // AntDV needs unique key
      animalName: animal ? animal.name : '未知'
    }
  })
})

const healthColumns = [
  { title: '动物名称', dataIndex: 'animalName', key: 'animalName', width: 120 },
  { title: '健康状态', dataIndex: 'status', key: 'status', width: 100 },
  { title: '备注', dataIndex: 'notes', key: 'notes', ellipsis: true },
  { title: '检查日期', dataIndex: 'date', key: 'date', width: 120, align: 'right' },
]

const getStatusColor = (status) => {
  if (status === '健康') return 'success'
  if (status === '一般') return 'warning'
  return 'error'
}

const initCharts = () => {
  if (pieInstance) pieInstance.dispose()
  if (lineInstance) lineInstance.dispose()

  pieInstance = echarts.init(pieChart.value)
  lineInstance = echarts.init(lineChart.value)

  // Pie Chart Data
  const categoryData = animalStore.categories.map(c => {
    return {
      name: c.name,
      value: animalStore.animals.filter(a => a.type === c.name).length
    }
  })

  pieInstance.setOption({
    tooltip: { trigger: 'item' },
    legend: { bottom: '0', left: 'center' },
    color: ['#1890ff', '#13c2c2', '#52c41a', '#faad14', '#f5222d', '#722ed1'],
    series: [
      {
        name: '动物分类',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: { show: false, position: 'center' },
        emphasis: {
          label: { show: true, fontSize: '20', fontWeight: 'bold' }
        },
        labelLine: { show: false },
        data: categoryData
      }
    ]
  })

  // Line Chart Data (Mock trend)
  lineInstance.setOption({
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
      axisLine: { lineStyle: { color: '#f0f0f0' } },
      axisLabel: { color: 'rgba(0,0,0,0.45)' }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { type: 'dashed', color: '#f0f0f0' } }
    },
    series: [
      {
        name: '健康指数',
        type: 'line',
        smooth: true,
        data: [85, 88, 87, 90, 92, 89, 95],
        itemStyle: { color: '#1890ff' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(24,144,255,0.3)' },
            { offset: 1, color: 'rgba(24,144,255,0.01)' }
          ])
        }
      }
    ]
  })
}

const handleResize = () => {
  pieInstance && pieInstance.resize()
  lineInstance && lineInstance.resize()
}

onMounted(() => {
  nextTick(() => {
    initCharts()
    window.addEventListener('resize', handleResize)
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  pieInstance && pieInstance.dispose()
  lineInstance && lineInstance.dispose()
})
</script>

<style scoped>
.dashboard {
  /* padding is handled by Layout main */
}

.stat-card {
  background: #fff;
  padding: 24px;
  border-radius: 2px;
  display: flex;
  align-items: center;
  transition: all 0.3s;
  cursor: pointer;
  border: 1px solid #f0f0f0;
}

.stat-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  transform: translateY(-2px);
}

.stat-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-right: 16px;
}

.stat-content {
  flex: 1;
}

.stat-title {
  color: rgba(0,0,0,0.45);
  font-size: 14px;
  margin-bottom: 4px;
}

.stat-value {
  color: rgba(0,0,0,0.85);
  font-size: 24px;
  font-weight: 500;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.chart-card, .list-card, .quick-nav-card {
  border-radius: 2px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  color: rgba(0,0,0,0.85);
}

.more-link {
  font-size: 14px;
  color: #1890ff;
  cursor: pointer;
  font-weight: normal;
}

/* Ant Design Table custom styling if needed */
:deep(.ant-table-thead > tr > th) {
  background: #fafafa;
}

.nav-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding: 10px 0;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background-color: #fafafa;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.nav-item:hover {
  background-color: #fff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.nav-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-bottom: 8px;
}
</style>
