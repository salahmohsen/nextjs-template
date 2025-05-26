import { relations } from 'drizzle-orm'
import {
  boolean,
  customType,
  date,
  integer,
  json,
  pgTable,
  serial,
  text,
  timestamp,
  varchar
} from 'drizzle-orm/pg-core'

import enrollmentTable from './enrollment'
import userTable from './user'

export type JSONContent = {
  [key: string]: unknown
  attrs?: Record<string, unknown>
  content?: JSONContent[]
  marks?: {
    [key: string]: unknown
    attrs?: Record<string, unknown>
    type: string
  }[]
  text?: string
  type?: string
}

type TimeSlot = {
  from: Date
  to: Date
}

const timeSlot = customType<{ data: TimeSlot }>({
  dataType: () => 'json',
  fromDriver: (value: unknown): TimeSlot => {
    // Runtime validation
    if (typeof value === 'object' && value !== null) {
      const slot = value as { from?: string; to?: string }
      return {
        from: new Date(slot.from || Date.now()),
        to: new Date(slot.to || Date.now())
      }
    }
    throw new Error('Invalid time slot format')
  },
  toDriver: (value: TimeSlot): unknown => ({
    from: value.from.toISOString(),
    to: value.to.toISOString()
  })
})

const courseTable = pgTable('course', {
  applyUrl: text('apply_url'),
  arContent: json('ar_content').$type<JSONContent>(),
  arTitle: varchar('ar_title', { length: 255 }),
  attendance: varchar('attendance', { length: 50 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
    .notNull()
    .defaultNow(),
  days: json('days').$type<
    {
      disable?: boolean
      label: string
      value: string
    }[]
  >(),
  draftMode: boolean('draft_mode').default(true),
  enContent: json('en_content').$type<JSONContent>(),
  endDate: date('end_date', { mode: 'date' }).notNull(),
  enTitle: varchar('en_title', { length: 255 }),
  featuredImage: text('featured_image'),
  fellowId: text('fellow_id')
    .notNull()
    .references(() => userTable.id),
  id: serial('id').primaryKey(),
  isRegistrationOpen: boolean('is_registration_open').notNull().default(false),
  maxStudents: integer('max_students'),
  startDate: date('start_date', { mode: 'date' }).notNull(),
  suggestedPrice: json('suggestedPrice').notNull().$type<[number, number]>(),
  timeSlot: timeSlot('time_slot').notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true })
    .notNull()
    .defaultNow()
})

export const courseRelations = relations(courseTable, ({ many, one }) => ({
  enrollments: many(enrollmentTable),
  fellow: one(userTable, {
    fields: [courseTable.fellowId],
    references: [userTable.id]
  })
}))

export default courseTable
