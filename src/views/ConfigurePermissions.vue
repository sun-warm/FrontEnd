<template>
  <div class="form-section">
    <h3>平台权限管理</h3>
    <form @submit.prevent="configurePermissions">
      <div class="form-group">
        <label for="username">用户名:</label>
        <input type="text" v-model="permissions.username" required />
      </div>
      <div class="form-group">
        <label for="department">部门:</label>
        <select v-model="permissions.department" required>
          <option value="领导班子">领导班子</option>
          <option value="党委办公室">党委办公室</option>
          <option value="党委组织部">党委组织部</option>
          <option value="项目统筹部">项目统筹部</option>
          <option value="交易研发部">交易研发部</option>
          <option value="结算研发部">结算研发部</option>
          <option value="数据研发部">数据研发部</option>
          <option value="综合研发部">综合研发部</option>
          <option value="验收测试部">验收测试部</option>
          <option value="系统集成部">系统集成部</option>
          <option value="市场产品管理部">市场产品管理部</option>
          <option value="市场交易开发部">市场交易开发部</option>
          <option value="市场结算开发部">市场结算开发部</option>
          <option value="市场综合开发部">市场综合开发部</option>
          <option value="市场测试集成部">市场测试集成部</option>
          <option value="市场服务部">市场服务部</option>
          <option value="运维中心">运维中心</option>
          <option value="北京分公司">北京分公司</option>
          <option value="技术服务部">技术服务部</option>
          <option value="信息安全部">信息安全部</option>
          <option value="技术保障部">技术保障部</option>
          <option value="质量控制部">质量控制部</option>
          <option value="财务部">财务部</option>
          <option value="综合部">综合部</option>
          <option value="金融科技研究中心">金融科技研究中心</option>
        </select>
      </div>
      <div class="form-group">
        <label for="role">角色:</label>
        <select v-model="permissions.role" required>
          <option value="admin">管理员</option>
          <option value="user">用户</option>
        </select>
      </div>
      <button type="submit" class="btn">配置权限</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ConfigurePermissions',
  data() {
    return {
      permissions: {
        username: '',
        role: 'user'
      }
    };
  },
  methods: {
    async configurePermissions() {
      try {
        const userName = sessionStorage.getItem('user_name'); // 从 sessionStorage 中获取 user_name
        console.log('userName:', userName); // 使用计算属性获取 user_name
        const response = await axios(
          {
            method: 'post',
            url: '/user/modify_admin',
            headers: {
              'Content-Type': 'application/json',
              'User-Name': userName
            },
            data: {
              user_name: this.permissions.username,
              platform_role: this.permissions.role == "user" ? 1 : 2,
              department: this.permissions.department
            },
            withCredentials: true
          });
        console.log('修改管理员配置成功:', response.data);
        
        // 模拟登录成功，跳转到 Home 页面
        //this.$router.push({ name: 'Home' });
      } catch (error) {
        console.error('添加账号失败:', error);
      }
    }
  }
};
</script>

<style scoped>
.form-section {
  margin-bottom: 20px;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h3 {
  margin-bottom: 15px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input, select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

button.btn {
  display: inline-block;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button.btn:hover {
  background-color: #0056b3;
}
</style>