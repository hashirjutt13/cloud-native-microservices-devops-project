# Viva Preparation Guide

Project: **Cloud-Native Microservices DevOps Project**  
Repository: https://github.com/hashirjutt13/cloud-native-microservices-devops-project  
Team:

| Member | Roll Number | Main Area |
| --- | --- | --- |
| Hashir Sarwar | fa23-bcs-065 | Team Lead, dashboard, repository setup, CI/CD, final submission |
| Soban Rabbani | fa23-bcs-082 | User/Product contribution |
| Abdul Hadi | fa23-bcs-012 | Order/Notification contribution |

Use this document to prepare for viva. Everyone should understand the whole project, not only their own part.

---

## 1. The Project In One Minute

Our project is a **DevOps-focused cloud-native e-commerce platform demo**.

It has:

- A frontend dashboard.
- Four backend microservices:
  - User Service
  - Product Service
  - Order Service
  - Notification Service
- Dockerfiles for containerization.
- Docker Compose for local multi-container running.
- GitHub Actions for CI, Docker publishing, and Render deployment triggering.
- A Jenkinsfile for an enterprise-style CI/CD pipeline.
- Kubernetes manifests for deploying services into development, staging, and production environments.
- Git Flow branches and protected collaboration workflow.
- Monitoring and advanced deployment examples such as Prometheus/Grafana notes, canary deployment, blue-green deployment, HPA, and rollback.

The main purpose is **not to build a full production e-commerce website with a database**. The main purpose is to demonstrate:

- DevOps lifecycle
- Automation
- Containerization
- CI/CD
- Kubernetes orchestration
- GitHub collaboration
- Environment separation
- Deployment proof

---

## 2. Simple Explanation For Viva

If the teacher asks, “What is your project about?”, answer:

> Our project is a cloud-native DevOps demo for an e-commerce platform. We divided the application into multiple microservices: User, Product, Order, and Notification. Each service has REST APIs and a health endpoint. The services and frontend are containerized with Docker. We created CI/CD workflows using GitHub Actions and Jenkins. We also created Kubernetes manifests for deployment, service discovery, rolling updates, autoscaling, secrets, config maps, and environment separation. The project demonstrates how an enterprise team would automate build, test, containerization, and deployment.

Short version:

> It is an e-commerce microservices project mainly built to demonstrate DevOps practices: Docker, CI/CD, Jenkins, Kubernetes, Git Flow, GitHub Actions, Render deployment, and collaboration.

---

## 3. Architecture Overview

### Components

| Component | Type | Port | Purpose |
| --- | --- | ---: | --- |
| Frontend Dashboard | Static web app served by nginx | 8080 locally / 80 in container | Displays service status and service data |
| User Service | Node.js Express API | 3001 | Users, login, profile |
| Product Service | Node.js Express API | 3002 | Product catalog, inventory, search |
| Order Service | Node.js Express API | 3003 | Orders and order status |
| Notification Service | Node.js Express API | 3004 | Notifications and order confirmation messages |

### How They Connect

Local flow:

1. User opens frontend dashboard at `http://localhost:8080`.
2. Frontend calls each service health endpoint.
3. Frontend loads service data:
   - `/users`
   - `/products`
   - `/orders`
   - `/notifications`
4. Order Service can call Notification Service when a new order is created.

### Architecture Diagram

```text
Browser
  |
  v
Frontend Dashboard
  |
  |---> User Service         /users, /auth/login, /profile
  |
  |---> Product Service      /products, /products/:id
  |
  |---> Order Service        /orders, /orders/:id/status
            |
            v
       Notification Service  /notifications/order-confirmation
```

### Important Point

The services currently use **in-memory mock data**, not a database. This is acceptable because the project focus is DevOps automation, not database engineering.

If asked why no database:

> We used in-memory data because the assignment emphasis was DevOps: containerization, CI/CD, Kubernetes, branch workflow, and deployment automation. In a production version, we would add a database such as PostgreSQL or MongoDB and manage credentials with Kubernetes Secrets.

---

## 4. Folder Structure Explanation

Important folders:

```text
frontend/
services/
  user/
  product/
  order/
  notification/
.github/workflows/
k8s/
Jenkinsfile
docker-compose.yml
docs/
monitoring/
render/
```

What each folder/file means:

| Path | Purpose |
| --- | --- |
| `frontend/` | Static dashboard UI served by nginx |
| `services/user/` | User Service source, tests, Dockerfile |
| `services/product/` | Product Service source, tests, Dockerfile |
| `services/order/` | Order Service source, tests, Dockerfile |
| `services/notification/` | Notification Service source, tests, Dockerfile |
| `.github/workflows/ci.yml` | GitHub Actions CI for lint, tests, and Docker build verification |
| `.github/workflows/docker-publish.yml` | Builds and pushes Docker images to Docker Hub |
| `.github/workflows/render-deploy.yml` | Triggers Render deploy hooks |
| `Jenkinsfile` | Jenkins declarative pipeline |
| `docker-compose.yml` | Runs the whole app locally |
| `k8s/base/` | Base Kubernetes YAML files |
| `k8s/environments/` | Development, staging, production overlays |
| `k8s/advanced/` | Canary and blue-green examples |
| `monitoring/` | Prometheus/Grafana example configs |
| `docs/` | Submission, screenshots, guides, reflections |

