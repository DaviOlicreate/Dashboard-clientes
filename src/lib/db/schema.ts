import { pgTable, uuid, varchar, integer, date, uniqueIndex, timestamp } from "drizzle-orm/pg-core";

export const workspaces = pgTable("workspaces", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const connections = pgTable("connections", {
  id: uuid("id").defaultRandom().primaryKey(),
  workspaceId: uuid("workspace_id").references(() => workspaces.id).notNull(),
  provider: varchar("provider", { length: 20 }).notNull(), // 'GOOGLE' | 'META'
  externalAccountId: varchar("external_account_id", { length: 50 }).notNull(),
  externalAccountName: varchar("external_account_name", { length: 255 }),
  accessToken: varchar("access_token", { length: 500 }),
  refreshToken: varchar("refresh_token", { length: 500 }),
  status: varchar("status", { length: 20 }).default("ACTIVE"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const campaigns = pgTable("campaigns", {
  id: uuid("id").defaultRandom().primaryKey(),
  workspaceId: uuid("workspace_id").references(() => workspaces.id).notNull(),
  provider: varchar("provider", { length: 20 }).notNull(),
  externalCampaignId: varchar("external_campaign_id", { length: 100 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 }).notNull(),
});

export const dailyMetrics = pgTable(
  "daily_metrics",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    workspaceId: uuid("workspace_id").references(() => workspaces.id).notNull(),
    campaignId: varchar("campaign_id", { length: 100 }).notNull(),
    campaignName: varchar("campaign_name", { length: 255 }),
    provider: varchar("provider", { length: 20 }).notNull(),
    date: date("date").notNull(),
    spendCentavos: integer("spend_centavos").notNull().default(0),
    impressions: integer("impressions").notNull().default(0),
    clicks: integer("clicks").notNull().default(0),
    conversions: integer("conversions").notNull().default(0),
    revenueCentavos: integer("revenue_centavos").notNull().default(0),
  },
  (t) => ({
    unq_metric_day: uniqueIndex("unq_metric_day").on(t.workspaceId, t.campaignId, t.date),
  })
);
