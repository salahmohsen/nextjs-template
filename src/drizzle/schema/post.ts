import { relations } from 'drizzle-orm';
import {
  boolean,
  json,
  pgTable,
  serial,
  text,
  timestamp,
  varchar
} from 'drizzle-orm/pg-core';

import { authorsTable } from '.';
import { JSONContent } from './course';
import blogsToCategoriesTable from './post.to.category';
import postsToTagsTable from './post.to.tag';

const postsTable = pgTable('posts', {
  arContent: json('ar_content').$type<JSONContent>().notNull(),
  arTitle: varchar('ar_title', { length: 255 }).notNull(),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
    .notNull()
    .defaultNow(),
  enContent: json('en_content').$type<JSONContent>().notNull(),
  enTitle: varchar('en_title', { length: 255 }).notNull(),
  excerpt: text('excerpt'),
  featuredImage: text('featured_image'),
  id: serial('id').primaryKey(),
  isDraft: boolean('is_draft').notNull().default(true),
  publishedAt: timestamp('published_at', {
    mode: 'date',
    withTimezone: true
  }).notNull(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true })
    .notNull()
    .defaultNow()
});

export const postsRelations = relations(postsTable, ({ many }) => ({
  authors: many(authorsTable),
  categories: many(blogsToCategoriesTable),
  tags: many(postsToTagsTable)
}));

export default postsTable;
