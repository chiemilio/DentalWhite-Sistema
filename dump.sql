--
-- PostgreSQL database dump
--

\restrict 2ShItEDbByOroyDBN9oc8Ucw18Zz0rzVEr1PWaN4ckuY2VQDCjjGpGZuwhFW0sq

-- Dumped from database version 17.9
-- Dumped by pg_dump version 17.9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: cat_sucursales; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cat_sucursales (id, nombre, direccion, telefono, email, activo, fecha_creacion, fecha_actualizacion) FROM stdin;
1	Clínica Principal	Av. Principal #123	555-0100	principal@dentalwhite.com	t	2026-05-19 17:42:32.345424	2026-05-19 17:42:32.345424
\.


--
-- Data for Name: cat_horarios; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cat_horarios (id, sucursal_id, hora, hora_inicio, hora_fin, duracion_minutos, activo, fecha_creacion, fecha_actualizacion) FROM stdin;
1	1	09:00	09:00:00	20:00:00	30	t	2026-05-23 07:57:00.841811	2026-05-23 07:57:00.841811
2	1	10:00	10:00:00	20:00:00	30	t	2026-05-23 07:57:00.841811	2026-05-23 07:57:00.841811
3	1	11:00	11:00:00	20:00:00	30	t	2026-05-23 07:57:00.841811	2026-05-23 07:57:00.841811
4	1	12:00	12:00:00	20:00:00	30	t	2026-05-23 07:57:00.841811	2026-05-23 07:57:00.841811
5	1	13:00	13:00:00	20:00:00	30	t	2026-05-23 07:57:00.841811	2026-05-23 07:57:00.841811
6	1	14:00	14:00:00	20:00:00	30	t	2026-05-23 07:57:00.841811	2026-05-23 07:57:00.841811
7	1	15:00	15:00:00	20:00:00	30	t	2026-05-23 07:57:00.841811	2026-05-23 07:57:00.841811
8	1	16:00	16:00:00	20:00:00	30	t	2026-05-23 07:57:00.841811	2026-05-23 07:57:00.841811
9	1	17:00	17:00:00	20:00:00	30	t	2026-05-23 07:57:00.841811	2026-05-23 07:57:00.841811
10	1	18:00	18:00:00	20:00:00	30	t	2026-05-23 07:57:00.841811	2026-05-23 07:57:00.841811
\.


--
-- Data for Name: cat_nacionalidades; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cat_nacionalidades (id, nombre, codigo_iso, activo) FROM stdin;
1	Mexicana	MEX	t
\.


