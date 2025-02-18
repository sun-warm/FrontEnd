<template>
  <div class="home-container">
    <div class="sidebar">
      <ul>
        <router-link to="/" exact>
          <template v-slot="{ navigate, isActive, isExactActive }">
            <li :class="{ active: isActive || isExactActive }" @click="navigate">
              <div class="icon-button">
                <i class="fas fa-user"></i>
                <span class="tooltip">个人度量报表</span>
              </div>
            </li>
          </template>
        </router-link>
        <router-link to="/get-reports">
          <template v-slot="{ navigate, isActive, isExactActive }">
            <li :class="{ active: isActive || isExactActive }" @click="navigate">
              <div class="icon-button">
                <i class="fas fa-chart-bar"></i>
                <span class="tooltip">自定义获取</span>
              </div>
            </li>
          </template>
        </router-link>
      </ul>
      <ul class="bottom">
        <router-link to="/settings">
          <template v-slot="{ navigate, isActive, isExactActive }">
            <li :class="{ active: isActive || isExactActive }" @click="navigate">
              <div class="icon-button">
                <i class="fas fa-cog"></i>
                <span class="tooltip">配置</span>
              </div>
            </li>
          </template>
        </router-link>
      </ul>
    </div>
    <div class="content">
      <div class="header">
        <div class="avatar" @click="toggleDropdown">
          <i class="fas fa-user-circle"></i>
        </div>
        <div v-if="showDropdown" class="dropdown">
          <ul>
            <li @click="logout">退出登录</li>
          </ul>
        </div>
        <div class="icon-button config-button" @click="toggleConfig">
          <i class="fas fa-cog"></i>
          <span class="tooltip">主页设置</span>
        </div>
      </div>
      <h2>欢迎小🐍指导</h2>
      <!-- <div v-if="data">
        <h3>Data from API:</h3>
        <pre>{{ data }}</pre>
      </div> -->
      <div class="charts-container">
        <div v-for="(chart, index) in charts" :key="index" class="chart-wrapper">
          <div :id="'chart' + index" class="chart"></div>
          <div v-if="showConfig" class="delete-icon" @click="deleteChart(index)">
            <i class="fas fa-trash"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import * as echarts from 'echarts';

export default {
  name: 'HomePage',
  data() {
    return {
      data: null,
      showDropdown: false,
      showConfig: false,
      charts: [
        { xAxisType: 'person', yAxisType: 'hours', chartType: 'bar' },
        { xAxisType: 'person', yAxisType: 'code', chartType: 'bar' },
        { xAxisType: 'person', yAxisType: 'tasks', chartType: 'bar' },
        { xAxisType: 'day', yAxisType: 'hours', chartType: 'line' }
      ] // 固定的图表配置
    };
  },
  methods: {
    async GetHomePage() {
      try {
        const userName = sessionStorage.getItem('user_name'); // 从 sessionStorage 中获取 user_name
        console.log('userName:', userName); // 使用计算属性获取 user_name
        const response = await axios({
          method: 'post',
          url: '/report/home_page',
          headers: {
            'Content-Type': 'application/json',
            'User-Name': userName,
            //'Cache-Control': 'no-cache',
          },
          withCredentials: true,
          data: {
            user_name: userName, // 使用 sessionStorage 中的 user_name
          }
        });
        //console.log('Data from API:', response.data);
        this.data = response.data;
        this.$nextTick(() => {
          this.initCharts(); // 初始化图表
        });
      } catch (error) {
        console.error('Error posting data:', error);
        //当响应状态码为401时，重定向到登录页面
        if (error.response && error.response.status === 401) {
          this.$router.push('/login'); // 重定向到登录页面
        }
      }
    },
    initCharts() {
      this.charts.forEach((chart, index) => {
        this.updateChart(index);
      });
    },
    updateChart(index) {
      const chart = this.charts[index];
      const xAxisDataArray = this.getDataByType(chart.xAxisType);
      const yAxisDataArray = this.getDataByType(chart.yAxisType);

      const chartDom = document.getElementById('chart' + index);
      if (chartDom) {
        const myChart = echarts.init(chartDom);

        const option = {
          title: {
            text: 'ECharts 示例 ' + (index + 1)
          },
          tooltip: {},
          legend: {
            data: ['数据']
          },
          xAxis: {
            data: xAxisDataArray
          },
          yAxis: {},
          series: [{
            name: '数据',
            type: chart.chartType,
            data: yAxisDataArray
          }]
        };

        myChart.setOption(option);

        // 监听窗口大小变化，调整图表大小
        window.addEventListener('resize', () => {
          myChart.resize();
        });
      }
    },
    getDataByType(type) {
      // 根据类型返回相应的数据
      switch (type) {
        case 'person':
          return ['人员1', '人员2', '人员3', '人员4', '人员5'];
        case 'hours':
          return Array.from({ length: 5 }, () => Math.floor(Math.random() * 40) + 10);
        case 'code':
          return Array.from({ length: 5 }, () => Math.floor(Math.random() * 1000) + 100);
        case 'tasks':
          return Array.from({ length: 5 }, () => Math.floor(Math.random() * 20) + 5);
        case 'day':
          return ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
        default:
          return [];
      }
    },
    selectTab(tab) {
      // 根据选项卡选择不同的内容
      console.log('Selected tab:', tab);
      // 这里可以根据选项卡的选择来更新页面内容
    },
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    toggleConfig() {
      this.showConfig = !this.showConfig;
    },
    async deleteChart(index) {
      try {
        const userName = sessionStorage.getItem('user_name');
        const chartToDelete = this.charts[index];
        const response = await axios({
          method: 'post',
          url: '/report/modify',
          headers: {
            'Content-Type': 'application/json',
            'User-Name': userName,
          },
          withCredentials: true,
          data: {
            report_requests:[{
              x_label: chartToDelete.xAxisType,
              y_label: chartToDelete.yAxisType,
              report_type: chartToDelete.chartType,
              add: 2, // 2 表示删除
            }],
          }
        });
        if (response.status === 200) {
          this.charts.splice(index, 1);
          this.$nextTick(() => {
            this.initCharts(); // 重新初始化图表
          });
        }
      } catch (error) {
        console.error('Error deleting chart:', error);
      }
    },
    logout() {
      sessionStorage.removeItem('user_name');
      this.$router.push('/login');
    }
  },
  mounted() {
    this.GetHomePage(); // 在组件挂载时获取数据
  }
};
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

