import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { AttributorFeeUpdated } from "../generated/schema"
import { AttributorFeeUpdated as AttributorFeeUpdatedEvent } from "../generated/FuulFactory/FuulFactory"
import { handleAttributorFeeUpdated } from "../src/fuul-factory"
import { createAttributorFeeUpdatedEvent } from "./fuul-factory-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let value = BigInt.fromI32(234)
    let newAttributorFeeUpdatedEvent = createAttributorFeeUpdatedEvent(value)
    handleAttributorFeeUpdated(newAttributorFeeUpdatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("AttributorFeeUpdated created and stored", () => {
    assert.entityCount("AttributorFeeUpdated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "AttributorFeeUpdated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "value",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
