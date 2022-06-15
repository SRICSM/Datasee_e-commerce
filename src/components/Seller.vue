<!-- 商家销量统计的横向柱状图 全屏显示 -->
<template>
  <div class="com-container">
    <!-- 显示图表的div -->
    <div class="com-chart" ref="seller_ref"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
        // 图表的数据
        chartInstance: null,
        allData: null, // 服务器返回的数据
        currentPage: 1, // 当前页码 利用定时器更新当前页码
        totalPage: 0, // 总页码 通过计算得到
        interval: null, // 定时器的标识
    }
  },
  methods: {
    // 初始化echartsInstance对象 init()方法返回值是一个echartsInstance实例对象
    initChart() {
        this.chartInstance = this.$echarts.init(this.$refs.seller_ref,'chalk');
        // 对图表初始化的配置
        const initOption = {
            title:{
                text:'▎商家销量统计',
                textStyle:{
                    fontWeight:'bold',
                    color:'#fff'
                },
                left:20,
                top:28,
            },
            // 图表位置大小
            grid:{
                left:'3%',
                right:'6%',
                top:'20%',
                bottom:'3%',
                // 距离包含坐标轴文字
                containLabel:true
            },
            xAxis: {
                type:'value',
            },
            yAxis: {
                type:'category',
            },
            tooltip: {
                // 触发时机 axis鼠标移到坐标轴触发
                trigger: 'axis',
                // 移到坐标轴上展示的样式
                axisPointer: {
                    type: 'line',
                    // 展示级别
                    z: 0,
                    lineStyle: {
                        color: '#2D3443',
                    },
                }
            },
            series:[{
                type:'bar',
                barWidth: 66,
                // 文字提示
                label:{
                    show:true,
                    position:'right',
                    formatter: '{c}',
                    color:'#fff',
                },
                itemStyle:{
                    barBorderRadius:[0,33,33,0],
                    // 线性渐变
                    // 指明颜色渐变的方向
                    // 指明不同百分比之下颜色的值 （x1,y1,x2,y2）
                    color:new this.$echarts.graphic.LinearGradient(0,0,1,0,[{
                        offset:0,
                        color:'#5052EE'
                    },{
                        offset:1,
                        color:'#AB6EE5'
                    }]),
                },
            }]

        }
        this.chartInstance.setOption(initOption);
        // 对图表对象进行鼠标事件的监听
        this.chartInstance.on('mouseover', () => {
            // 鼠标移入取消定时器
            clearInterval(this.interval)
        })
        this.chartInstance.on('mouseout', () => {
            // 鼠标移出开启定时器
            this.startInterval()
        })
            // 鼠标移出开启定时器
    },
    // 获取服务器数据
    async getData() {
        // await返回promise对象成功(resolve)的值 
        // 解构赋值,获取ret里面的data数组
        const {data:ret} = await this.$http.get('/seller')
        this.allData = ret
        // 对数据进行排序
        this.allData.sort((a, b) => {
            // 从小到大进行排序
            return a.value - b.value
        })
        console.log(this.allData)
        // 计算总页码 这里每五个数据一页 Meth.ceil()向上取整
        this.totalPage = Math.ceil(this.allData.length / 5)


        // 获取数据之后,启动定时器
        this.startInterval()

        this.updateChart()
    },
    // 更新图表
    updateChart() {
        // console.log('更新图表' + this.currentPage)
        const start = (this.currentPage - 1) * 5 // 开始的索引 数组中索引是从0开始的 所以要减一
        const end = start + 5 // 结束的索引
        // 要展示的数据
        const showData = this.allData.slice(start, end)
        // console.log(showData)
        // map 方法会迭代数组中的每一个元素，并根据回调函数来处理每一个元素，最后返回一个新数组
        // map 遍历.提取data里面的name和value,分别形成两个数组
        const sellerName = showData.map(item => item.name)
        const sellerValue = showData.map(item => item.value)
        // 将服务器给我们的数据进行option对象的设置
        const dataOption = {
            // 图表位置大小
            yAxis: {
                data: sellerName,
            },
            series:[{
                data: sellerValue,
            }]
        }
        this.chartInstance.setOption(dataOption)
    },
    // 开启定时器
    startInterval(){
        // 函数节流 防止定时器重复嵌套执行
        if(this.interval) {
            clearInterval(this.interval)
        }
        this.interval = setInterval(() => {
            // 每三秒改变当前页码
            this.currentPage++
            // 当前页码超过总页码时,重置当前页码为1
            if(this.currentPage > this.totalPage){
                this.currentPage = 1
            }
            this.updateChart()
        }, 3000)
    },
    // 屏幕适配 当浏览器窗口大小发生变化的时候会调用的方法
    screenAdapter(){
        const titleFontsize = this.$refs.title.clientWidth / 100 * 3.6
        const adaptOption = {
            title: {
                textStyle: {
                    fontSize: titleFontsize,
                }
            },
            tooltip: {
                axisPointer:{
                    lineStyle:{
                        width:titleFontsize
                    }
                }
            },
            series:[{
                barWidth: titleFontsize,
                itemStyle:{
                    barBorderRadius:[0,titleFontsize/2,titleFontsize/2,0],
                    }
            }]
        }
        this.chartInstance.setOption(adaptOption)
        // 手动调用图表的resize方法，才能产生效果
        this.chartInstance.resize()
    }
    },
  mounted() {
    this.initChart()
    this.getData()
    window.addEventListener('resize',this.screenAdapter)
    // 在页面加载完成后主动进行屏幕适配
    this.screenAdapter()
  },
  destroyed(){
    clearInterval(this.interval)
    // 注销resize事件
    window.removeEventListener('resize',this.screenAdapter)
  }
}
</script>

<style >
</style>