const express = require("express")
const cors = require("cors")
const jwt = require("jsonwebtoken")
const db = require("./database")

const app = express()

app.use(cors())
app.use(express.json())

const SECRET = "secret123"

const users = [
{username:"Admin",password:"Ola1234"},
{username:"david",password:"1234"},
{username:"sonia",password:"1234"},
{username:"daniela",password:"1234"},
{username:"david jr",password:"1234"},
{username:"jesus",password:"1234"},
{username:"estibaliz",password:"1234"},
{username:"estibaliz jr",password:"1234"},
{username:"raquel",password:"1234"},
{username:"alexandre",password:"1234"},
{username:"nerea",password:"1234"},
{username:"kevin",password:"1234"},
{username:"jose",password:"1234"},
{username:"raquel_vazquez",password:"1234"},
{username:"juanillo",password:"1234"},
{username:"bienvenida",password:"1234"},
{username:"oscar",password:"1234"},
{username:"manu",password:"1234"},
{username:"eli",password:"1234"},
{username:"maria",password:"1234"},
{username:"santi",password:"1234"},
{username:"zaida",password:"1234"},
{username:"lore",password:"1234"},
{username:"carlos",password:"1234"},
{username:"sheyma",password:"1234"},
{username:"antuan",password:"1234"},
{username:"laura",password:"1234"},
{username:"lenis",password:"1234"},
{username:"tamara",password:"1234"},
{username:"pedro",password:"1234"},
{username:"fran",password:"1234"},
{username:"julia_alvarez",password:"1234"},
{username:"esther",password:"1234"},
{username:"ana",password:"1234"},
{username:"sandra",password:"1234"},
{username:"pablo",password:"1234"},
{username:"andre",password:"1234"},
{username:"noemi",password:"1234"},
{username:"julian",password:"1234"},
{username:"andrea",password:"1234"},
{username:"sergio",password:"1234"},
{username:"tita_maria",password:"1234"},
{username:"manolo",password:"1234"},
{username:"eva",password:"1234"},
{username:"boni",password:"1234"},
{username:"julia",password:"1234"},
{username:"alfonso",password:"1234"},
{username:"mamen",password:"1234"},
{username:"ángel",password:"1234"},
{username:"noelia",password:"1234"},
{username:"amanda",password:"1234"},
{username:"isabel",password:"1234"}
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

// Variable para saber si el test ha sido finalizado por Admin
let testFinalized = false

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

// Endpoint para verificar si el usuario ya completó el test
app.get("/user-has-completed", verifyToken, (req, res) => {
  const username = req.user.username
  
  // Admin siempre puede hacer el test de nuevo
  if (username === "Admin") {
    return res.json({ 
      hasCompleted: false,
      result: null
    })
  }
  
  try {
    const result = db.prepare("SELECT * FROM results WHERE username = ?").get(username)
    res.json({ 
      hasCompleted: !!result,
      result: result || null
    })
  } catch (error) {
    console.error("Error al verificar si completó:", error)
    res.status(500).json({ error: "Error al verificar resultado" })
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

// Endpoint para finalizar el test (solo Admin)
app.post("/finalize-test", verifyToken, (req, res) => {
  const username = req.user.username
  
  if (username !== "Admin") {
    return res.status(403).json({ error: "No tienes permiso para finalizar el test" })
  }
  
  testFinalized = true
  res.json({ message: "Test finalizado" })
})

// Endpoint para obtener el estado del test (si está finalizado)
app.get("/test-status", verifyToken, (req, res) => {
  res.json({ testFinalized: testFinalized })
})

// Endpoint para reiniciar el test (solo Admin)
app.post("/reset-test", verifyToken, (req, res) => {
  const username = req.user.username
  
  if (username !== "Admin") {
    return res.status(403).json({ error: "No tienes permiso para reiniciar el test" })
  }
  
  try {
    // Limpiar resultados
    db.prepare("DELETE FROM results").run()
    
    // Resetear estado
    testFinalized = false
    activeUsers.clear()
    
    res.json({ message: "Test reiniciado correctamente" })
  } catch (error) {
    console.error("Error al reiniciar el test:", error)
    res.status(500).json({ error: "Error al reiniciar el test" })
  }
})

// Endpoint para obtener los top 5 usuarios
app.get("/top-users", verifyToken, (req, res) => {
  const username = req.user.username
  
  if (username !== "Admin") {
    return res.status(403).json({ error: "No tienes permiso ver el ranking" })
  }
  
  try {
    const topUsers = db.prepare(`
      SELECT username, correct, time 
      FROM results 
      ORDER BY correct DESC, time ASC 
      LIMIT 5
    `).all()
    
    res.json({ topUsers })
  } catch (error) {
    console.error("Error al obtener top usuarios:", error)
    res.status(500).json({ error: "Error al obtener ranking" })
  }
})

app.listen(3000,()=>{
  console.log("server running")
})