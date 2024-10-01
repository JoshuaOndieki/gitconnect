# create-user-profile

## 🧰 Usage

### GET /ping

- Returns a "Pong" message.

**Response**

Sample `200` Response:

```text
Pong
```

### GET, POST, PUT, PATCH, DELETE /

- Returns a success JSON response.

**Response**

Sample `200` Response:

```json
{
  "success": true
}
```

## ⚙️ Configuration

| Setting           | Value          |
| ----------------- |----------------|
| Runtime           | Node (18.0)    |
| Entrypoint        | `dist/main.js` |
| Build Commands    | `npm install`  |
| Permissions       | `any`          |
| Timeout (Seconds) | 15             |

## 🔒 Environment Variables

No environment variables required.
