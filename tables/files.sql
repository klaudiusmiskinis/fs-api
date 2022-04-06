SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `files` (
  `id` smallint(6) NOT NULL,
  `name` varchar(80) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `path` varchar(1024) CHARACTER SET utf8 COLLATE utf8_spanish2_ci DEFAULT '/',
  `idParent` smallint(6) DEFAULT NULL,
  `isLastVersion` tinyint(4) DEFAULT NULL,
  `createdDate` date DEFAULT NULL,
  `isRemoved` tinyint(4) DEFAULT NULL,
  `removedDate` date DEFAULT NULL,
  `reason` varchar(300) DEFAULT 'Sin motivos.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `files`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `files`
  MODIFY `id` smallint(6) NOT NULL AUTO_INCREMENT;
COMMIT;
