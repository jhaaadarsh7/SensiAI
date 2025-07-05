"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { generateAIInsights } from "./dashboard";

export async function updateUser(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");

  // Find user by clerkUserId
  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!user) throw new Error("User not found");

  try {
    const result = await db.$transaction(
      async (tx) => {
        // Find industryInsight by industry string (not industryId)
        let industryInsight = await tx.industryInsight.findUnique({
          where: {
            industry: data.industry, // Correct field
          },
        });

        // If not found, create new industryInsight record
      if (!user.industryInsight) {
        const insights = await generateAIInsights(data.industry);
    
         industryInsight = await db.industryInsight.create({
          data: {
            industry: data.industry,
            ...insights,
            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        });
    
      }

        // Update user profile info
        const updatedUser = await tx.user.update({
          where: {
            clerkUserId: userId,
          },
          data: {
            industry: data.industry,
            experience: data.experience,
            bio: data.bio,
            skills: data.skills,
          },
        });

        return { updatedUser, industryInsight };
      },
      {
        timeout: 10000,
      }
    );

    return { success: true, ...result };
  } catch (error) {
    console.error("Error updating user and industry:", error.message);
    throw new Error("Failed to update profile: " + error.message);
  }
}

export async function getUserOnboardingStatus() {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");

  try {
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
      select: {
        industry: true,
      },
    });

    if (!user) throw new Error("User not found");

    return {
      isOnboarded: !!user.industry,
    };
  } catch (error) {
    console.error("Error fetching user onboarding status:", error.message);
    throw new Error("Failed to fetch onboarding status");
  }
}
