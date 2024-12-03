import { useAuthFetcher } from "@/lib/fetcher";
import { Day } from "@/types/privateApi/day";
import useSWR from "swr";
import type { PaginatedResponse } from "@/types/response";
import type { WorkoutSet } from "@/types/privateApi/set";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  List,
} from "@mui/material";
import moment from "moment";
import styles from "./workoutDay.module.css";
import { WorkoutSetting } from "./WorkoutSetting";

export const WorkoutDay = ({ day }: { day: Day }) => {
  const { data: workoutSet } = useSWR<PaginatedResponse<WorkoutSet>>(
    `/set?exerciseday=${day.id}`,
    useAuthFetcher(),
  );

  return (
    <Accordion>
      <AccordionSummary>
        <div>
          <h4>{day.description}</h4>
          <span className={styles.weekdays}>
            {day.day
              .map((weekday) => moment().day(weekday).format("dddd"))
              .join(", ")}
          </span>
        </div>
      </AccordionSummary>
      <List>
        {workoutSet?.results.map((set) => (
          <WorkoutSetting key={`day-${day.id}-set-${set.id}`} set={set} />
        ))}
      </List>
    </Accordion>
  );
};
