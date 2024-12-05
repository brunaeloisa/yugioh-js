const pathImages = './src/assets/icons/';

export const cardData = [
  {
    id: 0,
    name: 'Blue Eyes White Dragon',
    type: 'Paper',
    img: `${pathImages}dragon.png`,
    win: [1],
    lose: [2]
  },
  {
    id: 1,
    name: 'Dark Magician',
    type: 'Rock',
    img: `${pathImages}magician.png`,
    win: [2],
    lose: [0]
  },
  {
    id: 2,
    name: 'Exodia',
    type: 'Scissors',
    img: `${pathImages}exodia.png`,
    win: [0],
    lose: [1]
  }
]