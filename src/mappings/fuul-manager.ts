import { Address, log, store } from "@graphprotocol/graph-ts";
import {
  RoleGranted as RoleGrantedEvent,
  RoleRevoked as RoleRevokedEvent,
} from "../../generated/FuulManager/FuulManager";
import { getOrCreateProjectMember } from "../entities/projectMember";
import { ADDRESS_ZERO } from "../constants";

export function handleRoleGranted(event: RoleGrantedEvent): void {
  const role = event.params.role.toHexString();
  const zeroAddress = Address.fromString(ADDRESS_ZERO).toHexString();

  log.info("Handle RoleGranted event for address: {} with Role: {}", [
    event.params.account.toHexString(),
    role,
  ]);

  if (role != zeroAddress) {
    log.info("Role is not ADDRESS_ZERO, skipping. Role: {}, ADDRESS_ZERO: {}", [
      role,
      zeroAddress,
    ]);
    return;
  }
}

export function handleRoleRevoked(event: RoleRevokedEvent): void {
  const role = event.params.role.toHexString();
  const zeroAddress = Address.fromString(ADDRESS_ZERO).toHexString();

  log.info("Handle RoleRevoked event for address: {} with Role: {}", [
    event.params.account.toHexString(),
    role,
  ]);

  if (role != ADDRESS_ZERO) {
    log.info("Role is not ADDRESS_ZERO, skipping. Role: {}, ADDRESS_ZERO: {}", [
      role,
      zeroAddress,
    ]);
    return;
  }

  let projectMember = getOrCreateProjectMember(
    event.params.account,
    event.address
  );

  store.remove("ProjectMember", projectMember.id);
}
