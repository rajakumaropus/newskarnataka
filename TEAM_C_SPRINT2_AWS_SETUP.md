# ☁️ TEAM C DAY 1 - AWS VPC & NETWORKING
## Sprint 2 Monday Infrastructure Setup

**Status:** Ready to Execute  
**Lead:** DevOps Team Lead  
**Duration:** Full Day  
**Deliverable:** VPC + Security Groups + NAT Gateway + Route Tables

---

## 🎯 OBJECTIVES

✅ Create AWS VPC with proper networking  
✅ Set up security groups for all services  
✅ Configure NAT gateway for outbound traffic  
✅ Set up route tables for public/private subnets  
✅ Enable VPC Flow Logs for monitoring  
✅ Document all networking decisions

---

## 📐 VPC ARCHITECTURE

```
┌─────────────────────────────────────────────────────┐
│  VPC: newskarnataka-prod (10.0.0.0/16)             │
├─────────────────────────────────────────────────────┤
│                                                       │
│  ┌─────────────────────────────────────────────┐   │
│  │ Public Subnets (Tier 1)                      │   │
│  │ ┌───────────────────┬───────────────────┐   │   │
│  │ │ AZ-1a             │ AZ-1b             │   │   │
│  │ │ 10.0.1.0/24       │ 10.0.2.0/24       │   │   │
│  │ │ - Load Balancer   │ - Load Balancer   │   │   │
│  │ │ - NAT Gateway     │ - NAT Gateway     │   │   │
│  │ └───────────────────┴───────────────────┘   │   │
│  └─────────────────────────────────────────────┘   │
│            ↓                    ↓                    │
│  ┌─────────────────────────────────────────────┐   │
│  │ Private Subnets (Tier 2)                     │   │
│  │ ┌───────────────────┬───────────────────┐   │   │
│  │ │ AZ-1a             │ AZ-1b             │   │   │
│  │ │ 10.0.11.0/24      │ 10.0.12.0/24      │   │   │
│  │ │ - App Servers     │ - App Servers     │   │   │
│  │ │ - Auto Scaling    │ - Auto Scaling    │   │   │
│  │ └───────────────────┴───────────────────┘   │   │
│  └─────────────────────────────────────────────┘   │
│            ↓                    ↓                    │
│  ┌─────────────────────────────────────────────┐   │
│  │ Database Subnets (Tier 3)                    │   │
│  │ ┌───────────────────┬───────────────────┐   │   │
│  │ │ AZ-1a             │ AZ-1b             │   │   │
│  │ │ 10.0.21.0/24      │ 10.0.22.0/24      │   │   │
│  │ │ - RDS PostgreSQL  │ - RDS Replica     │   │   │
│  │ │ - ElastiCache     │ - ElastiCache     │   │   │
│  │ └───────────────────┴───────────────────┘   │   │
│  └─────────────────────────────────────────────┘   │
│                                                       │
└─────────────────────────────────────────────────────┘
```

---

## 🛠️ STEP-BY-STEP SETUP

### STEP 1: Create VPC

**AWS Console → VPC → Your VPCs → Create VPC**

**Configuration:**
- Name: `newskarnataka-prod`
- CIDR Block: `10.0.0.0/16`
- Tenancy: Default
- Enable DNS hostnames: Yes
- Enable DNS resolution: Yes

**Network ACL:** Default (allows all)

---

### STEP 2: Create Subnets

#### Public Subnet 1 (Load Balancer)
**AWS Console → VPC → Subnets → Create Subnet**

- VPC: `newskarnataka-prod`
- Name: `public-subnet-1a`
- Availability Zone: `us-east-1a` (or your region)
- CIDR Block: `10.0.1.0/24`
- Auto-assign public IPv4 address: Yes

#### Public Subnet 2 (Load Balancer - HA)
- VPC: `newskarnataka-prod`
- Name: `public-subnet-1b`
- Availability Zone: `us-east-1b`
- CIDR Block: `10.0.2.0/24`
- Auto-assign public IPv4 address: Yes

#### Private Subnet 1 (App Servers)
- VPC: `newskarnataka-prod`
- Name: `private-subnet-app-1a`
- Availability Zone: `us-east-1a`
- CIDR Block: `10.0.11.0/24`
- Auto-assign public IPv4 address: No

#### Private Subnet 2 (App Servers - HA)
- VPC: `newskarnataka-prod`
- Name: `private-subnet-app-1b`
- Availability Zone: `us-east-1b`
- CIDR Block: `10.0.12.0/24`
- Auto-assign public IPv4 address: No