--
-- Data for Name: cat_roles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cat_roles (id, nombre, descripcion, permisos, activo, fecha_creacion) FROM stdin;
1	SuperAdmin	Administrador total del sistema	{"all": true}	t	2026-05-19 17:42:32.345424
2	Admin	Administrador de sucursal	{"manage_all": true}	t	2026-05-19 17:42:32.345424
3	Doctor	Médico especialista	{"manage_appointments": true, "view_patients": true}	t	2026-05-19 17:42:32.345424
4	Recepcionista	Recepción y agendamiento	{"manage_appointments": true, "view_patients": true}	t	2026-05-19 17:42:32.345424
5	Paciente	Acceso a su propio historial	{"view_own": true}	t	2026-05-19 17:42:32.345424
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.usuarios (id, email, password_hash, nombre, apellido_paterno, apellido_materno, curp, rfc, nacionalidad_id, telefono_principal, telefono_secundario, email_secundario, whatsapp, rol_id, activo, fecha_creacion, fecha_actualizacion, ultimo_acceso, last_login) FROM stdin;
1	admin@dentalwhite.com	$2b$12$6chDv/VFwvjt/n2s3k2Jq.avoeQpFZFBE949n6LkJXWzm/nf9T0ci	Admin	Sistema		\N	\N	1	\N	\N	\N	\N	2	t	2026-05-19 17:42:33.097293	2026-05-23 07:40:20.019976	\N	\N
2	doctor@dentalwhite.com	$2b$12$FTI5yprp5aIS7mfm1tijKevAhekl0IhumwOzkn42RgikZiRZi1B9m	Dr. Juan	Pérez	García	\N	\N	1	\N	\N	\N	\N	3	t	2026-05-19 17:42:33.097293	2026-05-23 07:40:20.019976	\N	\N
3	recepcion@dentalwhite.com	$2b$12$0QOdpg5SVroK.3k3sKb3AuaG07W3argxofLF0VP5zgUKyWs6PV6qq	María	López	Torres	\N	\N	1	\N	\N	\N	\N	4	t	2026-05-19 17:42:33.097293	2026-05-23 07:40:20.019976	\N	\N
4	paciente@dentalwhite.com	$2b$12$SlyWyful7hxV5tDSEnqATeIgRRlIyDMEUjH2lJPppzojU88UzdHAm	Carlos	Ramírez	Díaz	\N	\N	1	\N	\N	\N	\N	5	t	2026-05-19 17:42:33.097293	2026-05-23 07:40:20.019976	\N	\N
5	paciente@example.com	$2b$12$VrThTyYQU.JBsAommeY5TeVRyLmJ8tOFiEPI.OCeqYzCdsoV5zByi	Carlos	García	\N	\N	\N	\N	\N	\N	\N	\N	5	t	2026-05-23 07:46:58.214318	2026-05-23 07:53:31.698624	\N	\N
7	maria@example.com	$2b$12$NYQBU19rl7irE2uuPaiLUewQoroQk5CdFbZ2N2YMDsfhBfaytL61u	María	García	N/A	\N	\N	\N	5512340001	\N	\N	\N	5	t	2026-05-23 09:06:22.623972	2026-05-23 09:06:22.623972	\N	\N
8	jose@example.com	$2b$12$69Ax6PorVdm.z32THRi2Q.qNMU1o9jzGbqWEXMVmJ.F9OWp2x5x1S	José	Hernández	N/A	\N	\N	\N	5512340002	\N	\N	\N	5	t	2026-05-23 09:06:22.623972	2026-05-23 09:06:22.623972	\N	\N
9	ana@example.com	$2b$12$6tzdy5EOedsWDyONFbRu..ZIu8BLCayjDSzPaGkAR.lgxtQq01UR2	Ana	Martínez	N/A	\N	\N	\N	5512340003	\N	\N	\N	5	t	2026-05-23 09:06:22.623972	2026-05-23 09:06:22.623972	\N	\N
\.


--
-- Data for Name: empleados; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.empleados (id, usuario_id, sucursal_id, numero_empleado, cedula_profesional, fecha_contratacion, especialidad_principal, biografia_resumen, foto_perfil_url, puesto, salario, activo, fecha_creacion, fecha_actualizacion) FROM stdin;
1	2	1	EMP-0002	\N	\N	\N	\N	\N	Doctor	\N	t	2026-05-19 17:42:33.097293	2026-05-19 17:42:33.097293
2	3	1	EMP-0003	\N	\N	\N	\N	\N	Recepcionista	\N	t	2026-05-19 17:42:33.097293	2026-05-19 17:42:33.097293
\.


--
-- Data for Name: bloqueos_agenda; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.bloqueos_agenda (id, sucursal_id, empleado_id, horario_id, fecha_inicio, fecha_fin, hora_inicio, hora_fin, motivo, descripcion, tipo_bloqueo, activo, fecha_creacion, fecha_actualizacion) FROM stdin;
\.


--
-- Data for Name: cat_especialidades; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cat_especialidades (id, nombre, descripcion, activo, fecha_creacion) FROM stdin;
\.


--
-- Data for Name: cat_estados_cita; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cat_estados_cita (id, nombre, color, descripcion, activo) FROM stdin;
1	Programada	#3b82f6	Cita agendada	t
2	Confirmada	#10b981	Cita confirmada	t
3	Cancelada	#ef4444	Cita cancelada	t
4	Completada	#6366f1	Cita completada	t
5	Pagado Parcial	#f59e0b	Pago parcial	t
6	Pagado Completo	#8b5cf6	Pago completo	t
\.


