import mongoose, { ConnectOptions } from 'mongoose'

const uri: string = `mongodb://localhost:27017/${process.env.MONGO_DB}`;
const options = {
  useNewUrlParser: true,
} as ConnectOptions;

mongoose
    .connect(uri, options)
    .catch((error) => {
        console.error('Connection error', error.message)
    })

export const db = mongoose.connection
