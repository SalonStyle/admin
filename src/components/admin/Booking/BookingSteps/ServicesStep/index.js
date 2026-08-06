import { useState, useMemo } from "react";
import { Search, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice, formatDuration, getServiceProfessionalLabel } from "@/lib/helper";
import { useGetCategoriesQuery } from "@/lib/redux/features/categories/categories-api";
import { useGetServicesQuery } from "@/lib/redux/features/services/services-api";
import { useGetMembersQuery } from "@/lib/redux/features/members/members-api";
import { ANY_PROFESSIONAL } from "@/lib/constant";
import ServiceProfessionalModal from "../../ServiceProfessionalModal";
import { getPaginatedList } from "@/lib/api/list-query";
import { Skeleton } from "@/components/ui/skeleton";

export default function ServicesStep({
  selectedServices,
  setSelectedServices,
  serviceProfessionals,
  setServiceProfessionals,
  onNext
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const [activeProfessionalModalService, setActiveProfessionalModalService] = useState(null);

  const { data: categoriesData, isFetching: isLoadingCategories } = useGetCategoriesQuery({ limit: 100 });
  const { items: categories } = getPaginatedList(categoriesData);

  const { data: servicesData, isFetching: isLoadingServices } = useGetServicesQuery({ limit: 100 });
  const { items: services } = getPaginatedList(servicesData);

  const { data: membersData, isFetching: isLoadingMembers } = useGetMembersQuery({ limit: 100 });
  const { items: members } = getPaginatedList(membersData);

  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || service.category_id === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [services, searchQuery, selectedCategory]);

  const toggleService = (service) => {
    const isSelected = selectedServices.some(s => s.id === service.id);
    if (isSelected) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
      const newProfs = { ...serviceProfessionals };
      delete newProfs[service.id];
      setServiceProfessionals(newProfs);
    } else {
      setSelectedServices([...selectedServices, service]);
      setServiceProfessionals({ ...serviceProfessionals, [service.id]: ANY_PROFESSIONAL.id });
    }
  };

  const getProfessionalDisplay = (serviceId) => {
    const profId = serviceProfessionals[serviceId] || ANY_PROFESSIONAL.id;
    if (profId === ANY_PROFESSIONAL.id) return "Any professional";
    const member = members.find(m => m.id === profId);
    return member ? member.display_name : "Any professional";
  };
  
  const getProfessionalImage = (serviceId) => {
    const profId = serviceProfessionals[serviceId] || ANY_PROFESSIONAL.id;
    if (profId === ANY_PROFESSIONAL.id) return null;
    const member = members.find(m => m.id === profId);
    return member?.profile_photo_url || null;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Select services</h2>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search services"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory("all")}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
            selectedCategory === "all"
              ? "bg-primary text-primary-foreground"
              : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
          )}
        >
          Featured
        </button>
        {isLoadingCategories ? (
          <>
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
          </>
        ) : (
          categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                selectedCategory === category.id
                  ? "bg-primary text-primary-foreground"
                  : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              )}
            >
              {category.name}
            </button>
          ))
        )}
      </div>

      <div className="space-y-3">
        {isLoadingServices ? (
          <>
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </>
        ) : filteredServices.map((service) => {
          const isSelected = selectedServices.some(s => s.id === service.id);
          return (
            <div
              key={service.id}
              className={cn(
                "rounded-xl border p-4 transition-all",
                isSelected ? "border-primary bg-white shadow-sm ring-1 ring-primary" : "border-gray-200 bg-white hover:border-primary/20 hover:bg-primary/5 cursor-pointer"
              )}
            >
              <div 
                className="flex items-start justify-between w-full"
                onClick={() => toggleService(service)}
              >
                <div>
                  <h3 className="font-medium text-gray-900">{service.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {formatDuration(service.duration_minutes)} · {service.description || "Testing Services"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-900">{formatPrice(service.price || 0)}</span>
                  {isSelected ? (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="h-4 w-4" />
                    </div>
                  ) : (
                    <div className="h-6 w-6 rounded-full border-2 border-gray-200" />
                  )}
                </div>
              </div>

              {isSelected && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveProfessionalModalService(service);
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    {getProfessionalImage(service.id) ? (
                      <img 
                        src={getProfessionalImage(service.id)} 
                        alt="Pro" 
                        className="h-6 w-6 rounded-full object-cover" 
                      />
                    ) : (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                        {getProfessionalDisplay(service.id).charAt(0)}
                      </div>
                    )}
                    <span className="text-gray-900">{getProfessionalDisplay(service.id)}</span>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
        {!isLoadingServices && filteredServices.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No services found matching your criteria.
          </div>
        )}
      </div>

      <ServiceProfessionalModal
        isOpen={!!activeProfessionalModalService}
        onClose={() => setActiveProfessionalModalService(null)}
        service={activeProfessionalModalService}
        selectedProfessionalId={
          activeProfessionalModalService 
            ? serviceProfessionals[activeProfessionalModalService.id] || ANY_PROFESSIONAL.id 
            : ANY_PROFESSIONAL.id
        }
        onSelect={(serviceId, memberId) => {
          setServiceProfessionals(prev => ({
            ...prev,
            [serviceId]: memberId
          }));
        }}
      />
    </div>
  );
}
