import {
  assert,
  describe,
  test,
  clearStore,
  afterAll,
} from "matchstick-as/assembly/index";
import { Address, BigInt } from "@graphprotocol/graph-ts";
import { handleProjectCreated } from "../src/mappings/fuul-factory";
import { createProjectCreatedEvent } from "./fuul-factory-utils";

describe("Describe entity assertions", () => {
  afterAll(() => {
    clearStore();
  });

  test("ProjectCreatedEvent created and stored", () => {
    const deployedAddress = Address.fromString(
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a"
    );
    const eventSigner = Address.fromString(
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2b"
    );
    const clientFeeCollector = Address.fromString(
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2c"
    );
    const uri = "https://example.com";
    const newProjectEvent = createProjectCreatedEvent(
      BigInt.fromI32(1),
      deployedAddress,
      eventSigner,
      uri,
      clientFeeCollector
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
