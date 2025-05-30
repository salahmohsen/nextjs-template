import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

import userTable from './user';

const sessionTable = pgTable('session', {
  expiresAt: timestamp('expires_at', {
    mode: 'date',
    withTimezone: true
  }).notNull(),
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id)
});

export const sessionRelations = relations(sessionTable, ({ one }) => ({
  user: one(userTable, {
    fields: [sessionTable.userId],
    references: [userTable.id]
  })
}));

export default sessionTable;
