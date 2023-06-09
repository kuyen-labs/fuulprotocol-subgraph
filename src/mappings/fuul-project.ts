import { BigInt, Bytes, dataSource } from "@graphprotocol/graph-ts";
import { Budget, UserBalance } from "../../generated/schema";
import {
  FungibleBudgetDeposited as FungibleBudgetDepositedEvent,
  FungibleBudgetRemoved as FungibleBudgetRemovedEvent,
  Attributed as AttributedEvent,
} from "../../generated/templates/FuulProject/FuulProject";

let context = dataSource.context();
let projectAddress = Bytes.fromHexString(context.getString("projectAddress"));

export function handleFungibleBudgetDeposited(
  event: FungibleBudgetDepositedEvent
): void {
  let entity = Budget.load(event.address);

  if (entity == null) {
    entity = new Budget(projectAddress);

    entity.account = event.params.account;
    entity.amount = event.params.amount;
    entity.remainingBudgetPercentage = BigInt.fromI32(100);
    entity.remainingBudgetReferenceAmount = event.params.amount;
  }

  entity.amount = entity.amount.plus(event.params.amount);
  entity.remainingBudgetReferenceAmount = entity.remainingBudgetReferenceAmount.plus(
    event.params.amount
  );

  entity.save();
}

export function handleFungibleBudgetRemoved(
  event: FungibleBudgetRemovedEvent
): void {
  let entity = Budget.load(event.address);

  if (entity != null) {
    entity.amount = entity.amount.minus(event.params.amount);
    entity.remainingBudgetPercentage = entity.amount.div(
      entity.remainingBudgetReferenceAmount
    );

    entity.save();
  }
}

export function handleAttributed(event: AttributedEvent): void {
  const receivers = event.params.receivers;
  const amounts = event.params.amounts;
  const currency = event.params.currency;

  for (let index = 0; index < receivers.length; index++) {
    const receiverAddress = receivers[index];

    let entity = UserBalance.load(receiverAddress);

    if (entity == null) {
      entity = new UserBalance(receiverAddress);

      entity.availableToClaim = amounts[index];
      entity.currency = currency;
      entity.claimed = BigInt.fromI32(0);
    }

    entity.availableToClaim = entity.availableToClaim.plus(amounts[index]);

    entity.save();
  }

  const projectBudget = Budget.load(event.address);

  if (projectBudget != null) {
    projectBudget.amount = projectBudget.amount.minus(event.params.totalAmount);
  }
}
