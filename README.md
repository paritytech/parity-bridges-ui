# UI Bridge for Substrate chains.

This is a UI proposal for querying , operating  and testing the bridge.

## Installation.

### `yarn`

This will install all the dependencies for the project.

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3001](http://localhost:3001) to view it in the browser.


### Configure custom substrate providers

In the `.env` file at root project directory, you have to define the following env variables:

REACT_APP_SUBSTRATE_PROVIDER_1=<WS-Provider chain 1>
REACT_APP_SUBSTRATE_PROVIDER_2=<WS-Provider chain 2>
REACT_APP_PROVIDER_NAME_1=<Chain 1 name>
REACT_APP_PROVIDER_NAME_2=<Chain 2 name>

In case these values are not provided the default chains will be rialto and millau chains.

## Learn More

For additional information about bridges project please refeer to [parity-bridges-common](https://github.com/paritytech/parity-bridges-common) repository.

To learn React, check out the [React documentation](https://reactjs.org/).
