<template>
  <div class="progress-container">
    <Card class="progress-card">
      <template #title>Progreso del Test</template>
      <template #content>
        <div class="header-section">
          <h3 class="subtitle">Usuarios en tiempo real</h3>
          <Button 
            label="Volver"
            class="p-button-secondary"
            @click="goBack"
          />
        </div>

        <div v-if="activeUsers.length === 0" class="no-users">
          <p>No hay usuarios realizando el test en este momento</p>
        </div>

        <DataTable 
          v-else
          :value="activeUsers"
          responsiveLayout="scroll"
          class="progress-table"
        >
          <Column field="username" header="Usuario" />
          <Column field="currentQuestion" header="Pregunta" />
          <Column field="correctAnswers" header="Aciertos" />
          <Column field="time" header="Tiempo" />
          <Column field="progress" header="Progreso">
            <template #body="slotProps">
              <div class="progress-bar-small">
                <ProgressBar 
                  :value="(slotProps.data.currentQuestion / slotProps.data.totalQuestions) * 100"
                  class="progress-value"
                />
                <span class="progress-text">{{ slotProps.data.currentQuestion }}/{{ slotProps.data.totalQuestions }}</span>
              </div>
            </template>
          </Column>
        </DataTable>

        <div class="refresh-info">
          <small>Se actualiza automáticamente cada 2 segundos</small>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue"
import { useRouter } from "vue-router"
import Button from "primevue/button"
import Card from "primevue/card"
import DataTable from "primevue/datatable"
import Column from "primevue/column"
import ProgressBar from "primevue/progressbar"
import api from "../services/api"

const router = useRouter()
const activeUsers = ref([])
let refreshInterval = null

async function loadActiveUsers() {
  try {
    const response = await api.get("/active-users")
    activeUsers.value = response.data.users.map(user => ({
      ...user,
      time: formatTime(user.time)
    }))
  } catch (error) {
    console.error("Error al cargar usuarios activos:", error)
  }
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}m ${secs}s`
}

function goBack() {
  router.push("/waiting")
}

onMounted(() => {
  // Cargar usuarios inmediatamente
  loadActiveUsers()
  
  // Actualizar cada 2 segundos
  refreshInterval = setInterval(() => {
    loadActiveUsers()
  }, 2000)
})

onUnmounted(() => {
  // Limpiar intervalo cuando se desmonta el componente
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})
</script>

<style scoped>
.progress-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: #f5f5f5;
}

.progress-card {
  width: 100%;
  max-width: 1000px;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.subtitle {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.no-users {
  text-align: center;
  padding: 40px 20px;
  color: #666;
  font-size: 16px;
}

.progress-table {
  width: 100%;
}

.progress-bar-small {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-value {
  flex: 1;
  height: 20px;
}

.progress-text {
  font-size: 12px;
  font-weight: 600;
  color: #667eea;
  min-width: 50px;
  text-align: right;
}

.refresh-info {
  text-align: center;
  margin-top: 20px;
  color: #999;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background-color: #f0f0f0;
  color: #333;
  font-weight: 600;
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 12px;
  border-color: #e0e0e0;
}

:deep(.p-button-secondary) {
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .progress-card {
    max-width: 95%;
  }

  .header-section {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .subtitle {
    font-size: 18px;
  }

  :deep(.p-datatable) {
    font-size: 12px;
  }
}
</style>
