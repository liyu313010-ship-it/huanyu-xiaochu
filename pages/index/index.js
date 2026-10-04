const app = getApp()

const LABEL_STYLES = {
  '家常': { bg: '#FFE4D6', color: '#C4603A' },
  '硬菜': { bg: '#FFD6D6', color: '#C43A3A' },
  '清淡': { bg: '#D6F0D6', color: '#3A8B3A' },
  '下饭': { bg: '#FFF0D6', color: '#C48B3A' },
  '汤': { bg: '#D6E8FF', color: '#3A6BC4' },
  '甜品': { bg: '#F0D6FF', color: '#8B3AC4' },
  '快手': { bg: '#D6FFF0', color: '#3AC48B' },
  '主食': { bg: '#FFEAD6', color: '#C4783A' }
}

Page({
  data: {
    categories: [],
    categoryItems: [],
    currentCategory: '全部',
    currentCategoryTitle: '全部',
    allDishes: [],
    filteredDishes: [],
    selectedIds: [],
    userInfo: {
      avatarUrl: '',
      nickName: ''
    },
    userInfoReady: false,
    sitDogSrc: '',
    pawSrc: ''
  },

  onLoad() {
    const userInfo = wx.getStorageSync('userInfo') || { avatarUrl: '', nickName: '' }
    this.setData({
      categories: app.globalData.categories,
      userInfo,
      userInfoReady: !!(userInfo.avatarUrl || userInfo.nickName),
      sitDogSrc: app.globalData.svgImages.sitDog,
      pawSrc: app.globalData.svgImages.paw
    })
  },

  onShow() {
    const allDishes = wx.getStorageSync('dishes') || []
    const todayOrder = wx.getStorageSync('todayOrder') || []
    const selectedIds = todayOrder.map(d => d.id)
    this.setData({ allDishes, selectedIds })
    this.filterDishes()
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 })
    }
  },

  onCategoryTap(e) {
    const currentCategory = e.currentTarget.dataset.category
    this.setData({ currentCategory })
    this.filterDishes()
  },

  filterDishes() {
    const list = this.data.currentCategory === '全部'
      ? this.data.allDishes
      : this.data.allDishes.filter(d => d.category === this.data.currentCategory)
    const filteredDishes = list.map(d => {
      const style = LABEL_STYLES[d.category] || { bg: '#EEE', color: '#666' }
      return Object.assign({}, d, {
        selected: this.data.selectedIds.indexOf(d.id) !== -1,
        labelBg: style.bg,
        labelColor: style.color,
        stars: d.category === '清淡' ? '★★★★☆' : '★★★★★',
        score: d.category === '清淡' ? '4.0' : '5.0'
      })
    })
    this.setData({
      filteredDishes,
      categoryItems: this.buildCategoryItems(),
      currentCategoryTitle: this.getCategoryTitle(this.data.currentCategory)
    })
  },

  buildCategoryItems() {
    const iconMap = {
      '全部': '🍽️',
      '家常': '🏠',
      '硬菜': '🥩',
      '清淡': '🥬',
      '下饭': '🍚',
      '汤': '🥣',
      '甜品': '🍰',
      '快手': '⚡',
      '主食': '🍙'
    }
    const titleMap = {
      '全部': '运动小鸡毛',
      '家常': '日常互动',
      '硬菜': '硬菜吃吃吃',
      '清淡': '清淡吃吃吃',
      '下饭': '粗去玩喽',
      '汤': '饮料喝喝喝',
      '甜品': '零食吃吃吃',
      '快手': '快速投喂',
      '主食': '主食吃吃吃'
    }
    return this.data.categories.map((name, index) => {
      const count = name === '全部'
        ? this.data.allDishes.length
        : this.data.allDishes.filter(d => d.category === name).length
      return {
        name,
        title: titleMap[name] || name,
        icon: iconMap[name] || '🍳',
        count,
        active: name === this.data.currentCategory,
        required: index === 0
      }
    })
  },

  getCategoryTitle(category) {
    const item = this.buildCategoryItems().find(c => c.name === category)
    return item ? item.title : category
  },

  onDishTap(e) {
    const id = e.currentTarget.dataset.id
    const dish = this.data.allDishes.find(d => d.id === id)
    if (!dish) return
    let todayOrder = wx.getStorageSync('todayOrder') || []
    const exists = todayOrder.some(d => d.id === id)
    if (exists) {
      todayOrder = todayOrder.filter(d => d.id !== id)
      wx.showToast({ title: '已取消这道菜', icon: 'none' })
    } else {
      todayOrder.push(dish)
      wx.showToast({ title: `已加入 ${dish.emoji}${dish.name}`, icon: 'success' })
    }
    wx.setStorageSync('todayOrder', todayOrder)
    this.setData({ selectedIds: todayOrder.map(d => d.id) })
    this.filterDishes()
  },

  goManage() {
    wx.navigateTo({ url: '/pages/manage/manage' })
  },

  randomSelect() {
    const dishes = this.data.allDishes
    if (dishes.length === 0) {
      wx.showToast({ title: '菜单是空的', icon: 'none' })
      return
    }
    const dish = dishes[Math.floor(Math.random() * dishes.length)]
    let todayOrder = wx.getStorageSync('todayOrder') || []
    if (!todayOrder.some(d => d.id === dish.id)) {
      todayOrder.push(dish)
      wx.setStorageSync('todayOrder', todayOrder)
      this.setData({ selectedIds: todayOrder.map(d => d.id) })
      this.filterDishes()
    }
    wx.showToast({ title: `随机选了 ${dish.name}`, icon: 'none' })
  },

  goOrder() {
    wx.switchTab({ url: '/pages/order/order' })
  },

  onChooseAvatar(e) {
    const userInfo = Object.assign({}, this.data.userInfo, {
      avatarUrl: e.detail.avatarUrl
    })
    this.setData({ userInfo, userInfoReady: true })
    wx.setStorageSync('userInfo', userInfo)
  },

  onNicknameInput(e) {
    const userInfo = Object.assign({}, this.data.userInfo, {
      nickName: e.detail.value
    })
    this.setData({
      userInfo,
      userInfoReady: !!(userInfo.avatarUrl || userInfo.nickName)
    })
  },

  saveUserInfo() {
    wx.setStorageSync('userInfo', this.data.userInfo)
  }
})
