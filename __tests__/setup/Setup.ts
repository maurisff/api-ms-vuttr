import faker from 'faker'
import factory from 'factory-girl'

import User from '../../src/models/user.model'
import Tool from '../../src/models/tool.model'

factory.define('User', User, {
  login: faker.internet.userName(),
  password: faker.internet.password(),
  name: faker.name.firstName()
})

factory.define('User2', User, {
  login: faker.internet.userName(),
  password: faker.internet.password(),
  name: faker.name.firstName()
})

factory.define('Session', User, {
  login: faker.internet.userName(),
  password: faker.internet.password(),
  name: faker.name.firstName()
})

factory.define('Tool', Tool, {
  title: faker.hacker.noun(),
  link: faker.internet.url(),
  description: faker.lorem.text(),
  tags: [
    'node',
    'express',
    'typescript',
    'mongodb',
    'developer',
    'https',
    'proxy'
  ]
})

factory.define('Tool2', Tool, {
  title: faker.hacker.noun(),
  link: faker.internet.url(),
  description: faker.lorem.text(),
  tags: [
    'Vue',
    'vuetify',
    'webpack',
    'pwa',
    'css',
    'scss',
    'UI',
    'javascript',
    'https'
  ]
})

export default factory
