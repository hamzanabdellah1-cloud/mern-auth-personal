import { useCallback, useState } from 'react'

function readStorageValue(key, fallbackValue) {
  try {
    const storedValue = localStorage.getItem(key)
    return storedValue ? JSON.parse(storedValue) : fallbackValue
  } catch {
    return fallbackValue
  }
}

function useLocalStorage(key, fallbackValue = null) {
  const [value, setValue] = useState(() => readStorageValue(key, fallbackValue))

  const saveValue = useCallback(
    (nextValue) => {
      setValue((currentValue) => {
        const resolvedValue =
          typeof nextValue === 'function' ? nextValue(currentValue) : nextValue

        if (resolvedValue === null || resolvedValue === undefined) {
          localStorage.removeItem(key)
        } else {
          localStorage.setItem(key, JSON.stringify(resolvedValue))
        }

        return resolvedValue
      })
    },
    [key],
  )

  const removeValue = useCallback(() => {
    localStorage.removeItem(key)
    setValue(null)
  }, [key])

  return [value, saveValue, removeValue]
}

export default useLocalStorage
