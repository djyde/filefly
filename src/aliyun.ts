import * as OSS from 'ali-oss'
import * as path from 'path'
import * as fs from 'fs'

export type Bucket = {
  name: string,
  region: string
}

export type AliyunOptions = {
  bucketName: string,
  region: string,
}

export default class Aliyun {

  private bucketClient
  private ossClient

  constructor (private id: string, private secret: string, private options?: AliyunOptions) {

    this.ossClient = new OSS({
      accessKeyId: this.id,
      accessKeySecret: this.secret,
    })

    if (options?.bucketName && this.options?.region) {
      this.setBucketClient(options.region, options.bucketName)
    }
  }

  private setBucketClient (region: string, bucket: string) {
    this.bucketClient = new OSS({
      accessKeyId: this.id,
      accessKeySecret: this.secret,
      region,
      bucket,
    }) 
  }

  async listBuckets() {
    return await this.ossClient.listBuckets() as Bucket[]
  }

  async upload () {
    const buckets = await this.listBuckets()
    console.log(buckets)
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