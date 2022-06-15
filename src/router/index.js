import VueRouter from 'vue-router'
import SellerPage from '@/views/SellerPage.vue'
import TrendPage from '@/views/TrendPage.vue'

// 注意vue-router的版本,这里应该使用3版本

// 配置路由规则
const router = new VueRouter({
    routes: [
        {
            path: '/sellerpage',
            component: SellerPage
        },
        {
            path: '/trendpage',
            component: TrendPage
        },
    ]
})

//暴露router
export default router