const fetch = require('node-fetch')

const httpModule = () => {
  const request = async (
    url,
    options = { method: 'GET', body: null, headers: {} }
  ) => {
    try {
      const res = await fetch(url, {
        method: options.method || 'GET',
        body: options.body && JSON.stringify(options.body),
        headers: options.headers || {},
      })

      if (!res.ok) throw new Error('Request error')

      return res.json()
    } catch (e) {
      console.log(e)
    }
  }

  return { request }
}

module.exports = httpModule()
