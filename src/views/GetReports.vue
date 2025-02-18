<template>
  <div class="home-container">
    <div class="sidebar">
      <ul>
        <router-link to="/">
          <template v-slot="{ navigate, isActive, isExactActive }">
            <li :class="{ active: isActive || isExactActive }" @click="navigate">
              <div class="icon-button">
                <i class="fas fa-user"></i>
                <span class="tooltip">个人度量报表</span>
              </div>
            </li>
          </template>
        </router-link>
        <router-link to="/get-reports" exact>
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
      </div>
      <h2>获取报表</h2>
      <div>
        <button @click="setViewMode('preset')" :class="{ active: viewMode === 'preset' }">预设图表</button>
        <button @click="setViewMode('custom')" :class="{ active: viewMode === 'custom' }">自定义图表</button>
      </div>
      <div v-if="viewMode === 'preset'">
        <div class="charts-container">
          <div v-for="(chart, index) in paginatedCharts" :key="index" :class="['chart-wrapper', { 'preset-chart': viewMode === 'preset', 'custom-chart': viewMode === 'custom' }]">
            <div :id="'chart' + index" class="chart"></div>
          </div>
        </div>
        <div class="pagination">
          <button @click="prevPage" :disabled="currentPage === 1">上一页</button>
          <span>第 {{ currentPage }} 页</span>
          <button @click="nextPage" :disabled="currentPage === totalPages">下一页</button>
        </div>
      </div>
      <div v-if="viewMode === 'custom'">
        <div>
          <label for="xAxis">选择横坐标:</label>
          <select v-model="customChart.xAxis">
            <option value="person">人员</option>
            <option value="day">日期</option>
          </select>
        </div>
        <div>
          <label for="yAxis">选择纵坐标:</label>
          <select v-model="customChart.yAxis">
            <option value="hours">工时</option>
            <option value="code">代码行数</option>
            <option value="tasks">任务数</option>
          </select>
        </div>
        <div>
          <label for="chartType">选择图表类型:</label>
          <select v-model="customChart.type">
            <option value="bar">条形图</option>
            <option value="line">折线图</option>
            <option value="pie">饼图</option>
          </select>
        </div>
        <button @click="generateCustomChart">生成图表</button>
        <div v-if="customChartGenerated" :class="['chart-wrapper', { 'preset-chart': viewMode === 'preset', 'custom-chart': viewMode === 'custom' }]">
          <div id="customChart" class="chart"></div>
          <div class="custom-chart-buttons">
            <button @click="addToPreset">加入预设</button>
            <button @click="addToHome">加入主页</button>
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
  name: 'GetReports',
  data() {
    return {
      data: null,
      showDropdown: false,
      charts: [
        { xAxisType: 'person', yAxisType: 'hours', chartType: 'bar' },
        { xAxisType: 'person', yAxisType: 'code', chartType: 'bar' },
        { xAxisType: 'person', yAxisType: 'tasks', chartType: 'bar' },
        { xAxisType: 'day', yAxisType: 'hours', chartType: 'line' },
        { xAxisType: 'day', yAxisType: 'code', chartType: 'line' },
        { xAxisType: 'day', yAxisType: 'tasks', chartType: 'line' }
      ], // 固定的图表配置
      viewMode: 'preset', // 当前视图模式，'preset' 或 'custom'
      currentPage: 1, // 当前页码
      itemsPerPage: 4, // 每页显示的图表数量
      customChart: {
        xAxis: 'person',
        yAxis: 'hours',
        type: 'bar'
      },
      customChartGenerated: false // 是否生成了自定义图表
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.charts.length / this.itemsPerPage);
    },
    paginatedCharts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.charts.slice(start, end);
    }
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
    logout() {
      sessionStorage.removeItem('user_name');
      this.$router.push('/login');
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.$nextTick(() => {
          this.initCharts(); // 重新初始化图表
        });
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.$nextTick(() => {
          this.initCharts(); // 重新初始化图表
        });
      }
    },
    generateCustomChart() {
      this.customChartGenerated = true;
      this.$nextTick(() => {
        const xAxisDataArray = this.getDataByType(this.customChart.xAxis);
        const yAxisDataArray = this.getDataByType(this.customChart.yAxis);

        const chartDom = document.getElementById('customChart');
        if (chartDom) {
          const myChart = echarts.init(chartDom);

          const option = {
            title: {
              text: '自定义图表'
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
              type: this.customChart.type,
              data: yAxisDataArray
            }]
          };

          myChart.setOption(option);

          // 监听窗口大小变化，调整图表大小
          window.addEventListener('resize', () => {
            myChart.resize();
          });
        }
      });
    },
    setViewMode(mode) {
      this.viewMode = mode;
      if (mode === 'preset') {
        this.$nextTick(() => {
          this.initCharts(); // 重新初始化图表
        });
      }
    },
    addToPreset() {
      // 将自定义图表加入预设图表
      this.charts.push({
        xAxisType: this.customChart.xAxis,
        yAxisType: this.customChart.yAxis,
        chartType: this.customChart.type
      });
      alert('自定义图表已加入预设图表');
    },
    addToHome() {
      // 将自定义图表加入主页
      // 这里可以添加相应的逻辑，例如发送请求到后端保存图表配置
      alert('自定义图表已加入主页');
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
  height: 100vh; /* 确保容器高度为视口高度 */
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
  padding: 7px; /* 增加内边距 */
  margin: 0;
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

.avatar img {
  font-size: 14px;
  color: #555;
}

.dropdown {
  position: absolute;
  top: 100px; /* 确保下拉菜单显示在头像下方 */
  right: 0;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  border-radius: 5px;
  overflow: hidden;
  font-size: 12px; /* 调整下拉菜单的字体大小 */
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

.button-group {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.button-group button {
  margin: 0 10px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.button-group button:hover {
  background-color: #0056b3;
}

.button-group button.active {
  background-color: #0056b3;
}

.chart-wrapper {
  margin-bottom: 20px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  padding: 10px;
}

.preset-chart {
  width: 48%; /* 预设图表宽度 */
}

.custom-chart {
  width: 100%; /* 自定义图表宽度 */
  height: 400px; /* 自定义图表高度 */
  justify-content: center; /*居中*/
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

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination button {
  margin: 0 10px;
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.custom-chart-container {
  display: flex;
  flex-direction: column;
  align-items: center;/*水平居中*/
  justify-content: center;/*垂直居中*/
  flex: 1; /* 占满剩余空间 */
  width: 200%; /* 占满父容器宽度 */
  max-width: 1200px; /* 最大宽度 */
  margin: 0 auto; /* 水平居中 */
}

.custom-chart-options {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.custom-chart-options div {
  margin-bottom: 10px;
}

.custom-chart-options label {
  margin-right: 10px;
}

.custom-chart-buttons {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.custom-chart-buttons button {
  margin: 0 10px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.custom-chart-buttons button:hover {
  background-color: #0056b3;
}
</style>