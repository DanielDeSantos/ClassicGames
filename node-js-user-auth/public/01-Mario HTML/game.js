import { createAnimations } from './animations.js'
import { initAudio, playAudio } from './audio.js'
import { checkControls } from './controls.js'
import { initImages } from './images.js'
import { initSpritesheets } from './spritesheets.js'

export const relationBlockWorld = 0.06255848148643206100287640421097

const config = {
  type: Phaser.AUTO,
  // Dimensiones del juego
  width: 256,
  height: 208,
  backgroundColor: '#049cd8',
  // "game" es el contenedor donde se renderiza el juego (el div de HTML)
  parent: 'game',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: true
    }
  },

  scene: {
    preload,
    create,
    update
  }
}

new Phaser.Game(config)

function preload () {
  this.load.tilemapTiledJSON('lvl_1-1', './assets/maps/lvl_1-1.json')
  // --- imagenes ---
  initImages(this)

  // --- spritesheets ---
  initSpritesheets(this)

  // --- audio ---
  initAudio(this)
}

function create () {
  // --- animaciones ---
  createAnimations(this)

  // --- escenario ---
  const mapa = this.make.tilemap({ key: 'lvl_1-1' })
  const sceneryTileset = mapa.addTilesetImage('scenery_tileset', 'tiles')

  const floorbricks = mapa.createLayer('floorbricks', sceneryTileset, 0, 0)
  floorbricks.setCollisionByProperty({ collider: true }) // Este collider se ha de poner tanto en la capa de Tiled como en cada "sprite" del "sprite-atlas" (paleta) que aparece en la capa
  const decoration = mapa.createLayer('decoration', sceneryTileset, 0, 0)
  console.log(decoration)

  const brownBrick = mapa.createLayer('brownBricks', sceneryTileset, 0, 0)
  brownBrick.setCollisionByProperty({ collider: true, hasItem: false }) // Este collider se ha de poner tanto en la capa de Tiled como en cada "sprite" del "sprite-atlas" (paleta) que aparece en la capa
  this.brownBricks = this.physics.add.staticGroup()
  brownBrick.forEachTile(brick => {
    if (brick.properties.collider) {
      const instantiateX = (brick.x / relationBlockWorld) + 9
      const instantiateY = (brick.y / relationBlockWorld) + 8
      destroyBrick(brick)
      this.brownBricks.create(instantiateX, instantiateY, 'brown-brick')
    }
  })

  const itemBrick = mapa.createLayer('itemBricks', sceneryTileset, 0, 0)
  this.itemBricks = this.physics.add.staticGroup()
  itemBrick.setCollisionByProperty({ collider: true, hasItem: true })
  itemBrick.forEachTile(brick => {
    if (brick.properties.hasItem) {
      const instantiateX = (brick.x / relationBlockWorld) + 9
      const instantiateY = (brick.y / relationBlockWorld) + 8
      destroyBrick(brick)
      this.itemBricks.create(instantiateX, instantiateY, 'item-brick').anims.play('itemBrick-idle')
    }
  })

  const pipes = mapa.createLayer('pipes', sceneryTileset, 0, 0)
  pipes.setCollisionByProperty({ collider: true })

  // --- nube ---

  // this.add.image(100,50,"cloud1")
  // .setOrigin(0,0)
  // .setScale(0.15)

  // --- suelo ---

  // Para crear el suelo con colisiones
  // Como hay más de un tramo de suelo, se crea un grupo para no tener que estar montando las colisiones de cada tramo de suelo una por una
  // this.floor = this.physics.add.staticGroup()

  // this.floor
  //    .create(0, config.height - 16, "floorbricks")
  //    .setOrigin(0, 0.5)
  //    .refreshBody() // Para pillar correctamente la posición de las físicas

  // this.floor
  //    .create(150, config.height - 16, "floorbricks")
  //    .setOrigin(0, 0.5)
  //    .refreshBody()

  // Para crear el suelo sin colisiones
  // this.add.tileSprite(Donde empieza el sprite(eje X),
  // Donde empieza (eje Y),
  // Hasta donde llega (eje X), Hasta donde llega (eje Y), "ID")

  // --- coleccionables ---

  this.collectibles = this.physics.add.staticGroup()

  // --- monedas ---
  this.collectibles.create(150, 150, 'coin')
    .anims.play('coin-idle', true)
  this.collectibles.create(300, 150, 'coin')
    .anims.play('coin-idle', true)

  // --- setas ---
  this.collectibles.create(200, config.height - 40, 'supermushroom')

  // --- mario ---

  // Para crear el sprite con físicas
  this.mario = this.physics.add.sprite(50, 100, 'mario')
    .setOrigin(0, 1)
    .setGravityY(300)
  // Para crear el sprite sin físicas
  // this.mario = this.add.sprite(50, 210, "mario")
  // .setOrigin(0,1)

  // --- enemigo ---

  this.enemy = this.physics.add.sprite(120, config.height - 64, 'goomba')
    .setOrigin(0, 1)
    .setCollideWorldBounds(true) // Para evitar que el enemigo salga de la pantalla
    .setGravityY(300)
    .play('goomba-walk', true)
    .setVelocityX(-50)
    .setData('direction', -50)

  // --- colisiones ---

  // collider: Cuando hay un choque entre 2 sprites
  // Para determinar qué objetos deben colisionar
  this.physics.add.collider(this.mario, floorbricks)
  this.physics.add.collider(this.enemy, floorbricks)
  this.physics.add.collider(this.mario, pipes)
  this.physics.add.collider(this.enemy, pipes)
  this.physics.add.collider(this.mario, this.brownBricks, hitBrownBrick, null, this)
  this.physics.add.collider(this.mario, this.itemBricks, hitItemBrick, null, this)

  // Cuando el enemigo y Mario colisionen, se llamará a la función "onHitEnemy" (si la función se llama de otra forma funcionará igual)
  this.physics.add.collider(this.mario, this.enemy, onHitEnemy, null, this) // Los dos últimos parámetros sirven para que la función pueda ejecutar el audio, es decir, para que se sepa que la función forma parte del juego

  // overlap: Cuando un sprite pasa por encima de otro
  this.physics.add.overlap(this.mario, this.collectibles, collectItem, null, this)

  // --- límites ---

  // Para establecer los límites del juego
  // this.physics.world.setBounds(Límite por la izquierda,
  // Límite inferior, Límite por la derecha, Límite superior)
  this.physics.world.setBounds(0, 0, 3408, 1000)

  // --- cámara ---

  // Para definir los límites de la cámara
  this.cameras.main.setBounds(0, 0, 3408, config.height)
  // Para decir a qué debe seguir la cámara
  this.cameras.main.startFollow(this.mario)

  // --- teclas ---
  this.keys = this.input.keyboard.createCursorKeys()

  window.puntos_obtenidos_mario = 0
}

