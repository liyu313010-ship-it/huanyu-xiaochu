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
    todayOrder: [],
    layDogSrc: '',
    pawSrc: ''
  },

  onLoad() {
    this.setData({
      layDogSrc: app.globalData.svgImages.layDog,
      pawSrc: app.globalData.svgImages.paw
    })
  },

  onShow() {
    this.loadOrder()
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 })
    }
  },

  loadOrder() {
    const raw = wx.getStorageSync('todayOrder') || []
    const todayOrder = raw.map(d => {
      const style = LABEL_STYLES[d.category] || { bg: '#EEE', color: '#666' }
      return Object.assign({}, d, { labelBg: style.bg, labelColor: style.color })
    })
    this.setData({ todayOrder })
  },

  removeDish(e) {
    const id = e.currentTarget.dataset.id
    const todayOrder = (wx.getStorageSync('todayOrder') || []).filter(d => d.id !== id)
    wx.setStorageSync('todayOrder', todayOrder)
    this.loadOrder()
    wx.showToast({ title: '已移除', icon: 'none' })
  },

  clearOrder() {
    wx.showModal({
      title: '清空今日菜单',
      content: '确定清空今天已点的所有菜吗？',
      confirmColor: '#E8956D',
      success: (res) => {
        if (res.confirm) {
          wx.setStorageSync('todayOrder', [])
          this.loadOrder()
          wx.showToast({ title: '已清空', icon: 'none' })
        }
      }
    })
  },

  goMenu() {
    wx.switchTab({ url: '/pages/index/index' })
  }
})
