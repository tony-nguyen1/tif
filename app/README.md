[![Node.js CI](https://github.com/tony-nguyen1/tif/actions/workflows/node.js.yml/badge.svg)](https://github.com/tony-nguyen1/tif/actions/workflows/node.js.yml)

# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

npm run db:push

curl -sSfL https://get.tur.so/install.sh | bash
turso auth signup
turso db shell your-database .dump > dump.sql
cat dump.sql | sqlite3 local.db


For a migration of the database's schema, the Drizzle ORM will write compare schema.ts and the effective schema of our DB. It will search the link to the DB in .env file. .env and .env.development is supposed to be the same, for npm or svelte. Drizzle want the default file to be name .env specifically. 
npm run db:push

https://www.chartjs.org/

eval "$(ssh-agent -s)"
ssh-add ...
mkcert localhost
npm install chart.js
touch local.db
touch .env
DATABASE_URL="file:local.db"
npm rundb:push
npm install lodash.isequal
npm i --save-dev @types/lodash.isequal

sudo lsof -i:3000 ## see a specific port such as 22
export DATABASE_URL="..."
export DATABASE_AUTH_TOKEN="..."
export NODE_ENV=production
export ORIGIN=http://127.0.0.1:3000
node build


files needed for deployement:
- build/
- node_modules
- env files & config files
- package.json

ab -n 2000 -c 50 nyx.nguyentony.fr:443/

git pull
npm run build
pm2 restart ...

rsync -az --progress -e ssh ~/pp/test ubuntu@217.182.205.165:~/target
