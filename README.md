# bankingAppv1

# Fullstack Cloud Banking Application (`bankingAppv1`)

A cloud-native fullstack banking application built with **React**, **Spring Boot (Java 25)**, and **PostgreSQL**, provisioned on **Microsoft Azure** using **Terraform** and deployed automatically via **GitHub Actions**.

**Live Demo:** [https://azurewebsites.net](https://azurewebsites.net)

---

## Architecture & Tech Stack

* **Frontend:** React (`fullstackapp-frontend`), bundled directly into Spring Boot static resources during CI/CD for single-origin hosting.
* **Backend:** Java 25 & Spring Boot (`bankingApp`), exposing RESTful APIs over HTTPS.
* **Database:** Azure Database for PostgreSQL Flexible Server (PostgreSQL 16) with SSL enforced (`sslmode=require`).
* **Security & Secrets Management:**
  * **Azure Key Vault** with Role-Based Access Control (RBAC) for storing database credentials.
  * **System-Assigned Managed Identity** on Azure App Service (`Key Vault Secrets User`) to retrieve secrets at runtime without hardcoded credentials.
  * **PostgreSQL Firewall Rules** restricting network access to Azure services.
* **Infrastructure as Code (IaC):** Terraform (`terraform/`) with remote state stored in Azure Blob Storage (`azurerm` backend).
* **CI/CD Pipeline:** GitHub Actions (`.github/workflows/`) automating React builds, Maven packaging, and Azure App Service deployment on pushes to `main`.

---

## Repository Structure

```text
├── .github/workflows/       # GitHub Actions CI/CD build & deploy pipeline
├── bankingApp/              # Spring Boot (Java 25 / Maven) backend application
├── fullstackapp-frontend/   # React frontend application
├── terraform/               # Azure Infrastructure as Code (main.tf, variables.tf)
└── README.md                # Project documentation
```

---

## CI/CD Deployment Workflow

Every push to the `main` branch automatically triggers the GitHub Actions pipeline:
1. **Frontend Build:** Installs Node.js dependencies and compiles the React production bundle.
2. **Static Asset Bundling:** Copies the compiled React build into `bankingApp/src/main/resources/static/`.
3. **Backend Packaging:** Compiles the Spring Boot application with JDK 25 and packages an executable `.jar` via Maven.
4. **Cloud Deployment:** Deploys the packaged `.jar` directly to Azure App Service using a secured publish profile secret.

---

## Local Infrastructure & Development Setup

### Prerequisites
* Java 25, Node.js 20+, and Maven
* Terraform CLI & Azure CLI (`az login`)

### Provisioning Infrastructure with Terraform
1. Navigate to the `terraform` directory:
   ```bash
   cd terraform
   ```
2. Create a local `terraform.tfvars` file (ignored by Git) with your database password:
   ```hcl
   db_admin_password = "YourSecurePasswordHere"
   ```
3. Initialize and apply the Terraform configuration:
   ```bash
   terraform init
   terraform apply
   ```
