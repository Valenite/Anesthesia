import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/** Squad registrations for CRYPTX Vol. 006. */
export const registrations = pgTable("registrations", {
  id: serial("id").primaryKey(),
  teamName: text("team_name").notNull(),
  /** 1 = solo, 2 = duo */
  size: integer("size").notNull().default(2),
  leader: text("leader").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull().default(""),
  college: text("college").notNull().default(""),
  /** warm-up cipher code entered at signup */
  code: text("code").notNull().default(""),
  /** true when a valid warm-up code granted the bonus hint token */
  bonus: boolean("bonus").notNull().default(false),
  /** public squad key shown to the hunters */
  teamCode: text("team_code").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Registration = typeof registrations.$inferSelect;
export type NewRegistration = typeof registrations.$inferInsert;
