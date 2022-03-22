CREATE TABLE `archivos` (
	`idArchivo` SMALLINT NOT NULL AUTO_INCREMENT,
	`nombre` VARCHAR(80) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
	`ruta` VARCHAR(1024) CHARACTER SET utf8 COLLATE utf8_spanish2_ci DEFAULT '/',
	`idPadre` SMALLINT DEFAULT NULL,
	`ultimaVersion` TINYINT DEFAULT NULL,
	`fechaCreacion` DATE,
	`eliminado` TINYINT DEFAULT NULL,
	`fechaEliminado` DATE,
	`motivo` VARCHAR(300) DEFAULT 'Sin motivos.',
	PRIMARY KEY (`idArchivo`)
) ENGINE=InnoDB;