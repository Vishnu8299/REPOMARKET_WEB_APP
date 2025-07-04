import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Stack,
  Chip,
  Divider,
  Fade,
  Collapse,
  Avatar,
  Tooltip,
  Grow,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import GroupIcon from "@mui/icons-material/Group";
import axios from "axios";

const API_URL = "/api/hackathons";

const getStatusColor = (status: string) => {
  switch (status) {
    case "UPCOMING":
      return "#1976d2";
    case "ONGOING":
      return "#43a047";
    case "COMPLETED":
      return "#ffa726";
    default:
      return "#90caf9";
  }
};

const HackathonList: React.FC = () => {
  const [hackathons, setHackathons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get(API_URL)
      .then((res) => {
        setHackathons(res.data.data || []);
        setError(null);
      })
      .catch(() => {
        setError("Failed to load hackathons.");
        setHackathons([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#181A20", py: 6 }}>
      <Fade in timeout={700}>
        <Typography
          variant="h4"
          sx={{
            color: "#90caf9",
            mb: 4,
            fontWeight: 700,
            textAlign: "center",
            letterSpacing: 1,
            textShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          Hackathons
        </Typography>
      </Fade>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <CircularProgress sx={{ color: "#90caf9" }} />
        </Box>
      ) : error ? (
        <Collapse in={!!error}>
          <Alert
            severity="error"
            sx={{
              bgcolor: "#2d2d34",
              color: "#ff5252",
              maxWidth: 400,
              mx: "auto",
              fontWeight: 600,
              letterSpacing: 0.5,
            }}
          >
            {error}
          </Alert>
        </Collapse>
      ) : hackathons.length === 0 ? (
        <Fade in timeout={600}>
          <Typography sx={{ color: "#fff", textAlign: "center" }}>
            No hackathons found.
          </Typography>
        </Fade>
      ) : (
        <Stack spacing={3} sx={{ maxWidth: 800, mx: "auto" }}>
          {hackathons.map((hack, idx) => (
            <Grow in timeout={500 + idx * 150} key={hack.id}>
              <Paper
                sx={{
                  bgcolor: "#23272F",
                  borderRadius: 3,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
                  p: 3,
                  color: "#fff",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "scale(1.015)",
                    boxShadow: "0 4px 24px rgba(25, 118, 210, 0.15)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Avatar sx={{ bgcolor: "#181A20", mr: 1 }}>
                    <EmojiEventsIcon sx={{ color: "#90caf9" }} />
                  </Avatar>
                  <Typography variant="h6" sx={{ color: "#90caf9", fontWeight: 600 }}>
                    {hack.name}
                  </Typography>
                  <Chip
                    label={hack.status}
                    sx={{
                      ml: 2,
                      bgcolor: getStatusColor(hack.status),
                      color: "#fff",
                      fontWeight: 600,
                      letterSpacing: 0.5,
                      fontSize: "0.85rem",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
                    }}
                    size="small"
                  />
                </Box>
                <Typography sx={{ mb: 1, fontSize: "1.05rem", color: "#e3f2fd" }}>
                  {hack.description}
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                  <Tooltip title="Start Date" arrow>
                    <Typography variant="body2" sx={{ color: "#90caf9" }}>
                      Start: {hack.startDate}
                    </Typography>
                  </Tooltip>
                  <Tooltip title="End Date" arrow>
                    <Typography variant="body2" sx={{ color: "#90caf9" }}>
                      End: {hack.endDate}
                    </Typography>
                  </Tooltip>
                  {hack.maxParticipants && (
                    <Tooltip title="Max Participants" arrow>
                      <Typography variant="body2" sx={{ color: "#90caf9" }}>
                        Max: {hack.maxParticipants}
                      </Typography>
                    </Tooltip>
                  )}
                </Stack>
                <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: "wrap" }}>
                  {hack.technologies?.map((tech: string, tIdx: number) => (
                    <Chip
                      key={tIdx}
                      label={tech}
                      size="small"
                      sx={{
                        bgcolor: "#181A20",
                        color: "#90caf9",
                        mr: 1,
                        mb: 0.5,
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        border: "1px solid #333",
                        letterSpacing: 0.5,
                      }}
                    />
                  ))}
                </Stack>
                {hack.prizes && hack.prizes.length > 0 && (
                  <>
                    <Divider sx={{ bgcolor: "#333", my: 1 }} />
                    <Typography variant="body2" sx={{ color: "#ffa726", fontWeight: 600 }}>
                      Prizes:
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 0.5, flexWrap: "wrap" }}>
                      {hack.prizes.map((prize: string, pIdx: number) => (
                        <Chip
                          key={pIdx}
                          label={prize}
                          size="small"
                          sx={{
                            bgcolor: "#222b36",
                            color: "#fff",
                            mr: 1,
                            mb: 0.5,
                            fontWeight: 600,
                            fontSize: "0.85rem",
                          }}
                        />
                      ))}
                    </Stack>
                  </>
                )}
                {/* Participants Section */}
                <Divider sx={{ bgcolor: "#333", my: 2 }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: "#43a047",
                    fontWeight: 600,
                    mb: 1,
                    display: "flex",
                    alignItems: "center",
                    letterSpacing: 0.5,
                  }}
                >
                  <GroupIcon sx={{ mr: 1, color: "#43a047" }} />
                  Participants ({hack.participants?.length || 0})
                </Typography>
                <Collapse in={!!hack.participants && hack.participants.length > 0}>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mb: 2 }}>
                    {hack.participants?.map((participant: any, idx: number) => (
                      <Chip
                        key={idx}
                        label={participant.name || participant.email || participant}
                        size="small"
                        avatar={
                          participant.avatar ? (
                            <Avatar src={participant.avatar} />
                          ) : (
                            <Avatar sx={{ bgcolor: "#23272F", color: "#90caf9", fontSize: 14 }}>
                              {(participant.name || participant.email || "U")[0].toUpperCase()}
                            </Avatar>
                          )
                        }
                        sx={{
                          bgcolor: "#181A20",
                          color: "#fff",
                          mr: 1,
                          mb: 0.5,
                          fontWeight: 500,
                          fontSize: "0.85rem",
                          border: "1px solid #333",
                        }}
                        component="span"
                      />
                    ))}
                  </Stack>
                </Collapse>
                {!hack.participants || hack.participants.length === 0 ? (
                  <Fade in>
                    <Typography variant="body2" sx={{ color: "#fff", mb: 2 }}>
                      No participants yet.
                    </Typography>
                  </Fade>
                ) : null}
                <Divider sx={{ bgcolor: "#333", my: 2 }} />
                <Stack direction="row" spacing={2}>
                  <Tooltip title="Organizer" arrow>
                    <Typography variant="body2" sx={{ color: "#90caf9" }}>
                      Organizer: {hack.organizerId}
                    </Typography>
                  </Tooltip>
                  <Tooltip title="Created At" arrow>
                    <Typography variant="body2" sx={{ color: "#90caf9" }}>
                      Created: {hack.createdAt ? new Date(hack.createdAt).toLocaleString() : ""}
                    </Typography>
                  </Tooltip>
                </Stack>
              </Paper>
            </Grow>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default HackathonList;
