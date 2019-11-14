const { Aliyun } = require('../lib')
const path = require('path')

const aliyun = new Aliyun(process.env.TEST_ALIYUN_ID, process.env.TEST_ALIYUN_SECRET, {
  bucketName: 'randy-assets',
  region: 'oss-cn-shenzhen'
})

test('aliyun upload to bucket directly', async () => {
  const result = await aliyun.uploadToBucket(path.resolve(__dirname, './demo.jpg'), {
    bucketPath: 'test',
    customDomain: 'https://assets.djyde.com'
  })

  expect(result.rawUrl).toEqual('http://randy-assets.oss-cn-shenzhen.aliyuncs.com/test/demo.jpg')
  expect(result.customUrl).toEqual('https://assets.djyde.com/test/demo.jpg')

})