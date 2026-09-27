pipeline {
    agent any

    // 1. Environment Variables Configuration
    environment {
        DOCKER_USER          = 'your-dockerhub-username' // Replace with your actual Docker Hub username
        IMAGE_NAME           = 'visa-service'
        REGISTRY_CREDENTIALS = 'docker-hub-credentials'  // Credential ID configured in Jenkins
        IMAGE_TAG            = "${BUILD_NUMBER}"
    }

    options {
        timeout(time: 20, unit: 'MINUTES')
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10')) // Retain logs for the last 10 builds only
    }

    stages {

        // Stage 1: Install Dependencies
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        // Stage 2: Run Unit Tests
        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }

        // Stage 3: Build Docker Image
        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building Docker image: ${DOCKER_USER}/${IMAGE_NAME}:${IMAGE_TAG}"
                    appImage = docker.build("${DOCKER_USER}/${IMAGE_NAME}:${IMAGE_TAG}")
                }
            }
        }

        // Stage 4: Push Image to Docker Hub
        stage('Push to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', REGISTRY_CREDENTIALS) {
                        // Push specific build number tag
                        appImage.push("${IMAGE_TAG}")
                        // Push latest tag
                        appImage.push('latest')
                    }
                }
            }
        }
    }

    // Cleanup and Pipeline Status Notifications
    post {
        always {
            script {
                echo "Cleaning up local Docker images to free up space..."
                sh "docker rmi ${DOCKER_USER}/${IMAGE_NAME}:${IMAGE_TAG} ${DOCKER_USER}/${IMAGE_NAME}:latest || true"
            }
        }
        success {
            echo "Pipeline completed successfully! Image pushed: ${DOCKER_USER}/${IMAGE_NAME}:${IMAGE_TAG}"
        }
        failure {
            echo "Pipeline failed! Please check build logs for errors."
        }
    }
}
