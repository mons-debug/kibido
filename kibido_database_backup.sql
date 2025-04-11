--
-- PostgreSQL database dump
--

-- Dumped from database version 14.17 (Homebrew)
-- Dumped by pg_dump version 15.10 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: mounirbennassar
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO mounirbennassar;

--
-- Name: OrderStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."OrderStatus" AS ENUM (
    'PENDING',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED'
);


ALTER TYPE public."OrderStatus" OWNER TO postgres;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'USER',
    'ADMIN'
);


ALTER TYPE public."Role" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Account; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Account" (
    id text NOT NULL,
    "userId" text NOT NULL,
    type text NOT NULL,
    provider text NOT NULL,
    "providerAccountId" text NOT NULL,
    refresh_token text,
    access_token text,
    expires_at integer,
    token_type text,
    scope text,
    id_token text,
    session_state text
);


ALTER TABLE public."Account" OWNER TO postgres;

--
-- Name: Category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Category" (
    id text NOT NULL,
    name text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    slug text NOT NULL
);


ALTER TABLE public."Category" OWNER TO postgres;

--
-- Name: Customer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Customer" (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    address text,
    city text,
    state text,
    "zipCode" text,
    country text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Customer" OWNER TO postgres;

--
-- Name: Order; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Order" (
    id text NOT NULL,
    "customerId" text NOT NULL,
    status public."OrderStatus" DEFAULT 'PENDING'::public."OrderStatus" NOT NULL,
    total numeric(10,2) NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Order" OWNER TO postgres;

--
-- Name: OrderItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."OrderItem" (
    id text NOT NULL,
    "orderId" text NOT NULL,
    "productId" text NOT NULL,
    quantity integer NOT NULL,
    price numeric(10,2) NOT NULL
);


ALTER TABLE public."OrderItem" OWNER TO postgres;

--
-- Name: Product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Product" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    images text[],
    stock integer DEFAULT 0 NOT NULL,
    "categoryId" text NOT NULL,
    featured boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    artist text,
    gallery text[],
    slug text NOT NULL
);


ALTER TABLE public."Product" OWNER TO postgres;

