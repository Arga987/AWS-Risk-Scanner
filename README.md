# 1. Project Overview

AWS Security Groups control network traffic to and from AWS resources such as EC2 instances. As an AWS account grows, managing an increasing number of security groups becomes difficult, making it time-consuming to identify overly permissive rules during a security review or incident investigation.

**AWS Security Scanner** automates the process of identifying potentially risky inbound security group rules using predefined risk conditions based on AWS security guidance.

Users can scan their AWS account to evaluate security groups and view the findings in a table, categorized by severity: **Low, Medium, and High.** Each finding includes a **View Remediation option** that explains why the rule is risky and provides guidance on how to address it.

By consolidating security findings and remediation guidance in one place, the scanner helps users identify potential security risks faster and simplifies the process of reviewing and securing their AWS environments.

# 2. Application Preview

## 2.1 Desktop View

> Demo Video

Link has to be made

> Light Mode

<img width="1280" height="683" alt="Light_Mode_Login_PC" src="https://github.com/user-attachments/assets/e0caa463-4ee5-453b-81bd-5ad7b8408833" />
<img width="1280" height="685" alt="Light_Mode_Home_PC" src="https://github.com/user-attachments/assets/85a5702b-54cc-41aa-acf7-482a21c18ac4" />
<img width="1280" height="682" alt="Light_Mode_Scan_PC" src="https://github.com/user-attachments/assets/4f5cd33f-8168-4f7e-a054-747a7d856765" />
<img width="1280" height="685" alt="Light_Mode_Viewing_table_PC" src="https://github.com/user-attachments/assets/99c621ba-d0e5-4d8a-9fa4-da7ea967e9a3" />
<img width="1280" height="683" alt="Light_Mode_Remediation_PC" src="https://github.com/user-attachments/assets/20af3cd5-d698-40ce-8f08-32df7d79cd75" />
<img width="1280" height="680" alt="Light_Mode_History_PC" src="https://github.com/user-attachments/assets/fb7a7082-df35-4f37-9360-eb23324d2886" />

> Dark Mode

<img width="1280" height="685" alt="Dark_Mode_Login_PC" src="https://github.com/user-attachments/assets/3a87aa5b-c75a-471c-a746-3c8e760d8bcd" />
<img width="1280" height="679" alt="Dark_Mode_Home_PC" src="https://github.com/user-attachments/assets/36d3a0e4-995f-4026-a093-a6c47c273a36" />
<img width="1280" height="683" alt="Dark_Mode_Scan_PC" src="https://github.com/user-attachments/assets/b6ba56ea-1037-4916-922e-d6288587d14a" />
<img width="1279" height="682" alt="Dark_Mode_Viewing_tables_PC" src="https://github.com/user-attachments/assets/d0d42032-ddb3-4707-9435-bcd629f5f1df" />
<img width="1280" height="682" alt="Dark_Mode_Remediation_PC" src="https://github.com/user-attachments/assets/23843fb0-736c-4efd-be02-3ad8a142ced3" />
<img width="1280" height="685" alt="Dark_Mode_History_PC" src="https://github.com/user-attachments/assets/f9ffd9e0-18c1-45ce-b590-fb9cd6686ac7" />

## 2.2 Mobile View

> Light Mode

<p align="center">
  <img
    src="https://github.com/user-attachments/assets/83f30c72-d785-4359-99d5-5c21676b06f7"
    alt="AWS Security Scanner - Mobile Login, Light Mode"
    width="280"
  />
</p>
<p align="center">
  <img
    src="https://github.com/user-attachments/assets/a53bcb59-da01-41a8-a7dc-07b0e5d0266f"
    alt="AWS Security Scanner - Mobile Login, Light Mode"
    width="280"
  />
</p>
<p align="center">
  <img
    src="https://github.com/user-attachments/assets/743d9df3-5a90-47a4-95ba-7bc238eb5784"
    alt="AWS Security Scanner - Mobile Login, Light Mode"
    width="280"
  />
</p>
<p align="center">
  <img
    src="https://github.com/user-attachments/assets/c796c17b-5d90-4af1-819a-2cae45d09543"
    alt="AWS Security Scanner - Mobile Login, Light Mode"
    width="280"
  />
