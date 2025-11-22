#!/bin/bash

driver_number="1"
session_key="9869"

curl "https://api.openf1.org/v1/drivers?driver_number=${driver_number}&session_key=${session_key}" | jq .
