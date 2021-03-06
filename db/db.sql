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
-- Dumping data for table `attore`
--

LOCK TABLES `attore` WRITE;
/*!40000 ALTER TABLE `attore` DISABLE KEYS */;
INSERT INTO `attore` VALUES (1,'Tim','Robbins'),(2,'Morgan','Freeman'),(3,'Bob','Gunton'),(4,'Marlon','Brando'),(5,'Al','Pacino'),(6,'James','Caan'),(7,'Christian','Bale'),(8,'Heath','Ledger'),(9,'Michael','Caine'),(10,'Tim','Roth'),(11,'John','Travolta'),(12,'Bruce','Willis'),(13,'Samuel L.','Jackson'),(14,'Liam','Neeson'),(15,'Orlando','Bloom'),(16,'Sean','Astin'),(17,'Viggo','Mortensen'),(18,'Clint','Eastwood'),(19,'Lee','Van Cleef'),(20,'Eli','Wallach'),(21,'Henry','Fonda'),(22,'Martin','Balsam');
/*!40000 ALTER TABLE `attore` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `casa_produttrice`
--

LOCK TABLES `casa_produttrice` WRITE;
/*!40000 ALTER TABLE `casa_produttrice` DISABLE KEYS */;
INSERT INTO `casa_produttrice` VALUES (1,'Castle Rock Entertainment'),(2,'Paramount Pictures'),(3,'Warner Bros.'),(4,'Miramax'),(5,'New Line Cinema'),(6,'Produzioni Europee Associate (PEA)'),(7,'Orion-Nova Productions'),(8,'New Line Cinema'),(9,'Universal Pictures');
/*!40000 ALTER TABLE `casa_produttrice` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `cast`
--

LOCK TABLES `cast` WRITE;
/*!40000 ALTER TABLE `cast` DISABLE KEYS */;
INSERT INTO `cast` VALUES (4,1,1),(5,2,1),(6,3,1),(7,4,2),(8,5,2),(9,6,2),(10,7,3),(11,8,3),(12,9,3),(13,10,4),(14,11,4),(15,12,4),(16,13,4),(17,14,5),(18,15,12),(19,16,12),(20,17,12),(21,15,14),(22,16,14),(23,17,14),(24,18,15),(25,19,15),(26,20,15),(27,21,16),(28,22,16);
/*!40000 ALTER TABLE `cast` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `citta`
--

LOCK TABLES `citta` WRITE;
/*!40000 ALTER TABLE `citta` DISABLE KEYS */;
INSERT INTO `citta` VALUES (1,'Genova'),(2,'Milano'),(3,'Torino'),(4,'Roma'),(5,'Trieste'),(6,'Napoli'),(7,'Venezia');
/*!40000 ALTER TABLE `citta` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `cliente`
--

LOCK TABLES `cliente` WRITE;
/*!40000 ALTER TABLE `cliente` DISABLE KEYS */;
INSERT INTO `cliente` VALUES (35,2,'Gianmattia','Gherardi','Largo Giuseppe Veratti 35','062396543','3483421212','giama@gmail.it','1986-10-04',NULL),(37,3,'Alfredino','Fallaci','Via Catullo 28','','03424748796','AlfredinoFallaci@armyspy.com','1971-02-03',NULL),(38,4,'Lucilla','Lucchese','Piazza Guglielmo Pepe 105','065415313','03980819008','LucillaLucchese@teleworm.us','1956-05-12',NULL),(39,4,'Gilberto','Padovano','Via Alfredo Fusco 13','063315481','03860998312','GilbertoPadovano@rhyta.com','1956-10-25',NULL),(40,2,'Fiamma','Lettiere','Corso Garibaldi 105','063215820','03359018922','FiammaLettiere@armyspy.com','1952-07-02',NULL),(41,3,'Ermenegildo','Trevisano','Via del Piave 30','06121612013','03174247508','ErmenegildoTrevisano@teleworm.us','1976-01-11',NULL),(42,1,'Sabrina','Longo','Via Genova 32','','03875842360',' SabrinaLongo@jourrapide.com','1995-10-11',NULL);
/*!40000 ALTER TABLE `cliente` ENABLE KEYS */;
UNLOCK TABLES;

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
  CONSTRAINT `fk_copia_dipendente` FOREIGN KEY (`id_dipendente_prenotazione_noleggio`) REFERENCES `dipendente` (`id_dipendente`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_copia_film` FOREIGN KEY (`id_film`) REFERENCES `film` (`id_film`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_copia_fornitore` FOREIGN KEY (`id_fornitore`) REFERENCES `fornitore` (`id_fornitore`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_copia_punto_vendita` FOREIGN KEY (`id_punto_vendita`) REFERENCES `punto_vendita` (`id_punto_vendita`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=190 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `copia`
--

LOCK TABLES `copia` WRITE;
/*!40000 ALTER TABLE `copia` DISABLE KEYS */;
INSERT INTO `copia` VALUES (120,1,1,1,'2018-09-27 07:00:43',0,0,NULL,1,'2018-09-27 07:32:55',3),(121,1,1,1,'2018-09-27 07:00:43',0,0,NULL,1,'2018-10-03 22:25:20',3),(122,1,1,1,'2018-09-27 07:00:43',0,0,NULL,1,'2018-10-03 22:19:59',5),(123,1,1,1,'2018-09-27 07:00:43',0,1,'2018-09-27 09:00:59',0,NULL,NULL),(124,1,1,1,'2018-09-27 07:00:43',0,1,'2018-09-27 09:00:59',0,NULL,NULL),(125,2,1,2,'2018-09-27 07:01:29',0,0,NULL,1,'2018-09-29 23:23:08',3),(126,2,1,2,'2018-09-27 07:01:29',0,0,NULL,1,'2018-09-27 07:33:43',2),(127,2,1,2,'2018-09-27 07:01:29',0,0,NULL,1,'2018-10-04 16:40:37',40),(128,2,1,2,'2018-09-27 07:01:29',0,0,NULL,1,'2018-09-28 19:27:29',2),(129,2,1,2,'2018-09-27 07:01:29',0,0,NULL,1,'2018-09-30 09:43:49',2),(130,2,1,2,'2018-09-27 07:01:29',0,0,NULL,0,NULL,NULL),(131,2,1,2,'2018-09-27 07:01:29',0,0,NULL,0,NULL,NULL),(132,2,1,2,'2018-09-27 07:01:29',0,0,NULL,0,NULL,NULL),(133,2,1,2,'2018-09-27 07:01:29',0,0,NULL,0,NULL,NULL),(134,2,1,2,'2018-09-27 07:01:29',0,0,NULL,0,NULL,NULL),(135,3,1,4,'2018-09-27 07:01:37',0,0,NULL,1,'2018-10-03 18:41:39',3),(136,3,1,4,'2018-09-27 07:01:37',0,0,NULL,0,NULL,NULL),(137,3,1,4,'2018-09-27 07:01:37',0,0,NULL,0,NULL,NULL),(138,3,1,4,'2018-09-27 07:01:37',0,0,NULL,1,'2018-09-28 18:16:32',3),(139,3,1,4,'2018-09-27 07:01:37',0,0,NULL,0,NULL,NULL),(140,3,1,4,'2018-09-27 07:01:37',0,0,NULL,0,NULL,NULL),(141,3,1,4,'2018-09-27 07:01:37',0,0,NULL,0,NULL,NULL),(142,3,1,4,'2018-09-27 07:01:37',0,0,NULL,0,NULL,NULL),(143,3,1,4,'2018-09-27 07:01:37',0,0,NULL,0,NULL,NULL),(144,3,1,4,'2018-09-27 07:01:37',0,0,NULL,0,NULL,NULL),(145,15,1,6,'2018-09-27 07:01:44',0,0,NULL,0,NULL,NULL),(146,15,1,6,'2018-09-27 07:01:44',0,0,NULL,0,NULL,NULL),(147,15,1,6,'2018-09-27 07:01:44',0,0,NULL,0,NULL,NULL),(148,15,1,6,'2018-09-27 07:01:44',0,0,NULL,0,NULL,NULL),(149,15,1,6,'2018-09-27 07:01:44',0,0,NULL,0,NULL,NULL),(150,15,1,5,'2018-09-27 07:01:50',0,0,NULL,1,'2018-10-03 22:26:21',2),(151,15,1,5,'2018-09-27 07:01:50',0,0,NULL,0,NULL,NULL),(152,15,1,5,'2018-09-27 07:01:50',0,0,NULL,0,NULL,NULL),(153,15,1,5,'2018-09-27 07:01:50',0,0,NULL,0,NULL,NULL),(154,15,1,5,'2018-09-27 07:01:50',0,0,NULL,1,'2018-10-03 22:25:20',3),(155,14,1,2,'2018-09-27 07:02:03',0,0,NULL,1,'2018-09-27 07:32:35',3),(156,14,1,2,'2018-09-27 07:02:03',0,0,NULL,1,'2018-09-27 07:33:43',2),(157,14,1,2,'2018-09-27 07:02:03',0,0,NULL,0,NULL,NULL),(158,14,1,2,'2018-09-27 07:02:03',0,0,NULL,1,'2018-09-29 23:23:08',3),(159,14,1,2,'2018-09-27 07:02:03',0,0,NULL,1,'2018-10-03 22:25:20',3),(160,14,1,2,'2018-09-27 07:02:03',0,0,NULL,1,'2018-10-03 22:26:21',2),(161,14,1,2,'2018-09-27 07:02:03',0,0,NULL,0,NULL,NULL),(162,14,1,2,'2018-09-27 07:02:03',0,0,NULL,0,NULL,NULL),(163,14,1,2,'2018-09-27 07:02:03',0,0,NULL,0,NULL,NULL),(164,14,1,2,'2018-09-27 07:02:03',0,0,NULL,0,NULL,NULL),(165,5,1,1,'2018-10-06 19:44:14',0,0,NULL,1,'2018-10-06 20:04:20',1),(166,5,1,1,'2018-10-06 19:44:14',0,0,NULL,0,NULL,NULL),(167,5,1,1,'2018-10-06 19:44:14',0,0,NULL,0,NULL,NULL),(168,5,1,1,'2018-10-06 19:44:14',0,0,NULL,0,NULL,NULL),(169,5,1,1,'2018-10-06 19:44:14',0,0,NULL,0,NULL,NULL),(170,5,1,1,'2018-10-06 19:44:14',0,0,NULL,0,NULL,NULL),(171,5,1,1,'2018-10-06 19:44:14',0,0,NULL,0,NULL,NULL),(172,5,1,1,'2018-10-06 19:44:14',0,0,NULL,0,NULL,NULL),(173,5,1,1,'2018-10-06 19:44:14',0,0,NULL,0,NULL,NULL),(174,5,1,1,'2018-10-06 19:44:14',0,0,NULL,0,NULL,NULL),(175,15,2,4,'2018-10-07 09:51:00',0,0,NULL,1,'2018-10-07 09:51:05',6),(176,15,2,4,'2018-10-07 09:51:00',0,0,NULL,1,'2018-10-07 10:52:47',6),(177,15,2,4,'2018-10-07 09:51:00',0,0,NULL,0,NULL,NULL),(178,15,2,4,'2018-10-07 09:51:00',0,0,NULL,0,NULL,NULL),(179,15,2,4,'2018-10-07 09:51:00',0,0,NULL,0,NULL,NULL),(180,15,2,4,'2018-10-07 09:51:00',0,0,NULL,0,NULL,NULL),(181,15,2,4,'2018-10-07 09:51:00',0,0,NULL,0,NULL,NULL),(182,15,2,4,'2018-10-07 09:51:00',0,0,NULL,0,NULL,NULL),(183,15,2,4,'2018-10-07 09:51:00',0,0,NULL,0,NULL,NULL),(184,15,2,4,'2018-10-07 09:51:00',0,0,NULL,0,NULL,NULL),(185,4,2,4,'2018-10-07 10:52:31',1,0,NULL,0,NULL,NULL),(186,4,2,4,'2018-10-07 10:52:31',0,1,'2018-10-07 12:54:00',0,NULL,NULL),(187,4,2,4,'2018-10-07 10:52:31',0,1,'2018-10-07 12:54:00',0,NULL,NULL),(188,4,2,4,'2018-10-07 10:52:31',0,1,'2018-10-07 12:54:00',0,NULL,NULL),(189,4,2,4,'2018-10-07 10:52:31',0,1,'2018-10-07 12:54:00',0,NULL,NULL);
/*!40000 ALTER TABLE `copia` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `delega`
--

LOCK TABLES `delega` WRITE;
/*!40000 ALTER TABLE `delega` DISABLE KEYS */;
INSERT INTO `delega` VALUES (1,'10','addetto'),(2,'20','responsabile'),(3,'30','proprietario');
/*!40000 ALTER TABLE `delega` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `dipendente`
--

LOCK TABLES `dipendente` WRITE;
/*!40000 ALTER TABLE `dipendente` DISABLE KEYS */;
INSERT INTO `dipendente` VALUES (1,3,1,'Gianmattia','Gherardi','admin','$2y$10$8BefxWbWyyJka.NQjlMS.uMvK9eZF50fbjsGct2eboNJnh6nmm.s2'),(2,2,1,'Mario','Rossi','MarRosRoma01','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(3,1,1,'Luigi','Verdi','LuiVerRoma01','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(4,1,1,'Calliope','Sagese','CalSagRoma01','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(5,1,1,'Adamo','Padovano','AdaPadRoma01','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(6,2,2,'Abelino','Genovesi','AbeGenRoma02','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(7,1,2,'Maria Rosa','Lucchesi','MarRosRoma02','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(8,1,2,'Dafne','Loggia','DafLogRoma02','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(9,2,3,'Guerrino','Manna','GueManRoma03','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(10,1,3,'Olga','Siciliani','OlgSicRoma03','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(11,2,4,'Tiziano','Calabrese','TizCalRoma04','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(12,1,4,'Clementina','Colombo','CleColRoma04','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(13,2,5,'Federico','Longo','FedLonGenova01','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(14,1,5,'Curzio','Cremonesi','CurCreGenova01','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(15,1,5,'Edgardo','Lucchesi','EdgLucGenova01','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(16,2,6,'Clementina','Lucciano','CleLucGenova02','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(17,1,6,'Bellina','Arcuri','BelArcGenova02','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(18,2,7,'Agostino','Li Fonti','AgoLifGenova03','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(19,1,7,'Sesto','Mancini','SesManGenova03','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(20,1,7,'Delfino','Calabresi','DelCalGenova03','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(21,2,8,'Lioba','Lori','LioLorTrieste01','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(22,1,8,'Monica','Rossi','MonRosTrieste01','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(23,1,8,'Gennaro','Trevisani','GenTreTrieste01','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(24,1,8,'Ireneo','Lucchesi','IreLucTrieste01','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(25,2,9,'Graziella','Padovesi','GraPadTrieste02','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(26,1,9,'Addolorata','DeRose','AddDerTrieste02','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(27,2,10,'Efisio','Milano','EfiMilTorino01','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(28,1,10,'Virginia','Trentini','VirTreTorino01','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(29,1,10,'Eric','Dellucci','EriDelTorino01','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(30,2,11,'Osvaldo','Baresi','OsvBarTorino02','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(31,1,11,'Marcello','Moretti','MarMorTorino02','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(32,1,11,'Giulio','Baresi','GiuBarTorino02','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(33,2,12,'Rodolfo','Lucchesi','RodLucTorino03','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(34,1,12,'Luciana','Zetticci','LucZetTorino03','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(35,2,13,'Agata','Li Fonti','AgaLifTorino04','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(36,1,13,'Olindo','Dellucci','OliDelTorino04','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(37,1,13,'Albino','Costa','AlbCosTorino04','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(39,3,1,'Guest','Guest','guest','$2y$10$GmgdQgrLFaWRcE/EU1jggeRaMagUsQed.VI8u2QgMsGFCqArzQPem'),(40,1,1,'Pippo','Paperino','pippaproma01','$2y$10$yTAjPGJODm030YSwDmJdPuYR7rXrBu1nuwALD3.jCFwIG8QoRTfrC');
/*!40000 ALTER TABLE `dipendente` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `fidelizzazione`
--

LOCK TABLES `fidelizzazione` WRITE;
/*!40000 ALTER TABLE `fidelizzazione` DISABLE KEYS */;
INSERT INTO `fidelizzazione` VALUES (1,'Argento',10),(2,'Oro',15),(3,'Platino',20),(4,'Base',0);
/*!40000 ALTER TABLE `fidelizzazione` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `film`
--

LOCK TABLES `film` WRITE;
/*!40000 ALTER TABLE `film` DISABLE KEYS */;
INSERT INTO `film` VALUES (1,1,1,1,'Le ali della libertà',142,5,0,NULL),(2,4,2,2,'Il padrino',175,5,0,NULL),(3,3,2,3,'Il cavaliere oscuro',152,8,0,NULL),(4,2,2,4,'Pulp fiction',154,6,1,'2018-10-10'),(5,5,1,9,'Schindler\'s List',195,5,1,'2018-10-03'),(12,6,4,5,'Il Signore degli Anelli - Il ritorno del re',201,8,1,'2018-09-27'),(14,6,4,5,'Il Signore degli Anelli - La compagnia dell\'Anello',178,8,0,NULL),(15,7,5,6,'Il buono, il brutto, il cattivo',161,5,0,NULL),(16,8,2,7,'La parola ai giurati',96,4.5,0,NULL);
/*!40000 ALTER TABLE `film` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `fornitore`
--

LOCK TABLES `fornitore` WRITE;
/*!40000 ALTER TABLE `fornitore` DISABLE KEYS */;
INSERT INTO `fornitore` VALUES (1,'Cinema Soul S.p.A.'),(2,'Movie Provider S.r.l.'),(3,'Home Video S.p.A.'),(4,'Big Cinema S.r.l.'),(5,'Shady Dealer S.r.l.'),(6,'No need for Theatres S.p.A.');
/*!40000 ALTER TABLE `fornitore` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `genere`
--

LOCK TABLES `genere` WRITE;
/*!40000 ALTER TABLE `genere` DISABLE KEYS */;
INSERT INTO `genere` VALUES (1,'Drammatico'),(2,'Thriller'),(3,'Azione'),(4,'Fantasy'),(5,'Western');
/*!40000 ALTER TABLE `genere` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `impostazione`
--

DROP TABLE IF EXISTS `impostazione`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `impostazione` (
  `id_impostazione` int(11) NOT NULL AUTO_INCREMENT,
  `chiave` varchar(100) NOT NULL,
  `valore` varchar(500) NOT NULL,
  PRIMARY KEY (`id_impostazione`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `impostazione`
--

LOCK TABLES `impostazione` WRITE;
/*!40000 ALTER TABLE `impostazione` DISABLE KEYS */;
INSERT INTO `impostazione` VALUES (1,'giorni_visibilita_prenotazioni','7'),(2,'tariffa','[{\"g\":1,\"s\":0},{\"g\":2,\"s\":10},{\"g\":3,\"s\":15},{\"g\":4,\"s\":20}]');
/*!40000 ALTER TABLE `impostazione` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `noleggio`
--

DROP TABLE IF EXISTS `noleggio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `noleggio` (
  `id_noleggio` int(11) NOT NULL AUTO_INCREMENT,
  `id_dipendente` int(11) NOT NULL,
  `id_cliente` int(11) NOT NULL,
  `id_copia` int(11) NOT NULL,
  `id_tariffa` int(11) NOT NULL,
  `data_inizio` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `data_fine` datetime NOT NULL,
  `prezzo_totale` float DEFAULT NULL,
  `prezzo_extra` float DEFAULT NULL,
  PRIMARY KEY (`id_noleggio`),
  KEY `fk_noleggio_cliente_idx` (`id_cliente`),
  KEY `fk_noleggio_dipendente_idx` (`id_dipendente`),
  KEY `fk_noleggio_copia_idx` (`id_copia`),
  KEY `fk_noleggio_tariffa_idx` (`id_tariffa`),
  CONSTRAINT `fk_noleggio_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id_cliente`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_noleggio_copia` FOREIGN KEY (`id_copia`) REFERENCES `copia` (`id_copia`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_noleggio_dipendente` FOREIGN KEY (`id_dipendente`) REFERENCES `dipendente` (`id_dipendente`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_noleggio_tariffa` FOREIGN KEY (`id_tariffa`) REFERENCES `tariffa` (`id_tariffa`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=98 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `noleggio`
--

LOCK TABLES `noleggio` WRITE;
/*!40000 ALTER TABLE `noleggio` DISABLE KEYS */;
INSERT INTO `noleggio` VALUES (48,3,40,155,1,'2018-09-23 07:32:49','2018-09-26 00:00:00',18.7,NULL),(50,3,41,120,1,'2018-09-27 07:33:05','2018-10-07 00:00:00',38.2,NULL),(52,2,42,126,1,'2018-09-27 07:33:59','2018-09-29 00:00:00',8.55,NULL),(53,2,42,156,1,'2018-09-27 07:33:59','2018-09-30 00:00:00',19.8,NULL),(58,3,38,138,1,'2018-09-28 18:17:49','2018-09-30 00:00:00',15.2,NULL),(65,2,41,128,1,'2018-09-28 19:27:49','2018-09-30 00:00:00',7.6,NULL),(68,3,40,125,1,'2018-09-29 23:23:23','2018-10-03 00:00:00',11.6875,NULL),(69,3,40,158,1,'2018-09-29 23:23:23','2018-10-04 00:00:00',24.14,NULL),(72,2,40,129,1,'2018-09-30 09:44:00','2018-10-03 00:00:00',11.6875,NULL),(73,3,40,135,1,'2018-10-03 18:41:55','2018-10-07 00:00:00',24.14,NULL),(78,5,42,122,1,'2018-10-03 22:20:15','2018-10-07 00:00:00',12.375,NULL),(80,3,38,121,1,'2018-10-03 22:25:46','2018-10-07 00:00:00',13.75,NULL),(81,3,38,159,1,'2018-10-03 22:25:46','2018-10-07 00:00:00',22,NULL),(82,3,38,154,1,'2018-10-03 22:25:46','2018-10-07 00:00:00',13.75,NULL),(83,2,40,160,1,'2018-10-03 22:26:47','2018-10-09 00:00:00',30.94,NULL),(84,2,40,150,1,'2018-10-03 22:26:47','2018-10-09 00:00:00',19.3375,NULL),(85,40,40,127,1,'2018-10-04 16:40:50','2018-10-05 00:00:00',4.25,NULL),(93,1,38,165,1,'2018-10-06 20:06:06','2018-10-08 00:00:00',9.5,NULL),(94,6,41,175,1,'2018-10-07 09:51:14','2018-10-25 00:00:00',70.2,NULL),(97,6,42,176,1,'2018-10-07 10:52:55','2018-10-09 00:00:00',8.55,NULL);
/*!40000 ALTER TABLE `noleggio` ENABLE KEYS */;
UNLOCK TABLES;

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
  `id_film` int(11) NOT NULL,
  `ritirato` tinyint(4) DEFAULT '0',
  PRIMARY KEY (`id_prenotazione`),
  KEY `fk_prenotazione_cliente_idx` (`id_cliente`),
  KEY `fk_prenotazione_dipendente_idx` (`id_dipendente`),
  KEY `fk_prenotazione_film_idx` (`id_film`),
  CONSTRAINT `fk_prenotazione_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id_cliente`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_prenotazione_dipendente` FOREIGN KEY (`id_dipendente`) REFERENCES `dipendente` (`id_dipendente`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_prenotazione_film` FOREIGN KEY (`id_film`) REFERENCES `film` (`id_film`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prenotazione`
--

LOCK TABLES `prenotazione` WRITE;
/*!40000 ALTER TABLE `prenotazione` DISABLE KEYS */;
INSERT INTO `prenotazione` VALUES (18,38,2,4,NULL),(19,39,2,4,NULL),(20,40,2,4,NULL),(21,41,2,4,NULL),(22,42,2,4,NULL),(23,38,1,5,1),(24,39,1,5,0),(25,40,1,5,0),(26,41,1,4,0),(27,42,6,4,1);
/*!40000 ALTER TABLE `prenotazione` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `punto_vendita`
--

LOCK TABLES `punto_vendita` WRITE;
/*!40000 ALTER TABLE `punto_vendita` DISABLE KEYS */;
INSERT INTO `punto_vendita` VALUES (1,4,'Roma01','Largo Giuseppe Veratti 37'),(2,4,'Roma02','Via Riccardo Morandi 32'),(3,4,'Roma03','Viale Marconi 5'),(4,4,'Roma04','Via Tuscolana 112'),(5,1,'Genova01','Via Marcello Prestinari 12'),(6,1,'Genova02','Via Martiri della libertà 22'),(7,1,'Genova03','Via Cantore 150'),(8,5,'Trieste01','Viale Gabriele d\'Annunzio 2'),(9,5,'Trieste02','Via Dandolo Enrico 8'),(10,3,'Torino01','Via Adamello 16'),(11,3,'Torino02','Via Stelvio 27'),(12,3,'Torino03','Via Principessa Clotilde 123'),(13,3,'Torino04','Corso Principe Oddone 23');
/*!40000 ALTER TABLE `punto_vendita` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `regista`
--

LOCK TABLES `regista` WRITE;
/*!40000 ALTER TABLE `regista` DISABLE KEYS */;
INSERT INTO `regista` VALUES (1,'Frank','Darabont'),(2,'Quentin','Tarantino'),(3,'Christopher','Nolan'),(4,'Francis','Ford Coppola'),(5,'Steven','Spielberg'),(6,'Peter','Jackson'),(7,'Sergio','Leone'),(8,'Sidney','Lumet');
/*!40000 ALTER TABLE `regista` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `storico_noleggio`
--

DROP TABLE IF EXISTS `storico_noleggio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `storico_noleggio` (
  `id_storico_noleggio` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_dipendente` int(11) NOT NULL,
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
  KEY `fk_storico_noleggio_tariffa_idx` (`id_tariffa`),
  CONSTRAINT `fk_storico_noleggio_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id_cliente`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_storico_noleggio_copia` FOREIGN KEY (`id_copia`) REFERENCES `copia` (`id_copia`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_storico_noleggio_dipendente` FOREIGN KEY (`id_dipendente`) REFERENCES `dipendente` (`id_dipendente`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_storico_noleggio_tariffa` FOREIGN KEY (`id_tariffa`) REFERENCES `tariffa` (`id_tariffa`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `storico_noleggio`
--

LOCK TABLES `storico_noleggio` WRITE;
/*!40000 ALTER TABLE `storico_noleggio` DISABLE KEYS */;
INSERT INTO `storico_noleggio` VALUES (1,4,38,150,1,'2018-10-06 20:20:48','2018-09-30 00:00:00','2018-10-06',13.75,0),(2,4,38,150,1,'2018-10-06 20:20:28','2018-09-30 00:00:00','2018-10-06',13.75,0),(3,4,38,157,1,'2018-10-06 20:20:28','2018-09-29 00:00:00','2018-10-06',15.2,0),(4,4,38,150,1,'2018-10-06 20:20:28','2018-09-30 00:00:00','2018-10-06',13.75,0),(5,3,38,157,1,'2018-10-06 20:20:28','2018-10-01 00:00:00','2018-10-06',22,0),(6,3,38,150,1,'2018-10-06 20:20:28','2018-10-02 00:00:00','2018-10-06',17.75,0),(8,2,40,150,1,'2018-10-06 20:20:28','2018-09-30 00:00:00','2018-10-06',8.075,0),(9,3,41,139,1,'2018-10-06 20:20:28','2018-10-04 00:00:00','2018-10-06',35.52,0),(10,3,41,151,1,'2018-10-06 20:20:28','2018-10-05 00:00:00','2018-10-06',26.2,0),(11,2,41,139,1,'2018-10-06 20:20:28','2018-10-04 00:00:00','2018-10-06',35.52,0),(12,2,41,158,1,'2018-10-06 20:20:28','2018-09-30 00:00:00','2018-10-06',12.16,0),(13,2,41,139,1,'2018-10-06 20:20:28','2018-10-04 00:00:00','2018-10-06',35.52,0),(14,2,41,158,1,'2018-10-06 20:20:28','2018-09-30 00:00:00','2018-10-06',12.16,0),(15,1,37,125,1,'2018-10-06 20:20:28','2018-09-29 00:00:00','2018-10-06',7.6,0),(16,1,37,135,1,'2018-10-06 20:20:28','2018-09-30 00:00:00','2018-10-06',17.6,0),(17,2,37,136,1,'2018-10-06 20:20:28','2018-09-30 00:00:00','2018-10-06',17.6,0),(18,4,38,137,1,'2018-10-06 20:20:28','2018-09-24 00:00:00','2018-10-06',8,0),(19,3,38,127,1,'2018-10-06 20:20:28','2018-09-29 00:00:00','2018-10-06',5,0),(20,3,40,154,1,'2018-10-06 20:20:28','2018-10-03 00:00:00','2018-10-06',23.5875,0),(21,2,40,157,1,'2018-10-06 20:20:28','2018-09-30 00:00:00','2018-10-06',12.92,0),(22,2,40,154,1,'2018-10-06 20:20:28','2018-10-03 00:00:00','2018-10-06',11.6875,0),(23,2,41,135,1,'2018-10-06 20:20:28','2018-10-05 00:00:00','2018-10-06',29.12,0),(24,5,41,136,1,'2018-10-06 20:20:28','2018-10-08 00:00:00','2018-10-06',22.72,0),(25,5,41,130,1,'2018-10-06 20:20:28','2018-10-07 00:00:00','2018-10-06',11,0),(26,5,41,121,1,'2018-10-06 20:20:28','2018-10-07 00:00:00','2018-10-06',11,0),(27,2,41,127,1,'2018-10-06 20:20:28','2018-10-04 00:00:00','2018-10-06',14.2,0),(28,5,42,130,1,'2018-10-06 20:20:28','2018-10-07 00:00:00','2018-10-06',12.375,10),(31,3,40,157,1,'2018-10-03 18:41:55','2018-10-08 00:00:00','2018-10-06',30.94,16),(32,1,42,151,1,'2018-10-07 10:31:24','2018-10-10 00:00:00','2018-10-07',12.375,10),(33,1,42,166,1,'2018-10-07 10:32:57','2018-10-08 00:00:00','2018-10-07',4.5,0),(34,6,42,185,1,'2018-10-07 10:53:13','2018-10-10 00:00:00','2018-10-07',14.85,12),(35,6,42,185,1,'2018-10-07 10:58:12','2018-10-11 00:00:00','2018-10-07',19.17,12),(36,6,42,185,1,'2018-10-07 11:00:31','2018-10-09 00:00:00','2018-10-07',10.26,12);
/*!40000 ALTER TABLE `storico_noleggio` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `tariffa`
--

LOCK TABLES `tariffa` WRITE;
/*!40000 ALTER TABLE `tariffa` DISABLE KEYS */;
INSERT INTO `tariffa` VALUES (1,'[{\"g\":1,\"s\":0},{\"g\":2,\"s\":10},{\"g\":3,\"s\":15},{\"g\":4,\"s\":20}]',1);
/*!40000 ALTER TABLE `tariffa` ENABLE KEYS */;
UNLOCK TABLES;

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

-- Dump completed on 2018-10-07 14:57:20
