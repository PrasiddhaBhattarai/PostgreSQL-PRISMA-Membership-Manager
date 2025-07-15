import express from "express";
import { config } from "dotenv";
config();
import memberRoutes from "./routes/memberRoutes.js"
import membershipRoutes from "./routes/membershipRoutes.js"

const app = express();

app.use(express.json());

app.use("/api/member", memberRoutes);
app.use("/api/membership", membershipRoutes);

const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
});