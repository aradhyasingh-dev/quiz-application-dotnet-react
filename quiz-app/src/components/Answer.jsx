import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  CardMedia,
  List,
  ListItem,
  Typography,
} from "@mui/material";

import React, { useState } from "react";
import { BASE_URL } from "../api";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";
import { red, green } from "@mui/material/colors";

const Answer = ({ qnAnswer = [] }) => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  // ✅ safe color marker
  const markCorrectOrNot = (qna, idx) => {
    const optionNumber = idx + 1; // convert to 1-based

    if (optionNumber === qna.answer) {
      return { sx: { color: green[500], fontWeight: 600 } };
    }

    if (optionNumber === qna.selected && qna.selected !== qna.answer) {
      return { sx: { color: red[500] } };
    }

    return {};
  };
  return (
    <Box sx={{ mt: 5, width: "100%", maxWidth: 640, mx: "auto" }}>
      {qnAnswer.map((item, j) => (
        <Accordion
          disableGutters
          key={j}
          expanded={expanded === j}
          onChange={handleChange(j)}
        >
          <AccordionSummary
            expandIcon={
              <ExpandCircleDownIcon
                sx={{
                  color: item.answer === item.selected ? green[500] : red[500],
                }}
              />
            }
          >
            <Typography sx={{ width: "90%", flexShrink: 0 }}>
              {item.qnInWords}
            </Typography>
          </AccordionSummary>

          <AccordionDetails>
            {item.imageName && (
              <CardMedia
                component="img"
                image={BASE_URL + "images/" + item.imageName}
                sx={{ m: "10px auto", width: "auto" }}
              />
            )}

            <List>
              {(item.options || []).map((x, i) => (
                <ListItem key={i}>
                  <Typography {...markCorrectOrNot(item, i)}>
                    <b>{String.fromCharCode(65 + i)}.</b> {x}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default Answer;
