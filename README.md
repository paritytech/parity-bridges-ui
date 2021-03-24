# UI for Substrate Bridges

The goal of the UI is to provide the users a convenient way of interacting with the Bridge - querying its state and sending transactions.


| 🚀 | Live version at [//parity.github.io/parity-bridges-ui](https://parity.github.io/parity-bridges-ui) |
|----|:------------------------|


## Configuring custom Substrate providers / chains

In the `.env` file at root project directory, you have to define the following env variables:

```
REACT_APP_SUBSTRATE_PROVIDER_1=<WS-Provider chain 1>
REACT_APP_SUBSTRATE_PROVIDER_2=<WS-Provider chain 2>
REACT_APP_PROVIDER_NAME_1=<Chain 1 name>
REACT_APP_PROVIDER_NAME_2=<Chain 2 name>
```

| ℹ️ | In case these values are not provided the default chains will be Rialto and Millau chains. |
|----|:------------------------|


## Development

### `yarn`

This will install all the dependencies for the project.

### `yarn start`

Runs the app in the development mode. Open [http://localhost:3001](http://localhost:3001) to view it in the browser.

### `yarn test`

Runs the test suite.

### `yarn lint`

Runs the linter & formatter.

## Learn More

For additional information about the Bridges Project please refer to [parity-bridges-common](https://github.com/paritytech/parity-bridges-common) repository.
