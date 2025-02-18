<template>
  <div class="settings-container">
    <h2>设置页</h2>
    <div class="settings-layout">
      <div class="sidebar">
        <ul>
          <li @click="setActiveSection('addAccount')" :class="{ active: activeSection === 'addAccount' }">添加账号</li>
          <li @click="setActiveSection('configurePermissions')" :class="{ active: activeSection === 'configurePermissions' }">配置权限</li>
          <li @click="setActiveSection('manageDepartment')" :class="{ active: activeSection === 'manageDepartment' }">部门管理</li>
        </ul>
      </div>
      <div class="content">
        <component :is="activeSectionComponent"></component>
      </div>
    </div>
  </div>
</template>

<script>
import AddAccount from './AddAccount.vue';
import ConfigurePermissions from './ConfigurePermissions.vue';
import ManageDepartment from './ManageDepartment.vue';

export default {
  name: 'AppSettings',
  data() {
    return {
      activeSection: 'addAccount'
    };
  },
  computed: {
    activeSectionComponent() {
      switch (this.activeSection) {
        case 'addAccount':
          return AddAccount;
        case 'configurePermissions':
          return ConfigurePermissions;
        case 'manageDepartment':
          return ManageDepartment;
        default:
          return AddAccount;
      }
    }
  },
  methods: {
    setActiveSection(section) {
      this.activeSection = section;
    }
  }
};
</script>

<style scoped>
.settings-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.settings-layout {
  display: flex;
}

.sidebar {
  width: 200px;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-right: 20px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar li {
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.sidebar li:hover,
.sidebar li.active {
  background-color: #007bff;
  color: white;
}

.content {
  flex: 1;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>