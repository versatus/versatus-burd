# Burd - LASR
Burd is a decentralized microblogging platform built on the Versatus' [LASR (Language Agnostic Stateless Rollup)](https://versatus.io/blog/introducing-versatus-lasr-the-worlds-first-stateless-rolllup), allowing users to churp, like,  and manage their digital identity cryptographically. This project leverages `@versatus/versatus-javascript` to interact with [LASR](https://versatus.io/blog/introducing-versatus-lasr-the-worlds-first-stateless-rollup), enabling secure and verifiable transactions for social interactions.

## Deploying BURD
```bash
cd lasr
bun install
bunx lasrctl build burd.ts
bunx lasrctl test -b burd -i burd-inputs
bunx lasrctl deploy -b burd -a your-name -n burd -p "BURD" -s BURD --initializedSupply 100 -t 100 --txInputs '{"imgUrl":"https://pbs.twimg.com/media/GKuNIgAa4AALDce?format=jpg&name=medium","collection":"burd"}' --createTestFilePath burd-inputs/burd-create.json
```
