const newPhotographers = [
  {
    name: "Otto Crawford",
    availabilities: [
      {
        starts: "2020-11-25T08:00:00.000Z",
        ends: "2020-11-25T16:00:00.000Z"
      }
    ],
    bookings: [
      {
        starts: "2020-11-25T08:30:00.000Z",
        ends: "2020-11-25T09:30:00.000Z"
      }
    ],
  },
  {
    name: "Jens Mills",
    availabilities: [
      {
        starts: "2020-11-25T08:00:00.000Z",
        ends: "2020-11-25T09:00:00.000Z"
      },
      {
        starts: "2020-11-25T13:00:00.000Z",
        ends: "2020-11-25T16:00:00.000Z"
      }
    ],
    bookings: [
      {
        starts: "2020-11-25T15:00:00.000Z",
        ends: "2020-11-25T16:00:00.000Z"
      }
    ]
  }
]

const newPhotographersWithTimeSlots = [
  {
    photographer: {
      id: "6211ad66f53a474aa46610ef",
      name: "Otto Crawford"
    },
    timeSlot: {
      starts: "2020-11-25T09:30:00.000Z",
      ends: "2020-11-25T11:00:00.000Z"
    }
  },
  {
    photographer: {
      id: "6211ad66f53a474aa46610f2",
      name: "Jens Mills"
    },
    timeSlot: {
      starts: "2020-11-25T13:00:00.000Z",
      ends: "2020-11-25T14:30:00.000Z"
    }
  }
]

export {
  newPhotographers,
  newPhotographersWithTimeSlots
}
