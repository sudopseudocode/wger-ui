import { useAuthedSWR, useAuthFetcher } from "@/lib/fetcher";
import { Setting } from "@/types/privateApi/setting";
import type { PaginatedResponse } from "@/types/response";
import {
  Avatar,
  Collapse,
  Fab,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import {
  Add,
  Comment,
  Delete,
  DragHandle,
  Error,
  Image as ImageIcon,
} from "@mui/icons-material";
import { ExerciseBaseInfo } from "@/types/publicApi/exerciseBaseInfo";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { EditSettingRow } from "./EditSettingRow";
import { DeleteSetModal } from "./DeleteSetModal";
import { useDefaultWeightUnit } from "@/lib/useDefaultWeightUnit";
import { WorkoutSetType } from "@/types/privateApi/set";
import { EditSetCommentModal } from "./EditSetCommentModal";
import { Exercise } from "@/types/publicApi/exercise";
import useSWR from "swr";
import { useExercise } from "@/lib/useExercise";

export const WorkoutSet = ({
  setId,
  isSortingActive,
}: {
  dayId: number;
  setId: number;
  isSortingActive: boolean;
}) => {
  const authFetcher = useAuthFetcher();

  const {
    data: settings,
    isLoading: settingLoading,
    mutate: mutateSettings,
  } = useAuthedSWR<PaginatedResponse<Setting>>(`/setting?set=${setId}`);

  const exerciseBaseId = settings?.results?.[0]?.exercise_base;
  const { data: exerciseBaseInfo, isLoading: exerciseLoading } =
    useAuthedSWR<ExerciseBaseInfo>(
      typeof exerciseBaseId === "number"
        ? `/exercisebaseinfo/${exerciseBaseId}`
        : null,
    );

  const { data: set } = useAuthedSWR<WorkoutSetType>(`/set/${setId}`);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: setId });
  const [edit, setEdit] = useState(false);
  const [editComment, setEditComment] = useState(false);
  const [deleteOpen, setDelete] = useState(false);
  const defaultWeightUnit = useDefaultWeightUnit();

  const isLoading = settingLoading || exerciseLoading;
  const imageUrl = exerciseBaseInfo?.images?.[0]?.image;
  const exercise = useExercise(exerciseBaseId);

  const handleAdd = async () => {
    const newSet = await authFetcher("/setting/", {
      method: "POST",
      body: JSON.stringify({
        set: setId,
        exercise_base: exerciseBaseId,
        weight: 0,
        weight_unit: defaultWeightUnit,
        reps: 0,
      }),
    });
    const newSettings = settings?.results
      ? [...settings.results, newSet]
      : [newSet];
    mutateSettings({
      ...settings,
      count: newSettings.length,
      results: newSettings,
    });
  };

  if (isLoading) {
    return null;
  }

  const EditActions =
    edit && isSortingActive ? (
      <IconButton
        onClick={() => {
          setDelete(true);
          setEdit(false);
        }}
      >
        <Delete />
      </IconButton>
    ) : (
      <IconButton
        sx={{ touchAction: "manipulation" }}
        {...attributes}
        {...listeners}
      >
        <DragHandle />
      </IconButton>
    );

  return (
    <>
      <DeleteSetModal
        open={deleteOpen}
        onClose={() => setDelete(false)}
        setId={setId}
      />
      <EditSetCommentModal
        open={editComment}
        onClose={() => setEditComment(false)}
        setId={setId}
      />

      <ListItem
        disablePadding
        ref={setNodeRef}
        sx={{ transform: CSS.Transform.toString(transform), transition }}
        secondaryAction={EditActions}
      >
        <ListItemButton onClick={() => setEdit(!edit)}>
          <ListItemAvatar>
            {exercise && imageUrl ? (
              <Avatar alt={`${exercise.name} set item`} src={imageUrl} />
            ) : (
              <Avatar>{exercise ? <ImageIcon /> : <Error />}</Avatar>
            )}
          </ListItemAvatar>
          <ListItemText
            primary={exercise?.name ?? "Unknown exercise"}
            secondary={`${settings?.count ?? 0} sets`}
          />
        </ListItemButton>
      </ListItem>

      <Collapse in={edit && isSortingActive} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {set?.comment && (
            <ListItem dense sx={{ pl: 4 }}>
              <ListItemText secondary={set.comment} />
            </ListItem>
          )}

          {settings?.results?.map((setting) => (
            <EditSettingRow
              key={`setting-${setting.id}`}
              settingId={setting.id}
            />
          ))}

          <ListItem sx={{ display: "flex", gap: 2 }}>
            <Fab size="medium" variant="extended" onClick={handleAdd}>
              <Add />
              New set
            </Fab>
            <Fab
              size="medium"
              variant="extended"
              onClick={() => setEditComment(true)}
            >
              <Comment />
            </Fab>
          </ListItem>
        </List>
      </Collapse>
    </>
  );
};
