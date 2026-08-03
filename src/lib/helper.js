export function buildTimeSlots() {
  const slots = [];
  for (let hour = 9; hour <= 20; hour++) {
    for (const minute of [0, 30]) {
      if (hour === 20 && minute > 0) break;
      const value = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
      const period = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 || 12;
      const label = `${displayHour}:${String(minute).padStart(2, "0")} ${period}`;
      slots.push({ value, label });
    }
  }
  return slots;
}

export function formatPrice(amount) {
  return `₹${Number(amount || 0).toFixed(0)}`;
}

export function getServiceProfessionalLabel(professionalId, members = []) {
  if (!professionalId || professionalId === "any") {
    return "No preference"
  }

  return members.find((member) => member.id === professionalId)?.name || "No preference"
}

export function formatDuration(minutes) {
  if (!minutes) return "";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours} hour${hours > 1 ? "s" : ""}`;
  return `${hours} hr ${mins} min`;
}
