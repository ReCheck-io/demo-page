import Vue from 'vue'
import './plugins/vuetify'
import App from './App'
import './plugins/vuetify'
import router from './router'
import VueQrcodeReader from 'vue-qrcode-reader'
import chain from './chain'
// import './registerServiceWorker'
import Console from './logger'
// var SocialSharing = require('vue-social-sharing');

// var notifier;

// Vue.use(SocialSharing);

(async () => {
  var userAgent = window.navigator.userAgent;
  if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i)) {
    Console.log('Safari Mobile')
  }

  process.versions = {node: '11.2.0'}

  Vue.config.productionTip = true

  Vue.use(VueQrcodeReader)

  /* eslint-disable no-new */
  new Vue({
    render: h => h(App),
    router,
    data () {
      return {
        lastCheckTick : 0
      }
    },
    methods : {
      checkShares(t) {
        if (Date.now() - t.lastCheckTick > 30000) {
          chain.doCheckShares(function (err, message) {
            if (!err) {
              if (message != null) {
                t.lastCheckTick = Date.now()
                t.$root.$emit('error_on', message, 'blue')  
                t.$root.$emit('badge_on')
              } else {
                t.lastCheckTick = 0
                t.$root.$emit('badge_off')
              }
            } else {
                t.lastCheckTick = Date.now() + 30000
                t.v.$root.$emit('error_on', message, 'red')
            }      
          })
        }
      },
    },
  }).$mount('#app')
})()
