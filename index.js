import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { GraphQLError } from "graphql";
import "./db.js";
import Person from "./models/person.js";
import User from "./models/user.js";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  "ASJDEPINKNFPIASNDEIONFIAS_NDAOUSD!@DMAOUHSD@IWJDAS/()/)J1NKN2K";

const typeDefs = `#graphql
enum YesNo {
    YES
    NO
}

type Address {    
    street: String!,
    city: String!,
}

type Person {
    name: String!,
    phone: String,
    address: Address!,
    check: String!,
    id: ID!
}

type User {
    username: String!,
    friends: [Person]!,
    id: ID!
}
type Token {
  id: String
  value: String!
}

type Query {
    personCount: String!,
    allPersons (phone: YesNo): [Person]!,
    findPerson(name: String!): Person,
    me: User,
    allUsers: [User]!
}

type Mutation {
    addPerson(name: String!, phone: String, street: String!, city: String!): Person
    editNumber(name: String!, phone: String!): Person,
    createUser(username: String!): User,
    login(username: String!, password: String!): Token,
    addAsFriend(name: String!): User
}
`;

const resolvers = {
  Query: {
    personCount: async () => Person.countDocuments(),
    allPersons: async (parent, args) => {
      /* Returning all the persons in the database. */
      const persons = Person.find({});
      if (!args.phone) return persons;

      return persons.find({ phone: { $exists: args.phone === "YES" } });
    },
    findPerson: async (parent, args) => {
      const { name } = args;
      return Person.findOne({ name });
    },
    allUsers: async (parent, args) => {
      return User.find({});
    },
    me: (parent, args, context) => {
      return context.currentUser;
    },
  },
  Mutation: {
    addPerson: async (parent, args, context) => {
      const { currentUser } = context;
      if (!currentUser)
        throw new GraphQLError(
          "You are not authorized to perform this action.",
          {
            extensions: {
              code: "UNAUTHENTICATED",
            },
          }
        );

      const person = new Person({ ...args });
      try {
        await person.save();
        currentUser.friends = currentUser.friends.concat(person);
        await currentUser.save();
      } catch (error) {
        throw new GraphQLError(error.message, {
          extensions: {
            code: "BAD_USER_INPUT",
            argumentName: "name",
            argumentValue: args.name,
          },
        });
      }
      return person;
    },
    editNumber: async (parent, args) => {
      const person = await Person.findOne({ name: args.name });
      if (!person) return;

      person.phone = args.phone;

      try {
        await person.save();
      } catch (error) {
        throw new GraphQLError(error.message, {
          extensions: {
            code: "BAD_USER_INPUT",
            argumentName: "phone",
            argumentValue: args.phone,
          },
        });
      }
      return person;
    },
    createUser: (parent, args) => {
      const user = new User({ username: args.username });

      return user.save().catch((error) => {
        throw new GraphQLError(error.message, {
          extensions: {
            code: "BAD_USER_INPUT",
            argumentName: "username",
            argumentValue: args.username,
          },
        });
      });
    },
    login: async (parent, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secret") {
        throw new GraphQLError(error.message, {
          extensions: {
            code: "Wrong credentials",
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return {
        value: jwt.sign(userForToken, JWT_SECRET),
      };
    },
    addAsFriend: async (parent, args, context) => {
      const { currentUser } = context;
      if (!currentUser)
        throw new GraphQLError(
          "You are not authorized to perform this action.",
          {
            extensions: {
              code: "UNAUTHENTICATED",
            },
          }
        );

      const person = await Person.findOne({ name: args.name });
      const isFriendAlready = (person) =>
        currentUser.friends.map((p) => p.id).includes(person.id);

      if (!isFriendAlready(person)) {
        currentUser.friends = currentUser.friends.concat(person);

        await currentUser.save().catch((error) => {
          throw new GraphQLError(error.message, {
            extensions: {
              code: "UNAUTHENTICATED",
            },
          });
        });
      }
      
      return currentUser;
    },
  },
  Person: {
    address: (parent) => {
      return {
        street: parent.street,
        city: parent.city,
      };
    },
    check: () => "Sebass",
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  includeStacktraceInErrorResponses: false,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null;
    // console.log(auth)
    if (auth && auth.toLowerCase().startsWith("bearer ")) {
      const token = auth.substring(7);
      const decodedToken = jwt.verify(token, JWT_SECRET);
      const currentUser = await User.findById(decodedToken.id).populate(
        "friends"
      );
      return { currentUser };
    }
  },
});

console.log(`🚀  Server ready at: ${url}`);
