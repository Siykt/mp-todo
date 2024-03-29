import * as nodemailer from 'nodemailer'
import type { Attachment } from 'nodemailer/lib/mailer'
import type { Settings } from '../../models/Settings/Core'

interface MailBody {
  to: string
  data: { message: string; title: string }
  attachments?: Attachment[]
  config: Settings
}

async function sendMail(body: MailBody) {
  const {
    to,
    data,
    attachments,
    config: { SMTPHost, SMTPPort, SMTPUser, SMTPPass, SMTPTLS, SMTPFrom },
  } = body
  const transporter = nodemailer.createTransport({
    host: SMTPHost,
    port: SMTPPort,
    secure: SMTPTLS,
    auth: {
      user: SMTPUser,
      pass: SMTPPass,
    },
    logger: true,
    transactionLog: false,
  })

  const info = await transporter.sendMail({
    to,
    subject: '来自您的 TODO 消息提示',
    from: `TODO消息助手 <${SMTPFrom}>`,
    html: `
      <head>
        <style>
          .card {
            position: relative;
            max-width: 640px;
            min-height: 200px;
            margin: 0 auto;
            border: 2px solid #e9e9e9;
            border-radius: 8px;
            margin-bottom: 14px;
            overflow: hidden;
          }
          .card .title {
            display: flex;
            align-items: center;
            background: #f0f5ff;
            font-weight: bold;
            font-size: 14px;
            color: #6c6cc9;
            padding: 12px 28px;
          }
          .card .body {
            padding: 12px 28px;
            position: relative;
            background-color: #fff;
          }
          .card .body p {
            margin: 0;
            margin-bottom: 12px;
            font-size: 14px;
            color: #666;
            line-height: 1.5;
            word-wrap: break-word;
            word-break: break-all;
            white-space: pre-wrap;
          }
          .card a {
            color: #6c6cc9;
            text-decoration: none;
          }
          .author {
            margin: 0 12px 12px auto;
            width: fit-content;
            font-size: 12px;
            color: #999;
          }
        </style>
      </head>
      <div class="card">
        <div class="title">
          <span>TODO消息助手</span>
          <a href="https://todo.antpro.me" target="_blank" style="margin-left: auto;">查看详情</a>
        </div>
        <div class="body">
          <p>您有一条来自${data.title}新的消息，请查收。</p>
          <p>消息内容如下：</p>
          <div class="body" style="margin-bottom: 20px;">
            <p>${data.message}</p>
          </div>
        </div>
        <div class="author">来自 TODO 消息助手 By <a href="https://github.com/Siykt" target="_blank">Siykt</a></div>
      </div>
    `,
    attachments,
  })
  return info
}

export default defineEventHandler(async (event) => {
  const body = (await readBody<Partial<MailBody> & { data: any }>(event)) ?? {}
  const { SMTP, RECEIVE_EMAIL } = useRuntimeConfig()
  await sendMail({
    to: RECEIVE_EMAIL,
    ...body,
    config: {
      SMTPHost: SMTP.Host,
      SMTPPort: +SMTP.Port,
      SMTPUser: SMTP.User,
      SMTPPass: SMTP.Pass,
      SMTPTLS: SMTP.TLS === 'true',
      SMTPFrom: SMTP.From,
      ...body.config,
    },
  })
  return { message: 'success' }
})