function hitBrownBrick (mario, brick) {
  if (mario.body.blocked.up) {
    console.log(brick)
  }
}

function destroyBrick (brick) {
  brick.visible = false
  brick.collideDown = false
  brick.collideUp = false
  brick.collideLeft = false
  brick.collideRight = false
}

function hitItemBrick (mario, brick) {
  console.log(brick)
  if (mario.body.blocked.up) {
    const instantiatedCoin = this.physics.add.sprite(brick.x, brick.y, 'coin').setVelocityX(0).setVelocityY(-150)
    instantiatedCoin.play('coin-idle', true)
    playAudio('coin-pickup', this, { volume: 0.1 })
    setTimeout(() => {
      instantiatedCoin.destroy()
    }, 500)

    brick.destroy()
    destroyBrick(brick)
  }
}
// --- detectar colisiones ---
function collectItem (mario, item) {
  // Para esactivar y ocultar el item, y hacer que siga cargada en memoria: item.disableBody(true,true)
  // Para esta función, no es interesante porque la moneda ya no va a volver a aparecer en escena.
  const { texture: { key } } = item // Para simplificar el código y en vez de usar item.texture.key, usar directamente key
  item.destroy()

  if (key === 'coin') {
    playAudio('coin-pickup', this, { volume: 0.1 })
    addToScore(100, item, this)
  } else if (key === 'supermushroom') {
    this.physics.world.pause()
    this.anims.pauseAll()

    playAudio('powerup', this, { volume: 0.1 })

    // Para el bucle, se establece una variable que toma como valor inicial 0.
    let i = 1
    // Este es un bucle que se ejecuta durante 100 milisegundos y en cada iteración, cambia la animación de Mario, ya que suma un vaor a la variable establecida anteriormente (let i = 1;) y detecta que si el residuo de la división entre i y 2 es 0, es decir, que i es par, se cambia la animación de Mario a "mario-grown-idle", y si es impar, se cambia la animación de Mario a "mario-idle".

    // Para que Mario se haga grande de una forma correcta, la primera animación en ejecutarse ha de ser "mario-idle". En este caso, lo he provocado haciendo que el valor inicial de i sea 1, pero también se podría hacer que el valor de i se actualice antes que se ejecute la animación dentro del intervalo
    const interval = setInterval(() => {
      mario.anims.play(i % 2 === 0
        ? 'mario-grown-idle'
        : 'mario-idle'
      )
      i++
    }, 100)

    mario.isBlocked = true // Para que Mario no pueda moverse
    mario.isGrown = true

    setTimeout(() => {
      mario.body.setSize(18, 32)
      mario.setDisplaySize(18, 32)

      this.anims.resumeAll()

      mario.isBlocked = false
      clearInterval(interval) // Para detener la animación creada a partir de la constante "interval"
      this.physics.world.resume()
    }, 1000)
  }
}

