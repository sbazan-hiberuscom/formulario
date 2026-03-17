<template>
  <div class="ranking-container">
    <Card class="ranking-card">
      <template #title>🏆 Ranking Final</template>
      <template #content>
        <div class="ranking-content">
          <p class="subtitle">Los 5 mejores participantes</p>
          
          <div v-if="topUsers.length === 0" class="no-users">
            <p>Aún no hay resultados</p>
          </div>

          <div v-else class="ranking-list">
            <div 
              v-for="(user, index) in topUsers" 
              :key="index" 
              class="ranking-item"
              :class="{ 'first': index === 0, 'second': index === 1, 'third': index === 2 }"
            >
              <div class="position">
                <span v-if="index === 0" class="medal">🥇</span>
                <span v-else-if="index === 1" class="medal">🥈</span>
                <span v-else-if="index === 2" class="medal">🥉</span>
                <span v-else class="position-number">{{ index + 1 }}º</span>
              </div>

              <div class="user-info">
                <h4 class="username">{{ user.username }}</h4>
                <div class="stats">
                  <span class="stat">
                    <i class="pi pi-check"></i> {{ user.correct }} aciertos
                  </span>
                  <span class="stat">
                    <i class="pi pi-clock"></i> {{ formatTime(user.time) }}
                  </span>
                </div>
              </div>
            </div>
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
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import Button from "primevue/button"
import Card from "primevue/card"
import api from "../services/api"

const router = useRouter()
const topUsers = ref([])

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}m ${secs}s`
}

const logout = () => {
  localStorage.removeItem("token")
  router.push("/")
}

onMounted(async () => {
  try {
    const response = await api.get("/top-users")
    topUsers.value = response.data.topUsers
  } catch (error) {
    console.error("Error al obtener ranking:", error)
  }
})
</script>

<style scoped>
.ranking-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: #f5f5f5;
}

.ranking-card {
  width: 100%;
  max-width: 600px;
}

.ranking-content {
  text-align: center;
}

.subtitle {
  color: #666;
  font-size: 16px;
  margin: 0 0 30px 0;
}

.no-users {
  padding: 40px 20px;
  color: #999;
}

.ranking-list {
  margin-bottom: 30px;
}

.ranking-item {
  display: flex;
  align-items: center;
  padding: 20px;
  margin-bottom: 15px;
  background: #f9f9f9;
  border-radius: 8px;
  border-left: 4px solid #ccc;
}

.ranking-item.first {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  border-left-color: #ffd700;
}

.ranking-item.second {
  background: linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 100%);
  border-left-color: #c0c0c0;
}

.ranking-item.third {
  background: linear-gradient(135deg, #cd7f32 0%, #e6a85c 100%);
  border-left-color: #cd7f32;
}

.position {
  font-size: 24px;
  min-width: 60px;
  font-weight: bold;
}

.medal {
  font-size: 32px;
}

.position-number {
  color: #666;
}

.user-info {
  text-align: left;
  flex: 1;
  margin-left: 20px;
}

.username {
  margin: 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
}

.stats {
  display: flex;
  gap: 20px;
  margin-top: 8px;
}

.stat {
  font-size: 14px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 5px;
}

:deep(.p-button) {
  margin-top: 20px;
}

@media (max-width: 600px) {
  .ranking-card {
    max-width: 95%;
  }

  .ranking-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .user-info {
    margin-left: 0;
    margin-top: 10px;
  }

  .stats {
    flex-direction: column;
    gap: 5px;
  }
}
</style>
