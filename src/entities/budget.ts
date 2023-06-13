import { Address, BigInt } from "@graphprotocol/graph-ts";
import { Budget } from "../../generated/schema";
import { getBudgetId } from "../utils";

export function getOrCreateBudget(
  projectAddress: Address,
  currency: Address
): Budget {
  const id = getBudgetId(projectAddress, currency);
  let budget = Budget.load(id);

  if (budget == null) {
    budget = new Budget(id);

    budget.owner = projectAddress.toHexString();

    budget.save();
  }

  return budget as Budget;
}
