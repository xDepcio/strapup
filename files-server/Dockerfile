# Use the official Golang image as the base image
FROM golang:1.22.4

# Set the working directory
WORKDIR /app

# Copy go.mod and go.sum
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy the rest of the application code
COPY . .

# Build the application
RUN go build -o main ./cmd/main.go

# Expose the port the app runs on
EXPOSE 5000

# Start the application
CMD ["./main"]
