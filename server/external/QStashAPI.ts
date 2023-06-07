import { AddScheduledConfig, CancelScheduledConfig, ScheduledEntry } from '../../modules/Todo/Scheduled';

/**
 * 取消定时任务
 * @param config 配置
 */
export async function cancelScheduled(config: CancelScheduledConfig) {
  const { authorization, scheduledId } = config;
  const res = await $fetch<{ status: string; error: string }>(`https://qstash.upstash.io/v1/schedules/${scheduledId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${authorization}` },
  });
  if (res.error) throw new Error(res.error);
  return res;
}

/**
 * 添加定时任务
 * @param config 配置
 */
export function addScheduled(config: AddScheduledConfig) {
  const { authorization, URL, delay = 0, cron, maxRetry = 0, body } = config;
  const headers: Record<string, string> = {
    Authorization: `Bearer ${authorization}`,
    'Upstash-Cron': cron,
    'Upstash-Retries': maxRetry.toString(),
    'Upstash-Delay': delay.toString(),
  };
  return $fetch<{ scheduleId: string }>(`https://qstash.upstash.io/v1/publish/${URL}`, {
    method: 'POST',
    headers,
    body,
  });
}

/**
 * 获取当前的定时任务列表
 * @param config 配置
 */
export function getScheduledList(authorization: string) {
  return $fetch<ScheduledEntry[]>(`https://qstash.upstash.io/v1/schedules`, {
    headers: { Authorization: `Bearer ${authorization}` },
  });
}
