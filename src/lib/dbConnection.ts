import mongoose from "mongoose";


type connectionObject = {
  isConnected ? : number
}

const connection : connectionObject = {}

const databaseConnection  = async () : Promise<void> =>{


  if(connection.isConnected){
    console.log("Already connected to database")
    return 
  }

  try {
   const database = await mongoose.connect(process.env.MONGO_URI || "")

    connection.isConnected = database.connections[0].readyState

    console.log("Database is Connected")
  } catch (error) {
    console.log("Database Connection Failed", error);

    process.exit(1);
    
  }

}


export default databaseConnection;