</p>
<p align="center">
  <img
    src="https://github.com/user-attachments/assets/f044aacf-6340-4e2e-9848-ab17d4616f84"
    alt="AWS Security Scanner - Mobile Login, Light Mode"
    width="280"
  />
</p>
<p align="center">
  <img
    src="https://github.com/user-attachments/assets/9b1bbec1-1c47-4c8c-9943-21b71b1bb3fe"
    alt="AWS Security Scanner - Mobile Login, Light Mode"
    width="280"
  />
</p>

> Dark Mode

<p align="center">
  <img
    src="https://github.com/user-attachments/assets/55a299b6-de76-45ed-901b-ec2b06d54b11"
    alt="AWS Security Scanner - Mobile Login, Dark Mode"
    width="280"
  />
</p>
<p align="center">
  <img
    src="https://github.com/user-attachments/assets/a9ed66e2-c9b6-49c8-947c-0784df704d7f"
    alt="AWS Security Scanner - Mobile Login, Dark Mode"
    width="280"
  />
</p>
<p align="center">
  <img
    src="https://github.com/user-attachments/assets/5529d9ef-597d-461c-8705-b9c1cdadbc7e"
    alt="AWS Security Scanner - Mobile Login, Dark Mode"
    width="280"
  />
</p>
<p align="center">
  <img
    src="https://github.com/user-attachments/assets/67f8865d-a497-4570-9e1c-184134b25235"
    alt="AWS Security Scanner - Mobile Login, Dark Mode"
    width="280"
  />
</p>
<p align="center">
  <img
    src="https://github.com/user-attachments/assets/bcf3b1cb-cadc-4aed-a678-dcbd513356e3"
    alt="AWS Security Scanner - Mobile Login, Dark Mode"
    width="280"
  />
</p>

<p align="center">
  <img
    src="https://github.com/user-attachments/assets/ecd66362-c88d-4abd-b656-8798dd93d73f"
    alt="AWS Security Scanner - Mobile Login, Dark Mode"
    width="280"
  />
</p>
<p align="center">
  <img
    src="https://github.com/user-attachments/assets/c51d4600-e673-4cd7-9478-567802fd3c7b"
    alt="AWS Security Scanner - Mobile Login, Dark Mode"
    width="280"
  />
</p>

## 3. Architecture

The following diagrams illustrate the key workflows of AWS Security Scanner, including authentication, security group scanning, remediation guidance, and scan history.

### 3.1 Authentication Flow

<img width="641" height="531" alt="Authentication Flow" src="https://github.com/user-attachments/assets/c6300c44-4827-4123-960c-c03519ec3341" />

### 3.2 Security Findings and Results Flow

<img width="542" height="817" alt="Security Findings and Results Flow" src="https://github.com/user-attachments/assets/390c77f4-2218-4534-8606-6d794a9f09a4" />

### 3.3 Remediation Guidance Flow

<img width="803" height="786" alt="Remediation Guidance Flow" src="https://github.com/user-attachments/assets/5946204d-37c7-4544-9bc5-9a7d40af876a" />

### 3.4 Scan History Flow

<img width="733" height="935" alt="Scan History Flow" src="https://github.com/user-attachments/assets/3d54b505-e9eb-4c2f-aa51-fd04bc557333" />

## 4. Local Development Setup

This guide explains how to configure and run the AWS Security Scanner frontend and backend locally, including the AWS resources and permissions required by the backend.

### 4.1 Prerequisites

Ensure the following are installed and configured:

- Java 21 and Maven
- Node.js and npm
- AWS CLI and access to an AWS account
- IntelliJ IDEA for the backend (recommended)
- VS Code for the frontend (recommended)

### 4.2 Backend Configuration

Configure the following environment variables for the Spring Boot application:

```dotenv
APP_AUTH_USERNAME=<username>
APP_AUTH_PASSWORD=<password>
SPRING_PROFILES_ACTIVE=local
```

Local authentication uses sessions and does not require Cognito-specific configuration.

Keep authentication credentials private and never commit them to version control.

