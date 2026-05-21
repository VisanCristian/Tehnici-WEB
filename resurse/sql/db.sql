DROP TABLE IF EXISTS produse;

DROP TYPE IF EXISTS categorie_tip;
DROP TYPE IF EXISTS subcategorie_tip;
DROP TYPE IF EXISTS expediere_tip;
DROP TYPE IF EXISTS joc_tip;


CREATE TYPE categorie_tip AS ENUM (
    'vestimentar',
    'accesorii',
    'costume',
    'figurine'
);

CREATE TYPE subcategorie_tip AS ENUM (
    'hanorac',
    'tricou',
    'pantalon',
    'sticker',
    'keychain'
);

CREATE TYPE expediere_tip AS ENUM (
    'curier',
    'posta',
    'centru_distributie'
);

CREATE TYPE joc_tip AS ENUM (
    'FNAF1',
    'FNAF2',
    'FNAF3',
    'FNAF4',
    'SL',
    'FNAF6'
);


CREATE TABLE produse (
    id                     SERIAL           PRIMARY KEY,
    nume                   VARCHAR(255)     NOT NULL,
    descriere              TEXT,
    imagine_cale           VARCHAR(500),
    categorie              categorie_tip    NOT NULL,
    subcategorie           subcategorie_tip,
    expediere              expediere_tip,
    pret                   NUMERIC(10, 2)   NOT NULL CHECK (pret >= 0),
    dimensiuni_cm          NUMERIC(6, 1)[],
    reducere_pct           INTEGER          NOT NULL DEFAULT 0 CHECK (reducere_pct BETWEEN 0 AND 100),
    disponibil_online_pana DATE,
    joc_sursa              joc_tip,
    personaje_asociate     VARCHAR(100)[],
    in_magazin_fizic       BOOLEAN          NOT NULL,
    este_set               BOOLEAN          NOT NULL
);

INSERT INTO produse (nume, descriere, imagine_cale, categorie, subcategorie, expediere, pret, dimensiuni_cm, reducere_pct, disponibil_online_pana, joc_sursa, personaje_asociate, in_magazin_fizic, este_set) VALUES (
    'Hanorac Freddy Fazbear',
    'Hanorac unisex cu imprimeu Freddy Fazbear pe fata si logo-ul restaurantului pe spate. Material: 80% bumbac, 20% poliester.',
    '/img/vestimentar/hanorac_freddy.jpg',
    'vestimentar',
    'hanorac',
    'curier',
    149.99,
    ARRAY[62.0, 76.0],
    0,
    '2025-12-31',
    'FNAF1',
    ARRAY['Freddy Fazbear'],
    TRUE,
    FALSE
);

INSERT INTO produse (nume, descriere, imagine_cale, categorie, subcategorie, expediere, pret, dimensiuni_cm, reducere_pct, disponibil_online_pana, joc_sursa, personaje_asociate, in_magazin_fizic, este_set) VALUES (
    'Tricou Bonnie Guitar',
    'Tricou slim-fit cu Bonnie cantand la chitara, imprimat prin sublimatie. Disponibil in marimi XS-3XL.',
    '/img/vestimentar/tricou_bonnie.jpg',
    'vestimentar',
    'tricou',
    'curier',
    59.99,
    ARRAY[53.0, 70.0],
    10,
    '2025-09-15',
    'FNAF1',
    ARRAY['Bonnie'],
    FALSE,
    FALSE
);

INSERT INTO produse (nume, descriere, imagine_cale, categorie, subcategorie, expediere, pret, dimensiuni_cm, reducere_pct, disponibil_online_pana, joc_sursa, personaje_asociate, in_magazin_fizic, este_set) VALUES (
    'Pantalon de trening Toy Chica',
    'Pantalon de trening cu dungi galbene si imprimeu Toy Chica pe glezna. Elastic la talie.',
    '/img/vestimentar/pantalon_toy_chica.jpg',
    'vestimentar',
    'pantalon',
    'centru_distributie',
    89.99,
    ARRAY[40.0, 100.0],
    5,
    NULL,
    'FNAF2',
    ARRAY['Toy Chica'],
    TRUE,
    FALSE
);

