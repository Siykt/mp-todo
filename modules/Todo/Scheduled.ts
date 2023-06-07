/**
 * @see https://docs.upstash.com/qstash/apiexamples
 */
export interface QStashConfig {
  /** 授权 */
  Authorization: string;
  /** EndPoint */
  URL: string;
  /** 延迟 */
  delay?: number;
  /** 定期任务配置 */
  cron?: string;
  /** 最大重试次数 */
  maxRetry?: number;
}

export interface TodoScheduled extends Omit<QStashConfig, 'Authorization' | 'URL'> {
  id: string;
  message: string;
  /** scheduleId 用于取消 schedule */
  scheduleId?: string;
}
