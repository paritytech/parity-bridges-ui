# UI for Substrate Bridges

The goal of the UI is to provide the users a convenient way of interacting with the Bridge - querying its state and sending transactions.

| 🚀  | Live version at [//paritytech.github.io/parity-bridges-ui](https://paritytech.github.io/parity-bridges-ui) |
| --- | :--------------------------------------------------------------------------------------------------------- |

## Configuring custom Substrate providers / chains

The project includes a `.env` file at root project directory that contains all the variables for running the bridge UI:

```
REACT_APP_CUSTOM_HASHER_CHAIN_2=blake2Keccak256Hasher
CUSTOM_TYPES_URL_CHAIN_1=https://raw.githubusercontent.com/paritytech/parity-bridges-common/master/deployments/types-rialto.json
REACT_APP_CUSTOM_TYPES_URL_CHAIN_2=https://raw.githubusercontent.com/paritytech/parity-bridges-common/master/deployments/types-millau.json
REACT_APP_SUBSTRATE_PROVIDER_CHAIN_1=wss://wss.rialto.brucke.link
REACT_APP_SUBSTRATE_PROVIDER_CHAIN_2=wss://wss.millau.brucke.link

REACT_APP_LANE_ID=0x00000000
REACT_APP_KEYRING_DEV_LOAD_ACCOUNTS=false
```

| ℹ️  | In case you need to overwrite any of the variables defined, please do so creating a new `.env.local`. |
| --- | :---------------------------------------------------------------------------------------------------- |

In case of questions about `.env` management please refer to this link: [create-react-app env files](https://create-react-app.dev/docs/adding-custom-environment-variables/#what-other-env-files-can-be-used)
<<<<<<< HEAD
=======

## Custom Hashers for building connections

If any of the chains (or both) need to use a custom hasher function this one can be built and exported from the file: `src/configs/chainsSetup/customHashers.ts`. Then it is just a matter of referring the function name using variable `REACT_APP_CUSTOM_HASHER_CHAIN_<Chain number>` from `.env` file.
>>>>>>> 22dd2e0... Fixing some values and updating docs

## Running the bridge

Please refer to this section of the Bridges project to run the bridge locally: [running-the-bridge](https://github.com/paritytech/parity-bridges-common#running-the-bridge)

## Development

### `yarn`

This will install all the dependencies for the project.

### `yarn start`

Runs the app in the development mode. Open [http://localhost:3001](http://localhost:3001) to view it in the browser.

### `yarn test`

Runs the test suite.

### `yarn lint`

Runs the linter & formatter.

## customTypes config files process.

There is an automated process that downloads all the required types<CHAIN>.json files available in the deployments section of [parity-bridges-common](https://github.com/paritytech/parity-bridges-common/tree/master/deployments) repository.
This hook is executed before the local development server starts and during the lint/test/build process during deployment.
In case there is an unexpected issue with this process you can test this process isolated by running:

### `yarn prestart`

## Learn More

For additional information about the Bridges Project please refer to [parity-bridges-common](https://github.com/paritytech/parity-bridges-common) repository.
