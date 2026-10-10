# AWS deployment with temporary credentials

In GitHub Settings > Secrets and variables > Actions, set repository secrets:

| Secret | Value |
| --- | --- |
| AWS_ACCESS_KEY_ID | Fresh temporary access key ID |
| AWS_SECRET_ACCESS_KEY | Matching temporary secret key |
| AWS_SESSION_TOKEN | Matching session token; required for temporary credentials |
| AWS_REGION | Region containing the ECR repositories and EKS cluster |
| EKS_CLUSTER_NAME | Terraform output cluster_name |
| FRONTEND_ECR_REPOSITORY | Full repository URL from frontend_ecr, without a tag |
| BACKEND_ECR_REPOSITORY | Full repository URL from backend_ecr, without a tag |

All three credential values must come from the same unexpired session. Refresh
all three secrets together when the session expires. Do not commit credentials.

The provided Terraform uses us-east-1. Use that region unless intentionally
updating the Terraform provider and region-specific VPC endpoint service names.
The region used to obtain an STS session does not determine the region of EKS.

Credentials alone do not create infrastructure. If ECR/EKS already exist, use
their actual region, repository URLs and cluster name. Otherwise, review the
Terraform plan before creating resources (EKS and associated resources cost money).
Run in an authenticated shell with Terraform installed:

```sh
cd setup/terraform
terraform init
terraform plan -out=deployment.tfplan
terraform apply deployment.tfplan
terraform output
```

The Terraform creates an EKS access entry for github-action-user. If the GitHub
temporary credentials belong to a different role/user, that principal also needs
EKS access and Kubernetes deployment permissions. Lab accounts may restrict IAM
user/role creation, so inspect the plan and lab restrictions before applying.

Run Backend CD manually first. Retrieve its public load-balancer address:

```sh
aws eks update-kubeconfig --name cluster --region us-east-1
kubectl rollout status deployment/backend --timeout=180s
kubectl get service backend -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'
```

Set the repository Actions VARIABLE REACT_APP_MOVIE_API_URL to
http://<backend-load-balancer-hostname> (the service exposes port 80).
Run Frontend CD manually after setting it. Verify:

```sh
kubectl rollout status deployment/frontend --timeout=180s
kubectl get deployments,pods,services
kubectl get deployments -o jsonpath='{range .items[*]}{.metadata.name}{": "}{.spec.template.spec.containers[*].image}{"\\n"}{end}'
curl http://<backend-load-balancer-hostname>/movies/
```

Open the frontend service's public hostname in a browser and save evidence of
the movie list and successful CI/CD runs. Images must end in the run's commit SHA.
After collecting evidence, delete the frontend/backend LoadBalancer services,
then destroy only this project's Terraform resources to stop ongoing charges.
Keep Terraform state private; it is not a submission artifact.
