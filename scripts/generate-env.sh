#!/bin/bash

# Because we use typescript, we need to unzip the packaged
# serverless bundle, so that the `serverless-manifest-plugin`
# can generate the manifest.json we need to extract the
# appsync-url

echo "Generating bundle..."
npm run package

echo "Unzipping bundle ..."
unzip -o .serverless/\*.zip

echo "Generating .env file "

npm run sls -- export-env
npm run sls -- manifest

echo "Cleainng up js files ... "
find src -name "*.js" -type f -delete
find src -name "*.js.map" -type f -delete
