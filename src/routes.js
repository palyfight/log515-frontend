import Admin from './components/Admin.vue';
import Tenant from './components/Tenant.vue';
import Signup from './components/Signup.vue';
import Login from './components/Login.vue';
import DashboardIndex from './components/Dashboard/Index.vue';
import PropertiesIndex from './components/Properties/Properties.vue';
import PropertiesShow from './components/Properties/Property.vue';
import MessagesIndex from './components/Messages/Index.vue';
import MyPropertyIndex from './components/Properties/MyProperty.vue';
import auth from './services/auth';

class Router {
  constructor () {
    this.router = new VueRouter({
      hashbang: false
    })

    this.initRouter()
  }

  initRouter () {
    this.router.map({
      '/signup': {
        name: 'signup',
        component: Signup,
        guest: true
      },

      '/login': {
        name: 'login',
        component: Login,
        guest: true
      },

      '/tenant': {
        component: Tenant,
        auth: true,
        subRoutes: {
          '/dashboard': {
            component: DashboardIndex,
            auth: true
          },
          '/properties': {
            component: PropertiesIndex,
            auth: true
          },
          '/properties/:id': {
            component: PropertiesShow,
            auth: true
          },
          '/messages': {
            component: MessagesIndex,
            auth: true
          },
          '/myproperties': {
            component: MyPropertyIndex,
            auth: true
          }
        }
      },

      '/admin': {
        component: Admin,
        auth: true,
        subRoutes: {
          '/dashboard': {
            component: DashboardIndex,
            auth: true
          },
          '/properties': {
            component: PropertiesIndex,
            auth: true
          },
          '/properties/:id': {
            component: PropertiesShow,
            auth: true
          },
          '/messages': {
            component: MessagesIndex,
            auth: true
          },
          '/myproperties': {
            component: MyPropertyIndex,
            auth: true
          }
        }
      }
    })

    this.router.redirect({
      '*': '/admin/dashboard'
    })

    this.router.beforeEach((transition) => {
      // If the user is trying to access a page requiring authentication
      // and is not yet logged in. Redirect to the login page.
      if (transition.to.auth && !auth.isAuthenticated()) {
        transition.redirect('/login')
      }

      /*// If the user doesn't have a shop yet and is trying to access any page in the admin
      // redirect the user to the shop creation page
      if (transition.to.path !== '/admin/properties/new' && transition.to.auth && !auth.hasProperties()) {
        transition.redirect('/admin/properties/new')
      }

      // Redirect an authenticated user back to the admin if the user is trying to reach the login or
      // signup page.
      if ((transition.to.path === '/login' || transition.to.path === '/signup') && auth.isAuthenticated()) {
        transition.redirect('/admin/dashboard')
      }*/

      transition.next()
    });
  }

  getRouter () {
    return this.router
  }
};

export default Router
