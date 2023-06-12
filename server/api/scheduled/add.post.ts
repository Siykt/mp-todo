import { AddScheduledConfig } from '../../../models/Todo/Scheduled';
import { addScheduled } from '../../external/QStashAPI';

export default defineEventHandler(async event => {
  const { QSTASH_AUTHORIZATION } = useRuntimeConfig();
  const { authorization = QSTASH_AUTHORIZATION, URL, ...others } = (await readBody<AddScheduledConfig>(event)) ?? {};

  if (!authorization) throw new Error('Authorization不能为空');

  const headers = getHeaders(event);
  let url: string = URL ?? headers.origin ?? 'https://todo.antpro.me';
  // !fix 使用环境检查而不是URL检查
  if (url.includes('192.168') || url.includes('localhost') || url.includes('127.0.0.1')) url = 'https://todo.antpro.me';
  if (url.endsWith('/')) url = url.slice(0, -1);
  return addScheduled({ authorization, URL: `${url}/api/mail`, ...others });
});
