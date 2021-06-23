# UI for Substrate Bridges

The goal of the UI is to provide the users a convenient way of interacting with the Bridge - querying its state and sending transactions.

| 🚀  | Live version at [//paritytech.github.io/parity-bridges-ui](https://paritytech.github.io/parity-bridges-ui) |
| --- | :--------------------------------------------------------------------------------------------------------- |

## Configuring custom Substrate providers / chains

The project includes a `.env` file at root project directory that contains all the variables for running the bridge UI:

```
REACT_APP_CHAIN_1_CUSTOM_TYPES_URL=https://raw.githubusercontent.com/paritytech/parity-bridges-common/master/deployments/types-rialto.json
REACT_APP_CHAIN_1_SUBSTRATE_PROVIDER=wss://wss.rialto.brucke.link
REACT_APP_CHAIN_2_CUSTOM_HASHER=blake2Keccak256Hasher
REACT_APP_CHAIN_2_CUSTOM_TYPES_URL=https://raw.githubusercontent.com/paritytech/parity-bridges-common/master/deployments/types-millau.json
REACT_APP_CHAIN_2_SUBSTRATE_PROVIDER=wss://wss.millau.brucke.link

REACT_APP_LANE_ID=0x00000000
REACT_APP_KEYRING_DEV_LOAD_ACCOUNTS=false
REACT_APP_IS_DEVELOPMENT=false
```

| ℹ️  | In case you need to overwrite any of the variables defined, please do so creating a new `.env.local`. |
| --- | :---------------------------------------------------------------------------------------------------- |

In case of questions about `.env` management please refer to this link: [create-react-app env files](https://create-react-app.dev/docs/adding-custom-environment-variables/#what-other-env-files-can-be-used)

## Custom Hashers for building connections

If any of the chains (or both) need to use a custom hasher function this one can be built and exported from the file: `src/configs/chainsSetup/customHashers.ts`. Then it is just a matter of referring the function name using variable `REACT_APP_CUSTOM_HASHER_CHAIN_<Chain number>` from `.env` file.

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

## Execute E2E test

[Puppeteer](https://developers.google.com/web/tools/puppeteer/) is used for running E2E test for bridges (Only chrome for now).
##### Requirements:
a) Have chrome installed on your computer. (This test requires it and will not download it when running);
b) ensure that in your `env.local` file the `REACT_APP_IS_DEVELOPMENT` and `REACT_APP_KEYRING_DEV_LOAD_ACCOUNTS` are true;
c) Make sure all steps mentioned above have run in a seperate terminal (`yarn` - `yarn start`) and the application of bridges is running;
d) In a different terminal window run the following command:
#### `yarn run test:e2e-alone`


## customTypes config files process.

There is an automated process that downloads all the required types<CHAIN>.json files available in the deployments section of [parity-bridges-common](https://github.com/paritytech/parity-bridges-common/tree/master/deployments) repository.
This hook is executed before the local development server starts and during the lint/test/build process during deployment.
In case there is an unexpected issue with this process you can test this process isolated by running:

### `yarn prestart`

## Learn More

For additional information about the Bridges Project please refer to [parity-bridges-common](https://github.com/paritytech/parity-bridges-common) repository.

## Docker

Can be found in [dockerhub](https://hub.docker.com/repository/docker/wirednkod13/parity-bridges-ui).
_NOTE: alter url once this is moved_

To build the image run the:
```
docker build -t parity-bridges-ui:dev .
```

Now that image is built, container can start with the following command, which will serve our app on port 8080.
```
docker run --rm -it -p 8080:80 parity-bridges-ui:dev
```

(optional) The `--env-file` param can be added in the command above if you intend to alter the default [ENV params](https://github.com/paritytech/parity-bridges-ui/blob/master/.env).
(e.g. `docker build --env-file .env -t parity-bridges-ui:dev ` )
