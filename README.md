# clone-tabnews

This is going to be my website: [https://tutunauta.com.br](https://tutunauta.com.br)

alternative domain: [https://clone-tabnews-rust-three.vercel.app/](https://clone-tabnews-rust-three.vercel.app/)

It's a clone of tabnews.com.br.

### Build and dev useful commands:

#### Manually connect to local postgres DB

```
sudo apt update
sudo apt install postgresql-client
psql postgres://postgres:local_password@localhost:5432/local_db
```

### Running with VS Code Dev Container

A ready-to-use dev container configuration was added in `.devcontainer/devcontainer.json`.

1. Open this repository in VS Code.
2. Run `Dev Containers: Reopen in Container`.
3. After setup finishes, run `npm run dev`.

The container mounts this project at:

`/home/arthurpc02/Workspaces/Repos/clone-tabnews-devcontainer`

This matches your requested workspace path and avoids installing Node.js/npm locally.
