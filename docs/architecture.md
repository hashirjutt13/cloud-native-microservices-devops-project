# Architecture

The project simulates a cloud-native e-commerce platform with five deployable containers:

- Frontend dashboard served by nginx.
- User Service for registration, login, profile, and authentication-style APIs.
- Product Service for catalog, details, inventory, and search APIs.
- Order Service for order creation and status tracking.
- Notification Service for order confirmation and operational alerts.

Local development uses Docker Compose. CI uses GitHub Actions. Enterprise pipeline simulation uses Jenkins. Kubernetes manifests provide Deployments, Services, Ingress, ConfigMaps, Secrets, RBAC, NetworkPolicy, HPA, rolling updates, rollback commands, and optional canary/blue-green deployment examples.