INSERT INTO produse (nume, descriere, imagine_cale, categorie, subcategorie, expediere, pret, dimensiuni_cm, reducere_pct, disponibil_online_pana, joc_sursa, personaje_asociate, in_magazin_fizic, este_set) VALUES (
    'Hanorac Mangle Oversize',
    'Hanorac oversized inspirat de Mangle, cu designul caracteristic alb-rosu si detalii printate. Buzunare cu fermoar.',
    '/img/vestimentar/hanorac_mangle.jpg',
    'vestimentar',
    'hanorac',
    'posta',
    179.99,
    ARRAY[66.0, 79.0],
    25,
    '2025-07-01',
    'FNAF2',
    ARRAY['Mangle'],
    FALSE,
    FALSE
);

INSERT INTO produse (nume, descriere, imagine_cale, categorie, subcategorie, expediere, pret, dimensiuni_cm, reducere_pct, disponibil_online_pana, joc_sursa, personaje_asociate, in_magazin_fizic, este_set) VALUES (
    'Figurina Springtrap Deluxe',
    'Figurina detaliata Springtrap din PVC de inalta calitate, pictata manual. Include baza decorativa.',
    '/img/figurine/figurina_springtrap.jpg',
    'figurine',
    NULL,
    'curier',
    219.99,
    ARRAY[22.5],
    0,
    NULL,
    'FNAF3',
    ARRAY['Springtrap', 'William Afton'],
    TRUE,
    FALSE
);

INSERT INTO produse (nume, descriere, imagine_cale, categorie, subcategorie, expediere, pret, dimensiuni_cm, reducere_pct, disponibil_online_pana, joc_sursa, personaje_asociate, in_magazin_fizic, este_set) VALUES (
    'Figurina Nightmare Freddy',
    'Figurina colectie Nightmare Freddy cu dinti articulati si mini-Freddle-uri atasate. Editie limitata.',
    '/img/figurine/figurina_nightmare_freddy.jpg',
    'figurine',
    NULL,
    'curier',
    299.99,
    ARRAY[30.0],
    15,
    '2025-10-31',
    'FNAF4',
    ARRAY['Nightmare Freddy', 'Freddles'],
    TRUE,
    FALSE
);

INSERT INTO produse (nume, descriere, imagine_cale, categorie, subcategorie, expediere, pret, dimensiuni_cm, reducere_pct, disponibil_online_pana, joc_sursa, personaje_asociate, in_magazin_fizic, este_set) VALUES (
    'Figurina Circus Baby',
    'Figurina premium Circus Baby cu rochie detasabila si mecanism de lumini LED in ochi. Baterii incluse.',
    '/img/figurine/figurina_circus_baby.jpg',
    'figurine',
    NULL,
    NULL,
    349.99,
    ARRAY[35.0],
    0,
    NULL,
    'SL',
    ARRAY['Circus Baby', 'Ennard'],
    TRUE,
    FALSE
);

INSERT INTO produse (nume, descriere, imagine_cale, categorie, subcategorie, expediere, pret, dimensiuni_cm, reducere_pct, disponibil_online_pana, joc_sursa, personaje_asociate, in_magazin_fizic, este_set) VALUES (
    'Costum Freddy Fazbear Adult',
    'Costum integral Freddy Fazbear pentru adulti. Include salopeta, manusi, cravata si masca cu blana artificiala.',
    '/img/costume/costum_freddy_adult.jpg',
    'costume',
    NULL,
    'centru_distributie',
    599.99,
    NULL,
    0,
    NULL,
    'FNAF1',
    ARRAY['Freddy Fazbear'],
    TRUE,
    FALSE
);

