import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

function CustomerStep({ onSubmit, onBack }) {
  const [customer, setCustomer] = useState({ name: "", phone: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (customer.name && customer.phone) {
      onSubmit(customer);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Customer details</h2>
        <p className="mt-1 text-sm text-gray-500">
          Enter the customer information for this booking
        </p>
      </div>

      <form id="customer-booking-form" onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="customer_name">Full name</Label>
          <Input
            id="customer_name"
            required
            placeholder="Customer name"
            value={customer.name}
            onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
            className="h-11 shadow-none"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="customer_mobile">Mobile number</Label>
          <Input
            id="customer_mobile"
            required
            type="tel"
            placeholder="+91 9876543210"
            value={customer.phone}
            onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
            className="h-11 shadow-none"
          />
        </div>
      </form>

      {/* Mobile Back Button */}
      <div className="pt-6 lg:hidden">
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-medium text-gray-500 hover:text-gray-900"
        >
          Back
        </button>
      </div>
    </div>
  );
}

export default CustomerStep;
