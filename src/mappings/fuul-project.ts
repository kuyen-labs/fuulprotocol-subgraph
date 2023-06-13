import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { Budget, Project, User, UserBalance } from "../../generated/schema";
import {
  FungibleBudgetDeposited as FungibleBudgetDepositedEvent,
  FungibleBudgetRemoved as FungibleBudgetRemovedEvent,
  Attributed as AttributedEvent,
  Claimed as ClaimedEvent,
} from "../../generated/templates/FuulProject/FuulProject";
import { getBudgetId, getUserBalanceId } from "../utils";

function saveBudgetRemoved(event: FungibleBudgetRemovedEvent): string {
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
    budget.amount = budget.amount.minus(event.params.amount);
    budget.remainingBudgetReferenceAmount = budget.remainingBudgetReferenceAmount.minus(
      event.params.amount
    );
    budget.remainingBudgetPercentage = budget.amount.div(
      budget.remainingBudgetReferenceAmount
    );
  }

  budget.save();

  return id;
}

function saveBudgetDeposited(event: FungibleBudgetDepositedEvent): string {
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
    budget.remainingBudgetPercentage = budget.amount.div(
      budget.remainingBudgetReferenceAmount
    );
  }

  budget.save();

  return id;
}

function updateBudgets(project: Project, budgetId: string): string[] {
  let updatedBudgets: string[] = [];

  for (let i = 0; i < project.budgets.length; i++) {
    if (project.budgets[i] != budgetId) {
      updatedBudgets.push(project.budgets[i]);
    }
  }

  updatedBudgets.push(budgetId);

  return updatedBudgets;
}

function updateBalances(user: User, balanceId: string): string[] {
  let updatedBalances: string[] = [];

  for (let i = 0; i < user.balances.length; i++) {
    if (user.balances[i] != balanceId) {
      updatedBalances.push(user.balances[i]);
    }
  }

  updatedBalances.push(balanceId);

  return updatedBalances;
}

export function handleFungibleBudgetDeposited(
  event: FungibleBudgetDepositedEvent
): void {
  const projectId = event.address.toHexString();
  const budgetId = saveBudgetDeposited(event);

  let project = Project.load(projectId) as Project;

  project.budgets = updateBudgets(project, budgetId);

  project.save();
}

export function handleFungibleBudgetRemoved(
  event: FungibleBudgetRemovedEvent
): void {
  const projectId = event.address.toHexString();
  const budgetId = saveBudgetRemoved(event);

  let project = Project.load(projectId) as Project;

  project.budgets = updateBudgets(project, budgetId);

  project.save();
}

function saveUserBalance(
  receiverAddress: Address,
  amount: BigInt,
  currency: Address,
  projectContractAddress: Address
): string {
  const id = getUserBalanceId(
    receiverAddress,
    currency,
    projectContractAddress
  );

  let userBalance = UserBalance.load(id);

  if (userBalance == null) {
    userBalance = new UserBalance(id);

    userBalance.account = receiverAddress;
    userBalance.projectContractAddress = projectContractAddress;
    userBalance.availableToClaim = amount;
    userBalance.currency = currency;
    userBalance.claimed = BigInt.fromI32(0);
  } else {
    userBalance.availableToClaim = userBalance.availableToClaim.plus(amount);
  }

  userBalance.save();

  return id;
}

export function handleAttributed(event: AttributedEvent): void {
  const receivers = event.params.receivers;
  const amounts = event.params.amounts;
  const currency = event.params.currency;

  for (let index = 0; index < receivers.length; index++) {
    const receiverAddress = receivers[index];
    const userId = receiverAddress.toHexString();
    const balanceId = saveUserBalance(
      receiverAddress,
      amounts[index],
      currency,
      event.address
    );

    let user = User.load(userId);

    if (user == null) {
      user = new User(userId);

      user.account = receiverAddress;
      user.balances = user.balances.concat([balanceId]);
    } else {
      user.balances = updateBalances(user, balanceId);
    }

    user.save();
  }

  const projectBudgetId = getBudgetId(event.address, currency);
  const projectBudget = Budget.load(projectBudgetId) as Budget;

  projectBudget.amount = projectBudget.amount.minus(event.params.totalAmount);
  projectBudget.remainingBudgetPercentage = projectBudget.amount.div(
    projectBudget.remainingBudgetReferenceAmount
  );

  projectBudget.save();
}

export function handleClaimed(event: ClaimedEvent): void {
  const id = event.params.account.toHexString();

  const balanceId = saveUserBalance(
    event.params.account,
    event.params.amount,
    event.params.currency,
    event.address
  );

  let user = User.load(id) as User;

  user.balances = updateBalances(user, balanceId);

  user.save();
}
