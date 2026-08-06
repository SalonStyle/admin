import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useGetMembersQuery } from "@/lib/redux/features/members/members-api";
import { ANY_PROFESSIONAL } from "@/lib/constant";
import { Check, Shuffle } from "lucide-react";
import { cn } from "@/lib/utils";
import { getPaginatedList } from "@/lib/api/list-query";
import { Skeleton } from "@/components/ui/skeleton";

export default function ServiceProfessionalModal({
  isOpen,
  onClose,
  service,
  selectedProfessionalId,
  onSelect,
}) {
  const { data: membersData, isFetching: isLoadingMembers } = useGetMembersQuery(
    { limit: 100, service_id: service?.id },
    { skip: !isOpen || !service?.id }
  );
  const { items: members } = getPaginatedList(membersData);

  const handleSelect = (memberId) => {
    onSelect(service.id, memberId);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] h-[80vh] flex flex-col p-6">
        <DialogTitle className="text-xl font-bold shrink-0">{service?.name}</DialogTitle>
        <div className="mt-4 space-y-3 flex-1 overflow-y-auto p-1 min-h-0">
          {/* Any Professional Option */}
          <button
            onClick={() => handleSelect(ANY_PROFESSIONAL.id)}
            className={cn(
              "w-full flex items-center justify-between p-4 rounded-xl border text-left transition-colors",
              selectedProfessionalId === ANY_PROFESSIONAL.id
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "border-gray-200 hover:border-primary/20 hover:bg-gray-50",
            )}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Shuffle className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {ANY_PROFESSIONAL.name}
                </p>
                <p className="text-sm text-gray-500">
                  {ANY_PROFESSIONAL.subtitle}
                </p>
              </div>
            </div>
            {selectedProfessionalId === ANY_PROFESSIONAL.id && (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="h-4 w-4" />
              </div>
            )}
          </button>

          {/* Members Options */}
          {isLoadingMembers ? (
            <>
              <Skeleton className="h-[82px] w-full rounded-xl" />
              <Skeleton className="h-[82px] w-full rounded-xl" />
              <Skeleton className="h-[82px] w-full rounded-xl" />
            </>
          ) : members.map((member) => (
            <button
              key={member.id}
              onClick={() => handleSelect(member.id)}
              className={cn(
                "w-full flex items-center justify-between p-4 rounded-xl border text-left transition-colors",
                selectedProfessionalId === member.id
                  ? "border-purple-600 bg-purple-50/30 ring-1 ring-purple-600"
                  : "border-gray-200 hover:border-purple-200 hover:bg-gray-50",
              )}
            >
              <div className="flex items-center gap-4">
                {member.profile_photo_url ? (
                  <img
                    src={member.profile_photo_url}
                    alt={member.display_name}
                    className="h-12 w-12 rounded-full object-cover border"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-600 font-medium">
                    {member.display_name?.charAt(0)?.toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900">
                    {member.display_name}
                  </p>
                  <p className="text-sm text-gray-500">Professional</p>
                </div>
              </div>
              {selectedProfessionalId === member.id && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-4 w-4" />
                </div>
              )}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
