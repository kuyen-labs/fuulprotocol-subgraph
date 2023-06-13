import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { Budget, User, UserBalance } from "../../generated/schema";
import {
  FungibleBudgetDeposited as FungibleBudgetDepositedEvent,
  FungibleBudgetRemoved as FungibleBudgetRemovedEvent,
  Attributed as AttributedEvent,
  Claimed as ClaimedEvent,
} from "../../generated/templates/FuulProject/FuulProject";
import { getBudgetId, getUserBalanceId } from "../utils";

export function handleFungibleBudgetDeposited(
  event: FungibleBudgetDepositedEvent
): void {
  const id = getBudgetId(event.address, event.params.currency);
  let budget = Budget.load(id);

  if (budget == null) {
    budget = new Budget(id);

    budget.account = event.address;
    budget.amount = event.params.amount;
    budget.currency = event.params.currency;
    budget.remainingBudgetPercentage = BigInt.fromI32(100);
    budget.remainingBudgetReferenceAmount = event.params.amount;
  } else {
    budget.amount = budget.amount.plus(event.params.amount);
    budget.remainingBudgetReferenceAmount = budget.remainingBudgetReferenceAmount.plus(
      event.params.amount
    );
  }

  budget.save();
}

export function handleFungibleBudgetRemoved(
  event: FungibleBudgetRemovedEvent
): void {
  const id = getBudgetId(event.address, event.params.currency);

  let entity = Budget.load(id);

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

    const id = getUserBalanceId(receiverAddress, currency, event.address);

    let userBalance = UserBalance.load(id);

    if (userBalance == null) {
      userBalance = new UserBalance(id);

      userBalance.account = receiverAddress.toHexString();
      userBalance.projectContractAddress = event.address;
      userBalance.availableToClaim = amounts[index];
      userBalance.currency = currency;
      userBalance.claimed = BigInt.fromI32(0);
    } else {
      userBalance.availableToClaim = userBalance.availableToClaim.plus(
        amounts[index]
      );
    }

    userBalance.save();
  }

  const projectBudgetId = getBudgetId(event.address, currency);
  const projectBudget = Budget.load(projectBudgetId);

  if (projectBudget != null) {
    projectBudget.amount = projectBudget.amount.minus(event.params.totalAmount);
    projectBudget.remainingBudgetPercentage = projectBudget.amount.div(
      projectBudget.remainingBudgetReferenceAmount
    );
  }
}

export function handleClaimed(event: ClaimedEvent): void {
  const id = getUserBalanceId(
    event.params.account,
    event.params.currency,
    event.address
  );

  let userBalance = UserBalance.load(id);

  if (userBalance != null) {
    userBalance.availableToClaim = userBalance.availableToClaim.minus(
      event.params.amount
    );
    userBalance.claimed = userBalance.claimed.plus(event.params.amount);

    userBalance.save();
  }
}
