import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const isLoggedIn = ref(localStorage.getItem('isLoggedIn') === 'true')
  const username = ref(localStorage.getItem('username') || '')
  const role = ref(localStorage.getItem('role') || '')
  // Add currentUser state to track detailed info
  const currentUser = ref(JSON.parse(localStorage.getItem('currentUser')) || null)

  const isAdmin = computed(() => role.value === 'admin')

  const users = ref(JSON.parse(localStorage.getItem('users')) || [
    { 
      id: 1, 
      username: 'admin', 
      password: '123456', 
      role: 'admin',
      nickname: '管理员',
      email: 'admin@example.com',
      bio: '热爱动物，致力于动物保护事业。'
    },
    { 
      id: 2, 
      username: 'visitor', 
      password: '123456', 
      role: 'visitor',
      nickname: '游客',
      email: 'visitor@example.com',
      bio: '我是来参观可爱的动物们的。'
    }
  ])

  function login(user, pass) {
    const foundUser = users.value.find(u => u.username === user && u.password === pass)
    if (foundUser) {
      isLoggedIn.value = true
      username.value = foundUser.username
      role.value = foundUser.role
      currentUser.value = foundUser
      saveState()
      return true
    }
    return false
  }

  function addUser(user) {
    if (users.value.some(u => u.username === user.username)) {
      return false
    }
    const newId = users.value.length > 0 ? Math.max(...users.value.map(u => u.id)) + 1 : 1
    users.value.push({ ...user, id: newId })
    saveState()
    return true
  }

  function updateUser(id, updatedUser) {
    const index = users.value.findIndex(u => u.id === id)
    if (index !== -1) {
      users.value[index] = { ...users.value[index], ...updatedUser }
      // If updating the currently logged in user, update currentUser as well
      if (currentUser.value && currentUser.value.id === id) {
        currentUser.value = users.value[index]
        username.value = users.value[index].username
        role.value = users.value[index].role
      }
      saveState()
    }
  }

  function updateUserProfile(updatedData) {
    if (!currentUser.value) return
    
    const index = users.value.findIndex(u => u.id === currentUser.value.id)
    if (index !== -1) {
      // Merge updates
      users.value[index] = { ...users.value[index], ...updatedData }
      // Update local state
      currentUser.value = users.value[index]
      // If username/nickname changed, update those refs if needed
      if (updatedData.username) username.value = updatedData.username
      
      saveState()
    }
  }

  function deleteUser(id) {
    users.value = users.value.filter(u => u.id !== id)
    saveState()
  }

  function logout() {
    isLoggedIn.value = false
    username.value = ''
    role.value = ''
    clearState()
  }

  function saveState() {
    localStorage.setItem('isLoggedIn', isLoggedIn.value)
    localStorage.setItem('username', username.value)
    localStorage.setItem('role', role.value)
    localStorage.setItem('currentUser', JSON.stringify(currentUser.value))
    localStorage.setItem('users', JSON.stringify(users.value))
  }

  function clearState() {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('username')
    localStorage.removeItem('role')
    localStorage.removeItem('currentUser')
    // Do not clear users list on logout
  }

  return { isLoggedIn, username, role, isAdmin, users, currentUser, login, logout, addUser, updateUser, updateUserProfile, deleteUser }
})
