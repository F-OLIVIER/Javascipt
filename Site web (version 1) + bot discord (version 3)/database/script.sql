-- Initialisation de la db :
-- 1: sqlite3 ./database/databaseGvG.db
-- 2: .databases
-- 3: .quit
-- run query

-- Information de fonctionnement pour le bot discord
CREATE TABLE GestionBot( 
    ID INTEGER PRIMARY KEY,
    Allumage INTEGER, -- 0 on, 1 off
    IDMessageGvG VARCHAR(50)
);
INSERT INTO GestionBot(Allumage,IDMessageGvG) VALUES(0,1206146217592225792);


-- Fiche personnage IG
CREATE TABLE Users( 
    ID INTEGER PRIMARY KEY,
    uuid INTEGER , 
    ConnectedSite INTEGER DEFAULT 0,

    DiscordID VARCHAR(50) NOT NULL,
    DiscordName VARCHAR(50) NOT NULL,
    DiscordBaseName VARCHAR(50) NOT NULL,
    DiscordRole VARCHAR(50),
    DiscordPhoto TEXT,

    GameCharacter_ID INTEGER DEFAULT 0,
    Lvl INTEGER,
    Influence INTEGER DEFAULT 700,

    EtatInscription INTEGER,
    NbEmojiInscription INTEGER,
    TrustIndicator INTEGER,
    MNDR INTEGER,
    NbGvGParticiped INTEGER, -- anciennement Assiduity
    NbTotalGvG INTEGER,
    DateLastGvGParticiped TEXT,
    
    FOREIGN KEY(GameCharacter_ID) REFERENCES ListGameCharacter(ID)
);

-- Liste des GVG (pour les Stats)
CREATE TABLE GvG( 
    ID INTEGER PRIMARY KEY,
    User_ID INTEGER,
    -- Saison_ID INTEGER,
    DateGvG DATE, 
    Registered INTEGER, -- 0 non, 1 oui
    Participed INTEGER, -- présence discord : 0 non, 1 oui

    FOREIGN KEY(User_ID) REFERENCES Users(ID)
    -- FOREIGN KEY(Saison_ID) REFERENCES Saison(ID)
);

-- Information de saison
CREATE TABLE Saison( 
    ID INTEGER PRIMARY KEY,
    NameSaison VARCHAR(50),
    DateDebut DATE,
    DateFin DATE,
    NbGvG INTEGER
);

-- liste des classes IG
CREATE TABLE ListGameCharacter( 
    ID INTEGER PRIMARY KEY,
    CodeFR VARCHAR(5),
    CodeEN VARCHAR(5),
    ClasseFR VARCHAR(50),
    ClasseEN VARCHAR(50)
);
-- Insertion automatique de la liste des classes lors de la création de la databases
INSERT INTO ListGameCharacter(CodeFR,CodeEN,ClasseFR,ClasseEN) VALUES('arc','sar','Arc court','Short bow');
INSERT INTO ListGameCharacter(CodeFR,CodeEN,ClasseFR,ClasseEN) VALUES('acl','lar','Arc long','Long bow');
INSERT INTO ListGameCharacter(CodeFR,CodeEN,ClasseFR,ClasseEN) VALUES('lju','tbl','Lames jumelles','Twin blades (dual blade)');
INSERT INTO ListGameCharacter(CodeFR,CodeEN,ClasseFR,ClasseEN) VALUES('ecb','sss','Épée courte & bouclier','Short sword & shield');
INSERT INTO ListGameCharacter(CodeFR,CodeEN,ClasseFR,ClasseEN) VALUES('elb','lss','Épée longue & bouclier','Long sword & shield');
INSERT INTO ListGameCharacter(CodeFR,CodeEN,ClasseFR,ClasseEN) VALUES('gua','gua','Guandao','Guandao');
INSERT INTO ListGameCharacter(CodeFR,CodeEN,ClasseFR,ClasseEN) VALUES('hda','wax','Hache d''arme','Weapon ax (poleaxe)');
INSERT INTO ListGameCharacter(CodeFR,CodeEN,ClasseFR,ClasseEN) VALUES('lan','spe','Lance','Spear');
INSERT INTO ListGameCharacter(CodeFR,CodeEN,ClasseFR,ClasseEN) VALUES('mou','mus','Mousquet','Musket');
INSERT INTO ListGameCharacter(CodeFR,CodeEN,ClasseFR,ClasseEN) VALUES('nod','nod','Nodashi','Nodashi');
INSERT INTO ListGameCharacter(CodeFR,CodeEN,ClasseFR,ClasseEN) VALUES('mas','mas','Masse de guerre','Mass of war');
INSERT INTO ListGameCharacter(CodeFR,CodeEN,ClasseFR,ClasseEN) VALUES('dac','chb','Dague à chaine (cimeterre)','Chain dart (scimitar)');
INSERT INTO ListGameCharacter(CodeFR,CodeEN,ClasseFR,ClasseEN) VALUES('piq','pik','Pique','Pike');


