import {
  Box,
  Chip,
  Divider,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { EditDayMenu } from "./EditDayMenu";
import dayjs from "dayjs";
import Link from "next/link";
import type { RoutineDay, WorkoutSession } from "@prisma/client";
import { MoreHoriz } from "@mui/icons-material";

export const RoutineDayItem = ({
  routineDay,
  currentSession,
}: {
  routineDay: RoutineDay;
  currentSession: WorkoutSession | null;
}) => {
  return (
    <>
      <ListItem
        dense
        disablePadding
        secondaryAction={
          <EditDayMenu
            routineDay={routineDay}
            currentSession={currentSession}
            icon={<MoreHoriz />}
          />
        }
      >
        <ListItemButton component={Link} href={`/day/${routineDay.id}`}>
          <ListItemText
            primary={routineDay.description}
            secondary={
              <Box
                component="span"
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 0.5,
                  mt: 0.5,
                }}
              >
                {routineDay.weekdays.map((weekday) => (
                  <Chip
                    key={`${routineDay.id}-${weekday}`}
                    component="span"
                    label={dayjs().day(weekday).format("ddd")}
                  />
                ))}
              </Box>
            }
          />
        </ListItemButton>
      </ListItem>
      <Divider />
    </>
  );
};
