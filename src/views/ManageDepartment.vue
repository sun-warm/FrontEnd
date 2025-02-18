<template>
  <div class="form-section">
    <h3>部门管理</h3>
    <form @submit.prevent="manageDepartment">
      <div class="form-group">
        <label for="department">部门:</label>
        <input type="text" v-model="department.name" required />
      </div>
      <div class="form-group">
        <label for="action">操作:</label>
        <select v-model="department.action" required>
          <option value="add">添加成员</option>
          <option value="remove">移除成员</option>
        </select>
      </div>
      <div class="form-group">
        <label for="member">成员用户名:</label>
        <input type="text" v-model="department.member" required />
      </div>
      <button type="submit" class="btn">提交</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ManageDepartment',
  data() {
    return {
      department: {
        name: '',
        action: 'add',
        member: ''
      }
    };
  },
  methods: {
    async manageDepartment() {
      try {
        const response = await axios.post('/api/ldap/manage-department', this.department);
        console.log('Department managed:', response.data);
      } catch (error) {
        console.error('Error managing department:', error);
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