# TransOptima

Sistema de **gestão de documentos de transportadoras**.  
- **V1**: CRUD básico de Transportadoras e Documentos, com status de validade (VÁLIDO / A VENCER / EXPIRADO).  
- **V2 (roadmap)**: envio de **e-mails automáticos** quando o documento estiver para vencer.

## Stack

- **Frontend**: Vite/React (porta `5173`)
- **Backend**: Node/Express (ou compatível) (porta `4000`)
- **Banco**: PostgreSQL (porta `5432`)
- **Orquestração**: Docker + Docker Compose

> Obs.: O backend lê as variáveis `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`, `JWT_SECRET`, `PORT` e `DAYS_A_VENCER`.

---

## Pré-requisitos

- [Docker](https://www.docker.com/)  
- [Docker Compose](https://docs.docker.com/compose/)

---

## Como rodar (DEV)

1. **Clone o repositório**
   ```bash
   git clone <URL_DO_REPO>
   cd transoptima
