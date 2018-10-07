CREATE DATABASE  IF NOT EXISTS `videonoleggio` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `videonoleggio`;
-- MySQL dump 10.13  Distrib 5.5.61, for Win64 (AMD64)
--
-- Host: localhost    Database: videonoleggio
-- ------------------------------------------------------
-- Server version	5.5.61

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `attore`
--

DROP TABLE IF EXISTS `attore`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `attore` (
  `id_attore` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) NOT NULL,
  `cognome` varchar(45) NOT NULL,
  PRIMARY KEY (`id_attore`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `casa_produttrice`
--

DROP TABLE IF EXISTS `casa_produttrice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `casa_produttrice` (
  `id_casa_produttrice` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) NOT NULL,
  PRIMARY KEY (`id_casa_produttrice`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cast`
--

DROP TABLE IF EXISTS `cast`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cast` (
  `id_cast` int(11) NOT NULL AUTO_INCREMENT,
  `id_attore` int(11) NOT NULL,
  `id_film` int(11) NOT NULL,
  PRIMARY KEY (`id_cast`),
  KEY `fk_attore_film_idx` (`id_attore`),
  KEY `fk_cast_film_idx` (`id_film`),
  CONSTRAINT `fk_cast_attore` FOREIGN KEY (`id_attore`) REFERENCES `attore` (`id_attore`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_cast_film` FOREIGN KEY (`id_film`) REFERENCES `film` (`id_film`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `citta`
--

DROP TABLE IF EXISTS `citta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `citta` (
  `id_citta` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) NOT NULL,
  PRIMARY KEY (`id_citta`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cliente`
--

DROP TABLE IF EXISTS `cliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cliente` (
  `id_cliente` int(11) NOT NULL AUTO_INCREMENT,
  `id_fidelizzazione` int(11) NOT NULL,
  `nome` varchar(45) NOT NULL,
  `cognome` varchar(45) NOT NULL,
  `indirizzo` varchar(45) NOT NULL,
  `telefono_casa` varchar(12) DEFAULT NULL,
  `telefono_cellulare` varchar(12) NOT NULL,
  `email` varchar(45) DEFAULT NULL,
  `data_nascita` date NOT NULL,
  `liberatoria` mediumblob,
  PRIMARY KEY (`id_cliente`),
  KEY `fk_cliente_fidelizzazione_idx` (`id_fidelizzazione`),
  CONSTRAINT `fk_cliente_fidelizzazione` FOREIGN KEY (`id_fidelizzazione`) REFERENCES `fidelizzazione` (`id_fidelizzazione`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `copia`
--

DROP TABLE IF EXISTS `copia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `copia` (
  `id_copia` int(11) NOT NULL AUTO_INCREMENT,
  `id_film` int(11) NOT NULL,
  `id_punto_vendita` int(11) NOT NULL,
  `id_fornitore` int(11) NOT NULL,
  `data_scarico` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `danneggiato` tinyint(4) DEFAULT '0',
  `restituito` tinyint(4) DEFAULT '0',
  `data_restituzione_copia` datetime DEFAULT NULL,
  `noleggiato` tinyint(4) DEFAULT '0',
  `data_prenotazione_noleggio` timestamp NULL DEFAULT NULL,
  `id_dipendente_prenotazione_noleggio` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_copia`),
  KEY `fk_copia_film_idx` (`id_film`),
  KEY `fk_copia_punto_vendita_idx` (`id_punto_vendita`),
  KEY `fk_copia_fornitore_idx` (`id_fornitore`),
  KEY `fk_copia_dipendente_idx` (`id_dipendente_prenotazione_noleggio`),
  CONSTRAINT `fk_copia_film` FOREIGN KEY (`id_film`) REFERENCES `film` (`id_film`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_copia_fornitore` FOREIGN KEY (`id_fornitore`) REFERENCES `fornitore` (`id_fornitore`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_copia_punto_vendita` FOREIGN KEY (`id_punto_vendita`) REFERENCES `punto_vendita` (`id_punto_vendita`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_copia_dipendente` FOREIGN KEY (`id_dipendente_prenotazione_noleggio`) REFERENCES `dipendente` (`id_dipendente`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=175 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `delega`
--

DROP TABLE IF EXISTS `delega`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `delega` (
  `id_delega` int(11) NOT NULL AUTO_INCREMENT,
  `codice` varchar(45) NOT NULL,
  `nome` varchar(45) NOT NULL,
  PRIMARY KEY (`id_delega`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `dipendente`
--

DROP TABLE IF EXISTS `dipendente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dipendente` (
  `id_dipendente` int(11) NOT NULL AUTO_INCREMENT,
  `id_delega` int(11) NOT NULL,
  `id_punto_vendita` int(11) NOT NULL,
  `nome` varchar(45) NOT NULL,
  `cognome` varchar(45) NOT NULL,
  `username` varchar(45) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id_dipendente`),
  KEY `fk_dipendente_delega_idx` (`id_delega`),
  KEY `fk_dipendente_punto_vendita_idx` (`id_punto_vendita`),
  CONSTRAINT `fk_dipendente_delega` FOREIGN KEY (`id_delega`) REFERENCES `delega` (`id_delega`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_dipendente_punto_vendita` FOREIGN KEY (`id_punto_vendita`) REFERENCES `punto_vendita` (`id_punto_vendita`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `fidelizzazione`
--

DROP TABLE IF EXISTS `fidelizzazione`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `fidelizzazione` (
  `id_fidelizzazione` int(11) NOT NULL AUTO_INCREMENT,
  `nome_fidelizzazione` varchar(45) NOT NULL,
  `percentuale` float NOT NULL,
  PRIMARY KEY (`id_fidelizzazione`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `film`
--

DROP TABLE IF EXISTS `film`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `film` (
  `id_film` int(11) NOT NULL AUTO_INCREMENT,
  `id_regista` int(11) NOT NULL,
  `id_genere` int(11) NOT NULL,
  `id_casa_produttrice` int(11) NOT NULL,
  `titolo` varchar(100) NOT NULL,
  `durata` int(11) NOT NULL,
  `prezzo_giornaliero` float NOT NULL,
  `inUscita` tinyint(4) DEFAULT '0',
  `data_uscita` date DEFAULT NULL,
  PRIMARY KEY (`id_film`),
  KEY `fk_film_regista_idx` (`id_regista`),
  KEY `fk_film_genere_idx` (`id_genere`),
  KEY `fk_film_casa_produttrice_idx` (`id_casa_produttrice`),
  CONSTRAINT `fk_film_casa_produttrice` FOREIGN KEY (`id_casa_produttrice`) REFERENCES `casa_produttrice` (`id_casa_produttrice`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_film_genere` FOREIGN KEY (`id_genere`) REFERENCES `genere` (`id_genere`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_film_regista` FOREIGN KEY (`id_regista`) REFERENCES `regista` (`id_regista`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `fornitore`
--

DROP TABLE IF EXISTS `fornitore`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `fornitore` (
  `id_fornitore` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) NOT NULL,
  PRIMARY KEY (`id_fornitore`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `genere`
--

DROP TABLE IF EXISTS `genere`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `genere` (
  `id_genere` int(11) NOT NULL AUTO_INCREMENT,
  `tipo` varchar(45) NOT NULL,
  PRIMARY KEY (`id_genere`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `impostazione`
--

DROP TABLE IF EXISTS `impostazione`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `impostazione` (
  `id_impostazione` int(11) NOT NULL AUTO_INCREMENT,
  `chiave` varchar(100) NOT NULL,
  `valore` varchar(10) NOT NULL,
  PRIMARY KEY (`id_impostazione`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `noleggio`
--

DROP TABLE IF EXISTS `noleggio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `noleggio` (
  `id_noleggio` int(11) NOT NULL AUTO_INCREMENT,
  `id_dipendente` int(11) NOT NULL,
  `id_punto_vendita` int(11) NOT NULL,
  `id_cliente` int(11) NOT NULL,
  `id_copia` int(11) NOT NULL,
  `id_tariffa` int(11) NOT NULL,
  `data_inizio` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `data_fine` datetime NOT NULL,
  `prezzo_totale` float DEFAULT NULL,
  `prezzo_extra` float DEFAULT NULL,
  PRIMARY KEY (`id_noleggio`),
  KEY `fk_noleggio_punto_vendita_idx` (`id_punto_vendita`),
  KEY `fk_noleggio_cliente_idx` (`id_cliente`),
  KEY `fk_noleggio_dipendente_idx` (`id_dipendente`),
  KEY `fk_noleggio_copia_idx` (`id_copia`),
  KEY `fk_noleggio_tariffa_idx` (`id_tariffa`),
  CONSTRAINT `fk_noleggio_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id_cliente`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_noleggio_copia` FOREIGN KEY (`id_copia`) REFERENCES `copia` (`id_copia`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_noleggio_dipendente` FOREIGN KEY (`id_dipendente`) REFERENCES `dipendente` (`id_dipendente`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_noleggio_punto_vendita` FOREIGN KEY (`id_punto_vendita`) REFERENCES `punto_vendita` (`id_punto_vendita`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_noleggio_tariffa` FOREIGN KEY (`id_tariffa`) REFERENCES `tariffa` (`id_tariffa`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=94 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `prenotazione`
--

DROP TABLE IF EXISTS `prenotazione`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `prenotazione` (
  `id_prenotazione` int(11) NOT NULL AUTO_INCREMENT,
  `id_cliente` int(11) NOT NULL,
  `id_dipendente` int(11) NOT NULL,
  `id_punto_vendita` int(11) NOT NULL,
  `id_film` int(11) NOT NULL,
  `ritirato` tinyint(4) DEFAULT '0',
  PRIMARY KEY (`id_prenotazione`),
  KEY `fk_prenotazione_cliente_idx` (`id_cliente`),
  KEY `fk_prenotazione_dipendente_idx` (`id_dipendente`),
  KEY `fk_prenotazione_film_idx` (`id_film`),
  KEY `fk_prenotazione_punto_vendita_idx` (`id_punto_vendita`),
  CONSTRAINT `fk_prenotazione_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id_cliente`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_prenotazione_dipendente` FOREIGN KEY (`id_dipendente`) REFERENCES `dipendente` (`id_dipendente`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_prenotazione_film` FOREIGN KEY (`id_film`) REFERENCES `film` (`id_film`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_prenotazione_punto_vendita` FOREIGN KEY (`id_punto_vendita`) REFERENCES `punto_vendita` (`id_punto_vendita`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary table structure for view `price_details`
--

DROP TABLE IF EXISTS `price_details`;
/*!50001 DROP VIEW IF EXISTS `price_details`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `price_details` (
  `id_noleggio` tinyint NOT NULL,
  `prezzo_giornaliero` tinyint NOT NULL,
  `tariffa` tinyint NOT NULL,
  `percentuale` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `punto_vendita`
--

DROP TABLE IF EXISTS `punto_vendita`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `punto_vendita` (
  `id_punto_vendita` int(11) NOT NULL AUTO_INCREMENT,
  `id_citta` int(11) NOT NULL,
  `nome` varchar(45) NOT NULL,
  `indirizzo` varchar(45) NOT NULL,
  PRIMARY KEY (`id_punto_vendita`),
  KEY `fk_punto_vendita_citta_idx` (`id_citta`),
  CONSTRAINT `fk_punto_vendita_citta` FOREIGN KEY (`id_citta`) REFERENCES `citta` (`id_citta`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `regista`
--

DROP TABLE IF EXISTS `regista`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `regista` (
  `id_regista` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) NOT NULL,
  `cognome` varchar(45) NOT NULL,
  PRIMARY KEY (`id_regista`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `storico_noleggio`
--

DROP TABLE IF EXISTS `storico_noleggio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `storico_noleggio` (
  `id_storico_noleggio` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_dipendente` int(11) NOT NULL,
  `id_punto_vendita` int(11) NOT NULL,
  `id_cliente` int(11) NOT NULL,
  `id_copia` int(11) NOT NULL,
  `id_tariffa` int(11) NOT NULL,
  `data_inizio` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `data_fine` datetime NOT NULL,
  `data_effettiva_restituzione` date NOT NULL,
  `prezzo_totale` float NOT NULL,
  `prezzo_extra` float DEFAULT NULL,
  PRIMARY KEY (`id_storico_noleggio`),
  KEY `fk_storico_noleggio_cliente_idx` (`id_cliente`),
  KEY `fk_storico_noleggio_copia_idx` (`id_copia`),
  KEY `fk_storico_noleggio_dipendente_idx` (`id_dipendente`),
  KEY `fk_storico_noleggio_punto_vendita_idx` (`id_punto_vendita`),
  KEY `fk_storico_noleggio_tariffa_idx` (`id_tariffa`),
  CONSTRAINT `fk_storico_noleggio_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id_cliente`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_storico_noleggio_copia` FOREIGN KEY (`id_copia`) REFERENCES `copia` (`id_copia`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_storico_noleggio_dipendente` FOREIGN KEY (`id_dipendente`) REFERENCES `dipendente` (`id_dipendente`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_storico_noleggio_punto_vendita` FOREIGN KEY (`id_punto_vendita`) REFERENCES `punto_vendita` (`id_punto_vendita`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_storico_noleggio_tariffa` FOREIGN KEY (`id_tariffa`) REFERENCES `tariffa` (`id_tariffa`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tariffa`
--

DROP TABLE IF EXISTS `tariffa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tariffa` (
  `id_tariffa` int(11) NOT NULL AUTO_INCREMENT,
  `tariffa` varchar(250) NOT NULL,
  `attiva` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id_tariffa`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping events for database 'videonoleggio'
--
/*!50106 SET @save_time_zone= @@TIME_ZONE */ ;
/*!50106 DROP EVENT IF EXISTS `RimuoviNoleggiTemporanei` */;
DELIMITER ;;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;;
/*!50003 SET character_set_client  = utf8 */ ;;
/*!50003 SET character_set_results = utf8 */ ;;
/*!50003 SET collation_connection  = utf8_general_ci */ ;;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;;
/*!50003 SET @saved_time_zone      = @@time_zone */ ;;
/*!50003 SET time_zone             = 'SYSTEM' */ ;;
/*!50106 CREATE*/ /*!50117 DEFINER=`root`@`localhost`*/ /*!50106 EVENT `RimuoviNoleggiTemporanei` ON SCHEDULE EVERY 10 MINUTE STARTS '2018-09-21 01:37:43' ON COMPLETION NOT PRESERVE ENABLE DO CALL clearAllExpiredTempRent() */ ;;
/*!50003 SET time_zone             = @saved_time_zone */ ;;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;;
/*!50003 SET character_set_client  = @saved_cs_client */ ;;
/*!50003 SET character_set_results = @saved_cs_results */ ;;
/*!50003 SET collation_connection  = @saved_col_connection */ ;;
DELIMITER ;
/*!50106 SET TIME_ZONE= @save_time_zone */ ;

--
-- Dumping routines for database 'videonoleggio'
--
/*!50003 DROP PROCEDURE IF EXISTS `clearAllExpiredTempRent` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `clearAllExpiredTempRent`()
BEGIN
	SET SQL_SAFE_UPDATES = 0;
	UPDATE copia
	LEFT OUTER JOIN noleggio
	ON copia.id_copia = noleggio.id_copia
    SET
    copia.noleggiato = 0,
    copia.data_prenotazione_noleggio = NULL,
    copia.id_dipendente_prenotazione_noleggio = NULL
	WHERE noleggio.id_copia IS NULL
	AND copia.noleggiato = 1
    AND copia.data_prenotazione_noleggio < DATE_SUB(NOW(), INTERVAL 10 MINUTE);
    SET SQL_SAFE_UPDATES = 1;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `clearAllExpiredTempRentForUser` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `clearAllExpiredTempRentForUser`(IN id_dipendente INT)
BEGIN
	SET SQL_SAFE_UPDATES = 0;
	UPDATE copia
	LEFT OUTER JOIN noleggio
	ON copia.id_copia = noleggio.id_copia
    SET
    copia.noleggiato = 0,
    copia.data_prenotazione_noleggio = NULL,
    copia.id_dipendente_prenotazione_noleggio = NULL
	WHERE noleggio.id_copia IS NULL
	AND copia.noleggiato = 1
    AND copia.id_dipendente_prenotazione_noleggio = id_dipendente;
    SET SQL_SAFE_UPDATES = 1;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Final view structure for view `price_details`
--

/*!50001 DROP TABLE IF EXISTS `price_details`*/;
/*!50001 DROP VIEW IF EXISTS `price_details`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `price_details` AS select `no`.`id_noleggio` AS `id_noleggio`,`fil`.`prezzo_giornaliero` AS `prezzo_giornaliero`,`ta`.`tariffa` AS `tariffa`,`fi`.`percentuale` AS `percentuale` from (((((`noleggio` `no` join `copia` `co` on((`no`.`id_copia` = `co`.`id_copia`))) join `film` `fil` on((`co`.`id_film` = `fil`.`id_film`))) join `tariffa` `ta` on((`no`.`id_tariffa` = `ta`.`id_tariffa`))) join `cliente` `cl` on((`no`.`id_cliente` = `cl`.`id_cliente`))) join `fidelizzazione` `fi` on((`cl`.`id_fidelizzazione` = `fi`.`id_fidelizzazione`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-10-07  2:51:55
