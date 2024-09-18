const INIT_SPRITESHEETS = [
  {
    key: 'mario',
    path: 'assets/entities/mario.png',
    // Para calcular el número de frames que tiene cada sprite tanto como de alto comando de ancho, se accede a la pestaña "Detalles" de las propiedades de la imagen (explorador de archivos) y se divide el ancho por el número de frames (en el caso de frameWith, frameHeight es el que viene con la imagen)
    frameWidth: 18,
    frameHeight: 16
  },
  {
    key: 'mario-grown',
    path: 'assets/entities/mario-grown.png',
    frameWidth: 18,
    frameHeight: 32
  },
  {
    key: 'goomba',
    path: 'assets/entities/overworld/goomba.png',
    frameWidth: 16,
    frameHeight: 16
  },
  {
    key: 'coin',
    path: 'assets/collectibles/coin.png',
    frameWidth: 16,
    frameHeight: 16
  },
  {
    key: 'item-brick',
    path: 'assets/blocks/overworld/misteryBlock.png',
    frameWidth: 16,
    frameHeight: 16
  },
  {
    key: 'item-brick-picked',
    path: 'assets/blocks/overworld/emptyBlock.png',
    frameWidth: 16,
    frameHeight: 16
  },
  {
    key: 'destroyed-brick',
    path: 'assets/blocks/overworld/brick-debris.png',
    frameWidth: 16,
    frameHeight: 16
  },
  {
    key: 'brown-brick',
    path: 'assets/blocks/overworld/block.png',
    frameWidth: 16,
    frameHeight: 16
  }
]

export const initSpritesheets = ({ load }) => {
  // Por cada clave y ruta de cada diccionario de la lista , se cargará el audio con la clave y ruta correspondiente
  INIT_SPRITESHEETS.forEach(({ key, path, frameWidth, frameHeight }) => {
    load.spritesheet(key, path, { frameWidth, frameHeight })
  })
}