INSERT INTO produse (nume, descriere, imagine_cale, categorie, subcategorie, expediere, pret, dimensiuni_cm, reducere_pct, disponibil_online_pana, joc_sursa, personaje_asociate, in_magazin_fizic, este_set) VALUES (
    'Costum Circus Baby Copii',
    'Costum Circus Baby pentru copii 5-10 ani. Include rochita rosie cu buline, coronita si pieptanas decorativ.',
    '/img/costume/costum_baby_copii.jpg',
    'costume',
    NULL,
    'curier',
    249.99,
    NULL,
    20,
    '2025-11-01',
    'SL',
    ARRAY['Circus Baby'],
    FALSE,
    FALSE
);

INSERT INTO produse (nume, descriere, imagine_cale, categorie, subcategorie, expediere, pret, dimensiuni_cm, reducere_pct, disponibil_online_pana, joc_sursa, personaje_asociate, in_magazin_fizic, este_set) VALUES (
    'Sticker Pack Pizzeria Simulator',
    'Set 20 de stickere din vinil rezistent la apa cu personajele din Pizzeria Simulator. Potrivite pentru laptop, caiet sau sticla.',
    '/img/accesorii/stickere_fnaf6.jpg',
    'accesorii',
    'sticker',
    'posta',
    24.99,
    NULL,
    0,
    NULL,
    'FNAF6',
    ARRAY['Lefty', 'Scrap Baby', 'Molten Freddy', 'Scraptrap'],
    FALSE,
    TRUE
);

INSERT INTO produse (nume, descriere, imagine_cale, categorie, subcategorie, expediere, pret, dimensiuni_cm, reducere_pct, disponibil_online_pana, joc_sursa, personaje_asociate, in_magazin_fizic, este_set) VALUES (
    'Sticker Holografic Foxy',
    'Sticker holografic mare (15x15 cm) cu Foxy in ipostaza sa clasica de a iesi din Pirate Cove.',
    '/img/accesorii/sticker_holo_foxy.jpg',
    'accesorii',
    'sticker',
    'posta',
    12.99,
    ARRAY[15.0],
    30,
    '2025-06-30',
    'FNAF1',
    ARRAY['Foxy'],
    FALSE,
    FALSE
);

INSERT INTO produse (nume, descriere, imagine_cale, categorie, subcategorie, expediere, pret, dimensiuni_cm, reducere_pct, disponibil_online_pana, joc_sursa, personaje_asociate, in_magazin_fizic, este_set) VALUES (
    'Breloc The Puppet Glow-in-Dark',
    'Breloc din cauciuc moale The Puppet care lumineaza in intuneric. Dimensiune 7 cm, inel metalic rezistent.',
    '/img/accesorii/breloc_puppet.jpg',
    'accesorii',
    'keychain',
    'curier',
    34.99,
    ARRAY[7.0],
    0,
    NULL,
    'FNAF2',
    ARRAY['The Puppet', 'Marionette'],
    TRUE,
    FALSE
);

INSERT INTO produse (nume, descriere, imagine_cale, categorie, subcategorie, expediere, pret, dimensiuni_cm, reducere_pct, disponibil_online_pana, joc_sursa, personaje_asociate, in_magazin_fizic, este_set) VALUES (
    'Set 6 Brelocuri Personaje Clasice',
    'Set cu 6 brelocuri din metal emailat: Freddy, Bonnie, Chica, Foxy, Goldie si Marionette. Cutie cadou inclusa.',
    '/img/accesorii/set_brelocuri_clasice.jpg',
    'accesorii',
    'keychain',
    'centru_distributie',
    89.99,
    ARRAY[5.5],
    0,
    NULL,
    NULL,
    ARRAY['Freddy Fazbear', 'Bonnie', 'Chica', 'Foxy', 'Golden Freddy', 'The Puppet'],
    TRUE,
    TRUE
);

