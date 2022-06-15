<!-- 针对于 /sellerpage 这条路径显示出来 
在这个组件中,通过子组件注册的方式,要显示出Seller.vue这个组件 -->

<template>
  <div class="com-page">
    <Seller/>
  </div>
</template>

<script>
import Seller from '@/components/Seller.vue'
export default {
    data() {
        return {
            
        }
    },
    components: {
        Seller
    }
}
</script>

<style lang="less" scoped>

</style>