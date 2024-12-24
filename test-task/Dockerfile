# Use Node.js base image
FROM public.ecr.aws/lambda/nodejs:20

COPY . ${LAMBDA_TASK_ROOT}
WORKDIR ${LAMBDA_TASK_ROOT}

# Install dependencies
COPY package*.json tsconfig.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# Expose the app on port 3000 (or use Lambda's default settings)
EXPOSE 3000

# Set the Lambda handler path to the compiled code
CMD ["dist/main.handler"]
