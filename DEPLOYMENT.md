# Deployment Guide - NeuroPilot AI Copilot

This guide outlines the steps to build, preview, and deploy the NeuroPilot AI Copilot application.

## Prerequisites

- **Node.js**: Version 18 or higher.
- **npm**: Version 9 or higher.

## 1. Environment Setup

Ensure you have a `.env` file in the root directory with the necessary environment variables. You can use `.env.example` as a template if available.

```bash
# Example .env content
VITE_API_URL=http://localhost:3000
```

## 2. Building for Production

To create a production-ready build, run the following command:

```bash
npm run build
```

This will generate a `dist` directory containing the optimized static assets (HTML, CSS, JS, images).

### Build Artifacts
- **`dist/index.html`**: The entry point for the application.
- **`dist/assets/`**: Contains compiled JavaScript and CSS files.
- **`dist/images/`**: Contains optimized image assets.

## 3. Previewing the Build

Before deploying, it is recommended to preview the production build locally to ensure everything works as expected:

```bash
npm run preview
```

This will start a local server (usually at `http://localhost:4173`) serving the content from the `dist` directory.

## 4. Deployment Options

### Option A: Vercel (Recommended)

1.  Install Vercel CLI: `npm i -g vercel`
2.  Run `vercel` in the project root.
3.  Follow the prompts to link the project and deploy.
4.  Set environment variables in the Vercel dashboard.

### Option B: Netlify

1.  Drag and drop the `dist` folder into the Netlify dashboard.
2.  Or connect your Git repository and set the build command to `npm run build` and publish directory to `dist`.

### Option C: Docker

1.  Build the Docker image:
    ```bash
    docker build -t neuropilot-app .
    ```
2.  Run the container:
    ```bash
    docker run -p 80:80 neuropilot-app
    ```

## Troubleshooting

-   **Blank Screen**: Check the console for JavaScript errors. Ensure all environment variables are correctly set.
-   **Missing Assets**: Verify that the `base` path in `vite.config.ts` matches your deployment subpath (if applicable).

## Support

For any issues, please contact the development team or refer to the project repository.
