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
    allDishes: [],
    emojiList: [],
    categoryOptions: ['家常', '硬菜', '清淡', '下饭', '汤', '甜品', '快手', '主食'],
    selectedEmoji: '🍅',
    selectedCategory: '家常',
    newName: '',
    newDesc: ''
  },

  onLoad() {
    this.setData({ emojiList: app.globalData.emojiList })
    this.loadDishes()
  },

  onShow() {
    this.loadDishes()
  },

  loadDishes() {
    const raw = wx.getStorageSync('dishes') || []
    const allDishes = raw.map(d => {
      const style = LABEL_STYLES[d.category] || { bg: '#EEE', color: '#666' }
      return Object.assign({}, d, { labelBg: style.bg, labelColor: style.color })
    })
    this.setData({ allDishes })
  },

  selectEmoji(e) {
    this.setData({ selectedEmoji: e.currentTarget.dataset.emoji })
  },

  selectCategory(e) {
    this.setData({ selectedCategory: e.currentTarget.dataset.category })
  },

  onNameInput(e) {
    this.setData({ newName: e.detail.value })
  },

  onDescInput(e) {
    this.setData({ newDesc: e.detail.value })
  },

  addDish() {
    const name = this.data.newName.trim()
    const desc = this.data.newDesc.trim()
    if (!name) {
      wx.showToast({ title: '请输入菜品名称', icon: 'none' })
      return
    }
    const dishes = wx.getStorageSync('dishes') || []
    const newDish = {
      id: Date.now().toString(),
      name,
      emoji: this.data.selectedEmoji,
      category: this.data.selectedCategory,
      desc: desc || '自定义菜品',
      createTime: Date.now()
    }
    dishes.push(newDish)
    wx.setStorageSync('dishes', dishes)
    this.setData({ newName: '', newDesc: '', selectedEmoji: '🍅', selectedCategory: '家常' })
    this.loadDishes()
    wx.showToast({ title: `已添加 ${newDish.emoji}${newDish.name}`, icon: 'success' })
  },

  deleteDish(e) {
    const id = e.currentTarget.dataset.id
    const dish = this.data.allDishes.find(d => d.id === id)
    wx.showModal({
      title: '删除菜品',
      content: `确定删除「${dish ? dish.name : '这道菜'}」吗？`,
      confirmColor: '#E8956D',
      success: (res) => {
        if (res.confirm) {
          const dishes = (wx.getStorageSync('dishes') || []).filter(d => d.id !== id)
          const todayOrder = (wx.getStorageSync('todayOrder') || []).filter(d => d.id !== id)
          wx.setStorageSync('dishes', dishes)
          wx.setStorageSync('todayOrder', todayOrder)
          this.loadDishes()
          wx.showToast({ title: '已删除', icon: 'none' })
        }
      }
    })
  }
})
