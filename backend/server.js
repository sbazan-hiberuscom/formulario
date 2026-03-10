const express = require("express")
const cors = require("cors")
const jwt = require("jsonwebtoken")
const db = require("./database")

const app = express()

app.use(cors())
app.use(express.json())

const SECRET = "secret123"

const users = [

{username:"juan",password:"1234"},
{username:"ana",password:"1234"},
{username:"maria",password:"1234"},
{username:"Admin",password:"Ola1234"}

]

app.post("/login",(req,res)=>{

  const {username,password} = req.body

  const user = users.find(
    u=>u.username===username && u.password===password
  )

  if(!user){

    return res.status(401).json({
      error:"invalid credentials"
    })

  }

  const token = jwt.sign(
    {username},
    SECRET
  )

  res.json({token})

})

// Middleware para verificar JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]
  
  if (!token) {
    return res.status(401).json({ error: "Token no proporcionado" })
  }
  
  try {
    const decoded = jwt.verify(token, SECRET)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" })
  }
}

// Almacenar usuarios activos en el test (en memoria)
const activeUsers = new Map()

// Endpoint para iniciar el test
app.post("/start-test", verifyToken, (req, res) => {
  const username = req.user.username
  const totalQuestions = req.body.totalQuestions
  
  activeUsers.set(username, {
    username: username,
    currentQuestion: 0,
    correctAnswers: 0,
    timeStarted: Date.now(),
    totalQuestions: totalQuestions
  })
  
  res.json({ message: "Test iniciado" })
})

// Endpoint para actualizar progreso del test
app.post("/update-progress", verifyToken, (req, res) => {
  const username = req.user.username
  const { currentQuestion, correctAnswers } = req.body
  
  if (activeUsers.has(username)) {
    const user = activeUsers.get(username)
    user.currentQuestion = currentQuestion
    user.correctAnswers = correctAnswers
  }
  
  res.json({ message: "Progreso actualizado" })
})

// Endpoint para obtener usuarios activos
app.get("/active-users", verifyToken, (req, res) => {
  const users = Array.from(activeUsers.values()).map(user => {
    const elapsedSeconds = Math.floor((Date.now() - user.timeStarted) / 1000)
    return {
      username: user.username,
      currentQuestion: user.currentQuestion,
      correctAnswers: user.correctAnswers,
      time: elapsedSeconds,
      totalQuestions: user.totalQuestions
    }
  })
  
  res.json({ users })
})

// Endpoint para limpiar usuario activo cuando termina
app.post("/finish-test", verifyToken, (req, res) => {
  const username = req.user.username
  activeUsers.delete(username)
  res.json({ message: "Test finalizado y eliminado de activos" })
})

// Endpoint para guardar resultados del test
app.post("/submit-test", verifyToken, (req, res) => {
  const { correct, time } = req.body
  const username = req.user.username
  
  if (correct === undefined || time === undefined) {
    return res.status(400).json({ error: "Faltan datos requeridos" })
  }
  
  try {
    db.prepare(
      "INSERT INTO results (username, correct, time) VALUES (?, ?, ?)"
    ).run(username, correct, time)
    
    res.json({ 
      message: "Resultados guardados correctamente",
      username: username,
      correct: correct,
      time: time
    })
  } catch (error) {
    console.error("Error al guardar resultados:", error)
    res.status(500).json({ error: "Error al guardar los resultados" })
  }
})

// Endpoint para ver todos los resultados (solo para Admin)
app.get("/results", verifyToken, (req, res) => {
  const username = req.user.username
  
  // Solo Admin puede ver los resultados
  if (username !== "Admin") {
    return res.status(403).json({ error: "No tienes permiso para ver los resultados" })
  }
  
  try {
    const results = db.prepare("SELECT * FROM results ORDER BY id DESC").all()
    res.json({ results })
  } catch (error) {
    console.error("Error al obtener resultados:", error)
    res.status(500).json({ error: "Error al obtener los resultados" })
  }
})

app.listen(3000,()=>{
  console.log("server running")
})