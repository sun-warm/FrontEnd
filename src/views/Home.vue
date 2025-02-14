<template>
  <div class="home-container">
    <h2>欢迎来到主页</h2>
    <div v-if="data">
      <h3>Data from API:</h3>
      <pre>{{ data }}</pre>
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
    };
  },
  methods: {
    async GetHomePage() {
      try {
        const userName = sessionStorage.getItem('user_name'); // 从 sessionStorage 中获取 user_name
        console.log('userName:', userName); // 使用计算属性获取 userName
        const response = await axios({
          method: 'post',
          url: '/report/home_page',
          headers: {
            'Content-Type': 'application/json',
            //'Cache-Control': 'no-cache',
            'User-Name': userName, // 使用计算属性获取 userName
          },
          withCredentials: true,
          data: {
            user_name: userName, // 使用计算属性获取 userName
          }
        });
        console.log('Data from API:', response.data);
        this.data = response.data;
      } catch (error) {
        console.error('Error posting data:', error);
      }
    },
  },
  mounted() {
    this.GetHomePage(); // 在组件挂载时获取数据
  }
};
</script>

<style scoped>
.home-container {
  text-align: center;
  margin-top: 50px;
}
</style>