module.exports = function(app, USERS){
  app.get('/users', (request, response, next) => {
    try {
      const users = USERS.map(user => userWithPermissions(user));
      response.send(users)
    } catch (error) {
      next(error)
    }
  })

  app.post('/users', (request, response, next) => {
    try {
      const user = {
        id: Math.max(...USERS.map(user => user.id, 0)) + 1,
        name: request.body.name,
        age: request.body.age,
        role: request.body.role
      }
      USERS.push(user)
      response.send(userWithPermissions(user))
    } catch (error) {
      next(error)
    }
  })

  app.put('/users/:id', (request, response, next) => {
    try {
      const id = parseInt(request.params.id)
      const userIndex = USERS.findIndex(user => user.id === id)

      if (userIndex === -1) {
        response.status(404).send('Id not found.')
        return
      }
      const userUpdated = { id, ...request.body }
      USERS.splice(userIndex, 1, userUpdated)
      response.send(userWithPermissions(USERS[userIndex]))
    } catch (error) {
      next(error)
    }
  })
}

function userWithPermissions(user) {
  const permissions = getPermissionsForUser(user);
  return {...user, permissions };
}

function getPermissionsForUser(user) {
  switch (user.role) {
    case 'admin':
      return {
        adminUsers: true,
        viewPaints: true,
        editPaints: true,
      };
    case 'manager':
    case 'painter':
      return {
        adminUsers: false,
        viewPaints: true,
        editPaints: true,
      };
    case 'viewer':
      return {
        adminUsers: false,
        viewPaints: true,
        editPaints: false,
      };
    default: return {};
  }
}