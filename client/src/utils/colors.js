const colors = {
  purple: '#a682ff',
  lightPurple: '#9d4edd',
  slateBlue: '#715AFF',
  cornflowerBlue: '#5887ff',
  mayaBlue: '#55c1ff',
  prusianBlue: '#102e4a',
  antwerpBlue: '#05668D',
  nightBlue: '#028090',
  tealBlue: '#00A896',
  parrotGreen: '#02C39A',
  lightGreen: '#90be6d',
  red: '#E63946',
  navyBlue: '#1D3557',
  veryDarkBlue: '#0d1b2a'
};

function getRandomColor() {
  return Object.values(colors)[Math.floor(Math.random() * Object.entries(colors).length)];
}

export {colors, getRandomColor};