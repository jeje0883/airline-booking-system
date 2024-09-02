// import Banner from "../components/Banner";
// import Highlights from "../components/Highlights";
// import Course from "../components/Course"
import React from 'react';
import NavBar from "../components/NavBar";
import Carousel from "../components/Carousel";
import { BackButton, ContinueButton } from '../components/Buttons';


export default function FlightOptions() {
  return (
    <div>
    <NavBar />
      <div className="container">
        <h5 className="mt-5 ms-5 px-5" > Select you flight</h5>
        <h2 className="ms-5 px-5">Davao DVO bound for Manila MNL</h2>
        <Carousel />
        <div>
          <BackButton link="http://localhost:3000/searchflight" />
          <ContinueButton link="http://localhost:3000/guestdetails" />
        </div>
      </div>
    </div>
  );
}