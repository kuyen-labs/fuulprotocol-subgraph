import { newMockEvent } from "matchstick-as";
import {
  Attributed,
  Claimed,
  FungibleBudgetDeposited,
} from "../generated/templates/FuulProject/FuulProject";
import { Address, BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts";

export function createFungibleTokenBudgetDepositedEvent(
  amount: BigInt,
  currency: Address
): FungibleBudgetDeposited {
  let fungibleBudgetDepositedEvent = changetype<FungibleBudgetDeposited>(
    newMockEvent()
  );

  fungibleBudgetDepositedEvent.parameters = new Array();

  fungibleBudgetDepositedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  );

  fungibleBudgetDepositedEvent.parameters.push(
    new ethereum.EventParam("currency", ethereum.Value.fromAddress(currency))
  );

  return fungibleBudgetDepositedEvent;
}

export function createAttributedEvent(
  currency: Address,
  totalAmount: BigInt,
  receivers: Array<Address>,
  amounts: Array<BigInt>,
  proof: Bytes
): Attributed {
  let attributedEvent = changetype<Attributed>(newMockEvent());

  attributedEvent.parameters = new Array();

  attributedEvent.parameters.push(
    new ethereum.EventParam("currency", ethereum.Value.fromAddress(currency))
  );

  attributedEvent.parameters.push(
    new ethereum.EventParam(
      "totalAmount",
      ethereum.Value.fromUnsignedBigInt(totalAmount)
    )
  );

  attributedEvent.parameters.push(
    new ethereum.EventParam(
      "receivers",
      ethereum.Value.fromAddressArray(receivers)
    )
  );

  attributedEvent.parameters.push(
    new ethereum.EventParam(
      "amounts",
      ethereum.Value.fromSignedBigIntArray(amounts)
    )
  );

  attributedEvent.parameters.push(
    new ethereum.EventParam("proof", ethereum.Value.fromBytes(proof))
  );

  return attributedEvent;
}

export function createClaimedEvent(
  account: Address,
  currency: Address,
  amount: BigInt
): Claimed {
  let claimedEvent = changetype<Claimed>(newMockEvent());

  claimedEvent.parameters = new Array();

  claimedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  );

  claimedEvent.parameters.push(
    new ethereum.EventParam("currency", ethereum.Value.fromAddress(currency))
  );

  claimedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  );

  return claimedEvent;
}
