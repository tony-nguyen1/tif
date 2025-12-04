#!/bin/bash
source ~/.nvm/nvm.sh
node -v
cat .env.production
pm2 start ecosystem.config.cjs
pm2 show nyx
