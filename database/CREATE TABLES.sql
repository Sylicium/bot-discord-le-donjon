-- donjon.users definition

CREATE TABLE `users` (
  `id` varchar(100) DEFAULT NULL,
  `discord_id` varchar(100) DEFAULT NULL,
  `discord_name` varchar(100) DEFAULT NULL
);


-- donjon.levels definition

CREATE TABLE `levels` (
  `discord_id` varchar(100) DEFAULT NULL,
  `xp` bigint(20) unsigned DEFAULT NULL
);