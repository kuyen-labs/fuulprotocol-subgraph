import { Address } from "@graphprotocol/graph-ts";
import { UserBalance } from "../../generated/schema";
import { getUserBalanceId } from "../utils";

export function getOrCreateUserBalance(
  address: Address,
  currency: Address,
  projectAddress: Address
): UserBalance {
  const id = getUserBalanceId(address, currency, projectAddress);

  let userBalance = UserBalance.load(id);

  if (userBalance == null) {
    userBalance = new UserBalance(address.toHexString());

    userBalance.owner = address.toHexString();

    userBalance.save();
  }

  return userBalance as UserBalance;
}
