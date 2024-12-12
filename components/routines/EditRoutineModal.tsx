import { Workout } from "@/types/privateApi/workout";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { PaginatedResponse } from "@/types/response";
import { useAuthedSWR, useAuthFetcher } from "@/lib/fetcher";

export const EditRoutineModal = ({
  open,
  workoutId,
  onClose,
}: {
  open: boolean;
  workoutId: number | null;
  onClose: () => void;
}) => {
  const authFetcher = useAuthFetcher();
  const { data: workouts, mutate: mutateResults } =
    useAuthedSWR<PaginatedResponse<Workout>>("/workout");
  const { data: workout, mutate } = useAuthedSWR<Workout>(
    Number.isInteger(workoutId) ? `/workout/${workoutId}` : null,
  );
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = await authFetcher(
      workoutId ? `/workout/${workoutId}` : "/workout/",
      {
        method: workoutId ? "PUT" : "POST",
        body: JSON.stringify({
          name,
          description,
        }),
      },
    );
    onClose();
    // Handle optimistic updates
    if (!workoutId) {
      const newWorkouts = workouts?.results
        ? [data, ...workouts.results]
        : [data];
      mutateResults({
        ...workouts,
        count: newWorkouts.length,
        results: newWorkouts,
      });
    } else {
      mutate(data);
    }
  };

  useEffect(() => {
    setName(workout?.name ?? "");
    setDescription(workout?.description ?? "");
  }, [workout]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit,
      }}
    >
      <DialogTitle>{workoutId ? "Edit Routine" : "New Routine"}</DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          id="routine-name"
          variant="filled"
          label="Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <TextField
          variant="filled"
          multiline
          rows={4}
          label="Description"
          value={description}
          placeholder="Routine description"
          onChange={(event) => setDescription(event.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit">Save</Button>
      </DialogActions>
    </Dialog>
  );
};
