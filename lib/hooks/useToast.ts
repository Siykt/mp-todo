interface ToastConfig {
  /** 提示内容 */
  content: string
  /** 自动关闭的延时，单位 s，设为 0 时不自动关闭 */
  duration?: number
  /** 关闭时的回调函数 */
  onClose?: () => void
}

export function useToast() {
  const rootElRef = ref<HTMLElement | null>(null)

  const close = () => {
    const rootEl = rootElRef.value
    if (!rootEl)
      return
    rootEl.textContent = ''
    rootEl.remove()
    rootElRef.value = null
  }

  const insert = (config: ToastConfig) => {
    let rootEl = rootElRef.value
    if (!rootEl) {
      rootEl = document.createElement('div')
      rootEl.className = 'a-toast-container'
      rootElRef.value = rootEl
      document.body.appendChild(rootEl)
    }

    const toast = document.createElement('div')
    toast.className = 'a-toast'
    toast.textContent = config.content
    rootEl.appendChild(toast)
    setTimeout(() => (toast.style.opacity = '1'), 10)
    config.duration ??= 3
    if (config.duration > 0) {
      setTimeout(() => {
        toast.style.opacity = '0'
        config.onClose?.()
        setTimeout(close, 300)
      }, config.duration * 1000)
    }
  }

  const info = (configOrContent: string | ToastConfig) => {
    const config = typeof configOrContent === 'string' ? { content: configOrContent } : configOrContent
    insert(config)
    return () => {
      close()
      config.onClose?.()
    }
  }

  return {
    info,
  }
}
