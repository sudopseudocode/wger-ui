import { Box, Container, Typography } from "@mui/material";
import { SessionSummaryCard } from "@/components/sessions/SessionSummaryCard";
import { CreateSessionButton } from "@/components/sessions/CreateSession";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function Sessions() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const sessions = await prisma.workoutSession.findMany({
    orderBy: { startTime: "desc" },
    where: { userId: session.user.id },
    include: { setGroups: { include: { sets: true } } },
  });

  return (
    <>
      <Container maxWidth="xl" sx={{ my: 3 }}>
        <CreateSessionButton />

        <Typography variant="h4" gutterBottom>
          Previous Workout Sessions
        </Typography>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {sessions.map((session) => (
            <SessionSummaryCard key={session.id} session={session} />
          ))}
        </Box>
      </Container>
    </>
  );
}
