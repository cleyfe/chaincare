import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { vaultDeposits, projects, distributions, auditTrail } from "@db/schema";
import { eq, and, sql } from "drizzle-orm";

export function registerRoutes(app: Express): Server {
  const httpServer = createServer(app);

  // Stats endpoint
  app.get("/api/stats", async (_req, res) => {
    const [
      depositsResult,
      projectsResult,
      distributionsResult
    ] = await Promise.all([
      // Get total deposits and monthly growth
      db.query.vaultDeposits.findMany(),
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
      beneficiaries: new Set(distributionsResult.map(d => d.recipientAddress)).size
    };

    res.json(stats);
  });

  // Vault deposits
  app.get("/api/deposits", async (_req, res) => {
    const deposits = await db.query.vaultDeposits.findMany({
      orderBy: (deposits, { desc }) => [desc(deposits.timestamp)]
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

  return httpServer;
}