--
-- Data for Name: cat_medios_contacto; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cat_medios_contacto (id, nombre, descripcion, activo) FROM stdin;
1	Teléfono	Contacto telefónico	t
\.


--
-- Data for Name: cat_servicios; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cat_servicios (id, nombre, descripcion, precio_base, duracion_minutos, activo, fecha_creacion) FROM stdin;
1	Consulta General	Revisión dental completa	500.00	30	t	2026-05-19 17:42:32.345424
2	Limpieza Dental	Limpieza profesional	800.00	45	t	2026-05-19 17:42:32.345424
3	Ortodoncia	Tratamiento de ortodoncia	1500.00	60	t	2026-05-19 17:42:32.345424
4	Endodoncia	Tratamiento de conducto	2500.00	90	t	2026-05-19 17:42:32.345424
5	Extracción	Extracción dental	600.00	30	t	2026-05-19 17:42:32.345424
\.


--
-- Data for Name: cat_tipos_antecedentes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cat_tipos_antecedentes (id, nombre, categoria, descripcion, activo) FROM stdin;
1	Historial Clínico Completo	GENERAL	Registro completo del historial clínico del paciente (examen facial, bucal, radiográfico, antecedentes)	t
\.


--
-- Data for Name: cat_tipos_paciente; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cat_tipos_paciente (id, nombre, descripcion, activo, fecha_creacion, fecha_actualizacion) FROM stdin;
1	Regular	Paciente regular	t	2026-05-19 17:42:32.345424	2026-05-19 17:42:32.345424
\.


--
-- Data for Name: pacientes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.pacientes (id, usuario_id, tipo_paciente_id, sucursal_id, numero_expediente, fecha_nacimiento, sexo, ocupacion, direccion, ciudad, estado, codigo_postal, firma_digitalizada, telefono_emergencia, contacto_emergencia, tutor_nombre, tutor_telefono, tutor_relacion, activo, fecha_creacion, fecha_actualizacion) FROM stdin;
1	4	1	1	EXP-0004	1990-01-01	Masculino	Empleado	Calle Test #123	CDMX	CDMX	01000	\N	\N	\N	\N	\N	\N	t	2026-05-19 17:42:33.097293	2026-05-19 17:42:33.097293
2	5	1	\N	PAC-000005	1990-01-01	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	2026-05-23 07:58:58.114836	2026-05-23 07:58:58.114836
3	7	\N	\N	PAC-000007	1994-06-15	Femenino	Diseñadora	Av. Reforma 456, Col. Centro	Ciudad de México	CDMX	06000	\N	\N	\N	\N	\N	\N	t	2026-05-23 09:06:22.623972	2026-05-23 09:06:22.623972
4	8	\N	\N	PAC-000008	1981-06-15	Masculino	Ingeniero	Calle Hidalgo 789, Col. Juárez	Ciudad de México	CDMX	06000	\N	\N	\N	\N	\N	\N	t	2026-05-23 09:06:22.623972	2026-05-23 09:06:22.623972
5	9	\N	\N	PAC-000009	1998-06-15	Femenino	Abogada	Blvd. Independencia 321, Col. Moderna	Ciudad de México	CDMX	06000	\N	\N	\N	\N	\N	\N	t	2026-05-23 09:06:22.623972	2026-05-23 09:06:22.623972
\.


