import AppExpress from "@itznotabug/appexpress";
import postRoutes from "./routes.js";

export default async (context: any) => await app.attach(context)
const app = new AppExpress();
app.use("/posts", postRoutes);

const getRoutes = (request: any, response: any) => {
  response.json({ routes: ["/", "/posts", "/posts/:postId"] });
};

app.get("/", getRoutes);
