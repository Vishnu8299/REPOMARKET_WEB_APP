import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Stack,
  Alert,
  CircularProgress,
  IconButton,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

const API_URL = "http://localhost:8081/api/admin/hackathons";

const CreateHackathon: React.FC = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [organizerId, setOrganizerId] = useState("");
  const [maxParticipants, setMaxParticipants] = useState<number | "">("");
  const [prizes, setPrizes] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [status, setStatus] = useState("UPCOMING");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [prizeList, setPrizeList] = useState<string[]>([]);
  const [prizeInput, setPrizeInput] = useState("");
  const [techList, setTechList] = useState<string[]>([]);
  const [techInput, setTechInput] = useState("");
  const navigate = useNavigate();

  const handleAddPrize = () => {
    if (prizeInput.trim() && !prizeList.includes(prizeInput.trim())) {
      setPrizeList([...prizeList, prizeInput.trim()]);
      setPrizeInput("");
    }
  };
  const handleRemovePrize = (idx: number) => {
    setPrizeList(prizeList.filter((_, i) => i !== idx));
  };

  const handleAddTech = () => {
    if (techInput.trim() && !techList.includes(techInput.trim())) {
      setTechList([...techList, techInput.trim()]);
      setTechInput("");
    }
  };
  const handleRemoveTech = (idx: number) => {
    setTechList(techList.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await axios.post(
        API_URL,
        {
          name,
          description,
          startDate,
          endDate,
          organizerId,
          maxParticipants: maxParticipants === "" ? undefined : Number(maxParticipants),
          prizes: prizeList,
          technologies: techList,
          status,
        }
      );
      setSuccess(true);
      setTimeout(() => navigate("/admin/hackathons"), 1200);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to create hackathon. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#181A20", py: 6 }}>
      <Paper
        sx={{
          maxWidth: 500,
          mx: "auto",
          p: 4,
          borderRadius: 3,
          bgcolor: "#23272F",
          boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
        }}
      >
        <Typography variant="h5" sx={{ color: "#90caf9", mb: 3, fontWeight: 700 }}>
          Create Hackathon
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Hackathon Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
              InputProps={{ style: { color: "#fff" } }}
              InputLabelProps={{ style: { color: "#90caf9" } }}
              sx={{ bgcolor: "#181A20" }}
            />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              fullWidth
              multiline
              minRows={3}
              InputProps={{ style: { color: "#fff" } }}
              InputLabelProps={{ style: { color: "#90caf9" } }}
              sx={{ bgcolor: "#181A20" }}
            />
            <TextField
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              InputLabelProps={{ shrink: true, style: { color: "#90caf9" } }}
              InputProps={{ style: { color: "#fff" } }}
              sx={{ bgcolor: "#181A20" }}
            />
            <TextField
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              InputLabelProps={{ shrink: true, style: { color: "#90caf9" } }}
              InputProps={{ style: { color: "#fff" } }}
              sx={{ bgcolor: "#181A20" }}
            />
            <TextField
              label="Organizer Email"
              value={organizerId}
              onChange={(e) => setOrganizerId(e.target.value)}
              fullWidth
              InputProps={{ style: { color: "#fff" } }}
              InputLabelProps={{ style: { color: "#90caf9" } }}
              sx={{ bgcolor: "#181A20" }}
              placeholder="e.g. ravulapradeep8@gmail.com"
            />
            <TextField
              label="Max Participants"
              type="number"
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(e.target.value === "" ? "" : Number(e.target.value))}
              fullWidth
              InputProps={{ style: { color: "#fff" }, inputProps: { min: 1 } }}
              InputLabelProps={{ style: { color: "#90caf9" } }}
              sx={{ bgcolor: "#181A20" }}
              placeholder="e.g. 100"
            />
            {/* Dynamic Prizes */}
            <Box>
              <Typography sx={{ color: "#90caf9", mb: 0.5 }}>Prizes</Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <TextField
                  value={prizeInput}
                  onChange={(e) => setPrizeInput(e.target.value)}
                  placeholder="Add prize"
                  size="small"
                  sx={{ bgcolor: "#181A20", flex: 1 }}
                  InputProps={{ style: { color: "#fff" } }}
                  InputLabelProps={{ style: { color: "#90caf9" } }}
                />
                <IconButton
                  color="primary"
                  onClick={handleAddPrize}
                  disabled={!prizeInput.trim()}
                  sx={{ color: "#43a047" }}
                >
                  <AddCircleOutlineIcon />
                </IconButton>
              </Stack>
              <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
                {prizeList.map((prize, idx) => (
                  <Chip
                    key={idx}
                    label={prize}
                    onDelete={() => handleRemovePrize(idx)}
                    sx={{ bgcolor: "#222b36", color: "#fff" }}
                    deleteIcon={<RemoveCircleOutlineIcon sx={{ color: "#ff5252" }} />}
                  />
                ))}
              </Stack>
            </Box>
            {/* Dynamic Technologies */}
            <Box>
              <Typography sx={{ color: "#90caf9", mb: 0.5 }}>Technologies</Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <TextField
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  placeholder="Add technology"
                  size="small"
                  sx={{ bgcolor: "#181A20", flex: 1 }}
                  InputProps={{ style: { color: "#fff" } }}
                  InputLabelProps={{ style: { color: "#90caf9" } }}
                />
                <IconButton
                  color="primary"
                  onClick={handleAddTech}
                  disabled={!techInput.trim()}
                  sx={{ color: "#43a047" }}
                >
                  <AddCircleOutlineIcon />
                </IconButton>
              </Stack>
              <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
                {techList.map((tech, idx) => (
                  <Chip
                    key={idx}
                    label={tech}
                    onDelete={() => handleRemoveTech(idx)}
                    sx={{ bgcolor: "#222b36", color: "#fff" }}
                    deleteIcon={<RemoveCircleOutlineIcon sx={{ color: "#ff5252" }} />}
                  />
                ))}
              </Stack>
            </Box>
            <TextField
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              select
              SelectProps={{
                native: true,
                sx: {
                  color: "#fff",
                  bgcolor: "#181A20",
                  "& option": { color: "#23272F", background: "#fff" }
                }
              }}
              fullWidth
              InputProps={{ style: { color: "#fff" } }}
              InputLabelProps={{ style: { color: "#90caf9" } }}
              sx={{
                bgcolor: "#181A20",
                "& .MuiSelect-select, & .MuiInputBase-input": {
                  color: "#fff",
                  bgcolor: "#181A20"
                }
              }}
            >
              <option value="UPCOMING" style={{ color: "#23272F", background: "#fff" }}>UPCOMING</option>
              <option value="ONGOING" style={{ color: "#23272F", background: "#fff" }}>ONGOING</option>
              <option value="COMPLETED" style={{ color: "#23272F", background: "#fff" }}>COMPLETED</option>
            </TextField>
            {error && (
              <Alert severity="error" sx={{ bgcolor: "#2d2d34", color: "#ff5252" }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ bgcolor: "#2d2d34", color: "#66bb6a" }}>
                Hackathon created successfully!
              </Alert>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{
                bgcolor: "#1976d2",
                color: "#fff",
                fontWeight: 600,
                borderRadius: 2,
                "&:hover": { bgcolor: "#1565c0" },
              }}
              fullWidth
            >
              {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Create"}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateHackathon;
