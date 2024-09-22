# gitConnect
Next.js Social Network for Developers.
GitConnect allows developers to  create a developer profile/portfolio, share posts and get help from others developers

![gitconnect-logo-with-slogan.png](assets/gitconnect-logo-with-slogan.png)

## Project Resources
### Figma
[Link to Figma Designs](https://www.figma.com/design/1nkE9Ab7HLbtxJtSzWawnk/gitConnect?node-id=0-1&t=Eyfjd1ZZcxTkCgI0-1)
### Project Management
For the initial phase, the simple GitHub Project Management tool was used.
[gitConnect GitHub Project](https://github.com/users/JoshuaOndieki/projects/2)
### Documentation
Architecture diagrams, onboarding instructions, research and brainstorming docs are done using Notion.
[gitConnect Notion Docs](https://troubled-milk-3ff.notion.site/gitConnect-ea20192794c14730ab3d732db1030d03?pvs=4)

## Running Locally
### 1. Setup Appwrite
1. Install Appwrite locally on Docker. https://appwrite.io/docs/advanced/self-hosting
2. Go to http://localhost and signup.
3. Create a new project.
4. Create an API Key for making changes to your project.
5. Install Appwrite cli `npm i -g appwrite-cli`
6. `appwrite login --endpoint "http://localhost/v1"`
7. While inside the appwrite directory, run `appwrite push` to sync your local setup with this project's resources.

### 2. Setup & Run Nextjs app
1. Go to client directory
2. `npm i`
3. Create a `.env` based on the provided `.env.example`
4. Use the env variables for Appwrite from your local Appwrite account.
5. For the API Key, it's recommended to give only necessary permissions.
    Scopes like `functions.write` are not needed to run your nextjs app.
6. `npm run dev`
