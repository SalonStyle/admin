import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowRight } from "lucide-react"
import { buildTimeSlots, formatPrice, formatDuration, getServiceProfessionalLabel } from "@/lib/helper"

const TIME_SLOTS = buildTimeSlots()

function BookingSummaryPanel({
  selectedServices,
  serviceProfessionals,
  members,
  bookingDate,
  bookingTime,
  totalAmount,
  totalDuration,
  continueLabel,
  canContinue,
  isSubmitting,
  onContinue,
}) {
  return (
    <div className="flex h-full flex-col bg-[#fafafa]">
      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        {selectedServices.length === 0 ? (
          <p className="text-sm text-gray-500">No services selected yet</p>
        ) : (
          selectedServices.map((service) => (
            <div
              key={service.id}
              className="border-b border-gray-200 pb-4 last:border-0"
            >
              <p className="font-medium text-gray-900">{service.name}</p>
              <p className="mt-1 text-sm text-gray-500">
                {formatDuration(service.duration_minutes)}
                {" · "}
                {getServiceProfessionalLabel(serviceProfessionals[service.id], members)}
              </p>
            </div>
          ))
        )}

        {bookingDate && bookingTime && (
          <div className="rounded-lg border border-gray-200 bg-white p-3 text-sm">
            <p className="font-medium text-gray-900">
              {format(bookingDate, "EEE, d MMM yyyy")}
            </p>
            <p className="mt-1 text-gray-500">
              {TIME_SLOTS.find((slot) => slot.value === bookingTime)?.label ||
                bookingTime}
            </p>
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm text-gray-600">Total</span>
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(totalAmount)}
          </span>
        </div>
        {totalDuration > 0 && (
          <p className="mb-4 text-xs text-gray-500">
            {formatDuration(totalDuration)} total duration
          </p>
        )}
        <Button
          type="button"
          onClick={onContinue}
          disabled={!canContinue || isSubmitting}
          className="h-12 w-full rounded-xl bg-gray-900 text-base font-medium text-white hover:bg-gray-800"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              {continueLabel}
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

export default BookingSummaryPanel
