# Team Member Contribution Guide

Use this guide for the remaining collaboration work. The technical project is already scaffolded; each member now needs to create visible GitHub contribution proof from their own account.

## Repository

- GitHub repo: https://github.com/hashirjutt13/cloud-native-microservices-devops-project
- Team lead: Hashir Sarwar (`fa23-bcs-065`)
- Soban Rabbani: `fa23-bcs-082`
- Abdul Hadi: `fa23-bcs-012`

## First Step For Both Members

1. Log in to the correct GitHub account:
   - Soban: `soban-082`
   - Abdul Hadi: `fa23-bcs-012-oss`
2. Accept the repository invitation from GitHub.
3. Open the repository:
   - https://github.com/hashirjutt13/cloud-native-microservices-devops-project
4. Confirm you can see the repository and create branches.

Screenshot to collect:

- Screenshot 1: GitHub repo page after accepting invitation.
- Save as: `your-name-01-repo-access.png`

## Soban Rabbani Work

Soban should own the User/Product contribution.

Run:

```bash
git clone https://github.com/hashirjutt13/cloud-native-microservices-devops-project.git
cd cloud-native-microservices-devops-project
git checkout develop
git pull origin develop
git checkout -b feature/soban-user-product
```

Make this small edit:

1. Open `services/product/src/app.js`.
2. Find the `products` array.
3. Add one product:

```js
{ id: "p-203", name: "Gaming Mouse", category: "accessories", price: 35, inventory: 20 }
```

Run checks:

```bash
npm install
npm run check
```

Commit and push:

```bash
git add .
git commit -m "Add Soban product catalog contribution"
git push -u origin feature/soban-user-product
```

Open a PR:

- Base branch: `develop`
- Compare branch: `feature/soban-user-product`
- PR title: `Soban User/Product contribution`

Screenshots to collect:

- Screenshot 1: Repo page after accepting invite.
- Screenshot 2: Terminal after `npm run check` passes.
- Screenshot 3: GitHub branch page showing `feature/soban-user-product`.
- Screenshot 4: Commit page showing Soban's commit.
- Screenshot 5: Pull request page showing title and base branch `develop`.
- Screenshot 6: PR checks showing CI passed.

Suggested filenames:

- `soban-01-repo-access.png`
- `soban-02-local-checks.png`
- `soban-03-branch.png`
- `soban-04-commit.png`
- `soban-05-pr.png`
- `soban-06-pr-ci-passed.png`

## Abdul Hadi Work

Abdul Hadi should own the Order/Notification contribution.

Run:

```bash
git clone https://github.com/hashirjutt13/cloud-native-microservices-devops-project.git
cd cloud-native-microservices-devops-project
git checkout develop
git pull origin develop
git checkout -b feature/abdul-order-notification
```

Make this small edit:

1. Open `services/notification/src/app.js`.
2. Find the `notifications` array.
3. Add one notification:

```js
{ id: "n-402", type: "system-alert", target: "ops", message: "Deployment pipeline verified by Abdul Hadi" }
```

Run checks:

```bash
npm install
npm run check
```

Commit and push:

```bash
git add .
git commit -m "Add Abdul notification service contribution"
git push -u origin feature/abdul-order-notification
```

Open a PR:

- Base branch: `develop`
- Compare branch: `feature/abdul-order-notification`
- PR title: `Abdul Order/Notification contribution`

Screenshots to collect:

- Screenshot 1: Repo page after accepting invite.
- Screenshot 2: Terminal after `npm run check` passes.
- Screenshot 3: GitHub branch page showing `feature/abdul-order-notification`.
- Screenshot 4: Commit page showing Abdul's commit.
- Screenshot 5: Pull request page showing title and base branch `develop`.
- Screenshot 6: PR checks showing CI passed.

Suggested filenames:

- `abdul-01-repo-access.png`
- `abdul-02-local-checks.png`
- `abdul-03-branch.png`
- `abdul-04-commit.png`
- `abdul-05-pr.png`
- `abdul-06-pr-ci-passed.png`

## How To Take Screenshots

On macOS:

- Full screen: `Shift + Command + 3`
- Select area: `Shift + Command + 4`

On Windows:

- Full screen: `PrtSc`
- Select area: `Windows + Shift + S`

Recommended screenshot rules:

- Show the browser URL bar when capturing GitHub pages.
- Show the GitHub username/avatar if possible.
- Show the green CI/check mark clearly.
- Do not crop out branch names, PR title, or commit author.
- Send all screenshots to Hashir after completing the PR.

## Reflection Text

Each member should provide 3-4 lines about what they learned. Drafts are already in:

```text
docs/reflections.md
```

Members may edit their own reflection before final submission.

## Final Reminder

Do not push directly to `main`, `release`, or `develop`. Use a feature branch and open a pull request into `develop`.
