"use client";
import { useAuthFetcher } from "@/lib/fetcher";
import { Day } from "@/types/privateApi/day";
import useSWR from "swr";
import type { PaginatedResponse } from "@/types/response";
import type { WorkoutSetType } from "@/types/privateApi/set";
import {
  Box,
  Card,
  CardHeader,
  Chip,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import { WorkoutSet as WorkoutSet } from "./WorkoutSet";
import { EditDayActions } from "./EditDayActions";
import moment from "moment";
import { AutocompleteExercise } from "../exercises/AutocompleteExercise";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ExerciseSearchData } from "@/types/privateApi/exerciseSearch";

export const DayCard = ({
  dayId,
  workoutId,
}: {
  dayId: number;
  workoutId: number;
}) => {
  const authFetcher = useAuthFetcher();
  const { data: day } = useSWR<Day>(`/day/${dayId}`, authFetcher);
  const { data: workoutSets, mutate: mutateSets } = useSWR<
    PaginatedResponse<WorkoutSetType>
  >(`/set?exerciseday=${dayId}`, authFetcher);
  const sets = workoutSets?.results ?? [];

  const handleSort = async (event: DragEndEvent) => {
    const dragId = event.active.id;
    const overId = event.over?.id;
    if (!Number.isInteger(overId) || dragId === overId) {
      return;
    }
    const oldIndex = sets.findIndex((set) => set.id === dragId);
    const newIndex = sets.findIndex((set) => set.id === overId);
    const newSets = arrayMove(sets, oldIndex, newIndex);

    const patchUpdates = newSets.reduce((acc, set, index) => {
      if (set.order !== index) {
        acc.push(
          authFetcher(`/set/${set.id}`, {
            method: "PATCH",
            body: JSON.stringify({ order: index }),
          }),
        );
      }
      return acc;
    }, [] as Promise<unknown>[]);
    await Promise.all(patchUpdates);
    mutateSets({ ...workoutSets, results: newSets });
  };

  const handleAdd = async (exercise: ExerciseSearchData) => {
    const data = await authFetcher("/set/", {
      method: "POST",
      body: JSON.stringify({
        exerciseday: dayId,
        order: sets.length,
        sets: 1,
      }),
    });
    const newSets = [...sets, data];
    mutateSets({ ...workoutSets, results: newSets });
    // Add 1 setting to the set
    await authFetcher("/setting/", {
      method: "POST",
      body: JSON.stringify({
        set: data.id,
        exercise_base: exercise.base_id,
        reps: 0,
      }),
    });
  };

  if (!day) {
    return null;
  }
  return (
    <Card>
      <CardHeader
        title={
          <>
            <Typography variant="h5" gutterBottom>
              {day.description}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {day.day.map((weekday) => (
                <Chip
                  key={`day-${dayId}-weekday-${weekday}`}
                  label={moment().set("weekday", weekday).format("dddd")}
                />
              ))}
            </Box>
          </>
        }
        action={<EditDayActions workoutId={workoutId} dayId={dayId} />}
      />

      <List dense disablePadding>
        <ListItem>
          <AutocompleteExercise addExercise={handleAdd} />
        </ListItem>
        <DndContext onDragEnd={handleSort}>
          <SortableContext items={sets} strategy={verticalListSortingStrategy}>
            {sets.map((set) => {
              return (
                <WorkoutSet
                  key={`set-${set.id}`}
                  dayId={dayId}
                  setId={set.id}
                />
              );
            })}
          </SortableContext>
        </DndContext>
      </List>
    </Card>
  );
};
