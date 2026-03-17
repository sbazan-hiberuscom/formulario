# Formulario - Aplicación Test

Aplicación web para gestionar un test con usuarios, respuestas y ranking.

## 📋 Estructura del Proyecto

```
formulario/
├── backend/          # API Node.js/Express
├── frontend/         # Aplicación Vue 3
├── docker-compose.yml
└── README.md
```

---

## 🚀 Instrucciones para desplegar (para tu servidor)

### **Opción 1: Con Docker (Recomendado)**

1. **Asegúrate de tener Docker instalado** en tu servidor
   ```bash
   docker --version
   docker-compose --version
   ```

2. **En la raíz del proyecto, ejecuta:**
   ```bash
   docker-compose up --build
   ```

3. **Accede a la aplicación:**
   - 🌍 Frontend: `http://tu-servidor-ip`
   - 🔌 Backend API: `http://tu-servidor-ip:3000`

---

### **Opción 2: Sin Docker (Manual)**

#### Backend:
```bash
cd backend
npm install
npm start
# El servidor correrá en http://localhost:3000
```

#### Frontend:
```bash
cd frontend
npm install
npm run build
# La carpeta dist/ contiene los archivos estáticos listos para Nginx
```

---

## ⚙️ Configuración

### **Variables de entorno del backend**

Crea un archivo `.env` en la carpeta `backend/` basándote en `.env.example`:

```bash
PORT=3000
JWT_SECRET=tu-clave-secreta-aqui
```

⚠️ **IMPORTANTE:** En producción, cambia `JWT_SECRET` por una clave segura.

---

## 📝 Usuarios predeterminados

Todos con contraseña `1234` excepto Admin:

- **Admin** / `Ola1234`
- **david** / `1234`
- **sonia** / `1234`
- ... (y más usuarios en `backend/server.js`)

---

## 🔧 Puertos

- **Frontend**: Puerto 80 (http)
- **Backend API**: Puerto 3000

Si quieres cambiar los puertos, edita `docker-compose.yml`:

```yaml
services:
  backend:
    ports:
      - "3000:3000"  # cambiar a "PUERTO_DESEADO:3000"
  
  frontend:
    ports:
      - "80:80"      # cambiar a "PUERTO_DESEADO:80"
```

---

## 💾 Base de datos

Actualmente usa **SQLite** (`formulario.db`). Los datos se guardan localmente en el servidor.

**Nota:** Si en el futuro necesitas migrar a PostgreSQL o MySQL, avisa.

---

## 🐛 Solución de problemas

### El frontend no ve el backend
- Verifica que `docker-compose.yml` tenga correcta la configuración
- Comprueba que el puerto 3000 esté abierto en tu firewall

### Base de datos vacía
- Es normal en el primer inicio. El evento "Finalize Test" (Admin) no se ha ejecutado aún.

### Puerto ya en uso
- Cambia los puertos en `docker-compose.yml` o detén otros servicios

---

## 📞 Contacto

Si tienes dudas sobre cómo desplegar, pregunta. 🚀
