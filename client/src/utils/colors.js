/* eslint-disable import/prefer-default-export */

const colors = {
  purple: '#a682ff',
  slateBlue: '#715AFF',
  cornflowerBlue: '#5887ff',
  mayaBlue: '#55c1ff',
  prusianBlue: '#102e4a',
  antwerpBlue: '#05668D',
  nightBlue: '#028090',
  tealBlue: '#00A896',
  parrotGreen: '#02C39A',
  anise: '#F0F3BD'
};

function getRandomColor() {
  return Object.values(colors)[Math.floor(Math.random() * Object.entries(colors).length)];
}

export {colors, getRandomColor};