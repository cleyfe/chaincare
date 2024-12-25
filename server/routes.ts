import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { db } from "@db";
import { investments, projects, distributions, auditTrail, rewardPoints, pointsHistory } from "@db/schema";
import { eq, and, sql } from "drizzle-orm";

export function registerRoutes(app: Express): Server {
  const httpServer = createServer(app);

  // Setup authentication routes and middleware
  setupAuth(app);

  // Stats endpoint
  app.get("/api/stats", async (_req, res) => {
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

    const totalDeposits = depositsResult.reduce((sum, d) => sum + parseFloat(d.amount), 0);

    // Calculate monthly growth
    const now = new Date();
    const lastMonth = new Date(now.setMonth(now.getMonth() - 1));
    const lastMonthDeposits = depositsResult
      .filter(d => new Date(d.timestamp) < lastMonth)
      .reduce((sum, d) => sum + parseFloat(d.amount), 0);

    const depositGrowth = lastMonthDeposits ? 
      ((totalDeposits - lastMonthDeposits) / lastMonthDeposits) * 100 : 
      0;

    // Assuming 4% APY from Morpho for now
    const interestRate = 4;
    const totalInterest = totalDeposits * (interestRate / 100);

    const stats = {
      totalDeposits,
      depositGrowth,
      activeProjects: projectsResult.filter(p => p.status === 'active').length,
      completedProjects: projectsResult.filter(p => p.status === 'completed').length,
      totalInterest,
      interestRate,
      totalDistributed: distributionsResult.reduce((sum, d) => sum + parseFloat(d.amount), 0),
      beneficiaries: new Set(distributionsResult.map(d => d.recipientId)).size
    };

    res.json(stats);
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