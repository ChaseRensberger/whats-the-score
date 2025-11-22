#!/bin/bash

session_key="9869"

curl "https://api.openf1.org/v1/session_result?session_key=${session_key}" | jq .
