<template>
  <div class="waiting-container">
    <Card class="welcome-card">
      <template #content>
        <div class="message-section">
          <h2 class="main-title">¡El ganador del formulario se llevará un premio!</h2>
          
          <p class="instruction-text">
            En cuanto seleccione el botón de aceptar el formulario comenzará, el ganador será 
            aquella persona que acierte mas preguntas, ¡en caso de empate el tiempo también cuenta!
          </p>
        </div>

        <Button 
          label="Empezar formulario"
          class="p-button-primary start-button"
          @click="startForm"
        />

        <Button 
          v-if="isAdmin"
          label="Ver progreso"
          class="p-button-secondary start-button"
          @click="viewProgress"
        />
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import Button from "primevue/button"
import Card from "primevue/card"
import { jwtDecode } from "jwt-decode"

const router = useRouter()
const isAdmin = ref(false)

function startForm() {
  router.push("/form")
}

function viewProgress() {
  router.push("/progress")
}

onMounted(() => {
  // Obtener el username del token
  const token = localStorage.getItem("token")
  if (token) {
    try {
      const decoded = jwtDecode(token)
      isAdmin.value = decoded.username === "Admin"
    } catch (error) {
      console.error("Error al decodificar token:", error)
    }
  }
})
</script>

<style scoped>
.waiting-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.welcome-card {
  width: 100%;
  max-width: 600px;
}

.message-section {
  text-align: center;
  margin-bottom: 30px;
}

.main-title {
  color: #333;
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 20px;
  margin-top: 0;
  line-height: 1.3;
}

.instruction-text {
  color: #555;
  font-size: 16px;
  line-height: 1.6;
  margin: 0;
}

.start-button {
  width: 100%;
  padding: 12px;
  font-size: 16px;
}

/* Tablet - Pantallas medianas */
@media (max-width: 768px) {
  .welcome-card {
    max-width: 90%;
  }

  .main-title {
    font-size: 24px;
    margin-bottom: 16px;
  }

  .instruction-text {
    font-size: 15px;
  }

  .message-section {
    margin-bottom: 25px;
  }
}

/* Móvil - Pantallas pequeñas */
@media (max-width: 480px) {
  .waiting-container {
    padding: 15px;
  }

  .welcome-card {
    max-width: 100%;
  }

  .main-title {
    font-size: 22px;
    margin-bottom: 14px;
  }

  .instruction-text {
    font-size: 14px;
    line-height: 1.5;
  }

  .message-section {
    margin-bottom: 20px;
  }

  .start-button {
    padding: 14px;
    font-size: 15px;
    min-height: 44px;
  }
}
</style>
