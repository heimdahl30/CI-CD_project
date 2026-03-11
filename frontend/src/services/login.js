import axios from 'axios'
const baseUrl = 'http://127.0.0.1:3003/api/login'

const login = async credentials => {
  const response = await axios.post(baseUrl, credentials, { timeout: 5000 })
  return response.data
}

export default { login }