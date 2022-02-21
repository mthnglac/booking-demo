# Booking calendar

## Setup
On both project, run this command
  * yarn start

## Endpoints
Get all photographers
  * GET `http://127.0.0.1:3000/photographers`
Get all photographers by duration
  * GET `http://127.0.0.1:3000/available-photographers?duration=90`
Create photographer
  * POST `http://127.0.0.1:3000/photographers`
  * You can write the body as in the task
Patch photographer
  * PATCH `http://127.0.0.1:3000/photographers/<id>`
Delete photographer
  * DELETE `http://127.0.0.1:3000/photographers/<id>`
