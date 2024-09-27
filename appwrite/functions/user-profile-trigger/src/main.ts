import {Client, Databases, ID, Query, Users} from 'node-appwrite';


export default async ({ req, res, log, error }: any) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT ?? '')
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID ?? '')
    .setKey(req.headers['x-appwrite-key'] ?? '');

  const users = new Users(client);
  const databases = new Databases(client)

  if(req.headers['x-appwrite-event'].includes('verification')) {
    try {
      log('updating lastVerificationEmailDate')
      const profile = (await databases.listDocuments(
          "gitconnect", "profiles",
          [Query.equal('userId', req.headers['x-appwrite-user-id'] ?? '')])).documents[0]
      if(profile) {
        await databases.updateDocument("gitconnect", "profiles", profile.$id, {
          lastVerificationEmailDate: new Date(),
        })
      } else {throw new Error("User does not have a profile.")}
    } catch(err: any) {
      error("Could not update last verification email sent date for user: " + req.headers['x-appwrite-user-id'] + " | Error: " + err.message);
    }
  } else {
    try {
      log('creating profile for new user: ', req.headers['x-appwrite-user-id'])
      const user = await users.get(req.headers['x-appwrite-user-id'])

      const nameMatch = user.email.match(/^([^@]*)@/);
      const username = nameMatch ? nameMatch[1] : 'user' + Date.now();

      const profileWithUsername = (await databases.listDocuments(
          "gitconnect", "profiles", [Query.equal("username", username)]
      )).documents[0]

      await databases.createDocument("gitconnect", "profiles", ID.unique(), {
        userId: user.$id,
        username: profileWithUsername ? username + Date.now() : username,
      })

      log('profile created successfully.')
    } catch(err: any) {
      error("Could not create profile for user: " + req.headers['x-appwrite-user-id'] + " | Error: " + err.message);
    }
  }

  if (req.path === "/ping") {
    return res.text("Pong");
  }

  return res.json({
    success: true,
  });
};
