import express from 'express'
import { PORT, SECRET_JWT_KEY } from './config.js'
import { UserRepository } from './user-repository.js'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'

const app = express()
app.use(express.static('public')) // Hace qie el servidor pueda leer el contenido de la carpeta 'public' para poder renderizarlo

app.set('view engine', 'ejs')

// --- MIDDLEWARES ---
app.use(express.json()) // Antes de que una petición llegue a cualquier endpoint, pasa por el middleware "json" (que viene incorporado en Express) para mirar si la petición tiene algo en el cuerpo que tiene que transformar y lo deja disponible en "request.body" del endpoint
app.use(cookieParser())

// Middleware que se ejecuta antes de cada petición para verificar si el usuario está logueado
app.use((request, response, next) => {
  const token = request.cookies.access_token // "access_token" es el nombre de la cookie que se ha creado en el endpoint '/login'
  request.session = { user: null } // Inicialmente, el usuario no está logueado
  try {
    const data = jwt.verify(token, SECRET_JWT_KEY) // Extrae los datos del token de acceso
    request.session.user = data
  } catch {}
  next() // Sigue a la siguiente ruta o middleware
})

// --- RUTAS (endpoints) ---
// Hace que el usuario, nada más acceder al servidor, se encuentre con el contenido de la vista (plantilla) 'index.ejs'
app.get('/', (request, response) => {
  const { user } = request.session // El valor "user" se encuentra dentro de un diccionario (el diccionario "request.session"). Es por eso que se se su nombre viene dado de esta manera y no como "const user".
  response.render('index', user)
})

app.get('/forms', (request, response) => {
  const { user } = request.session
  response.render('forms', user)
})

app.post('/login', async (request, response) => {
  const { username, password } = request.body
  try {
    const user = await UserRepository.login({ username, password })
    const token = jwt.sign({ id: user._id, username: user.username, puntos_mario: user.puntos_mario, puntos_arkanoid: user.puntos_arkanoid, puntos_tetris: user.puntos_tetris }, // Guarda la ID del usuario, el nombre de usuario y las puntuaciones del jugadoren el token de acceso
      SECRET_JWT_KEY,
      {
        expiresIn: '1h'
      }) // Los token de acceso (como este) han de expirar en un corto periodo de tiempo. Los token de refresco pueden expirar más tarde.

    response
      .cookie('access_token', token, {
        httpOnly: true, // Solo se puede acceder a la cookie en el servidor
        secure: process.env.NODE_ENV === 'production', // A la cookie solo se puede acceder en HTTPS
        sameSite: 'strict', // A la cookie solo se puede acceder en el mismo dominio
        maxAge: 60 * 60 * 1000 // La cookie tiene un tiempo de validez de 1 hora (60 minutos * 60 segundos * 1000 milisegundos)
      })
      .send({ user, token })
  } catch (error) {
    response.status(401).send(error.message)
  }
})
app.post('/register', async (request, response) => {
  const { username, password } = request.body // El body es el cuerpo de la petición (en este caso, serían los valores que tomarían "username" y "password")

  try {
    const id = await UserRepository.create({ username, password })
    response.send({ id })
  } catch (error) {
    response.status(400).send(error.mesage)
  }
})

app.post('/save-score', (request, response) => {
  try {
    const { puntos_obtenidos_mario, juego } = request.body; // Usa request en lugar de req
    const username = request.session.user.username; // Usa request en lugar de req
    
    if (!username) {
      return response.status(401).json({ message: 'Usuario no autenticado' }); // Usa response en lugar de res
    }

    // Actualizar el puntaje del usuario
    UserRepository.update_db(username, puntos_obtenidos_mario, juego); 

    response.status(200).json({ message: 'Puntaje guardado exitosamente' }); // Usa response en lugar de res
  } catch (error) {
    response.status(500).json({ message: 'Error al guardar el puntaje', error }); // Usa response en lugar de res
  }
});

app.post('/logout', (request, response) => {
  response
    .clearCookie('access_token')
    .json({ message: 'Logged out successfully' }) // Borra la cookie de acceso y devuelve un mensaje de éxito
})
app.get('/protected', (request, response) => {
  const { user } = request.session // El middleware determina si el valor de "request.session" es nulo o no. Por tanto, si es nulo no existirá un usuario logueado y saltará el error. En el caso contrario, la constante "user" tendrá los datos del usuario logueado.
  if (!user) return response.status(403).send('Access not authorized')
  response.render('protected', user)
})

// Para iniciar el server (levantar el proyecto) en el puerto definido en el archivo 'config.js' (en esye caso, en el puerto 3000)
app.listen(PORT, () => {
  console.log('Server is running on port', PORT)
})
