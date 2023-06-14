import {
  assert,
  describe,
  test,
  clearStore,
  afterAll,
} from "matchstick-as/assembly/index";
import { BigInt } from "@graphprotocol/graph-ts";
import { handleProjectCreated } from "../src/mappings/fuul-factory";
import { createProjectCreatedEvent } from "./fuul-factory-utils";
import { ADDRESSES } from "../src/constants";

describe("Describe entity assertions", () => {
  afterAll(() => {
    clearStore();
  });

  test("ProjectCreatedEvent created and stored", () => {
    const deployedAddress = ADDRESSES[0];
    const uri = "https://example.com";
    const newProjectEvent = createProjectCreatedEvent(
      BigInt.fromI32(1),
      deployedAddress,
      ADDRESSES[1],
      uri,
      ADDRESSES[2]
    );
    handleProjectCreated(newProjectEvent);

    assert.entityCount("Project", 1);
    assert.fieldEquals(
      "Project",
      deployedAddress.toHexString(),
      "deployedAddress",
      deployedAddress.toHexString()
    );
  });
});
