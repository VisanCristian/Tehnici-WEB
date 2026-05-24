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
    'camasa',
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
    'Tricou Freddy Fazbear',
    'Tricou unisex cu imprimeu Freddy Fazbear pe fata si logo-ul restaurantului pe spate. Material: 80% bumbac, 20% poliester.',
    '/resurse/imagini/Produse/TricouFreddyFazbear.webp',
    'vestimentar',
    'tricou',
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
    '/resurse/imagini/Produse/TricouBonnie.webp',
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
    'Tricou Toy Chica',
    'Tricou cu dungi si imprimeu Toy Chica. Foarte confortabil.',
    '/resurse/imagini/Produse/TricouChica.webp',
    'vestimentar',
    'tricou',
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
    'Tricou Mangle Oversize',
    'Tricou oversized inspirat de Mangle, cu design caracteristic si detalii printate. Buzunar la piept.',
    '/resurse/imagini/Produse/TricouMangle.webp',
    'vestimentar',
    'tricou',
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
    '/resurse/imagini/Produse/Figurina_Springtrap_Deluxe.webp',
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
    '/resurse/imagini/Produse/Figurina_Nightmare_Freddy.webp',
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
    '/resurse/imagini/Produse/Figurina_Circus_Baby.webp',
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
    '/resurse/imagini/Produse/Costum_Freddy_Fazbear_Adult.webp',
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
    '/resurse/imagini/Produse/Costum_Circus_Baby_Copii.webp',
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
    '/resurse/imagini/Produse/Sticker_Pack_Pizzeria_Simulator.webp',
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
    '/resurse/imagini/Produse/Sticker_Holografic_Foxy.webp',
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
    '/resurse/imagini/Produse/Breloc_The_Puppet_Glow-in-Dark.webp',
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
    '/resurse/imagini/Produse/Set_6_Brelocuri_Personaje_Clasice.webp',
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
    'Figurina Foxy Classic',
    'Figurina Foxy in ipostaza de atac. Realizata din rasina de inalta calitate.',
    '/resurse/imagini/Produse/Figurina_Foxy_Classic.webp',
    'figurine',
    NULL,
    'curier',
    189.99,
    ARRAY[18.0],
    0,
    NULL,
    'FNAF1',
    ARRAY['Foxy'],
    TRUE,
    FALSE
);

INSERT INTO produse (nume, descriere, imagine_cale, categorie, subcategorie, expediere, pret, dimensiuni_cm, reducere_pct, disponibil_online_pana, joc_sursa, personaje_asociate, in_magazin_fizic, este_set) VALUES (
    'Figurina Golden Freddy Editie Speciala',
    'Figurina Golden Freddy in editie numerotata (1/500), cu certificat de autenticitate si vitrina din plexiglas.',
    '/resurse/imagini/Produse/Figurina_Golden_Freddy_Editie_Speciala.webp',
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
    'Sticker Toy Bonnie',
    'Sticker holografic cu Toy Bonnie si chitara sa. Rezistent la apa si zgarieturi.',
    '/resurse/imagini/Produse/Sticker_Toy_Bonnie.webp',
    'accesorii',
    'sticker',
    'posta',
    15.99,
    ARRAY[10.0, 10.0],
    5,
    NULL,
    'FNAF2',
    ARRAY['Toy Bonnie'],
    FALSE,
    FALSE
);


INSERT INTO produse (nume, descriere, imagine_cale, categorie, subcategorie, expediere, pret, dimensiuni_cm, reducere_pct, disponibil_online_pana, joc_sursa, personaje_asociate, in_magazin_fizic, este_set) VALUES (
    'Sticker Pack Jucarii Mecanice',
    'Set 35 de stickere cu Toy Freddy, Toy Bonnie, Toy Chica, Mangle, BB si The Puppet. Format mare (8-12 cm fiecare).',
    '/resurse/imagini/Produse/Sticker_Pack_Jucarii_Mecanice.webp',
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