--
-- Data for Name: citas; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.citas (id, paciente_id, empleado_id, servicio_id, sucursal_id, estado_cita_id, medio_contacto_id, fecha, hora, duracion_minutos, motivo_consulta, notas, notas_cancelacion, activo, fecha_creacion, fecha_actualizacion) FROM stdin;
16	2	1	1	1	1	\N	2026-05-26	09:00:00	60	\N	\N	\N	t	2026-05-23 09:06:23.301293	2026-05-23 09:06:23.301293
17	5	1	2	1	1	\N	2026-05-26	10:00:00	60	\N	\N	\N	t	2026-05-23 09:06:23.301293	2026-05-23 09:06:23.301293
18	1	1	3	1	1	\N	2026-05-26	11:00:00	60	\N	\N	\N	t	2026-05-23 09:06:23.301293	2026-05-23 09:06:23.301293
19	3	1	4	1	1	\N	2026-05-27	09:00:00	60	\N	\N	\N	t	2026-05-23 09:06:23.301293	2026-05-23 09:06:23.301293
20	4	1	2	1	1	\N	2026-05-27	10:00:00	60	\N	\N	\N	t	2026-05-23 09:06:23.301293	2026-05-23 09:06:23.301293
21	2	1	5	1	1	\N	2026-05-27	11:00:00	60	\N	\N	\N	t	2026-05-23 09:06:23.301293	2026-05-23 09:06:23.301293
12	5	1	4	1	4	\N	2026-05-23	13:00:00	60	\N	\N	\N	t	2026-05-23 09:06:23.301293	2026-05-23 22:13:42.597175
11	4	1	1	1	4	\N	2026-05-23	12:00:00	60	\N	\N	\N	t	2026-05-23 09:06:23.301293	2026-05-24 03:22:47.946179
8	1	1	1	1	3	\N	2026-05-23	09:00:00	60	\N	\N	\N	t	2026-05-23 09:06:23.301293	2026-05-24 07:15:02.184445
9	2	1	2	1	3	\N	2026-05-23	10:00:00	60	\N	\N	\N	t	2026-05-23 09:06:23.301293	2026-05-24 07:15:02.184445
10	3	1	3	1	3	\N	2026-05-23	11:00:00	60	\N	\N	\N	t	2026-05-23 09:06:23.301293	2026-05-24 07:15:02.184445
13	1	1	2	1	3	\N	2026-05-25	09:00:00	60	\N	\N	\N	t	2026-05-23 09:06:23.301293	2026-05-24 07:15:02.184445
14	3	1	5	1	3	\N	2026-05-25	10:00:00	60	\N	\N	\N	t	2026-05-23 09:06:23.301293	2026-05-24 07:15:02.184445
15	4	1	3	1	3	\N	2026-05-25	11:00:00	60	\N	\N	\N	t	2026-05-23 09:06:23.301293	2026-05-24 07:15:02.184445
\.


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.comments (comment) FROM stdin;
\.


--
-- Data for Name: consentimientos_paciente; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.consentimientos_paciente (id, paciente_id, servicio_id, cita_id, texto_consentimiento, firma_paciente, ip_registro, fecha_consentimiento) FROM stdin;
1	1	1	\N	Test consentimiento informado para paciente	\N	\N	2026-05-24 05:08:47.997057
2	1	1	\N	Consentimiento para Tratamiento Cosmético (Incluye Blanqueamiento y/o Carillas).\nPaciente: Carlos Ramírez\nDoctor: Dr. Juan Pérez\nFecha: 23 de mayo de 2026\n\nEl paciente declara haber sido informado de los riesgos, beneficios y alternativas del tratamiento, autorizando su realización de forma voluntaria.	\N	\N	2026-05-24 05:50:04.3351
3	3	1	\N	Consentimiento para Tratamiento Cosmético (Incluye Blanqueamiento y/o Carillas).\nPaciente: María García\nDoctor: Dr. Juan Pérez\nFecha: 23 de mayo de 2026\n\nEl paciente declara haber sido informado de los riesgos, beneficios y alternativas del tratamiento, autorizando su realización de forma voluntaria.	\N	\N	2026-05-24 05:50:26.038338
\.


--
-- Data for Name: consultas; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.consultas (id, cita_id, paciente_id, empleado_id, reconocimiento_hallazgos, diagnostico, tratamiento_indicaciones, peso, talla, temperatura, presion_sistolica, presion_diastolica, pulso, glucosa, notas_adicionales, activo, fecha_creacion, fecha_actualizacion) FROM stdin;
1	12	5	1	sdfsdf	sdfsd	ddffsdsfsd	\N	\N	\N	\N	\N	\N	\N	fdsadf	t	2026-05-23 22:14:00.473668	2026-05-23 22:14:00.473668
\.


--
-- Data for Name: consultas_fotos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.consultas_fotos (id, consulta_id, servicio_id, tipo_foto, url_foto, descripcion, fecha_creacion) FROM stdin;
\.


