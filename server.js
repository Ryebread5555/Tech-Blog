const express = require('express');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const path = require('path');

// create helper functions
const helpers = require('./utils/helpers')