---

## 5. Frontend Dashboard

Frontend files:

- `frontend/index.html`
- `frontend/assets/app.js`
- `frontend/assets/styles.css`
- `frontend/assets/env.js`
- `frontend/nginx.conf`
- `frontend/Dockerfile`

### What The Frontend Does

The dashboard has pages:

- Dashboard
- Users
- Products
- Orders
- Notifications

It also shows health cards for all services:

- User Service
- Product Service
- Order Service
- Notification Service

### How It Gets Service URLs

`frontend/assets/env.js` defines:

```js
window.APP_CONFIG = {
  userServiceUrl: "http://localhost:3001",
  productServiceUrl: "http://localhost:3002",
  orderServiceUrl: "http://localhost:3003",
  notificationServiceUrl: "http://localhost:3004"
};
```

In a deployed environment, these URLs can be changed through environment-specific configuration.

### Important Viva Answer

If asked, “Is the frontend dynamic?”

> Yes, it is a static frontend, but it dynamically fetches data from backend REST APIs using JavaScript. It is served through nginx in Docker.

---

## 6. User Service

Location:

```text
services/user/
```

Main file:

```text
services/user/src/app.js
```

Port:

```text
3001
```

APIs:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/health` | Service health check |
| GET | `/users` | Returns users |
| POST | `/users` | Creates a user |
| POST | `/auth/login` | Mock login, returns token |
| GET | `/profile` | Returns sample user profile |

### How Login Works

The login checks whether the email exists in the in-memory users array. If found, it returns a simple base64 token.

Important:

- It is a mock JWT-style token.
- It is not full production authentication.
- In production, we would use proper JWT signing with secret keys and password hashing.

Viva answer:

> The User Service handles user-related APIs such as listing users, creating users, mock login, and profile retrieval. It exposes `/health` for deployment health checks.

---

## 7. Product Service

Location:

```text
services/product/
```

Port:

```text
3002
```

APIs:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/health` | Service health check |
| GET | `/products` | Returns product catalog |
| GET | `/products?search=laptop` | Search/filter products |
| GET | `/products/:id` | Get one product |
| POST | `/products` | Add product |

### What It Stores

It stores a sample catalog:

- Wireless Keyboard
- USB-C Dock
- Developer Laptop

Viva answer:

> The Product Service manages product catalog APIs. It supports product listing, product lookup, product creation, and simple search through query parameters.

---

## 8. Order Service

Location:

```text
services/order/
```

Port:

```text
3003
```

APIs:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/health` | Service health check |
| GET | `/orders` | Returns orders |
| GET | `/orders/:id` | Returns one order |
| GET | `/orders/:id/status` | Returns order status |
| POST | `/orders` | Creates order |

### Service-to-Service Communication

When a new order is created, Order Service can call:

```text
Notification Service -> /notifications/order-confirmation
```

This shows microservice communication.

Important code idea:

```js
await notifyOrderCreated(order);
```

The notification call is wrapped in `try/catch`, so if Notification Service is unavailable, order creation still succeeds. This is a resilience decision.

Viva answer:

> The Order Service handles order creation and status tracking. It also demonstrates service-to-service communication by calling the Notification Service after an order is confirmed.

---

## 9. Notification Service

Location:

```text
services/notification/
```

Port:

```text
3004
```

APIs:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/health` | Service health check |
| GET | `/notifications` | Returns notifications |
| POST | `/notifications/order-confirmation` | Creates order confirmation notification |

Viva answer:

> The Notification Service handles event-based messages like order confirmation and inventory alerts. It receives notification requests from the Order Service.

---

## 10. Why Microservices?

Microservices means dividing one large application into smaller independent services.

Advantages:

- Each service can be developed separately.
- Each service can be deployed separately.
- Failures are isolated.
- Scaling can be done per service.
- Teams can own different services.

In our project:

- User Service handles users.
- Product Service handles catalog.
- Order Service handles orders.
- Notification Service handles messages.

If asked “Why not monolithic?”

> A monolithic app is simpler, but microservices better demonstrate cloud-native DevOps concepts such as separate containers, service discovery, independent scaling, rolling updates, and separate CI/CD stages.

---

## 11. REST API Concepts

REST APIs use HTTP methods:

| Method | Meaning |
| --- | --- |
| GET | Read data |
| POST | Create data |
| PUT/PATCH | Update data |
| DELETE | Delete data |

