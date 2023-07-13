import { Address } from "@graphprotocol/graph-ts";

export const getBudgetId = (
  projectContractAddress: Address,
  currency: Address
): string => {
  return projectContractAddress
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

export const getProjectMemberId = (
  projectContractAddress: Address,
  currency: Address
): string => {
  return projectContractAddress
    .toHexString()
    .concat("-")
    .concat(currency.toHexString());
};
