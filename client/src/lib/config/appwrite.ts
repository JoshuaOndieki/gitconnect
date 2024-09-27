import {Client, Account, Avatars, Databases, Storage, Functions} from "appwrite";
import env from "@/env";


const client = new Client();
client.setEndpoint(env.NEXT_PUBLIC_APPWRITE_HOST_URL).setProject(env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)

const databases = new Databases(client)
const account = new Account(client);
const avatars = new Avatars(client);
const storage = new Storage(client);
const functions = new Functions(client);


export { client, databases, account, avatars, storage, functions}
