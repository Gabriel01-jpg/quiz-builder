# Quiz Builder 🚀

## 🚧 Prerequisites

- Node.js v18+  
- npm or yarn
  
## 🔧 Installation & Setup

1. **Clone the repository**  
    ```bash
    git clone https://github.com/Gabriel01-jpg/quiz-builder.git
    cd quiz-builder
    ```

2. **To initialize database, use docker-compose**
     ```bash
    cd quiz-builder/backend
    docker compose up -d
    ```
3. **Create a copy of .env-example as .env**
     ```bash
     mv .env-example .env
    ```

4. **To create tables, you need to have everything installed on backend and run prisma migrate**
     ```bash
    npm install
    npx prisma migrate dev    
    ```

5. **With everyone installed and database tables create, just start the serve**
     ```bash
    npm run start  
    ```

6. **To initialize frontend, install everything and run start**
   ```bash
   cd quiz-builder/frontend
   npm install
   npm run start  
    ```