--
-- Name: Session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Session" (
    id text NOT NULL,
    "sessionToken" text NOT NULL,
    "userId" text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Session" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    name text,
    email text,
    "emailVerified" timestamp(3) without time zone,
    image text,
    password text,
    role public."Role" DEFAULT 'USER'::public."Role" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: VerificationToken; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."VerificationToken" (
    identifier text NOT NULL,
    token text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."VerificationToken" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Data for Name: Account; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Account" (id, "userId", type, provider, "providerAccountId", refresh_token, access_token, expires_at, token_type, scope, id_token, session_state) FROM stdin;
\.


--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Category" (id, name, "createdAt", "updatedAt", slug) FROM stdin;
cm9d1zqia0000vu2kzhxfey0g	Peinture	2025-04-11 17:20:58.354	2025-04-11 17:20:58.354	peinture
cm9d1zqih0003vu2kxeah53v5	Autre	2025-04-11 17:20:58.361	2025-04-11 17:20:58.361	autre
\.


--
-- Data for Name: Customer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Customer" (id, name, email, phone, address, city, state, "zipCode", country, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Order; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Order" (id, "customerId", status, total, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: OrderItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."OrderItem" (id, "orderId", "productId", quantity, price) FROM stdin;
\.


--
-- Data for Name: Product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Product" (id, name, description, price, images, stock, "categoryId", featured, "createdAt", "updatedAt", artist, gallery, slug) FROM stdin;
cm9d1zqif0002vu2kwe5uh9w1	Étalon Majestueux	Ce tableau captivant célèbre la beauté et la noblesse d'un étalon blanc. Le mouvement fluide de sa crinière et son regard perçant évoquent à la fois la liberté et la puissance. Les tons doux et harmonieux de l'œuvre créent une atmosphère apaisante et élégante, parfaite pour enrichir votre espace avec une touche de grâce et de majesté.	9950.00	{/images/products/7c80cc26-3197-4d71-9c1d-bcafadae137d.png}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:04	2025-04-07 21:37:04	Axel	{}	talon-majestueux
cm9d1zqii0005vu2kjxvq5zbh	language des sage	Œuvre artistique originale.	2000.00	{/images/products/3e70379f-b15c-4b25-bcbf-ad533e0a27dd.jpeg}	1	cm9d1zqih0003vu2kxeah53v5	f	2025-04-07 21:37:04	2025-04-07 21:37:04	Axel	{}	language-des-sage
cm9d1zqik0007vu2ko3olmjzx	Abstract Colorful Mosaic	This vibrant artwork features a stunning mosaic of bold colors and abstract shapes. The intricate interplay of lines and patterns creates a dynamic and energetic composition, perfect for adding a modern and lively touch to any space.	2500.00	{/images/products/6954e387-ca32-4557-91ab-f217eded5668.jpeg}	1	cm9d1zqih0003vu2kxeah53v5	f	2025-04-07 21:37:04	2025-04-07 21:37:04	Axel	{}	abstract-colorful-mosaic
cm9d1zqim0009vu2k7tznxb8f	Cubist Face with Bold Colors	This cubist-inspired painting captures the essence of human emotion through fragmented geometric shapes and vivid hues. The expressive face emerges from abstract forms, inviting the viewer to explore the complexity of identity and perception.	2500.00	{/images/products/f22be33c-ae58-4b29-910d-6bd1bf3a2015.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:04	2025-04-07 21:37:04	Axel	{}	cubist-face-with-bold-colors
cm9d1zqin000bvu2kgsiokj80	Yellow Symbolic Grid	A mesmerizing grid of abstract symbols stands out against a bright yellow background. This minimalist yet symbolic piece reflects a narrative of mystery and cultural depth, offering a striking focal point for contemporary interiors.	2500.00	{/images/products/9bbc07d7-885f-41fb-9cb8-bb130e19e464.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:04	2025-04-07 21:37:04	Axel	{}	yellow-symbolic-grid
cm9d1zqip000dvu2kjovr7jwa	Tableau acrylique de l’artiste Axel	Œuvre artistique originale.	1000.00	{/images/products/8b62b2ff-eeeb-4e17-9c9b-6c25d0ad9918.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:04	2025-04-07 21:37:04	Axel	{}	tableau-acrylique-de-l-artiste-axel
cm9d1zqiq000fvu2k7qtp4knl	Femme amazone	cette image représente la femme guerrière de l'époque de l'exploitation coloniale.ces femme était des femmes guerrière de l'empereur soundiata keita.son regard ici indique sa détermination a l'affrontement dû colon afin de protéger son territoire.les motifs sur son visage renvoie ici a un attachement a la nature.	5000.00	{/images/products/a6bd882a-437c-4f79-8461-478a59b6c3e3.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:04	2025-04-07 21:37:04	Axel	{}	femme-amazone
cm9d1zqis000hvu2kw2nr23wi	lion de côte	Œuvre artistique originale.	4500.00	{/images/products/534b6d9c-8e9e-4c91-93bf-9548f55af69f.jpeg}	1	cm9d1zqih0003vu2kxeah53v5	f	2025-04-07 21:37:04	2025-04-07 21:37:04	Axel	{}	lion-de-c-te
cm9d1zqit000jvu2kl1nhudtk	Visage Surréaliste Abstrait	Ce portrait surréaliste mélange fluidité et couleurs vibrantes pour représenter un visage à la fois captivant et mystérieux. L’interaction des courbes et des nuances crée une sensation d’introspection et d’émerveillement. Cette œuvre unique ajoute une touche d’originalité et de modernité à n’importe quel espace.	1200.00	{/images/products/a1cda2b1-2c54-43ea-867c-edac9377a1b6.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:04	2025-04-07 21:37:04	Axel	{}	visage-surr-aliste-abstrait
cm9d1zqiu000lvu2k4u2breof	Scène Abstraite Dynamique en Vert et Orange	Ce tableau abstrait mêle des formes dynamiques à des teintes naturelles de vert et des oranges vibrants. Les lignes fluides créent une sensation de mouvement et d'énergie, apportant vie et éclat à l'espace. Idéal pour ajouter une touche artistique moderne et énergique à votre intérieur.	3500.00	{/images/products/1dfbcfd0-65cc-47bb-bd24-b3f6b3b1a0b8.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:04	2025-04-07 21:37:04	Axel	{}	sc-ne-abstraite-dynamique-en-vert-et-orange
cm9d1zqiw000nvu2kol9jb21z	Composition Florale Abstraite	Ce tableau élégant capture la beauté de la nature à travers une représentation abstraite de fleurs vibrantes surgissant d'une base organique et terreuse. La fusion des tons doux et chauds avec des rouges et jaunes éclatants crée un équilibre harmonieux qui évoque la croissance, la vie et la sérénité. Une pièce intemporelle pour sublimer n'importe quel espace intérieur.	12000.00	{/images/products/5ed6e2f2-e043-4a99-9cb1-0792b15a5855.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:04	2025-04-07 21:37:04	Axel	{}	composition-florale-abstraite
cm9d1zqix000pvu2ki66e0kv6	Danse Tribale Abstraite	Œuvre artistique originale.	5500.00	{/images/products/ace98dbe-20f6-4119-b706-d63472d5dc91.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:04	2025-04-07 21:37:04	Axel	{}	danse-tribale-abstraite
cm9d1zqiz000rvu2k2g0tafxy	Fleur de Visages	Œuvre artistique originale.	23000.00	{/images/products/bbfcab5e-7f3c-4618-8d91-357a38b133e5.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:04	2025-04-07 21:37:04	Axel	{}	fleur-de-visages
cm9d1zqj0000tvu2k8m5y2sxh	Esprit en Couleurs	Œuvre artistique originale.	3000.00	{/images/products/0929d55d-5092-4cb3-9118-4fe805401c11.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:04	2025-04-07 21:37:04	Axel	{}	esprit-en-couleurs
cm9d1zqj1000vvu2k4c3v8u9m	Vie Marine Éclatante	Ce tableau captivant plonge le spectateur dans un monde sous-marin vibrant et coloré. Une tortue majestueuse nage au milieu de coraux éclatants et d'une vie marine foisonnante, illuminée par la lumière douce d'un soleil rayonnant. Les détails minutieux et les teintes audacieuses créent une scène dynamique et apaisante, parfaite pour apporter une touche de vitalité et de sérénité à votre espace.	4000.00	{}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:04	2025-04-07 21:37:04	Axel	{}	vie-marine-clatante
cm9d1zqj2000xvu2k3hds0i8n	Élégance Intemporelle	Un hommage à la beauté classique et aux traditions. Ce portrait met en lumière une figure féminine en habits traditionnels, incarnant grâce et force dans une composition sobre et élégante. Une pièce parfaite pour célébrer l’héritage et l’histoire.	7000.00	{/images/products/26eedee7-2b0b-4c31-bff9-2698d95608cf.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:04	2025-04-07 21:37:04	Axel	{}	l-gance-intemporelle
cm9d1zqj4000zvu2k78yz4y0y	Visage Surréaliste Abstrait	Ce tableau fascinant dévoile un visage captivant mêlant des formes fluides et des nuances audacieuses. L'esthétique surréaliste, enrichie par des détails minutieux, incarne un mélange unique de mystère et de réflexion. Chaque courbe et chaque couleur racontent une histoire, invitant à l'exploration et à l'imagination. Une pièce idéale pour ajouter une touche artistique et intrigante à votre espace intérieur.	10000.00	{/images/products/ad3c6392-3df2-4cd4-984e-b4181f48656a.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:04	2025-04-07 21:37:04	Axel	{}	visage-surr-aliste-abstrait-2
cm9d1zqj60011vu2kfwpz9x3o	tigre d'Afrique	"Tigre d’Afrique" capte l’intensité et la majesté de ce félin légendaire. Les couleurs riches et les motifs audacieux rendent hommage à la puissance et à la grâce de cet animal. Ce tableau est parfait pour insuffler une sensation de force et d’élégance à votre intérieur.	7000.00	{/images/products/edd51ee5-31b8-4bd3-8ece-f423488799f6.jpeg}	1	cm9d1zqih0003vu2kxeah53v5	f	2025-04-07 21:37:04	2025-04-07 21:37:04	Axel	{}	tigre-d-afrique
cm9d1zqj80013vu2kygsvqt5o	Métamorphose Surréaliste	Ce tableau intrigant présente une interprétation surréaliste unique où les formes et les contours se fondent dans une composition énigmatique. Les teintes terreuses et les détails subtils invitent à une réflexion profonde sur la transformation et l'ambiguïté. Cette œuvre captivante évoque un sentiment d'émerveillement et d'introspection, ajoutant une touche artistique audacieuse à n'importe quel espace.	10000.00	{/images/products/664d3d63-9f39-437c-9e01-d12e1edb4fa6.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:04	2025-04-07 21:37:04	Axel	{}	m-tamorphose-surr-aliste
cm9d1zqjc0015vu2kqzj3kful	Nature Morte Élégante	Ce tableau de nature morte met en avant un arrangement harmonieux de vases ornés de motifs bleus et de fruits frais disposés avec soin. Les lignes douces du tissu de fond ajoutent une texture subtile, tandis que les détails précis des objets capturent une atmosphère de sérénité et d'équilibre. Cette œuvre classique est idéale pour apporter une touche de raffinement et d'élégance à votre espace intérieur.	27000.00	{/images/products/f06a4b56-e9ff-4d7e-a7b7-bbf8a2e9be6a.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:04	2025-04-07 21:37:04	Axel	{}	nature-morte-l-gante
cm9d1zqjd0017vu2k78cqll5s	Origine de l'être	"Origine de l’Être" explore les mystères de la vie et de la création à travers des formes fluides et organiques. Les couleurs douces et les détails complexes créent une ambiance méditative, idéale pour un espace de contemplation ou de sérénité.	9500.00	{/images/products/6f5e0963-3ee3-43e3-a79b-3f70c89c4d26.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:04	2025-04-07 21:37:04	Axel	{}	origine-de-l-tre
cm9d1zqje0019vu2kucmr1go3	Déesse de la nature	"Déesse de la Nature" incarne l'harmonie entre l'humanité et l'environnement. Les teintes vives et les motifs floraux évoquent la beauté et la richesse de la nature, tandis que le regard intense de la figure féminine rappelle son rôle sacré dans la préservation de la vie. Ce tableau est un hommage vibrant à la puissance et à la sérénité de la nature.	4000.00	{/images/products/927102c5-8f60-4822-b201-4f1c7ffe7796.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:04	2025-04-07 21:37:04	Axel	{}	d-esse-de-la-nature
cm9d1zqjg001bvu2kf8guf80x	lion rasta	"Le Lion Rasta" célèbre la force et la fierté du roi de la savane avec une touche moderne et colorée. Les teintes éclatantes des dreadlocks et les détails saisissants du visage transmettent un message d’unité, de paix et de liberté. Cette œuvre est idéale pour ajouter une énergie audacieuse à tout espace.	4000.00	{/images/products/d35f7c1b-746b-406b-bc6c-ea46f35c7511.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:04	2025-04-07 21:37:04	Axel	{}	lion-rasta
cm9d1zqjh001dvu2kvkt5o2zw	Déesse de la nature	Œuvre artistique originale.	4000.00	{/images/products/1ffa0f12-6c8d-462d-8ece-c936eadb194b.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:04	2025-04-07 21:37:04	Axel	{}	d-esse-de-la-nature-2
cm9d1zqji001fvu2kxcdcyjit	Les douleurs de l'Afrique	"Les Douleurs de l’Afrique" exprime avec profondeur les luttes et les espoirs du continent africain. Les lignes expressives et les couleurs vibrantes racontent une histoire de résilience et de beauté. Ce tableau invite à la réflexion sur l’histoire et la richesse culturelle de l’Afrique.	10000.00	{/images/products/14f4b8c1-abef-4a6e-8110-7c6c3d98d0f2.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:04	2025-04-07 21:37:04	Axel	{}	les-douleurs-de-l-afrique
cm9d1zqjj001hvu2kyvma21jr	Visage de la nature	Œuvre artistique originale.	4000.00	{/images/products/db014edb-413b-4da0-9fb4-c2908f38c968.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:04	2025-04-07 21:37:04	Axel	{}	visage-de-la-nature
cm9d1zqjk001jvu2kh5zprlrs	La porte du paradis	"La Porte du Paradis" dépeint une entrée mystique et invitante vers un monde de rêves. Les couleurs riches et les motifs détaillés apportent une touche d'évasion et d'élégance à tout espace.	4000.00	{/images/products/6470f513-0f2c-430e-bcad-46e7048f9a74.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:04	2025-04-07 21:37:04	Axel	{}	la-porte-du-paradis
cm9d1zqjl001lvu2k3402uz4s	Harmonie Cosmique	"Harmonie Cosmique" invite à une réflexion sur l'univers et notre place dans celui-ci. Les détails subtils et les couleurs apaisantes créent une atmosphère de sérénité et de rêverie, parfaite pour un coin de méditation.	4000.00	{/images/products/07dcb59f-9fd4-4403-b99a-32c0ac32e7bd.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:04	2025-04-07 21:37:04	Axel	{}	harmonie-cosmique
cm9d1zqjm001nvu2keb9qyo6v	Noble Sérénité	Ce portrait équestre capture la majesté et la grâce du cheval dans une lumière douce et contrastée. Parfait pour les amoureux des animaux et les passionnés d’art classique, il dégage une sérénité intemporelle.	4500.00	{/images/products/cdfa3324-5558-4a1c-b1c2-63207c721517.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:04	2025-04-07 21:37:04	Axel	{}	noble-s-r-nit
cm9d1zqjn001pvu2knmn1vl4l	Rêves Abstraits	"Rêves Abstraits" est une œuvre captivante qui combine des formes fluides et des couleurs oniriques pour évoquer un univers métaphorique. Chaque détail raconte une histoire unique, invitant le spectateur à explorer son propre imaginaire.	12000.00	{/images/products/2da0b334-e1b2-4dc1-a7ac-6bf45812ef3f.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:05	2025-04-07 21:37:05	Axel	{}	r-ves-abstraits
cm9d1zqjo001rvu2ktj76s4tn	L'Apogée du Temps	Ce tableau fascinant, "L'Apogée du Temps", explore le thème de l'évolution et de la persistance à travers des motifs complexes et des teintes chaudes. Idéal pour un intérieur moderne ou classique.	23000.00	{/images/products/f1858764-be4c-4b63-8e71-8a498993aa14.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:05	2025-04-07 21:37:05	Axel	{}	l-apog-e-du-temps
cm9d1zqjp001tvu2kymrurpiv	L'Âme du Cheval	"L'Âme du Cheval" révèle la connexion profonde entre l'homme et cet animal noble. Avec des mouvements fluides et une texture délicate, cette œuvre évoque la grâce et la force à travers un regard artistique unique.	12000.00	{/images/products/9c0ef736-7845-471d-a362-2983cfe880c7.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:05	2025-04-07 21:37:05	Axel	{}	l-me-du-cheval
cm9d1zqjq001vvu2kfk64teqa	Rêves Abstraits	"Rêves Abstraits" est une œuvre captivante qui combine des formes fluides et des couleurs oniriques pour évoquer un univers métaphorique. Chaque détail raconte une histoire unique, invitant le spectateur à explorer son propre imaginaire.	9000.00	{/images/products/3aeb4b1d-c39f-403d-8569-a6d3c4d5cfe7.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:05	2025-04-07 21:37:05	Axel	{}	r-ves-abstraits-2
cm9d1zqjr001xvu2kjp6b6hlm	L'Éveil des Couleurs	"L'Éveil des Couleurs" capture la vitalité et l'éclat de la vie à travers une explosion de teintes vibrantes. Ce tableau moderne et expressif est idéal pour illuminer votre in	23000.00	{/images/products/9b3b86d5-1ef5-4895-95e7-7364a8dd4380.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:05	2025-04-07 21:37:05	Axel	{}	l-veil-des-couleurs
cm9d1zqjs001zvu2kzskz979f	Regard Envoûtant	"Regard Envoûtant" capte la profondeur de l'âme humaine à travers des yeux saisissants entourés de teintes de bleu intense. Cette œuvre dégage une énergie mystérieuse et apaisante, idéale pour créer une atmosphère de sérénité et de contemplation dans votre espace.	23000.00	{/images/products/e0e6d288-f483-4786-9014-e79edf0fbee6.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:05	2025-04-07 21:37:05	Axel	{}	regard-envo-tant
cm9d1zqjt0021vu2kfgbtg7nv	Cheval Sauvage	"Cheval Sauvage" illustre la puissance et la grâce d'un étalon en mouvement. Avec des détails précis et une palette de couleurs naturelles, ce tableau transmet la liberté et la force brute de cet animal majestueux.	11000.00	{/images/products/4d3628b0-da20-4ecc-97d1-6c5e54480958.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:05	2025-04-07 21:37:05	Axel	{}	cheval-sauvage
cm9d1zqju0023vu2kjh6c3ypv	La mélodie d'amour	"La Mélodie d’Amour" est une célébration vibrante de la passion et de l'harmonie. Avec ses formes fluides et ses couleurs intenses, ce tableau capte l'essence même des émotions universelles et de la musique intérieure qui lie les âmes.	3500.00	{}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:05	2025-04-07 21:37:05	Axel	{}	la-m-lodie-d-amour
cm9d1zqjv0025vu2ki2tl7i3m	masque dogon benin	Inspiré des traditions béninoises, ce masque Dogon est une œuvre qui mêle art tribal et modernité. Ses teintes éclatantes et ses formes géométriques audacieuses évoquent la spiritualité et l'authenticité de la culture africaine.	1000.00	{}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:05	2025-04-07 21:37:05	Axel	{}	masque-dogon-benin
cm9d1zqjw0027vu2k2bkkk8qf	le visage de l'être	"Le Visage de l'Être" explore la complexité de l'identité humaine à travers des formes abstraites et des tons éclatants. Ce tableau, riche en symbolisme, invite à la réflexion sur les multiples facettes de l'existence.	1000.00	{/images/products/ccf70963-8fce-4875-9589-a4ebae29a0f4.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:05	2025-04-07 21:37:05	Axel	{}	le-visage-de-l-tre
cm9d1zqjx0029vu2kjsbgl557	abre de vie	L'"Abre de Vie" est une ode à la croissance et à l'interconnexion. Ce tableau lumineux, avec ses racines profondes et ses branches florissantes, symbolise l'équilibre entre la nature et l'humanité. Les nuances vibrantes inspirent un sentiment de renouveau et d'énergie.	1000.00	{/images/products/b4b8e592-6605-4b46-aa84-359de8051162.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:05	2025-04-07 21:37:05	Axel	{}	abre-de-vie
cm9d1zqjy002bvu2k7hk2m9ao	Masque Dogon du Togo	Ce masque artistique capture l'essence spirituelle et symbolique des Dogons du Togo. Avec des motifs géométriques audacieux et des couleurs vives, il représente une fusion entre tradition et modernité. Chaque détail témoigne de l'héritage riche et de l'artisanat méticuleux de cette culture.	1000.00	{/images/products/5dc42747-c3fe-4c1c-ba30-c1a5c555a5ab.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:05	2025-04-07 21:37:05	Axel	{}	masque-dogon-du-togo
cm9d1zqjz002dvu2kjpy4dgdi	masque dogon	Œuvre artistique originale.	1000.00	{/images/products/51fb562b-749e-4d87-bedb-d9f1f612fd46.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:05	2025-04-07 21:37:05	Axel	{}	masque-dogon
cm9d1zqjz002fvu2k44nmxnrx	le visage de l'être	"Le Visage de l'Être" explore la complexité de l'identité humaine à travers des formes abstraites et des tons éclatants. Ce tableau, riche en symbolisme, invite à la réflexion sur les multiples facettes de l'existence.	1000.00	{/images/products/1582f236-f47b-49d7-8011-14bcb81b22f3.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:05	2025-04-07 21:37:05	Axel	{}	le-visage-de-l-tre-2
cm9d1zqk0002hvu2ktbdb0c7w	Traditions du Nord Marocain	"Traditions du Nord Marocain" capture la beauté et l’authenticité de la vie quotidienne dans les régions septentrionales du Maroc, où les teintes vives et les paysages lumineux se mêlent harmonieusement aux traditions ancestrales. Les personnages, vêtus de vêtements typiques du nord, évoluent dans une scène baignée de lumière, évoquant la sérénité des villages marocains.	2500.00	{/images/products/68dd6dc7-8c2f-4232-b7a2-852245743cf6.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:05	2025-04-07 21:37:05	Axel	{}	traditions-du-nord-marocain
cm9d1zqk1002jvu2kldk3j2v2	Les Gardiens du Désert	"Les Gardiens du Désert" immortalise la grâce et la résilience d'une mère et de son enfant, marchant dans un paysage aride et baigné de lumière. Les couleurs douces et les silhouettes élégantes évoquent une histoire de courage et de connexion familiale. Le fond minimaliste, mêlant des nuances de bleu et de rose, met en valeur l'émotion et la simplicité de la scène. Cette œuvre, empreinte de tendresse et de poésie, ajoutera une touche de sérénité et de profondeur à votre espace intérieur.	2500.00	{/images/products/9aa6c1f8-84cb-40f0-b8cb-eb0f6e5120dd.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:05	2025-04-07 21:37:05	Axel	{}	les-gardiens-du-d-sert
cm9d1zqk2002lvu2kt8c7d66k	Douceur Orientale	"Douceur Orientale" capture l'élégance intemporelle et la sérénité d'une ruelle traditionnelle baignée de lumière. Les détails soignés de l'architecture, avec ses dômes et ses arcs ornés, évoquent un voyage au cœur des cultures orientales. Le ciel d'un bleu profond contraste avec les teintes chaudes des façades, tandis que les personnages ajoutent une touche de vie à la scène. Cette œuvre, empreinte de charme et de raffinement, apportera une ambiance apaisante et exotique à tout espace intérieur.	3500.00	{/images/products/2a15c328-d120-499b-bdc8-44be841ce020.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:05	2025-04-07 21:37:05	Axel	{}	douceur-orientale
cm9d1zqk3002nvu2kc04dcq8g	Le Charme de l'Orient	"Le Charme de l'Orient" illustre la beauté et le mystère d'une architecture traditionnelle baignée de lumière. Les détails ornés de l'édifice, tels que la porte majestueuse et les motifs arabesques, évoquent une atmosphère empreinte d'histoire et de sérénité. Le bleu vibrant du ciel contraste harmonieusement avec les teintes chaudes des murs, créant une composition visuelle captivante. Ce tableau, idéal pour les amateurs d'art oriental et d'élégance intemporelle, apportera une touche de raffinement et de culture à tout intérieur.	3500.00	{/images/products/364f2831-e0d2-488d-affa-b33c5804fd84.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:05	2025-04-07 21:37:05	Axel	{}	le-charme-de-l-orient
cm9d1zqk4002pvu2kq5l9nf1q	Éclat du Souk	"Éclat du Souk" immortalise l'animation vibrante et colorée d'un marché local baigné dans une lumière éclatante. Les silhouettes des personnages se mêlent aux teintes chaudes et vives des étals et des façades, évoquant la richesse culturelle et l'effervescence quotidienne de la scène. Ce tableau, avec son style expressif et ses contrastes lumineux, est parfait pour ajouter une touche d'énergie et de vie à tout espace intérieur.	5500.00	{/images/products/3ac2710e-1eed-486d-9a3d-b517f44742c2.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:05	2025-04-07 21:37:05	Axel	{}	clat-du-souk
cm9d1zqk5002rvu2kgnhyyeb4	Le Marché en Lumières	"Le Marché en Lumières" capture l'effervescence et la vivacité d'une scène de marché baignée dans des teintes vibrantes et éclatantes. Les personnages et les bâtiments s'animent sous des touches de pinceau audacieuses, reflétant l'énergie et la richesse culturelle de ce moment. Ce tableau, avec ses couleurs intenses et son style expressif, est idéal pour insuffler une atmosphère chaleureuse et dynamique à n'importe quel espace.	5500.00	{/images/products/ec14de64-1312-40a9-b338-fe56bac7953f.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:05	2025-04-07 21:37:05	Axel	{}	le-march-en-lumi-res
cm9d1zqk6002tvu2kzophn6fy	Sérénité Bucolique	"Sérénité Bucolique" transporte le spectateur dans un paysage apaisant, où un pont pittoresque en pierre enjambe une rivière paisible entourée de verdure. Les nuances de bleu du ciel et les tons chaleureux des toits créent une harmonie visuelle qui évoque la tranquillité et le charme de la campagne. Ce tableau, empreint d'élégance classique, est idéal pour ajouter une touche de sérénité et de raffinement à n'importe quel intérieur.	5000.00	{/images/products/f3664844-d54e-43d3-b30c-d8f8df4cdd17.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:05	2025-04-07 21:37:05	Axel	{}	s-r-nit-bucolique
cm9d1zqk6002vvu2kfnam8tpe	Le Tigre Enchanteur	Le Tigre Enchanteur capture la majesté et la puissance d’un tigre blanc évoluant dans un environnement naturel vibrant. L'eau éclatante et les teintes riches de la forêt mettent en lumière la beauté et l'équilibre de cet animal mystique. Ce tableau symbolise à la fois la force brute et l'harmonie avec la nature, offrant une présence captivante qui transformera n'importe quel espace.	3000.00	{/images/products/69864313-eadf-4970-b78c-49c56ff7d42f.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:05	2025-04-07 21:37:05	Axel	{}	le-tigre-enchanteur
cm9d1zqk7002xvu2k3xekejdx	L'Éléphant d'Afrique Mystique	L'Éléphant d'Afrique Mystique incarne la puissance et la sagesse intemporelle de la nature sauvage. Avec ses nuances éclatantes et ses détails vibrants, cette œuvre capture la majesté de cet animal emblématique dans un décor aux teintes harmonieuses. Chaque coup de pinceau évoque la force, la sérénité et l'équilibre, offrant une présence inspirante qui enrichira tout espace intérieur. Idéal pour ceux qui recherchent une pièce à la fois captivante et symbolique.	3000.00	{/images/products/a6fc6ecb-8fab-4d9b-bece-deba1ccf65b6.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:05	2025-04-07 21:37:05	Axel	{}	l-l-phant-d-afrique-mystique
cm9d1zqkc002zvu2kfgs3z5al	Le Regard Sauvage	Le Regard Sauvage plonge l'observateur dans l'intensité captivante des yeux d'un léopard majestueux. Les détails saisissants de son pelage, mêlant des nuances dorées et des contrastes profonds, évoquent à la fois la force et la grâce de cet animal emblématique. Ce tableau incarne la puissance de la nature sauvage et ajoute une touche d'énergie audacieuse à tout espace intérieur. Une pièce idéale pour ceux qui recherchent une œuvre à la fois percutante et élégante.	1200.00	{/images/products/19d09a80-2ad9-4e7d-b519-25b333ec2ae7.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:05	2025-04-07 21:37:05	Axel	{}	le-regard-sauvage
cm9d1zqkd0031vu2kwgwueq69	Le cycle des aigles	"Le Cycle des Aigles" symbolise la liberté et la puissance intemporelle de ces majestueux rapaces. Avec ses ailes déployées dans un tourbillon d'énergie, l'aigle évoque le renouveau et la force intérieure. Les teintes dynamiques et les mouvements circulaires de la composition transmettent une harmonie entre ciel et terre. Idéal pour un espace en quête d'inspiration et de profondeur symbolique.	3500.00	{/images/products/424843cb-c5b2-44f3-8845-ee6907c4ed3a.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:05	2025-04-07 21:37:05	Axel	{}	le-cycle-des-aigles
cm9d1zqke0033vu2ke8pw8d65	L'Hirondelle du Soleil	"L'Hirondelle du Soleil" capture l'énergie éclatante d'une hirondelle volant dans un ciel baigné de lumière. Les nuances chaudes du soleil se mêlent harmonieusement aux contours gracieux de l'oiseau, symbolisant la liberté, l'espoir et la renaissance. Ce tableau rayonnant est idéal pour insuffler une ambiance lumineuse et optimiste dans votre intérieur.	1200.00	{/images/products/ae035553-c269-4039-aab5-f61d31238ca2.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:05	2025-04-07 21:37:05	Axel	{}	l-hirondelle-du-soleil
cm9d1zqkf0035vu2ksdvesjkl	Cheval Caféiné	"Cheval Caféiné" est une œuvre unique réalisée avec des grains de café, illustrant un cheval majestueux dans un style à la fois rustique et moderne. Les détails minutieux des grains de café apportent une texture riche et authentique, tandis que le fond en toile évoque un charme artisanal. Ce tableau symbolise l'énergie, la liberté et la puissance brute de cet animal noble, tout en offrant une esthétique chaleureuse et naturelle. Idéal pour les amateurs de designs originaux et de matériaux organiques.	3000.00	{/images/products/2a4bc75b-9eea-4fc4-b690-ac40a3c4871e.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:05	2025-04-07 21:37:05	Axel	{}	cheval-caf-in
cm9d1zqkg0037vu2k6c16ftce	masque dogon	"Masque Dogon" rend hommage à l'art et à la culture riche du peuple Dogon à travers une œuvre contemporaine réalisée avec des grains de café. Ce masque captivant allie des motifs géométriques audacieux et des textures organiques, créant un contraste saisissant qui symbolise la connexion entre la tradition et la modernité. Chaque détail raconte une histoire de spiritualité et d'identité culturelle, faisant de ce tableau une pièce maîtresse idéale pour les amateurs d'art ethnique et innovant.	2000.00	{/images/products/66222f26-a8bc-4aca-855c-ec47c009eec3.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:05	2025-04-07 21:37:05	Axel	{}	masque-dogon-2
cm9d1zqkh0039vu2krahu5kzg	Masque Dogon – Harmonie Géométrique	Ce Masque Dogon revisité incarne une fusion d’héritage ancestral et d’interprétation contemporaine à travers des motifs géométriques vibrants. Les teintes audacieuses et les détails subtils composés avec des matériaux organiques reflètent la spiritualité et l’élégance de la culture Dogon. Cette œuvre unique invite à explorer la richesse symbolique et les mystères d’une tradition intemporelle, tout en apportant une touche artistique moderne et captivante à votre espace intérieur.	2000.00	{/images/products/d3828f4e-09d1-42ce-bd5f-38e255e3c65a.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:05	2025-04-07 21:37:05	Axel	{}	masque-dogon-harmonie-g-om-trique
cm9d1zqki003bvu2kjhvae8n1	Bisou Affectif	"Bisou Affectif" est une célébration audacieuse et vibrante de l'expression émotionnelle. Cette œuvre captivante mêle des teintes éclatantes et des motifs abstraits pour évoquer la passion, la tendresse et la connexion humaine. Les détails riches et les jeux de lumière ajoutent une profondeur fascinante, transformant cette pièce en un point focal élégant et plein de caractère. Idéal pour apporter une touche de modernité et d'émotion à votre espace intérieur.	2000.00	{/images/products/561f3478-dbcd-42c5-ada2-4aa8b869bd38.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:05	2025-04-07 21:37:05	Axel	{}	bisou-affectif
cm9d1zqki003dvu2krnrvbjhi	Éveil Multicolore	"Éveil Multicolore" est une ode vibrante à l'expression artistique et à la diversité culturelle. Avec ses teintes éclatantes et ses formes géométriques audacieuses, cette œuvre capte l'énergie du renouveau et de la créativité. Les motifs abstraits, enrichis de symboles mystiques, évoquent une quête d'harmonie entre lumière et ombre. Chaque détail invite à une interprétation personnelle, transformant cette pièce en un élément unique et captivant pour illuminer votre espace intérieur.	2000.00	{/images/products/73e83ebd-29d3-42d7-bef2-574fb106d377.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:05	2025-04-07 21:37:05	Axel	{}	veil-multicolore
cm9d1zqkj003fvu2kuafdkcmt	Harmonie Équestre	Harmonie Équestre est une célébration de la force et de la grâce incarnées par deux chevaux majestueux. Le contraste entre le blanc pur et les teintes chaudes du brun met en valeur leur complémentarité et leur lien profond. Les éclaboussures de couleurs en arrière-plan ajoutent une touche d’énergie et de modernité à cette œuvre classique et dynamique. Idéal pour les amoureux des chevaux et ceux qui souhaitent apporter une ambiance élégante et vivante à leur intérieur.	4000.00	{/images/products/0e3fd148-9245-45d8-a31b-b02fdd48ce77.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:05	2025-04-07 21:37:05	Axel	{}	harmonie-questre
cm9d1zqkk003hvu2k76f0e55p	Harmonie Naturelle	Harmonie Naturelle célèbre la beauté et l’équilibre de la nature avec des éléments vibrants et poétiques. Les colombes blanches symbolisent la paix et la liberté, tandis que le paon majestueux et les tournesols éclatants apportent une touche de vitalité et de couleur. Le contraste entre le ciel incandescent et les tons apaisants du paysage crée une atmosphère à la fois énergisante et sereine. Une œuvre idéale pour illuminer et embellir tout espace.	4000.00	{/images/products/a8c4ebc5-e575-4749-8b79-1d10bb186176.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:05	2025-04-07 21:37:05	Axel	{}	harmonie-naturelle
cm9d1zqkl003jvu2k3s5zfxiy	Toucan Tropical	Toucan Tropical est une célébration de la faune exotique et des paysages luxuriants. Le toucan, avec ses couleurs éclatantes et son bec majestueux, est entouré de fleurs tropicales vibrantes qui évoquent la richesse et la diversité de la nature. Cette œuvre respire la joie et la vitalité, idéale pour apporter une ambiance tropicale et lumineuse à votre espace intérieur.	2000.00	{/images/products/f293927e-5346-445f-8bc0-d09e14827ffc.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:05	2025-04-07 21:37:05	Axel	{}	toucan-tropical
cm9d1zqkl003lvu2k13tno9ws	L'Esprit des Plumes	L'Esprit des Plumes est une œuvre captivante qui célèbre les racines culturelles et l’héritage des peuples autochtones. La figure centrale, richement ornée de motifs colorés et d’un majestueux ornement de plumes, incarne la fierté et la connexion spirituelle avec la nature. Les couleurs vibrantes et les détails minutieux racontent une histoire d’identité et de tradition. Une pièce parfaite pour ajouter une touche de profondeur culturelle et de vitalité à votre intérieur.	3000.00	{/images/products/64ee5e45-54eb-4696-8391-96c8b5d0725c.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:05	2025-04-07 21:37:05	Axel	{}	l-esprit-des-plumes
cm9d1zqkm003nvu2kipxwxbwv	Danse des Spirales	Danse des Spirales est une œuvre ludique et hypnotique qui représente des oiseaux stylisés entourés de cercles vibrants et colorés. Les motifs tourbillonnants symbolisent le mouvement et l’harmonie de la nature. Cette composition audacieuse et pleine de vie apporte une touche de dynamisme et de créativité à tout espace. Une pièce parfaite pour ceux qui recherchent une fusion entre simplicité et originalité.	2000.00	{/images/products/f42182ac-a4dd-4171-b84b-458cc43148b7.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:05	2025-04-07 21:37:05	Axel	{}	danse-des-spirales
cm9d1zqkn003pvu2kxew94zqu	Tableau acrylique de l’artiste	Masque des Émotions est une œuvre vibrante et symbolique qui capte l'essence de l'expression humaine. Les motifs colorés et les formes géométriques s'entrelacent pour créer un visage mystérieux, mêlant mysticisme et modernité. Chaque détail semble raconter une histoire, invitant le spectateur à plonger dans un monde riche en significations. Une pièce parfaite pour apporter une touche audacieuse et artistique à tout espace.	2000.00	{/images/products/09ad61fe-4c37-4af6-9d38-a7af2e2f805e.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:05	2025-04-07 21:37:05	Axel	{}	tableau-acrylique-de-l-artiste
cm9d1zqko003rvu2kl13xno6t	L’Arbre de Vie Spirale	L’Arbre de Vie Spirale est une représentation vibrante et symbolique de la connexion entre la nature et l’univers. Les spirales colorées qui ornent les branches illustrent le mouvement constant de l’énergie et de la croissance, tandis que le dégradé lumineux en arrière-plan évoque l’espoir et la transformation. Une œuvre idéale pour insuffler une touche de spiritualité et de vitalité à votre espace intérieur.	2000.00	{/images/products/e6610a05-426e-4874-91f6-de8f6d3ae52d.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:05	2025-04-07 21:37:05	Axel	{}	l-arbre-de-vie-spirale
cm9d1zqkp003tvu2kqrt240lg	Fusion des Mondes	Fusion des Mondes représente l’union harmonieuse entre des forces opposées : le chaud et le froid, la lumière et l’obscurité. Les arbres vibrant de couleurs chaudes et froides se rejoignent en leur centre pour créer une énergie équilibrée et dynamique. Cette œuvre invite à réfléchir sur la dualité et la complémentarité de la nature et de l’univers. Parfaite pour apporter une touche symbolique et vibrante à un intérieur moderne ou spirituel.	2000.00	{/images/products/25e1cf4c-44db-4842-a66f-df1faf0e2e4d.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:05	2025-04-07 21:37:05	Axel	{}	fusion-des-mondes
cm9d1zqkp003vvu2k4r4tni47	Lumière Captive	Lumière Captive illustre la connexion énigmatique entre la nature et le cosmos. Les branches sombres semblent s’étendre vers une lune lumineuse et mystique, créant un jeu captivant entre ombre et lumière. Les nuances de bleu profond et les textures scintillantes ajoutent une dimension éthérée, évoquant le calme et la réflexion. Une œuvre parfaite pour les amateurs de paysages oniriques et d’art symbolique.	2000.00	{/images/products/1d2dc3e9-b8d0-4e5d-9710-052dc48a430b.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:05	2025-04-07 21:37:05	Axel	{}	lumi-re-captive
cm9d1zqkq003xvu2kuohb2qr6	Tableau acrylique de l’artiste	Œuvre artistique originale.	2500.00	{/images/products/b824f012-869b-444b-95f8-7c16a0d153a5.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:05	2025-04-07 21:37:05	Axel	{}	tableau-acrylique-de-l-artiste-2
cm9d1zqkr003zvu2kny0bvjp0	Éclat d’Expression	Éclat d’Expression est une explosion de couleurs et d’émotions capturées dans un style audacieux et moderne. Ce visage abstrait, orné de motifs vibrants et de lignes dynamiques, incarne la diversité et la richesse des sentiments humains. Les touches de peinture dégoulinante ajoutent une texture unique, renforçant l’énergie brute de l’œuvre. Une pièce idéale pour les amateurs d’art contemporain qui cherchent à insuffler une touche de créativité et de caractère à leur espace.	2500.00	{/images/products/64d1f7ec-f0e0-4fce-926f-cd2bf4dfeb7d.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:05	2025-04-07 21:37:05	Axel	{}	clat-d-expression
cm9d1zqks0041vu2kklqk05qx	Le Gardien des Couleurs	Le Gardien des Couleurs est une célébration vibrante de la vie et de l’énergie. Avec ses motifs géométriques audacieux et ses teintes éclatantes, cette œuvre représente une figure symbolique qui semble veiller sur un univers chaotique mais harmonieux. Chaque détail invite à une exploration de l’expression artistique contemporaine. Parfait pour un intérieur moderne en quête d’énergie et de caractère.	4000.00	{/images/products/0db792ac-2129-42e3-861d-2c73ae600bac.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:05	2025-04-07 21:37:05	Axel	{}	le-gardien-des-couleurs
cm9d1zqkt0043vu2kybkpqggs	Reflet Lunaire	Reflet Lunaire évoque la puissance mystique de la lune illuminant un paysage montagneux. Les teintes bleutées et les contrastes profonds capturent l’étrangeté et la beauté du clair de lune, offrant une atmosphère apaisante et contemplative. Une œuvre idéale pour les amateurs de scènes nocturnes empreintes de poésie et de sérénité.	2000.00	{/images/products/ab1e0728-3246-4605-80dd-52da35aeef60.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:05	2025-04-07 21:37:05	Axel	{}	reflet-lunaire
cm9d1zqku0045vu2kv043blcf	Mur des Symboles	Mur des Symboles est une œuvre riche en détails et en motifs qui fusionne des formes géométriques, des textures complexes et des couleurs vibrantes. Chaque élément semble raconter une histoire, évoquant la lutte, l’émotion et les connexions humaines. Cette composition saisissante est un mélange d’énergie brute et de profondeur artistique, parfaite pour ceux qui cherchent à ajouter une pièce unique et significative à leur collection ou espace intérieur.	2500.00	{/images/products/63e3bd17-6b52-491b-a181-2492149edef1.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:05	2025-04-07 21:37:05	Axel	{}	mur-des-symboles
cm9d1zqku0047vu2kimuu62ij	L’Arbre de Feu	Dans L’Arbre de Feu , la puissance de la nature se dévoile à travers un coucher de soleil incandescent qui embrase le ciel. Les branches noires de l’arbre s'étendent comme des veines, contrastant avec les teintes ardentes du rouge, de l'orange et du jaune. Cette œuvre symbolise la force et la résilience face au passage du temps. Une pièce idéale pour insuffler chaleur et intensité à votre espace intérieur.	2500.00	{/images/products/b2d4192c-46c9-4fa9-9c80-388b71ef2b80.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:05	2025-04-07 21:37:05	Axel	{}	l-arbre-de-feu
cm9d1zqkv0049vu2khafqpu96	Masque de Lumière et d'Ombre	Une fusion captivante de couleurs vives et de formes abstraites, Masque de Lumière et d'Ombre explore la dualité de l'existence. Les éléments contrastés, tels que le soleil rayonnant et les ombres mystérieuses, se rencontrent pour symboliser la lumière et l'obscurité qui coexistent en chacun de nous. Une œuvre parfaite pour apporter une touche vibrante et intrigante à votre intérieur, tout en évoquant un message profond sur l’équilibre de la vie.	2500.00	{/images/products/f45ab71e-4395-4dd1-9b9b-c7ca82904477.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:05	2025-04-07 21:37:05	Axel	{}	masque-de-lumi-re-et-d-ombre
cm9d1zqkw004bvu2kz0gzdphi	Lien d'Humanité	Lien d'Humanité illustre la connexion entre deux figures abstraites dans un style audacieusement coloré et géométrique. Les traits expressifs et les contrastes saisissants entre les teintes vives et le fond jaune évoquent la complexité des relations humaines. Une œuvre vibrante et moderne, idéale pour ajouter une énergie positive et une profondeur symbolique à n'importe quel espace.	2500.00	{/images/products/d768cc4f-c533-43cb-9cc6-fc9e28fdba92.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:05	2025-04-07 21:37:05	Axel	{}	lien-d-humanit
cm9d1zqkx004dvu2k7rqp0pna	L'Enchantement Tropical	Plongez dans un univers tropical luxuriant avec L'Enchantement Tropical , une œuvre vibrante mêlant des motifs animaliers et floraux dans une explosion de couleurs. Les oiseaux exotiques et les détails délicats des fleurs s'entrelacent pour créer une composition riche en symbolisme et en énergie. Ce tableau est idéal pour apporter une touche de nature vivante et d’évasion dans votre espace, tout en célébrant la beauté et la diversité du monde tropical.	1200.00	{/images/products/f0ed51ed-8817-465b-b8a5-9bfcbeb1dc27.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:05	2025-04-07 21:37:05	Axel	{}	l-enchantement-tropical
cm9d1zqky004fvu2kv1hjz4b5	La Mélodie des Montagnes	La Mélodie des Montagnes capture la beauté intemporelle d’un paysage naturel avec des montagnes majestueuses et des collines vibrantes. Les lignes sinueuses et les couleurs riches transmettent une sensation de calme et d’harmonie. Ce tableau invite à une évasion vers la sérénité de la nature, parfait pour créer une atmosphère apaisante et inspirante dans votre espace intérieur.	4000.00	{/images/products/4492a9c2-dda4-433d-b907-d4bcb0a3fec7.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:05	2025-04-07 21:37:05	Axel	{}	la-m-lodie-des-montagnes
cm9d1zqkz004hvu2kyo152jx0	L'Homme en Fragments Colorés	Découvrez L'Homme en Fragments Colorés , une œuvre vibrante et ludique qui mélange des motifs géométriques et des couleurs audacieuses. Ce personnage énigmatique, construit comme un puzzle de textures et de teintes, invite à une réflexion sur l’identité et la multiplicité de l’être. Parfait pour apporter une touche d’énergie et de modernité à votre espace, ce tableau séduit par son style unique et ses détails captivants.	2500.00	{/images/products/4dabc59c-5958-41ab-bd37-166b6eb5fe5c.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:05	2025-04-07 21:37:05	Axel	{}	l-homme-en-fragments-color-s
cm9d1zqkz004jvu2kvd08j8z3	Voyage au Coucher du Soleil	Plongez dans l’atmosphère envoûtante de "Voyage au Coucher du Soleil", une peinture captivante qui évoque un voyage spirituel au cœur d’un paysage onirique. Un rameur solitaire navigue sur une rivière miroitante, baignée par les reflets dorés du soleil couchant. À l’horizon, un arbre aux racines tortueuses et une silhouette de girafe accentuent la profondeur mystique de la scène. Cette œuvre, mêlant nuances ardentes et ombres envoûtantes, est une invitation à l’évasion et à la contemplation. Idéale pour ajouter une touche artistique et poétique à votre intérieur.	2000.00	{/images/products/ec7e6bdd-85d8-42c9-8030-4bdd3745b828.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:05	2025-04-07 21:37:05	Axel	{}	voyage-au-coucher-du-soleil
cm9d1zql0004lvu2kq2e4walx	Les Ailes de la Liberté Cristalline	Un jeu de lumière et de couleurs jaillit dans cette représentation de plumes cristallines et vibrantes, évoquant la légèreté et la liberté. Une œuvre à la fois apaisante et inspirante, parfaite pour sublimer un mur avec poésie et élégance.	3000.00	{/images/products/39eb7f64-b061-43e2-a96c-57b9ff8d8c3f.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:05	2025-04-07 21:37:05	Axel	{}	les-ailes-de-la-libert-cristalline
cm9d1zql1004nvu2kf0kn8sze	Visage Fragment	Découvrez "Visage Fragmenté", une œuvre audacieuse et expressive qui fusionne l’art abstrait et le style néo-expressionniste. Ce portrait coloré joue avec les formes et les contrastes, mêlant des traits géométriques, des motifs vibrants et des coulées de peinture pour évoquer une identité en constante évolution. L’œil perçant et les symboles éclatants ajoutent une dimension mystique et intrigante. Parfait pour les amateurs d’art contemporain cherchant une pièce unique et captivante à exposer.	2500.00	{/images/products/9f5c78b5-b2c3-4fc0-a7d4-5bd2accd6f27.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:05	2025-04-07 21:37:05	Axel	{}	visage-fragment
cm9d1zql2004pvu2kj7ye97u3	Sa Majesté Mohammed VI Vision et Leadership	Œuvre artistique originale.	30000.00	{/images/products/6d431627-6ed2-42c9-9cdc-b7efdbf1cd8f.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:05	2025-04-07 21:37:05	Axel	{}	sa-majest-mohammed-vi-vision-et-leadership
cm9d1zql3004rvu2kwb3pk39v	Tableau à l'huile sur toile de l'artiste Messari Mohammed	Œuvre artistique originale.	26000.00	{/images/products/ead5775b-1c53-4f19-9c20-94df9a7b7be0.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:05	2025-04-07 21:37:05	Axel	{}	tableau-l-huile-sur-toile-de-l-artiste-messari-mohammed
cm9d1zql3004tvu2kpimbhqpm	Tableau à l'huile sur toile de l'artiste Messari Mohammed	Œuvre artistique originale.	10000.00	{/images/products/925253a0-eda7-44ec-a5fc-00c19a367bf4.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:05	2025-04-07 21:37:05	Axel	{}	tableau-l-huile-sur-toile-de-l-artiste-messari-mohammed-2
cm9d1zql4004vvu2kblnersst	Tableau à l'huile sur toile de l'artiste Messari Mohammed	Œuvre artistique originale.	10000.00	{/images/products/56770cae-1833-4c61-a6cb-d7ef1742d0a4.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:05	2025-04-07 21:37:05	Axel	{}	tableau-l-huile-sur-toile-de-l-artiste-messari-mohammed-3
cm9d1zql6004xvu2kmqyciblf	Tableau à l'huile sur toile de l'artiste Messari Mohammed	Œuvre artistique originale.	9500.00	{/images/products/173fd7c9-af86-4829-8561-53edd292ea0b.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:05	2025-04-07 21:37:05	Messari	{}	tableau-l-huile-sur-toile-de-l-artiste-messari-mohammed-4
cm9d1zql6004zvu2kxtlk8p9a	Tableau à l'huile sur toile de l'artiste Messari Mohammed	Œuvre artistique originale.	24000.00	{/images/products/e829e56a-a653-4e4d-ac83-f4fa53a6fe63.jpeg}	1	cm9d1zqia0000vu2kzhxfey0g	f	2025-04-07 21:37:05	2025-04-07 21:37:05	Axel	{}	tableau-l-huile-sur-toile-de-l-artiste-messari-mohammed-5
\.


--
-- Data for Name: Session; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Session" (id, "sessionToken", "userId", expires) FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, name, email, "emailVerified", image, password, role, "createdAt", "updatedAt") FROM stdin;
cm9d0duza0000vuntiao0uwiq	Admin User	admin@kibido.com	\N	\N	$2b$10$VJMHxyKNyCAuloSPjfsHUetMTpJIt48lQLTlDZDJCBD06Pkbj1IJ2	ADMIN	2025-04-11 16:35:58.102	2025-04-11 16:35:58.102
\.


--
-- Data for Name: VerificationToken; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."VerificationToken" (identifier, token, expires) FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
672b4009-d365-4211-96ff-93cd188afcf3	2cd90c2eb8c8f1c4c5e8979a567fbadb51bf5b3e2e9996f078cb00efea3e7e04	2025-04-11 16:34:07.565294+00	20250411163407_init	\N	\N	2025-04-11 16:34:07.54333+00	1
1bd35ece-32c5-4ef8-a95b-5ee44f6a425a	5ea83c3fcfa39d41bc83c096b6e06d58e12ea99c0cb17188fb1f4530b6225b5f	2025-04-11 16:55:31.819846+00	20250411165531_add_slug_artist_gallery	\N	\N	2025-04-11 16:55:31.809986+00	1
\.


--
-- Name: Account Account_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_pkey" PRIMARY KEY (id);


--
-- Name: Category Category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id);


--
-- Name: Customer Customer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Customer"
    ADD CONSTRAINT "Customer_pkey" PRIMARY KEY (id);


--
-- Name: OrderItem OrderItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_pkey" PRIMARY KEY (id);


--
-- Name: Order Order_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_pkey" PRIMARY KEY (id);


--
-- Name: Product Product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_pkey" PRIMARY KEY (id);


--
-- Name: Session Session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Account_provider_providerAccountId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON public."Account" USING btree (provider, "providerAccountId");


--
-- Name: Category_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Category_name_key" ON public."Category" USING btree (name);


--
-- Name: Category_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Category_slug_key" ON public."Category" USING btree (slug);


--
-- Name: Customer_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Customer_email_key" ON public."Customer" USING btree (email);


--
-- Name: Product_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Product_slug_key" ON public."Product" USING btree (slug);


--
-- Name: Session_sessionToken_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Session_sessionToken_key" ON public."Session" USING btree ("sessionToken");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: VerificationToken_identifier_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON public."VerificationToken" USING btree (identifier, token);


--
-- Name: VerificationToken_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "VerificationToken_token_key" ON public."VerificationToken" USING btree (token);


--
-- Name: Account Account_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OrderItem OrderItem_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OrderItem OrderItem_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Order Order_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public."Customer"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Product Product_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Session Session_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: mounirbennassar
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

