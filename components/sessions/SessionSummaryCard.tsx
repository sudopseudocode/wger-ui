import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  List,
  ListItem,
  ListItemText,
  Rating,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import Link from "next/link";
import { EditSessionMenu } from "./EditSessionMenu";
import { SessionWithRelations } from "@/types/workoutSession";

export const SessionSummaryCard = ({
  session,
}: {
  session: SessionWithRelations;
}) => {
  const durationDate =
    session.startTime && session.endTime
      ? dayjs.duration(dayjs(session.endTime).diff(dayjs(session.startTime)))
      : null;
  const durationString = durationDate
    ? `${durationDate.hours()} hours, ${durationDate.minutes()} mins`
    : "Not entered";

  return (
    <Card
      sx={{
        minWidth: 300,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardHeader
        title={
          <>
            <Typography variant="h6" gutterBottom sx={{ mr: 2 }}>
              {session.name}
            </Typography>
            <Chip
              variant="outlined"
              label={dayjs(session.startTime).format("MM/DD/YYYY")}
            />
          </>
        }
        disableTypography
        action={<EditSessionMenu session={session} />}
      />

      <CardContent sx={{ py: 0, flexGrow: 1 }}>
        <List dense>
          <ListItem disableGutters>
            <ListItemText primary="Duration" secondary={durationString} />
          </ListItem>

          <ListItem disableGutters>
            <ListItemText
              primary="General Impression"
              secondary={
                session.impression ? (
                  <Rating
                    size="small"
                    max={5}
                    value={session.impression}
                    readOnly
                  />
                ) : (
                  "Not rated"
                )
              }
            />
          </ListItem>

          {session.notes && (
            <ListItem disableGutters>
              <ListItemText primary="Notes" secondary={session.notes} />
            </ListItem>
          )}
        </List>
      </CardContent>

      <CardActions sx={{ alignSelf: "flex-end" }}>
        <Button LinkComponent={Link} href={`/logs/${session.id}`}>
          View Session
        </Button>
      </CardActions>
    </Card>
  );
};
