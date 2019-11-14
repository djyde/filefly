# Filefly

All CDN/OSS upload providers in one command.

## Installation

```bash
# npm
npm i -g filefly

# yarn
yarn global add filefly
```

## Overview

```bash
# upload file to Aliyun OSS
filefly aliyun demo.jpg

# upload file to qiniu
filefly qiniu demo.jpg

# open config file
filefly config
```

## Config

Use `$ filefly config` to open the `config.json` folder:

```json
// config.json

{
	"aliyun": {
		"accessKeyId": "",
		"accessKeySecret": "",
		"customDomains": [
			"https://xxx.com",
		]
	}
}
```

## Programmatic usage

```bash
# npm
npm i filefly

# yarn
yarn add filefly
```

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

## Roadmap

- [x] Aliyun
- [ ] qiniu
- [ ] AWS S3

# License

MIT License
