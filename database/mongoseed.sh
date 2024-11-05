#!/usr/bin/env bash

seed_db="${MONGO_DB:-dev}"
echo Dropping DB "$seed_db"
mongo "$seed_db" --eval "db.dropDatabase()"
for file in "$(dirname "$BASH_SOURCE")"/seed/*.json; do
  if [[ -f "$file" ]]; then
    echo Seeding "$(basename "$file" ".json")" from "$file" in DB "$seed_db"
    mongoimport --db="$seed_db" --collection="$(basename "$file" ".json")" --file="$file" --jsonArray
  fi
done
