import mongoose from 'mongoose';
const mongoURI = 'mongodb+srv://rex015:iDPU4rvt5HjtDrW1@sandbox.bcebozm.mongodb.net/?retryWrites=true&w=majority&appName=Sandbox';

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

// BetterReads mongoURI
// const mongoURI = 'mongodb+srv://rex015:iDPU4rvt5HjtDrW1@sandbox.bcebozm.mongodb.net/?retryWrites=true&w=majority&appName=Sandbox';
//
// mongoose.connect(mongoURI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
//     .then(() => console.log('Connected to MongoDB'))
//     .catch(err => console.error('MongoDB connection error:', err));

export default connectDB;