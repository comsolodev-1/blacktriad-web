# BlackTriad Web

A React web application for the BlackTriad wardrobe management system.

## Tech Stack

- React 18
- Vite
- Axios
- React Router
- Vercel (deployment)

## Features

- Dark minimal UI
- JWT authentication with auto refresh
- Wardrobe management with category filters
- Outfit combo builder
- Wear log tracking
- Lookbook with photo upload
- Bin with restore and permanent delete
- Admin panel (ADMIN/MODERATOR only)

## Running Locally

```bash
# Clone the repo
git clone https://github.com/comsolodev-1/blacktriad-web.git

# Install dependencies
npm install

# Update API URL in src/api/axios.js to your local or Railway URL

# Run
npm run dev
```

## Environment

Update `src/api/axios.js` with your API base URL:

```js
const api = axios.create({
  baseURL: 'https://your-api-url/api/v1/',
})
```

## License

Copyright © 2026 Reyny Mxrk. All rights reserved.