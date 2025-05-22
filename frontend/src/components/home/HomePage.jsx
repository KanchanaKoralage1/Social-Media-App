import { Grid } from "@mui/material";
import React from "react";
import { Route, Routes } from "react-router-dom"
import Navigation from "../Navigation/Navigation";
import HomeSection from "../middle section/HomeSection";
import RightSide from "../right section/RightSide";
import ProfilePage from "../profile/ProfilePage";
import TweetDetails from "../TweetDetails/TweetDetails";


function HomePage() {
  return (
    <Grid container xs={12}  className="px-5 lg:px-36 justify-between ">
      
      <Grid item xs={0} lg={2.5} className="flex justify-center lg:block  ">
        <Navigation/>
      </Grid>

      
      <Grid item xs={12} lg={6} className="flex justify-center lg:block ">

        <Routes>
          <Route path="/" element={<HomeSection/>}/>
          <Route path="/home" element={<HomeSection/>}/>
          <Route path="/profile/:id" element={<ProfilePage/>}/>
          <Route path="/tweet/:id" element={<TweetDetails/>}/>
        </Routes>
       
      </Grid>

      
      <Grid item xs={0} lg={3} className="flex justify-center lg:block">
        <RightSide/>
      </Grid>
    </Grid>
  );
}

export default HomePage;
