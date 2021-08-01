import mongoose from 'mongoose'

export default function configDB(){
    mongoose.connect(process.env.DATABASE_URL!, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('database connected'))
    .catch((err) => console.log(err))
}