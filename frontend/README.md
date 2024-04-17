# Burd - LASR

## Starting Frontend
Take the returned program address from the deployment and update `NEXT_PUBLIC_BURD_PROGRAM_ADDRESS` in the `.env` file.
Add the address from the `lasr/.lasr/wallet/keypair.json` to the `NEXT_PUBLIC_BURD_OWNER_ADDRESS` variable to the `.env` file.
Add the deployer's secret key to the `BURD_OWNER_SECRET_KEY` variable in the `.env` file.

```bash
cd frontend
bun install
bun dev
```
