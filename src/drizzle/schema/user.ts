import { env } from '@/env'
import { relations } from 'drizzle-orm'
import { pgEnum, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core'

import courseTable from './course'
import enrollmentTable from './enrollment'
import blogAuthorsTable from './post.author.to.role'
import sessionTable from './session'

export const userRoleEnum = pgEnum('role', ['admin', 'fellow', 'user'])

const userTable = pgTable('user', {
  avatar: text('avatar'),
  bio: text('bio'),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
    .notNull()
    .defaultNow(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  firstName: varchar('first_name', { length: 100 }),
  googleId: text('google_id').unique(),
  id: text('id').primaryKey(),
  lastName: varchar('last_name', { length: 100 }),
  passwordHash: text('password_hash'),
  role: userRoleEnum('role').notNull().default(env.NEW_USER_ROLE),
  tel: varchar('tel', { length: 20 }),
  updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true })
    .notNull()
    .defaultNow(),
  userName: varchar('user_name', { length: 50 }).unique()
})

export const userRelations = relations(userTable, ({ many }) => ({
  courses: many(courseTable, { relationName: 'fellow' }),
  enrollments: many(enrollmentTable),
  postAuthors: many(blogAuthorsTable),
  sessions: many(sessionTable)
}))

export default userTable
