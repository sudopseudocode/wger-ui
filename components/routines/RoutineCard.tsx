import dayjs from "dayjs";
import { Typography, Card, CardHeader, List, Divider } from "@mui/material";
import { EditRoutineMenu } from "./EditRoutineMenu";
import type { Prisma, WorkoutSession } from "@prisma/client";
import { RoutineDayItem } from "./RoutineDayItem";

export async function RoutineCard({
  routine,
  currentSession,
}: {
  routine: Prisma.RoutineGetPayload<{ include: { routineDays: true } }>;
  currentSession: WorkoutSession | null;
}) {
  return (
    <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <CardHeader
        action={<EditRoutineMenu routine={routine} />}
        title={routine.name}
        subheader={
          <>
            {routine.description && (
              <Typography variant="subtitle2">{routine.description}</Typography>
            )}
            <Typography variant="caption" gutterBottom>
              {`Last Updated: ${dayjs(routine.updatedAt).format("MM/DD/YYYY")}`}
            </Typography>
          </>
        }
      />

      <List dense disablePadding sx={{ flexGrow: 1 }}>
        <Divider />
        {routine.routineDays.map((routineDay) => {
          return (
            <RoutineDayItem
              key={`day-${routineDay.id}`}
              routineDay={routineDay}
              currentSession={currentSession}
            />
          );
        })}
      </List>
    </Card>
  );
}
