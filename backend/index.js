const { gql, ApolloServer } = require("apollo-server");
const fs = require("fs");
const data = "./todos.json";

const readData = () => {
  return JSON.parse(fs.readFileSync(data, "utf-8"));
};

const writeData = (input) => {
  fs.writeFileSync(data, JSON.stringify(input, null, 2));
};

const typeDefs = gql`
  type Task {
    id: ID!
    title: String!
    description: String
  }

  type Query {
    tasks: [Task!]!
    task(id: ID!): Task
  }

  type Mutation {
    addTask(title: String!, description: String): Task
    updateTask(id: ID!, title: String!, description: String): Task
    deleteTask(id: ID!): Boolean
  }
`;

const resolvers = {
  Query: {
    tasks: () => readData(),
    task: (_, { id }) => readData().find((task) => task.id === id),
  },

  Mutation: {
    addTask: (_, { title, description }) => {
      const data = readData();
      const newTask = {
        id: Date.now().toString(),
        title,
        description,
      };
      data.push(newTask);
      writeData(data);
      return newTask;
    },

    updateTask: (_, { id, title, description }) => {
      const data = readData();
      const index = data.findIndex((task) => task.id === id);
      if (index === -1) return null;

      const updated = {
        ...data[index],
        title: title || data[index].title,
        description: description || data[index].description,
      };
      data[index] = updated;
      writeData(data);
      return updated;
    },

    deleteTask: (_, { id }) => {
      const data = readData();
      const filteredData = data.filter((task) => task.id !== id);

      if (data.length === filteredData.length) return false;

      writeData(filteredData);
      return true;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`server started on ${url}`);
});
