import {
  assert,
  describe,
  test,
  clearStore,
  afterAll,
} from "matchstick-as/assembly/index";
import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import {
  createAttributedEvent,
  createClaimedEvent,
  createFungibleTokenBudgetDepositedEvent,
} from "./fuul-project-utils";
import {
  handleAttributed,
  handleClaimed,
  handleFungibleBudgetDeposited,
} from "../src/mappings/fuul-project";
import { ADDRESSES, CURRENCIES } from "../src/constants";
import { getBudgetId, getUserBalanceId } from "../src/utils";

const TRANSACTION_CURRENCY = CURRENCIES[0];
const INITIAL_BUDGET = BigInt.fromI32(1000);
const PROJECT_ADDRESS = ADDRESSES[6];

describe("Describe entity assertions", () => {
  afterAll(() => {
    clearStore();
  });

  test("Handle budget deposited > Project budget should be 1000", () => {
    const newFungibleBudgetDepositedEvent = createFungibleTokenBudgetDepositedEvent(
      PROJECT_ADDRESS,
      INITIAL_BUDGET,
      TRANSACTION_CURRENCY
    );

    handleFungibleBudgetDeposited(newFungibleBudgetDepositedEvent);

    assert.entityCount("Budget", 1);

    const budgetId = getBudgetId(
      newFungibleBudgetDepositedEvent.address,
      TRANSACTION_CURRENCY
    );

    assert.fieldEquals("Budget", budgetId, "id", budgetId);
    assert.fieldEquals(
      "Budget",
      budgetId,
      "owner",
      newFungibleBudgetDepositedEvent.address.toHexString()
    );
    assert.fieldEquals("Budget", budgetId, "amount", INITIAL_BUDGET.toString());
    assert.fieldEquals(
      "Budget",
      budgetId,
      "remainingBudgetReferenceAmount",
      INITIAL_BUDGET.toString()
    );
  });

  test("Handle attributed > Should decrease project budget in 15 and create a new UserBalances for each receiver address", () => {
    const receivers = [
      ADDRESSES[0],
      ADDRESSES[1],
      ADDRESSES[2],
      ADDRESSES[3],
      ADDRESSES[4],
    ];
    const amounts = [
      BigInt.fromI32(1),
      BigInt.fromI32(2),
      BigInt.fromI32(3),
      BigInt.fromI32(4),
      BigInt.fromI32(5),
    ];
    const totalAmount = BigInt.fromI32(15);
    const proof = Bytes.fromHexString(
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2c"
    );

    const newAttributedEvent = createAttributedEvent(
      TRANSACTION_CURRENCY,
      totalAmount,
      receivers,
      amounts,
      proof
    );

    handleAttributed(newAttributedEvent);

    const projectBudgetId = getBudgetId(
      newAttributedEvent.address,
      TRANSACTION_CURRENCY
    );

    assert.entityCount("Budget", 1);
    assert.fieldEquals("Budget", projectBudgetId, "id", projectBudgetId);
    assert.fieldEquals(
      "Budget",
      projectBudgetId,
      "owner",
      newAttributedEvent.address.toHexString()
    );

    assert.fieldEquals(
      "Budget",
      projectBudgetId,
      "amount",
      INITIAL_BUDGET.minus(totalAmount).toString()
    );

    assert.entityCount("UserBalance", receivers.length);
    assert.entityCount("User", receivers.length);

    for (let i = 0; i < receivers.length; i++) {
      const receiverBalanceId = getUserBalanceId(
        receivers[i],
        TRANSACTION_CURRENCY,
        newAttributedEvent.address
      );

      assert.fieldEquals(
        "UserBalance",
        receiverBalanceId,
        "owner",
        receivers[i].toHexString()
      );

      assert.fieldEquals(
        "UserBalance",
        receiverBalanceId,
        "project",
        newAttributedEvent.address.toHexString()
      );

      assert.fieldEquals(
        "UserBalance",
        receiverBalanceId,
        "availableToClaim",
        amounts[i].toString()
      );

      assert.fieldEquals("UserBalance", receiverBalanceId, "claimed", "0");
    }
  });

  test("Handle claimed > Should increase claimed amount in UserBalance", () => {
    const newClaimedEvent = createClaimedEvent(
      ADDRESSES[0],
      TRANSACTION_CURRENCY,
      BigInt.fromI32(1)
    );

    handleClaimed(newClaimedEvent);

    const userBalanceId = getUserBalanceId(
      ADDRESSES[0],
      TRANSACTION_CURRENCY,
      newClaimedEvent.address
    );

    assert.fieldEquals("UserBalance", userBalanceId, "claimed", "1");
    assert.fieldEquals("UserBalance", userBalanceId, "availableToClaim", "0");
  });
});
