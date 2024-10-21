@ECHO OFF
echo Dropping DB dev
mongo dev --eval "db.dropDatabase()"
for %%f in (seed\*.json) do (
  echo Seeding %%~nf from %%f in DB dev
  mongoimport --db=dev --collection=%%~nf --file=%%f --jsonArray
)
