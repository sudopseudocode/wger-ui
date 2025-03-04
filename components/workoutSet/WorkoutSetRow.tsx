import { editSet } from "@/actions/editSet";
import type { Units } from "@/actions/getUnits";
import type { SetWithRelations } from "@/types/workoutSet";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Check, DragHandle, MoreVert } from "@mui/icons-material";
import {
  Avatar,
  Box,
  IconButton,
  InputAdornment,
  ListItem,
  TextField,
} from "@mui/material";
import { SetTypeMenu } from "./SetTypeMenu";
import { RepUnitMenu } from "./RepUnitMenu";
import { WeightUnitMenu } from "./WeightUnitMenu";
import { green, grey } from "@mui/material/colors";
import { ListView } from "@/types/constants";

export const WorkoutSetRow = ({
  view,
  set,
  setNum,
  reorder,
  units,
  startRestTimer,
}: {
  view: ListView;
  set: SetWithRelations;
  setNum: number;
  reorder: boolean;
  units: Units;
  startRestTimer: (seconds: number) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: set.id });
  const isRowDisabled = set.completed && view === ListView.CurrentSession;

  return (
    <ListItem
      dense
      ref={setNodeRef}
      sx={{ transform: CSS.Transform.toString(transform), transition }}
    >
      {(reorder || view !== ListView.CurrentSession) && (
        <IconButton
          sx={{ touchAction: "manipulation" }}
          {...attributes}
          {...listeners}
        >
          <DragHandle />
        </IconButton>
      )}

      {(!reorder || view !== ListView.CurrentSession) && (
        // TODO add delete & setRestTimer
        <IconButton>
          <MoreVert fontSize="small" />
        </IconButton>
      )}

      <SetTypeMenu set={set} setNum={setNum} />

      <Box sx={{ display: "flex", gap: 1, my: 1 }}>
        <TextField
          key={`reps-${set.id}-${set.reps}`}
          size="small"
          variant="outlined"
          type="string"
          label={set.repetitionUnit.name}
          disabled={isRowDisabled}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <RepUnitMenu
                    id={set.id}
                    units={units}
                    onChange={(repUnit) => {
                      editSet({ id: set.id, repetitionUnitId: repUnit.id });
                    }}
                  />
                </InputAdornment>
              ),
            },
          }}
          defaultValue={set.reps}
          onBlur={async (event) => {
            await editSet({
              id: set.id,
              reps: parseInt(event.target.value, 10) || 0,
            });
          }}
        />

        <TextField
          key={`weight-${set.id}-${set.weight}`}
          size="small"
          variant="outlined"
          type="string"
          label={set.weightUnit.name}
          disabled={isRowDisabled}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <WeightUnitMenu
                    id={set.id}
                    units={units}
                    onChange={(weightUnit) => {
                      editSet({ id: set.id, weightUnitId: weightUnit.id });
                    }}
                  />
                </InputAdornment>
              ),
            },
          }}
          defaultValue={set.weight}
          onBlur={async (event) => {
            await editSet({
              id: set.id,
              weight: parseInt(event.target.value, 10) || 0,
            });
          }}
        />
        {view === ListView.CurrentSession && (
          <IconButton
            onClick={async () => {
              editSet({ id: set.id, completed: !set.completed });
              if (set.restTime && !set.completed) {
                startRestTimer(set.restTime);
              }
            }}
          >
            <Avatar
              sx={{
                bgcolor: set.completed ? green[500] : grey[400],
                width: 32,
                height: 32,
              }}
            >
              <Check />
            </Avatar>
          </IconButton>
        )}
      </Box>
    </ListItem>
  );
};
