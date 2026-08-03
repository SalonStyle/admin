import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

function CustomerStep({ customer, onChange }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Customer details</h2>
        <p className="mt-1 text-sm text-gray-500">
          Enter the customer information for this booking
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="customer_name">Full name</Label>
          <Input
            id="customer_name"
            placeholder="Customer name"
            value={customer.name}
            onChange={(e) => onChange("name", e.target.value)}
            className="h-11 shadow-none"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="customer_mobile">Mobile number</Label>
          <Input
            id="customer_mobile"
            type="tel"
            placeholder="+91 9876543210"
            value={customer.mobile}
            onChange={(e) => onChange("mobile", e.target.value)}
            className="h-11 shadow-none"
          />
        </div>
        {/* <div className="space-y-2">
          <Label htmlFor="customer_email">Email (optional)</Label>
          <Input
            id="customer_email"
            type="email"
            placeholder="customer@example.com"
            value={customer.email}
            onChange={(e) => onChange("email", e.target.value)}
            className="h-11 shadow-none"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="customer_notes">Notes (optional)</Label>
          <Textarea
            id="customer_notes"
            placeholder="Any special requests..."
            value={customer.notes}
            onChange={(e) => onChange("notes", e.target.value)}
            className="min-h-[100px] shadow-none"
          />
        </div> */}
      </div>
    </div>
  );
}

export default CustomerStep;