--
-- Data for Name: empleado_especialidades; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.empleado_especialidades (empleado_id, especialidad_id, fecha_creacion) FROM stdin;
\.


--
-- Data for Name: expedientes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.expedientes (id, paciente_id, medico_id, datos, fecha_creacion, fecha_actualizacion) FROM stdin;
1	1	1	{"diet": "Normal", "habits": {"bruxism": false, "sucking": {"lips": false, "tongue": false, "fingers": false}, "biteHabits": "Normal", "muscularContractions": false}, "allergies": "Ninguna", "hardTissues": {"bone": "Normal", "root": "Normal", "dentin": "Normal", "enamel": "Normal"}, "oralHygiene": "Buena", "softTissues": {"gum": "Rosada", "pulp": "Normal", "cheeks": "Normal", "palate": "Normal", "epithelialInsertion": "Normal"}, "observations": "Paciente en buen estado general", "consultReason": {"other": "Control de rutina", "bridge": false, "caries": false, "review": true, "amalgams": false, "emergency": false, "extraction": false, "odontoxesis": false, "prosthodontics": false}, "personalDiseases": {"renal": "", "diabetes": "", "labTests": "", "arthritis": "", "digestive": "", "respiratory": "", "generalState": "Bueno", "nervousSystem": "", "cardiovascular": "", "hemorrhagicTendency": ""}, "prescribedMedications": "Ninguno", "currentDentalTreatment": "Limpieza general", "currentMedicalTreatment": "Ninguno"}	2026-05-23 08:36:49.136062+00	2026-05-23 08:40:03.405854+00
\.


--
-- Data for Name: historial_clinico; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.historial_clinico (id, paciente_id, tipo_antecedente_id, descripcion, fecha_diagnostico, notas, activo, fecha_creacion, fecha_actualizacion) FROM stdin;
1	1	1	{"dni":"","representante":"","ocupacion":"Empleado","nombre_doctor":"Dr. Juan Pérez","estado_fisico":"malo","estado_dental":"bueno","atencion_medica":"","forma":"","simetria":"simetrica","perfil":"","frente":"fd","orejas":"bfb","tic":"","rictus":"bfb","linea_bipupilar":"dx","musculatura_labial":"","hiperactividad_mentoniana":"","relacion_molar":"","relacion_canina":"","relacion_incisal":"","over_jet":"","over_bite":"","mordida_abierta":"","linea_media":"","dientes_ausentes":"","dientes_malformados":"","dientes_con_caries":"","temporales":"","mordida_cruzada":"","tecnica_cepillado":"","estado_parodontal":"","cefalografia":"","ortoradiales":"","palmar":"","oclusal":"","oblicua":"","ortopantografias":"","mesioradial":"","ausencia_congenita":"","supernumerarios":"","quistes":"","lesiones_periapicales":"","inclusiones":"","resorcion_radicular":"","terceros_molares":"","raices_enanas":"","raices_anormales":"","paciente_id":1,"tipo_antecedente_id":1,"descripcion":"{\\"dni\\":\\"\\",\\"ocupacion\\":\\"Ingeniero Senior\\",\\"nombre_doctor\\":\\"Dr. Juan\\"}","fecha_diagnostico":"2026-05-23","notas":"Actualizado","activo":true,"id":1,"fecha_creacion":"2026-05-23T22:32:12.325065","fecha_actualizacion":"2026-05-23T22:32:12.482070","paciente_nombre":"Carlos Ramírez","tipo_antecedente_nombre":"Historial Clínico Completo"}	2026-05-23		t	2026-05-23 22:32:12.325065	2026-05-24 00:42:32.037749
\.


