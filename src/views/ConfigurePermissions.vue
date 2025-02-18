<template>
  <div class="form-section">
    <h3>配置权限</h3>
    <form @submit.prevent="configurePermissions">
      <div class="form-group">
        <label for="username">用户名:</label>
        <input type="text" v-model="permissions.username" required />
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
        const response = await axios.post('/api/ldap/configure-permissions', this.permissions);
        console.log('Permissions configured:', response.data);
      } catch (error) {
        console.error('Error configuring permissions:', error);
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