#!/bin/bash
cd Frontend
npm install
npm run build
cd ..
sudo docker-compose build
sudo docker-compose up -d