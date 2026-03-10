<template>
  <div class="form-container">
    <Card class="form-card">
      <template #title>Formulario de Preguntas</template>
      <template #content>
        <div class="progress-bar">
          <div class="progress-text">Pregunta {{ currentQuestionIndex + 1 }} de {{ questions.length }}</div>
          <ProgressBar :value="((currentQuestionIndex + 1) / questions.length) * 100" class="progress"></ProgressBar>
        </div>

        <div class="question-section">
          <h3 class="question-title">Pregunta {{ currentQuestionIndex + 1 }}</h3>
          <p class="question-text">{{ currentQuestion.text }}</p>

          <div class="options-section">
            <div v-for="(option, index) in currentQuestion.options" :key="index" class="option-item">
              <RadioButton 
                :inputId="`option-${index}`"
                :value="option"
                v-model="selectedAnswers[currentQuestionIndex]"
                :disabled="currentQuestion.isSpecial && option === 'Sergio'"
                @click="handleOptionClick(option)"
              />
              <label 
                :for="`option-${index}`" 
                class="option-label"
                :class="{ 'disabled-label': currentQuestion.isSpecial && option === 'Sergio' }"
              >
                {{ option }}
              </label>
            </div>
          </div>
        </div>

        <div class="button-group">
          <Button 
            v-if="currentQuestionIndex > 0"
            label="Anterior"
            class="p-button-secondary"
            @click="previousQuestion"
            :disabled="isSubmitting"
          />
          <Button 
            v-if="currentQuestionIndex < questions.length - 1"
            label="Siguiente"
            class="p-button-primary"
            @click="nextQuestion"
            :disabled="!selectedAnswers[currentQuestionIndex] || isSubmitting"
          />
          <Button 
            v-if="currentQuestionIndex === questions.length - 1"
            label="Enviar respuestas"
            class="p-button-primary"
            @click="submitAnswers"
            :disabled="!selectedAnswers[currentQuestionIndex] || isSubmitting"
            :loading="isSubmitting"
          />
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import Button from "primevue/button"
import Card from "primevue/card"
import RadioButton from "primevue/radiobutton"
import ProgressBar from "primevue/progressbar"
import api from "../services/api"

const router = useRouter()
const currentQuestionIndex = ref(0)
const selectedAnswers = ref([])
const startTime = ref(null)
const elapsedTime = ref(0)
const isSubmitting = ref(false)

const questions = ref([
  {
    text: "¿Cómo nos conocimos?",
    options: ["En clases de inglés", "Nos presentó una amiga", "Por tinder", "Tomando unas copas"],
    correctAnswer: "Nos presentó una amiga"
  },
  {
    text: "¿Cuántos años tiene Katy?",
    options: ["25", "27", "28", "26"],
    correctAnswer: "27"
  },
  {
    text: "¿Cuántos años tiene Sergio?",
    options: ["32", "33", "34", "35"],
    correctAnswer: "33"
  },
  {
    text: "¿Quién manda en la relación?",
    options: ["Katy", "Sergio", "Él", "El novio", "Sergio Bazán Álvarez"],
    correctAnswer: "Katy",
    isSpecial: true
  },
  {
    text: "¿Cuántos años completos tiene mi mascota?",
    options: ["7", "8", "9", "10"],
    correctAnswer: "8"
  },
  {
    text: "¿Cuántos años completos llevamos juntos Katy y yo?",
    options: ["7", "8", "9", "10"],
    correctAnswer: "9"
  },
  {
    text: "¿Cómo se escribe correctamente el nombre de Katy?",
    options: ["khaterine", "katherine", "Katherin", "Khaterin"],
    correctAnswer: "katherine"
  },
  {
    text: "¿Cuál es el segundo nombre de Katy?",
    options: ["Viviana", "Elvira", "María", "Pilar"],
    correctAnswer: "Elvira"
  },
  {
    text: "¿Cómo se llama mi mascota?",
    options: ["Nami", "Emi", "Blanca", "Laica"],
    correctAnswer: "Nami"
  },
  {
    text: "¿Dónde fuimos en nuestro primer viaje juntos?",
    options: ["Almería", "Cádiz", "Mallorca", "Valencia"],
    correctAnswer: "Almería"
  },
  {
    text: "¿Cuántos años tenía Sergio cuando nos conocimos?",
    options: ["22", "23", "24", "25"],
    correctAnswer: "23"
  },
  {
    text: "¿En qué mes nos conocimos?",
    options: ["Junio", "Julio", "Agosto", "Septiembre"],
    correctAnswer: "Junio"
  },
  {
    text: "¿Cuál es la comida favorita de Katy?",
    options: ["Macarrones", "Patatas con huevo", "Sushi", "Arepas"],
    correctAnswer: "Patatas con huevo"
  },
  {
    text: "¿De qué ciudad de Colombia es Katy?",
    options: ["Barranquilla", "Bogotá", "Medellín", "Cartagena"],
    correctAnswer: "Barranquilla"
  },
  {
    text: "¿Qué quería ser de pequeño Sergio?",
    options: ["Policía", "Carpintero", "Militar", "Informático"],
    correctAnswer: "Policía"
  },
  {
    text: "¿Dónde nos vamos de viaje de novios?",
    options: ["Italia", "Japón", "Francia", "Londres"],
    correctAnswer: "Italia"
  },
  {
    text: "¿A qué municipio de Granada nos fuimos a vivir juntos por primera vez?",
    options: ["Peligros", "Albolote", "Maracena", "Motril"],
    correctAnswer: "Peligros"
  },
  {
    text: "Katy me recomendó una de mis películas favoritas, en ella dicen la frase: \"Hola. Me llamo Íñigo Montoya. Tú mataste a mi padre. Prepárate a morir.\", ¿cuál es?",
    options: ["La Princesa Prometida", "Regreso al Futuro", "Kill Bill", "El Justiciero de la Noche"],
    correctAnswer: "La Princesa Prometida"
  },
  {
    text: "¿Cuál fue nuestro primer anime juntos?",
    options: ["Naruto", "One Piece", "Death Note", "Kimetsu no Yaiba"],
    correctAnswer: "Death Note"
  },
  {
    text: "¿Cuál ha sido nuestro viaje favorito?",
    options: ["Valencia", "Mallorca", "Asturias", "Barcelona"],
    correctAnswer: "Asturias"
  }
])