CREATE TABLE ListUnit(
    ID INTEGER PRIMARY KEY,
    Unit VARCHAR(50),
    InfuenceMax INTEGER,
    LvlMax INTEGER,
    TypeUnit VARCHAR(15), -- Infanterie, Distant, Cavalerie
    ForceUnit VARCHAR(5), -- T3, T4, T5
    Img TEXT DEFAULT ""
);
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Hallebardiers',175,18,'Infanterie','T3');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Piquiers préfectoraux',185,18,'Infanterie','T3');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Gardes préfectoraux',180,18,'Infanterie','T3');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Lanciers têtes de fer',155,18,'Infanterie','T3');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Fils de Fenrir',175,18,'Infanterie','T3');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Dimachères',175,18,'Infanterie','T3');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Wuxin',170,18,'Infanterie','T3');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Piquiers impériaux',240,24,'Infanterie','T4');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Fortebraccio',235,24,'Infanterie','T4');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Prévôts hallebardiers',230,24,'Infanterie','T4');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Garde du palais',235,24,'Infanterie','T4');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Azaps',240,24,'Infanterie','T4');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Tseregs',235,24,'Infanterie','T4');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Pillard fendeur',240,24,'Infanterie','T4');	
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Housecarls',240,24,'Infanterie','T4');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Claymores',245,24,'Infanterie','T4');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Garde varégues',315,24,'Infanterie','T4');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Gonfanonniers',225,24,'Infanterie','T4');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Paladin symmachéen',245,24,'Infanterie','T4');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Berserkers',245,24,'Infanterie','T4');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Lanciers impériaux',230,24,'Infanterie','T4');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Fidèles symmachéen',240,24,'Infanterie','T4');	
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Mirmillon',245,24,'Infanterie','T4');	
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Vigile grisonant',240,24,'Infanterie','T4');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Javeliniers impériaux',240,24,'Infanterie','T4');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Prévôts javeliniers',230,24,'Infanterie','T4');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Moines au croissant',250,24,'Infanterie','T4');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Onna-bugeishas',215,24,'Infanterie','T4');	
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Hommes d''armes',215,24,'Infanterie','T4');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Silahdars',320,30,'Infanterie','T5');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Skjalmös',310,30,'Infanterie','T5');	
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Fauchefers',315,30,'Infanterie','T5');	
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Gardes modao',315,30,'Infanterie','T5');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Rétiaires',320,30,'Infanterie','T5');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Samouraï sorochis',290,30,'Infanterie','T5');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Zweihanders',300,30,'Infanterie','T5');

INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Milice zykalienne',175,15,'Distant','T3');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Pyro-archers',180,18,'Distant','T3');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Jannisaires',190,19,'Distant','T3');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Schutzdieners',155,18,'Distant','T3');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Archers gallos',245,24,'Distant','T4');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Archers impériaux',255,24,'Distant','T4');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Arquebusiers du Krieskrat',255,24,'Distant','T4');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Arquebusiers impériaux',255,24,'Distant','T4');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Siphonaros',330,30,'Distant','T5');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Falconetti',330,30,'Distant','T5');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Veneurs',320,30,'Distant','T5');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Arbalétriers pavoiseurs',325,30,'Distant','T5');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Arquebusiers tercios',310,30,'Distant','T5');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Grenadier de Shenji',315,30,'Distant','T5');

INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Chevaucheurs',180,18,'Cavalerie','T3');	
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Cavalier de selem',180,18,'Cavalerie','T3');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Lancier avec Esponton',240,24,'Cavalerie','T4');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Cavaliers lourds préfectoraux',240,24,'Cavalerie','T4');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Lanciers ribauds',240,24,'Cavalerie','T4');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Cavaliers kevthuuls',245,24,'Cavalerie','T4');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Cavalerie sipho',245,24,'Cavalerie','T4');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Chamelier',225,24,'Cavalerie','T4');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Kriegsbruders',220,24,'Cavalerie','T4');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Cataphractaires lanciers',310,30,'Cavalerie','T5');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Hussards ailés',315,30,'Cavalerie','T5');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Eclaireurs de Liao',315,30,'Cavalerie','T5');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Kheshigs',310,30,'Cavalerie','T5');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Templiers',305,30,'Cavalerie','T5');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Chu ko nu montés',305,30,'Cavalerie','T5');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Bannerets',340,30,'Cavalerie','T5');
INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit) VALUES('Cavaliers de Yanyuedao',320,30,'Cavalerie','T5');

