# Git Flow And Team Contributions

Use this sequence so each member has visible collaboration proof.

1. Team lead creates the public GitHub repository and pushes this scaffold to `main`.
2. Team lead creates `develop` and `release` branches.
3. Soban Rabbani creates `feature/soban-user-product` from `develop`, commits User/Product service or page updates, and opens a PR into `develop`.
4. Abdul Hadi creates `feature/abdul-order-notification` from `develop`, commits Order/Notification or pipeline updates, and opens a PR into `develop`.
5. Hashir Sarwar creates `feature/hashir-dashboard-docs` from `develop`, commits dashboard/docs updates, and opens a PR into `develop`.
6. Merge tested work into `develop`, then promote to `release`, then to `main` or `production`.

Branch protection to enable manually in GitHub:

- Require pull requests before merging.
- Require the `CI / Lint and test` workflow to pass.
- Restrict direct pushes to `main` or `production`.
- Require approvals for the `production` GitHub Environment.
