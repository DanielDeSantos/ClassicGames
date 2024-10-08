const MARIO_ANIMATIONS = {
  grown: {
    idle: 'mario-grown-idle',
    walk: 'mario-grown-walk',
    jump: 'mario-grown-jump',
    crouch: 'mario-grown-crouched',
    dead: 'mario-grown-dead'
  },
  normal: {
    idle: 'mario-idle',
    walk: 'mario-walk',
    jump: 'mario-jump',
    dead: 'mario-dead'
  }
}

let isOnPipe = false

export function checkControls ({ mario, keys, pipeCollider }) {
  const isMarioTouchingFloor = mario.body.blocked.down

  const isLeftKeyDown = keys.left.isDown
  const isRightKeyDown = keys.right.isDown
  const isUpKeyDown = keys.up.isDown
  const isDownKeyDown = keys.down.isDown
  const isSpaceKeyDown = keys.space.isDown

  if (mario.isDead) return
  if (mario.isBlocked) return

  // Mira si Mario está grande: Si  está grande, usa las animaciones de Mario grande, si no, usa las animaciones de Mario normal (ambas determinadas en MARIO_ANIMATIONS).
  // "?" y ":" se tratan de un operadores ternarios.
  const marioAnimations = mario.isGrown
    ? MARIO_ANIMATIONS.grown
    : MARIO_ANIMATIONS.normal

  if (isLeftKeyDown) {
    isMarioTouchingFloor && mario.anims.play(marioAnimations.walk, true)
    mario.setVelocityX(-130)
    // mario.x -= 2
    mario.flipX = true
  } else if (isRightKeyDown) {
    isMarioTouchingFloor && mario.anims.play(marioAnimations.walk, true)
    mario.setVelocityX(130)
    // mario.x += 2
    mario.flipX = false
  } else if (isMarioTouchingFloor) {
    if (isDownKeyDown && mario.isGrown) {
      mario.setVelocityX(0)
      mario.anims.play(marioAnimations.crouch, true)
      mario.setVelocityY(0)
    } else {
      mario.setVelocityX(0)
      mario.anims.play(marioAnimations.idle, true)
    }
  } else {
    mario.setVelocityX(0)
  }

  if (mario.x < 726 && mario.x > 700 && mario.y >= 0 && (isDownKeyDown || isOnPipe)) {
    isOnPipe = true
    mario.x = 711
    pipeCollider.active = false
    mario.setVelocityY(50)

    setTimeout(() => {
      mario.x = 3700
      mario.y = -10
      mario.setVelocity(0, 0) // Reiniciar la velocidad para evitar conflictos
      pipeCollider.active = true // Reactivar las colisiones
      isOnPipe = false
    }, 1500)
  } else {
    pipeCollider.active = true
    if (isOnPipe) isOnPipe = false
  }

  if ((isUpKeyDown && isMarioTouchingFloor) || (isSpaceKeyDown && isMarioTouchingFloor)) {
    mario.setVelocityY(-300)
    mario.anims.play(marioAnimations.jump, true)
  }
}
