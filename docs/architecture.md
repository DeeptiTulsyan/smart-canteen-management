# 🏗️ System Architecture

## Overview
The Smart Canteen Pre-Order System follows a **microservices architecture** where each service is independently developed and deployed.

## Technologies Used
- Node.js / Express
- MongoDB (Database)
- Redis (Caching for Menu Service)
- RabbitMQ (Event-driven communication)

## Architecture Type
- REST APIs → synchronous communication
- RabbitMQ → asynchronous communication

## Services

### 1. User Service
Handles authentication and JWT generation.

### 2. Menu Service
Provides menu data and uses Redis caching for faster performance.

### 3. Order Service
Core service that:
- validates menu items
- processes orders
- interacts with wallet service
- publishes events

### 4. Wallet Service
Handles balance deduction using atomic database operations.

### 5. Notification Service
Consumes events and sends notifications to users.

## Communication Flow

- Order Service → Menu Service (REST)
- Order Service → Wallet Service (REST)
- Order Service → Notification Service (RabbitMQ)

## Key Concepts Demonstrated

- Microservices Architecture
- Event-Driven Design
- Caching using Redis
- Concurrency Control using atomic DB operations