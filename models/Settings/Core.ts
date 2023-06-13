export interface Settings {
  /**
   * QStash Token
   * @description 用于自动触发定时任务
   * @see https://docs.upstash.com/qstash/apiexamples
   */
  authorization?: string

  /**
   * 邮件发送配置
   * @description 用于发送邮件通知
   * @see https://nodemailer.com/smtp/
   */
  email?: string
  SMTPHost?: string
  SMTPPort?: number
  SMTPUser?: string
  SMTPPass?: string
  SMTPTLS?: boolean
  SMTPFrom?: string

  /**
   * TODO 暂未支持
   * 存储配置
   * - [ ] 支持本地与线上存储媒介
   * - [ ] 支持本地的存储类型调整
   */
  StorageType?: 'local' | 'online'
  localStorageType?: 'indexedDB' | 'WebSQL' | 'localStorage'
}
