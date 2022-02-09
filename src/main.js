// import './assets/index.css';
// import './assets/index.less';

// console.log('[ 77 ] >', 77)

// function name(params) {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve(`77-${params}`)
//     }, 1000)
//   })
// }

// name('靓仔').then(res => {
//   console.log('[ res ] >', res)
// })

import Vue from 'vue'
import App from './App.vue'
// require('../assets/123.jpg')

new Vue({
  render: h => h(App)
}).$mount('#app')