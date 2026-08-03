"use client";

import { useState } from "react";
import { Store } from "lucide-react";
import dynamic from "next/dynamic";
import { DataTable } from "@/components/admin/data-table";
import { UIModal } from "@/components/admin/ui-modal";
import { TableSkeleton } from "@/components/Skeleton/table-skeleton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateSalonMutation,
  useGetSalonsQuery,
  useUpdateOnboardingMeMutation,
  useUpdateSalonMutation,
} from "@/lib/redux/features/salons/salons-api";
import { useGetPublicCategoriesQuery } from "@/lib/redux/features/categories/categories-api";
import { getPaginatedList } from "@/lib/api/list-query";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { useServerTable } from "@/hooks/use-server-table";

const LocationMap = dynamic(() => import("@/components/admin/location-map"), {
  ssr: false,
});

export default function SalonsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creationStep, setCreationStep] = useState(1); // Steps: 1 (Account), 3 (Business Info), 4 (Categories), 5 (Location), 6 (Operating Hours)
  const [tempToken, setTempToken] = useState(null);
  const [registeredSalonId, setRegisteredSalonId] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [isStepSubmitting, setIsStepSubmitting] = useState(false);
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  // Pagination & Search State via URL
  const table = useServerTable({
    defaultPage: 1,
    defaultLimit: 10,
    searchParam: "name",
  });

  // Global hours toggle
  const [applySameHours, setApplySameHours] = useState(false);
  const [globalOpensAt, setGlobalOpensAt] = useState("09:00");
  const [globalClosesAt, setGlobalClosesAt] = useState("18:00");

  // Step-specific form states
  const [accountData, setAccountData] = useState({ email: "", password: "" });
  const [businessData, setBusinessData] = useState({ name: "", website: "" });
  const [categoryData, setCategoryData] = useState({
    primary_category_id: "",
    related_category_ids: [],
  });
  const [locationData, setLocationData] = useState({
    label: "Main branch",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    postal_code: "",
    country_code: "IN",
    latitude: "23.0225",
    longitude: "72.5714",
  });
  const [operatingHours, setOperatingHours] = useState([
    { day_of_week: 0, is_closed: false, opens_at: "09:00", closes_at: "18:00" },
    { day_of_week: 1, is_closed: false, opens_at: "09:00", closes_at: "18:00" },
    { day_of_week: 2, is_closed: false, opens_at: "09:00", closes_at: "18:00" },
    { day_of_week: 3, is_closed: false, opens_at: "09:00", closes_at: "18:00" },
    { day_of_week: 4, is_closed: false, opens_at: "09:00", closes_at: "18:00" },
    { day_of_week: 5, is_closed: false, opens_at: "10:00", closes_at: "16:00" },
    { day_of_week: 6, is_closed: true, opens_at: "09:00", closes_at: "18:00" },
  ]);

  // Queries & Mutations
  const {
    data: salonsData,
    isLoading,
    refetch,
  } = useGetSalonsQuery(table.queryParams);
  const { data: categoriesData } = useGetPublicCategoriesQuery(undefined, {
    skip: !isModalOpen || creationStep !== 4,
  });

  const { items: salons, total: totalSalons } = getPaginatedList(salonsData);
  const { items: categories } = getPaginatedList(categoriesData);

  const [createSalon, { isLoading: isCreating }] = useCreateSalonMutation();
  const [updateSalon] = useUpdateSalonMutation();
  const [updateOnboardingMe, { isLoading: isUpdating }] =
    useUpdateOnboardingMeMutation();

  const resetWizard = () => {
    setCreationStep(1);
    setTempToken(null);
    setRegisteredSalonId(null);
    setSubmitError(null);
    setIsStepSubmitting(false);
    setApplySameHours(false);
    setIsEditingLocation(false);
    setGlobalOpensAt("09:00");
    setGlobalClosesAt("18:00");
    setAccountData({ email: "", password: "" });
    setBusinessData({ name: "", website: "" });
    setCategoryData({ primary_category_id: "", related_category_ids: [] });
    setLocationData({
      label: "Main branch",
      address_line_1: "Carnaby Street",
      address_line_2: "Carnaby",
      city: "London",
      state: "Greater London",
      postal_code: "W1F 7DB",
      country_code: "GB",
      latitude: "51.5134",
      longitude: "-0.1384",
    });
    setOperatingHours([
      {
        day_of_week: 0,
        is_closed: false,
        opens_at: "09:00",
        closes_at: "18:00",
      },
      {
        day_of_week: 1,
        is_closed: false,
        opens_at: "09:00",
        closes_at: "18:00",
      },
      {
        day_of_week: 2,
        is_closed: false,
        opens_at: "09:00",
        closes_at: "18:00",
      },
      {
        day_of_week: 3,
        is_closed: false,
        opens_at: "09:00",
        closes_at: "18:00",
      },
      {
        day_of_week: 4,
        is_closed: false,
        opens_at: "09:00",
        closes_at: "18:00",
      },
      {
        day_of_week: 5,
        is_closed: false,
        opens_at: "10:00",
        closes_at: "16:00",
      },
      {
        day_of_week: 6,
        is_closed: true,
        opens_at: "09:00",
        closes_at: "18:00",
      },
    ]);
  };

  // Geolocation handling
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lng = position.coords.longitude.toFixed(6);
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
          );
          const data = await res.json();
          if (data && data.address) {
            setLocationData({
              ...locationData,
              latitude: lat,
              longitude: lng,
              address_line_1:
                data.address.road ||
                data.address.pedestrian ||
                data.address.suburb ||
                data.address.neighbourhood ||
                "",
              city:
                data.address.city ||
                data.address.town ||
                data.address.village ||
                data.address.county ||
                "",
              state: data.address.state || "",
              postal_code: data.address.postcode || "",
              country_code: data.address.country_code
                ? data.address.country_code.toUpperCase()
                : locationData.country_code,
            });
          } else {
            setLocationData((prev) => ({
              ...prev,
              latitude: lat,
              longitude: lng,
            }));
          }
        } catch (error) {
          console.error("Reverse geocoding failed:", error);
          setLocationData((prev) => ({
            ...prev,
            latitude: lat,
            longitude: lng,
          }));
        }
        setIsLocating(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Failed to get your location. Please check browser permissions.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  };

  const handleAddSalon = () => {
    resetWizard();
    setIsModalOpen(true);
  };

  const handlePrevStep = () => {
    setSubmitError(null);
    if (creationStep === 3) {
      setCreationStep(1);
    } else if (creationStep === 4) {
      setCreationStep(3);
    } else if (creationStep === 5) {
      setCreationStep(4);
    } else if (creationStep === 6) {
      setCreationStep(5);
    }
  };

  const handleWizardSubmit = async () => {
    setSubmitError(null);

    if (creationStep === 1) {
      if (registeredSalonId || tempToken) {
        // Already signed up in this session, simply advance to Step 3
        setCreationStep(3);
        return;
      }

      try {
        setIsStepSubmitting(true);

        if (!accountData.email || !accountData.password) {
          setSubmitError("Email and Password are required.");
          setIsStepSubmitting(false);
          return;
        }

        // Step 1: Signup the salon owner account
        const result = await createSalon({
          email: accountData.email,
          password: accountData.password,
        }).unwrap();

        const initialToken =
          result?.access_token || result?.data?.access_token || result?.token;

        if (!initialToken) {
          throw new Error(
            "Salon owner registered, but authentication token not received.",
          );
        }

        // Step 2: Set account_type to business to generate the salon record and obtain the salon UUID
        const onboardingResult = await updateOnboardingMe({
          token: initialToken,
          payload: {
            step_id: "account_type",
            data: { account_type: "business" },
          },
        }).unwrap();

        const businessToken =
          onboardingResult?.auth?.access_token ||
          onboardingResult?.data?.auth?.access_token ||
          onboardingResult?.auth?.token ||
          initialToken;

        const salonId =
          onboardingResult?.salon_id ||
          onboardingResult?.data?.salon_id ||
          onboardingResult?.auth?.user?.salon_id ||
          onboardingResult?.data?.auth?.user?.salon_id;

        if (!salonId) {
          throw new Error(
            "Salon record was not generated after setting account type to business.",
          );
        }

        setTempToken(businessToken);
        setRegisteredSalonId(salonId);

        // Proceed directly to Business Info (Step 3)
        setCreationStep(3);
      } catch (err) {
        console.error("Step 1 error:", err);
        let message =
          err?.data?.message ||
          err?.data?.detail ||
          err?.message ||
          err?.error ||
          (err?.data?.errors ? err.data.errors.join(", ") : null) ||
          (typeof err?.data === "string" ? err.data : null) ||
          "Failed to create salon owner account.";

        if (Array.isArray(message)) {
          message = message.join(", ");
        }
        setSubmitError(message);
      } finally {
        setIsStepSubmitting(false);
      }
    } else if (creationStep === 3) {
      if (!businessData.name) {
        setSubmitError("Salon Name is required.");
        return;
      }

      try {
        setIsStepSubmitting(true);
        await updateOnboardingMe({
          token: tempToken,
          payload: {
            step_id: "business_info",
            data: {
              name: businessData.name,
              website: businessData.website || null,
            },
          },
        }).unwrap();

        setCreationStep(4);
      } catch (err) {
        console.error("Step 3 error:", err);
        let message =
          err?.data?.message ||
          err?.data?.detail ||
          err?.message ||
          err?.error ||
          (err?.data?.errors ? err.data.errors.join(", ") : null) ||
          "Failed to configure salon details.";

        if (Array.isArray(message)) {
          message = message.join(", ");
        }
        setSubmitError(message);
      } finally {
        setIsStepSubmitting(false);
      }
    } else if (creationStep === 4) {
      if (!categoryData.primary_category_id) {
        setSubmitError("Primary Category is required.");
        return;
      }

      try {
        setIsStepSubmitting(true);
        await updateOnboardingMe({
          token: tempToken,
          payload: {
            step_id: "categories",
            data: {
              primary_category_id: categoryData.primary_category_id,
              related_category_ids: categoryData.related_category_ids,
            },
          },
        }).unwrap();

        setCreationStep(5);
      } catch (err) {
        console.error("Step 4 error:", err);
        let message =
          err?.data?.message ||
          err?.data?.detail ||
          err?.message ||
          err?.error ||
          (err?.data?.errors ? err.data.errors.join(", ") : null) ||
          "Failed to save categories.";

        if (Array.isArray(message)) {
          message = message.join(", ");
        }
        setSubmitError(message);
      } finally {
        setIsStepSubmitting(false);
      }
    } else if (creationStep === 5) {
      if (
        !locationData.address_line_1 ||
        !locationData.city ||
        !locationData.state ||
        !locationData.postal_code
      ) {
        setSubmitError(
          "Address Line 1, City, State, and Postal Code are required.",
        );
        return;
      }

      try {
        setIsStepSubmitting(true);
        await updateOnboardingMe({
          token: tempToken,
          payload: {
            step_id: "location",
            data: {
              location: {
                label: locationData.label || "Main branch",
                address_line_1: locationData.address_line_1,
                address_line_2: locationData.address_line_2 || null,
                city: locationData.city,
                state: locationData.state,
                postal_code: locationData.postal_code,
                country_code: locationData.country_code || "IN",
                latitude: locationData.latitude || "23.0225",
                longitude: locationData.longitude || "72.5714",
              },
            },
          },
        }).unwrap();

        setCreationStep(6);
      } catch (err) {
        console.error("Step 5 error:", err);
        let message =
          err?.data?.message ||
          err?.data?.detail ||
          err?.message ||
          err?.error ||
          (err?.data?.errors ? err.data.errors.join(", ") : null) ||
          "Failed to save location details.";

        if (Array.isArray(message)) {
          message = message.join(", ");
        }
        setSubmitError(message);
      } finally {
        setIsStepSubmitting(false);
      }
    } else if (creationStep === 6) {
      try {
        setIsStepSubmitting(true);

        const formattedHours = operatingHours.map((day) => {
          if (day.is_closed) {
            return {
              day_of_week: day.day_of_week,
              is_closed: true,
            };
          }
          if (applySameHours) {
            return {
              day_of_week: day.day_of_week,
              is_closed: false,
              opens_at: globalOpensAt,
              closes_at: globalClosesAt,
            };
          }
          return {
            day_of_week: day.day_of_week,
            is_closed: false,
            opens_at: day.opens_at || "09:00",
            closes_at: day.closes_at || "18:00",
          };
        });

        await updateOnboardingMe({
          token: tempToken,
          payload: {
            step_id: "operating_hours",
            data: {
              operating_hours: formattedHours,
            },
          },
        }).unwrap();

        // Complete onboarding! Refetch table and close modal
        refetch();
        setIsModalOpen(false);
        resetWizard();
      } catch (err) {
        console.error("Step 6 error:", err);
        let message =
          err?.data?.message ||
          err?.data?.detail ||
          err?.message ||
          err?.error ||
          (err?.data?.errors ? err.data.errors.join(", ") : null) ||
          "Failed to save operating hours.";

        if (Array.isArray(message)) {
          message = message.join(", ");
        }
        setSubmitError(message);
      } finally {
        setIsStepSubmitting(false);
      }
    }
  };

  const columns = [
    {
      header: "Salon",
      accessorKey: "salon_name",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/10 p-2">
            <Store className="h-4 w-4 text-primary" />
          </div>
          <div>
            <div className="font-medium">{row.salon_name || row.name}</div>
            <div className="text-sm text-gray-500">
              {row.owner?.email || "—"}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => (
        <div
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            (row.status || "active") === "active"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {(row.status || "active") === "active" ? "Active" : "Inactive"}
        </div>
      ),
    },
  ];

  const getSubmitText = () => {
    if (creationStep === 1) return tempToken ? "Next" : "Create Account";
    if (creationStep === 3) return "Continue to Categories";
    if (creationStep === 4) return "Continue to Location";
    if (creationStep === 5) return "Continue to Operating Hours";
    if (creationStep === 6) return "Complete Setup";
    return "Submit";
  };

  const stepsList = [
    { number: 1, label: "Account Setup" },
    { number: 3, label: "Business Details" },
    { number: 4, label: "Categories" },
    { number: 5, label: "Location" },
    { number: 6, label: "Operating Hours" },
  ];

  const activeStepIdx = stepsList.findIndex((s) => s.number === creationStep);

  const getCurrentStepState = () => {
    if (creationStep === 1) return accountData;
    if (creationStep === 3) return businessData;
    if (creationStep === 4) return categoryData;
    if (creationStep === 5) return locationData;
    if (creationStep === 6) return operatingHours;
    return {};
  };

  return (
    <div className="space-y-5">
      {isLoading ? (
        <TableSkeleton
          columns={columns}
          rows={10}
          addNewLabel="Add Salon"
          title="All Salons"
        />
      ) : (
        <DataTable
          {...table.dataTableProps}
          data={salons}
          columns={columns}
          onAddNew={handleAddSalon}
          addNewLabel="Add Salon"
          emptyMessage="No salons registered yet."
          title="Salons"
          subtitle="Manage all salon partners on the platform"
          totalCount={totalSalons}
        />
      )}

      <UIModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetWizard();
        }}
        title={null}
        description={null}
        onSubmit={handleWizardSubmit}
        submitText={getSubmitText()}
        cancelText={creationStep > 1 ? "Back" : "Cancel"}
        onCancel={
          creationStep > 1
            ? handlePrevStep
            : () => {
                setIsModalOpen(false);
                resetWizard();
              }
        }
        isSubmitting={isCreating || isStepSubmitting}
        size="2xl"
        formId={`salon-onboarding-step-${creationStep}`}
      >
        {/* Horizontal Line Progress Tracker */}
        <div className="mb-6 px-1 pt-6">
          <div className="flex gap-2">
            {stepsList.map((s, index) => (
              <div
                key={s.number}
                className={`h-1.5 flex-1 rounded-full ${
                  activeStepIdx >= index ? "bg-primary" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        {submitError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {submitError}
          </div>
        )}

        <form
          id={`salon-onboarding-step-${creationStep}`}
          onSubmit={(e) => {
            e.preventDefault();
            handleWizardSubmit();
          }}
          data-form-values={JSON.stringify(getCurrentStepState())}
        >
          {creationStep === 1 && (
            <div className="space-y-6">
              <div>
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                  Step 1
                </span>
                <h2 className="text-2xl font-bold text-gray-900 mt-1">
                  Owner Account Setup
                </h2>
                <p className="text-gray-500 mt-1">
                  Register a new salon owner account with email and password.
                </p>
              </div>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12">
                  <Label htmlFor="owner-email">Owner Email</Label>
                  <Input
                    id="owner-email"
                    type="email"
                    value={accountData.email}
                    disabled={!!tempToken}
                    onChange={(e) =>
                      setAccountData({ ...accountData, email: e.target.value })
                    }
                    placeholder="owner@example.com"
                    className="mt-1.5 focus-visible:ring-[1px] shadow-none"
                    required
                  />
                </div>
                <div className="col-span-12">
                  <Label htmlFor="owner-password">Password</Label>
                  <Input
                    id="owner-password"
                    type="password"
                    value={accountData.password}
                    disabled={!!tempToken}
                    onChange={(e) =>
                      setAccountData({
                        ...accountData,
                        password: e.target.value,
                      })
                    }
                    placeholder="••••••••"
                    className="mt-1.5 focus-visible:ring-[1px] shadow-none"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {creationStep === 3 && (
            <div className="space-y-6">
              <div>
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                  Step 2
                </span>
                <h2 className="text-2xl font-bold text-gray-900 mt-1">
                  Business Details
                </h2>
                <p className="text-gray-500 mt-1">
                  Provide the public branding and contact details for the salon.
                </p>
              </div>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12">
                  <Label htmlFor="salon-name">Salon Name</Label>
                  <Input
                    id="salon-name"
                    type="text"
                    value={businessData.name}
                    onChange={(e) =>
                      setBusinessData({ ...businessData, name: e.target.value })
                    }
                    placeholder="Jane Styles Studio"
                    className="mt-1.5 focus-visible:ring-[1px] shadow-none"
                    required
                  />
                </div>
                <div className="col-span-12">
                  <Label htmlFor="salon-website">Website (Optional)</Label>
                  <Input
                    id="salon-website"
                    type="url"
                    value={businessData.website}
                    onChange={(e) =>
                      setBusinessData({
                        ...businessData,
                        website: e.target.value,
                      })
                    }
                    placeholder="https://www.yoursite.com"
                    className="mt-1.5 focus-visible:ring-[1px] shadow-none"
                  />
                </div>
              </div>
            </div>
          )}

          {creationStep === 4 && (
            <div className="space-y-6">
              <div>
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                  Step 3
                </span>
                <h2 className="text-2xl font-bold text-gray-900 mt-1">
                  Service Categories
                </h2>
                <p className="text-gray-500 mt-1">
                  Select the primary category and up to 3 related business
                  categories.
                </p>
              </div>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12">
                  <Label htmlFor="primary-category">Primary Category</Label>
                  <Select
                    value={categoryData.primary_category_id}
                    onValueChange={(val) => {
                      const newRelated =
                        categoryData.related_category_ids.filter(
                          (id) => id !== val,
                        );
                      setCategoryData({
                        ...categoryData,
                        primary_category_id: val,
                        related_category_ids: newRelated,
                      });
                    }}
                  >
                    <SelectTrigger
                      id="primary-category"
                      className="w-full mt-1.5"
                    >
                      <SelectValue placeholder="Select primary category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories
                        .filter((c) => c.status === "active" || !c.status)
                        .map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-12 mt-2">
                  <div className="flex flex-wrap gap-2 mt-3">
                    {categories
                      .filter((c) => c.status === "active" || !c.status)
                      .filter((c) => c.id !== categoryData.primary_category_id)
                      .map((cat) => {
                        const isChecked =
                          categoryData.related_category_ids.includes(cat.id);
                        const isDisabled =
                          !isChecked &&
                          categoryData.related_category_ids.length >= 3;

                        return (
                          <div
                            key={cat.id}
                            onClick={() => {
                              if (isDisabled) return;
                              if (isChecked) {
                                setCategoryData({
                                  ...categoryData,
                                  related_category_ids:
                                    categoryData.related_category_ids.filter(
                                      (id) => id !== cat.id,
                                    ),
                                });
                              } else {
                                setCategoryData({
                                  ...categoryData,
                                  related_category_ids: [
                                    ...categoryData.related_category_ids,
                                    cat.id,
                                  ],
                                });
                              }
                            }}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                              isChecked
                                ? "bg-gray-900 border-gray-900 text-white hover:bg-gray-800 cursor-pointer"
                                : isDisabled
                                  ? "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed"
                                  : "bg-white border-gray-300 text-gray-700 hover:border-gray-900 hover:bg-gray-50 cursor-pointer"
                            }`}
                          >
                            {cat.name}
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {creationStep === 5 && (
            <div className="space-y-6">
              <div>
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                  Step 4
                </span>
                <h2 className="text-3xl font-bold text-gray-900 mt-1">
                  Set your location address
                </h2>
                <p className="text-gray-500 mt-1 text-base">
                  Add your business location so your clients can easily find
                  you.
                </p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4 flex justify-between items-start shadow-sm">
                <div>
                  <p className="text-base font-medium text-gray-900">
                    {locationData.address_line_1}
                  </p>
                  {locationData.address_line_2 && (
                    <p className="text-sm text-gray-600 mt-0.5">
                      {locationData.address_line_2}
                    </p>
                  )}
                  <p className="text-sm text-gray-600 mt-0.5">
                    {locationData.postal_code}, {locationData.city},{" "}
                    {locationData.state}
                  </p>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {locationData.country_code}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingLocation(true)}
                >
                  Edit
                </Button>
              </div>

              {/* Map block */}
              <div className="mt-8">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-4 gap-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Is the pin in the right location?
                    </h3>
                    <p className="text-sm text-gray-500">
                      Move the pin to your location so clients know where to
                      find you when looking up directions.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleLocateMe}
                    disabled={isLocating}
                    className="shrink-0"
                  >
                    <svg
                      className={`w-4 h-4 mr-2 ${isLocating ? "animate-spin" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                    </svg>
                    {isLocating ? "Locating..." : "Use Current Location"}
                  </Button>
                </div>
                <div className="w-full h-[300px] bg-gray-200 rounded-xl overflow-hidden border border-gray-300">
                  <LocationMap
                    latitude={locationData.latitude}
                    longitude={locationData.longitude}
                    boxZoom
                    onLocationChange={(lat, lng) =>
                      setLocationData({
                        ...locationData,
                        latitude: lat,
                        longitude: lng,
                      })
                    }
                  />
                </div>
              </div>

              {/* Nested Modal for Editing Location */}
              <Dialog
                open={isEditingLocation}
                onOpenChange={setIsEditingLocation}
              >
                <DialogContent
                  className="sm:max-w-[600px] z-[100]"
                  onInteractOutside={(e) => e.preventDefault()}
                >
                  <DialogHeader>
                    <DialogTitle>Edit Location Details</DialogTitle>
                  </DialogHeader>
                  <div
                    className="grid grid-cols-12 gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        e.stopPropagation();
                      }
                    }}
                  >
                    <div className="col-span-12">
                      <Label htmlFor="loc-label">
                        Location Label (Optional)
                      </Label>
                      <Input
                        id="loc-label"
                        type="text"
                        value={locationData.label}
                        onChange={(e) =>
                          setLocationData({
                            ...locationData,
                            label: e.target.value,
                          })
                        }
                        placeholder="e.g. Main branch"
                        className="mt-1.5 focus-visible:ring-[1px] shadow-none"
                      />
                    </div>
                    <div className="col-span-12 md:col-span-8">
                      <Label htmlFor="loc-address1">Address Line 1</Label>
                      <Input
                        id="loc-address1"
                        type="text"
                        value={locationData.address_line_1}
                        onChange={(e) =>
                          setLocationData({
                            ...locationData,
                            address_line_1: e.target.value,
                          })
                        }
                        className="mt-1.5 focus-visible:ring-[1px] shadow-none"
                      />
                    </div>
                    <div className="col-span-12 md:col-span-4">
                      <Label htmlFor="loc-address2">Address Line 2</Label>
                      <Input
                        id="loc-address2"
                        type="text"
                        value={locationData.address_line_2}
                        onChange={(e) =>
                          setLocationData({
                            ...locationData,
                            address_line_2: e.target.value,
                          })
                        }
                        className="mt-1.5 focus-visible:ring-[1px] shadow-none"
                      />
                    </div>
                    <div className="col-span-12 md:col-span-6">
                      <Label htmlFor="loc-city">City</Label>
                      <Input
                        id="loc-city"
                        type="text"
                        value={locationData.city}
                        onChange={(e) =>
                          setLocationData({
                            ...locationData,
                            city: e.target.value,
                          })
                        }
                        className="mt-1.5 focus-visible:ring-[1px] shadow-none"
                      />
                    </div>
                    <div className="col-span-12 md:col-span-6">
                      <Label htmlFor="loc-state">State</Label>
                      <Input
                        id="loc-state"
                        type="text"
                        value={locationData.state}
                        onChange={(e) =>
                          setLocationData({
                            ...locationData,
                            state: e.target.value,
                          })
                        }
                        className="mt-1.5 focus-visible:ring-[1px] shadow-none"
                      />
                    </div>
                    <div className="col-span-12 md:col-span-4">
                      <Label htmlFor="loc-postal">Postal Code</Label>
                      <Input
                        id="loc-postal"
                        type="text"
                        value={locationData.postal_code}
                        onChange={(e) =>
                          setLocationData({
                            ...locationData,
                            postal_code: e.target.value,
                          })
                        }
                        className="mt-1.5 focus-visible:ring-[1px] shadow-none"
                      />
                    </div>
                    <div className="col-span-12 md:col-span-4">
                      <Label htmlFor="loc-lat">Latitude</Label>
                      <Input
                        id="loc-lat"
                        type="text"
                        value={locationData.latitude}
                        onChange={(e) =>
                          setLocationData({
                            ...locationData,
                            latitude: e.target.value,
                          })
                        }
                        className="mt-1.5 focus-visible:ring-[1px] shadow-none"
                      />
                    </div>
                    <div className="col-span-12 md:col-span-4">
                      <Label htmlFor="loc-lng">Longitude</Label>
                      <Input
                        id="loc-lng"
                        type="text"
                        value={locationData.longitude}
                        onChange={(e) =>
                          setLocationData({
                            ...locationData,
                            longitude: e.target.value,
                          })
                        }
                        className="mt-1.5 focus-visible:ring-[1px] shadow-none"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4 border-t pt-4">
                    <Button
                      type="button"
                      onClick={() => setIsEditingLocation(false)}
                    >
                      Done
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {creationStep === 6 && (
            <div className="space-y-6">
              <div>
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                  Step 5
                </span>
                <h2 className="text-2xl font-bold text-gray-900 mt-1">
                  Operating Hours
                </h2>
                <p className="text-gray-500 mt-1">
                  Define open days and working hours for the salon.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 bg-primary/5 border border-primary/20 rounded-2xl mb-4">
                  <Checkbox
                    id="wizard-same-hours"
                    checked={applySameHours}
                    onCheckedChange={(checked) => setApplySameHours(!!checked)}
                    className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label
                    htmlFor="wizard-same-hours"
                    className="text-sm font-bold text-gray-800 cursor-pointer"
                  >
                    Apply same opening/closing hours to all active operating
                    days
                  </Label>
                </div>

                {applySameHours && (
                  <div className="grid gap-4 md:grid-cols-2 p-4 bg-gray-50 border border-gray-100 rounded-2xl mb-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="grid gap-2">
                      <Label
                        htmlFor="wizard-global-opens"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Global Opening Time
                      </Label>
                      <Input
                        id="wizard-global-opens"
                        type="time"
                        value={globalOpensAt}
                        onChange={(e) => setGlobalOpensAt(e.target.value)}
                        className="rounded-xl border-gray-200 h-10"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label
                        htmlFor="wizard-global-closes"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Global Closing Time
                      </Label>
                      <Input
                        id="wizard-global-closes"
                        type="time"
                        value={globalClosesAt}
                        onChange={(e) => setGlobalClosesAt(e.target.value)}
                        className="rounded-xl border-gray-200 h-10"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                  {operatingHours.map((day, idx) => {
                    const dayNames = [
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                      "Sunday",
                    ];
                    return (
                      <div
                        key={day.day_of_week}
                        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-2xl transition-all ${
                          day.is_closed
                            ? "bg-gray-50/50 border-gray-100 opacity-60"
                            : "bg-white border-gray-200"
                        }`}
                      >
                        <div className="flex items-center justify-between sm:justify-start gap-4 sm:w-1/3">
                          <span className="font-semibold text-gray-900 w-24">
                            {dayNames[day.day_of_week]}
                          </span>
                          <div className="flex items-center gap-2">
                            <Switch
                              id={`wizard-closed-${day.day_of_week}`}
                              checked={!day.is_closed}
                              onCheckedChange={(checked) => {
                                const newHours = [...operatingHours];
                                newHours[idx] = { ...day, is_closed: !checked };
                                setOperatingHours(newHours);
                              }}
                              className="data-[state=checked]:bg-primary"
                            />
                            <Label
                              htmlFor={`wizard-closed-${day.day_of_week}`}
                              className="text-xs text-gray-500 font-semibold cursor-pointer select-none"
                            >
                              {!day.is_closed ? "Open" : "Closed"}
                            </Label>
                          </div>
                        </div>

                        {!day.is_closed && (
                          <div className="flex items-center gap-3 w-full sm:w-2/3">
                            {applySameHours ? (
                              <div className="text-xs text-muted-foreground bg-primary/5 border border-primary/20 rounded-xl px-3.5 py-2 w-full text-center">
                                Sharing global timing: {globalOpensAt} -{" "}
                                {globalClosesAt}
                              </div>
                            ) : (
                              <>
                                <div className="flex-1">
                                  <Input
                                    type="time"
                                    value={day.opens_at || "09:00"}
                                    onChange={(e) => {
                                      const newHours = [...operatingHours];
                                      newHours[idx] = {
                                        ...day,
                                        opens_at: e.target.value,
                                      };
                                      setOperatingHours(newHours);
                                    }}
                                    className="rounded-xl border-gray-200 h-10 w-full"
                                  />
                                </div>
                                <span className="text-gray-400">to</span>
                                <div className="flex-1">
                                  <Input
                                    type="time"
                                    value={day.closes_at || "18:00"}
                                    onChange={(e) => {
                                      const newHours = [...operatingHours];
                                      newHours[idx] = {
                                        ...day,
                                        closes_at: e.target.value,
                                      };
                                      setOperatingHours(newHours);
                                    }}
                                    className="rounded-xl border-gray-200 h-10 w-full"
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        )}

                        {day.is_closed && (
                          <div className="text-xs font-medium text-gray-400 flex items-center justify-center h-10 sm:w-2/3 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                            Closed all day
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </form>
      </UIModal>
    </div>
  );
}
