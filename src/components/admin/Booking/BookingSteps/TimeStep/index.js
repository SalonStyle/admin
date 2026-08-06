import { useState, useMemo } from "react";
import { format, addDays, isSameDay, startOfToday } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ANY_PROFESSIONAL } from "@/lib/constant";
import { useGetAvailabilitySlotsQuery } from "@/lib/redux/features/bookings/bookings-api";

export default function TimeStep({
  bookingDate,
  setBookingDate,
  bookingTime,
  setBookingTime,
  onNext,
  onBack,
  selectedServices,
  serviceProfessionals,
}) {
  const [currentStart, setCurrentStart] = useState(startOfToday());

  // Generate 7 days starting from currentStart
  const dates = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => addDays(currentStart, i));
  }, [currentStart]);

  const handlePrevDays = () => {
    const newStart = addDays(currentStart, -7);
    if (newStart >= startOfToday()) {
      setCurrentStart(newStart);
    } else {
      setCurrentStart(startOfToday());
    }
  };

  const handleNextDays = () => {
    setCurrentStart(addDays(currentStart, 7));
  };

  const handleDateSelect = (date) => {
    setBookingDate(date);
    setBookingTime(null); // Reset time when date changes
  };

  const handleTimeSelect = (timeValue) => {
    setBookingTime(timeValue);
  };

  const slotItems = useMemo(() => {
    return selectedServices?.map((service) => {
      const profId = serviceProfessionals?.[service.id];
      const member_id = profId === ANY_PROFESSIONAL.id ? undefined : profId;
      return {
        service_id: service.id,
        ...(member_id && { member_id }),
      };
    }) || [];
  }, [selectedServices, serviceProfessionals]);

  const dateFormatted = bookingDate ? format(bookingDate, "yyyy-MM-dd") : null;
  const skipQuery = !dateFormatted || slotItems.length === 0;

  const { data: slotsResponse, isFetching: isLoadingSlots } = useGetAvailabilitySlotsQuery(
    {
      date: dateFormatted,
      items: slotItems,
      slot_interval_minutes: 15,
    },
    { skip: skipQuery }
  );

  const availableSlots = slotsResponse?.data?.slots || slotsResponse?.slots || [];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Select time</h2>
        <p className="mt-1 text-sm text-gray-500">Choose a date and available time slot</p>
      </div>

      {/* Date Dropdown visual (just display selected date) */}
      <div className="flex items-center justify-between rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <CalendarIcon className="h-5 w-5 text-gray-400" />
          <span className="font-medium text-gray-900">
            {bookingDate ? format(bookingDate, "EEEE, d MMMM yyyy") : "Select a date below"}
          </span>
        </div>
      </div>

      {/* Date Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Select a date</h3>
          <div className="flex gap-2">
            <button
              onClick={handlePrevDays}
              disabled={currentStart <= startOfToday()}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-transparent"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleNextDays}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {dates.map((date) => {
            const isSelected = bookingDate && isSameDay(date, bookingDate);
            return (
              <button
                key={date.toString()}
                onClick={() => handleDateSelect(date)}
                className={cn(
                  "flex min-w-[72px] flex-col items-center justify-center rounded-2xl border p-3 transition-colors",
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-gray-200 bg-white hover:border-primary/20 hover:bg-primary/5"
                )}
              >
                <span className={cn("text-xs", isSelected ? "text-primary-foreground/80" : "text-gray-500")}>
                  {format(date, "EEE")}
                </span>
                <span className={cn("mt-1 text-xl font-bold", isSelected ? "text-primary-foreground" : "text-gray-900")}>
                  {format(date, "d")}
                </span>
                <span className={cn("text-xs", isSelected ? "text-primary-foreground/80" : "text-gray-500")}>
                  {format(date, "MMM")}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Selection */}
      {bookingDate && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <h3 className="font-semibold text-gray-900">Pick a time</h3>
          
          {isLoadingSlots ? (
            <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-gray-200">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : availableSlots.length === 0 ? (
            <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50/50">
              <p className="text-sm text-gray-500">No available slots on this date.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {availableSlots.map((slot) => {
                // Determine if starts_at is ISO string or HH:mm string
                const timeString = slot.starts_at;
                let label = timeString;
                let value = timeString;
                
                try {
                  if (timeString.includes("T")) {
                    const dateObj = new Date(timeString);
                    label = new Intl.DateTimeFormat("en-IN", {
                      timeZone: "Asia/Kolkata",
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    }).format(dateObj).replace(/\u202F/g, " ").toUpperCase();
                    value = timeString; // Keep full UTC string
                  } else {
                    // if it's something like "10:00:00"
                    value = timeString.substring(0, 5);
                    const [hours, minutes] = value.split(":");
                    const h = parseInt(hours, 10);
                    const ampm = h >= 12 ? "PM" : "AM";
                    const h12 = h % 12 || 12;
                    label = `${h12}:${minutes} ${ampm}`;
                  }
                } catch (e) {
                  // fallback
                }

                const isSelected = bookingTime === value;
                return (
                  <button
                    key={slot.starts_at}
                    onClick={() => handleTimeSelect(value)}
                    className={cn(
                      "rounded-xl border py-3 text-sm font-medium transition-colors",
                      isSelected
                        ? "border-primary bg-primary/10 text-primary ring-1 ring-primary"
                        : "border-gray-200 bg-white text-gray-700 hover:border-primary/20 hover:bg-gray-50"
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Mobile Back Button - Desktop uses breadcrumbs usually, but good to have */}
      <div className="pt-6 lg:hidden">
        <button
          onClick={onBack}
          className="text-sm font-medium text-gray-500 hover:text-gray-900"
        >
          Back
        </button>
      </div>
    </div>
  );
}