--
-- Data for Name: historial_clinico_ortodoncia; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.historial_clinico_ortodoncia (id, paciente_id, dni, representante, ocupacion, nombre_doctor, estado_fisico, estado_dental, atencion_medica, forma, simetria, perfil, frente, orejas, tic, rictus, linea_bipupilar, musculatura_labial, hiperactividad_mentoniana, relacion_molar, relacion_canina, relacion_incisal, over_jet, over_bite, mordida_abierta, linea_media, dientes_ausentes, dientes_malformados, dientes_con_caries, temporales, mordida_cruzada, tecnica_cepillado, estado_parodontal, cefalografia, ortoradiales, palmar, oclusal, oblicua, ortopantografias, mesioradial, ausencia_congenita, supernumerarios, quistes, lesiones_periapicales, inclusiones, resorcion_radicular, terceros_molares, raices_enanas, raices_anormales, fecha_creacion, fecha_actualizacion) FROM stdin;
2	5	asdasd		Abogada	Dr. Juan Pérez	bueno	malo	sadasdasd	asdas	asimetrica	sda	asd	asd	asd	asd	asd	normal	no	sad	asd	ds	asd	asd		asda	asd	dsadqw	asd	dszxad																				2026-05-23 22:24:53.179321	2026-05-23 22:24:53.179321
1	1	\N	\N	\N	\N	malo	malo	\N	\N	\N	\N	\N	\N	\N	\N	\N	normal	\N	dsfsdf	sdffsdf	dfsdf	sdfsdf	sdfdsf	dsfsadf	sdfsdf	dsfsdf	sdfsdff	\N	\N	\N	buena	malo	sdf	fsdf	sadf	sdf	sdf	dsf	dsfsdf	sdfsd	asdfsd	sdfsd	\N	sdfs	sdfsd	sadf	sadf	sdf	2026-05-23 09:14:20.092158	2026-05-23 23:54:48.481757
3	2	sadasd	sadsad	asdasd	Dr. Juan Pérez	malo	malo												sadsadsa	d	sadasd	asd	sadas	asd									sadasd	sadasd		asdasd	asdsad			asdas					asdasd	sadasd		asdasd	2026-05-23 23:56:14.369185	2026-05-23 23:56:14.369185
\.


--
-- Data for Name: pagos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.pagos (id, cita_id, paciente_id, monto_total, monto_pagado, monto_restante, estado, metodo_pago, numero_recibo, notas, fecha_pago, hora_pago, activo, fecha_creacion, fecha_actualizacion) FROM stdin;
1	8	1	500.00	500.00	0.00	PAGADO	EFECTIVO	REC-000008	\N	2026-05-24	10:00:00	t	2026-05-24 07:15:02.184445	2026-05-24 07:15:02.184445
2	9	3	600.00	600.00	0.00	PAGADO	EFECTIVO	REC-000009	\N	2026-05-24	10:00:00	t	2026-05-24 07:15:02.184445	2026-05-24 07:15:02.184445
3	10	2	15000.00	15000.00	0.00	PAGADO	EFECTIVO	REC-000010	\N	2026-05-24	10:00:00	t	2026-05-24 07:15:02.184445	2026-05-24 07:15:02.184445
4	13	1	600.00	600.00	0.00	PAGADO	EFECTIVO	REC-000013	\N	2026-05-24	10:00:00	t	2026-05-24 07:15:02.184445	2026-05-24 07:15:02.184445
5	14	3	1200.00	1200.00	0.00	PAGADO	EFECTIVO	REC-000014	\N	2026-05-24	10:00:00	t	2026-05-24 07:15:02.184445	2026-05-24 07:15:02.184445
6	15	4	15000.00	15000.00	0.00	PAGADO	EFECTIVO	REC-000015	\N	2026-05-24	10:00:00	t	2026-05-24 07:15:02.184445	2026-05-24 07:15:02.184445
\.


