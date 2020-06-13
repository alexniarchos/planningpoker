function generateId(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function generateName() {
  const names = [
    'Giraffe',
    'Woodpecker',
    'Camel',
    'Starfish',
    'Koala',
    'Alligator',
    'Owl',
    'Tiger',
    'Bear',
    'Whale',
    'Coyote',
    'Chimpanzee',
    'Raccoon',
    'Lion',
    'Wolf',
    'Crocodile',
    'Dolphin',
    'Elephant',
    'Squirrel',
    'Snake',
    'Kangaroo',
    'Hippopotamus',
    'Elk',
    'Fox',
    'Gorilla',
    'Bat',
    'Hare',
    'Toad',
    'Frog',
    'Deer',
    'Rat',
    'Badger',
    'Lizard',
    'Mole',
    'Hedgehog',
    'Otter',
    'Reindeer'
  ];

  return `Anonymous ${names[Math.floor(Math.random() * names.length)]}`;
}

export { generateId, generateName };
