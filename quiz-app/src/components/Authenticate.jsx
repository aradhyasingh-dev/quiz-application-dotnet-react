// import React from "react";
// import useStateContext from "../hooks/useStateContext";
// import { Navigate, Outlet } from "react-router-dom";

// const Authenticate = () => {
//   const { context } = useStateContext();
//   return
//   context.participantId == 0 ? <Navigate to="/" /> : <Outlet />;
// };

// export default Authenticate;

import React from "react";
import useStateContext from "../hooks/useStateContext";
import { Navigate, Outlet } from "react-router-dom";

const Authenticate = () => {
  const { context } = useStateContext();

  if (!context?.participantId || context.participantId === 0) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default Authenticate;
