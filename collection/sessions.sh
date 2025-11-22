#!/bin/bash

meeting_key="1273"
session_name="Race"
year="2025"

curl "https://api.openf1.org/v1/sessions?meeting_key=${meeting_key}&session_name=${session_name}&year=${year}" | jq .
