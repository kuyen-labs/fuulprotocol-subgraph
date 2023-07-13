import { log } from "@graphprotocol/graph-ts";
import {
  AttributorFeeUpdated as AttributorFeeUpdatedEvent,
  ClientFeeUpdated as ClientFeeUpdatedEvent,
  CurrencyAdded as CurrencyAddedEvent,
  CurrencyRemoved as CurrencyRemovedEvent,
  NftFeeCurrencyUpdated as NftFeeCurrencyUpdatedEvent,
  NftFixedFeeUpdated as NftFixedFeeUpdatedEvent,
  ProjectCooldownUpdated as ProjectCooldownUpdatedEvent,
  ProjectCreated as ProjectCreatedEvent,
  ProjectRemovePeriodUpdated as ProjectRemovePeriodUpdatedEvent,
  ProtocolFeeCollectorUpdated as ProtocolFeeCollectorUpdatedEvent,
  ProtocolFeeUpdated as ProtocolFeeUpdatedEvent,
} from "../../generated/FuulFactory/FuulFactory";
import {
  AttributorFeeUpdated,
  ClientFeeUpdated,
  CurrencyAdded,
  CurrencyRemoved,
  NftFeeCurrencyUpdated,
  NftFixedFeeUpdated,
  ProjectCooldownUpdated,
  ProjectRemovePeriodUpdated,
  ProtocolFeeCollectorUpdated,
  ProtocolFeeUpdated,
} from "../../generated/schema";

import { FuulProject } from "../../generated/templates";
import { getOrCreateProject } from "../entities/project";
import { getOrCreateProjectMember } from "../entities/projectMember";

export function handleAttributorFeeUpdated(
  event: AttributorFeeUpdatedEvent
): void {
  let entity = new AttributorFeeUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.value = event.params.value;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleClientFeeUpdated(event: ClientFeeUpdatedEvent): void {
  let entity = new ClientFeeUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.value = event.params.value;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleCurrencyAdded(event: CurrencyAddedEvent): void {
  let entity = new CurrencyAdded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.newCurrency = event.params.newCurrency;
  entity.tokenType = event.params.tokenType;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleCurrencyRemoved(event: CurrencyRemovedEvent): void {
  let entity = new CurrencyRemoved(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.newCurrency = event.params.newCurrency;
  entity.tokenType = event.params.tokenType;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleNftFeeCurrencyUpdated(
  event: NftFeeCurrencyUpdatedEvent
): void {
  let entity = new NftFeeCurrencyUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.newCurrency = event.params.newCurrency;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleNftFixedFeeUpdated(event: NftFixedFeeUpdatedEvent): void {
  let entity = new NftFixedFeeUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.value = event.params.value;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleProjectCooldownUpdated(
  event: ProjectCooldownUpdatedEvent
): void {
  let entity = new ProjectCooldownUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.value = event.params.value;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleProjectCreated(event: ProjectCreatedEvent): void {
  log.info("Creating project with address => {}", [
    event.params.deployedAddress.toHexString(),
  ]);

  const project = getOrCreateProject(
    event.params.deployedAddress,
    event.params
  );
  const projectMember = getOrCreateProjectMember(
    event.transaction.from,
    event.params.deployedAddress
  );

  // Start indexing the new project contract; `event.params.deployedAddress` is the
  // address of the new deployed project contract
  FuulProject.create(event.params.deployedAddress);

  project.save();
  projectMember.save();
}

export function handleProjectRemovePeriodUpdated(
  event: ProjectRemovePeriodUpdatedEvent
): void {
  let entity = new ProjectRemovePeriodUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.value = event.params.value;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleProtocolFeeCollectorUpdated(
  event: ProtocolFeeCollectorUpdatedEvent
): void {
  let entity = new ProtocolFeeCollectorUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.newCollector = event.params.newCollector;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleProtocolFeeUpdated(event: ProtocolFeeUpdatedEvent): void {
  let entity = new ProtocolFeeUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.value = event.params.value;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
