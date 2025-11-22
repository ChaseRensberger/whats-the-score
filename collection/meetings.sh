#!/bin/bash

year="2025"

curl "https://api.openf1.org/v1/meetings?year=${year}" | jq '.[-1]'
