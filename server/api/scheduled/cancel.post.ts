import { CancelScheduledConfig } from '../../../modules/Todo/Scheduled';
import { cancelScheduled } from '../../external/QStashAPI';

export default defineEventHandler(async event => {
  const { authorization, scheduleId } = (await readBody<CancelScheduledConfig>(event)) ?? {};
  if (!authorization) throw new Error('Authorization不能为空');
  if (!scheduleId) throw new Error('scheduleId不能为空');
  return cancelScheduled({ authorization, scheduleId });
});
