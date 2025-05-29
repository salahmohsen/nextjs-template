import { relations } from 'drizzle-orm';
import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core';

import postsTable from './post';
import seriesTable from './post.series';

const blogToSeriesTable = pgTable(
  'series_posts',
  {
    order: integer('order').notNull().default(0),
    postId: integer('post_id')
      .notNull()
      .references(() => postsTable.id, { onDelete: 'cascade' }),
    seriesId: integer('series_id')
      .notNull()
      .references(() => seriesTable.id, { onDelete: 'cascade' })
  },
  (t) => ({
    primaryKey: primaryKey({ columns: [t.seriesId, t.postId] })
  })
);

export const blogToSeriesRelations = relations(
  blogToSeriesTable,
  ({ one }) => ({
    post: one(postsTable, {
      fields: [blogToSeriesTable.postId],
      references: [postsTable.id]
    }),
    series: one(seriesTable, {
      fields: [blogToSeriesTable.seriesId],
      references: [seriesTable.id]
    })
  })
);

export default blogToSeriesTable;
