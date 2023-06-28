import storage from '../storage'

export function useAuth() {
  const token = useState('token', () => '')
  const isLogin = computed(() => !!token.value)
  const configured = useState('configured', () => false)

  onMounted(async () => {
    await nextTick()
    const localToken = await storage.get<string>('token')
    token.value = localToken ?? ''

    if (configured.value)
      return

    const { data } = await useFetch('/api/auth/configured')
    configured.value = data.value ?? false
  })

  async function setToken(value: string) {
    token.value = value
    await storage.set('token', value)
  }

  return { token, setToken, isLogin, configured }
}
