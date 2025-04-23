#!/bin/bash

# Define color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Apply yellow color to above output
echo -e "${GREEN}$(cat << "ASCII"
··························································································
:░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░:
:░░░█▀█░█░█░█▀▀░█░█░▀█▀░█▀█░█▀▀░░░░▀█▀░█▀█░░░░█▄█░█▀█░▀█▀░█▀█░░░█▀▄░█▀▄░█▀█░█▀█░█▀▀░█░█░░:
:░░░█▀▀░█░█░▀▀█░█▀█░░█░░█░█░█░█░░░░░█░░█░█░░░░█░█░█▀█░░█░░█░█░░░█▀▄░█▀▄░█▀█░█░█░█░░░█▀█░░:
:░░░▀░░░▀▀▀░▀▀▀░▀░▀░▀▀▀░▀░▀░▀▀▀░░░░░▀░░▀▀▀░░░░▀░▀░▀░▀░▀▀▀░▀░▀░░░▀▀░░▀░▀░▀░▀░▀░▀░▀▀▀░▀░▀░░:
:░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░:
··························································································
ASCII
)${NC}"

# Check if we're in a git repository
if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
    echo -e "${RED}Error: Not in a git repository${NC}"
    exit 1
fi

# Save the current branch to return to it later
current_branch=$(git symbolic-ref --short HEAD)

# Check if there are changes to commit
if [ -z "$(git status --porcelain)" ]; then
    echo -e "${BLUE}No changes to commit. Stashing not needed.${NC}"
else
    # Stash changes if any exist
    echo -e "${BLUE}Stashing current changes...${NC}"
    git stash push -m "Temporary stash before switching to main"
    stashed=true
fi

# Checkout to main branch
echo -e "${BLUE}Checking out to main branch...${NC}"
if ! git checkout main; then
    echo -e "${RED}Error: Failed to checkout to main branch${NC}"
    # Pop stash if we stashed changes
    if [ "$stashed" = true ]; then
        git stash pop
    fi
    exit 1
fi

# Merge from develop branch
echo -e "${BLUE}Merging changes from develop branch...${NC}"
if ! git merge develop; then
    echo -e "${RED}Error: Merge conflict occurred. Please resolve conflicts manually.${NC}"
    # Return to original branch
    git checkout "$current_branch"
    # Pop stash if we stashed changes
    if [ "$stashed" = true ]; then
        git stash pop
    fi
    exit 1
fi

# Push to origin main
echo -e "${BLUE}Pushing to origin main...${NC}"
if ! git push origin main; then
    echo -e "${YELLOW}Error: Failed to push to origin main${NC}"
    # Continue with upstream push attempt anyway
fi

# Return to develop branch
echo -e "${BLUE}Checking out back to develop branch...${NC}"
if ! git checkout develop; then
    echo -e "${YELLOW}Warning: Failed to checkout to develop branch${NC}"
    echo -e "${BLUE}Returning to original branch: ${GREEN}$current_branch${NC}"
    git checkout "$current_branch"
else
    echo -e "${GREEN}Successfully checked out to develop branch${NC}"
fi

# Pop stash if we stashed changes
if [ "$stashed" = true ]; then
    echo -e "${BLUE}Restoring your previous changes...${NC}"
    git stash pop
fi

echo -e "${GREEN}"
echo " ┌─────────────────────────────────────────────────┐"
echo " │ Process completed: Merged develop into main and  │"
echo " │ pushed to both remotes                          │"
echo " └─────────────────────────────────────────────────┘"
echo -e "${NC}" 