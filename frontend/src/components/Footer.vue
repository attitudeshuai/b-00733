<template>
  <a-layout-footer class="global-footer">
    <div class="footer-copyright">
      Copyright &copy; {{ new Date().getFullYear() }} 动物管理系统 All Rights Reserved.
    </div>
  </a-layout-footer>
</template>

<script setup>
// No script needed for this simple component
</script>

<style scoped>
.global-footer {
  text-align: center;
  padding: 24px 50px;
  background: none;
}

.footer-links {
  margin-bottom: 8px;
}

.footer-links a {
  color: rgba(0, 0, 0, 0.45);
  margin-right: 40px;
  transition: all 0.3s;
}

.footer-links a:last-child {
  margin-right: 0;
}

.footer-links a:hover {
  color: #1890ff;
}

.footer-copyright {
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
}
</style>
