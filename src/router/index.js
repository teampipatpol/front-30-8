import Vue from 'vue';
import VueRouter from 'vue-router';
import HomeView from '../views/HomeView.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login.vue'),
  },
  {
    path: '/registers',
    name: 'registers',
    component: () => import('../views/registers.vue'),
  },
  {
    path: "",
    name: "toolbar",
    component: () => import("../views/toolbar.vue"),
    children: [
      {
        path: "/Me",
        name: "Me",
        component: () => import("../views/Me.vue"),
      },
      {
        path: "/simple",
        name: "simple",
        component: () => import("../views/simple.vue"),
      },
      {
        path: "/call",
        name: "call",
        component: () => import("../views/call.vue"),
      },
      {
        path: '/sell',
        name: 'sell',
        component: () => import('../views/sell.vue'),
      },
      {
        path: '/sales',
        name: 'sales',
        component: () => import('../views/sales.vue'),
      },
      {
        path: '/addproduct',
        name: 'addproduct',
        component: () => import('../views/addproduct.vue'),
      },
      {
        path: '/approve',
        name: 'approve',
        component: () => import('../views/approve.vue'),
      },
      {
        path: '/salesdetail',
        name: 'salesdetail',
        component: () => import('../views/salesdetail.vue'),
      },
      {
        path: '/new',
        name: 'new',
        component: () => import('../views/new.vue'),
      },
      {
        path: '/sd3',
        name: 'sd3',
        component: () => import('../views/sd3.vue'),
      },
      {
        path: '/sd4',
        name: 'sd4',
        component: () => import('../views/sd4.vue'),
      },
    ],
  },
  {
    path: "",
    name: "footer",
    component: () => import("../views/footer.vue"),
    children: [
      {
        path: "/Me",
        name: "Me",
        component: () => import("../views/Me.vue"),
      },
      {
        path: "/call",
        name: "call",
        component: () => import("../views/call.vue"),
      },
    ],
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/registers'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('token'); 

  if (authRequired && !loggedIn) {
    return next('/login'); 
  }

  next(); 
});

export default router;
