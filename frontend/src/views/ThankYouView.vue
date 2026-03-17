<template>
  <div class="thank-you-container">
    <Card class="thank-you-card">
      <template #title>¡Gracias por participar!</template>
      <template #content>
        <div class="thank-you-content">
          <i class="pi pi-check-circle success-icon"></i>
          
          <div v-if="testFinalized" class="finalized-message">
            <p class="finalized-text">El test ha sido finalizado por el administrador.</p>
            <p class="finalized-subtext">Tu participación ha sido registrada.</p>
          </div>

          <div v-else class="results-summary">
            <div class="result-item">
              <span class="label">Respuestas correctas:</span>
              <span class="value">{{ correct }} / {{ totalQuestions }}</span>
            </div>
            
            <div class="result-item">
              <span class="label">Tiempo utilizado:</span>
              <span class="value">{{ formatTime(time) }}</span>
            </div>
            
            <div class="result-item">
              <span class="label">Porcentaje de acierto:</span>
              <span class="value">{{ percentage }}%</span>
            </div>
          </div>
          
          <div class="thank-you-message">
            <p>¡Muchas gracias por participar en este test!</p>
            <p>Hemos registrado tus respuestas correctamente.</p>
          </div>
          
          <Button 
            label="Salir"
            class="p-button-primary"
            @click="logout"
          />
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue"
import { useRouter, useRoute } from "vue-router"
import Button from "primevue/button"
import Card from "primevue/card"

const router = useRouter()
const route = useRoute()

const correct = route.query.correct || 0
const time = route.query.time || 0
const totalQuestions = route.query.totalQuestions || 0
const testFinalized = route.query.testFinalized === "true"

const percentage = computed(() => {
  return totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0
})

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}m ${secs}s`
}

const logout = () => {
  localStorage.removeItem("token")
  router.push("/")
}

onMounted(() => {
  // Si no hay parámetros de consulta, redirigir al login
  if (!route.query.correct) {
    router.push("/")
  }
})
</script>

<style scoped>
.thank-you-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: #f5f5f5;
}

.thank-you-card {
  width: 100%;
  max-width: 600px;
}

.thank-you-content {
  text-align: center;
}

.success-icon {
  font-size: 80px;
  color: #10b981;
  margin-bottom: 20px;
  display: block;
}

.finalized-message {
  background-color: #fef3c7;
  border-left: 4px solid #f59e0b;
  padding: 20px;
  margin: 30px 0;
  border-radius: 8px;
}

.finalized-text {
  color: #92400e;
  font-weight: 600;
  font-size: 16px;
  margin: 10px 0;
}

.finalized-subtext {
  color: #b45309;
  font-size: 14px;
  margin: 5px 0;
}

.results-summary {
  background-color: #f3f4f6;
  border-radius: 8px;
  padding: 30px;
  margin: 30px 0;
  text-align: left;
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #e5e7eb;
}

.result-item:last-child {
  border-bottom: none;
}

.label {
  font-weight: 600;
  color: #374151;
}

.value {
  font-size: 20px;
  font-weight: 700;
  color: #667eea;
}

.thank-you-message {
  margin: 30px 0;
}

.thank-you-message p {
  color: #333;
  font-size: 16px;
  margin: 10px 0;
  line-height: 1.6;
}

:deep(.p-button) {
  margin-top: 20px;
}
</style>
