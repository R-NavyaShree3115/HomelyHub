import assert from "node:assert/strict";
import mongoose from "mongoose";
import test from "node:test";
import { Property } from "./propertyModel.js";

const makeProperty = (imageCount) => new Property({
  propertyName: "Test Stay",
  description: "A comfortable place for a short visit.",
  propertyType: "Flat",
  roomType: "Entire Home",
  maximumGuest: 2,
  amenities: [{ name: "Wifi", icon: "wifi" }],
  images: Array.from({ length: imageCount }, (_, index) => ({
    public_id: `image-${index}`,
    url: `https://example.com/image-${index}.jpg`,
  })),
  price: 2500,
  address: {
    area: "Calangute",
    city: "Goa",
    state: "Goa",
    pincode: "403516",
  },
  userId: new mongoose.Types.ObjectId(),
});

test("accepts the property shape submitted by the frontend", async () => {
  const property = makeProperty(6);

  await assert.doesNotReject(() => property.validate());
  assert.equal(property.price, 2500);
  assert.equal(property.maximumGuest, 2);
  assert.equal(property.address.city, "Goa");
});

test("requires at least six images for a new property", async () => {
  const property = makeProperty(5);

  await assert.rejects(() => property.validate(), /Please upload at least 6 images/);
});