// import React, { useEffect } from "react";
// import {
//   Box,
//   Button,
//   Card,
//   CardContent,
//   TextField,
//   Typography,
// } from "@mui/material";

// import Center from "./Center";
// import useForm from "../hooks/useForm";
// import { createApiEndpoint, ENDPOINTS } from "../api";
// import useStateContext from "../hooks/useStateContext";
// import { useNavigate } from "react-router-dom";

// const getFreshModelObject = () => ({
//   name: "",
//   email: "",
// });

// const Login = () => {
//   const { context, setContext, resetContext } = useStateContext();
//   const navigate = useNavigate();

//   const { values, errors, setErrors, handleInputChange } =
//     useForm(getFreshModelObject);

//   useEffect(() => {
//     resetContext();
//   }, []);

//   const validate = () => {
//     let temp = {};

//     temp.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)
//       ? ""
//       : "Email not valid";

//     temp.name = values.name ? "" : "Required";

//     setErrors(temp);

//     return Object.values(temp).every((x) => x === "");
//   };

//   const login = (e) => {
//     e.preventDefault();

//     if (!validate()) return;

//     createApiEndpoint(ENDPOINTS.participant)
//       .post(values)
//       .then((response) => {
//         // ✅ IMPORTANT — authentication context set here
//         setContext({
//           participantId: response.data.participantId,
//           selectedOptions: [],
//           timeTaken: 0,
//         });

//         navigate("/quiz");
//       })
//       .catch((err) => console.log(err));
//   };

//   return (
//     <Center>
//       <Card sx={{ width: 400 }}>
//         <CardContent>
//           <Typography variant="h4" align="center" sx={{ my: 3 }}>
//             Quiz App
//           </Typography>

//           <Box
//             component="form"
//             onSubmit={login}
//             sx={{
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               "& .MuiTextField-root": { m: 1, width: "90%" },
//             }}
//           >
//             <TextField
//               label="Email"
//               name="email"
//               value={values.email}
//               onChange={handleInputChange}
//               error={Boolean(errors.email)}
//               helperText={errors.email}
//             />

//             <TextField
//               label="Name"
//               name="name"
//               value={values.name}
//               onChange={handleInputChange}
//               error={Boolean(errors.name)}
//               helperText={errors.name}
//             />

//             <Button
//               type="submit"
//               variant="contained"
//               size="large"
//               sx={{ width: "90%", mt: 2 }}
//             >
//               Start
//             </Button>
//           </Box>
//         </CardContent>
//       </Card>
//     </Center>
//   );
// };

// export default Login;

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";

import Center from "./Center";
import useForm from "../hooks/useForm";
import { createApiEndpoint, ENDPOINTS } from "../api";
import useStateContext from "../hooks/useStateContext";
import { useNavigate } from "react-router-dom";

const getFreshModelObject = () => ({
  name: "",
  email: "",
});

const Login = () => {
  const { setContext, resetContext } = useStateContext();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const { values, errors, setErrors, handleInputChange } =
    useForm(getFreshModelObject);

  // reset quiz context on login page load
  useEffect(() => {
    resetContext();
  }, [resetContext]);

  // validation
  const validate = () => {
    let temp = {};

    temp.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)
      ? ""
      : "Email not valid";

    temp.name = values.name.trim() ? "" : "Name is required";

    setErrors(temp);

    return Object.values(temp).every((x) => x === "");
  };

  // login submit
  const login = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const res = await createApiEndpoint(ENDPOINTS.participant).post(values);

      // update global context
      setContext({
        participantId: res.data.participantId,
        selectedOptions: [],
        timeTaken: 0,
      });

      navigate("/quiz");
    } catch (err) {
      console.error("Login failed:", err);
      alert("Server error — try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Center>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h4" align="center" sx={{ my: 3 }}>
            Quiz App
          </Typography>

          <Box
            component="form"
            onSubmit={login}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              "& .MuiTextField-root": { m: 1, width: "90%" },
            }}
          >
            <TextField
              label="Email"
              name="email"
              value={values.email}
              onChange={handleInputChange}
              error={Boolean(errors.email)}
              helperText={errors.email}
            />

            <TextField
              label="Name"
              name="name"
              value={values.name}
              onChange={handleInputChange}
              error={Boolean(errors.name)}
              helperText={errors.name}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ width: "90%", mt: 2 }}
            >
              {loading ? "Starting..." : "Start Quiz"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Center>
  );
};

export default Login;
