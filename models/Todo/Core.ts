import { TodoScheduled } from './Scheduled';

export interface TodoInfo {
  id: string;
  /** 分组ID */
  group: string;
  /** 标题 */
  title: string;
  /** 描述 */
  description?: string;
  /** 是否完成 */
  completed: boolean;
  /** 定时提醒配置 */
  scheduled: {
    enabled: boolean;
    config?: TodoScheduled;
  };
}

export interface TodoGroup {
  id: string;
  title: string;
  total: number;
}
