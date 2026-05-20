# Viva Last-Minute Cheat Sheet

Read this 10 minutes before viva.

## Project In One Line

Our project is a **DevOps-focused cloud-native e-commerce microservices demo** with Docker, GitHub Actions, Jenkins, Kubernetes, Render deployment hooks, Git Flow, and documentation.

## Services

| Service | Port | What It Does |
| --- | ---: | --- |
| Frontend | 8080 locally | Dashboard showing service health/data |
| User Service | 3001 | Users, login, profile |
| Product Service | 3002 | Product catalog, search, inventory |
| Order Service | 3003 | Orders and order status |
| Notification Service | 3004 | Order confirmations and alerts |

## Most Important Sentence

> The main focus of this project is DevOps automation, not a full e-commerce business application. We used lightweight mock services so we could demonstrate CI/CD, Docker, Kubernetes, Jenkins, GitHub Actions, and collaboration clearly.

## Team Responsibilities

- Hashir: team lead, GitHub repo, branches, CI/CD, Docker Hub, Render hooks, documentation, screenshots.
- Soban: User/Product contribution and PR.
- Abdul Hadi: Order/Notification contribution and PR.

## CI/CD Flow

1. Member pushes code / opens PR.
2. GitHub Actions CI runs lint, tests, Docker build verification.
3. Docker Publish workflow builds and pushes images to Docker Hub.
4. Render Deploy workflow triggers deploy hooks.
5. Jenkinsfile defines enterprise pipeline: checkout, install, lint, test, Docker build, push, Kubernetes deploy, rollback.

## Git Flow

- `develop`: integration/development
- `release`: staging/QA
- `main`: production
- `feature/*`: member branches

## Docker

Docker makes each service portable and consistent.

Images:

- `hashirsarwar/cloud-final-frontend`
- `hashirsarwar/cloud-final-user-service`
- `hashirsarwar/cloud-final-product-service`
- `hashirsarwar/cloud-final-order-service`
- `hashirsarwar/cloud-final-notification-service`

## Kubernetes

Resources included:

- Deployment
- Service
- Ingress
- ConfigMap
- Secret template
- RBAC
- NetworkPolicy
- HPA
- Rolling update strategy

Important answer:

> Kubernetes manages containers, scaling, networking, health checks, rolling updates, and rollback.

## If Asked About Database

> We used in-memory mock data because the assignment focused on DevOps. In production, we would add PostgreSQL/MongoDB and manage credentials with Kubernetes Secrets.

## If Asked Why Jenkins And GitHub Actions Both

> GitHub Actions is used for GitHub-native CI, Docker publishing, and Render deploy hooks. Jenkins is included because the assignment required an enterprise-style declarative pipeline for build, test, Docker push, Kubernetes deploy, and rollback.

## If Asked About Zero Downtime

> Kubernetes rolling updates use `maxUnavailable: 0` and readiness probes, so traffic is only sent to ready pods.

## If Asked About Secrets

> Secrets are not committed in code. Docker credentials are in GitHub repository secrets, Render hooks are in GitHub Environment secrets, and Kubernetes Secret YAML is only a template.

## If Asked About Member Contribution

> Each member used a feature branch and PR into `develop`, which proves collaboration and follows Git Flow.

## Best Closing Line

> Overall, our project demonstrates the full DevOps lifecycle: code collaboration, automated testing, Docker image creation, secure secret handling, deployment automation, Kubernetes orchestration, monitoring concepts, rollback, and final submission proof.

