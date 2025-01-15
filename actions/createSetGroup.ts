"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createSetGroup(
  routineDayId: number,
  exerciseId: number,
  numSets: number,
) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  if (!user) {
    throw new Error("User not found");
  }

  if (!Number.isInteger(numSets) || numSets < 1) {
    throw new Error("Invalid number of sets");
  }

  const existingSetGroups = await prisma.workoutSetGroup.findMany({
    where: { routineDayId },
  });
  const setGroup = await prisma.workoutSetGroup.create({
    data: {
      routineDayId,
      order: existingSetGroups.length,
    },
  });
  await prisma.workoutSet.createMany({
    data: Array.from({ length: numSets }, (_, index) => ({
      exerciseId,
      order: index,
      setGroupId: setGroup.id,
      reps: 0,
      repetitionUnitId: user.defaultRepetitionUnitId,
      weight: 0,
      weightUnitId: user.defaultWeightUnitId,
    })),
  });
  revalidatePath(`/day/${routineDayId}`);
}
