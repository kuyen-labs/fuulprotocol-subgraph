import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import { UserBalance } from "../../generated/schema";
import { getUserBalanceId } from "../utils";

export function getOrCreateUserBalance(
  address: Address,
  currency: Address,
  projectAddress: Address
): UserBalance {
  const id = getUserBalanceId(address, currency, projectAddress);

  let userBalance = UserBalance.load(id);

  log.info("getOrCreateUserBalance: {}", [id]);

  if (userBalance == null) {
    userBalance = new UserBalance(id);

    userBalance.owner = address.toHexString();
    userBalance.project = projectAddress.toHexString();
    userBalance.currency = currency;
    userBalance.availableToClaim = BigInt.fromI32(0);
    userBalance.claimed = BigInt.fromI32(0);
  }

  log.info("Updating UserBalance with id: {}", [userBalance.id.toString()]);

  userBalance.save();
  return userBalance as UserBalance;
}
