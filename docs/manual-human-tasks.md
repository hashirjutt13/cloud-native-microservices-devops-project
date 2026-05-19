# Manual Tasks Only Humans Need To Do

Codex has generated the code and DevOps files. The team should only do these external tasks:

1. Create a public GitHub repository and add all three members.
2. Push this project to GitHub.
3. Create Docker Hub repositories or allow GitHub Actions to create/push image names under your Docker Hub account.
4. Add GitHub repository secrets:
   - `DOCKERHUB_USERNAME`
   - `DOCKERHUB_TOKEN`
5. Create GitHub Environments:
   - `development`
   - `staging`
   - `production`
6. Add each environment's `RENDER_DEPLOY_HOOK` secret if using Render.
7. Configure Jenkins credentials:
   - `dockerhub-username`
   - `dockerhub-token`
   - Kubernetes kubeconfig or cluster credentials according to your Jenkins setup.
8. Soban Rabbani and Abdul Hadi each commit at least one change from their own GitHub accounts and open PRs.
9. Hashir Sarwar reviews/merges PRs and collects final proof as team lead.
10. Capture screenshots listed in `docs/screenshot-checklist.md`.
11. Team lead submits the final document with repository, Docker Hub, and deployed URLs.
