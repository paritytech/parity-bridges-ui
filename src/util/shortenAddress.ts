// eslint-disable-next-line header/header
export default (address: string, eth: boolean = false) => {
  if (!address || address.length < 8) {
    return address;
  }

  return eth
    ? `${address.substring(0, 8)}...${address.substring(address.length - 8)}`
    : `${address.substring(0, 6)}...${address.substring(address.length - 8)}`;
};
