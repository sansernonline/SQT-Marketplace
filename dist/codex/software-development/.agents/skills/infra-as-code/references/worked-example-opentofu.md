## Worked example: OpenTofu with 1 machine + 1 database + state in the cloud

**Task** (example) A Thai customer's internal system needs 1 VM and 1 managed PostgreSQL. The data must stay in Thailand, and staging and production must match.

| File | Role |
|---|---|
| `infra/bootstrap/` | The state bucket, created once, because the backend must exist before `tofu init` |
| `infra/modules/app/main.tf` | 1 VM + 1 database, reused in every environment |
| `infra/envs/prod/main.tf` | backend · provider · calls the module (staging is the same, differing only in `key` and `env`) |

`infra/envs/prod/main.tf`

```hcl
terraform {
  backend "s3" {
    bucket       = "acme-tofu-state"  # created once in bootstrap/: versioning + encryption + public access off
    key          = "prod/app.tfstate" # 1 env = 1 state
    region       = "ap-southeast-7"
    use_lockfile = true # lock in the same bucket, no DynamoDB needed
  }
  required_providers { aws = { source = "hashicorp/aws", version = "~> 6.0" } }
}
provider "aws" {
  region = "ap-southeast-7"                                 # Asia Pacific (Thailand), opt in first
  default_tags { tags = { project = "app", env = "prod" } } # budgets can filter by tag
}
module "app" {
  source = "../../modules/app"
  env    = "prod"
  ami_id = "ami-0123456789abcdef0" # example · an AMI is tied to a region
}
```

`infra/modules/app/main.tf`

```hcl
variable "env" { type = string }
variable "ami_id" { type = string }
resource "aws_instance" "app" { # uses the default VPC to stay short · real work splits out a network module
  ami           = var.ami_id
  instance_type = "t3.small" # available in ap-southeast-7 (checked 2026-10-23)
}
resource "aws_db_instance" "db" {
  identifier                  = "app-${var.env}"
  engine                      = "postgres"
  instance_class              = "db.t4g.micro" # check it can be ordered in the region first
  allocated_storage           = 20
  username                    = "app"
  manage_master_user_password = true # the password lives in Secrets Manager, not in state
  storage_encrypted           = true
  deletion_protection         = var.env == "prod"
  final_snapshot_identifier   = "app-${var.env}-final" # whenever it is deleted, a final snapshot exists
}
```

**Result** `tofu validate` passed with OpenTofu 1.13.0 and `hashicorp/aws` 6.70.0 (ตรวจจริง 2026-10-23), and when I mistyped 1 argument name, validate failed as it should. `plan` or `apply` against a real account was not run (ยังไม่ได้ตรวจ). Real work splits out a `network` module with private subnets for the database.
