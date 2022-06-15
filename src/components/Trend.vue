<template>
  <div class="com-container">
    <div class="title" :style="comStyle">
      <span>{{'▎  '+ showTitle}}</span>
      <!-- 点击图表，将showChoice的值取反 -->
      <span class="iconfont title-icon" 
            @click="showChoice = !showChoice"
            :style="comStyle"
           >&#xe6eb;</span>
      <ul class="select-con" v-show="showChoice">
        <li
          v-for="item in selectType"
          :key="item.key"
          @click="handleSelect(item.key)"
          :style="marginStyle"
        >
          {{ item.text }}
        </li>
      </ul>
    </div>
    <!-- 显示图表的div -->
    <div class="com-chart" ref="trend_ref"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chartInstane: null,
      allData: null, // 从服务器中获取的所有数据
      showChoice: false, // 是否显示选择框
      choiceType: "map", // 选择的图表类型
      titleFontSize: "16", // 标题字体大小
    };
  },
  computed: {
    // 计算类别
    selectType() {
      if (!this.allData) {
        return [];
      } else {
        // 返回type数组
        return this.allData.type.filter((item) => {
          return item.key !== this.choiceType;
        });
      }
    },
    // 计算呈现出来的标题内容
    showTitle(){
        if(!this.allData){
            return ''
        }else{
            return this.allData[this.choiceType].title
        }
    },
    // 设置给标题的样式
    comStyle(){
        return {
            fontSize:this.titleFontSize + 'px' 
        }
    },
    marginStyle(){
        return {
            marginLeft:this.titleFontSize/1.1 + 'px'
        }
    }
  },
  methods: {
    // 选择展示的数据类型
    handleSelect(currentType) {
      this.choiceType = currentType;
      // 选择之后更新图表数据
      this.updateChart();
      this.showChoice = false;
      //   this.renderChart();
    },
    initChart() {
      this.chartInstane = echarts.init(this.$refs.trend_ref, "chalk");
      const initOption = {
        grid: {
          left: "3%",
          top: "30%",
          right: "4%",
          bottom: "1%",
          containLabel: true,
        },
        tooltip: {
          // 数据在坐标轴上显示工具组件提示
          trigger: "axis",
          //   axisPointer: {
          //     type: "shadow",
          //   },
        },
        legend: {
          right: 20,
          top: "15%",
          icon: "circle",
        },
        xAxis: {
          type: "category",
          //紧挨坐标轴边缘
          boundaryGap: false,
        },
        yAxis: {
          type: "value",
        },
      };
      this.chartInstane.setOption(initOption);
    },
    async getData() {
      // 获取服务器数据
      const { data: ret } = await this.$http.get("trend");
      this.allData = ret;
      console.log(this.allData);
      // 将数据传给图表
      this.updateChart();
    },
    updateChart() {
      // 半透明的颜色
      const colorArr1 = [
        "rgba(11, 168, 44, 0.5)",
        "rgba(44, 110, 255, 0.5)",
        "rgba(22, 242, 217, 0.5)",
        "rgba(254, 33, 30, 0.5)",
        "rgba(250, 105, 0, 0.5)",
      ];
      // 全透明的颜色值
      const colorArr2 = [
        "rgba(11, 168, 44, 0)",
        "rgba(44, 110, 255, 0)",
        "rgba(22, 242, 217, 0)",
        "rgba(254, 33, 30, 0)",
        "rgba(250, 105, 0, 0)",
      ];
      // 处理数据
      // x轴数据为月份
      const timeArr = this.allData.common.month;
      // y轴数据为销售趋势 每一个城市的月销售额
      const saleArr = this.allData[this.choiceType].data;
      // map遍历 形成一个对象数组 对应series配置
      const seriesArr = saleArr.map((item, index) => {
        return {
          name: item.name,
          type: "line",
          data: item.data,
          stack: this.choiceType,
          areaStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: colorArr1[index],
              },
              {
                offset: 1,
                color: colorArr2[index],
              },
            ]),
          },
        };
      });
      // 图例的数据
      const legendArr = saleArr.map((item) => {
        return item.name;
      });
      const dataOption = {
        xAxis: {
          data: timeArr,
        },
        series: seriesArr,
        legend: {
          data: legendArr,
        },
      };
      this.chartInstane.setOption(dataOption);
    },
    screenAdapt() {
    // 设置标题字体大小
      this.titleFontSize = this.$refs.trend_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        legend:{
            itemWidth:this.titleFontSize,
            itemHeight:this.titleFontSize,
            itemGap:this.titleFontSize,
            textStyle:{
                fontSize:this.titleFontSize/2
                }
        }
      };
      this.chartInstane.setOption(adapterOption);
      this.chartInstane.resize();
    },
  },
  mounted() {
    this.initChart();
    this.getData();
    window.addEventListener("resize", this.screenAdapt);
    // 主动触发各种尺寸的计算
    this.screenAdapt();
  },
  destroyed() {
    window.removeEventListener("resize", this.screenAdapt);
  },
};
</script>

<style lang="css" scoped>
* {
  margin: 0;
  padding: 0;
}
li {
  list-style: none;
  cursor: pointer;
  /* margin-left: 15px; */
}
.title {
  position: absolute;
  color: #fff;
  z-index: 10;
  /* font-size:25px ; */
  left: 20px;
  top: 20px;
}
.title-icon {
  margin-left: 10px;
  cursor: pointer;
}
.select-con {
    background: #222733;
}
</style>