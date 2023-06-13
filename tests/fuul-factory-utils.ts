import { newMockEvent } from "matchstick-as";
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts";
import {
  AttributorFeeUpdated,
  ClientFeeUpdated,
  CurrencyAdded,
  CurrencyRemoved,
  NftFeeCurrencyUpdated,
  NftFixedFeeUpdated,
  ProjectCooldownUpdated,
  ProjectCreated,
  ProjectRemovePeriodUpdated,
  ProtocolFeeCollectorUpdated,
  ProtocolFeeUpdated,
} from "../generated/FuulFactory/FuulFactory";

export function createAttributorFeeUpdatedEvent(
  value: BigInt
): AttributorFeeUpdated {
  let attributorFeeUpdatedEvent = changetype<AttributorFeeUpdated>(
    newMockEvent()
  );

  attributorFeeUpdatedEvent.parameters = new Array();

  attributorFeeUpdatedEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  );

  return attributorFeeUpdatedEvent;
}

export function createClientFeeUpdatedEvent(value: BigInt): ClientFeeUpdated {
  let clientFeeUpdatedEvent = changetype<ClientFeeUpdated>(newMockEvent());

  clientFeeUpdatedEvent.parameters = new Array();

  clientFeeUpdatedEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  );

  return clientFeeUpdatedEvent;
}

export function createCurrencyAddedEvent(
  newCurrency: Address,
  tokenType: i32
): CurrencyAdded {
  let currencyAddedEvent = changetype<CurrencyAdded>(newMockEvent());

  currencyAddedEvent.parameters = new Array();

  currencyAddedEvent.parameters.push(
    new ethereum.EventParam(
      "newCurrency",
      ethereum.Value.fromAddress(newCurrency)
    )
  );
  currencyAddedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenType",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(tokenType))
    )
  );

  return currencyAddedEvent;
}

export function createCurrencyRemovedEvent(
  newCurrency: Address,
  tokenType: i32
): CurrencyRemoved {
  let currencyRemovedEvent = changetype<CurrencyRemoved>(newMockEvent());

  currencyRemovedEvent.parameters = new Array();

  currencyRemovedEvent.parameters.push(
    new ethereum.EventParam(
      "newCurrency",
      ethereum.Value.fromAddress(newCurrency)
    )
  );
  currencyRemovedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenType",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(tokenType))
    )
  );

  return currencyRemovedEvent;
}

export function createNftFeeCurrencyUpdatedEvent(
  newCurrency: Address
): NftFeeCurrencyUpdated {
  let nftFeeCurrencyUpdatedEvent = changetype<NftFeeCurrencyUpdated>(
    newMockEvent()
  );

  nftFeeCurrencyUpdatedEvent.parameters = new Array();

  nftFeeCurrencyUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newCurrency",
      ethereum.Value.fromAddress(newCurrency)
    )
  );

  return nftFeeCurrencyUpdatedEvent;
}

export function createNftFixedFeeUpdatedEvent(
  value: BigInt
): NftFixedFeeUpdated {
  let nftFixedFeeUpdatedEvent = changetype<NftFixedFeeUpdated>(newMockEvent());

  nftFixedFeeUpdatedEvent.parameters = new Array();

  nftFixedFeeUpdatedEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  );

  return nftFixedFeeUpdatedEvent;
}

export function createProjectCooldownUpdatedEvent(
  value: BigInt
): ProjectCooldownUpdated {
  let projectCooldownUpdatedEvent = changetype<ProjectCooldownUpdated>(
    newMockEvent()
  );

  projectCooldownUpdatedEvent.parameters = new Array();

  projectCooldownUpdatedEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  );

  return projectCooldownUpdatedEvent;
}

export function createProjectCreatedEvent(
  projectId: BigInt,
  deployedAddress: Address,
  eventSigner: Address,
  projectInfoURI: string,
  clientFeeCollector: Address
): ProjectCreated {
  let projectCreatedEvent = changetype<ProjectCreated>(newMockEvent());

  projectCreatedEvent.parameters = new Array();

  projectCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "projectId",
      ethereum.Value.fromUnsignedBigInt(projectId)
    )
  );
  projectCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "deployedAddress",
      ethereum.Value.fromAddress(deployedAddress)
    )
  );
  projectCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "eventSigner",
      ethereum.Value.fromAddress(eventSigner)
    )
  );
  projectCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "projectInfoURI",
      ethereum.Value.fromString(projectInfoURI)
    )
  );
  projectCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "clientFeeCollector",
      ethereum.Value.fromAddress(clientFeeCollector)
    )
  );

  return projectCreatedEvent;
}

export function createProjectRemovePeriodUpdatedEvent(
  value: BigInt
): ProjectRemovePeriodUpdated {
  let projectRemovePeriodUpdatedEvent = changetype<ProjectRemovePeriodUpdated>(
    newMockEvent()
  );

  projectRemovePeriodUpdatedEvent.parameters = new Array();

  projectRemovePeriodUpdatedEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  );

  return projectRemovePeriodUpdatedEvent;
}

export function createProtocolFeeCollectorUpdatedEvent(
  newCollector: Address
): ProtocolFeeCollectorUpdated {
  let protocolFeeCollectorUpdatedEvent = changetype<
    ProtocolFeeCollectorUpdated
  >(newMockEvent());

  protocolFeeCollectorUpdatedEvent.parameters = new Array();

  protocolFeeCollectorUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newCollector",
      ethereum.Value.fromAddress(newCollector)
    )
  );

  return protocolFeeCollectorUpdatedEvent;
}

export function createProtocolFeeUpdatedEvent(
  value: BigInt
): ProtocolFeeUpdated {
  let protocolFeeUpdatedEvent = changetype<ProtocolFeeUpdated>(newMockEvent());

  protocolFeeUpdatedEvent.parameters = new Array();

  protocolFeeUpdatedEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  );

  return protocolFeeUpdatedEvent;
}
