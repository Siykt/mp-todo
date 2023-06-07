import * as nodemailer from 'nodemailer';
import { Attachment } from 'nodemailer/lib/mailer';
import { Settings } from '../../modules/Settings/Core';

interface MailBody {
  to: string;
  data: object;
  attachments?: Attachment[];
  config: Settings;
}

async function sendMail(body: MailBody) {
  const {
    to,
    data,
    attachments,
    config: { SMTPHost, SMTPPort, SMTPUser, SMTPPass, SMTPTLS, SMTPFrom },
  } = body;
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
  });

  const info = await transporter.sendMail({
    to,
    subject: '来自您的 TODO 消息提示',
    from: `TODO消息助手 <${SMTPFrom}>`,
    html: `
      <div style="padding: 20px; background-color: #f5f5f5;">
        <div style="padding: 20px; background-color: #fff; border-radius: 4px;">
          ${data}
        </div>
      </div>
    `,
    attachments,
  });

  console.log('Message sent: ', info);
  return info;
}

export default defineEventHandler(async event => {
  const body = (await readBody<MailBody>(event)) ?? {};
  await sendMail(body);
  return { message: 'success' };
});
