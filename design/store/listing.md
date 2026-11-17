# Chrome 应用商店后台填写内容

在 Chrome 应用商店开发者后台上架或更新版本时使用。功能、权限或数据处理方式有变化时，需同步更新本文件、[隐私政策](../../PRIVACY.md) 和 README，保持三者与插件实际行为一致。

审核员通常阅读英文，英文为主版本；中文用于中文商店页面。

## 一、商店详情（Store listing）

### 详细说明 · English

```
YuNuo generates strong passwords and sk- style API keys right in your browser. Nothing is ever sent anywhere.

Features
• Passwords from 4 to 128 characters. Adjust with − / + buttons, the slider, or by typing.
• Choose any mix of uppercase, lowercase, numbers and symbols. Each selected type appears at least once.
• API keys with an sk- prefix followed by 48 random letters and numbers (51 characters in total). Register the key in your own service or gateway before use; a generated key is not valid anywhere on its own.
• Copy with one click, or refresh for a new result.
• Interface in English and Simplified Chinese, following your browser language.

Privacy by design
• Randomness comes from the Web Crypto API (crypto.getRandomValues) with no modulo bias.
• No network requests, no analytics, no tracking.
• Only your length and character preferences are saved locally. Generated passwords and keys are never stored.
• Requests only the "storage" permission and no website access.

Open source under the MIT license: https://github.com/juemingai/passkey
```

### 详细说明 · 中文

```
YuNuo 在浏览器本地生成高强度密码和 sk- 格式的 API Key，任何内容都不会被发送出去。

功能
• 密码长度 4–128 位，可用 − / + 按钮、滑块或直接输入调整。
• 大写字母、小写字母、数字、特殊符号自由组合，每种已选类型至少出现一次。
• API Key 为 sk- 前缀加 48 位随机字母与数字，共 51 位。需要先在你自己的服务或网关中配置录入才能使用，生成的密钥本身不对任何平台有效。
• 一键复制，随时刷新生成新结果。
• 界面支持简体中文和英文，自动跟随浏览器语言。

隐私设计
• 随机数来自 Web Crypto API（crypto.getRandomValues），并消除取模偏差。
• 不发送网络请求，没有统计分析，不做任何追踪。
• 只在本地保存长度和字符类型偏好，从不保存生成的密码和密钥。
• 只申请「存储」权限，不申请任何网站访问权限。

基于 MIT 协议开源：https://github.com/juemingai/passkey
```

### 其他字段

| 字段 | 填写内容 |
|------|------|
| 类别 | 开发者工具（Developer Tools）；没有该选项时选「工具」 |
| 语言 | 默认英语，另加「中文（简体）」，每种语言分别上传对应截图和文案 |
| 商店图标 | `extension/icons/icon128.png` |
| 截图 | `design/store/screenshot-<语言>-password.png`、`screenshot-<语言>-api.png` |
| 小型宣传图块 | `design/store/promo-small-<语言>.png` |
| 官方网址 | `https://github.com/juemingai/passkey` |
| 支持网址 | `https://github.com/juemingai/passkey/issues` |

## 二、隐私权（Privacy practices）

### 单一用途说明

```
Generates random passwords and API keys locally in the extension popup so the user can copy them.
```

### 权限理由：`storage`

```
Saves the user's password length and character-type preferences in chrome.storage.local so they persist between popup openings. Generated passwords and keys are never stored.
```

### 远程代码

选择「No, I am not using remote code」。

### 数据使用

- 第一组「收集哪些用户数据」：一项都不勾。插件只在本地保存偏好设置，不收集也不传输任何数据。
- 第二组的 3 项承诺全部勾选：不向第三方出售或传输用户数据；不将数据用于与单一用途无关的目的；不用于评估信用或放贷。

如后台的选项说明与上述理解不一致，以后台说明为准。

### 隐私政策网址

```
https://github.com/juemingai/passkey/blob/main/PRIVACY.md
```

## 三、分发（Distribution）

| 字段 | 建议 |
|------|------|
| 可见性 | 公开 |
| 地区 | 所有地区 |
| 价格 | 免费 |

## 四、上传新版本

1. 递增 `extension/manifest.json` 中的 `version`。
2. 运行 `npm run package`，上传生成的 `dist/yunuo-<版本号>.zip`。
3. 界面有变化时运行 `sh design/store/build.sh` 重新导出截图并上传。
4. 权限或数据处理方式有变化时，同步更新本文件第二部分和隐私政策。
