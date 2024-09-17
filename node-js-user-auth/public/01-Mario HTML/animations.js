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
}
