--
-- PostgreSQL database dump
--

\restrict u4IWmr4nEbI9shLRNKN5JHPgi5ZfkmCoi0ygsCvfBZLrXVjsmlofR0Y12kEm2aq

-- Dumped from database version 16.10
-- Dumped by pg_dump version 16.10

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: dienos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dienos (
    id integer NOT NULL,
    objektas_id integer,
    date date NOT NULL
);


ALTER TABLE public.dienos OWNER TO postgres;

--
-- Name: dienos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.dienos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.dienos_id_seq OWNER TO postgres;

--
-- Name: dienos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.dienos_id_seq OWNED BY public.dienos.id;


--
-- Name: kameros; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.kameros (
    id integer NOT NULL,
    kameros character varying(255) NOT NULL
);


ALTER TABLE public.kameros OWNER TO postgres;

--
-- Name: kameros_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.kameros_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.kameros_id_seq OWNER TO postgres;

--
-- Name: kameros_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.kameros_id_seq OWNED BY public.kameros.id;


--
-- Name: laidai; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.laidai (
    id integer NOT NULL,
    laidai character varying(255) NOT NULL
);


ALTER TABLE public.laidai OWNER TO postgres;

--
-- Name: laidai_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.laidai_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.laidai_id_seq OWNER TO postgres;

--
-- Name: laidai_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.laidai_id_seq OWNED BY public.laidai.id;


--
-- Name: medziagos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.medziagos (
    id integer NOT NULL,
    diena_id integer,
    name character varying(255) NOT NULL,
    quantity numeric(10,2) DEFAULT 0
);


ALTER TABLE public.medziagos OWNER TO postgres;

--
-- Name: medziagos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.medziagos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.medziagos_id_seq OWNER TO postgres;

--
-- Name: medziagos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.medziagos_id_seq OWNED BY public.medziagos.id;


--
-- Name: objektas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.objektas (
    id integer NOT NULL,
    name character varying(255),
    address character varying(255),
    status character varying(20) DEFAULT 'naujas'::character varying,
    notes text,
    client character varying(255),
    client_company character varying(255),
    client_code character varying(50),
    client_pvm character varying(50),
    client_address character varying(255),
    client_email character varying(255),
    phone character varying(50),
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.objektas OWNER TO postgres;

--
-- Name: objektas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.objektas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.objektas_id_seq OWNER TO postgres;

--
-- Name: objektas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.objektas_id_seq OWNED BY public.objektas.id;


--
-- Name: rezultatas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rezultatas (
    id integer NOT NULL,
    objektas_id integer,
    data date NOT NULL,
    suma numeric(10,2) DEFAULT 0
);


ALTER TABLE public.rezultatas OWNER TO postgres;

--
-- Name: rezultatas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rezultatas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rezultatas_id_seq OWNER TO postgres;

--
-- Name: rezultatas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rezultatas_id_seq OWNED BY public.rezultatas.id;


--
-- Name: dienos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dienos ALTER COLUMN id SET DEFAULT nextval('public.dienos_id_seq'::regclass);


--
-- Name: kameros id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kameros ALTER COLUMN id SET DEFAULT nextval('public.kameros_id_seq'::regclass);


--
-- Name: laidai id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.laidai ALTER COLUMN id SET DEFAULT nextval('public.laidai_id_seq'::regclass);


--
-- Name: medziagos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medziagos ALTER COLUMN id SET DEFAULT nextval('public.medziagos_id_seq'::regclass);


--
-- Name: objektas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.objektas ALTER COLUMN id SET DEFAULT nextval('public.objektas_id_seq'::regclass);


--
-- Name: rezultatas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rezultatas ALTER COLUMN id SET DEFAULT nextval('public.rezultatas_id_seq'::regclass);


--
-- Data for Name: dienos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dienos (id, objektas_id, date) FROM stdin;
7	6	2026-03-13
8	7	2026-03-11
\.


--
-- Data for Name: kameros; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.kameros (id, kameros) FROM stdin;
1	sony
2	daka
\.


--
-- Data for Name: laidai; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.laidai (id, laidai) FROM stdin;
1	rj45
2	utp
\.


--
-- Data for Name: medziagos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.medziagos (id, diena_id, name, quantity) FROM stdin;
10	7	daka	63.00
\.


--
-- Data for Name: objektas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.objektas (id, name, address, status, notes, client, client_company, client_code, client_pvm, client_address, client_email, phone, created_at) FROM stdin;
6	Trghh		naujas									2026-03-13 10:14:30.900953
7	Elga	Dariaus ir gireno	naujas	Skubei								2026-03-13 10:16:17.058938
\.


--
-- Data for Name: rezultatas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rezultatas (id, objektas_id, data, suma) FROM stdin;
\.


--
-- Name: dienos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.dienos_id_seq', 8, true);


--
-- Name: kameros_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.kameros_id_seq', 2, true);


--
-- Name: laidai_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.laidai_id_seq', 2, true);


--
-- Name: medziagos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.medziagos_id_seq', 10, true);


--
-- Name: objektas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.objektas_id_seq', 7, true);


--
-- Name: rezultatas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rezultatas_id_seq', 2, true);


--
-- Name: dienos dienos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dienos
    ADD CONSTRAINT dienos_pkey PRIMARY KEY (id);


--
-- Name: kameros kameros_kameros_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kameros
    ADD CONSTRAINT kameros_kameros_key UNIQUE (kameros);


--
-- Name: kameros kameros_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kameros
    ADD CONSTRAINT kameros_pkey PRIMARY KEY (id);


--
-- Name: laidai laidai_laidai_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.laidai
    ADD CONSTRAINT laidai_laidai_key UNIQUE (laidai);


--
-- Name: laidai laidai_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.laidai
    ADD CONSTRAINT laidai_pkey PRIMARY KEY (id);


--
-- Name: medziagos medziagos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medziagos
    ADD CONSTRAINT medziagos_pkey PRIMARY KEY (id);


--
-- Name: objektas objektas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.objektas
    ADD CONSTRAINT objektas_pkey PRIMARY KEY (id);


--
-- Name: rezultatas rezultatas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rezultatas
    ADD CONSTRAINT rezultatas_pkey PRIMARY KEY (id);


--
-- Name: dienos dienos_objektas_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dienos
    ADD CONSTRAINT dienos_objektas_id_fkey FOREIGN KEY (objektas_id) REFERENCES public.objektas(id) ON DELETE CASCADE;


--
-- Name: medziagos medziagos_diena_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medziagos
    ADD CONSTRAINT medziagos_diena_id_fkey FOREIGN KEY (diena_id) REFERENCES public.dienos(id) ON DELETE CASCADE;


--
-- Name: rezultatas rezultatas_objektas_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rezultatas
    ADD CONSTRAINT rezultatas_objektas_id_fkey FOREIGN KEY (objektas_id) REFERENCES public.objektas(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict u4IWmr4nEbI9shLRNKN5JHPgi5ZfkmCoi0ygsCvfBZLrXVjsmlofR0Y12kEm2aq