#### Database Subnet 1 (RDS/Cache)
- VPC: `newskarnataka-prod`
- Name: `private-subnet-db-1a`
- Availability Zone: `us-east-1a`
- CIDR Block: `10.0.21.0/24`
- Auto-assign public IPv4 address: No

#### Database Subnet 2 (RDS/Cache - HA)
- VPC: `newskarnataka-prod`
- Name: `private-subnet-db-1b`
- Availability Zone: `us-east-1b`
- CIDR Block: `10.0.22.0/24`
- Auto-assign public IPv4 address: No

---

### STEP 3: Create Internet Gateway

**AWS Console → VPC → Internet Gateways → Create Internet Gateway**

- Name: `newskarnataka-igw`
- Attach to VPC: `newskarnataka-prod`

---

### STEP 4: Create NAT Gateways (High Availability)

#### NAT Gateway 1 (AZ-1a)

**First, allocate Elastic IP:**
- AWS Console → EC2 → Elastic IPs → Allocate Elastic IP
- Name: `nat-gateway-1a-eip`

**Then create NAT Gateway:**
- AWS Console → VPC → NAT Gateways → Create NAT Gateway
- Subnet: `public-subnet-1a`
- Elastic IP: (select the one just created)
- Name: `nat-gateway-1a`

#### NAT Gateway 2 (AZ-1b)

**Allocate Elastic IP:**
- Name: `nat-gateway-1b-eip`

**Create NAT Gateway:**
- Subnet: `public-subnet-1b`
- Elastic IP: (select the one just created)
- Name: `nat-gateway-1b`

---

### STEP 5: Create Route Tables

#### Public Route Table

**AWS Console → VPC → Route Tables → Create Route Table**

- Name: `public-rt`
- VPC: `newskarnataka-prod`

**Add Routes:**
| Destination | Target | Purpose |
|-------------|--------|---------|
| 10.0.0.0/16 | Local | VPC internal |
| 0.0.0.0/0 | IGW | Internet traffic |

**Associate Subnets:**
- public-subnet-1a
- public-subnet-1b

---

#### Private Route Table 1 (App - AZ-1a)

- Name: `private-rt-app-1a`
- VPC: `newskarnataka-prod`

**Add Routes:**
| Destination | Target | Purpose |
|-------------|--------|---------|
| 10.0.0.0/16 | Local | VPC internal |
| 0.0.0.0/0 | NAT-GW-1a | Outbound to internet |

**Associate Subnets:**
- private-subnet-app-1a

---

#### Private Route Table 1 (App - AZ-1b)

- Name: `private-rt-app-1b`
- VPC: `newskarnataka-prod`

**Add Routes:**
| Destination | Target | Purpose |
|-------------|--------|---------|
| 10.0.0.0/16 | Local | VPC internal |
| 0.0.0.0/0 | NAT-GW-1b | Outbound to internet |

**Associate Subnets:**
- private-subnet-app-1b

---

#### Private Route Table (Database)

- Name: `private-rt-db`
- VPC: `newskarnataka-prod`

**Add Routes:**
| Destination | Target | Purpose |
|-------------|--------|---------|
| 10.0.0.0/16 | Local | VPC internal |

**Associate Subnets:**
- private-subnet-db-1a
- private-subnet-db-1b

---

### STEP 6: Create Security Groups

#### ALB Security Group

**AWS Console → EC2 → Security Groups → Create Security Group**

- Name: `alb-sg`
- Description: `Security group for Application Load Balancer`
- VPC: `newskarnataka-prod`

**Inbound Rules:**
| Protocol | Port | Source | Purpose |
|----------|------|--------|---------|
| HTTP | 80 | 0.0.0.0/0 | Public HTTP |
| HTTPS | 443 | 0.0.0.0/0 | Public HTTPS |

**Outbound Rules:**
| Protocol | Port | Destination | Purpose |
|----------|------|-------------|---------|
| All | All | 10.0.0.0/16 | Internal VPC |

---

#### Frontend App Security Group

- Name: `frontend-app-sg`
- Description: `Security group for Frontend servers`
- VPC: `newskarnataka-prod`

**Inbound Rules:**
| Protocol | Port | Source | Purpose |
|----------|------|--------|---------|
| HTTP | 3000 | alb-sg | From ALB |
| SSH | 22 | (your-ip)/32 | Admin SSH |

**Outbound Rules:**
| Protocol | Port | Destination | Purpose |
|----------|------|-------------|---------|
| All | All | 0.0.0.0/0 | Internet access |

---

#### Backend App Security Group

- Name: `backend-app-sg`
- Description: `Security group for Backend servers`
- VPC: `newskarnataka-prod`

**Inbound Rules:**
| Protocol | Port | Source | Purpose |
|----------|------|--------|---------|
| HTTP | 1337 | alb-sg | From ALB |
| SSH | 22 | (your-ip)/32 | Admin SSH |

