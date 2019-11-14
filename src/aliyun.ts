import * as OSS from 'ali-oss'
import * as path from 'path'
import * as fs from 'fs'
import * as inquirer from 'inquirer'

export type Bucket = {
  name: string,
  region: string
}

export type AliyunOptions = {
  bucketName: string,
  region: string,
  customDomains?: string[]
}

export default class Aliyun {

  private bucketClient
  private ossClient

  constructor(private id: string, private secret: string, private options?: AliyunOptions) {

    this.ossClient = new OSS({
      accessKeyId: this.id,
      accessKeySecret: this.secret,
    })

    if (options?.bucketName && this.options?.region) {
      this.setBucketClient(options.region, options.bucketName)
    }
  }

  private setBucketClient(region: string, bucket: string) {
    this.bucketClient = new OSS({
      accessKeyId: this.id,
      accessKeySecret: this.secret,
      region,
      bucket,
    })
  }

  async listBuckets() {
    return (await this.ossClient.listBuckets()).buckets as Bucket[]
  }

  async upload(filePath: string) {
    const buckets = await this.listBuckets()
    const answer: {
      bucket: {
        name: string,
        region: string
      },
      customDomain: string,
      bucketPath: string
    } = await inquirer.prompt([
      {
        type: 'list',
        name: 'bucket',
        message: 'Choose your bucket',
        choices: buckets.map(bucket => {
          return {
            name: bucket.name,
            value: bucket
          }
        })
      },
      {
        type: this.options?.customDomains?.length ? 'list' : 'input',
        name: 'customDomain',
        message: 'custom domain for CDN',
        choices: this.options?.customDomains ? this.options.customDomains.map(domain => ({
          name: domain,
          value: domain,
        })) : []
      },
      {
        type: 'input',
        name: 'bucketPath',
        message: 'bucket path'
      }
    ])

    const { bucket, customDomain, bucketPath } = answer

    this.setBucketClient(bucket.region, bucket.name)

    return this.uploadToBucket(filePath, {
      bucketPath,
      customDomain
    })
  }

  async uploadToBucket(filePath: string, options?: {
    bucketPath?: string,
    customDomain?: string
  }) {
    if (!this.bucketClient) {
      console.error('You did not pass options.region and options.bucket')
      return
    }

    const { base } = path.parse(filePath)
    const bucketFilePath = options?.bucketPath ? path.join(options.bucketPath, base) : base

    const result = await this.bucketClient.put(bucketFilePath, fs.createReadStream(filePath))
    if (result.res.status !== 200) {
      throw result.res
    }

    return {
      rawUrl: result.url,
      customUrl: options?.customDomain ? this.bucketClient.generateObjectUrl(bucketFilePath, options.customDomain) : result.url
    }
  }
}