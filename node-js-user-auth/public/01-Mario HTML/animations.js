export const createAnimations = (game) => {
  // --- mario ---
  game.anims.create({
    key: 'mario-walk',
    frames: game.anims.generateFrameNumbers(
      'mario',
      { start: 3, end: 1 }
    ),
    frameRate: 12, // Contra más alto sea el frameRate, más rápida irá la animación
    repeat: -1 // Para hacer que la animación se repita siempre
  })

  game.anims.create({
    key: 'mario-idle',
    frames: [{ key: 'mario', frame: 0 }]
  })

  game.anims.create({
    key: 'mario-jump',
    frames: [{ key: 'mario', frame: 5 }]
  })

  game.anims.create({
    key: 'mario-dead',
    frames: [{ key: 'mario', frame: 4 }]
  })

  game.anims.create({
    key: 'mario-grown-idle',
    frames: [{ key: 'mario-grown', frame: 0 }]
  })

  game.anims.create({
    key: 'mario-grown-walk',
    frames: game.anims.generateFrameNumbers(
      'mario-grown',
      { start: 3, end: 1 }
    ),
    frameRate: 12,
    repeat: -1 // Para hacer que la animación se repita siempre
  })

  game.anims.create({
    key: 'mario-grown-crouched',
    frames: [{ key: 'mario-grown', frame: 4 }]
  })

  game.anims.create({
    key: 'mario-grown-jump',
    frames: [{ key: 'mario-grown', frame: 5 }]
  })

  // --- goomba ---
  game.anims.create({
    key: 'goomba-walk',
    frames: game.anims.generateFrameNumbers(
      'goomba',
      { start: 0, end: 1 }
    ),
    frameRate: 12,
    repeat: -1
  })

  game.anims.create({
    key: 'goomba-dead',
    frames: [{ key: 'goomba', frame: 2 }]
  })

  // --- coin ---
  game.anims.create({
    key: 'coin-idle',
    frames: game.anims.generateFrameNumbers(
      'coin',
      { start: 0, end: 3 }
    ),
    frameRate: 8, // Contra más alto sea el frameRate, más rápida irá la animación
    repeat: -1 // Para hacer que la animación se repita siempre
  })

  // --- seta ---
  game.anims.create({
    key: 'supermushroom-idle',
    frames: game.anims.generateFrameNumbers(
      'super-mushroom',
      { start: 0, end: 1 }
    ),
    frameRate: 12,
    repeat: -1
  })

  game.anims.create({
    key: 'itemBrick-idle',
    frames: game.anims.generateFrameNumbers(
      'item-brick',
      { start: 0, end: 2 }
    ),
    frameRate: 12,
    repeat: -1
  })

  game.anims.create({
    key: 'itemBrick-picked',
    frames: [{ key: 'item-brick-picked', frame: 0 }]
  })
}

export function marioGrownAnimation (mario) {
  if (window.navigator.platform.startsWith('Linux')) {
    // Para el bucle, se establece una variable que toma como valor inicial 0.
    let i = 0
    // Este es un bucle que se ejecuta durante 100 milisegundos y en cada iteración, cambia la animación de Mario, ya que suma un vaor a la variable establecida anteriormente (let i = 1;) y detecta que si el residuo de la división entre i y 2 es 0, es decir, que i es par, se cambia la animación de Mario a "mario-grown-idle", y si es impar, se cambia la animación de Mario a "mario-idle".
    const interval = setInterval(() => {
      mario.anims.play(i % 2 === 0
        ? 'mario-grown-idle'
        : 'mario-idle'
      )
      i++
    }, 100)
    return interval
  } else {
    // Para el bucle, se establece una variable que toma como valor inicial 0.
    let i = 1
    // Este es un bucle que se ejecuta durante 100 milisegundos y en cada iteración, cambia la animación de Mario, ya que suma un vaor a la variable establecida anteriormente (let i = 1;) y detecta que si el residuo de la división entre i y 2 es 0, es decir, que i es par, se cambia la animación de Mario a "mario-grown-idle", y si es impar, se cambia la animación de Mario a "mario-idle".
    const interval = setInterval(() => {
      // En Windows, Para que Mario se haga grande de una forma correcta, la primera animación en ejecutarse ha de ser "mario-idle". En este caso, lo he provocado haciendo que el valor inicial de i sea 1, pero también se podría hacer que el valor de i se actualice antes que se ejecute la animación dentro del intervalo

      mario.anims.play(i % 2 === 0
        ? 'mario-grown-idle'
        : 'mario-idle'
      )
      i++
    }, 100)
    return interval
  }
}
