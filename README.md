# Makeup School by Elena Englezou — Website and Serverless Backend

A production‑ready static website with a secure, serverless contact form built on AWS.

This repository contains:
- A static site (HTML/CSS/JS) for the Makeup School brand.
- A Node.js (Lambda) backend that receives contact form submissions and sends email via Gmail/Google Workspace SMTP using Nodemailer.
- An AWS SAM template that provisions S3 (static hosting), CloudFront (CDN + custom domain + HTTPS), API Gateway, Lambda, Route53 record, and response‑security headers.

Live domain (as configured in infrastructure):
- https://www.makeupschoolbyelenaenglezou.com


## Architecture Overview
- S3 bucket hosts the static website (index.html, 404.html, assets).
- CloudFront sits in front of S3 with security headers and short TTL for quick content refresh.
- CloudFront routes /api/* to API Gateway (origin #2).
- API Gateway invokes ContactFormFunction (Node.js 22, Nodemailer) to send emails.
- Route53 A‑alias points www.makeupschoolbyelenaenglezou.com to the CloudFront distribution.
- ACM certificate (in us-east-1) terminates TLS for the custom domain.
- Secrets and dynamic values are pulled from SSM Parameter Store.

Key resources (from template.yaml):
- contactLambda/contact.js (handler: contact.handler)
- CloudFront behaviors for static site and /api/*
- ResponseHeadersPolicy and ResponseHeadersPolicyAPI for security/CORS
- SSM parameters used:
  - /makeupschool/gmail/pass (SecureString: Gmail App Password)
  - /makeupschool/acm_certificate_arn (ACM cert for the domain, in us-east-1)
  - /makeupschool/hosted_zone_id (Route53 hosted zone ID for the domain)


## Project Structure
- website/
  - index.html, styles.css, scripts.js
  - imgs/ (assets, favicons, photos, etc.)
  - 404.html, thank-you.html
- contactLambda/
  - contact.js (Nodemailer transporter, validation, CORS)
  - package.json (depends on nodemailer)
- template.yaml (all infra defined with AWS SAM/CloudFormation)
- samconfig.toml (optional saved deploy config)


## Features
- Static site delivered via CloudFront (fast, cached, HTTPS).
- Secure contact form endpoint: POST /api/contact
  - Validates required fields (name, email, phone, subject, message), sizes, and formats.
  - Honeypot field to deter bots.
  - Sends mail from your Gmail/Workspace using an App Password (DMARC‑safe from header, reply‑to set to visitor).
  - CORS restricted to the production origin.
- Security headers applied by CloudFront response header policies.


## Prerequisites
- AWS account with permissions to create CloudFormation stacks, S3, CloudFront, Route53, Lambda, API Gateway, and SSM parameters.
- AWS SAM CLI installed: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html
- Optional: Docker (for consistent builds).
- A registered domain in Route53 (or delegated to Route53) for www.makeupschoolbyelenaenglezou.com.
- An ACM certificate in us-east-1 that covers the domain (stored in SSM as described below).
- A Gmail/Google Workspace mailbox and a Google App Password for SMTP.


## One‑Time Setup (SSM Parameters)
Create the following SSM parameters before deploying (use us-east-1 for ACM/CloudFront):

1) /makeupschool/gmail/pass
- Type: SecureString
- Value: your Google App Password (not your normal password)

2) /makeupschool/acm_certificate_arn
- Type: String
- Value: the ARN of your ACM certificate in us-east-1 that includes www.makeupschoolbyelenaenglezou.com

3) /makeupschool/hosted_zone_id
- Type: String
- Value: your Route53 Hosted Zone ID for the domain

The Lambda uses these environment variables (set in template.yaml):
- TO_EMAIL: makeupschoolbyelenaenglezou@gmail.com (recipient)
- GMAIL_USER: testreactnative72@gmail.com (sender account)
- GMAIL_PASS: resolved from SSM parameter above
- ALLOWED_ORIGIN: https://www.makeupschoolbyelenaenglezou.com


## Deploy
Build and deploy with SAM (first time uses guided prompts):

```
sam build --use-container
sam deploy --guided
```

Notes:
- The stack provisions an S3 bucket named via mapping (default: makeup-school-website-bucket). Ensure this name is globally unique if you change it.
- CloudFront ACM cert must be in us-east-1; the ARN is read from /makeupschool/acm_certificate_arn.
- Route53 record is created in the hosted zone provided by /makeupschool/hosted_zone_id.
- After deploy, Outputs include:
  - CloudFrontURL: the distribution URL (useful for testing before DNS propagation)
  - ApiEndpoint: https://{restApiId}.execute-api.{region}.amazonaws.com/Prod/api/contact

DNS:
- The template creates an A‑alias at www.makeupschoolbyelenaenglezou.com pointing to CloudFront.
- Allow some time for DNS/CloudFront propagation.


## Updating the Website Content
- Edit files under website/ (HTML, CSS, JS, images).
- Redeploy to publish changes: `sam build --use-container && sam deploy`
- Caching: Default TTL is 60 seconds (see WebsiteCloudfrontTTL mapping). You can adjust this in template.yaml if needed.


## Local Testing (Lambda)
Invoke the contact function locally with a sample event:

```
sam local invoke ContactFormFunction --event events/contact.json
```

Example event body (save as events/contact.json):

```
{
  "httpMethod": "POST",
  "headers": { "Content-Type": "application/json" },
  "body": "{\"name\":\"Jane Doe\",\"email\":\"jane@example.com\",\"phone\":\"+357 99 123456\",\"subject\":\"Course inquiry\",\"message\":\"Hello!\"}"
}
```

Note: For local SMTP tests you may need valid env vars. For cloud runs, Lambda gets them from the template/SSM.


## API Usage
- Endpoint (via CloudFront): https://www.makeupschoolbyelenaenglezou.com/api/contact
- Method: POST
- Headers: Content-Type: application/json
- JSON body fields (all required): name, email, phone, subject, message
- The Lambda returns JSON and sets CORS for the production origin.


## Security Considerations
- Gmail must use an App Password; do not store real passwords.
- SSM SecureString protects the SMTP secret.
- CORS origin is restricted and CloudFront adds security headers.
- The Lambda sanitizes headers and validates inputs to reduce abuse.


## Troubleshooting
- 4xx from API: ensure JSON Content-Type and required fields, and that the honeypot field (company) is not sent.
- 500 from API: verify GMAIL_USER and SSM password are correct; check CloudWatch Logs for ContactFormFunction.
- DNS/SSL: ensure ACM cert ACM arn is correct (us-east-1) and DNS is using the correct hosted zone.
- Stale content: CloudFront TTL is 60s by default; wait or adjust the mapping to lower TTL for development.


## Cleaning Up
Delete the stack and all resources:

```
sam delete --stack-name "makeupschool"
```


## License
Proprietary. All rights reserved unless otherwise noted.
