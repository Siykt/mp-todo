import { CancelScheduledConfig, cancelScheduled } from '../../external/QStashAPI';

export default defineEventHandler(async event => {
  const { authorization, scheduledId } = (await readBody<CancelScheduledConfig>(event)) ?? {};
  if (!authorization) throw new Error('Authorization不能为空');
  if (!scheduledId) throw new Error('scheduledId不能为空');
  return cancelScheduled({ authorization, scheduledId });
});
