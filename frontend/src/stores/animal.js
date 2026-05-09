import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAnimalStore = defineStore('animal', () => {
  // Initial Mock Data
  const defaultAnimals = [
    { id: 1, name: '旺财', type: '哺乳类', breed: '中华田园犬', age: 3, health: '健康', lastCheckup: '2025-03-15', weight: 15, gender: '公', source: '救助' },
    { id: 2, name: '咪咪', type: '哺乳类', breed: '狸花猫', age: 2, health: '健康', lastCheckup: '2025-11-15', weight: 4, gender: '母', source: '野外捕获' },
    { id: 3, name: '皮皮', type: '鸟类', breed: '玄凤鹦鹉', age: 1, health: '一般', lastCheckup: '2025-09-20', weight: 0.1, gender: '未知', source: '繁育中心' },
    { id: 4, name: '大壮', type: '哺乳类', breed: '亚洲象', age: 15, health: '健康', lastCheckup: '2025-02-20', weight: 4000, gender: '公', source: '引进' },
    { id: 5, name: '圆圆', type: '哺乳类', breed: '大熊猫', age: 5, health: '健康', lastCheckup: '2025-12-01', weight: 110, gender: '母', source: '繁育中心' },
    { id: 6, name: '小青', type: '爬行类', breed: '绿主要蟒', age: 4, health: '生病', lastCheckup: '2025-11-05', weight: 12, gender: '母', source: '野外捕获' },
    { id: 7, name: '跳跳', type: '两栖类', breed: '树蛙', age: 1, health: '健康', lastCheckup: '2025-10-22', weight: 0.05, gender: '未知', source: '野外捕获' },
    { id: 8, name: '金金', type: '鱼类', breed: '锦鲤', age: 2, health: '健康', lastCheckup: '2025-01-10', weight: 0.5, gender: '未知', source: '购买' },
    { id: 9, name: '辛巴', type: '哺乳类', breed: '非洲狮', age: 6, health: '受伤', lastCheckup: '2025-12-10', weight: 190, gender: '公', source: '引进' },
    { id: 10, name: '长脖子', type: '哺乳类', breed: '长颈鹿', age: 8, health: '健康', lastCheckup: '2025-07-20', weight: 1200, gender: '母', source: '引进' },
    { id: 11, name: '闪电', type: '哺乳类', breed: '树懒', age: 5, health: '健康', lastCheckup: '2025-11-30', weight: 8, gender: '公', source: '救助' },
    { id: 12, name: '卡卡', type: '鸟类', breed: '孔雀', age: 3, health: '健康', lastCheckup: '2025-04-15', weight: 5, gender: '公', source: '繁育中心' },
    { id: 13, name: '白白', type: '哺乳类', breed: '北极熊', age: 7, health: '健康', lastCheckup: '2026-01-05', weight: 450, gender: '母', source: '引进' },
    { id: 14, name: '黑黑', type: '哺乳类', breed: '黑猩猩', age: 10, health: '健康', lastCheckup: '2025-11-11', weight: 60, gender: '公', source: '繁育中心' },
    { id: 15, name: '斑斑', type: '哺乳类', breed: '斑马', age: 4, health: '健康', lastCheckup: '2025-04-05', weight: 300, gender: '母', source: '引进' },
    { id: 16, name: '红红', type: '鸟类', breed: '火烈鸟', age: 2, health: '健康', lastCheckup: '2023-10-15', weight: 3, gender: '未知', source: '购买' },
    { id: 17, name: '慢慢', type: '爬行类', breed: '象龟', age: 50, health: '健康', lastCheckup: '2023-06-30', weight: 200, gender: '公', source: '引进' },
    { id: 18, name: '鳄鱼哥', type: '爬行类', breed: '扬子鳄', age: 12, health: '健康', lastCheckup: '2023-08-25', weight: 150, gender: '公', source: '救助' },
    { id: 19, name: '呱呱', type: '两栖类', breed: '牛蛙', age: 1, health: '健康', lastCheckup: '2023-09-10', weight: 0.3, gender: '母', source: '繁育中心' },
    { id: 20, name: '大鲵', type: '两栖类', breed: '娃娃鱼', age: 5, health: '一般', lastCheckup: '2023-11-20', weight: 15, gender: '未知', source: '救助' },
    { id: 21, name: '尼莫', type: '鱼类', breed: '小丑鱼', age: 1, health: '健康', lastCheckup: '2023-12-05', weight: 0.05, gender: '未知', source: '购买' },
    { id: 22, name: '鲨鱼辣椒', type: '鱼类', breed: '大白鲨', age: 3, health: '受伤', lastCheckup: '2023-12-25', weight: 800, gender: '公', source: '引进' },
    { id: 23, name: '蝴蝶妹妹', type: '昆虫类', breed: '蓝闪蝶', age: 0.2, health: '健康', lastCheckup: '2023-12-28', weight: 0.001, gender: '母', source: '繁育中心' },
    { id: 24, name: '大力士', type: '昆虫类', breed: '独角仙', age: 0.5, health: '健康', lastCheckup: '2023-11-18', weight: 0.02, gender: '公', source: '野外捕获' },
    { id: 25, name: '团团', type: '哺乳类', breed: '考拉', age: 4, health: '健康', lastCheckup: '2023-10-30', weight: 10, gender: '母', source: '引进' },
    { id: 26, name: '袋袋', type: '哺乳类', breed: '袋鼠', age: 3, health: '健康', lastCheckup: '2023-11-08', weight: 70, gender: '公', source: '引进' },
    { id: 27, name: '阿黄', type: '哺乳类', breed: '金毛寻回犬', age: 2, health: '健康', lastCheckup: '2023-12-15', weight: 28, gender: '公', source: '购买' },
    { id: 28, name: '可乐', type: '哺乳类', breed: '拉布拉多', age: 1, health: '健康', lastCheckup: '2023-12-18', weight: 25, gender: '母', source: '购买' },
    { id: 29, name: '汤姆', type: '哺乳类', breed: '英短蓝猫', age: 2, health: '健康', lastCheckup: '2023-11-25', weight: 5, gender: '公', source: '购买' },
    { id: 30, name: '杰瑞', type: '哺乳类', breed: '仓鼠', age: 0.5, health: '健康', lastCheckup: '2023-12-01', weight: 0.05, gender: '公', source: '购买' }
  ].reverse()

  const defaultHealthRecords = [
    { id: 1, animalId: 1, date: '2025-10-01', status: '健康', weight: 15, notes: '常规体检，状态良好' },
    { id: 2, animalId: 2, date: '2025-11-15', status: '健康', weight: 4, notes: '接种疫苗' },
    { id: 3, animalId: 3, date: '2025-09-20', status: '一般', weight: 0.1, notes: '羽毛光泽度稍差，建议补充维生素' },
    { id: 4, animalId: 6, date: '2025-11-05', status: '生病', weight: 12, notes: '口腔感染，正在治疗中' },
    { id: 5, animalId: 9, date: '2025-12-10', status: '受伤', weight: 190, notes: '后腿轻微擦伤，已处理' },
    { id: 6, animalId: 5, date: '2025-12-01', status: '健康', weight: 110, notes: '体重正常，食欲旺盛' },
    { id: 7, animalId: 22, date: '2026-01-15', status: '受伤', weight: 800, notes: '背鳍有擦伤，已涂药' },
    { id: 8, animalId: 20, date: '2025-11-20', status: '一般', weight: 15, notes: '食欲不振，观察中' },
    { id: 9, animalId: 13, date: '2026-01-05', status: '健康', weight: 450, notes: '冬眠前检查' },
    { id: 10, animalId: 4, date: '2025-08-10', status: '健康', weight: 4000, notes: '象牙检查正常' },
    { id: 11, animalId: 10, date: '2025-07-20', status: '健康', weight: 1200, notes: '身高增长正常' },
    { id: 12, animalId: 17, date: '2025-06-30', status: '健康', weight: 200, notes: '甲壳硬度良好' },
    { id: 13, animalId: 29, date: '2025-01-25', status: '健康', weight: 5, notes: '入园体检' },
    { id: 14, animalId: 30, date: '2025-02-01', status: '健康', weight: 0.05, notes: '常规检查' }
  ].reverse()

  const defaultFeedingRecords = [
    { id: 1, animalId: 1, date: '2025-01-22', time: '08:00', food: '狗粮', amount: 0.3, unit: 'kg', feeder: '张三' },
    { id: 2, animalId: 2, date: '2025-01-22', time: '08:30', food: '猫粮', amount: 0.1, unit: 'kg', feeder: '李四' },
    { id: 3, animalId: 4, date: '2025-01-22', time: '09:00', food: '草料', amount: 150, unit: 'kg', feeder: '王五' },
    { id: 4, animalId: 5, date: '2025-01-22', time: '09:30', food: '竹子', amount: 20, unit: 'kg', feeder: '赵六' }
  ]

  const defaultCategories = [
    { id: 1, name: '哺乳类', desc: '胎生哺乳，恒温动物，如：猫、狗、大象、熊猫等' },
    { id: 2, name: '鸟类', desc: '卵生，有羽毛，恒温动物，如：鹦鹉、孔雀、火烈鸟等' },
    { id: 3, name: '爬行类', desc: '卵生，体表覆盖鳞片或甲，如：蛇、龟、鳄鱼等' },
    { id: 4, name: '两栖类', desc: '幼体水生，成体水陆两栖，如：青蛙、蝾螈、大鲵等' },
    { id: 5, name: '鱼类', desc: '终生生活在水中，用鳃呼吸，如：金鱼、鲨鱼、小丑鱼等' },
    { id: 6, name: '昆虫类', desc: '体躯分为头、胸、腹三部分，如：蝴蝶、甲虫、蜜蜂等' }
  ]

  const healthRecords = ref(JSON.parse(localStorage.getItem('healthRecords')) || defaultHealthRecords)
  const feedingRecords = ref(JSON.parse(localStorage.getItem('feedingRecords')) || defaultFeedingRecords)

  // Initialize from localStorage or default
  const animals = ref(JSON.parse(localStorage.getItem('animals')) || defaultAnimals)
  const categories = ref(JSON.parse(localStorage.getItem('categories')) || defaultCategories)

  function saveState() {
    localStorage.setItem('animals', JSON.stringify(animals.value))
    localStorage.setItem('healthRecords', JSON.stringify(healthRecords.value))
    localStorage.setItem('feedingRecords', JSON.stringify(feedingRecords.value))
    localStorage.setItem('categories', JSON.stringify(categories.value))
  }

  function addAnimal(animal) {
    const newId = animals.value.length ? Math.max(...animals.value.map(a => a.id)) + 1 : 1
    animals.value.unshift({ ...animal, id: newId })
    saveState()
  }

  function updateAnimal(id, updatedAnimal) {
    const index = animals.value.findIndex(a => a.id === id)
    if (index !== -1) {
      animals.value[index] = { ...updatedAnimal, id }
      saveState()
    }
  }

  function deleteAnimal(id) {
    animals.value = animals.value.filter(a => a.id !== id)
    saveState()
  }

  function addHealthRecord(record) {
    const newId = healthRecords.value.length ? Math.max(...healthRecords.value.map(r => r.id)) + 1 : 1
    healthRecords.value.unshift({ ...record, id: newId })
    saveState()
  }

  function updateHealthRecord(id, updatedRecord) {
    const index = healthRecords.value.findIndex(r => r.id === id)
    if (index !== -1) {
      healthRecords.value[index] = { ...updatedRecord, id }
      saveState()
    }
  }

  function deleteHealthRecord(id) {
    healthRecords.value = healthRecords.value.filter(r => r.id !== id)
    saveState()
  }

  function addFeedingRecord(record) {
    const newId = feedingRecords.value.length ? Math.max(...feedingRecords.value.map(r => r.id)) + 1 : 1
    feedingRecords.value.unshift({ ...record, id: newId })
    saveState()
  }

  function updateFeedingRecord(id, updatedRecord) {
    const index = feedingRecords.value.findIndex(r => r.id === id)
    if (index !== -1) {
      feedingRecords.value[index] = { ...updatedRecord, id }
      saveState()
    }
  }

  function deleteFeedingRecord(id) {
    feedingRecords.value = feedingRecords.value.filter(r => r.id !== id)
    saveState()
  }

  function addCategory(category) {
    const newId = categories.value.length ? Math.max(...categories.value.map(c => c.id)) + 1 : 1
    categories.value.push({ ...category, id: newId })
    saveState()
  }

  function updateCategory(id, updatedCategory) {
    const index = categories.value.findIndex(c => c.id === id)
    if (index !== -1) {
      categories.value[index] = { ...updatedCategory, id }
      saveState()
    }
  }

  function deleteCategory(id) {
    categories.value = categories.value.filter(c => c.id !== id)
    saveState()
  }

  return {
    animals,
    categories,
    healthRecords,
    feedingRecords,
    addAnimal,
    updateAnimal,
    deleteAnimal,
    addHealthRecord,
    updateHealthRecord,
    deleteHealthRecord,
    addFeedingRecord,
    updateFeedingRecord,
    deleteFeedingRecord,
    addCategory,
    updateCategory,
    deleteCategory
  }
})
