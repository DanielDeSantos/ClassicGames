import DBLocal from 'db-local' // DBLocal permite crear una base de datos local, pero que no es tan importante como una de SQL
import crypto from 'node:crypto'
import bcrypt from 'bcrypt' // Permite codificar la contraseña en un "hash" único y nunca más se va a poder la contraseña original (desencriptada, es decor, en texto plano).
import { SALT_ROUNDS } from './config.js'

const { Schema } = new DBLocal({ path: './db' }) // Crea una base de datos en el directorio 'db'

const User = Schema('User', { // Define el esquema ("las columnas" en SQL") de la colección ("tabla" en SQL) 'User' en la base de datos
  _id: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  puntos_mario: { type: Number, required: false },
  puntos_arkanoid: { type: Number, required: false },
  puntos_tetris: { type: Number, required: false }
})

export class UserRepository {
  static async create ({ username, password }) { // Los métodos estaticos se pueden usar sin necesidad de instanciar la clase. En este caso, si no hubiese sido un método estático, para llamarlo tendría que haber escrito, por ejemplo, "mi_instancia = UserRepository" y "mi_instancia.create({ username, password })". Es un método porque está vinculado a una clase, si funcionase independienemente de la clase, seria una función
    // 1. Validaciones de username (opcional: usar zod)
    Validation.username(username)

    // 2. Validaciones de password
    Validation.password(password)

    // 3. ASEGURARSE DE QUE EL USERNAME NO EXISTA EN LA BASE DE DATOS
    const user = User.findOne({ username }) // Hace una consulta en la base de datos (concretamente, en la colección "User") para ver si hay un usuario con el mismo nombre de usuario
    if (user) throw new Error('Username already exists')

    // 4. Generar una ID única para el usuario (depende de la base de datos, por ejemplo, MongoDB, te genera automáticamente un ID)
    const id = crypto.randomUUID()

    // 5. Hsshear (encriptar) la contraseña
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    // 6. Crear un nuevo usuario en la base de datos con los datos que recibe esta función y la ID generada
    User.create({
      _id: id,
      username,
      password: hashedPassword,
      puntos_mario: 0,
      puntos_arkanoid: 0,
      puntos_tetris: 0
    }).save()

    return id
  }

  static async login ({ username, password }) {
    Validation.username(username)
    Validation.password(password)

    const user = User.findOne({ username })
    if (!user) throw new Error('Username does not exist')

    const isValidPassword = await bcrypt.compare(password, user.password) // Compara los datos que recibe con los de la contraseña encriptada (devuelve true si son iguales o false en caso contrario). Lo que hace la función bcrypt.compareSync es encriptar el primer argumento (en este caso, la contraseña que recibe) y compararla con la contraseña encriptada
    if (!isValidPassword) throw new Error('Invalid password')

    return {
      username: user.username,
      puntos_mario: user.puntos_mario,
      puntos_arkanoid: user.puntos_arkanoid,
      puntos_tetris: user.puntos_tetris
      // En este objeto irian todos los datos del usuario que se quieren devolver de la base de datos

    } // Devuelve los datos del usuario que ha iniciado sesión, pero sin la contraseña encriptada para evitar que se pueda ver la contraseña metiendose en el codigo de la pagina web una vez logueado (Midu usa yaaq para comprobarlo, pero yo deduzco que también se podría ver al hacer click derecho e inspeccionar en el navegador)
  }

  static async update_db (username, puntaje, juego) {
    // 1. Buscar el usuario en la base de datos
    const user = await User.findOne({ username })

    // 2. Verificar si el usuario existe
    if (!user) {
      throw new Error('User not found')
    }

    // 3. Actualizar los puntos del usuario
    if (user.puntos_mario < puntaje && juego === 'mario') {
      user.puntos_mario = puntaje
    }
    // 4. Guardar los cambios
    await user.save()

    // 5. Devolver los datos actualizados
    return {
      puntos_mario: user.puntos_mario
    }
  }
}

class Validation {
  static username (username) {
    if (typeof username !== 'string') throw new Error('Username must be a string')
    if (username.length < 3) throw new Error('Username must be at least 3 characters long')
  }

  static password (password) {
    if (typeof password !== 'string') throw new Error('Password must be a string')
    if (password.length < 6) throw new Error('Password must be at least 6 characters long')
  }
}
