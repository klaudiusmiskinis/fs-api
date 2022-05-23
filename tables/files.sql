CREATE TABLE `files` (
  `id` smallint(6) NOT NULL,
  `name` varchar(80) NOT NULL,
  `path` varchar(1024) DEFAULT '/',
  `idParent` int(6) DEFAULT NULL,
  `isLastVersion` tinyint(4) DEFAULT NULL,
  `createdDate` date DEFAULT NULL,
  `isRemoved` tinyint(4) DEFAULT NULL,
  `removedDate` date DEFAULT NULL,
  `updateDate` date DEFAULT NULL,
  `reason` varchar(300) DEFAULT 'Sin motivos.',
  `author` varchar(300) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;