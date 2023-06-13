import { Address } from "@graphprotocol/graph-ts";

export const getBudgetId = (address: Address, currency: Address): string => {
  return address
    .toHexString()
    .concat("-")
    .concat(currency.toHexString());
};

export const getUserBalanceId = (
  address: Address,
  currency: Address,
  projectContractAddress: Address
): string => {
  return address
    .toHexString()
    .concat("-")
    .concat(currency.toHexString())
    .concat("-")
    .concat(projectContractAddress.toHexString());
};
