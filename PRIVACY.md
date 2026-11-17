# 隐私政策 / Privacy Policy

适用于 Chrome 扩展程序「YuNuo – 密码与 API Key 生成器」。
Applies to the Chrome extension "YuNuo – Password & API Key Generator".

生效日期 / Effective date: 2026-11-17

---

## 中文

### 我们收集哪些数据

不收集。YuNuo 不收集、不上传、不出售、不与任何第三方共享用户数据，也不包含统计分析、广告或追踪代码。

### 保存在你设备上的内容

为了记住你的偏好，扩展程序通过 `chrome.storage.local` 在你的浏览器本地保存一项设置，只包含：

- 密码长度；
- 大写字母、小写字母、数字、特殊符号四个开关的状态。

这些设置只保存在当前浏览器中，不会同步或发送到任何地方。卸载扩展程序时，浏览器会一并删除这些设置。

生成的密码和 API Key **不会被保存**。关闭弹窗后即被丢弃。

### 剪贴板

只有在你点击「复制」按钮时，扩展程序才会把当前显示的结果写入系统剪贴板。扩展程序从不读取剪贴板。复制后的内容由操作系统保管，直到你复制其他内容将其替换。

### 网络

扩展程序不发送任何网络请求。其内容安全策略（`connect-src 'none'`）禁止扩展页面建立任何网络连接，所有代码均随扩展程序打包，不加载远程代码。

### 权限

扩展程序只申请 `storage` 权限，用于保存上述偏好设置；不申请任何网站访问权限。

### 政策变更

如本政策发生变化，更新后的内容会发布在此文件中并修改生效日期。修改历史可在本仓库的提交记录中查看。

### 联系方式

如有疑问，请在 GitHub 提交 Issue：<https://github.com/juemingai/passkey/issues>

---

## English

### Data we collect

None. YuNuo does not collect, transmit, sell, or share any user data with third parties, and contains no analytics, advertising, or tracking code.

### What is stored on your device

To remember your preferences, the extension stores one setting locally in your browser using `chrome.storage.local`. It contains only:

- the password length;
- whether uppercase letters, lowercase letters, numbers, and symbols are enabled.

This setting stays in your current browser and is never synced or sent anywhere. The browser deletes it when you uninstall the extension.

Generated passwords and API keys are **never stored**. They are discarded when the popup closes.

### Clipboard

The extension writes the displayed result to your system clipboard only when you click the Copy button. It never reads the clipboard. Copied content is held by your operating system until you replace it by copying something else.

### Network

The extension makes no network requests. Its Content Security Policy (`connect-src 'none'`) blocks all network connections from extension pages. All code ships inside the extension package; no remote code is loaded.

### Permissions

The extension requests only the `storage` permission, used to save the preferences described above. It requests no website access.

### Changes to this policy

If this policy changes, the updated version will be published in this file with a new effective date. The change history is available in this repository's commit log.

### Contact

For questions, please open an issue on GitHub: <https://github.com/juemingai/passkey/issues>
