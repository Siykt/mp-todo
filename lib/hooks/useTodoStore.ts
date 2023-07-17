import { nanoid } from 'nanoid'
import storage from '../storage'
import { isBrowser } from '~/lib/isBrowser'
import type { TodoGroup, TodoInfo } from '~/models/Todo/Core'

export function useSidesStore() {
  const sides = useState<TodoGroup[]>('sides', () => [])
  const activeSide = useState<TodoGroup>('activeSide', () => ({ id: 'default', title: '默认分组', total: 0 }))
  const browser = isBrowser()

  const init = async () => {
    if (!browser)
      return
    sides.value = await storage.get<TodoGroup[]>('sides', [{ id: 'default', title: '默认分组', total: 0 }])
    activeSide.value = sides.value[0] ?? {}
  }

  const upsetSide = async (side: Omit<TodoGroup, 'id' | 'total'> & { id?: string }) => {
    const curSide: TodoGroup = {
      ...side,
      id: side.id ?? nanoid(),
      total: side.id ? sides.value.find(s => s.id === side.id)?.total ?? 0 : 0,
    }
    // update
    if (side.id) {
      sides.value = sides.value.map(s => (s.id === side.id ? curSide : s))
    }
    else {
      // create
      sides.value.push(curSide)
    }
    await storage.set('sides', sides.value)
    return curSide
  }

  const deleteSide = async (id: string) => {
    if (sides.value.length === 1)
      return
    sides.value = sides.value.filter(s => s.id !== id)
    const todos = useState<TodoInfo[]>('todos', () => [])
    todos.value = todos.value.filter(t => t.group !== id)
    // TODO 需要处理删除失败的情况
    await Promise.all([storage.set('todos', todos.value), storage.set('sides', sides.value)])
  }

  return {
    init,
    sides,
    activeSide,
    upsetSide,
    deleteSide,
  }
}

export function useTodosStore() {
  const { activeSide, sides } = useSidesStore()
  const todos = useState<TodoInfo[]>('todos', () => [])
  const activeTodos = computed(() => todos.value.filter(todo => todo.group === activeSide.value.id))
  const browser = isBrowser()

  const init = async () => {
    if (browser)
      todos.value = await storage.get<TodoInfo[]>('todos', [])
  }

  const upsetTodo = async (todo: Omit<TodoInfo, 'id' | 'group'> & { id?: string }) => {
    const curTodo: TodoInfo = {
      ...todo,
      id: todo.id ?? nanoid(),
      group: activeSide.value.id,
    }
    // update
    if (todo.id) {
      todos.value = todos.value.map(t => (t.id === todo.id ? curTodo : t))
    }
    else {
      // create
      todos.value.unshift(curTodo)
      sides.value = sides.value.map((side) => {
        if (side.id === activeSide.value.id)
          side.total++
        return side
      })
    }
    await Promise.all([storage.set('todos', todos.value), storage.set('sides', sides.value)])
    return curTodo
  }

  const deleteTodo = async (id: string) => {
    todos.value = todos.value.filter(t => t.id !== id)
    sides.value = sides.value.map((side) => {
      if (side.id === activeSide.value.id)
        side.total--
      return side
    })
    await Promise.all([storage.set('todos', todos.value), storage.set('sides', sides.value)])
  }

  return {
    init,
    todos,
    deleteTodo,
    activeSide,
    activeTodos,
    upsetTodo,
  }
}
