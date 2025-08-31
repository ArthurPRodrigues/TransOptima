-- Criação de tabelas
CREATE TABLE IF NOT EXISTS users (
id SERIAL PRIMARY KEY,
username VARCHAR(50) UNIQUE NOT NULL,
password_hash VARCHAR(255) NOT NULL
);


CREATE TABLE IF NOT EXISTS transportadoras (
id SERIAL PRIMARY KEY,
razao_social VARCHAR(150) NOT NULL,
cnpj VARCHAR(18) NOT NULL,
uf CHAR(2) NOT NULL,
quimicos_controlados BOOLEAN NOT NULL DEFAULT false,
disponivel_para_frete BOOLEAN NOT NULL DEFAULT false,
created_at TIMESTAMP NOT NULL DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS tipos_documento (
id SERIAL PRIMARY KEY,
nome VARCHAR(120) NOT NULL,
obrigatorio_controlados BOOLEAN NOT NULL DEFAULT false,
obrigatorio_nao_controlados BOOLEAN NOT NULL DEFAULT false,
ativo BOOLEAN NOT NULL DEFAULT true
);


CREATE TABLE IF NOT EXISTS documentos (
id SERIAL PRIMARY KEY,
transportadora_id INT NOT NULL REFERENCES transportadoras(id) ON DELETE CASCADE,
tipo_documento_id INT NOT NULL REFERENCES tipos_documento(id) ON DELETE CASCADE,
data_cadastro TIMESTAMP NOT NULL DEFAULT NOW(),
data_vencimento DATE NOT NULL,
arquivo_url TEXT
);


-- Usuário mock (senha simples para MVP)
INSERT INTO users (username, password_hash)
VALUES ('admin', 'admin123')
ON CONFLICT (username) DO NOTHING;


-- Seeds de transportadoras
INSERT INTO transportadoras (razao_social, cnpj, uf, quimicos_controlados, disponivel_para_frete)
VALUES
('Trans Silva LTDA', '12.345.678/0001-90', 'SC', false, false),
('Logística Norte SA', '98.765.432/0001-10', 'PR', true, false),
('Rodas Rápidas ME', '11.222.333/0001-44', 'SP', false, false)
ON CONFLICT DO NOTHING;


-- Seeds de tipos de documento
INSERT INTO tipos_documento (nome, obrigatorio_controlados, obrigatorio_nao_controlados, ativo)
VALUES
('ANTT', true, true, true),
('Licença Ambiental', true, false, true),
('Certidão Negativa', true, true, true)
ON CONFLICT DO NOTHING;


-- Seeds de documentos (vencido, a vencer, válido)
-- Hoje será avaliado pelo backend; aqui usamos datas relativas aproximadas
INSERT INTO documentos (transportadora_id, tipo_documento_id, data_vencimento, arquivo_url)
VALUES
-- Trans Silva (não controlada): tem ANTT válida + Certidão a vencer
(1, 1, CURRENT_DATE + INTERVAL '10 day', '/uploads/antt_silva.pdf'),
(1, 3, CURRENT_DATE + INTERVAL '5 day', '/uploads/cnd_silva.pdf'),


-- Logística Norte (controlada): ANTT válida, Licença Ambiental vencida
(2, 1, CURRENT_DATE + INTERVAL '60 day', '/uploads/antt_norte.pdf'),
(2, 2, CURRENT_DATE - INTERVAL '2 day', '/uploads/licenca_norte.pdf'),
(2, 3, CURRENT_DATE + INTERVAL '30 day', '/uploads/cnd_norte.pdf'),


-- Rodas Rápidas (não controlada): ANTT vencida, sem Certidão
(3, 1, CURRENT_DATE - INTERVAL '1 day', '/uploads/antt_rodas.pdf');