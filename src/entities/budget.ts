import { Address, BigInt, dataSource, log } from "@graphprotocol/graph-ts";
import { Budget } from "../../generated/schema";
import { getBudgetId } from "../utils";

class Chain {
  name: string;
  chainId: i32;
}

const chains = new Array<Chain>();

chains.push({ name: "mumbai", chainId: 80001 });
chains.push({ name: "goerli", chainId: 5 });
chains.push({ name: "matic", chainId: 137 });
chains.push({ name: "base", chainId: 8453 });
chains.push({ name: "optimism", chainId: 10 });
chains.push({ name: "arbitrum-one", chainId: 42161 });
chains.push({ name: "bsc", chainId: 56 });
chains.push({ name: "base-sepolia", chainId: 84532 });
chains.push({ name: "zksync-era", chainId: 324 });
chains.push({ name: "mode-mainnet", chainId: 34443 });
chains.push({ name: "abstract-mainnet", chainId: 2741 });

export function getOrCreateBudget(
  projectAddress: Address,
  currency: Address
): Budget {
  const id = getBudgetId(projectAddress, currency);
  let budget = Budget.load(id);

  if (budget == null) {
    const filteredChains = chains.filter((chain) => {
      return chain.name == dataSource.network();
    });

    if (filteredChains.length === 0) {
      log.error(`getOrCreateBudget: could not determine chain from network`, [
        dataSource.network(),
      ]);
    }

    const chainId = filteredChains[0].chainId;

    budget = new Budget(id);

    budget.owner = projectAddress.toHexString();
    budget.amount = BigInt.fromI32(0);
    budget.currency = currency;
    budget.remainingBudgetReferenceAmount = BigInt.fromI32(0);
    budget.chainId = chainId;
    log.info("Updating budget with network: {}", [chainId.toString()]);
  }

  log.info("New Budget with id: {}", [budget.id.toString()]);

  budget.save();
  return budget as Budget;
}