**Outbound Rules:**
| Protocol | Port | Destination | Purpose |
|----------|------|-------------|---------|
| All | All | 0.0.0.0/0 | Internet access |
| TCP | 5432 | rds-sg | PostgreSQL |
| TCP | 6379 | cache-sg | Redis |

---

#### Database Security Group

- Name: `rds-sg`
- Description: `Security group for RDS PostgreSQL`
- VPC: `newskarnataka-prod`

**Inbound Rules:**
| Protocol | Port | Source | Purpose |
|----------|------|--------|---------|
| PostgreSQL | 5432 | backend-app-sg | From app servers |
| PostgreSQL | 5432 | 10.0.11.0/24 | From app subnet 1 |
| PostgreSQL | 5432 | 10.0.12.0/24 | From app subnet 2 |

**Outbound Rules:**
| Protocol | Port | Destination | Purpose |
|----------|------|-------------|---------|
| All | All | 0.0.0.0/0 | Minimal |

---

#### Cache Security Group

- Name: `cache-sg`
- Description: `Security group for ElastiCache Redis`
- VPC: `newskarnataka-prod`

**Inbound Rules:**
| Protocol | Port | Source | Purpose |
|----------|------|--------|---------|
| TCP | 6379 | backend-app-sg | From app servers |
| TCP | 6379 | 10.0.11.0/24 | From app subnet 1 |
| TCP | 6379 | 10.0.12.0/24 | From app subnet 2 |

---

### STEP 7: Enable VPC Flow Logs

**AWS Console → VPC → Your VPCs → Flow Logs**

- VPC: `newskarnataka-prod`
- Filter: `ACCEPT, REJECT`
- Destination: CloudWatch Logs
- Role: Create new role
- Log group: `/aws/vpc/newskarnataka-prod`

---

## 📊 VPC SUMMARY

| Component | Configuration |
|-----------|---------------|
| **VPC CIDR** | 10.0.0.0/16 |
| **Public Subnets** | 2 (10.0.1.0/24, 10.0.2.0/24) |
| **Private Subnets (App)** | 2 (10.0.11.0/24, 10.0.12.0/24) |
| **Private Subnets (DB)** | 2 (10.0.21.0/24, 10.0.22.0/24) |
| **Internet Gateway** | 1 |
| **NAT Gateways** | 2 (High Availability) |
| **Route Tables** | 5 |
| **Security Groups** | 5 |
| **Availability Zones** | 2 (us-east-1a, us-east-1b) |
| **High Availability** | Full redundancy across AZs |

---

## ✅ VERIFICATION CHECKLIST

- [ ] VPC created (10.0.0.0/16)
- [ ] 6 subnets created (2 public, 4 private)
- [ ] Internet Gateway attached
- [ ] 2 NAT Gateways in public subnets
- [ ] 5 Route Tables configured
- [ ] All subnets associated with route tables
- [ ] 5 Security Groups created
- [ ] Inbound rules configured correctly
- [ ] Outbound rules configured correctly
- [ ] VPC Flow Logs enabled
- [ ] All tags applied
- [ ] Documentation complete

---

## 🧪 TESTING PROCEDURES

### Connectivity Test
1. Launch EC2 in public subnet
2. SSH to instance
3. Verify internet access (`curl https://www.google.com`)
4. Launch EC2 in private subnet
5. Verify outbound via NAT Gateway

### Security Group Test
1. Test ALB → App security groups
2. Test App → RDS security group
3. Test RDS isolation (no incoming from public)
4. Test SSH access restrictions

---

## 📝 DOCUMENTATION OUTPUTS

Create in repository:
- [ ] `vpc-architecture.md` (network diagram)
- [ ] `security-groups.md` (all rules)
- [ ] `route-tables.md` (routing config)
- [ ] `nat-configuration.md` (NAT setup)
- [ ] `aws-networking-checklist.md` (verification)

---

## 🎯 SUCCESS CRITERIA

✅ VPC with proper CIDR design  
✅ 6 subnets across 2 AZs  
✅ Internet Gateway + NAT Gateways  
✅ Route tables properly configured  
✅ Security groups with principle of least privilege  
✅ VPC Flow Logs for monitoring  
✅ High availability achieved  
✅ Documentation complete  
✅ Ready for RDS provisioning (Day 2)

---

## 📞 NEXT STEPS

**Day 2:** RDS PostgreSQL + ElastiCache Redis  
**Day 3:** EC2 instances + Load Balancer  
**Day 4:** CI/CD pipeline  
**Day 5:** Production monitoring

---

**Team C Day 1 - AWS VPC Setup Ready! 🚀**

