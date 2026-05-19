# Cloud-Native Microservices DevOps Project

This repository implements the full-marks path for the Cloud Computing DevOps final project: a Dockerized e-commerce microservices demo with frontend dashboard, Git Flow collaboration, CI/CD, Jenkins, Kubernetes, Render deployment hooks, and submission documentation.

## Team

| Name | Roll Number | Role |
| --- | --- | --- |
| Hashir Sarwar | fa23-bcs-065 | Team Lead |
| Soban Rabbani | fa23-bcs-082 | User/Product Owner |
| Abdul Hadi | fa23-bcs-012 | Order/Notification Owner |

## Services

| Component | Port | Purpose |
| --- | ---: | --- |
| Frontend | 8080 locally | Static operations dashboard |
| User Service | 3001 | Users, login, profile |
| Product Service | 3002 | Catalog, inventory, search |
| Order Service | 3003 | Orders and status |
| Notification Service | 3004 | Confirmations and alerts |

## Public APIs

- `GET /health` on every service.
- User Service: `GET /users`, `POST /users`, `POST /auth/login`, `GET /profile`.
- Product Service: `GET /products`, `GET /products/:id`, `POST /products`.
- Order Service: `GET /orders`, `POST /orders`, `GET /orders/:id`, `GET /orders/:id/status`.
- Notification Service: `GET /notifications`, `POST /notifications/order-confirmation`.

## Local Run

```bash
npm install
npm run check
docker compose up --build
```

If Docker is not installed, run the Node-only local demo instead:

```bash
npm run dev:node
```

Open:

- Frontend: `http://localhost:8080`
- User health: `http://localhost:3001/health`
- Product health: `http://localhost:3002/health`
- Order health: `http://localhost:3003/health`
- Notification health: `http://localhost:3004/health`

## Git Flow

Use these branches:

- `develop` for integration.
- `release` for staging/QA.
- `main` or `production` for production.
- `feature/*` branches for each member contribution.

Each team member must push at least one commit from their own GitHub account and open a PR. See `docs/git-flow.md`.

## Docker

Build all images locally:

```bash
DOCKERHUB_USERNAME=your-dockerhub-username IMAGE_TAG=1.0.0 npm run docker:build
```

Images:

- `cloud-final-frontend`
- `cloud-final-user-service`
- `cloud-final-product-service`
- `cloud-final-order-service`
- `cloud-final-notification-service`

## CI/CD

GitHub Actions:

- `.github/workflows/ci.yml` runs linting, tests, and Docker build verification.
- `.github/workflows/docker-publish.yml` builds and pushes Docker Hub images.
- `.github/workflows/render-deploy.yml` triggers Render deployment hooks for development, staging, and production.

Jenkins:

- `Jenkinsfile` runs checkout, install, build, test, Docker build, push, Kubernetes deploy, notification, and rollback commands.

Required secrets:

- GitHub: `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`, `RENDER_DEPLOY_HOOK` per environment.
- Jenkins: `dockerhub-username`, `dockerhub-token`, and Kubernetes credentials.

## Kubernetes

Validate manifests:

```bash
npm run k8s:dry-run
```

Deploy development:

```bash
kubectl apply -k k8s/environments/development
kubectl get pods,svc,deploy -n cloud-final-development
```

Deploy staging:

```bash
kubectl apply -k k8s/environments/staging
kubectl get pods,svc,deploy -n cloud-final-staging
```

Deploy production:

```bash
kubectl apply -k k8s/environments/production
kubectl get pods,svc,deploy -n cloud-final-production
```

Rollback example:

```bash
kubectl rollout undo deployment/order-service -n cloud-final-production
```

## Render

Use `render/render.yaml` as a blueprint reference, or create three web services manually:

- development from `develop`
- staging from `release`
- production from `main` or `production`

Add each service's deploy hook to the matching GitHub Environment as `RENDER_DEPLOY_HOOK`.

## Screenshots

Use `docs/screenshot-checklist.md` as the exact proof checklist for the final PDF submission.

## Manual Human Work

Humans only need to handle accounts, secrets, approvals, PRs from their own identities, and screenshots. Everything else is already scaffolded for automation. See `docs/manual-human-tasks.md`.