Our project mainly uses:

- `GET` for reading.
- `POST` for creating.

Common response codes:

| Code | Meaning |
| --- | --- |
| 200 | OK |
| 201 | Created |
| 400 | Bad request |
| 401 | Unauthorized |
| 404 | Not found |

Examples from project:

- `POST /users` returns `400` if name/email missing.
- `POST /auth/login` returns `401` if email not found.
- `GET /products/:id` returns `404` if product not found.

---

## 12. Health Checks

Every service has:

```text
GET /health
```

Purpose:

- CI/CD can verify service status.
- Docker/Kubernetes can check if container is alive.
- Frontend can display healthy/unhealthy cards.
- Kubernetes readiness/liveness probes use health endpoints.

Viva answer:

> Health checks help automation tools know whether a service is running correctly. Kubernetes uses them for readiness and liveness probes.

---

## 13. Docker Explanation

Docker packages an application and its dependencies into a container image.

In our project, every component has a Dockerfile:

- `frontend/Dockerfile`
- `services/user/Dockerfile`
- `services/product/Dockerfile`
- `services/order/Dockerfile`
- `services/notification/Dockerfile`

### Backend Dockerfile Logic

The backend services use:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY src ./src
ENV NODE_ENV=production
EXPOSE 3001
CMD ["npm", "start"]
```

Meaning:

- `FROM node:20-alpine`: Use lightweight Node image.
- `WORKDIR /app`: Work inside `/app`.
- `COPY package*.json ./`: Copy dependencies metadata.
- `RUN npm install --omit=dev`: Install production dependencies.
- `COPY src ./src`: Copy service code.
- `EXPOSE`: Document service port.
- `CMD`: Start app.

### Frontend Dockerfile Logic

Frontend uses nginx:

```dockerfile
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html /usr/share/nginx/html/index.html
COPY assets /usr/share/nginx/html/assets
EXPOSE 80
```

Meaning:

> The frontend is static HTML/CSS/JS, so nginx is enough to serve it.

### Docker Images

Docker Hub images:

- `hashirsarwar/cloud-final-frontend`
- `hashirsarwar/cloud-final-user-service`
- `hashirsarwar/cloud-final-product-service`
- `hashirsarwar/cloud-final-order-service`
- `hashirsarwar/cloud-final-notification-service`

Viva answer:

> Docker gives consistent runtime environments. The same image can run locally, in CI, or inside Kubernetes.

---

## 14. Docker Compose Explanation

File:

```text
docker-compose.yml
```

Docker Compose runs multiple containers together locally.

Our Compose services:

- `frontend`
- `user-service`
- `product-service`
- `order-service`
- `notification-service`

Run command:

```bash
docker compose up --build
```

Why Compose?

> It makes local testing easy because we can start the full microservice system with one command.

Important detail:

Order Service has:

```yaml
depends_on:
  - product-service
  - notification-service
