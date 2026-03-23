#!/bin/bash
cd gui/frontend
npm i -D playwright @playwright/test
npx playwright test
