import React from 'react'
/**
 *
 * @param {*} initialValue
 * @returns {Array} [{ name: '', value: '' }]
 * @src https://dev.to/iamludal/react-custom-hooks-useboolean-3m6c
 */
const useBoolean = (initialValue) => {
  const [value, setValue] = React.useState(initialValue)

  const updateValue = React.useRef({
    toggle: () => setValue((oldValue) => !oldValue),
    on: () => setValue(true),
    off: () => setValue(false),
    // yes: () => setValue(true),
    // no: () => setValue(false),
  })

  return [value, updateValue.current, setValue]
}

export default useBoolean

/**
 @Example 

 const Articles = () => {
  const [articles, setArticles] = useState([])
    const [isLoading, setIsLoading] = useBoolean(false)
    const [isError, setIsError] = useBoolean(false)

    useEffect(() => {
        setIsLoading.on()
        fetch(...)
            .then(res => res.json())
            .then(setArticles)
            .catch(setIsError.on)
            .finally(setIsLoading.off)
  }, [])

  return <> {isLoading ? "YES Loading":"NO Loading"} </>
}
 */
