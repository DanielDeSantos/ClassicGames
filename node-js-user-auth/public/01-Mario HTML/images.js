const INIT_IMAGES = [
  {
    key: 'tiles',
    path: 'assets/maps/scenery_tileset.png'
  },
  {
    key: 'supermushroom',
    path: 'assets/collectibles/super-mushroom.png'
  }
]

export const initImages = ({ load }) => {
  INIT_IMAGES.forEach(({ key, path }) => {
    load.image(key, path)
  })
}
