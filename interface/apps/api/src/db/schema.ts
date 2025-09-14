import { pgTable,pgEnum } from "drizzle-orm/pg-core";
import { text,uuid,numeric,jsonb } from "drizzle-orm/pg-core";



export const users= pgTable('users',{
    id:uuid('id').primaryKey().defaultRandom().notNull(),
    
})
