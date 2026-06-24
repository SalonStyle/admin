# Filter System & Date Picker - Usage Guide

## ✅ Components Created

### 1. **DatePicker Component** (`src/components/admin/date-picker.js`)
A reusable date picker component using shadcn Calendar.

**Features:**
- Single date selection
- Date range selection
- Customizable placeholder
- Auto-close on selection
- Responsive design

**Usage:**
```jsx
import { DatePicker } from "@/components/admin/date-picker";

// Single date
<DatePicker
  date={selectedDate}
  onDateChange={(date) => setSelectedDate(date)}
  placeholder="Select date"
  label="Booking Date"
/>

// Date range
<DatePicker
  mode="range"
  date={dateRange}
  onDateChange={(range) => setDateRange(range)}
  placeholder="Select date range"
/>
```

**Props:**
- `date`: Date object or `{ from: Date, to: Date }` for range mode
- `onDateChange`: Callback function `(date) => void`
- `placeholder`: String (default: "Select date")
- `label`: Optional label text
- `mode`: "single" | "range" (default: "single")
- `fromDate`: Minimum selectable date
- `toDate`: Maximum selectable date
- `disabled`: Boolean
- `className`: Additional CSS classes

---

### 2. **FilterBar Component** (`src/components/admin/filter-bar.js`)
A general-purpose filter bar that displays filters as chips with popovers.

**Features:**
- Multiple filter types (select, date, date range, number, text)
- Shows applied filters as chips
- "Add Filter" dropdown for available filters
- Clear individual filters or all filters
- Custom value formatting
- Auto-updates API calls

**Usage:**
```jsx
import { FilterBar, FILTER_TYPES } from "@/components/admin/filter-bar";

const filterConfig = [
  {
    id: "status",
    label: "Status",
    type: FILTER_TYPES.SELECT,
    placeholder: "Select status",
    options: [
      { value: "pending", label: "Pending" },
      { value: "confirmed", label: "Confirmed" },
    ],
  },
  {
    id: "date_range",
    label: "Date",
    type: FILTER_TYPES.DATE_RANGE,
    placeholder: "Select date range",
  },
  {
    id: "amount",
    label: "Amount",
    type: FILTER_TYPES.NUMBER,
    placeholder: "Enter amount",
    operator: "less_than", // optional
  },
];

<FilterBar
  filters={filterConfig}
  values={filterValues}
  onChange={(newValues) => {
    // Update your state/Redux
    dispatch(setFilters(newValues));
  }}
  onClear={() => {
    // Clear all filters
    dispatch(setFilters({}));
  }}
/>
```

**Filter Types:**

1. **SELECT** (`FILTER_TYPES.SELECT`)
   ```jsx
   {
     id: "status",
     label: "Status",
     type: FILTER_TYPES.SELECT,
     options: [{ value: "pending", label: "Pending" }],
   }
   ```

2. **DATE** (`FILTER_TYPES.DATE`)
   ```jsx
   {
     id: "booking_date",
     label: "Booking Date",
     type: FILTER_TYPES.DATE,
   }
   ```

3. **DATE_RANGE** (`FILTER_TYPES.DATE_RANGE`)
   ```jsx
   {
     id: "date_range",
     label: "Date Range",
     type: FILTER_TYPES.DATE_RANGE,
   }
   ```

4. **NUMBER** (`FILTER_TYPES.NUMBER`)
   ```jsx
   {
     id: "amount",
     label: "Amount",
     type: FILTER_TYPES.NUMBER,
     operator: "less_than", // optional
   }
   ```

5. **TEXT** (`FILTER_TYPES.TEXT`)
   ```jsx
   {
     id: "customer_name",
     label: "Customer Name",
     type: FILTER_TYPES.TEXT,
   }
   ```

**Custom Value Formatting:**
```jsx
{
  id: "status",
  label: "Status",
  type: FILTER_TYPES.SELECT,
  formatValue: (value) => {
    // Custom formatting logic
    return value.toUpperCase();
  },
}
```

---

## 📋 Implementation in Bookings Page

The bookings page now uses both components:

### Filter Configuration
```jsx
const filterConfig = [
  {
    id: "status",
    label: "Status",
    type: FILTER_TYPES.SELECT,
    options: [
      { value: "pending", label: "Pending" },
      { value: "confirmed", label: "Confirmed" },
      // ...
    ],
  },
  {
    id: "date_range",
    label: "Date",
    type: FILTER_TYPES.DATE_RANGE,
  },
  // ...
];
```

### Filter Values to API Conversion
```jsx
const apiFilters = useMemo(() => {
  const apiFilter = {};
  if (filters.status) apiFilter.status = filters.status;
  if (filters.date_range?.from) {
    apiFilter.date_from = filters.date_range.from.toISOString().split("T")[0];
  }
  if (filters.date_range?.to) {
    apiFilter.date_to = filters.date_range.to.toISOString().split("T")[0];
  }
  return apiFilter;
}, [filters]);
```

### Form Integration
The `SimpleForm` component now automatically uses `DatePicker` for `type: "date"` fields:

```jsx
{
  id: "booking_date",
  label: "Booking Date",
  type: "date", // Automatically uses DatePicker
  placeholder: "Select date",
}
```

---

## 🎨 Visual Design

The filter bar displays:
- **Applied filters** as chips with:
  - Filter label and value
  - Dropdown arrow (click to edit)
  - X button (click to remove)
- **"Add Filter" button** showing available filters
- **"Clear Filters" button** (only when filters are applied)

---

## 🔄 How It Works

1. **Filter Selection**: Click "Add Filter" → Select a filter → Popover opens
2. **Filter Application**: Select value → Filter chip appears
3. **Filter Editing**: Click chip → Popover opens with current value
4. **Filter Removal**: Click X on chip → Filter removed
5. **API Updates**: Filter changes automatically trigger API calls via Redux

---

## 📦 Dependencies

- `react-day-picker` - Calendar component
- `@radix-ui/react-popover` - Popover component
- `@radix-ui/react-dropdown-menu` - Dropdown menu
- `date-fns` - Date formatting

All dependencies are installed and ready to use.

---

## 🚀 Next Steps

You can now use these components in:
- Services Management
- Users/Staff Management
- Customers Management
- Payments Management
- Any other page that needs filtering

Just import and configure the filters as shown above!

