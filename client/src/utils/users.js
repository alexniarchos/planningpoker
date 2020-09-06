function getUserById(users, id) {
  return users.find((user) => user.id === id);
}

function getUserIndexById(users, id) {
  return users.findIndex((user) => user.id === id);
}

export {getUserById, getUserIndexById};
