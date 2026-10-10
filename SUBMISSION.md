# Movie Picture Pipeline submission

The required workflows are frontend-ci.yaml, backend-ci.yaml, frontend-cd.yaml,
and backend-cd.yaml under .github/workflows.

CI runs on pull requests to main affecting only the corresponding application,
or by manual dispatch. Lint and test are independent jobs. Docker build depends
on both passing. Frontend builds pass REACT_APP_MOVIE_API_URL as a build argument.

CD runs on application pushes to main or by manual dispatch. Parallel lint/test
jobs gate SHA-tagged Docker builds and ECR publication. Deployment authenticates
to AWS, updates EKS kubeconfig, replaces the corresponding Kustomize image alias,
applies manifests, and checks rollout completion. See AWS-DEPLOYMENT.md for secrets,
infrastructure requirements, frontend API configuration, and verification commands.

Failure handling uses failed job statuses, dependent-job gating, deployment
timeouts, Kubernetes diagnostics, and Actions summaries. Enable GitHub Actions
failure notifications in your account's notification settings.

Before submission, collect:

- Successful Frontend CI and Backend CI runs (use manual dispatch if necessary).
- Successful Frontend CD and Backend CD runs against AWS EKS.
- ECR image tags and Kubernetes deployment images matching the triggering SHA.
- Backend /movies/ response at its public service URL.
- Frontend screenshot showing all movies and the browser URL.

Prior Kind demo runs verified lint, tests, Docker builds and application rendering.
They do not establish AWS deployment success. Do not describe the project as fully
verified until the AWS runs and public endpoint checks above succeed.

Keep credentials, Terraform state and plan files out of the submission. After
collecting evidence, remove this project's cloud resources using its documented
teardown procedure.
