import { useAuthFetcher } from "@/lib/fetcher";
import { Setting } from "@/types/privateApi/setting";
import useSWR from "swr";
import type { PaginatedResponse } from "@/types/response";
import type { WorkoutSetType } from "@/types/privateApi/set";
import {
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { Delete, Edit, Error, Image as ImageIcon } from "@mui/icons-material";
import { ExerciseBaseInfo } from "@/types/publicApi/exerciseBaseInfo";
import { WorkoutSetting } from "./WorkoutSetting";
import styles from "@/styles/workoutSet.module.css";

export const WorkoutSet = ({
  set,
  namespace,
}: {
  set: WorkoutSetType;
  namespace: string;
}) => {
  const { data: setting, isLoading: settingLoading } = useSWR<
    PaginatedResponse<Setting>
  >(`/setting?set=${set.id}`, useAuthFetcher());

  const exerciseBaseId = setting?.results[0]?.exercise_base;
  const { data: exerciseBaseInfo, isLoading: exerciseLoading } =
    useSWR<ExerciseBaseInfo>(
      Number.isInteger(exerciseBaseId) && `/exercisebaseinfo/${exerciseBaseId}`,
      useAuthFetcher(),
    );

  const isLoading = settingLoading || exerciseLoading;
  const imageUrl = exerciseBaseInfo?.images?.[0]?.image;
  const exercise = exerciseBaseInfo?.exercises.find(
    (exercise) => exercise.language === 2,
  );

  if (isLoading) {
    return null;
  }

  if (!setting || !exercise) {
    return (
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <Error />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Unknown Exercise" />
      </ListItem>
    );
  }

  return (
    <ListItem
      disablePadding
      secondaryAction={
        <>
          <IconButton>
            <Edit />
          </IconButton>
          <IconButton>
            <Delete />
          </IconButton>
        </>
      }
    >
      <ListItemButton>
        <ListItemAvatar>
          {imageUrl ? (
            <Avatar alt={`${exercise.name} set item`} src={imageUrl} />
          ) : (
            <Avatar>
              <ImageIcon />
            </Avatar>
          )}
        </ListItemAvatar>
        <ListItemText
          primary={exercise.name}
          secondary={
            <span className={styles.setInfo}>
              <span>{setting.count} sets</span>
              {setting.results.map((currentSet) => (
                <WorkoutSetting
                  key={`${namespace}-setting-${currentSet.id}`}
                  setting={currentSet}
                />
              ))}
            </span>
          }
        />
      </ListItemButton>
    </ListItem>
  );
};