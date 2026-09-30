# Free Kubernetes demonstration

Run **Actions > Free Kubernetes Demo > Run workflow** on GitHub, or push changes
to the application. No AWS account or GitHub secrets are required. Standard
GitHub-hosted runners are free for public repositories.

The workflow runs both apps' lint and tests, builds their provided Dockerfiles,
loads SHA-tagged images into a temporary Kind cluster, applies the existing
Kubernetes manifests, waits for rollouts, and verifies that the React frontend
renders every movie returned by the deployed backend.

Download the run's `free-kubernetes-demo-<commit>` artifact for the frontend
screenshot, API response, deployed image information, and verification result.
The cluster is deleted at the end of the job. It does not provide a permanent
public website. LoadBalancer services are accessed using port forwarding because
Kind does not provision AWS load balancers.

This is supplementary deployment evidence. It does not demonstrate ECR or EKS
and is not a replacement for those Udacity rubric requirements without approval.
The original four AWS/CI workflows remain available; AWS CD still needs the
documented AWS secrets to succeed.
