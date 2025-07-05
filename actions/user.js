"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { generateAIInsights } from "./dashboard";

export async function updateUser(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");

  try {
    // 1. Check if industry already exists
    let industryInsight = await db.industryInsight.findUnique({
      where: { industry: data.industry },
    });

    // 2. If not found, create it *outside* transaction
    if (!industryInsight) {
      const insights = await generateAIInsights(data.industry);

      try {
        industryInsight = await db.industryInsight.create({
          data: {
            industry: data.industry,
            ...insights,
            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            growthRate: 0,
            demandLevel: "Medium",
            marketOutlook: "Neutral",
            salaryRanges: [],
            topSkills: [],
            keyTrends: [],
            recommendedSkills: [],
          },
        });
      } catch (err) {
        if (err.code === "P2002") {
          industryInsight = await db.industryInsight.findUnique({
            where: { industry: data.industry },
          });
        } else {
          throw err;
        }
      }
    }

    // 3. Now safe to run fast DB update inside transaction
    const updatedUser = await db.$transaction(async (tx) => {
      return await tx.user.update({
        where: { clerkUserId: userId },
        data: {
          industry: data.industry,
          experience: data.experience,
          bio: data.bio,
          skills: data.skills,
        },
      });
    });

    return { success: true, updatedUser, industryInsight };
  } catch (error) {
    console.error("❌ Failed to update profile:", error);
    throw new Error("Failed to update profile: " + error.message);
  }
}

export async function getUserOnboardingStatus() {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");

  try {
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: { industry: true },
    });

    if (!user) throw new Error("User not found");

    return { isOnboarded: !!user.industry };
  } catch (error) {
    console.error("❌ Failed to fetch onboarding status:", error);
    throw new Error("Failed to fetch onboarding status");
  }
}
