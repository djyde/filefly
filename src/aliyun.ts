import * as OSS from 'ali-oss'
import * as path from 'path'
import * as fs from 'fs'
import * as inquirer from 'inquirer'
import * as conf from 'conf'

export type Bucket = {
  name: string,
  region: string
}

export type AliyunExtra = {
  bucketName: string,
  region: string
}

export default class Aliyun {

  private ossClient

  constructor(private id: string, private secret: string, private extra: AliyunExtra) {

    this.ossClient = new OSS({
      accessKeyId: this.id,
      accessKeySecret: this.secret,
      region: extra.region,
      bucket: extra.bucketName
    })
  }

  async uploadToBucket(filePath: string, options?: {
    bucketPath?: string,
    customDomain?: string
  }) {

    const { base } = path.parse(filePath)
    const bucketFilePath = options?.bucketPath ? path.join(options.bucketPath, base) : base

    const result = await this.ossClient.put(bucketFilePath, fs.createReadStream(filePath))
    if (result.res.status !== 200) {
      throw result.res
    }

    return {
      rawUrl: result.url,
      customUrl: options?.customDomain ? this.ossClient.generateObjectUrl(bucketFilePath, options.customDomain) : result.url
    }
  }
}