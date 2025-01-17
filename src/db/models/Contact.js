import { Schema, model } from "mongoose";

import { typeList } from "../../constants/contacts.js";

const contactSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    },
    isFavourite: {
        type: Boolean,
        default: false,
    },
    contactType: {
        type: String,
        enum: typeList,
        required: true,
        default: 'personal',
    },
    photo: {
        type: String,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
    }
}, {
    versionKey: false,
    timestamps: true,
});

export const ContactsCollection = model('Contact', contactSchema);

