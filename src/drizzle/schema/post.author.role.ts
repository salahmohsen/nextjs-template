import { pgTable, serial, varchar } from 'drizzle-orm/pg-core'

const authorRulesTable = pgTable('posts_authors_roles', {
  arDescription: varchar('description', { length: 255 }),
  arName: varchar('ar_name', { length: 255 }).unique(),
  enDescription: varchar('description', { length: 255 }),
  enName: varchar('en_name', { length: 255 }).unique().notNull(),
  id: serial('id').primaryKey(),
})

export default authorRulesTable
