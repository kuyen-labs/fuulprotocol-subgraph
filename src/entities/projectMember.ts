import { Address, log } from "@graphprotocol/graph-ts";
import { getProjectMemberId } from "../utils";
import { ProjectMember } from "../../generated/schema";

export function getOrCreateProjectMember(
  memberAddress: Address,
  projectAddress: Address
): ProjectMember {
  const id = getProjectMemberId(projectAddress, memberAddress);

  let member = ProjectMember.load(id);

  if (member == null) {
    member = new ProjectMember(id);

    member.address = memberAddress;
    member.project = projectAddress.toHexString();
    member.role = "admin";
  }

  log.info("New ProjectMember with id: {}", [member.id.toString()]);

  member.save();

  return member as ProjectMember;
}
