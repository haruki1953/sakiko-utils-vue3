export const axiosConfig = {
  baseUrl: '/',
  timeout: 10000
}

export const webName = '小祥の工具箱'

// logo图标
import logoImage from '@/assets/logo.png'
export { logoImage }

interface LinkInfo {
  [key: string]: {
    name: string
    fontawesomeClass: string
    // logoUrl?: string
    description: string
    link: string
  }
}
// 联系方式
export const contactInfo: LinkInfo = {
  twitter: {
    name: 'X / Twitter', // 平台名称
    fontawesomeClass: 'fa-brands fa-x-twitter', // fontawesome图标的class
    // logoUrl: '', // 图标地址(有fontawesomeClass则不显示)
    description: '@sakiko214', // 描述,简介
    link: 'https://x.com/sakiko214' // 链接
  },
  discord: {
    name: 'Discord',
    fontawesomeClass: 'fa-brands fa-discord',
    description: '小祥の小窝',
    link: 'https://discord.gg/nZWpvz2WNW'
  },
  github: {
    name: 'Github',
    fontawesomeClass: 'fa-brands fa-github',
    description: 'haruki1953',
    link: 'https://github.com/haruki1953'
  }
}

// 广告
import adImage from '@/assets/moeu-ad-img.jpg'
export const adConfig = {
  image: adImage,
  link: 'https://moeu01.com/sakiko',
  code: 'AGMwNnEN',
  name: '萌物云moeu'
}
