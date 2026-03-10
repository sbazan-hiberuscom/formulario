<template>
  <div class="already-completed-container">
    <Card class="completed-card">
      <template #title>¡Ya completaste el test!</template>
      <template #content>
        <div class="completed-content">
          <i class="pi pi-check-circle success-icon"></i>
          
          <div class="message">
            <p>Ya has realizado el test anteriormente.</p>
            <p>No es posible realizar el test más de una vez.</p>
          </div>
          
          <Button 
            label="Volver al inicio"
            class="p-button-primary"
            @click="goHome"
          />
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router"
import Button from "primevue/button"
import Card from "primevue/card"

const router = useRouter()

const goHome = () => {
  localStorage.removeItem("token")
  router.push("/")
}
</script>

<style scoped>
.already-completed-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: #f5f5f5;
}

.completed-card {
  width: 100%;
  max-width: 600px;
}

.completed-content {
  text-align: center;
}

.success-icon {
  font-size: 80px;
  color: #10b981;
  margin-bottom: 20px;
  display: block;
}

.message {
  margin: 30px 0;
  color: #333;
  font-size: 16px;
  line-height: 1.6;
}

.message p {
  margin: 10px 0;
}

:deep(.p-button) {
  margin-top: 20px;
}
</style>
