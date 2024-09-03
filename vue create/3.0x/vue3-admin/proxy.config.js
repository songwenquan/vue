/**
 * @format
 * @Author: wqsong2
 * @Date: 2023/7/12 18:02
 * @Desciption:本地请求转发代理配置
 */
/* eslint-disable */
const proxyArr = [
  {
    cookie: 'SESSION=YzgzZjE0N2QtZGI1ZC00MjQwLWE0NDMtY2QyZTc2ZDRlMzc3',
    context: 'bog-prov-receive',
    options: {
      target: 'http://172.31.236.187:9090/bog-prov-receive/',
      ws: true,
      changeOrigin: true,
      pathRewrite: {
        "^/bog-prov-receive": "",
      }
    }
  },
  {
    cookie: 'SESSION=MzZhM2EyMTYtNjZkMi00ODhhLTgzOTEtZWY1ZGNmMWEzNWU4; YTH-IDP-ACCESS-TOKEN=eb515f7bdb9bde45f5af7534b09184fc_20231122163358456-740D-796FD13BC',
    context: 'yth-dm-indicator-web',
    options: {
      target: 'https://xc-pro.iflytek.work/yth-dm-indicator-web/',
      ws: true,
      changeOrigin: true,
      pathRewrite: {
        "^/yth-dm-indicator-web": "",
      }
    }
  },
]

module.exports = proxyArr.reduce((acc, cur, idx) => {
  // eslint-disable-next-line no-useless-escape
  acc[`^\/${cur.context}\/[^\.]*((\.do)|(\.html)|(\.woff2)|(\.woff)|(\.ttf)|(\.(.*?)\.*css)|(\.(.*?)\.*js)|(\.(.*?)\.*png)|(\.(.*?)\.*gif)|(\.(.*?)\.*jpg))?$`] = {
    ...cur.options,
    onProxyReq: (proxyReq) => {
      cur.cookie &&
        proxyReq.setHeader('Cookie', `${cur.cookie};Path=/${cur.context}`)
    },
    bypass (req, res, proxyOptions) {
      if (req.method === 'OPTIONS') {
        res.statusCode = 200
        return 'a'
      }
    }
  }
  return acc
}, {})
/* eslint-disable no-new */
