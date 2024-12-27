import { pgTable, text, serial, timestamp, numeric, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";

// User authentication schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const investments = pgTable("vault_deposits", {
  id: serial("id").primaryKey(),
  accountId: text("wallet_address").notNull(),
  amount: numeric("amount").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  transactionId: text("tx_hash").notNull(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  targetAmount: numeric("target_amount").notNull(),
  raisedAmount: numeric("raised_amount").notNull().default("0"),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const distributions = pgTable("distributions", {
  id: serial("id").primaryKey(),
  projectId: serial("project_id").references(() => projects.id),
  amount: numeric("amount").notNull(),
  recipientId: text("recipient_address").notNull(),
  transactionId: text("tx_hash").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  status: text("status").notNull()
});

export const auditTrail = pgTable("audit_trail", {
  id: serial("id").primaryKey(),
  eventType: text("event_type").notNull(),
  details: text("details").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  transactionId: text("tx_hash"),
  accountId: text("wallet_address")
});

export const rewardPoints = pgTable("reward_points", {
  id: serial("id").primaryKey(),
  accountId: text("wallet_address").notNull(),
  points: numeric("points").notNull().default("0"),
  level: text("level").notNull().default("Bronze"),
  lastUpdated: timestamp("last_updated").defaultNow().notNull()
});

export const pointsHistory = pgTable("points_history", {
  id: serial("id").primaryKey(),
  accountId: text("wallet_address").notNull(),
  amount: numeric("points").notNull(),
  reason: text("reason").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  investmentId: serial("investment_id").references(() => investments.id)
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  criteria: text("criteria").notNull(),
  pointsRequired: numeric("points_required").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: text("wallet_address").notNull(),
  achievementId: serial("achievement_id").references(() => achievements.id),
  earnedAt: timestamp("earned_at").defaultNow().notNull(),
});

// Define relations
export const achievementsRelations = relations(achievements, ({ many }) => ({
  userAchievements: many(userAchievements),
}));

export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
  achievement: one(achievements, {
    fields: [userAchievements.achievementId],
    references: [achievements.id],
  }),
}));

export type Investment = typeof investments.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Distribution = typeof distributions.$inferSelect;
export type AuditTrail = typeof auditTrail.$inferSelect;
export type RewardPoints = typeof rewardPoints.$inferSelect;
export type PointsHistory = typeof pointsHistory.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
export type UserAchievement = typeof userAchievements.$inferSelect;