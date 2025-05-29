import { relations } from 'drizzle-orm';
import {
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  varchar
} from 'drizzle-orm/pg-core';

import courseTable from './course';
import userTable from './user';

const enrollmentTable = pgTable(
  'course_enrollment',
  {
    courseId: integer('course_id')
      .notNull()
      .references(() => courseTable.id, { onDelete: 'cascade' }),
    enrollmentDate: timestamp('enrollment_date', {
      mode: 'date',
      withTimezone: true
    })
      .notNull()
      .defaultNow(),
    paidAmount: integer('paid_amount'),
    paymentDate: timestamp('payment_date', {
      mode: 'date',
      withTimezone: true
    }),
    status: varchar('status', { length: 20 }).notNull().default('pending'),
    userId: text('user_id')
      .notNull()
      .references(() => userTable.id, { onDelete: 'cascade' })
  },
  (t) => [primaryKey({ columns: [t.courseId, t.userId] })]
);

export const enrollmentRelations = relations(enrollmentTable, ({ one }) => ({
  course: one(courseTable, {
    fields: [enrollmentTable.courseId],
    references: [courseTable.id]
  }),
  user: one(userTable, {
    fields: [enrollmentTable.userId],
    references: [userTable.id]
  })
}));

export default enrollmentTable;
