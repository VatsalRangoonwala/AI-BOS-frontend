"use client";

import React, { useCallback, useEffect, useState, useTransition } from "react";
import { Mail, Plus, ShieldCheck, UserCheck, UserMinus, UserPlus, Users, Loader2 } from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useToast } from "@/components/providers/toast-provider";
import { apiClient, type MemberDetail, ApiError } from "@/lib/api-client";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { formatDate, getInitials } from "@/lib/utils";

export function TeamSettingsView() {
  const activeBusiness = useAuthStore((s) => s.activeBusiness);
  const user = useAuthStore((s) => s.user);
  const { toast } = useToast();
  const [members, setMembers] = useState<MemberDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"owner" | "staff" | "admin">("staff");
  const [inviting, setInviting] = useState(false);
  const [, startTransition] = useTransition();

  const businessId = activeBusiness?.businessId;
  const isOwner = activeBusiness?.role === "owner";

  const loadMembers = useCallback(() => {
    if (!businessId) {
      setMembers([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    apiClient.businesses
      .listMembers(businessId)
      .then((data) => {
        setMembers(data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch team members:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [businessId]);

  useEffect(() => {
    let mounted = true;
    Promise.resolve().then(() => {
      if (mounted) loadMembers();
    });
    return () => {
      mounted = false;
    };
  }, [loadMembers]);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!businessId || !inviteEmail.trim()) return;

    setInviting(true);
    try {
      await apiClient.businesses.inviteMember(businessId, {
        email: inviteEmail.trim().toLowerCase(),
        role: inviteRole,
      });
      toast({
        title: "Invitation sent",
        description: `Invited ${inviteEmail} as ${inviteRole}.`,
        variant: "success",
      });
      setInviteEmail("");
      setInviteRole("staff");
      setInviteOpen(false);
      loadMembers();
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        toast({
          title: "Invitation failed",
          description: err.message,
          variant: "error",
        });
      } else {
        toast({
          title: "Invitation failed",
          description: "Could not send invitation. Make sure the user has registered.",
          variant: "error",
        });
      }
    } finally {
      setInviting(false);
    }
  }

  async function handleStatusToggle(member: MemberDetail) {
    if (!businessId || !isOwner) return;
    const newStatus = member.status === "active" ? "suspended" : "active";

    try {
      await apiClient.businesses.updateMember(businessId, member.id, {
        status: newStatus,
      });
      toast({
        title: `Member ${newStatus}`,
        description: `${member.user.fullName}'s status is now ${newStatus}.`,
        variant: "success",
      });
      startTransition(() => {
        loadMembers();
      });
    } catch (err: unknown) {
      toast({
        title: "Update failed",
        description: err instanceof Error ? err.message : "Could not update status.",
        variant: "error",
      });
    }
  }

  async function handleRemoveMember(member: MemberDetail) {
    if (!businessId || !isOwner) return;
    if (confirm(`Remove ${member.user.fullName} from this business?`)) {
      try {
        await apiClient.businesses.removeMember(businessId, member.id);
        toast({
          title: "Member removed",
          description: `${member.user.fullName} has been removed from this business.`,
          variant: "success",
        });
        loadMembers();
      } catch (err: unknown) {
        toast({
          title: "Failed to remove member",
          description: err instanceof Error ? err.message : "Could not remove member.",
          variant: "error",
        });
      }
    }
  }

  return (
    <div className="space-y-5">
      <Card className="border-primary/20 bg-primary-soft/30">
        <CardContent className="flex flex-col gap-4 pt-5 sm:flex-row sm:items-center">
          <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Users className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="font-semibold">
              Team management for {activeBusiness?.businessName || "your workspace"}
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Invite collaborators, assign roles, and control access permissions across your store.
            </p>
          </div>
          {isOwner ? (
            <Button leadingIcon={UserPlus} onClick={() => setInviteOpen(true)}>
              Invite member
            </Button>
          ) : (
            <Badge variant="neutral">Member role: {activeBusiness?.role || "staff"}</Badge>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Team members</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              {members.length} {members.length === 1 ? "member" : "members"} in this business
            </p>
          </div>
          {isOwner ? (
            <Button
              size="sm"
              variant="outline"
              leadingIcon={Plus}
              onClick={() => setInviteOpen(true)}
            >
              Add member
            </Button>
          ) : null}
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <div className="flex min-h-[160px] items-center justify-center">
              <Loader2 className="size-6 animate-spin text-primary" />
            </div>
          ) : members.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No team members found for this business.
            </div>
          ) : (
            members.map((member) => {
              const isCurrentUser = member.user.id === user?.id;
              const isMemberOwner = member.role === "owner";

              return (
                <article
                  key={member.id}
                  className="flex flex-col gap-3 rounded-xl border border-border p-4 sm:flex-row sm:items-center"
                >
                  <span className="grid size-10 place-items-center rounded-full bg-primary-soft text-sm font-bold text-primary">
                    {getInitials(member.user.fullName || "User")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold">{member.user.fullName}</p>
                      {isCurrentUser ? <Badge variant="primary">You</Badge> : null}
                      {isMemberOwner ? (
                        <ShieldCheck
                          className="size-4 text-primary"
                          aria-label="Business owner"
                        />
                      ) : null}
                    </div>
                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <Mail className="size-3" />
                      {member.user.email}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                    <Badge
                      variant={
                        member.status === "active"
                          ? "success"
                          : member.status === "invited"
                            ? "warning"
                            : "outline"
                      }
                    >
                      {member.status === "active"
                        ? "Active"
                        : member.status === "invited"
                          ? "Invited"
                          : "Suspended"}
                    </Badge>
                    <span className="text-xs capitalize text-muted-foreground">
                      {member.role}
                      {member.createdAt
                        ? ` · joined ${formatDate(member.createdAt, {
                            month: "short",
                            year: "numeric",
                          })}`
                        : ""}
                    </span>

                    {isOwner && !isMemberOwner && !isCurrentUser ? (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusToggle(member)}
                        >
                          {member.status === "active" ? (
                            <>
                              <UserMinus className="size-3.5" />
                              Suspend
                            </>
                          ) : (
                            <>
                              <UserCheck className="size-3.5" />
                              Activate
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-danger hover:text-danger"
                          onClick={() => handleRemoveMember(member)}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </article>
              );
            })
          )}
        </CardContent>
      </Card>

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite a new team member</DialogTitle>
            <DialogDescription>
              Enter the email address of the registered user you wish to invite to{" "}
              <strong>{activeBusiness?.businessName}</strong>.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleInvite} className="mt-4 space-y-4">
            <div>
              <label
                htmlFor="invite-email"
                className="mb-1.5 block text-xs font-semibold text-foreground"
              >
                User email address
              </label>
              <Input
                id="invite-email"
                type="email"
                required
                placeholder="colleague@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="invite-role"
                className="mb-1.5 block text-xs font-semibold text-foreground"
              >
                Role & permissions
              </label>
              <select
                id="invite-role"
                className="flex h-10 w-full rounded-md border border-input bg-card px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={inviteRole}
                onChange={(e) =>
                  setInviteRole(e.target.value as "owner" | "staff" | "admin")
                }
              >
                <option value="staff">Staff (POS, sales, inventory view)</option>
                <option value="admin">Admin (full store operations, catalogue)</option>
                <option value="owner">Co-Owner (full access and billing)</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setInviteOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={inviting} loadingText="Inviting…">
                Send invitation
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
