
USE donjon;

-- donjon.levels definition

CREATE TABLE `levels` (
  `discord_id` varchar(100) NOT NULL,
  `xp` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`discord_id`)
);


-- donjon.user_stats definition

CREATE TABLE `user_stats` (
  `user_id` varchar(100) NOT NULL,
  `xp` bigint(20) unsigned DEFAULT 0,
  `messages` int(10) unsigned DEFAULT 0,
  `minutesInVoice` int(10) unsigned DEFAULT 0,
  `adminGive` bigint(20) unsigned DEFAULT 0,
  `react` bigint(20) unsigned DEFAULT 0,
  `img` int(10) unsigned DEFAULT 0,
  `level` int(10) unsigned DEFAULT 0,
  `bonus` bigint(20) unsigned DEFAULT 0,
  PRIMARY KEY (`user_id`)
);


-- donjon.users definition

CREATE TABLE `users` (
  `user_id` varchar(100) NOT NULL,
  `isMember` tinyint(1) DEFAULT 0,
  `discord_username` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
);