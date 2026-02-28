import React from "react";
import { Grid } from "@mui/material";

const Center = ({ children }) => {
  return (
    <Grid
      container
      minHeight="100vh"
      alignItems="center"
      justifyContent="center"
    >
      {children}
    </Grid>
  );
};

export default Center;
