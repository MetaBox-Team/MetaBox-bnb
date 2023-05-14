export function useDebounce<T extends Function>(fn: T, wait = 1000) {
  let timer
  return () => {
    clearInterval(timer)
    timer = setTimeout(() => {
      fn()
    }, wait)
  }
}

export const useInputDebounce = (fn) => {
  const debounce = useDebounce(fn)
  debounce()
}
