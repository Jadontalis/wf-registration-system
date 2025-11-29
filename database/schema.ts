
//Main entry-point for defining database schema using Drizzle ORM with PostgreSQL
//Schema definitions for users, registration carts, and registrations tables

//<-------------------------------------------------------------->//

//ASSOCIATIONS BETWEEN USER TABLES and REGISTRATION CART TABLE
    //User to Registration Cart
    //One-to-One
    //A user has one registration cart
    //A registration cart belongs to one user

//ASSOCIATIONS BETWEEN USER TABLES and REGISTRATION
    //User to Registration
    //One-to-Many
    //A user can have many registrations
    //A registration belongs to one user

//ASSOCIATIONS BETWEEN REGISTRATION CART TABLE and REGISTRATION
    //Registration Cart to Registration
    //One-to-Many
    //A registration cart can have many registrations
    //A registration belongs to one registration cart

//<-------------------------------------------------------------->//

import { uuid, varchar, integer, pgTable, serial, text, timestamp, pgEnum, date, boolean } from 'drizzle-orm/pg-core';

//User account status
export const  STATUS_ENUM= pgEnum('status_enum', ['APPROVED', 'REJECTED', 'PENDING']);
export const ROLE_ENUM= pgEnum('role_enum', ['USER', 'ADMIN']);
export const COMPETITOR_TYPE_ENUM = pgEnum('competitor_type_enum', ['RIDER', 'SKIER']);

//Registration cart status
export const REG_CART_STATUS_ENUM= pgEnum('reg_cart_status_enum', ['APPROVED', 'PENDING', 'REJECTED']);


export const usersTable = pgTable('users_table', 
{
  id: uuid('id').notNull().primaryKey().defaultRandom().unique(),
  full_name: varchar('full_name', {length: 255}).notNull(),
  email: text('email').notNull().unique(),
  phone: varchar('phone', {length: 20}).notNull().default(''),
  bios: text('bios').notNull(),
  password: text('password').notNull(),
  waiver_signed: boolean('waiver_signed').notNull().default(false),
  waiver_signed_at: timestamp('waiver_signed_at', { withTimezone: true }),
  competitor_type: COMPETITOR_TYPE_ENUM('competitor_type').notNull().default('RIDER'),
  status: STATUS_ENUM('status').notNull().default('PENDING'),
  role: ROLE_ENUM('role').notNull().default('USER'),
  last_activity_date: date('last_activity_date').notNull().defaultNow(),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const registrationCartTable = pgTable('registration_cart_table', 
{
  id: uuid('id').notNull().primaryKey().defaultRandom().unique(),
});

export const registrationTable = pgTable('registration_table',
{
    id: uuid('id').notNull().primaryKey().defaultRandom().unique(),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;