const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])

// Función auxiliar para mezclar array aleatoriamente
function shuffleArray(array) {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

onMounted(() => {
  // Mezclar las opciones de cada pregunta aleatoriamente
  questions.value.forEach(question => {
    question.options = shuffleArray(question.options)
  })
  
  // Inicializar array de respuestas
  selectedAnswers.value = new Array(questions.value.length).fill(null)
  
  // Iniciar el contador de tiempo
  startTime.value = Date.now()
  
  // Registrar el test en el servidor
  api.post("/start-test", {
    totalQuestions: questions.value.length
  }).catch(error => console.error("Error al iniciar test:", error))
  
  // Actualizar el tiempo transcurrido cada segundo
  setInterval(() => {
    elapsedTime.value = Math.floor((Date.now() - startTime.value) / 1000)
  }, 1000)
})

function nextQuestion() {
  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++
    updateProgress()
  }
}

function updateProgress() {
  // Calcular aciertos hasta el momento
  let correctCount = 0
  for (let i = 0; i < currentQuestionIndex.value; i++) {
    if (selectedAnswers.value[i] === questions.value[i].correctAnswer) {
      correctCount++
    }
  }
  
  // Enviar actualización al servidor
  api.post("/update-progress", {
    currentQuestion: currentQuestionIndex.value + 1,
    correctAnswers: correctCount
  }).catch(error => console.error("Error al actualizar progreso:", error))
}

function previousQuestion() {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
  }
}

function handleOptionClick(option) {
  // Si es la pregunta especial, interceptamos el click
  if (currentQuestion.value.isSpecial && (option === "Él" || option === "El novio" || option === "Sergio Bazán Álvarez")) {
    // Usamos nextTick para que Vue actualice el modelo después del click
    setTimeout(() => {
      selectedAnswers.value[currentQuestionIndex.value] = "Katy"
    }, 0)
  }
}

function submitAnswers() {
  // Verificar que todas las preguntas tengan respuesta
  if (selectedAnswers.value.some(answer => answer === null)) {
    alert("Por favor contesta todas las preguntas")
    return
  }

  // Calcular aciertos
  let correctCount = 0
  const results = selectedAnswers.value.map((answer, index) => {
    const isCorrect = answer === questions.value[index].correctAnswer
    if (isCorrect) correctCount++
    return {
      question: questions.value[index].text,
      answer: answer,
      isCorrect: isCorrect
    }
  })

  // Datos a enviar al backend
  const answersData = {
    correct: correctCount,
    time: elapsedTime.value,
    totalQuestions: questions.value.length
  }

  // Enviar al backend
  isSubmitting.value = true
  api.post("/submit-test", answersData)
    .then((response) => {
      console.log("Resultados guardados:", response.data)
      
      // Notificar al servidor que el usuario terminó
      return api.post("/finish-test", {})
    })
    .then(() => {
      // Redirigir a la vista de agradecimiento con los parámetros
      router.push({
        name: "thank-you",
        query: {
          correct: correctCount,
          time: elapsedTime.value,
          totalQuestions: questions.value.length
        }
      })
    })
    .catch((error) => {
      console.error("Error al enviar resultados:", error)
      alert("Error al guardar los resultados. Por favor intenta de nuevo.")
      isSubmitting.value = false
    })
}
</script>

<style scoped>
.form-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.form-card {
  width: 100%;
  max-width: 600px;
}

.progress-bar {
  margin-bottom: 25px;
}

.progress-text {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.progress {
  height: 24px;
}

.question-title {
  color: #333;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 10px 0;
}

.question-text {
  color: #333;
  font-size: 18px;
  font-weight: 500;
  margin: 0 0 25px 0;
  line-height: 1.5;
}

.options-section {
  margin-bottom: 30px;
}

.option-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.option-label {
  margin-left: 10px;
  color: #555;
  font-size: 16px;
  cursor: pointer;
}

.disabled-label {
  color: #ccc;
  cursor: not-allowed;
}

.button-group {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.button-group button {
  flex: 1;
  padding: 12px;
  font-size: 16px;
}

/* Tablet - Pantallas medianas */
@media (max-width: 768px) {
  .form-card {
    max-width: 90%;
  }

  .question-text {
    font-size: 16px;
  }

  .option-label {
    font-size: 15px;
  }
}

/* Móvil - Pantallas pequeñas */
@media (max-width: 480px) {
  .form-container {
    padding: 15px;
  }

  .form-card {
    max-width: 100%;
  }

  .question-text {
    font-size: 16px;
  }

  .option-label {
    font-size: 14px;
  }

  .button-group {
    flex-direction: column;
  }

  .button-group button {
    width: 100%;
    min-height: 44px;
  }
}
</style>
