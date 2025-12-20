ALTER TABLE "teams_table" DROP COLUMN "team_name";--> statement-breakpoint
ALTER TABLE "teams_table" ADD COLUMN "team_number" serial NOT NULL;