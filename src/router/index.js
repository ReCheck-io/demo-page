import Vue from 'vue'
import Router from 'vue-router'
import AppHome from '@/components/AppHome'

// with the const path 400 kb are saved

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'AppHome',
      default: false,
      component: AppHome,
      title: "ReCheck functionality test"
    },
    {
      path: '*',
      redirect: '/'
    }
  ],
  // eslint-disable-next-line
  scrollBehavior(to, from, savedPosition) {
    return {
      x: 0,
      y: 0
    }
  }
})