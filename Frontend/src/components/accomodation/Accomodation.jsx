import React, { useEffect, useState } from "react";
import "../../css/Accomodation.css";
import ProgressSteps from "../ProgressSteps";
import MyAccomodation from "./MyAccomodation";
import { Link } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner";
import { axiosInstance } from "../../utils/axios";

const Accomodation = () => {
  const [accomodation, setAccomodation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    axiosInstance.get("/v1/rent/property/mine")
      .then(({ data }) => {
        if (active) setAccomodation(Array.isArray(data.data) ? data.data : []);
      })
      .catch((requestError) => {
        if (active) {
          setError(requestError.response?.status === 401
            ? "Sign in to manage your listings."
            : "Unable to load your listings right now.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  return (
    <>
      <ProgressSteps accomodation />
      <div className="accom-container">
        <Link to="/accomodationform">
          <button className="add-new-place">+ Add new place</button>
        </Link>
        {loading && <LoadingSpinner />}
        {error && !loading && <p role="alert">{error}</p>}
        {accomodation.length === 0 && !loading && !error && (
          <p>Accomodation not available</p>
        )}
        {accomodation.length > 0 && !loading && (
          <MyAccomodation accomodation={accomodation} loading={loading} />
        )}
      </div>
    </>
  );
};

export default Accomodation;
