//recv users info
//validate the required info
//send the info to out AI trip planner
//Calculate the budget per night
//Search MongoDb for suitable properties
//send both AI trip plan + matching properties back to the frontend / user
import { Property} from  "../Models/propertyModel";
import { planTrip } from "../ai/tripPlanner";

const cleanCity = (text)=>text.toLowerCase().replaceAll(" ","");
const createTripPlan = async(req,res)=>{
    try{
        const {destination,budget,days,people,interests}=req.body;
        if(!destination||!budget||!days||!people){
            return res.status(400).json({
                status:"fail",
                message:"Please fill in destination,days,budget and people"
            })
        }
        const plan  = await planTrip({
            destination,budget,days,people,interests : interests||[]
        });
        const perNight = Number(budget)/Number(days);
        const city =cleanCity(destination);
        const properties = await Property.find({
            $or:[
                {"adddress.city":city},
                {"adddress.state":city},
                {"address.area":city}
            ],
            price:{$lte:perNight},
            maximunGuest:{$gte:Number(people)},
        }).limit(6);

        
    }catch(error){

    }
}