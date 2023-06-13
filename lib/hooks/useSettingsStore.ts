import storage from '../storage'
import type { Settings } from '~/models/Settings/Core'

export function useSettingsStore() {
  const settings = useState<Settings>('settings', () => ({ SMTPTLS: false }))

  const getLocalSettings = async () => {
    if (process.server)
      return
    settings.value = await storage.get<Settings>('settings', { SMTPTLS: false })
  }

  const saveLocalSettings = async () => {
    if (process.server)
      return
    await storage.set('settings', settings.value)
  }

  onMounted(getLocalSettings)

  return {
    settings,
    getLocalSettings,
    saveLocalSettings,
  }
}
