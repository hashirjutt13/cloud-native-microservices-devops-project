pipeline {
  agent any

  options {
    timestamps()
    buildDiscarder(logRotator(numToKeepStr: '10'))
  }

  environment {
    DOCKERHUB_USERNAME = credentials('dockerhub-username')
    DOCKERHUB_TOKEN = credentials('dockerhub-token')
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Prepare Environment') {
      steps {
        script {
          env.IMAGE_TAG = "${env.BUILD_NUMBER}-${env.GIT_COMMIT.take(7)}"
          if (env.BRANCH_NAME == 'main' || env.BRANCH_NAME == 'production') {
            env.KUBE_NAMESPACE = 'cloud-final-production'
            env.KUSTOMIZE_DIR = 'k8s/environments/production'
          } else if (env.BRANCH_NAME == 'release') {
            env.KUBE_NAMESPACE = 'cloud-final-staging'
            env.KUSTOMIZE_DIR = 'k8s/environments/staging'
          } else {
            env.KUBE_NAMESPACE = 'cloud-final-development'
            env.KUSTOMIZE_DIR = 'k8s/environments/development'
          }
        }
      }
    }

    stage('Install') {
      steps {
        sh 'npm install'
      }
    }

    stage('Build') {
      steps {
        sh 'npm run lint'
      }
    }

    stage('Test') {
      steps {
        sh 'npm test'
      }
    }

    stage('Docker Build') {
      steps {
        sh '''
          docker build -t $DOCKERHUB_USERNAME/cloud-final-frontend:$IMAGE_TAG frontend
          docker build -t $DOCKERHUB_USERNAME/cloud-final-user-service:$IMAGE_TAG services/user
          docker build -t $DOCKERHUB_USERNAME/cloud-final-product-service:$IMAGE_TAG services/product
          docker build -t $DOCKERHUB_USERNAME/cloud-final-order-service:$IMAGE_TAG services/order
          docker build -t $DOCKERHUB_USERNAME/cloud-final-notification-service:$IMAGE_TAG services/notification
        '''
      }
    }

    stage('Push') {
      steps {
        sh '''
          echo "$DOCKERHUB_TOKEN" | docker login -u "$DOCKERHUB_USERNAME" --password-stdin
          docker push $DOCKERHUB_USERNAME/cloud-final-frontend:$IMAGE_TAG
          docker push $DOCKERHUB_USERNAME/cloud-final-user-service:$IMAGE_TAG
          docker push $DOCKERHUB_USERNAME/cloud-final-product-service:$IMAGE_TAG
          docker push $DOCKERHUB_USERNAME/cloud-final-order-service:$IMAGE_TAG
          docker push $DOCKERHUB_USERNAME/cloud-final-notification-service:$IMAGE_TAG
        '''
      }
    }

    stage('Deploy') {
      steps {
        sh '''
          kubectl create namespace $KUBE_NAMESPACE --dry-run=client -o yaml | kubectl apply -f -
          kubectl -n $KUBE_NAMESPACE apply -k $KUSTOMIZE_DIR
          kubectl -n $KUBE_NAMESPACE set image deployment/frontend frontend=$DOCKERHUB_USERNAME/cloud-final-frontend:$IMAGE_TAG
          kubectl -n $KUBE_NAMESPACE set image deployment/user-service user-service=$DOCKERHUB_USERNAME/cloud-final-user-service:$IMAGE_TAG
          kubectl -n $KUBE_NAMESPACE set image deployment/product-service product-service=$DOCKERHUB_USERNAME/cloud-final-product-service:$IMAGE_TAG
          kubectl -n $KUBE_NAMESPACE set image deployment/order-service order-service=$DOCKERHUB_USERNAME/cloud-final-order-service:$IMAGE_TAG
          kubectl -n $KUBE_NAMESPACE set image deployment/notification-service notification-service=$DOCKERHUB_USERNAME/cloud-final-notification-service:$IMAGE_TAG
          kubectl -n $KUBE_NAMESPACE rollout status deployment/frontend --timeout=120s
          kubectl -n $KUBE_NAMESPACE rollout status deployment/user-service --timeout=120s
          kubectl -n $KUBE_NAMESPACE rollout status deployment/product-service --timeout=120s
          kubectl -n $KUBE_NAMESPACE rollout status deployment/order-service --timeout=120s
          kubectl -n $KUBE_NAMESPACE rollout status deployment/notification-service --timeout=120s
        '''
      }
    }

    stage('Notify') {
      steps {
        echo "Deployment completed for ${env.BRANCH_NAME} using image tag ${env.IMAGE_TAG}"
      }
    }
  }

  post {
    failure {
      sh '''
        if command -v kubectl >/dev/null 2>&1; then
          kubectl -n $KUBE_NAMESPACE rollout undo deployment/frontend || true
          kubectl -n $KUBE_NAMESPACE rollout undo deployment/user-service || true
          kubectl -n $KUBE_NAMESPACE rollout undo deployment/product-service || true
          kubectl -n $KUBE_NAMESPACE rollout undo deployment/order-service || true
          kubectl -n $KUBE_NAMESPACE rollout undo deployment/notification-service || true
        fi
      '''
      echo 'Build failed. Rollback commands were attempted for existing Kubernetes deployments.'
    }
  }
}
