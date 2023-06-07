import { QStashConfig } from '../../../modules/Todo/Scheduled';

type QStashConfigAndBody = QStashConfig & { body?: any };

async function fetchQStash(config: QStashConfigAndBody) {
  const { Authorization, URL, delay, cron, maxRetry, body } = config;

  const headers: Record<string, string> = { Authorization: `Bearer ${Authorization}` };

  if (cron) headers['Upstash-Cron'] = cron;
  if (typeof delay !== 'undefined') headers['Upstash-Delay'] = delay.toString();
  if (typeof maxRetry !== 'undefined') headers['Upstash-Retries'] = maxRetry.toString();

  const res = await $fetch<{ scheduleId: string }>(`https://qstash.upstash.io/v1/publish/${URL}`, {
    method: 'POST',
    headers,
    body,
  });
  return res;
}

export default defineEventHandler(async event => {
  const { Authorization, delay, cron, maxRetry, body } = (await readBody<QStashConfigAndBody>(event)) ?? {};

  if (!Authorization) throw new Error('Authorization不能为空');

  const headers = getHeaders(event);
  const { URL } = useRuntimeConfig();
  let url: string = URL ?? headers.origin ?? 'https://todo.antpro.me';
  // !fix 使用环境检查而不是URL检查
  if (url.includes('192.168') || url.includes('localhost') || url.includes('127.0.0.1')) url = 'https://todo.antpro.me';
  if (url.endsWith('/')) url = url.slice(0, -1);
  return fetchQStash({
    Authorization,
    URL: `${url.endsWith('/') ? url.slice(0, -1) : url}/mail`,
    delay,
    cron,
    maxRetry,
    body,
  });
});
