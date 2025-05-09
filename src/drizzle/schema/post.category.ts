import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core'

const postCategoriesTable = pgTable('post_categories', {
  arName: varchar('ar_name', { length: 100 }).unique().notNull(),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
    .notNull()
    .defaultNow(),
  enName: varchar('en_name', { length: 100 }).unique().notNull(),
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 150 }).unique().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true })
    .notNull()
    .defaultNow(),
})

export default postCategoriesTable
