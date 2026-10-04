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

const DEFAULT_DISHES = [
  { id: '1', name: '番茄炒蛋', emoji: '🍅', category: '家常', desc: '酸甜适口，下饭神器，5分钟搞定' },
  { id: '2', name: '红烧肉', emoji: '🥩', category: '硬菜', desc: '软糯入味，肥而不腻，越吃越香' },
  { id: '3', name: '蒜蓉西兰花', emoji: '🥦', category: '清淡', desc: '简单清爽，营养满满，清脆好吃' },
  { id: '4', name: '麻婆豆腐', emoji: '🌶️', category: '下饭', desc: '麻辣鲜香，超级下饭，豆腐嫩滑' },
  { id: '5', name: '可乐鸡翅', emoji: '🍗', category: '家常', desc: '香甜软糯，女朋友的最爱' },
  { id: '6', name: '蛋炒饭', emoji: '🍳', category: '快手', desc: '五分钟上桌，粒粒分明，随时可以' },
  { id: '7', name: '酸辣土豆丝', emoji: '🥔', category: '下饭', desc: '脆爽开胃，酸辣过瘾' },
  { id: '8', name: '糖醋排骨', emoji: '🍖', category: '硬菜', desc: '酸甜浓郁，骨肉分离，吃到停不下来' },
  { id: '9', name: '紫菜蛋花汤', emoji: '🥣', category: '汤', desc: '鲜美清淡，暖胃又简单' },
  { id: '10', name: '芒果班戟', emoji: '🥭', category: '甜品', desc: '软软的甜品，哄女朋友专用' },
  { id: '11', name: '清炒小白菜', emoji: '🥬', category: '清淡', desc: '简单素菜，清甜爽口' },
  { id: '12', name: '剁椒鱼头', emoji: '🐟', category: '硬菜', desc: '鲜辣够味，蒸出来超香' },
  { id: '13', name: '南瓜汤', emoji: '🎃', category: '汤', desc: '奶香甜糯，秋冬必备' },
  { id: '14', name: '韭菜鸡蛋饺子', emoji: '🥟', category: '主食', desc: '包给你吃的爱心饺子，满满心意' },
  { id: '15', name: '草莓蛋糕', emoji: '🍰', category: '甜品', desc: '生日纪念日必备，甜甜的' }
]

App({
  globalData: {
    labelStyles: LABEL_STYLES,
    categories: ['全部', '家常', '硬菜', '清淡', '下饭', '汤', '甜品', '快手', '主食'],
    emojiList: ['🍅', '🥩', '🥦', '🌶️', '🍗', '🍳', '🥔', '🍖', '🥣', '🥭', '🥬', '🐟', '🎃', '🥟', '🍰', '🍜', '🥗', '🍲', '🥘', '🫕', '🍱', '🥚', '🧆', '🍛', '🥞'],
    svgImages: { sitDog: '', layDog: '', paw: '' }
  },

  onLaunch() {
    this.initStorage()
    this.buildSVGImages()
  },

  initStorage() {
    const dishes = wx.getStorageSync('dishes')
    if (!dishes || dishes.length === 0) {
      wx.setStorageSync('dishes', DEFAULT_DISHES)
    }
    if (!wx.getStorageSync('todayOrder')) {
      wx.setStorageSync('todayOrder', [])
    }
  },

  buildSVGImages() {
    const sitDogSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="176" viewBox="0 0 160 176"><g stroke="#3D2B1F" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="80" cy="72" r="38"/><path d="M50,50 Q38,30 48,18 Q58,8 68,28"/><path d="M110,50 Q122,30 112,18 Q102,8 92,28"/><circle cx="68" cy="66" r="4" fill="#3D2B1F"/><circle cx="92" cy="66" r="4" fill="#3D2B1F"/><circle cx="80" cy="78" r="3" fill="#3D2B1F"/><path d="M74,83 Q80,89 86,83"/><path d="M55,108 Q50,110 50,130 L50,160 Q50,165 55,165 L105,165 Q110,165 110,160 L110,130 Q110,110 105,108 Z"/><path d="M58,160 L54,174"/><path d="M54,174 Q52,178 62,178 Q68,178 66,174"/><path d="M102,160 L106,174"/><path d="M106,174 Q108,178 98,178 Q92,178 94,174"/><path d="M55,125 L28,108"/><path d="M105,125 L132,108"/><rect x="16" y="88" width="128" height="32" rx="6"/><text x="80" y="109" text-anchor="middle" font-size="11" fill="#3D2B1F" stroke="none" font-family="sans-serif">今天吃什么？</text><path d="M108,152 Q128,140 124,122"/></g></svg>'
    const layDogSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="160" viewBox="0 0 200 160"><g stroke="#3D2B1F" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="60" cy="62" r="38"/><path d="M32,44 Q20,24 32,14 Q44,6 56,28"/><path d="M88,44 Q100,24 88,14 Q76,6 64,28"/><circle cx="48" cy="56" r="4" fill="#3D2B1F"/><circle cx="72" cy="56" r="4" fill="#3D2B1F"/><circle cx="60" cy="68" r="3" fill="#3D2B1F"/><path d="M54,73 Q60,79 66,73"/><ellipse cx="138" cy="118" rx="52" ry="28"/><path d="M82,75 Q100,90 95,110"/><path d="M100,118 L88,136"/><ellipse cx="84" cy="140" rx="10" ry="5" fill="#FFF8F0"/><ellipse cx="84" cy="140" rx="10" ry="5"/><path d="M118,118 L130,136"/><ellipse cx="134" cy="140" rx="10" ry="5" fill="#FFF8F0"/><ellipse cx="134" cy="140" rx="10" ry="5"/><path d="M185,106 Q200,88 192,72"/></g></svg>'
    const pawSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="45" viewBox="0 0 40 45"><g stroke="#3D2B1F" stroke-width="2" fill="#F2C4A0"><ellipse cx="20" cy="34" rx="10" ry="8"/><ellipse cx="9" cy="21" rx="5" ry="4"/><ellipse cx="20" cy="17" rx="5" ry="4"/><ellipse cx="31" cy="21" rx="5" ry="4"/></g></svg>'
    try {
      const toBase64 = (svg) => {
        const encoded = encodeURIComponent(svg).replace(/%([0-9A-F]{2})/g, function(match, p1) {
          return String.fromCharCode('0x' + p1)
        })
        return 'data:image/svg+xml;base64,' + wx.arrayBufferToBase64(this.stringToBuffer(encoded))
      }
      this.globalData.svgImages = {
        sitDog: toBase64(sitDogSVG),
        layDog: toBase64(layDogSVG),
        paw: toBase64(pawSVG)
      }
    } catch (e) {
      console.warn('SVG base64 转换失败，请使用本地文件方案', e)
    }
  },

  stringToBuffer(str) {
    const buffer = new ArrayBuffer(str.length)
    const view = new Uint8Array(buffer)
    for (let i = 0; i < str.length; i++) {
      view[i] = str.charCodeAt(i)
    }
    return buffer
  }
})
