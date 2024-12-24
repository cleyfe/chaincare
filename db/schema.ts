import { pgTable, text, serial, timestamp, numeric, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

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

export type Investment = typeof investments.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Distribution = typeof distributions.$inferSelect;
export type AuditTrail = typeof auditTrail.$inferSelect;