body, html {
  margin: 0;
  padding: 0;
  height: 100%;
}

.home-container {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 120px;
  background-color: #f4f4f4;
  padding: 10px; /* 减少内边距 */
  box-shadow: 2px 0 5px rgba(0,0,0,0.1);
}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0; /* 移除上方空白 */
}

.sidebar ul.top {
  margin-bottom: auto; /* 将顶部的 ul 推到最上方 */
}

.sidebar ul.bottom {
  margin-top: auto; /* 将底部的 ul 推到最下方 */
}

.sidebar li {
  margin-bottom: 10px;
  cursor: pointer;
  padding: 10px;
  background-color: #fff;
  border-radius: 5px;
  transition: background-color 0.3s;
  position: relative;
}

.sidebar li:hover {
  background-color: #e0e0e0;
}

.icon-button {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px; /* 调整图标大小 */
}

.tooltip {
  visibility: hidden;
  width: 60px; /* 调整提示文本宽度 */
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 5px;
  padding: 2px; /* 调整内边距 */
  position: absolute;
  z-index: 1;
  bottom: 125%; /* Position the tooltip above the icon */
  left: 50%;
  margin-left: -28px; /* 调整提示文本位置 */
  opacity: 0;
  transition: opacity 0.3s;
  font-size: 12px; /* 调整提示文本字体大小 */
}

.icon-button:hover .tooltip {
  visibility: visible;
  opacity: 1;
}

.content {
  flex: 1;
  padding: 7px; /* 缩小内边距 */
  margin:0;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 10px;
  background-color: #f4f4f4;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.avatar {
  position: relative;
  cursor: pointer;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

.avatar i {
  font-size: 14px;
  color: #555;
}

.config-button {
  margin-left: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  font-size: 12px;
  color: #555;
  cursor: pointer;
  position: relative;
}

.config-button .tooltip {
  visibility: hidden;
  width: 80px;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 5px;
  padding: 2px;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: -40px;
  opacity: 0;
  transition: opacity 0.3s;
  font-size: 12px;
}

.config-button:hover .tooltip {
  visibility: visible;
  opacity: 1;
}
/* .avatar i {
  font-size: 40px;
  color: #555;
} */

.dropdown {
  position: absolute;
  top: 100px;
  right: 40px;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  border-radius: 5px;
  overflow: hidden;
  font-size: 12px;
}

.dropdown ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.dropdown li {
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.dropdown li:hover {
  background-color: #f4f4f4;
}

.chart-wrapper {
  width: 48%; /* 根据页面大小的一半确认表格的宽度 */
  margin-bottom: 20px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  padding: 10px;
}

.charts-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  flex: 1;
}

.chart {
  height: 300px; /* 按比例缩放长度 */
  resize: both; /* 支持滑块拖动 */
  overflow: auto;
}


</style>