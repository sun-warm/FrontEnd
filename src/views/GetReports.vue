<template>
  <div class="reports-container">
    <h2>报告列表</h2>
    <button @click="GetReports">获取报告</button>
    <div v-if="data">
      <h3>Data from API:</h3>
      <pre>{{ data }}</pre>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'GetReports',
  data() {
    return {
      data: null,
    };
  },
  methods: {
    async GetReports() {
      try {
        const userName = sessionStorage.getItem('user_name');
        const role = sessionStorage.getItem('role');
        const response = await axios({
          method: 'post',
          url: '/report/get',
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
          data: {
            user_name: userName,
            role: role,
          }
        });
        this.data = response.data;
      } catch (error) {
        console.error('Error posting data:', error);
      }
    },
  },
  mounted() {
    this.GetReports(); // 在组件挂载时获取数据
  }
};
</script>

<style scoped>
.reports-container {
  text-align: center;
  margin-top: 50px;
}
</style>