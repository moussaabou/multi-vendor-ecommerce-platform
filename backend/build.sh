#!/usr/bin/env bash
# Build script for Django on Render

pip install -r requirements.txt
python manage.py collectstatic --noinput
python manage.py migrate
