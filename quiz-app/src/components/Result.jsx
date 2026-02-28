import React, { useEffect, useState } from "react";
import useStateContext from "../hooks/useStateContext";
import { createApiEndpoint, ENDPOINTS } from "../api";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { green } from "@mui/material/colors";
import Answer from "./Answer";

const getFormatedTime = (sec = 0) => {
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
};

const Result = () => {
  const { context, setContext } = useStateContext();

  const [score, setScore] = useState(0);
  const [qnAnswer, setQnAnswer] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!context?.selectedOptions?.length) return;

    const ids = context.selectedOptions.map((x) => x.qnId);

    createApiEndpoint(ENDPOINTS.getAnswers)
      .post(ids)
      .then((res) => {
        const qna = context.selectedOptions.map((x) => ({
          ...x,
          ...res.data.find((y) => y.qnId === x.qnId),
        }));

        setQnAnswer(qna);
        calculateScore(qna);
      })
      .catch(console.error);
  }, []);

  const calculateScore = (qna) => {
    const total = qna.reduce(
      (acc, curr) => (curr.answer === curr.selected ? acc + 1 : acc),
      0,
    );

    setScore(total);
  };

  const submitScore = () => {
    if (!context?.participantId) return;

    createApiEndpoint(ENDPOINTS.participant)
      .put(context.participantId, {
        participantId: context.participantId,
        score: score,
        timeTaken: context.timeTaken,
      })
      .then(() => {
        setShowAlert(true);

        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      })
      .catch(console.error);
  };

  const restart = () => {
    setContext({
      timeTaken: 0,
      selectedOptions: [],
    });

    navigate("/quiz");
  };

  return (
    <>
      <Card
        sx={{
          mt: 5,
          display: "flex",
          width: "100%",
          maxWidth: 640,
          mx: "auto",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
          <CardContent sx={{ textAlign: "center" }}>
            <Typography variant="h4">Congratulations</Typography>

            <Typography variant="h6">Your Score</Typography>

            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              <span style={{ color: green[500], marginLeft: 6 }}>{score}</span>{" "}
              / {qnAnswer.length}
            </Typography>

            <Typography variant="h6">
              Took: {getFormatedTime(context.timeTaken)}
            </Typography>

            <Button
              variant="contained"
              sx={{ mx: 1, mt: 2 }}
              size="small"
              onClick={submitScore}
            >
              Submit
            </Button>

            <Button
              variant="contained"
              sx={{ mx: 1, mt: 2 }}
              size="small"
              onClick={restart}
            >
              Re-Try
            </Button>

            <Alert
              severity="success"
              sx={{
                width: "60%",
                m: "10px auto",
                visibility: showAlert ? "visible" : "hidden",
              }}
            >
              Score Updated
            </Alert>
          </CardContent>
        </Box>

        <CardMedia
          component="img"
          sx={{ width: 240 }}
          image="/result.jpg"
          alt="result"
        />
      </Card>

      {/* pass correct prop */}
      <Answer qnAnswer={qnAnswer} />
    </>
  );
};

export default Result;