--
-- Data for Name: pagos_parciales; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.pagos_parciales (id, pago_id, monto, metodo_pago, numero_recibo, notas, fecha_pago, hora_pago, activo, fecha_creacion, fecha_actualizacion) FROM stdin;
1	1	500.00	EFECTIVO	ABONO-8-1779606902	\N	2026-05-24	10:00:00	t	2026-05-24 07:15:02.184445	2026-05-24 07:15:02.184445
2	2	600.00	EFECTIVO	ABONO-9-1779606902	\N	2026-05-24	10:00:00	t	2026-05-24 07:15:02.184445	2026-05-24 07:15:02.184445
3	3	15000.00	EFECTIVO	ABONO-10-1779606902	\N	2026-05-24	10:00:00	t	2026-05-24 07:15:02.184445	2026-05-24 07:15:02.184445
4	4	600.00	EFECTIVO	ABONO-13-1779606902	\N	2026-05-24	10:00:00	t	2026-05-24 07:15:02.184445	2026-05-24 07:15:02.184445
5	5	1200.00	EFECTIVO	ABONO-14-1779606902	\N	2026-05-24	10:00:00	t	2026-05-24 07:15:02.184445	2026-05-24 07:15:02.184445
6	6	15000.00	EFECTIVO	ABONO-15-1779606902	\N	2026-05-24	10:00:00	t	2026-05-24 07:15:02.184445	2026-05-24 07:15:02.184445
\.


--
-- Data for Name: recetas; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.recetas (id, consulta_id, paciente_id, empleado_id, folio, peso, talla, temperatura, presion_sistolica, presion_diastolica, pulso, glucosa, indicaciones_generales, activo, fecha_creacion, fecha_actualizacion) FROM stdin;
1	1	5	1	202605-00001	70.00	\N	\N	120	80	120	120.00	dsfsdf	t	2026-05-23 22:14:44.478598	2026-05-23 22:14:44.478598
\.


--
-- Data for Name: receta_medicamentos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.receta_medicamentos (id, receta_id, medicamento, presentacion, dosis, duracion, indicaciones, fecha_creacion) FROM stdin;
1	1	dsfd	sdf	sdfsd	dsfsd	sdffsd	2026-05-23 22:14:44.478598
2	1	dsfsdf	\N			\N	2026-05-23 22:14:44.478598
\.


--
-- Name: bloqueos_agenda_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.bloqueos_agenda_id_seq', 1, false);


--
-- Name: cat_especialidades_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cat_especialidades_id_seq', 1, false);


--
-- Name: cat_estados_cita_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cat_estados_cita_id_seq', 1, false);


--
-- Name: cat_horarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cat_horarios_id_seq', 10, true);


--
-- Name: cat_medios_contacto_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cat_medios_contacto_id_seq', 1, false);


--
-- Name: cat_nacionalidades_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cat_nacionalidades_id_seq', 1, false);


--
-- Name: cat_roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cat_roles_id_seq', 1, false);


--
-- Name: cat_servicios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cat_servicios_id_seq', 1, false);


--
-- Name: cat_sucursales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cat_sucursales_id_seq', 1, false);


--
-- Name: cat_tipos_antecedentes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cat_tipos_antecedentes_id_seq', 1, true);


--
-- Name: cat_tipos_paciente_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cat_tipos_paciente_id_seq', 1, false);


--
-- Name: citas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.citas_id_seq', 21, true);


--
-- Name: consentimientos_paciente_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.consentimientos_paciente_id_seq', 3, true);


--
-- Name: consultas_fotos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.consultas_fotos_id_seq', 1, false);


--
-- Name: consultas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.consultas_id_seq', 1, true);


--
-- Name: empleados_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.empleados_id_seq', 2, true);


--
-- Name: expedientes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.expedientes_id_seq', 1, true);


--
-- Name: historial_clinico_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.historial_clinico_id_seq', 1, true);


--
-- Name: historial_clinico_ortodoncia_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.historial_clinico_ortodoncia_id_seq', 3, true);


--
-- Name: pacientes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.pacientes_id_seq', 5, true);


--
-- Name: pagos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.pagos_id_seq', 6, true);


--
-- Name: pagos_parciales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.pagos_parciales_id_seq', 6, true);


--
-- Name: receta_medicamentos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.receta_medicamentos_id_seq', 2, true);


--
-- Name: recetas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.recetas_id_seq', 1, true);


--
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 9, true);


--
-- PostgreSQL database dump complete
--

\unrestrict 2ShItEDbByOroyDBN9oc8Ucw18Zz0rzVEr1PWaN4ckuY2VQDCjjGpGZuwhFW0sq

