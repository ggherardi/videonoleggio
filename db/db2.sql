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
  `nome` varchar(45) DEFAULT NULL,
  `cognome` varchar(45) DEFAULT NULL,
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
  `nome` varchar(45) DEFAULT NULL,
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
  `id_attore` int(11) DEFAULT NULL,
  `id_film` int(11) DEFAULT NULL,
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
  `nome` varchar(45) DEFAULT NULL,
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
  `nome` varchar(45) DEFAULT NULL,
  `cognome` varchar(45) DEFAULT NULL,
  `indirizzo` varchar(45) DEFAULT NULL,
  `telefono_casa` varchar(12) DEFAULT NULL,
  `telefono_cellulare` varchar(12) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `data_nascita` date DEFAULT NULL,
  `posizione_liberatoria` varchar(45) DEFAULT NULL,
  `id_sconto` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_cliente`),
  KEY `fk_cliente_sconto_idx` (`id_sconto`),
  CONSTRAINT `fk_cliente_sconto` FOREIGN KEY (`id_sconto`) REFERENCES `sconto` (`id_sconto`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cliente`
--

LOCK TABLES `cliente` WRITE;
/*!40000 ALTER TABLE `cliente` DISABLE KEYS */;
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
  `id_film` int(11) DEFAULT NULL,
  `id_punto_vendita` int(11) DEFAULT NULL,
  `id_fornitore` int(11) DEFAULT NULL,
  `data_scarico` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `danneggiato` tinyint(4) DEFAULT '0',
  `noleggiato` tinyint(4) DEFAULT '0',
  `restituito` tinyint(4) DEFAULT '0',
  PRIMARY KEY (`id_copia`),
  KEY `fk_partita_film_idx` (`id_film`),
  KEY `fk_partita_punto_vendita_idx` (`id_punto_vendita`),
  KEY `fk_partita_fornitore_idx` (`id_fornitore`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `copia`
--

LOCK TABLES `copia` WRITE;
/*!40000 ALTER TABLE `copia` DISABLE KEYS */;
INSERT INTO `copia` VALUES (1,1,1,1,'2018-07-05 15:13:42',0,1,0),(53,1,1,1,'2018-09-16 16:08:52',0,0,0),(54,1,1,1,'2018-09-16 16:08:52',0,0,1),(55,12,1,4,'2018-06-29 16:09:02',0,1,0),(56,12,1,4,'2018-09-16 16:09:02',0,0,0),(57,12,1,4,'2018-09-16 16:09:02',0,1,0),(58,12,1,4,'2018-09-16 16:09:02',0,0,0),(59,12,1,4,'2018-09-16 16:09:02',0,0,0),(60,12,1,4,'2018-09-16 16:09:02',0,0,0),(61,12,1,4,'2018-09-16 16:09:02',0,0,1),(62,12,1,4,'2018-09-16 16:09:02',0,0,1),(63,12,1,4,'2018-09-16 16:09:02',0,0,1),(64,12,1,4,'2018-09-16 16:09:02',0,0,1);
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
  `codice` varchar(45) DEFAULT NULL,
  `nome` varchar(45) DEFAULT NULL,
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
  `id_delega` int(11) DEFAULT NULL,
  `id_punto_vendita` int(11) DEFAULT NULL,
  `nome` varchar(45) DEFAULT NULL,
  `cognome` varchar(45) DEFAULT NULL,
  `username` varchar(45) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_dipendente`),
  KEY `fk_dipendente_delega_idx` (`id_delega`),
  KEY `fk_dipendente_punto_vendita_idx` (`id_punto_vendita`),
  CONSTRAINT `fk_dipendente_delega` FOREIGN KEY (`id_delega`) REFERENCES `delega` (`id_delega`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_dipendente_punto_vendita` FOREIGN KEY (`id_punto_vendita`) REFERENCES `punto_vendita` (`id_punto_vendita`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dipendente`
--

LOCK TABLES `dipendente` WRITE;
/*!40000 ALTER TABLE `dipendente` DISABLE KEYS */;
INSERT INTO `dipendente` VALUES (1,3,1,'Gianmattia','Gherardi','admin','$2y$10$8BefxWbWyyJka.NQjlMS.uMvK9eZF50fbjsGct2eboNJnh6nmm.s2'),(2,2,1,'Mario','Rossi','MarRosRoma01','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(3,1,1,'Luigi','Verdi','LuiVerRoma01','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(4,1,1,'Calliope','Sagese','CalSagRoma01','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(5,1,1,'Adamo','Padovano','AdaPadRoma01','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(6,2,2,'Abelino','Genovesi','AbeGenRoma02','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(7,1,2,'Maria Rosa','Lucchesi','MarRosRoma02','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(8,1,2,'Dafne','Loggia','DafLogRoma02','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(9,2,3,'Guerrino','Manna','GueManRoma03','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(10,1,3,'Olga','Siciliani','OlgSicRoma03','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(11,2,4,'Tiziano','Calabrese','TizCalRoma04','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(12,1,4,'Clementina','Colombo','CleColRoma04','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(13,2,5,'Federico','Longo','FedLonGenova01','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(14,1,5,'Curzio','Cremonesi','CurCreGenova01','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(15,1,5,'Edgardo','Lucchesi','EdgLucGenova01','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(16,2,6,'Clementina','Lucciano','CleLucGenova02','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(17,1,6,'Bellina','Arcuri','BelArcGenova02','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(18,2,7,'Agostino','Li Fonti','AgoLifGenova03','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(19,1,7,'Sesto','Mancini','SesManGenova03','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(20,1,7,'Delfino','Calabresi','DelCalGenova03','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(21,2,8,'Lioba','Lori','LioLorTrieste01','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(22,1,8,'Monica','Rossi','MonRosTrieste01','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(23,1,8,'Gennaro','Trevisani','GenTreTrieste01','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(24,1,8,'Ireneo','Lucchesi','IreLucTrieste01','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(25,2,9,'Graziella','Padovesi','GraPadTrieste02','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(26,1,9,'Addolorata','DeRose','AddDerTrieste02','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(27,2,10,'Efisio','Milano','EfiMilTorino01','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(28,1,10,'Virginia','Trentini','VirTreTorino01','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(29,1,10,'Eric','Dellucci','EriDelTorino01','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(30,2,11,'Osvaldo','Baresi','OsvBarTorino02','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(31,1,11,'Marcello','Moretti','MarMorTorino02','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(32,1,11,'Giulio','Baresi','GiuBarTorino02','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(33,2,12,'Rodolfo','Lucchesi','RodLucTorino03','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(34,1,12,'Luciana','Zetticci','LucZetTorino03','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(35,2,13,'Agata','Li Fonti','AgaLifTorino04','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(36,1,13,'Olindo','Dellucci','OliDelTorino04','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS'),(37,1,13,'Albino','Costa','AlbCosTorino04','$2y$10$BXXyQk20Pm1Nj8j3gTcANOobedZFrvM7X.6OPIwAu0Cm6k6uAVRQS');
/*!40000 ALTER TABLE `dipendente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `film`
--

DROP TABLE IF EXISTS `film`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `film` (
  `id_film` int(11) NOT NULL AUTO_INCREMENT,
  `id_regista` int(11) DEFAULT NULL,
  `id_genere` int(11) DEFAULT NULL,
  `id_casa_produttrice` int(11) DEFAULT NULL,
  `titolo` varchar(100) DEFAULT NULL,
  `durata` int(11) DEFAULT NULL,
  `prezzo_giornaliero` float DEFAULT NULL,
  `inUscita` tinyint(4) DEFAULT '0',
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
INSERT INTO `film` VALUES (1,1,1,1,'Le ali della libertà',142,5,0),(2,4,2,2,'Il padrino',175,5,0),(3,3,2,3,'Il cavaliere oscuro',152,8,0),(4,2,2,4,'Pulp fiction',154,6,0),(5,5,1,9,'Schindler\'s List',195,5,0),(12,6,4,5,'Il Signore degli Anelli - Il ritorno del re',201,8,0),(14,6,4,5,'Il Signore degli Anelli - La compagnia dell\'Anello',178,8,0),(15,7,5,6,'Il buono, il brutto, il cattivo',161,5,0),(16,8,2,7,'La parola ai giurati',96,4,0);
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
  `nome` varchar(45) DEFAULT NULL,
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
  `tipo` varchar(45) DEFAULT NULL,
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
-- Table structure for table `noleggio`
--

DROP TABLE IF EXISTS `noleggio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `noleggio` (
  `id_noleggio` int(11) NOT NULL AUTO_INCREMENT,
  `id_dipendente` int(11) DEFAULT NULL,
  `id_punto_vendita` int(11) DEFAULT NULL,
  `id_cliente` int(11) DEFAULT NULL,
  `id_copia` int(11) DEFAULT NULL,
  `data_inizio` datetime DEFAULT NULL,
  `data_fine` datetime DEFAULT NULL,
  `prezzo_totale` float DEFAULT NULL,
  PRIMARY KEY (`id_noleggio`),
  KEY `fk_noleggio_punto_vendita_idx` (`id_punto_vendita`),
  KEY `fk_noleggio_cliente_idx` (`id_cliente`),
  KEY `fk_noleggio_dipendente_idx` (`id_dipendente`),
  KEY `fk_noleggio_copia_idx` (`id_copia`),
  CONSTRAINT `fk_noleggio_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id_cliente`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_noleggio_copia` FOREIGN KEY (`id_copia`) REFERENCES `copia` (`id_copia`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_noleggio_dipendente` FOREIGN KEY (`id_dipendente`) REFERENCES `dipendente` (`id_dipendente`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_noleggio_punto_vendita` FOREIGN KEY (`id_punto_vendita`) REFERENCES `punto_vendita` (`id_punto_vendita`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `noleggio`
--

LOCK TABLES `noleggio` WRITE;
/*!40000 ALTER TABLE `noleggio` DISABLE KEYS */;
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
  `id_cliente` int(11) DEFAULT NULL,
  `id_dipendente` int(11) DEFAULT NULL,
  `id_video` int(11) DEFAULT NULL,
  `id_stato_prenotazione` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_prenotazione`),
  KEY `fk_prenotazione_cliente_idx` (`id_cliente`),
  KEY `fk_prenotazione_dipendente_idx` (`id_dipendente`),
  KEY `fk_prenotazione_film_idx` (`id_video`),
  KEY `fk_prenotazione_stato_prenotazione_idx` (`id_stato_prenotazione`),
  CONSTRAINT `fk_prenotazione_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id_cliente`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_prenotazione_dipendente` FOREIGN KEY (`id_dipendente`) REFERENCES `dipendente` (`id_dipendente`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_prenotazione_film` FOREIGN KEY (`id_video`) REFERENCES `film` (`id_film`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_prenotazione_stato_prenotazione` FOREIGN KEY (`id_stato_prenotazione`) REFERENCES `stato_prenotazione` (`id_stato_prenotazione`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prenotazione`
--

LOCK TABLES `prenotazione` WRITE;
/*!40000 ALTER TABLE `prenotazione` DISABLE KEYS */;
/*!40000 ALTER TABLE `prenotazione` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `punto_vendita`
--

DROP TABLE IF EXISTS `punto_vendita`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `punto_vendita` (
  `id_punto_vendita` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) DEFAULT NULL,
  `indirizzo` varchar(45) DEFAULT NULL,
  `id_citta` int(11) DEFAULT NULL,
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
INSERT INTO `punto_vendita` VALUES (1,'Roma01','Largo Giuseppe Veratti 37',4),(2,'Roma02','Via Riccardo Morandi 32',4),(3,'Roma03','Viale Marconi 5',4),(4,'Roma04','Via Tuscolana 112',4),(5,'Genova01','Via Marcello Prestinari 12',1),(6,'Genova02','Via Martiri della libertà 22',1),(7,'Genova03','Via Cantore 150',1),(8,'Trieste01','Viale Gabriele d\'Annunzio 2',5),(9,'Trieste02','Via Dandolo Enrico 8',5),(10,'Torino01','Via Adamello 16',3),(11,'Torino02','Via Stelvio 27',3),(12,'Torino03','Via Principessa Clotilde 123',3),(13,'Torino04','Corso Principe Oddone 23',3);
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
  `nome` varchar(45) DEFAULT NULL,
  `cognome` varchar(45) DEFAULT NULL,
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
-- Table structure for table `sconto`
--

DROP TABLE IF EXISTS `sconto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sconto` (
  `id_sconto` int(11) NOT NULL AUTO_INCREMENT,
  `percentuale` float DEFAULT NULL,
  PRIMARY KEY (`id_sconto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sconto`
--

LOCK TABLES `sconto` WRITE;
/*!40000 ALTER TABLE `sconto` DISABLE KEYS */;
/*!40000 ALTER TABLE `sconto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stato_prenotazione`
--

DROP TABLE IF EXISTS `stato_prenotazione`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stato_prenotazione` (
  `id_stato_prenotazione` int(11) NOT NULL AUTO_INCREMENT,
  `stato` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id_stato_prenotazione`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stato_prenotazione`
--

LOCK TABLES `stato_prenotazione` WRITE;
/*!40000 ALTER TABLE `stato_prenotazione` DISABLE KEYS */;
/*!40000 ALTER TABLE `stato_prenotazione` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-09-16 19:07:59
