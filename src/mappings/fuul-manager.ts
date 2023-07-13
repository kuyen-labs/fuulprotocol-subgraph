import { log, store } from "@graphprotocol/graph-ts";
import {
  RoleGranted as RoleGrantedEvent,
  RoleRevoked as RoleRevokedEvent,
} from "../../generated/FuulManager/FuulManager";
import { getOrCreateProjectMember } from "../entities/projectMember";
import { ADDRESS_ZERO } from "../constants";

export function handleRoleGranted(event: RoleGrantedEvent): void {
  log.info("Handle RoleGranted event for address: {} with Role: {}", [
    event.params.account.toHexString(),
    event.params.role.toString(),
  ]);

  if (event.params.role.toString() != ADDRESS_ZERO) {
    log.info("Role is not ADDRESS_ZERO, skipping", []);
    return;
  }

  let projectMember = getOrCreateProjectMember(
    event.params.account,
    event.address
  );

  projectMember.role = event.params.role.toString();

  projectMember.save();
}

export function handleRoleRevoked(event: RoleRevokedEvent): void {
  log.info("Handle RoleRevoked event for address: {} with Role: {}", [
    event.params.account.toHexString(),
    event.params.role.toString(),
  ]);

  if (event.params.role.toString() != ADDRESS_ZERO) {
    log.info("Role is not ADDRESS_ZERO, skipping", []);
    return;
  }

  let projectMember = getOrCreateProjectMember(
    event.params.account,
    event.address
  );

  store.remove("ProjectMember", projectMember.id);
}
