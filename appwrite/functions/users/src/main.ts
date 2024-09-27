import AppExpress from "@itznotabug/appexpress";
import userRoutes from "./routes.js";

export default async (context: any) => await app.attach(context)
const app = new AppExpress();
app.use("/users", userRoutes);

const getRoutes = (request: any, response: any) => {
  response.json({ routes: ["/", "/users", "/users/:userId", "/users/authenticated", "/users/profiles/:username"] });
};

app.get("/", getRoutes);
