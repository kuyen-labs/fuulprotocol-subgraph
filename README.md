# Fuul protocol subgraphs

Graph that indexes and provides aggregated data for Fuul Protocol contracts on the Polygon blockchain.

## Table of Contents

- [Installation](#installation)
- [Testing](#testing)
- [Usage](#usage)
- [Configuration](#configuration)

## Installation

To install and set up the Fuul Protocol Subgraph project locally, follow these steps:

1. Clone the repository: git clone https://github.com/fuul-app/subgraphs.git
2. Navigate to the project directory: cd subgraphs
3. Install dependencies: npm install
4. Configure the subgraph settings in the subgraph.yaml file.
5. Deploy the subgraph: 

```sh
# Replace `<SUBGRAPH_NAME>`
graph codegen && graph build && graph deploy --studio <SUBGRAPH_NAME>
```

You will se your graph available at https://thegraph.com/studio/subgraph/<SUBGRAPH_NAME>



## Testing

[Matchstick documentation](https://thegraph.com/docs/developer/matchstick)

```sh
# Run all tests
npm run test
```

## Usage
To interact with the Fuul Protocol Subgraph and retrieve data, follow these steps:

1. Deploy the subgraph to a blockchain network (see Installation section).
2. Once deployed, the subgraph will automatically start indexing relevant data from Fuul Protocol transactions on the deployed network.
3. Use GraphQL queries to retrieve data from the subgraph. You can send queries using tools like GraphiQL or directly via the GraphQL endpoint exposed by the subgraph.
4. Example query to retrieve project budgets:

```graphql
query {
  budgets{
    id
    currency
    amount
  }
}
```

5. Example query to retrieve user balances: 

```graphql
query {
  userBalances{
    currency
    availableToClaim
    claimed
  }
}
```

## Configuration

The Fuul Protocol Subgraph project provides the following configuration options in the `subgraph.yaml` file:

1. `network`: Specifies the blockchain network (e.g., Ethereum mainnet, Mumbai, Polygon mainnet) to deploy the subgraph to.
2. `dataSources`: Specifies the contracts that should be listened and indexed, alongside their respective abis
3. `mapping`: Here we define the entities available in the contract, and the handlers that will take care of transforming on chain transaction logs into relevant data.
4. `templates`: Since we have one Factory contract which creates multiple "child" contracts for each project, we need a way to start indexing a new contract address "dinamically". Templates allow us to create a blueprint of the entities and handlers of the child contracts, and provide us with a `create` method which allow us to index these FuulProject contracts on the fly. 
You can take a look to `src/mappings/fuul-factory.ts` where we use this: 

```typescript
  FuulProject.createWithContext(event.params.deployedAddress, context);
```

Learn more about [Templates](https://thegraph.com/docs/en/developing/creating-a-subgraph/#data-source-templates)
