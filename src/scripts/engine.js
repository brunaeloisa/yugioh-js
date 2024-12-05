import { cardData } from './cardData.js';

const state = {
  score: {
    playerScore: 0,
    computerScore: 0,
    scoreBox: document.getElementById('score-points')
  },
  cardSprites: {
    avatar: document.getElementById('card-img'),
    name: document.getElementById('card-name'),
    type: document.getElementById('card-type'),
  },
  fieldCards: {
    player: document.getElementById('player-field-card'),
    computer: document.getElementById('computer-field-card')
  },
  cardBox: {
    player: document.getElementById('player-cards'),
    computer: document.getElementById('computer-cards')
  },
  buttons: {
    nextDuel: document.getElementById('next-duel'),
    toggleMusic: document.getElementById('music-button')
  }
};

function init() {
  setMusicButton();
  state.buttons.nextDuel.addEventListener('click', resetDuel);
  drawCards(5, 'player');
  drawCards(5, 'computer');
}

async function setMusicButton() {
  const bgMusic = document.getElementById('bg-music');
  bgMusic.volume = 0.3;

  state.buttons.toggleMusic.addEventListener('click', () => {
    if (state.buttons.toggleMusic.innerText === '🔇') {
      bgMusic.play();
      state.buttons.toggleMusic.innerText = '🔊';
    } else {
      bgMusic.pause();
      state.buttons.toggleMusic.innerText = '🔇';
    }
  });
}

async function drawCards(numberOfCards, fieldSide) {
  for (let i = 0; i < numberOfCards; i++) {
    const randomCardId = await getRandomCardId();
    const cardImage = await createCardImage(randomCardId, fieldSide);
    document.getElementById(`${fieldSide}-cards`).appendChild(cardImage);
  }
}

async function getRandomCardId() {
  const randomIndex = Math.floor(Math.random() * cardData.length);
  return cardData[randomIndex].id;
}

async function createCardImage(cardId, fieldSide) {
  const cardImage = document.createElement('img');
  cardImage.setAttribute('height', '100px');
  cardImage.setAttribute('src', './src/assets/icons/card-back.png');
  // cardImage.setAttribute('src', cardData[cardId].img);
  cardImage.setAttribute('data-id', cardId);
  cardImage.classList.add('card');

  if (fieldSide === 'player') {
    cardImage.addEventListener('mouseover', () => drawSelectedCard(cardId));
    cardImage.addEventListener('click', () => {
      setCardsField(cardId);
      cardImage.remove();
    });
  }

  return cardImage;
}

async function setCardsField(cardId) {
  await hideAllCards();

  // gera jogada aleatória com cartas do oponente
  const cardCollection = state.cardBox.computer.children;
  const randomIndex = Math.floor(Math.random() * cardCollection.length);
  const computerCardId = Number(cardCollection[randomIndex].dataset.id);
  cardCollection[randomIndex].remove();

  // exibe carta do jogador e do computador
  state.fieldCards.player.src = cardData[cardId].img;
  state.fieldCards.computer.src = cardData[computerCardId].img;
  state.fieldCards.player.style.display = 'block';
  state.fieldCards.computer.style.display = 'block';

  let duelResult = await checkDuelResult(cardId, computerCardId);

  if (duelResult != 'draw') {
    await playAudio(duelResult);
  }
  
  await updateScore();
  await drawButton(duelResult);
}

async function hideAllCards() {
  document.querySelectorAll('.card').forEach(card => card.style.display = 'none');
  // document.querySelectorAll('.card').forEach(card => card.remove());
}

async function updateScore() {
  state.score.scoreBox.innerText = `Win: ${state.score.playerScore} - Lose: ${state.score.computerScore}`;
}

async function drawButton(duelResult) {
  state.buttons.nextDuel.innerText = duelResult;
  state.buttons.nextDuel.style.visibility = 'visible';
}

async function checkDuelResult(playerCardId, computerCardId) {
  const playerCard = cardData[playerCardId];
  if (playerCard.win.includes(computerCardId)) {
    state.score.playerScore++;
    return 'win';
  } else if (playerCard.lose.includes(computerCardId)){
    state.score.computerScore++;
    return 'lose';
  } else {
    return 'draw';
  }
}

async function drawSelectedCard(cardId) {
  state.cardSprites.avatar.src = cardData[cardId].img;
  state.cardSprites.name.innerText = cardData[cardId].name;
  state.cardSprites.type.innerText = `Attribute: ${cardData[cardId].type}`;
}

async function resetDuel() {
  document.querySelectorAll('.card').forEach(card => card.style.display = 'block');
  state.buttons.nextDuel.style.visibility = 'hidden';

  state.fieldCards.player.style.display = 'none';
  state.fieldCards.computer.style.display = 'none';

  state.cardSprites.avatar.src = '';
  state.cardSprites.name.innerText = 'Select';
  state.cardSprites.type.innerText = 'card';

  // repõe as cartas retiradas
  drawCards(1, 'computer');
  drawCards(1, 'player');
}

async function playAudio(duelResult) {
  const audio = new Audio(`./src/assets/audios/${duelResult}.wav`);
  audio.play();
}

init();