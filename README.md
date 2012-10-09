FNMGroupSecurity
============

A FluxNode Mixin to provide Group Based User Security

## Functions

The following functions are added to a FluxNode by this mixin

* FNMGroupSecurity_doSaveGroup
* FNMGroupSecurity_doDeleteGroup
* FNMGroupSecurity_doSaveUser
* FNMGroupSecurity_doDeleteUser
* FNMGroupSecurity_doAddUserToGroup
* FNMGroupSecurity_doRemoveUserFromGroup

## Emitted Events

The following events may be emitted by this mixin

* FNMGroupSecurity.GroupAdded
* FNMGroupSecurity.GroupUpdated
* FNMGroupSecurity.GroupDeleted
* FNMGroupSecurity.UserAdded
* FNMGroupSecurity.UserUpdated
* FNMGroupSecurity.UserDeleted
* FNMGroupSecurity.UserAddedToGroup
* FNMGroupSecurity.UserRemovedFromGroup
* FNMGroupSecurity.GroupPrivilegesUpdated
* FNMGroupSecurity.UserPrivilegesUpdated

## Listened Events

The following events are listened for by this mixin

* FNMGroupSecurity.AddGroup
* FNMGroupSecurity.UpdateGroup
* FNMGroupSecurity.DeleteGroup
* FNMGroupSecurity.AddUser
* FNMGroupSecurity.UpdatedUser
* FNMGroupSecurity.DeleteUser
* FNMGroupSecurity.AddUserToGroup
* FNMGroupSecurity.RemoveUserFromGroup
* FNMGroupSecurity.SetGroupPrivilege
* FNMGroupSecurity.SetUserPrivilege