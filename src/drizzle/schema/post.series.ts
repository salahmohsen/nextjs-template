import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';

const seriesTable = pgTable('series', {
  description: text('description'),
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull()
});

export default seriesTable;
