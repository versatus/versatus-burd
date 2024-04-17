# Burd

Burd is a decentralized microblogging platform built on the Versatus' [LASR (Language Agnostic Stateless Rollup)](https://versatus.io/blog/introducing-versatus-lasr-the-worlds-first-stateless-rolllup), allowing users to tweet, like,  and manage their digital identity cryptographically. This project leverages `@versatus/versatus-javascript` to interact with [LASR](https://versatus.io/blog/introducing-versatus-lasr-the-worlds-first-stateless-rolllup), enabling secure and verifiable transactions for social interactions.

## Deploying BURD 
```bash
cd lasr
bun install
bunx lasrctl build burd.ts
bunx lasrctl test -b burd -i burd-inputs
bunx lasrctl deploy -b burd -a your-name -n burd -p "BURD" -s BURD --initializedSupply 100 -t 100 --txInputs '{"imgUrl":"https://pbs.twimg.com/media/GKuNIgAa4AALDce?format=jpg&name=medium","collection":"burd"}' --createTestFilePath burd-inputs/burd-create.json
```

## Starting Frontend
Take the returned program address from the deployment and update `NEXT_PUBLIC_BURD_PROGRAM_ADDRESS` in the `.env` file.
Add the address from the `lasr/.lasr/wallet/keypair.json` to the `NEXT_PUBLIC_BURD_OWNER_ADDRESS` variable to the `.env` file.
Add the deployer's secret key to the `BURD_OWNER_SECRET_KEY` variable in the `.env` file.

```bash
cd frontend
bun install
bun dev
```

## Features

- **Tweet**: Users can post tweets on their profile.
- **Like**: Users can like tweets, showing appreciation for content.
- **User Management**: Users can create a profile with a username, handle, and profile picture.
- **Tweet Management**: Users can delete their tweets.

## Usage

The `Burd` program enables several actions that can be performed on the blockchain:

- **Add User**: Create a new user profile on the blockchain.
- **Tweet**: Post a new tweet from your profile.
- **Like**: Like an existing tweet.
- **Delete Tweet**: Remove a tweet from your profile.

To interact with the program, use the provided methods through a command line interface or integrate them into your application.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project.
2. Create your Feature Branch.
3. Commit your Changes.
4. Push to the Branch.
5. Open a Pull Request.

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Project Link: [https://github.com/versatus/versatus-burd](https://github.com/versatus/versatus-burd)
