import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { db } from "@db";
import { investments, projects, distributions, auditTrail, rewardPoints, pointsHistory, achievements, userAchievements } from "@db/schema";
import { eq, and, sql } from "drizzle-orm";
import { ethers } from "ethers";

export function registerRoutes(app: Express): Server {
  const httpServer = createServer(app);

  // Setup authentication routes and middleware
  setupAuth(app);

  // Stats endpoint with real-time balance
  app.get("/api/stats", async (req, res) => {
    try {
      const [
        depositsResult,
        projectsResult,
        distributionsResult
      ] = await Promise.all([
        // Get total deposits and monthly growth
        db.query.investments.findMany(),
        // Get project counts
        db.query.projects.findMany(),
        // Get distribution stats
        db.query.distributions.findMany()
      ]);

      // Get real-time balance from smart contract
      const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");
      const abi = ["function balanceOf(address) view returns (uint256)"];
      const vaultAddress = "0x45aa96f0b3188d47a1dafdbefce1db6b37f58216";
      const contract = new ethers.Contract(vaultAddress, abi, provider);
      const totalDeposits = await contract.balanceOf(req.query.walletAddress || "0x0");
      const formattedDeposits = parseFloat(ethers.formatUnits(totalDeposits, 6));

      // Calculate monthly growth
      const now = new Date();
      const lastMonth = new Date(now.setMonth(now.getMonth() - 1));
      const lastMonthDeposits = depositsResult
        .filter(d => new Date(d.timestamp) < lastMonth)
        .reduce((sum, d) => sum + parseFloat(d.amount), 0);

      const depositGrowth = lastMonthDeposits ? 
        ((formattedDeposits - lastMonthDeposits) / lastMonthDeposits) * 100 : 
        0;

      // Assuming 4% APY for now
      const interestRate = 4;
      const totalInterest = formattedDeposits * (interestRate / 100);

      const stats = {
        totalDeposits: formattedDeposits,
        depositGrowth,
        activeProjects: projectsResult.filter(p => p.status === 'active').length,
        completedProjects: projectsResult.filter(p => p.status === 'completed').length,
        totalInterest,
        interestRate,
        totalDistributed: distributionsResult.reduce((sum, d) => sum + parseFloat(d.amount), 0),
        beneficiaries: new Set(distributionsResult.map(d => d.recipientId)).size
      };

      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Achievement check endpoint
  app.post("/api/achievements/check", async (req, res) => {
    try {
      const { walletAddress, depositAmount } = req.body;

      // Get user's current points
      const userPoints = await db.query.rewardPoints.findFirst({
        where: eq(rewardPoints.accountId, walletAddress)
      });

      const totalPoints = parseFloat(userPoints?.points || "0") + depositAmount;

      // Get all achievements user hasn't earned yet
      const earnedAchievements = await db.query.userAchievements.findMany({
        where: eq(userAchievements.userId, walletAddress)
      });

      const earnedIds = earnedAchievements.map(a => a.achievementId);

      // Find next possible achievement
      const nextAchievement = await db.query.achievements.findFirst({
        where: sql`${achievements.id} NOT IN (${earnedIds.join(",")})
                  AND ${achievements.pointsRequired} <= ${totalPoints}`
      });

      if (nextAchievement) {
        // Award the achievement
        await db.insert(userAchievements).values({
          userId: walletAddress,
          achievementId: nextAchievement.id
        });

        res.json({ 
          success: true, 
          newAchievement: nextAchievement 
        });
      } else {
        res.json({ 
          success: true, 
          newAchievement: null 
        });
      }
    } catch (error) {
      console.error("Error checking achievements:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to check achievements" 
      });
    }
  });

  // Investments history
  app.get("/api/deposits", async (_req, res) => {
    const deposits = await db.query.investments.findMany({
      orderBy: (investments, { desc }) => [desc(investments.timestamp)]
    });
    res.json(deposits);
  });

  // Projects
  app.get("/api/projects", async (_req, res) => {
    const activeProjects = await db.query.projects.findMany({
      where: eq(projects.status, "active")
    });
    res.json(activeProjects);
  });

  // Projects by ID
  app.get("/api/projects/:id", async (req, res) => {
    const project = await db.query.projects.findFirst({
      where: eq(projects.id, parseInt(req.params.id))
    });
    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }
    res.json(project);
  });

  // Distributions
  app.get("/api/distributions", async (_req, res) => {
    const distributions = await db.query.distributions.findMany({
      orderBy: (distributions, { desc }) => [desc(distributions.timestamp)]
    });
    res.json(distributions);
  });

  // Audit trail
  app.get("/api/audit", async (_req, res) => {
    const audit = await db.query.auditTrail.findMany({
      orderBy: (audit, { desc }) => [desc(audit.timestamp)],
      limit: 100
    });
    res.json(audit);
  });

  // Rewards endpoints
  app.get("/api/rewards/:accountId", async (req, res) => {
    const accountId = req.params.accountId;
    const [rewards, history] = await Promise.all([
      db.query.rewardPoints.findFirst({
        where: eq(rewardPoints.accountId, accountId)
      }),
      db.query.pointsHistory.findMany({
        where: eq(pointsHistory.accountId, accountId),
        orderBy: (pointsHistory, { desc }) => [desc(pointsHistory.timestamp)],
        limit: 10
      })
    ]);

    if (!rewards) {
      res.status(404).json({ message: "Rewards not found for this account" });
      return;
    }

    res.json({
      ...rewards,
      history
    });
  });

  // Calculate and update points when a new investment is made
  app.post("/api/deposits", async (req, res) => {
    const { accountId, amount, transactionId } = req.body;

    // Calculate points (1 point per USD invested)
    const pointsToAdd = Math.floor(parseFloat(amount));

    // Insert investment record
    const [investment] = await db.insert(investments).values({
      accountId,
      amount,
      transactionId
    }).returning();

    // Update or create rewards record
    const existingRewards = await db.query.rewardPoints.findFirst({
      where: eq(rewardPoints.accountId, accountId)
    });

    if (existingRewards) {
      const newPoints = parseFloat(existingRewards.points) + pointsToAdd;
      const newLevel = calculateLevel(newPoints);

      await db.update(rewardPoints)
        .set({ 
          points: newPoints.toString(),
          level: newLevel,
          lastUpdated: new Date()
        })
        .where(eq(rewardPoints.accountId, accountId));
    } else {
      await db.insert(rewardPoints).values({
        accountId,
        points: pointsToAdd.toString(),
        level: calculateLevel(pointsToAdd),
        lastUpdated: new Date()
      });
    }

    // Record points history
    await db.insert(pointsHistory).values({
      accountId,
      amount: pointsToAdd.toString(),
      reason: "Investment made",
      investmentId: investment.id
    });

    res.json(investment);
  });

  return httpServer;
}

// Helper function to calculate reward level based on points
function calculateLevel(points: number): string {
  if (points >= 10000) return "Platinum";
  if (points >= 5000) return "Gold";
  if (points >= 1000) return "Silver";
  return "Bronze";
}