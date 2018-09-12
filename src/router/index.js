import Vue from 'vue'
import Router from 'vue-router'
import signup from '@/components/Signup'
import login from '@/components/login'
import users from '@/components/users'
import dashboard from '@/components/Dashboard'
import employees from '@/components/Employees'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/signup',
      name: 'SignUp',
      component: signup
    },
    {
      path: '/login',
      name: 'Login',
      component: login
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: dashboard,
      children : [
        {
          path: 'users',
          name: 'Users',
          component: users,
        },
        {
          path: 'employees',
          name: 'Employees',
          component: employees,
        }
      ]
    }
  ]
})
