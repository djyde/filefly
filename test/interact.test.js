const Aliyun = require('../lib/aliyun').default
const path = require('path')

const aliyun = new Aliyun(process.env.TEST_ALIYUN_ID, process.env.TEST_ALIYUN_SECRET, {
  bucketName: 'randy-assets',
  region: 'oss-cn-shenzhen',
  customDomains: [
    'https://assets.djyde.com'
  ]
})

aliyun.upload(path.resolve(__dirname, './demo.jpg'))