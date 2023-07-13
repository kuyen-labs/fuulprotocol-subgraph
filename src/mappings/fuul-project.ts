import { BigInt, log } from "@graphprotocol/graph-ts";
import {
  FungibleBudgetDeposited as FungibleBudgetDepositedEvent,
  FungibleBudgetRemoved as FungibleBudgetRemovedEvent,
  Attributed as AttributedEvent,
  Claimed as ClaimedEvent,
  AppliedToRemove as AppliedToRemoveEvent,
} from "../../generated/templates/FuulProject/FuulProject";
import { getOrCreateUser } from "../entities/user";
import { getOrCreateUserBalance } from "../entities/userBalance";
import { getOrCreateBudget } from "../entities/budget";
import { getOrCreateProject } from "../entities/project";

export function handleFungibleBudgetDeposited(
  event: FungibleBudgetDepositedEvent
): void {
  log.info(
    "Handle budget deposited with contract address: {} and currency: {}",
    [event.address.toHexString(), event.params.currency.toHexString()]
  );

  let budget = getOrCreateBudget(event.address, event.params.currency);

  log.info("Updating budget with id: {}", [budget.id.toString()]);
  log.info("Current budget amount: {}", [budget.amount.toString()]);

  budget.amount = budget.amount.plus(event.params.amount);
  budget.currency = event.params.currency;
  budget.remainingBudgetReferenceAmount = budget.remainingBudgetReferenceAmount.plus(
    event.params.amount
  );

  budget.save();

  log.info("New budget amount: {}", [budget.amount.toString()]);
}

export function handleFungibleBudgetRemoved(
  event: FungibleBudgetRemovedEvent
): void {
  log.info("Handle budget remove with contract address: {} and currency: {}", [
    event.address.toHexString(),
    event.params.currency.toHexString(),
  ]);

  let budget = getOrCreateBudget(event.address, event.params.currency);

  log.info("Updating budget with id: {}", [budget.id.toString()]);
  log.info("Current budget amount: {}", [budget.amount.toString()]);

  budget.amount = budget.amount.minus(event.params.amount);
  budget.remainingBudgetReferenceAmount = budget.remainingBudgetReferenceAmount.minus(
    event.params.amount
  );

  budget.save();

  log.info("New budget amount: {}", [budget.amount.toString()]);
}

export function handleAttributed(event: AttributedEvent): void {
  const receivers = event.params.receivers;
  const amounts = event.params.amounts;
  const currency = event.params.currency;

  for (let index = 0; index < receivers.length; index++) {
    const receiverAddress = receivers[index];

    log.info("Handle attribution with receiver address: {}, amount: {}", [
      receiverAddress.toHexString(),
      amounts[index].toString(),
    ]);

    let user = getOrCreateUser(receiverAddress);
    let userBalance = getOrCreateUserBalance(
      receiverAddress,
      currency,
      event.address
    );

    log.info("User: {} > current availableToClaim: {}", [
      user.id,
      userBalance.availableToClaim.toString(),
    ]);

    userBalance.availableToClaim = userBalance.availableToClaim.plus(
      amounts[index]
    );

    user.save();
    userBalance.save();

    log.info("User: {} > new availableToClaim: {}", [
      user.id,
      userBalance.availableToClaim.toString(),
    ]);
  }

  const projectBudget = getOrCreateBudget(event.address, currency);

  projectBudget.amount = projectBudget.amount.minus(event.params.totalAmount);

  projectBudget.save();
}

export function handleClaimed(event: ClaimedEvent): void {
  let user = getOrCreateUser(event.params.account);
  let userBalance = getOrCreateUserBalance(
    event.params.account,
    event.params.currency,
    event.address
  );

  log.info("User: {} > current availableToClaim: {}", [
    user.id,
    userBalance.availableToClaim.toString(),
  ]);
  log.info("User: {} > current claimed: {}", [
    user.id,
    userBalance.claimed.toString(),
  ]);

  userBalance.availableToClaim = userBalance.availableToClaim.minus(
    event.params.amount
  );
  userBalance.claimed = userBalance.claimed.plus(event.params.amount);

  user.save();
  userBalance.save();

  log.info("User: {} > new availableToClaim: {}", [
    user.id,
    userBalance.availableToClaim.toString(),
  ]);

  log.info("User: {} > new claimed: {}", [
    user.id,
    userBalance.claimed.toString(),
  ]);
}

export function handleAppliedToRemove(event: AppliedToRemoveEvent): void {
  let project = getOrCreateProject(event.address);

  project.lastRemovalApplication = event.params.timestamp;

  project.save();
}
