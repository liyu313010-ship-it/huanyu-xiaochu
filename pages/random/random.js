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
    hasResult: false,
    isRolling: false,
    isAdded: false,
    result: null,
    pawSrc: ''
  },

  onLoad() {
    this.setData({ pawSrc: app.globalData.svgImages.paw })
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 })
    }
  },

  rollDish() {
    if (this.data.isRolling) return
    const dishes = wx.getStorageSync('dishes') || []
    if (dishes.length === 0) {
      wx.showToast({ title: '菜单是空的，快去添加菜品！', icon: 'none' })
      return
    }
    this.setData({ isRolling: true, isAdded: false })
    let count = 0
    let finalDish = null
    const interval = setInterval(() => {
      const idx = Math.floor(Math.random() * dishes.length)
      finalDish = dishes[idx]
      this.setData({ hasResult: true, result: this.decorateDish(finalDish) })
      count++
      if (count >= 6) {
        clearInterval(interval)
        const todayOrder = wx.getStorageSync('todayOrder') || []
        const isAdded = todayOrder.some(d => d.id === finalDish.id)
        this.setData({ isRolling: false, isAdded })
      }
    }, 180)
  },

  decorateDish(dish) {
    const style = LABEL_STYLES[dish.category] || { bg: '#EEE', color: '#666' }
    return Object.assign({}, dish, { labelBg: style.bg, labelColor: style.color })
  },

  addToOrder() {
    if (this.data.isAdded || !this.data.result) return
    const dish = this.data.result
    const cleanDish = {
      id: dish.id,
      name: dish.name,
      emoji: dish.emoji,
      category: dish.category,
      desc: dish.desc
    }
    const todayOrder = wx.getStorageSync('todayOrder') || []
    if (!todayOrder.some(d => d.id === cleanDish.id)) {
      todayOrder.push(cleanDish)
      wx.setStorageSync('todayOrder', todayOrder)
      this.setData({ isAdded: true })
      wx.showToast({ title: `已加入 ${cleanDish.emoji}${cleanDish.name}`, icon: 'success' })
    }
  }
})
