CREATE INDEX "team_rider_id_idx" ON "teams_table" USING btree ("rider_id");--> statement-breakpoint
CREATE INDEX "team_skier_id_idx" ON "teams_table" USING btree ("skier_id");--> statement-breakpoint
CREATE INDEX "team_cart_id_idx" ON "teams_table" USING btree ("cart_id");