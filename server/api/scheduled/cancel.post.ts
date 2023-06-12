import { CancelScheduledConfig } from '../../../models/Todo/Scheduled';
import { cancelScheduled } from '../../external/QStashAPI';

export default defineEventHandler(async event => {
  const { QSTASH_AUTHORIZATION } = useRuntimeConfig();
  const { authorization = QSTASH_AUTHORIZATION, scheduleId } = (await readBody<CancelScheduledConfig>(event)) ?? {};
  if (!authorization) throw new Error('Authorization不能为空');
  if (!scheduleId) throw new Error('scheduleId不能为空');
  return cancelScheduled({ authorization, scheduleId });
});
