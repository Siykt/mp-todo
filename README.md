# TODO 消息助手

## 介绍

消息助手是一个基于网页版的 TODOS，可以添加任务与提醒。

## 使用

### 注册 QStash

在 [QStash](https://upstash.com) 注册账号，然后在 [qstash](https://console.upstash.com/qstash) 页面获取 `token`。

![](https://files.catbox.moe/39xxf8.png)

### 安装

```bash
pnpm install
```

### 运行

```bash
pnpm run dev
```

## 配置

在项目根目录下创建 `.env` 文件，添加以下内容：

```bash
# App 配置
NUXT_APP_DOMAIN=YOUR_DOMAIN

# 接收邮件的邮箱地址
NUXT_RECEIVE_EMAIL=RECEIVE_EMAIL

# SMTP 配置
NUXT_SMTP_HOST=SMTP_HOST
NUXT_SMTP_PORT=SMTP_PORT
NUXT_SMTP_TLS=false
NUXT_SMTP_USER=SMTP_USER
NUXT_SMTP_FROM=SMTP_FROM
NUXT_SMTP_PASS=SMTP_PASS

# upstash 配置
NUXT_UPSTASH_REDIS_PATH=UPSTASH_REDIS_PATH
NUXT_QSTASH_AUTHORIZATION=QSTASH_AUTHORIZATION

# Authing 配置
NUXT_AUTHING_APP_ID=AUTHING_APP_ID
NUXT_AUTHING_APP_SECRET=AUTHING_APP_SECRET
NUXT_AUTHING_ISSUER=AUTHING_ISSUER
```

或者直接在应用中添加、修改

![](https://files.catbox.moe/zxc7p7.png)

## 部署

### vercel

在 [vercel](https://vercel.com) 上部署，需要在项目中添加以上环境变量即可

![](https://files.catbox.moe/s896c5.png)