### 4.3 Frontend Configuration

Navigate to the frontend directory and install the dependencies:

```bash
npm install
```

Create a `.env.development` file in the frontend directory:

```dotenv
VITE_AUTH_MODE=session
VITE_API_BASE_URL=http://localhost:8080
```

The development servers use the following ports:

- **Frontend:** `3000`
- **Backend:** `8080`

### 4.4 AWS Configuration

Configure your AWS CLI credentials:

```bash
aws configure
```

Verify the active AWS identity:

```bash
aws sts get-caller-identity
```

Use your own AWS account and ensure that the DynamoDB table, backend configuration, and other regional AWS resources use consistent regions.

### 4.5 Create the DynamoDB Table

In the AWS Management Console, create a DynamoDB table with the following configuration:

| Setting | Value |
|---|---|
| Table name | `security-scanner` |
| Partition key | `accountUuid` (`String`) |
| Sort key | `entityKey` (`String`) |
| Region | Your configured AWS region |
| Capacity mode | On-demand |

On-demand capacity is recommended for local development.

### 4.6 Configure IAM Permissions

Create an IAM policy with the permissions required by the backend. Replace `<region>` and `<account-id>` in the DynamoDB ARN with your AWS region and account ID.

The following policy grants access to describe EC2 security groups, invoke Amazon Bedrock models, list account aliases, and access the scanner's DynamoDB table.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ReadSecurityGroups",
      "Effect": "Allow",
      "Action": "ec2:DescribeSecurityGroups",
      "Resource": "*"
    },
    {
      "Sid": "InvokeBedrock",
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel",
        "bedrock:InvokeModelWithResponseStream"
      ],
      "Resource": "*"
    },
    {
      "Sid": "ReadAccountAliases",
      "Effect": "Allow",
      "Action": "iam:ListAccountAliases",
      "Resource": "*"
    },
    {
      "Sid": "AccessScannerTable",
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:Query",
        "dynamodb:GetItem",
        "dynamodb:Scan"
      ],
      "Resource": "arn:aws:dynamodb:<region>:<account-id>:table/security-scanner"
    }
  ]
}
```

Attach this policy to the IAM identity used by your local backend.

Ensure that the required Amazon Bedrock model is available and enabled in your chosen region.

### 4.7 Run the Application

#### Start the Backend

1. Open the backend project in IntelliJ IDEA.
2. Configure the backend environment variables from Section 4.2.
3. Verify the AWS credentials, IAM permissions, and DynamoDB region.
4. Start the Spring Boot application.

#### Start the Frontend

1. Open the frontend project in VS Code.
2. Navigate to the frontend directory.
3. Install the dependencies if you have not already done so:

   ```bash
   npm install
   ```

4. Create `.env.development` using the configuration from Section 4.3.
5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open the application at [http://localhost:3000](http://localhost:3000).

### 4.8 Troubleshooting

| Issue | What to check |
|---|---|
| Backend startup failure | Java version, environment variables, and active Spring profile |
| Frontend API errors | Confirm the backend is running on port `8080` and the API URL is correct |
| AWS authentication errors | Verify the active AWS identity and credentials |
| DynamoDB errors | Check the table name, key schema, region, and IAM permissions |
| Bedrock errors | Verify model availability, access, region, and IAM permissions |

### Security Considerations

- Never commit passwords, AWS credentials, or secret tokens to version control.
- Never expose AWS credentials through frontend environment variables.
- Use an IAM identity with only the permissions required by the application.

## 5. Limitations and Future Improvements

### 5.1 Current Limitations

- **Single-user access:** The application uses predefined credentials and does not currently support user registration or multiple user accounts.
- **Inbound rule analysis only:** The scanner evaluates inbound security group rules. Outbound rules are currently outside the scope of the project.

### 5.2 Planned Improvements

- **Multi-account support:** Extend scanning capabilities to cover multiple AWS accounts rather than only the currently configured account.
- **Network security analysis:** Expand security checks to include Network Access Control Lists (NACLs).
- **IAM security analysis:** Identify potentially risky IAM permissions and configurations to provide broader visibility into AWS security risks.
