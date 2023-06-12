import { Settings } from '~/models/Settings/Core';
import storage from '../storage';

export const useSettingsStore = () => {
  const settings = useState<Settings>('settings', () => ({ SMTPTLS: false }));

  const getLocalSettings = async () => {
    if (process.server) return;
    settings.value = await storage.get<Settings>('settings', { SMTPTLS: false });
  };

  const saveLocalSettings = async () => {
    if (process.server) return;
    await storage.set('settings', settings.value);
  };

  onMounted(getLocalSettings);

  return {
    settings,
    getLocalSettings,
    saveLocalSettings,
  };
};
