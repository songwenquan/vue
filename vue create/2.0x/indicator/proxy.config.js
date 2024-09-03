/*
 * @Author: wqsong2
 * @Date: 2024/04/07 19:08
 * @Description:
 */
const proxyArr = [
    {
      header: {
        cookie: 'YTH-IDP-ACCESS-TOKEN=3a0d51feae05bf6f6a00a754ee08eb45_20231122163358456-740D-796FD13BC; SESSION=Njc4MmRlZWEtYmVhYi00OWMzLWI1MTctMDc0NDZjYmI3ZmRi',
      },
      context: 'yth-dm-indicator-web',
      options: {
        target: 'https://xc-pro.iflytek.work/yth-dm-indicator-web/',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/yth-dm-indicator-web': ''
        }
      }
    }
  ]
  
  module.exports = proxyArr.reduce((acc, cur, idx) => {
    // eslint-disable-next-line no-useless-escape
    acc[cur.context] = {
      ...cur.options,
      onProxyReq: proxyReq => {
        // 代理时将header挂载
        if (cur.header) {
          for (const key in cur.header) {
            proxyReq.setHeader(key, cur.header[key]);
          }
        }
      },
      // proxyOptions
      bypass (req, res) {
        if (req.method === 'OPTIONS') {
          res.statusCode = 200
          return 'a'
        }
      }
    }
    return acc
  }, {})
  