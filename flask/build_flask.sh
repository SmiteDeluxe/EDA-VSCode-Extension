#!/bin/bash

# Activate the virtual environment created by poetry
source $(poetry env info --path)/bin/activate

# Run pyinstaller using the activated virtual environment
pyinstaller main.spec
