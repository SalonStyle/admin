import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    price: { type: Number, required: true },
    category: { type: String, require: true },
    status: { type: Boolean },
    // salonId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Service ||
  mongoose.model("Service", ServiceSchema);