INSERT INTO produse (nume, descriere, imagine_cale, categorie, subcategorie, expediere, pret, dimensiuni_cm, reducere_pct, disponibil_online_pana, joc_sursa, personaje_asociate, in_magazin_fizic, este_set) VALUES (
    'Tricou Ennard All-Over Print',
    'Tricou cu imprimare pe toata suprafata infatisand circuitele lui Ennard. Tehnologie DTG, culori rezistente la spalare.',
    '/img/vestimentar/tricou_ennard.jpg',
    'vestimentar',
    'tricou',
    'curier',
    69.99,
    ARRAY[56.0, 72.0],
    40,
    '2025-05-31',
    'SL',
    ARRAY['Ennard', 'Circus Baby', 'Ballora', 'Funtime Freddy', 'Funtime Foxy'],
    FALSE,
    FALSE
);

INSERT INTO produse (nume, descriere, imagine_cale, categorie, subcategorie, expediere, pret, dimensiuni_cm, reducere_pct, disponibil_online_pana, joc_sursa, personaje_asociate, in_magazin_fizic, este_set) VALUES (
    'Figurina Golden Freddy Editie Speciala',
    'Figurina Golden Freddy in editie numerotata (1/500), cu certificat de autenticitate si vitrina din plexiglas.',
    '/img/figurine/figurina_golden_freddy_special.jpg',
    'figurine',
    NULL,
    NULL,
    499.99,
    ARRAY[40.0],
    0,
    '2026-01-15',
    'FNAF1',
    ARRAY['Golden Freddy', 'Fredbear'],
    TRUE,
    FALSE
);

INSERT INTO produse (nume, descriere, imagine_cale, categorie, subcategorie, expediere, pret, dimensiuni_cm, reducere_pct, disponibil_online_pana, joc_sursa, personaje_asociate, in_magazin_fizic, este_set) VALUES (
    'Hanorac Ballora Dance',
    'Hanorac cu gluga si imprimeu Ballora dansand, cu detalii fluorescente pe maneci vizibile la lumina UV.',
    '/img/vestimentar/hanorac_ballora.jpg',
    'vestimentar',
    'hanorac',
    'posta',
    159.99,
    ARRAY[59.0, 74.0],
    0,
    NULL,
    'SL',
    ARRAY['Ballora'],
    TRUE,
    FALSE
);

INSERT INTO produse (nume, descriere, imagine_cale, categorie, subcategorie, expediere, pret, dimensiuni_cm, reducere_pct, disponibil_online_pana, joc_sursa, personaje_asociate, in_magazin_fizic, este_set) VALUES (
    'Pantalon Cargo Nightmare Chica',
    'Pantalon cargo negru cu patch-uri brodate Nightmare Chica pe buzunare. Rezistent, pentru activitati outdoor.',
    '/img/vestimentar/pantalon_nightmare_chica.jpg',
    'vestimentar',
    'pantalon',
    'curier',
    109.99,
    ARRAY[44.0, 106.0],
    10,
    NULL,
    'FNAF4',
    ARRAY['Nightmare Chica', 'Cupcake'],
    FALSE,
    FALSE
);

INSERT INTO produse (nume, descriere, imagine_cale, categorie, subcategorie, expediere, pret, dimensiuni_cm, reducere_pct, disponibil_online_pana, joc_sursa, personaje_asociate, in_magazin_fizic, este_set) VALUES (
    'Sticker Pack Jucarii Mecanice',
    'Set 35 de stickere cu Toy Freddy, Toy Bonnie, Toy Chica, Mangle, BB si The Puppet. Format mare (8-12 cm fiecare).',
    '/img/accesorii/stickere_fnaf2.jpg',
    'accesorii',
    'sticker',
    'posta',
    39.99,
    NULL,
    0,
    '2025-08-31',
    'FNAF2',
    ARRAY['Toy Freddy', 'Toy Bonnie', 'Toy Chica', 'Mangle', 'BB', 'The Puppet'],
    FALSE,
    TRUE
);