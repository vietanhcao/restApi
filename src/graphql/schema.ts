import { buildSchema } from 'graphql';

export default buildSchema(`
  type Post {
    _id: ID!
    tilte: String!
    content: String!
    imageUrl: String!
    creator: User!
    createAt: String!
    updateAt: String!
  }

  type User {
    _id : ID!
    name: String!
    email: String!
    password: String
    status: String!
    posts: [Post!]!
  }

  input UserInputData {
    email: String!
    name: String!
    password: String!
  }

  type AuthData {
    token: String!
    userId: String! 
  }

  type RootQuery {
    login(email:String!,password:String!): AuthData!
  }

  type RootMutation {
    createUser(userInput: UserInputData): User!
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }

`);