-- exemple Unit1 (Hallebardiers) = "18" // -1: n'a pas l'unité sinon le lvl de l'unit
CREATE TABLE Caserne( 
    ID INTEGER PRIMARY KEY,
    User_ID INTEGER not NULL,
    Unit1 INTEGER DEFAULT "",
    Unit2 INTEGER DEFAULT "",
    Unit3 INTEGER DEFAULT "",
    Unit4 INTEGER DEFAULT "",
    Unit5 INTEGER DEFAULT "",
    Unit6 INTEGER DEFAULT "",
    Unit7 INTEGER DEFAULT "",
    Unit8 INTEGER DEFAULT "",
    Unit9 INTEGER DEFAULT "",
    Unit10 INTEGER DEFAULT "",
    Unit11 INTEGER DEFAULT "",
    Unit12 INTEGER DEFAULT "",
    Unit13 INTEGER DEFAULT "",
    Unit14 INTEGER DEFAULT "",
    Unit15 INTEGER DEFAULT "",
    Unit16 INTEGER DEFAULT "",
    Unit17 INTEGER DEFAULT "",
    Unit18 INTEGER DEFAULT "",
    Unit19 INTEGER DEFAULT "",
    Unit20 INTEGER DEFAULT "",
    Unit21 INTEGER DEFAULT "",
    Unit22 INTEGER DEFAULT "",
    Unit23 INTEGER DEFAULT "",
    Unit24 INTEGER DEFAULT "",
    Unit25 INTEGER DEFAULT "",
    Unit26 INTEGER DEFAULT "",
    Unit27 INTEGER DEFAULT "",
    Unit28 INTEGER DEFAULT "",
    Unit29 INTEGER DEFAULT "",
    Unit30 INTEGER DEFAULT "",
    Unit31 INTEGER DEFAULT "",
    Unit32 INTEGER DEFAULT "",
    Unit33 INTEGER DEFAULT "",
    Unit34 INTEGER DEFAULT "",
    Unit35 INTEGER DEFAULT "",
    Unit36 INTEGER DEFAULT "",
    Unit37 INTEGER DEFAULT "",
    Unit38 INTEGER DEFAULT "",
    Unit39 INTEGER DEFAULT "",
    Unit40 INTEGER DEFAULT "",
    Unit41 INTEGER DEFAULT "",
    Unit42 INTEGER DEFAULT "",
    Unit43 INTEGER DEFAULT "",
    Unit44 INTEGER DEFAULT "",
    Unit45 INTEGER DEFAULT "",
    Unit46 INTEGER DEFAULT "",
    Unit47 INTEGER DEFAULT "",
    Unit48 INTEGER DEFAULT "",
    Unit49 INTEGER DEFAULT "",
    Unit50 INTEGER DEFAULT "",
    Unit51 INTEGER DEFAULT "",
    Unit52 INTEGER DEFAULT "",
    Unit53 INTEGER DEFAULT "",
    Unit54 INTEGER DEFAULT "",
    Unit55 INTEGER DEFAULT "",
    Unit56 INTEGER DEFAULT "",
    Unit57 INTEGER DEFAULT "",
    Unit58 INTEGER DEFAULT "",
    Unit59 INTEGER DEFAULT "",
    Unit60 INTEGER DEFAULT "",
    Unit61 INTEGER DEFAULT "",
    Unit62 INTEGER DEFAULT "",
    Unit63 INTEGER DEFAULT "",
    Unit64 INTEGER DEFAULT "",
    Unit65 INTEGER DEFAULT "",
    Unit66 INTEGER DEFAULT "",
    Unit67 INTEGER DEFAULT "",

    FOREIGN KEY(User_ID) REFERENCES Users(ID)
);

CREATE TABLE GroupGvG( 
    ID INTEGER PRIMARY KEY,
    User_ID INTEGER,

    GroupNumber INTEGER,
    Unit1 TEXT,
    Unit2 TEXT,
    Unit3 TEXT,
    Unit4 TEXT,

    FOREIGN KEY(User_ID) REFERENCES Users(ID)
);

