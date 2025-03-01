import VueRouter from "vue-router";
import MyLogin from '../views/MyLogin'
import MyMain from '../views/MyMain'
import MyRegister from '../views/MyRegister'
import UserInfo from '../views/UserInfo'
import MySuanfa from '../components/MySuanfa'
// import ShowAlgorithm from '../pages/ShowAlgorithm'
const router = new VueRouter({
    mode:'hash',
    routes:[
        {
        path:'/',
        component:MyLogin,
        redirect:'/login',
        },
        {
            path:'/login',
            component:MyLogin,
            name:'login'
        },
        {
            path:'/main',
            component:MyMain,
            name:'main',
            children:[
                {
                    path: 'algorithm/:algorithmName',
                    component: MySuanfa
                }                
            ]

        },
        {
            path:'/register',
            component:MyRegister,
            name:'register'
        },
        {
            path:'/userinfo',
            component:UserInfo,
            name:'userinfo'
        }
    ]
})
export default router