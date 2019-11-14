# Filefly

Put all CDN/OSS upload in one SDK.

## Installation

```bash
yarn add filefly
```

## Usage

### Aliyun

#### interactive upload

```js
import { Aliyun } from 'filefly'

const aliyun = new Aliyun(process.env.ALIYUN_ID, process.env.ALIYUN_SECRET)

// You'll be asked for which Bucket to choose, what custom domain is, or custom upload bucket path
const { rawUrl, customUrl } = await aliyun.upload(path.resolve(__dirname, 'demo.jpg'))
```

#### directly upload

```js
const aliyun = new Aliyun(process.env.TEST_ALIYUN_ID, process.env.TEST_ALIYUN_SECRET, {
  // must set bucket name and region first
  bucketName: '',
  region: ''
})

const { rawUrl, customUrl } = await aliyun.uploadToBucket(path.resolve(__dirname, './demo.jpg'), {
  bucketPath: 'path/to',
  customDomain: 'https://assets.xxx.com'
})
```

# License

MIT License
