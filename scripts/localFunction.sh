#!/bin/bash

serverless invoke local --function "$1" --path tests/mocks/"$1"-event.json
