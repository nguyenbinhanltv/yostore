#!/bin/bash
docker build -t gcr.io/yo-store/yostore-admin .
# Configure docker to use Google authentication
gcloud auth configure-docker -q
docker push gcr.io/yo-store/yostore-admin
