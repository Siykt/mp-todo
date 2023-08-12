import storage from '../storage'
import { isBrowser } from '~/lib/isBrowser'
import type { Settings } from '~/models/Settings/Core'

export function useSettingsStore() {
  const settings = useState<Settings>('settings', () => ({ SMTPTLS: false }))
  const browser = isBrowser()

  const getLocalSettings = async () => {
    if (browser)
      settings.value = await storage.get<Settings>('settings', { SMTPTLS: false })
  }

  const saveLocalSettings = async () => {
    if (browser)
      await storage.set('settings', settings.value)
  }

  onMounted(getLocalSettings)

  return {
    settings,
    getLocalSettings,
    saveLocalSettings,
  }
}
