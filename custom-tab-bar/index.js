Component({
  data: {
    selected: 0,
    tabs: [
      { icon: '🍽️', text: '菜单', path: '/pages/index/index' },
      { icon: '📋', text: '今日点菜', path: '/pages/order/order' },
      { icon: '🎲', text: '随机选菜', path: '/pages/random/random' }
    ]
  },
  methods: {
    onTabTap(e) {
      const index = e.currentTarget.dataset.index
      const path = e.currentTarget.dataset.path
      if (index === this.data.selected) return
      this.setData({ selected: index })
      wx.switchTab({ url: path })
    }
  }
})
