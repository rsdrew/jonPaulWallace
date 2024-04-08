#!/bin/bash

# Set environment variables
export JEKYLL_ENV=production

# Run Jekyll
npx tinacms build -c "jekyll serve"