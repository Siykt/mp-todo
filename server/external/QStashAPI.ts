export interface CancelScheduledConfig {
  scheduledId: string;
  authorization: string;
}

/**
 * 取消定时任务
 * @param config 配置
 */
export async function cancelScheduled(config: CancelScheduledConfig) {
  const { authorization, scheduledId } = config;
  const res = await $fetch<{ scheduleId: string }>(`https://qstash.upstash.io/v1/schedules/${scheduledId}`, {
    headers: { Authorization: `Bearer ${authorization}` },
  });
  return res;
}

// export function addScheduled() {}
