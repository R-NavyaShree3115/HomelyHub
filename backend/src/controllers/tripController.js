import { Property } from "../Models/propertyModel.js";
import { planTrip } from "../ai/tripPlanner.js";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const createTripPlan = async (req, res) => {
    try {
        const { destination, interests = [] } = req.body;
        const budget = Number(req.body.budget);
        const days = Number(req.body.days);
        const people = Number(req.body.people);

        if (
            typeof destination !== "string" ||
            !destination.trim() ||
            !Number.isFinite(budget) || budget <= 0 ||
            !Number.isInteger(days) || days < 1 || days > 14 ||
            !Number.isInteger(people) || people < 1 || people > 20 ||
            !Array.isArray(interests)
        ) {
            return res.status(400).json({
                status: "fail",
                message: "Enter a destination, positive budget, 1-14 days, and 1-20 people.",
            });
        }

        const cleanDestination = destination.trim();
        const locationPattern = cleanDestination
            .split(/\s+/)
            .map(escapeRegex)
            .join("\\s*");
        const locationRegex = new RegExp(locationPattern, "i");
        const perNight = budget / days;
        const [plan, properties] = await Promise.all([
            planTrip({
                destination: cleanDestination,
                budget,
                days,
                people,
                interests: interests.filter((interest) => typeof interest === "string").slice(0, 8),
            }),
            Property.find({
                $and: [
                    {
                        $or: [
                            { "address.city": locationRegex },
                            { "address.state": locationRegex },
                            { "address.area": locationRegex },
                        ],
                    },
                    {
                        $or: [
                            { price: { $lte: perNight } },
                            { price: { $exists: false }, pricePerNight: { $lte: perNight } },
                        ],
                    },
                    {
                        $or: [
                            { maximumGuest: { $gte: people } },
                            { maximumGuest: { $exists: false }, maximumGuests: { $gte: people } },
                        ],
                    },
                ],
            }).limit(6),
        ]);

        return res.status(200).json({
            status: "success",
            data: { plan, perNight, properties },
        });
    } catch (error) {
        console.error("Trip planning failed", error);
        return res.status(502).json({
            status: "fail",
            message: "Unable to generate a trip plan right now. Please try again.",
        });
    }
};

export { createTripPlan };