#!/bin/bash

# Define color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
ORANGE='\033[0;33m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Apply yellow color to above output
echo -e "${ORANGE}$(cat << "ASCII"
·····································································································
:░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░:
:░░░█▀█░█░█░█▀▀░█░█░▀█▀░█▀█░█▀▀░░░░▀█▀░█▀█░░░█▀▄░█▀▀░█░█░█▀▀░█░░░█▀█░█▀█░░░█▀▄░█▀▄░█▀█░█▀█░█▀▀░█░█░░:
:░░░█▀▀░█░█░▀▀█░█▀█░░█░░█░█░█░█░░░░░█░░█░█░░░█░█░█▀▀░▀▄▀░█▀▀░█░░░█░█░█▀▀░░░█▀▄░█▀▄░█▀█░█░█░█░░░█▀█░░:
:░░░▀░░░▀▀▀░▀▀▀░▀░▀░▀▀▀░▀░▀░▀▀▀░░░░░▀░░▀▀▀░░░▀▀░░▀▀▀░░▀░░▀▀▀░▀▀▀░▀▀▀░▀░░░░░▀▀░░▀░▀░▀░▀░▀░▀░▀▀▀░▀░▀░░:
:░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░:
·····································································································
ASCII
)${NC}"

# Check if we're in a git repository
if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
    echo -e "${RED}Error: Not in a git repository${NC}"
    exit 1
fi

# Check if there are changes to commit
if [ -z "$(git status --porcelain)" ]; then
    echo -e "${BLUE}No changes to commit${NC}"
    exit 0
fi

# Ask for commit message
echo -e "${BLUE}Enter commit message:${NC}"
read commit_message

# Check if commit message is empty
if [ -z "$commit_message" ]; then
    echo -e "${RED}Error: Commit message cannot be empty${NC}"
    exit 1
fi

# Add all changes
echo -e "${BLUE}Adding all changes...${NC}"
git add .

# Commit with the provided message
echo -e "${BLUE}Committing changes...${NC}"
git commit -m "$commit_message"

# Push to origin develop
echo -e "${BLUE}Pushing to origin develop...${NC}"
if ! git push origin develop; then
    echo -e "${RED}Error: Failed to push to origin develop${NC}"
    exit 1
fi

echo -e "${GREEN}"
echo " ┌─────────────────────────────────────────────────────┐"
echo " │ Successfully pushed to both origin develop branch   │"
echo " └─────────────────────────────────────────────────────┘"
echo -e "${NC}" 