// --- agregar puntaje ---
function addToScore (scoreToAdd, origin, game) {
  const scoreText = game.add.text(
    origin.x,
    origin.y,
    scoreToAdd,
    {
      fontFamily: 'pixel',
      fontSize: config.width / 25
    }
  )

  // --- animación del texto ---

  const secondStep = () => {
    game.tweens.add({
      targets: scoreText,
      duration: 100,
      alpha: 0, // Cambia la transparencia del texto
      onComplete: finalStep
    })
  }

  const finalStep = () => {
    scoreText.destroy()
  }

  game.tweens.add({
    targets: scoreText,
    duration: 500,
    y: scoreText.y - 20,
    onComplete: secondStep
  })
}

// --- detectar enemigo ---
function onHitEnemy (mario, enemy) {
  if (mario.body.touching.down && enemy.body.touching.up) {
    enemy.anims.play('goomba-dead', true)
    enemy.setData('direction', 0)
    mario.setVelocityY(-200)

    playAudio('goomba-stomp', this)
    addToScore(200, enemy, this)

    setTimeout(() => {
      enemy.destroy()
    }, 500)
  } else {
    killMario(this)
  }
}

function enemyMovement (enemy) {
  if (enemy.body) {
    let direction = enemy.getData('direction') || 0
    // Verificar y actualizar la dirección
    if (enemy.x <= 10 || enemy.body.blocked.left) {
      direction = 50 // Cambia la dirección cuando llegue al límite izquierdo
      enemy.setData('direction', direction)
      enemy.setFlipX(false)
    } else if (enemy.x >= 3408 || enemy.body.blocked.right) {
      direction = -50
      enemy.setData('direction', direction)
      enemy.setFlipX(true)
      // Aplicar la velocidad basada en la dirección
    }
    enemy.setVelocityX(direction)
  }
}

function marioSaltoAlto (mario) {
  // console.log(mario.y): Por esto sé a qué altura se debe desactivar la colisión con los bordes del mundo (como solo hay 1 punto en el mapa en el que esa altura se pueda alcanzar, no hay problema en desactivarlos temporalmente). Puedo hacer esto mismo, pero con el eje X, para que Mario no pueda saltar por encima del banderín final.
  if (mario.y <= 40) {
    mario.setCollideWorldBounds(false)
  }
}

function update () {
  // "this" hace referencia al juego en sí
  // Con esta línea, indico que tanto mario como el enemigo están en el juego
  // De esta forma, no tengo por qué indicarlo en cada línea con this.[lo que sea]
  const { enemy, mario } = this

  enemyMovement(enemy)

  // Para evitar que Mario salga de la pantalla a no ser que supere el límite superior de ésta
  mario.setCollideWorldBounds(true)

  marioSaltoAlto(mario)

  // Aplicar los controles
  checkControls(this)

  if (mario.y >= config.height) {
    killMario(this)
  }
}

// --- matar Mario ---
function killMario (game) {
  const { mario, scene } = game
  if (mario.isDead) return

  mario.isDead = true
  mario.anims.play('mario-dead')
  mario.setCollideWorldBounds(false)

  playAudio('gameover', game, { volume: 0.0 })

  mario.body.checkCollision.none = true
  mario.setVelocityX(0)

  // Temporizadores
  // Para hacer que salte al cabo de X milisegundos
  setTimeout(() => {
    mario.setVelocityY(-300)
  }, 100)

  // Para hacer que se reinicie el nivel al cabo de X tiempo
  setTimeout(() => {
    scene.restart()
  }, 3000)
}

export async function goBack () {
  const puntos_obtenidos_mario = window.puntos_obtenidos_mario // Access the score from the global object

  // Enviar una solicitud POST al servidor para guardar el puntaje
  try {
    const response = await fetch('/save-score', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ puntos_obtenidos_mario, juego: 'tetris' })
    })

    if (!response.ok) {
      throw new Error('Error al guardar el puntaje')
    }
  } catch (error) {
    console.error('Error:', error)
  }
  // Redirigir después de guardar el puntaje
  window.location.href = '/'
}

window.goBack = goBack
