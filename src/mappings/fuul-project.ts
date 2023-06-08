import { Budget } from "../../generated/schema";
import {
  FungibleBudgetDeposited as FungibleBudgetDepositedEvent,
  Attributed as AttributedEvent,
} from "../../generated/templates/FuulProject/FuulProject";

export function handleFungibleBudgetDeposited(
  event: FungibleBudgetDepositedEvent
): void {
  let entity = new Budget(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );

  entity.projectContractAddress = event.params.account; // Address of the project contract where the budget was deposited
  entity.amount = event.params.amount; // Amount of the budget deposited
  entity.currency = event.params.currency; // Address of the currency contract
  entity.ownerAddress = event.params.account; // In this case the owner is the same as the project contract address

  entity.transactionHash = event.transaction.hash;
  entity.blockNumber = event.params._event.block.number;
  entity.blockTimestamp = event.params._event.block.timestamp;

  entity.save();
}

export function handleAttributed(event: AttributedEvent): void {
  const receivers = event.params.receivers;
  const amounts = event.params.amounts;
  const currency = event.params.currency;
  const projectContractAddress = event.params._event.transaction.from;

  for (let index = 0; index < receivers.length; index++) {
    const receiverAddress = receivers[index];

    let entity = new Budget(
      event.transaction.hash.concatI32(event.logIndex.toI32())
    );

    entity.projectContractAddress = projectContractAddress;
    entity.amount = amounts[index];
    entity.currency = currency;
    entity.ownerAddress = receiverAddress;

    entity.blockNumber = event.params._event.block.number;
    entity.blockTimestamp = event.params._event.block.timestamp;

    entity.save();
  }
}
