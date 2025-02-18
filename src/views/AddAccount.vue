<template>
  <div class="form-section">
    <h3>添加账号</h3>
    <form @submit.prevent="addAccount">
      <div class="form-group">
        <label for="username">用户名:</label>
        <input type="text" v-model="newAccount.username" required />
      </div>
      <div class="form-group">
        <label for="password">密码:</label>
        <input type="password" v-model="newAccount.password" required />
      </div>
      <button type="submit" class="btn">添加账号</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AddAccount',
  data() {
    return {
      newAccount: {
        username: '',
        password: ''
      }
    };
  },
  methods: {
    async addAccount() {
      try {
        const response = await axios.post('/api/ldap/add-account', this.newAccount);
        console.log('Account added:', response.data);
      } catch (error) {
        console.error('Error adding account:', error);
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

input {
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