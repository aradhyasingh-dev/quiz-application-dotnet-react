// import React, { useEffect, useState } from "react";
// import useStateContext from "../hooks/useStateContext";
// import { BASE_URL, createApiEndpoint, ENDPOINTS } from "../api";

// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardMedia,
//   LinearProgress,
//   List,
//   ListItemButton,
//   Typography,
// } from "@mui/material";

// import { useNavigate } from "react-router-dom";

// const getFormatedTime = (sec) => {
//   const m = String(Math.floor(sec / 60)).padStart(2, "0");
//   const s = String(sec % 60).padStart(2, "0");
//   return `${m}:${s}`;
// };

// const Quiz = () => {
//   const { context, setContext } = useStateContext();
//   const navigate = useNavigate();

//   const [qns, setQns] = useState([]);
//   const [qnsIndex, setQnsIndex] = useState(0);
//   const [timeTaken, setTimeTaken] = useState(0);

//   // ✅ protect route
//   useEffect(() => {
//     if (!context?.participantId) {
//       navigate("/");
//       return;
//     }

//     // reset quiz state once
//     setContext({
//       selectedOptions: [],
//       timeTaken: 0,
//     });

//     // fetch questions
//     createApiEndpoint(ENDPOINTS.question)
//       .fetch()
//       .then((res) => setQns(res.data))
//       .catch(console.error);

//     // timer
//     const timer = setInterval(() => {
//       setTimeTaken((prev) => prev + 1);
//     }, 1000);

//     return () => clearInterval(timer);
//   }, []);

//   // loading guard
//   if (!qns.length) return <Typography>Loading Quiz...</Typography>;

//   const currentQn = qns[qnsIndex];

//   const updateAnswer = (qnId, optionIndex) => {
//     const updated = [
//       ...(context.selectedOptions || []),
//       { qnId, selected: optionIndex },
//     ];

//     if (qnsIndex < qns.length - 1) {
//       setContext({ selectedOptions: updated });
//       setQnsIndex((prev) => prev + 1);
//     } else {
//       setContext({
//         selectedOptions: updated,
//         timeTaken,
//       });

//       navigate("/result");
//     }
//   };

//   return (
//     <Card sx={{ maxWidth: 640, mx: "auto", mt: 5 }}>
//       <CardHeader
//         title={`Question ${qnsIndex + 1} of ${qns.length}`}
//         action={<Typography>{getFormatedTime(timeTaken)}</Typography>}
//       />

//       <LinearProgress
//         variant="determinate"
//         value={((qnsIndex + 1) * 100) / qns.length}
//       />

//       {currentQn?.imageName && (
//         <CardMedia
//           component="img"
//           image={BASE_URL + "images/" + currentQn.imageName}
//         />
//       )}

//       <CardContent>
//         <Typography variant="h6">{currentQn?.qnInWords}</Typography>

//         <List>
//           {currentQn?.options?.map((item, idx) => (
//             <ListItemButton
//               key={idx}
//               onClick={() => updateAnswer(currentQn.qnId, idx + 1)}
//             >
//               <b>{String.fromCharCode(65 + idx)}.</b> {item}
//             </ListItemButton>
//           ))}
//         </List>
//       </CardContent>
//     </Card>
//   );
// };

// export default Quiz;

import React, { useEffect, useState } from "react";
import useStateContext from "../hooks/useStateContext";
import { BASE_URL, createApiEndpoint, ENDPOINTS } from "../api";

import {
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  LinearProgress,
  List,
  ListItemButton,
  Typography,
  Button,
  Box,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

const getFormatedTime = (sec) => {
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
};

const Quiz = () => {
  const { context, setContext } = useStateContext();
  const navigate = useNavigate();

  const [qns, setQns] = useState([]);
  const [qnsIndex, setQnsIndex] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);

  // protect route
  useEffect(() => {
    if (!context?.participantId) {
      navigate("/");
      return;
    }

    setContext({
      ...context,
      selectedOptions: [],
      timeTaken: 0,
    });

    createApiEndpoint(ENDPOINTS.question)
      .fetch()
      .then((res) => setQns(res.data))
      .catch(console.error);

    const timer = setInterval(() => {
      setTimeTaken((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!qns.length) return <Typography>Loading Quiz...</Typography>;

  const currentQn = qns[qnsIndex];

  // ✅ store or update answer (NOT auto next)
  const selectAnswer = (qnId, optionIndex) => {
    let updated = [...(context.selectedOptions || [])];

    const existingIndex = updated.findIndex((x) => x.qnId === qnId);

    if (existingIndex > -1) {
      updated[existingIndex].selected = optionIndex;
    } else {
      updated.push({ qnId, selected: optionIndex });
    }

    setContext({
      ...context,
      selectedOptions: updated,
    });
  };

  // ✅ Next Button
  const handleNext = () => {
    if (qnsIndex < qns.length - 1) {
      setQnsIndex((prev) => prev + 1);
    } else {
      setContext({
        ...context,
        timeTaken,
      });
      navigate("/result");
    }
  };

  // ✅ Back Button
  const handleBack = () => {
    if (qnsIndex > 0) {
      setQnsIndex((prev) => prev - 1);
    }
  };

  // check selected option for current question
  const selectedOption = context.selectedOptions?.find(
    (x) => x.qnId === currentQn.qnId,
  )?.selected;

  return (
    <Card sx={{ maxWidth: 640, mx: "auto", mt: 5 }}>
      <CardHeader
        title={`Question ${qnsIndex + 1} of ${qns.length}`}
        action={<Typography>{getFormatedTime(timeTaken)}</Typography>}
      />

      <LinearProgress
        variant="determinate"
        value={((qnsIndex + 1) * 100) / qns.length}
      />

      {currentQn?.imageName && (
        <CardMedia
          component="img"
          image={BASE_URL + "images/" + currentQn.imageName}
        />
      )}

      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {currentQn?.qnInWords}
        </Typography>

        <List>
          {currentQn?.options?.map((item, idx) => (
            <ListItemButton
              key={idx}
              selected={selectedOption === idx + 1}
              onClick={() => selectAnswer(currentQn.qnId, idx + 1)} // ✅ 1-based fix
            >
              <b>{String.fromCharCode(65 + idx)}.</b> {item}
            </ListItemButton>
          ))}
        </List>

        {/* ✅ Back / Next Buttons */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button
            variant="contained"
            disabled={qnsIndex === 0}
            onClick={handleBack}
          >
            Back
          </Button>

          <Button
            variant="contained"
            onClick={handleNext}
            disabled={!selectedOption} // cannot go next without selecting
          >
            {qnsIndex === qns.length - 1 ? "Finish" : "Next"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Quiz;
