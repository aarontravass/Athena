<div align="center">
<img src="https://github.com/user-attachments/assets/64d1df45-553a-4e51-a8e9-6ca8d6e2f0a5" >
</div>

<div align="center">

[![CI](https://github.com/aarontravass/Athena/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/aarontravass/Athena/actions/workflows/ci.yml)

</div>

<hr>
<br>

Data transparency and ownership are global challenges, with most patient health records controlled by providers. This centralization limits patient access and hinders data sharing across systems.

A distributed, reliable, and transparent storage system is needed to enhance data accessibility, security, and empower patients with greater control over their health records.

Athena is the modern EMR and EHR open source storage solution based on IPFS. Built on top of Filebase, it addresses problems with data ownership and transparency in the health sector. By leveraging blockchains, we can create a decentralized network that ensures data integrity and transparency, reducing the risk of data breaches and unauthorized access.

### Table of Contents

- [Features](#core-features)
- [Install](#install)
- [License](#license)

## Features

- **Distributed and scalable:** Built using GraphQL, Fastify and PostgreSQL, containerized via Docker and deployed on Vercel and Render.
- **Encryption in Transit:** All files are encrypted using AES-256.
- **Controlled sharing:** Share documents using signed links

## Install

Clone the repository

```sh
git clone https://github.com/aarontravass/Athena.git
```

Install dependencies

```sh
pnpm i
```

Generate prisma dist

```sh
lerna run --scope @athena/prisma generate
```

Run web, server and upload package

```sh
lerna run dev
```

## License

Licensed under [MIT](./LICENSE).
