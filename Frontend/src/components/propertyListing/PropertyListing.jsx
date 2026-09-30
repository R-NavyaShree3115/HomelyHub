import React, { useEffect } from "react";
import "../../css/PropertyListing.css";

import PropertyImg from "./PropertyImg";
import PaymentForm from "./PaymentForm";
import PropertyAmenities from "./PropertyAmenities";
import PropertMapInfo from "./PropertyMapInfo";

import { useParams } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner";

import { getPropertyDetails } from "../../store/PropertyDetails/propertyDetail-action";
import { useDispatch, useSelector } from "react-redux";

const PropertyListing = () => {

    const { id } = useParams();

    const dispatch = useDispatch();

    const {
        loading,
        propertyDetails,
        error
    } = useSelector(
        (state) => state.propertyDetailsSlice
    );

    useEffect(() => {

        if (id) {
            dispatch(getPropertyDetails(id));
        }

    }, [dispatch, id]);


    // =========================
    // LOADING
    // =========================
    if (loading) {
        return (
            <div className="row justify-content-around mt-5">
                <LoadingSpinner />
            </div>
        );
    }


    // =========================
    // ERROR
    // =========================
    if (error) {
        return (
            <div className="row justify-content-around mt-5">
                <h3>{error}</h3>
            </div>
        );
    }


    // =========================
    // NO DATA
    // =========================
    if (!propertyDetails) {
        return (
            <div className="row justify-content-around mt-5">
                <h3>Property not found</h3>
            </div>
        );
    }


    const {
        propertyName,
        address,
        description,
        images,
        amenities,
        maximumGuest,
        price,
        currentBookings
    } = propertyDetails;


    return (
        <div className="property-container">

            <p className="property-header">
                {propertyName}
            </p>


            <h6 className="property-location">

                <span className="material-symbols-outlined">
                    house
                </span>

                <span className="location">
                    {`${address?.area || ""}, ${address?.city || ""}, ${address?.state || ""}`}
                </span>

            </h6>


            <PropertyImg
                images={images}
            />


            <div className="middle-container row">

                <div className="des-and-amenities col-md-8 col-sm-12 col-12">

                    <h2 className="property-description-header">
                        Description
                    </h2>

                    <p className="property-description">

                        {description}

                        <br />
                        <br />

                        Max number of guests: {maximumGuest}

                    </p>

                    <hr />

                    <PropertyAmenities
                        amenities={amenities}
                    />

                </div>


                <div className="property-payment col-md-4 col-sm-12 col-12">

                    <PaymentForm
                        propertyId={id}
                        price={price}
                        propertyName={propertyName}
                        address={address}
                        maximumGuest={maximumGuest}
                        currentBookings={currentBookings}
                    />

                </div>

            </div>


            <hr />


            <div className="property-map">

                <div className="map-image-exinfo-container row">

                    <PropertMapInfo
                        address={address}
                    />

                </div>

            </div>

        </div>
    );
};

export default PropertyListing;