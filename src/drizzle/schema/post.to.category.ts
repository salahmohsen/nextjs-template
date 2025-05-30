import { relations } from 'drizzle-orm';
import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core';

import postsTable from './post';
import blogCategoriesTable from './post.category';

const postsToCategoriesTable = pgTable(
  'blogs_to_categories',
  {
    categoryId: integer('category_id')
      .notNull()
      .references(() => blogCategoriesTable.id, { onDelete: 'cascade' }),
    postId: integer('blog_id')
      .notNull()
      .references(() => postsTable.id, { onDelete: 'cascade' })
  },
  (t) => [primaryKey({ columns: [t.postId, t.categoryId] })]
);

export const postsToCategoriesRelations = relations(
  postsToCategoriesTable,
  ({ one }) => ({
    category: one(blogCategoriesTable, {
      fields: [postsToCategoriesTable.categoryId],
      references: [blogCategoriesTable.id]
    }),
    post: one(postsTable, {
      fields: [postsToCategoriesTable.postId],
      references: [postsTable.id]
    })
  })
);

export default postsToCategoriesTable;
