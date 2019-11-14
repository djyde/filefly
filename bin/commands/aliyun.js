const {
  Aliyun
} = require('../../lib')
const ask = require('inquirer')
const path = require('path')
const OSS = require('ali-oss')
const conf = require('../conf')

exports.command = 'aliyun <filePath>'
exports.desc = 'Upload to Aliyun'

async function listBuckets(id, secret) {
  const oss = new OSS({
    accessKeyId: id,
    accessKeySecret: secret,
  })
  const {
    buckets
  } = await oss.listBuckets()
  return buckets
}

exports.handler = async function ({
  filePath
}) {
  if (!conf.get('aliyun')) {
    // ask for token
    const {
      id,
      secret
    } = await ask.prompt([{
        name: 'id',
        type: 'input',
        message: 'The AcceessKeyId',
      },
      {
        name: 'secret',
        type: 'input',
        message: 'The AcceessKeySecret',
      },
    ])

    conf.set('aliyun.accessKeyId', id)
    conf.set('aliyun.accessKeySecret', secret)
  }

  const {
    accessKeyId,
    accessKeySecret,
    customDomains
  } = conf.get('aliyun')

  const buckets = await listBuckets(accessKeyId, accessKeySecret)

  const {
    bucket,
    customDomain,
    bucketPath
  } = await ask.prompt([{
      type: 'list',
      name: 'bucket',
      when() {
        return !conf.get('aliyun.defaultBucket')
      },
      message: 'Choose your bucket',
      choices: buckets.map(bucket => {
        return {
          name: bucket.name,
          value: bucket
        }
      })
    },
    {
      type: 'list',
      name: 'customDomain',
      message: 'custom domain for CDN',
      when() {
        return customDomains && customDomains.length
      },
      choices: customDomains.map(domain => ({
        name: domain,
        value: domain,
      }))
    },
    {
      type: 'input',
      name: 'bucketPath',
      message: 'bucket path'
    }
  ])

  const aliyun = new Aliyun(accessKeyId, accessKeySecret, {
    region: bucket.region,
    bucketName: bucket.name
  })

  const {
    rawUrl,
    customUrl
  } = await aliyun.uploadToBucket(path.resolve(process.cwd(), filePath), {
    customDomain,
    bucketPath
  })

  console.log('Raw url:', rawUrl)
  customDomain && console.log('Custom Url', customUrl)
}