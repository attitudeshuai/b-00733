<template>
  <div class="category-list">
    <div class="toolbar">
      <div class="toolbar-header">
        <h3>分类管理</h3>
        <a-button type="primary" @click="openDialog()">
          <template #icon><PlusOutlined /></template>
          新增分类
        </a-button>
      </div>
    </div>

    <a-row :gutter="20">
      <a-col :span="8" v-for="cat in animalStore.categories" :key="cat.id" style="margin-bottom: 20px;">
        <a-card hoverable>
          <template #title>
            <div class="card-header">
              <span style="font-weight: bold; font-size: 18px;">{{ cat.name }}</span>
              <a-tag color="blue">{{ getCount(cat.name) }} 只</a-tag>
            </div>
          </template>
          <div class="cat-desc">
            {{ cat.desc || '暂无描述' }}
          </div>
          <div class="cat-actions">
            <a-button type="link" @click="viewDetail(cat.name)">查看详情</a-button>
            <a-divider type="vertical" />
            <a-button type="link" @click="openDialog(cat)">编辑</a-button>
            <a-divider type="vertical" />
            <a-button type="link" danger @click="handleDelete(cat)">删除</a-button>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <!-- Add/Edit Category Dialog -->
    <a-modal
      v-model:open="dialogVisible"
      :title="isEdit ? '编辑分类' : '新增分类'"
      @ok="saveCategory"
      width="500px"
    >
      <a-form :model="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }" ref="formRef">
        <a-form-item label="分类名称" name="name" :rules="[{ required: true, message: '请输入分类名称' }]">
          <a-input v-model:value="form.name" placeholder="请输入分类名称" :disabled="isNameDisabled" />
          <span v-if="isNameDisabled" style="color: #ff4d4f; font-size: 12px; display: block; margin-top: 5px;">
            该分类下有动物，无法修改名称
          </span>
        </a-form-item>
        <a-form-item label="分类描述" name="desc">
          <a-textarea v-model:value="form.desc" :rows="4" placeholder="请输入分类描述" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useAnimalStore } from '../stores/animal'
import { useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'

const animalStore = useAnimalStore()
const router = useRouter()

const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref(null)

const form = reactive({
  id: null,
  name: '',
  desc: ''
})

const getCount = (catName) => {
  return animalStore.animals.filter(a => a.type === catName).length
}

const viewDetail = (catName) => {
  router.push({ name: 'CategoryDetail', params: { name: catName } })
}

const isNameDisabled = ref(false)

const openDialog = (category = null) => {
  if (category) {
    isEdit.value = true
    form.id = category.id
    form.name = category.name
    form.desc = category.desc
    const count = getCount(category.name)
    isNameDisabled.value = count > 0
  } else {
    isEdit.value = false
    form.id = null
    form.name = ''
    form.desc = ''
    isNameDisabled.value = false
  }
  dialogVisible.value = true
}

const saveCategory = async () => {
  if (!form.name) {
    message.warning('请输入分类名称')
    return
  }

  // Check for duplicate names (excluding current one if editing)
  const isDuplicate = animalStore.categories.some(c => c.name === form.name && c.id !== form.id)
  if (isDuplicate) {
    message.error('该分类名称已存在')
    return
  }

  if (isEdit.value) {
    animalStore.updateCategory(form.id, { ...form })
    message.success('更新成功')
  } else {
    animalStore.addCategory({ ...form })
    message.success('添加成功')
  }
  dialogVisible.value = false
}

const handleDelete = (category) => {
  const count = getCount(category.name)
  if (count > 0) {
    message.warning(`该分类下有 ${count} 只动物，无法删除`)
    return
  }
  
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除分类"${category.name}"吗？`,
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      animalStore.deleteCategory(category.id)
      message.success('删除成功')
    }
  })
}
</script>

<style scoped>
.toolbar {
  margin-bottom: 20px;
  background-color: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.05);
}
.toolbar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.toolbar-header h3 {
  margin: 0;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.cat-desc {
  color: #666;
  font-size: 14px;
  min-height: 40px;
  margin-bottom: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
.cat-actions {
  text-align: right;
  border-top: 1px solid #f0f0f0;
  padding-top: 10px;
  margin-top: 10px;
}
</style>