```

This means Order Service depends on Product/Notification containers being started.

---

## 15. Git And Git Flow

Branches:

| Branch | Purpose |
| --- | --- |
| `main` | Production |
| `release` | Staging/QA |
| `develop` | Integration/development |
| `feature/*` | Individual member work |

Workflow:

1. Member creates feature branch from `develop`.
2. Member commits changes.
3. Member opens PR into `develop`.
4. CI runs.
5. Team lead reviews and merges.
6. `develop` is promoted to `release`.
7. `release` is promoted to `main`.

Why Git Flow?

> Git Flow separates development, staging, and production work. It also shows collaboration through feature branches and pull requests.

Branch protection:

> Branch protection prevents direct unsafe changes to important branches and enforces PR review/CI checks.

---

## 16. GitHub Actions CI

File:

```text
.github/workflows/ci.yml
```

Triggers:

- Pull request.
- Push to `develop`, `release`, `main`, `production`.

Jobs:

1. `lint-and-test`
2. `docker-build`

### Lint And Test Job

Steps:

1. Checkout code.
2. Setup Node.js 20.
3. Install dependencies.
4. Run lint.
5. Run tests.

Commands:

```bash
npm run lint
npm test
```

### Docker Build Verification Job

It builds Docker images for:

- frontend
- user-service
- product-service
- order-service
- notification-service

Purpose:

> This verifies Dockerfiles are valid before deployment.

Viva answer:

> CI means Continuous Integration. Our CI automatically checks code quality, tests, and Docker build validity whenever code is pushed or a PR is opened.

---

## 17. Docker Publish Workflow

File:

```text
.github/workflows/docker-publish.yml
```

Purpose:

> It builds and pushes Docker images to Docker Hub.

It uses a matrix:

```yaml
matrix:
  image:
    - frontend
    - user-service
    - product-service
    - order-service
    - notification-service
```

This avoids writing five separate jobs.

It uses secrets:

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`

Why secrets?

> Credentials should not be stored in code. GitHub Secrets keep tokens encrypted and inject them into workflows securely.

Image tagging:

The workflow uses Docker metadata action to tag images using:

- branch name
- commit SHA
- semantic version tag if available

Viva answer:

> The Docker Publish workflow automates image creation and registry upload, so deployment always uses reproducible container images.

---

## 18. Render Deploy Workflow

File:

```text
.github/workflows/render-deploy.yml
```

Purpose:

> It triggers Render deployments using Render deploy hooks.

Branch mapping:

| Branch | Environment |
| --- | --- |
| `develop` | development |
| `release` | staging |
| `main` / `production` | production |

It uses:

```text
RENDER_DEPLOY_HOOK
```

as an environment secret.

Viva answer:

> Render deploy hooks allow GitHub Actions to trigger deployment without exposing Render credentials in the repository.

---

## 19. Jenkins Pipeline

File:

```text
Jenkinsfile
```

Jenkins stages:

1. Checkout
2. Prepare Environment
3. Install
4. Build
5. Test
6. Docker Build
7. Push
8. Deploy
9. Notify
10. Rollback on failure

### Checkout

Gets code from Git repository.

### Prepare Environment

Determines:

- image tag
- Kubernetes namespace
- Kustomize directory

Branch mapping:

| Branch | Namespace | Kustomize Directory |
| --- | --- | --- |
| `main` / `production` | `cloud-final-production` | `k8s/environments/production` |
| `release` | `cloud-final-staging` | `k8s/environments/staging` |
| others | `cloud-final-development` | `k8s/environments/development` |

### Install

Runs:

```bash
npm install
```

### Build

Runs:

```bash
npm run lint
```

### Test

Runs:

```bash
npm test
```

### Docker Build

Builds five Docker images.

### Push

Logs into Docker Hub and pushes images.

### Deploy

Uses Kubernetes:

```bash
kubectl apply -k $KUSTOMIZE_DIR
kubectl set image deployment/...
kubectl rollout status deployment/...
```

### Rollback

If pipeline fails:

```bash
kubectl rollout undo deployment/...
```

Viva answer:

> Jenkins simulates an enterprise CI/CD pipeline. It builds, tests, creates Docker images, pushes them, deploys to Kubernetes, checks rollout status, and performs rollback commands if deployment fails.

---

## 20. GitHub Actions vs Jenkins

Possible question:

> Why did you use both GitHub Actions and Jenkins?

Answer:

> GitHub Actions is integrated with GitHub and is convenient for PR checks, Docker image publishing, and Render deployment hooks. Jenkins is included because the assignment specifically required a Jenkins declarative pipeline and it represents a traditional enterprise CI/CD tool. Both show automation, but Jenkins gives more explicit pipeline stages and enterprise deployment control.

Comparison:

| Feature | GitHub Actions | Jenkins |
| --- | --- | --- |
| Hosted in GitHub | Yes | Usually external |
| Easy PR checks | Very easy | Needs setup |
| Enterprise customization | Good | Very strong |
| Plugin ecosystem | GitHub marketplace | Jenkins plugins |
| Used in our project for | CI, Docker publish, Render deploy | Build-test-push-Kubernetes deploy pipeline |

---

## 21. Kubernetes Explanation

Kubernetes is used to orchestrate containers.

Our Kubernetes files are in:

```text
k8s/
```

### Important Kubernetes Resources

| Resource | Purpose |
| --- | --- |
| Namespace | Separates environments |
| Deployment | Runs and manages pods |
| Service | Provides stable networking to pods |
| Ingress | Routes external HTTP traffic |
| ConfigMap | Stores non-secret configuration |
| Secret | Stores sensitive configuration template |
| RBAC | Controls permissions |
| NetworkPolicy | Controls pod network access |
| HPA | Autoscaling |

---

## 22. Kubernetes Deployment

Each service has a Deployment:

- `frontend-deployment.yaml`
- `user-deployment.yaml`
- `product-deployment.yaml`
- `order-deployment.yaml`
- `notification-deployment.yaml`

Deployment purpose:

> It tells Kubernetes how many replicas to run, which Docker image to use, what ports to expose, and how to perform health checks.

Example concepts:

- `replicas: 2`
- `RollingUpdate`
- `readinessProbe`
- `livenessProbe`
- resource requests/limits

### Readiness Probe

Checks whether pod is ready to receive traffic.

### Liveness Probe

Checks whether pod is alive. If it fails, Kubernetes can restart pod.

Viva answer:

> Readiness decides traffic routing; liveness decides restart behavior.

---

## 23. Kubernetes Service

File:

```text
k8s/base/services.yaml
```

Service purpose:

> Kubernetes pods are temporary and their IPs can change. A Service gives a stable DNS name and IP for accessing pods.

Examples:

- `user-service`
- `product-service`
- `order-service`
- `notification-service`
- `frontend`

Inside Kubernetes, services can communicate using names like:

```text
http://notification-service:3004
```

---

## 24. ConfigMap And Secret

ConfigMap:

```text
k8s/base/configmap.yaml
```

Stores non-sensitive values:

- `NODE_ENV`
- service URLs

Secret template:

```text
k8s/base/secret-template.yaml
```

Stores sensitive placeholders:

- `JWT_SECRET`
- `SMTP_API_KEY`

Important:

> Real secret values should be managed through GitHub Environments, Render environment variables, or Kubernetes Secrets, not committed as plain text.

---

## 25. Namespaces And Environments

Environment overlays:

```text
k8s/environments/development
k8s/environments/staging
k8s/environments/production
```

Namespaces:

| Environment | Namespace |
| --- | --- |
| Development | `cloud-final-development` |
| Staging | `cloud-final-staging` |
| Production | `cloud-final-production` |

Why separate environments?

> To prevent development/testing changes from directly affecting production.

---

## 26. Kustomize

Kustomize lets us reuse base Kubernetes YAML and apply environment-specific patches.

Base:

```text
k8s/base/
```

Overlays:

```text
k8s/environments/development/
k8s/environments/staging/
k8s/environments/production/
```

Example:

- Development uses `NODE_ENV=development`.
- Staging uses `NODE_ENV=staging`.
- Production uses `NODE_ENV=production` and more replicas.

Viva answer:

> Kustomize avoids duplicating full YAML files for every environment. We keep common configuration in base and environment-specific changes in overlays.

---

## 27. Rolling Updates

In Kubernetes deployment YAML:

```yaml
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxUnavailable: 0
    maxSurge: 1
```

Meaning:

- Kubernetes updates pods gradually.
- `maxUnavailable: 0` means no downtime during update.
- `maxSurge: 1` allows one extra pod temporarily during deployment.

Viva answer:

> Rolling updates allow us to deploy a new version without shutting down the whole service.

---

## 28. Autoscaling / HPA

File:

```text
k8s/base/hpa.yaml
```

HPA means Horizontal Pod Autoscaler.

It scales pods based on CPU utilization.

Example:

- Minimum replicas: 2
- Maximum replicas: 5
- Target CPU: 70%

Viva answer:

> HPA automatically increases or decreases pod replicas based on resource usage, improving scalability.

---

## 29. RBAC

File:

```text
k8s/base/rbac.yaml
```

RBAC means Role-Based Access Control.

It defines:

- ServiceAccount
- Role
- RoleBinding

Purpose:

> To limit what deployment automation can do inside Kubernetes.

Viva answer:

> RBAC improves security by granting only necessary permissions instead of full cluster access.

---

## 30. NetworkPolicy

File:

```text
k8s/base/network-policy.yaml
```

Purpose:

> Controls which pods can communicate with each other.

Viva answer:

> NetworkPolicy improves security by limiting network traffic between pods.

---

## 31. Advanced Deployment Features

### Canary Deployment

File:

```text
k8s/advanced/canary-order-service.yaml
```

Canary deployment means releasing a new version to a small percentage of users first.

Why?

> To reduce risk. If canary version fails, only a small part of traffic is affected.

### Blue-Green Deployment

File:

```text
k8s/advanced/blue-green-frontend.yaml
```

Blue-green means keeping two versions:

- Blue: current stable version.
- Green: new version.

Switch traffic after green is verified.

Why?

> It allows quick rollback by switching traffic back to the old version.

---

## 32. Monitoring

Files:

```text
monitoring/prometheus-config.yaml
monitoring/grafana-dashboard-config.yaml
```

Prometheus:

> Collects metrics from services.

Grafana:

> Visualizes metrics through dashboards.

In our project:

- Monitoring files are example configs.
- They show how service health and resource usage could be tracked.

Viva answer:

> Monitoring is important because after deployment we need visibility into service health, CPU/memory, failures, and availability.

---

## 33. Testing

Each service has tests in:

```text
services/*/test/
```

Testing framework:

```text
Node.js built-in test runner
```

Examples:

- User login returns token.
- Products list returns catalog.
- Product search filters correctly.
- Order creation returns confirmed status.
- Notification creation works.

Run all tests:

```bash
npm test
```

Run full check:

```bash
npm run check
```

What `npm run check` does:

1. Lint/checks syntax.
2. Validates Kubernetes YAML basic structure.
3. Runs all tests.

Viva answer:

> Tests ensure APIs behave as expected before Docker image build or deployment. CI automatically runs tests on pushes and PRs.

---

## 34. Security Practices In Project

Security items included:

- GitHub Secrets for Docker Hub token.
- GitHub Environment secrets for Render deploy hook.
- Kubernetes Secret template.
- RBAC manifests.
- NetworkPolicy.
- Branch protection.
- Production environment approval.

If asked “Where are secrets stored?”

> Secrets are not committed in code. Docker credentials are stored in GitHub repository secrets. Render deploy hook is stored in GitHub Environment secrets. Kubernetes secret YAML is only a template and real values should be injected securely.

If asked “Did you expose Docker token?”

> In a real project, we must rotate any token that has been shared and keep it only in secret managers. The repository itself does not contain the token.

---

## 35. Render Deployment

Render is used as a cloud deployment target through deploy hooks.

File:

```text
render/render.yaml
```

Workflow:

1. Push to branch.
2. GitHub Actions runs.
3. Render deploy workflow triggers deploy hook.
4. Render rebuilds/redeploys service.

Branch mapping:

- `develop` -> development
- `release` -> staging
- `main` -> production

Viva answer:

> Render gives us public environment URLs, while GitHub Actions automates triggering deployment through secure deploy hooks.

---

## 36. Member-Wise Viva Preparation

### Hashir Sarwar — Team Lead

Must know:

- Overall architecture.
- GitHub repo setup.
- Git Flow branches.
- GitHub Actions workflows.
- Docker Hub publishing.
- GitHub Environments.
- Production approval.
- Jenkins pipeline.
- Submission screenshots.

Possible answer:

> As team lead, I created and managed the repository, branches, environments, secrets, CI/CD workflows, Docker publishing, Render deployment hooks, branch protection, and final documentation. I also verified successful GitHub Actions and Docker Hub image publishing.

### Soban Rabbani — User/Product Owner

Must know:

- User Service APIs.
- Product Service APIs.
- How frontend displays user/product data.
- His PR/commit.
- How tests validate user/product service.

Possible answer:

> My contribution was in the User/Product area. The User Service handles users, login, and profiles. The Product Service handles product listing, search, product detail, and product creation. These services expose REST APIs and health checks for monitoring and deployment verification.

### Abdul Hadi — Order/Notification Owner

Must know:

- Order Service APIs.
- Notification Service APIs.
- Service-to-service call from Order to Notification.
- His PR/commit.
- Kubernetes/Jenkins basic flow if asked.

Possible answer:

> My contribution was in the Order/Notification area. The Order Service manages order creation and status. When an order is created, it can notify the Notification Service, which creates an order confirmation message. This demonstrates communication between microservices.

---

## 37. Demo Commands To Remember

Install:

```bash
npm install
```

Run full check:

```bash
npm run check
```

Run locally without Docker:

```bash
npm run dev:node
```

Run with Docker:

```bash
docker compose up --build
```

Open frontend:

```text
http://localhost:8080
```

Health endpoints:

```text
http://localhost:3001/health
http://localhost:3002/health
http://localhost:3003/health
http://localhost:3004/health
```

Kubernetes dry run:

```bash
npm run k8s:dry-run
```

Kubernetes deploy:

```bash
kubectl apply -k k8s/environments/development
```

Rollback:

```bash
kubectl rollout undo deployment/order-service -n cloud-final-production
```

---

## 38. Common Viva Questions And Model Answers

### Q1. What problem does your project solve?

It demonstrates automated deployment of a cloud-native e-commerce platform using DevOps practices. It solves the problem of manually building, testing, containerizing, and deploying multiple services by automating the process with CI/CD pipelines.

### Q2. Why did you choose microservices?

Because microservices allow independent development, testing, deployment, scaling, and failure isolation. They also match cloud-native architecture and help demonstrate Docker and Kubernetes orchestration.

### Q3. What services did you implement?

Frontend, User Service, Product Service, Order Service, and Notification Service.

### Q4. What is the role of the frontend?

The frontend dashboard displays service health and service data from all microservices. It is a static HTML/CSS/JS app served by nginx.

### Q5. What is the role of the User Service?

It handles user-related APIs such as listing users, creating users, mock login, and profile retrieval.

### Q6. What is the role of the Product Service?

It manages product catalog APIs including product list, product detail, product creation, and search.

### Q7. What is the role of the Order Service?

It handles order creation, order listing, and order status. It also calls the Notification Service when an order is created.

### Q8. What is the role of the Notification Service?

It stores and creates notifications such as order confirmations and inventory alerts.

### Q9. Do you use a database?

No, this demo uses in-memory mock data because the assignment focuses on DevOps automation. A production version would use PostgreSQL, MongoDB, or another database.

### Q10. What is Docker?

Docker is a containerization platform that packages an application and its dependencies into a portable image.

### Q11. Why use Docker?

It ensures the application runs consistently across local machines, CI/CD, and cloud/Kubernetes environments.

### Q12. What is Docker Compose?

Docker Compose runs multiple containers together using one YAML file. We use it to run frontend and all four services locally.

### Q13. What is CI?

Continuous Integration automatically checks code after pushes or PRs. In our project, CI runs linting, tests, and Docker build verification.

### Q14. What is CD?

Continuous Deployment/Delivery automates deployment after code passes checks. In our project, Docker images are pushed and Render/Kubernetes deployment artifacts are prepared.

### Q15. What is Jenkins used for?

Jenkins is used for an enterprise-style pipeline: checkout, install, lint, test, Docker build, push, Kubernetes deploy, notify, and rollback.

### Q16. What is GitHub Actions used for?

GitHub Actions runs CI, Docker image publishing, and Render deploy hook workflows.

### Q17. Difference between Jenkins and GitHub Actions?

GitHub Actions is tightly integrated with GitHub and easier for PR checks. Jenkins is an external CI/CD server with strong enterprise customization and plugin support.

### Q18. What is Kubernetes?

Kubernetes is a container orchestration platform that manages container deployment, scaling, service discovery, rolling updates, and recovery.

### Q19. What is a Kubernetes Deployment?

A Deployment manages replicas of pods and controls rolling updates and rollbacks.

### Q20. What is a Kubernetes Service?

A Service gives stable networking and DNS for pods whose IP addresses can change.

### Q21. What is a ConfigMap?

A ConfigMap stores non-sensitive configuration such as environment names and service URLs.

### Q22. What is a Secret?

A Secret stores sensitive values such as tokens, passwords, or API keys.

### Q23. What is RBAC?

Role-Based Access Control defines what users or service accounts are allowed to do in Kubernetes.

### Q24. What is NetworkPolicy?

NetworkPolicy controls traffic between pods to improve security.

### Q25. What is HPA?

Horizontal Pod Autoscaler automatically scales pod replicas based on CPU or other metrics.

### Q26. What is rolling update?

Rolling update gradually replaces old pods with new pods to avoid downtime.

### Q27. What is rollback?

Rollback reverts a deployment to the previous stable version if a new deployment fails.

### Q28. What is canary deployment?

Canary deployment releases a new version to a small portion of users first to reduce risk.

### Q29. What is blue-green deployment?

Blue-green deployment keeps two environments or versions. Traffic switches from old stable version to new version after validation.

### Q30. How did you manage secrets?

Docker credentials are stored in GitHub repository secrets. Render deploy hook is stored in GitHub Environment secrets. Kubernetes Secret file is a template, not real secret storage.

### Q31. Why did you use Git Flow?

Git Flow separates development, staging, and production work. It supports collaboration through feature branches and PRs.

### Q32. What is branch protection?

Branch protection prevents direct unsafe changes to important branches and can require pull requests, reviews, and passing CI checks.

### Q33. What is a pull request?

A pull request is a request to merge one branch into another. It allows review, discussion, and automated checks before merging.

### Q34. What is the difference between development, staging, and production?

Development is for active integration, staging is for QA/testing before release, and production is the live stable environment.

### Q35. How does the frontend know if services are healthy?

It calls each service’s `/health` endpoint and displays healthy/unavailable cards.

### Q36. What happens when an order is created?

Order Service validates `userId` and `productId`, creates an order with confirmed status, and tries to send an order confirmation to Notification Service.

### Q37. Why does Order Service not fail if Notification Service fails?

Because notification failure should not block core order creation in this demo. This improves resilience.

### Q38. What tests did you add?

Tests validate service health, user login, product listing/search, order creation/status, and notification creation.

### Q39. How are Docker images published?

GitHub Actions logs into Docker Hub using secrets, builds each image, tags it, and pushes it to Docker Hub.

### Q40. What would you improve in future?

Add a real database, real JWT authentication, API gateway, centralized logging, real Prometheus metrics, full Render/Kubernetes live deployment, and stronger integration tests.

---

## 39. Tricky Viva Questions

### Q1. Is this a real production application?

Answer:

> It is a production-style DevOps demo, not a full production business application. The infrastructure and automation patterns are realistic, but the service data is mock/in-memory for simplicity.

### Q2. Why are you using both Render and Kubernetes?

Answer:

> Render provides accessible public deployment URLs and simple deploy hooks. Kubernetes manifests demonstrate enterprise orchestration requirements from the assignment. Both show different deployment targets.

### Q3. If Kubernetes is used, why also use Docker Compose?

Answer:

> Docker Compose is for local development and quick testing. Kubernetes is for cloud-style orchestration and production-like deployment.

### Q4. If GitHub Actions does CI/CD, why Jenkins?

Answer:

> GitHub Actions is used for repository-native automation. Jenkins is included because the assignment required a Jenkins pipeline and it demonstrates enterprise pipeline stages.

### Q5. Where is zero downtime implemented?

Answer:

> In Kubernetes rolling update strategy with `maxUnavailable: 0` and `maxSurge: 1`, plus readiness probes to avoid routing traffic to pods before they are ready.

### Q6. Are secrets safe?

Answer:

> The repository does not store real secrets. Secrets are configured in GitHub Secrets and GitHub Environments. If any token is shared outside a secret manager, it should be rotated.

### Q7. What happens if a Docker build fails?

Answer:

> CI/CD stops at the failed step, image is not published, and deployment does not continue. This prevents broken code from reaching production.

### Q8. What happens if Kubernetes deployment fails?

Answer:

> Jenkins post-failure block attempts rollback using `kubectl rollout undo` for the deployments.

### Q9. Did every member contribute?

Answer:

> Yes. The repository uses feature branches and PRs. Each member contributed from their own GitHub account and screenshots/PRs prove collaboration.

### Q10. What is the biggest limitation?

Answer:

> The biggest limitation is that services use in-memory data instead of a database. However, this was intentional to focus on DevOps requirements.

---

## 40. How Each Member Should Speak In Viva

### Hashir: 30-Second Intro

> I was the team lead. I managed the GitHub repository, branches, environments, branch protection, secrets, Docker Hub publishing, Render deploy hooks, CI/CD workflows, Jenkins pipeline, screenshots, and final submission. I can explain the full DevOps flow from code commit to CI checks, Docker image publishing, and deployment.

### Soban: 30-Second Intro

> I worked on the User/Product side. The User Service provides user, login, and profile APIs. The Product Service provides product catalog, detail, creation, and search APIs. I also made my contribution through a feature branch and PR into develop.

### Abdul Hadi: 30-Second Intro

> I worked on the Order/Notification side. The Order Service handles orders and order status, and it calls Notification Service for order confirmation. The Notification Service stores and creates notifications. I also made my contribution through a feature branch and PR into develop.

---

## 41. Complete End-To-End Flow

If asked “Explain the complete pipeline,” answer:

1. Developer creates a feature branch from `develop`.
2. Developer makes changes and opens PR.
3. GitHub Actions CI runs lint, tests, and Docker build verification.
4. After review, PR is merged into `develop`.
5. Docker Publish workflow builds and pushes images to Docker Hub.
6. Render Deploy workflow triggers development deployment.
7. Code is promoted to `release` for staging.
8. Code is promoted to `main` for production.
9. Production deployment requires approval.
10. Jenkinsfile also defines enterprise CI/CD stages for Kubernetes deployment.

---

## 42. What To Memorize

Everyone must memorize:

- Project is a DevOps-focused e-commerce microservices demo.
- Services: User, Product, Order, Notification, Frontend.
- Main tools: Docker, Docker Compose, GitHub Actions, Jenkins, Kubernetes, Render.
- Branches: `develop`, `release`, `main`, `feature/*`.
- CI runs lint, tests, Docker build.
- Docker Publish pushes images to Docker Hub.
- Render Deploy triggers deployment hooks.
- Jenkins pipeline does checkout, install, lint, test, Docker build, push, deploy, rollback.
- Kubernetes resources: Deployment, Service, Ingress, ConfigMap, Secret, RBAC, NetworkPolicy, HPA.
- Data is mock/in-memory because DevOps is the focus.

---

## 43. Final Viva Strategy

1. Do not pretend it is a full production e-commerce app.
2. Emphasize DevOps automation and cloud-native practices.
3. If you do not know an exact file, explain the concept clearly.
4. When asked about your own part, answer deeply.
5. When asked about another member’s part, answer at least the basics.
6. Use these phrases:
   - “The focus was DevOps automation.”
   - “Each service is containerized independently.”
   - “GitHub Actions validates and publishes.”
   - “Jenkins provides enterprise pipeline stages.”
   - “Kubernetes handles orchestration, scaling, and rolling updates.”
   - “Secrets are stored outside the repository.”
   - “Feature branches and PRs prove collaboration.”

---

## 44. Five Best Answers To Sound Confident

### Best Answer 1: Project Purpose

> This project demonstrates how a cloud-native application can be built, tested, containerized, and deployed using DevOps automation. The e-commerce domain gives us realistic services, but the main focus is CI/CD, Docker, Kubernetes, and collaboration.

### Best Answer 2: Architecture

> We used a microservices architecture with separate User, Product, Order, and Notification services plus a frontend dashboard. Each service has its own API, Dockerfile, tests, and Kubernetes deployment manifest.

### Best Answer 3: CI/CD

> Our CI/CD starts when code is pushed or a PR is opened. GitHub Actions runs linting, tests, and Docker build verification. Another workflow builds and pushes Docker images to Docker Hub. Render deployment hooks are triggered according to branch environment.

### Best Answer 4: Kubernetes

> Kubernetes is used for production-style orchestration. Our manifests include Deployments, Services, ConfigMaps, Secrets, RBAC, NetworkPolicy, Ingress, HPA, rolling updates, and environment overlays.

### Best Answer 5: Limitations

> The application uses mock in-memory data, so it is not a full business backend. But that design kept the application simple while allowing us to focus on the DevOps lifecycle required in the assignment.

