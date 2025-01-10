import mongoose from "mongoose";


const {Schema,model,ObjectId} = mongoose;

const PropertySchema = new Schema({

    property_info: {
        property_type: { type: String, required: true },
        property_genre: { type: String, required: true },
        state: { type: String, required: true },
        property_location: { type: String, required: true },
        society_name: { type: String, required: true },
        address: { type: String, required: true },
      },
      sale_details: {
        sale_type: { type: String },
        ownership: { type: String },
        number_of_floors: { type: Number },
        availability: { type: String },
        property_on_the_floor: { type: Number },
        possession_by: { type: Date },
      },
      property_description: {
        built_up_area: { type: Number },
        carpet_area: { type: Number },
        super_area: { type: Number },
        land_area: { type: Number },
        expected_price: { type: Number },
        booking_amount: { type: Number },
        maintenance_charges: { type: Number },
        no_of_bedroom: { type: Number },
        no_of_bathroom: { type: Number },
        no_of_balcony: { type: Number},
        description: { type: String,required: true },
      },
      user: { type: ObjectId, ref: 'User', required: true }, // Reference to the user who posted the property
      createdAt: { type: Date, default: Date.now },
      isFeatured: {
        type: Boolean,
        default: false, 
      },




})

PropertySchema.index({
  "property_info.property_location": "text",
  "property_description.no_of_bedroom": "text",
  "property_description.description": "text",
});


export default model("Properties",PropertySchema);