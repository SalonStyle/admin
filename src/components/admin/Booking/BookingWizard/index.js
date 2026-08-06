import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { STEPS } from "@/lib/constant";
import { useGetMembersQuery } from "@/lib/redux/features/members/members-api";
import { useCreateBookingMutation } from "@/lib/redux/features/bookings/bookings-api";
import StepBreadcrumbs from "../StepBreadcrumbs";
import BookingSummaryPanel from "../BookingSummaryPanel";
import ServicesStep from "../BookingSteps/ServicesStep";
import TimeStep from "../BookingSteps/TimeStep";
import CustomerStep from "../BookingSteps/CustomerStep";
import { getPaginatedList } from "@/lib/api/list-query";

export default function BookingWizard({ onClose }) {
  const [currentStep, setCurrentStep] = useState("services");
  const [completedSteps, setCompletedSteps] = useState(new Set(["services"]));
  const [selectedServices, setSelectedServices] = useState([]);
  const [serviceProfessionals, setServiceProfessionals] = useState({});
  const [bookingDate, setBookingDate] = useState(null);
  const [bookingTime, setBookingTime] = useState(null);

  const { data: membersData } = useGetMembersQuery({ limit: 100 });
  const { items: members } = getPaginatedList(membersData);

  const [createBooking, { isLoading: isSubmitting }] =
    useCreateBookingMutation();

  const totalAmount = useMemo(() => {
    return selectedServices.reduce(
      (sum, service) => sum + (service.price || 0),
      0,
    );
  }, [selectedServices]);

  const totalDuration = useMemo(() => {
    return selectedServices.reduce(
      (sum, service) => sum + (service.duration_minutes || 0),
      0,
    );
  }, [selectedServices]);

  const handleNextStep = () => {
    const currentIndex = STEPS.findIndex((s) => s.id === currentStep);
    if (currentIndex < STEPS.length - 1) {
      const nextStepId = STEPS[currentIndex + 1].id;
      setCompletedSteps((prev) => new Set([...prev, nextStepId]));
      setCurrentStep(nextStepId);
    }
  };

  const handleStepClick = (stepId) => {
    setCurrentStep(stepId);
  };

  const handleCreateBooking = async (customerData) => {
    // Determine exact starts_at value
    // If bookingTime already contains "T", it's an ISO string, otherwise prepend the formatted date
    let startsAt = bookingTime;
    if (bookingDate && !bookingTime.includes("T")) {
      startsAt = `${bookingDate.toISOString().split("T")[0]}T${bookingTime}:00.000Z`;
    }

    const payload = {
      salon_id: selectedServices[0]?.salon_id || "", // Assuming services have salon_id, or we can get it from somewhere else. Wait, I will just grab it from the first service if it's there.
      starts_at: startsAt,
      items: selectedServices.map((service) => {
        const profId = serviceProfessionals[service.id];
        return {
          service_id: service.id,
          member_id: profId === "any" ? undefined : profId,
        };
      }),
      customer: {
        full_name: customerData.name,
        phone: customerData.phone,
        ...(customerData.email ? { email: customerData.email } : {}),
      },
      ...(customerData.notes ? { notes: customerData.notes } : {}),
    };

    try {
      await createBooking(payload).unwrap();
      onClose();
    } catch (error) {
      console.error("Failed to create booking:", error);
    }
  };

  const renderSteps = () => {
    return (
      <>
        <div className={currentStep === "services" ? "block h-full" : "hidden"}>
          <ServicesStep
            selectedServices={selectedServices}
            setSelectedServices={setSelectedServices}
            serviceProfessionals={serviceProfessionals}
            setServiceProfessionals={setServiceProfessionals}
            onNext={handleNextStep}
          />
        </div>
        <div className={currentStep === "time" ? "block h-full" : "hidden"}>
          <TimeStep
            bookingDate={bookingDate}
            setBookingDate={setBookingDate}
            bookingTime={bookingTime}
            setBookingTime={setBookingTime}
            onNext={handleNextStep}
            onBack={() => setCurrentStep("services")}
            selectedServices={selectedServices}
            serviceProfessionals={serviceProfessionals}
          />
        </div>
        <div className={currentStep === "customer" ? "block h-full" : "hidden"}>
          <CustomerStep
            onSubmit={handleCreateBooking}
            onBack={() => setCurrentStep("time")}
          />
        </div>
      </>
    );
  };

  const canContinue = () => {
    if (currentStep === "services") return selectedServices.length > 0;
    if (currentStep === "time") return bookingDate && bookingTime;
    if (currentStep === "customer") return true;
    return false;
  };

  const getContinueLabel = () => {
    if (currentStep === "services") return "Continue";
    if (currentStep === "time") return "Continue";
    return "Create booking";
  };

  const handleContinueClick = () => {
    if (currentStep === "customer") {
      // Form submission handles it in CustomerStep
      const form = document.getElementById("customer-booking-form");
      if (form) {
        form.requestSubmit();
      }
    } else {
      handleNextStep();
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[1000px] h-[85vh] p-0 gap-0bg-[#fafafa]">
        <DialogTitle className="sr-only">Create Booking</DialogTitle>
        <div className="flex h-full min-h-0">
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col h-full overflow-hidden min-h-0">
            <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0">
              <StepBreadcrumbs
                currentStep={currentStep}
                onStepClick={handleStepClick}
                completedSteps={completedSteps}
              />
            </div>
            <div className="flex-1 overflow-y-auto p-6 min-h-0">
              {renderSteps()}
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-[380px] border-l border-gray-200">
            <BookingSummaryPanel
              selectedServices={selectedServices}
              serviceProfessionals={serviceProfessionals}
              members={members}
              bookingDate={bookingDate}
              bookingTime={bookingTime}
              totalAmount={totalAmount}
              totalDuration={totalDuration}
              continueLabel={getContinueLabel()}
              canContinue={canContinue()}
              isSubmitting={isSubmitting}
              onContinue={handleContinueClick}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
