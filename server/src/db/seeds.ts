import photographerService from '../services/photographer'

export default async function initialSeeder(): Promise<void> {
  const data = await photographerService.get()
  if (data.length !== 0) {
    // Data exists, no need to seed.
    return;
  }

  await photographerService.create(
    "Otto Crawford",
    [
      {
        starts: "2020-11-25T08:00:00.000Z",
        ends: "2020-11-25T16:00:00.000Z"
      }
    ],
    [
      {
        starts: "2020-11-25T08:30:00.000Z",
        ends: "2020-11-25T09:30:00.000Z"
      }
    ]
  )

  await photographerService.create(
    "Jens Mills",
    [
      {
        starts: "2020-11-25T08:00:00.000Z",
        ends: "2020-11-25T09:00:00.000Z"
      },
      {
        starts: "2020-11-25T13:00:00.000Z",
        ends: "2020-11-25T16:00:00.000Z"
      }
    ],
    [
      {
        starts: "2020-11-25T15:00:00.000Z",
        ends: "2020-11-25T16:00:00.000Z"
      }
    ]
  )
}
