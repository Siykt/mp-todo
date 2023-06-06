import { QStashConfig } from '../../modules/Todo/Scheduled';

async function fetchQStash(config: QStashConfig & { body?: any }) {
  const { Authorization, URL, delay, cron, maxRetry, body } = config;

  const headers: Record<string, string> = { Authorization: `Bearer ${Authorization}` };

  if (cron) headers['Upstash-Cron'] = cron;
  if (typeof delay !== 'undefined') headers['Upstash-Delay'] = delay.toString();
  if (typeof maxRetry !== 'undefined') headers['Upstash-Retries'] = maxRetry.toString();

  console.log('config ->', config);
  const res = await $fetch(`https://qstash.upstash.io/v1/publish/${URL}`, {
    method: 'POST',
    headers,
    body,
  });
  console.log('res ->', config, res);
  return res as any;
}

export default defineEventHandler(async event => {
  const { Authorization, delay, cron, maxRetry } = await readBody<QStashConfig>(event);
  const { URL } = useRuntimeConfig();
  const headers = getHeaders(event);

  if (!Authorization) throw new Error('Authorization is required');

  let url: string = URL ?? headers.origin ?? 'https://todo.antpro.me';
  // !fix 使用环境检查而不是URL检查
  if (url.includes('192.168') || url.includes('localhost') || url.includes('127.0.0.1')) url = 'https://todo.antpro.me';
  if (url.endsWith('/')) url = url.slice(0, -1);
  return fetchQStash({
    Authorization,
    URL: `${url.endsWith('/') ? url.slice(0, -1) : url}/scheduled-callback`,
    delay,
    cron,
    maxRetry,
    body: { message: 'test' },
  });
});
