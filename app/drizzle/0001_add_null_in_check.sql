PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_user` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`password_hash` text NOT NULL,
	`goal` text,
	`goalWeight` integer,
	CONSTRAINT "goalCheck" CHECK("__new_user"."goal" IS NULL OR "__new_user"."goal" IN ('cutting', 'bulking', 'maintaining', 'cardio', 'strength')),
	CONSTRAINT "goalWeightCheck" CHECK("__new_user"."goalWeight" IS NULL OR "__new_user"."goalWeight" > 40)
);
--> statement-breakpoint
INSERT INTO `__new_user`("id", "username", "password_hash", "goal", "goalWeight") SELECT "id", "username", "password_hash", "goal", "goalWeight" FROM `user`;--> statement-breakpoint
DROP TABLE `user`;--> statement-breakpoint
ALTER TABLE `__new_user` RENAME TO `user`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `user_username_unique` ON `user` (`username`);