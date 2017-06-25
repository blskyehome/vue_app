/**
 * Created by wang on 2017/6/25.
 */
import config from '../config'
import axios from 'axios'
export default {
  getCategoryItem () {
    axios({
      method: 'get',
      url: config.serverURI + '/user/category',
      params: {
        token: localStorage.token
      }
    })
      .then(response => {
        console.log('Hello World')
        console.log('category Response:', response)
        if (response.status !== 200) {
          this.error = response.statusText
          return
        }
        return (response.data.data)
      })
      .catch(error => {
        // Request failed.
        console.log('error', error.response)
        return (error.response.statusText)
      })
  }

}
