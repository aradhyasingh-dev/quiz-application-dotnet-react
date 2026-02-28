// import React, { useEffect, useState } from "react";
// import useStateContext from "../hooks/useStateContext";
// import { BASE_URL, createApiEndpoint, ENDPOINTS } from "../api";

// import {
//   Box,
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

//   const [qns, setQns] = useState([]);
//   const [qnsIndex, setQnsIndex] = useState(0);
//   const [timeTaken, setTimeTaken] = useState(0);
//   const navigate = useNavigate();
//   useEffect(() => {
//     setContext({ timeTaken: 0, selectedOptions: [] });

//     createApiEndpoint(ENDPOINTS.question)
//       .fetch()
//       .then((res) => setQns(res.data))
//       .catch(console.error);

//     const timer = setInterval(() => setTimeTaken((p) => p + 1), 1000);

//     return () => clearInterval(timer);
//   }, []);

//   if (!qns.length) return <Typography>Loading...</Typography>;

//   const currentQn = qns[qnsIndex];

//   const updateAnswer = (qnId, optionIndex) => {
//     const updated = [
//       ...context.selectedOptions,
//       { qnId, selected: optionIndex },
//     ];

//     if (qnsIndex < qns.length - 1) {
//       setContext({ selectedOptions: updated });
//       setQnsIndex(qnsIndex + 1);
//     } else {
//       setContext({ selectedOptions: updated, timeTaken });
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

//       {currentQn.imageName && (
//         <CardMedia
//           component="img"
//           image={BASE_URL + "images/" + currentQn.imageName}
//         />
//       )}

//       <CardContent>
//         <Typography variant="h6">{currentQn.qnInWords}</Typography>

//         <List>
//           {currentQn.options.map((item, idx) => (
//             <ListItemButton
//               key={idx}
//               onClick={() => updateAnswer(currentQn.qnId, idx)}
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

  // ✅ protect route
  useEffect(() => {
    if (!context?.participantId) {
      navigate("/");
      return;
    }

    // reset quiz state once
    setContext({
      selectedOptions: [],
      timeTaken: 0,
    });

    // fetch questions
    createApiEndpoint(ENDPOINTS.question)
      .fetch()
      .then((res) => setQns(res.data))
      .catch(console.error);

    // timer
    const timer = setInterval(() => {
      setTimeTaken((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // loading guard
  if (!qns.length) return <Typography>Loading Quiz...</Typography>;

  const currentQn = qns[qnsIndex];

  const updateAnswer = (qnId, optionIndex) => {
    const updated = [
      ...(context.selectedOptions || []),
      { qnId, selected: optionIndex },
    ];

    if (qnsIndex < qns.length - 1) {
      setContext({ selectedOptions: updated });
      setQnsIndex((prev) => prev + 1);
    } else {
      setContext({
        selectedOptions: updated,
        timeTaken,
      });

      navigate("/result");
    }
  };

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
        <Typography variant="h6">{currentQn?.qnInWords}</Typography>

        <List>
          {currentQn?.options?.map((item, idx) => (
            <ListItemButton
              key={idx}
              onClick={() => updateAnswer(currentQn.qnId, idx + 1)}
            >
              <b>{String.fromCharCode(65 + idx)}.</b> {item}
            </ListItemButton>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default Quiz;
