const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const rsvpSchema = new Schema({
    status: {
        type: String,
        enum: ["YES", "NO", "MAYBE"],
        required: [true, "Reservation Status is Required"]
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    eventId: {
        type: Schema.Types.ObjectId,
        ref: "Event",
        required: true
    }
});

module.exports = mongoose.model("Rsvp", rsvpSchema);