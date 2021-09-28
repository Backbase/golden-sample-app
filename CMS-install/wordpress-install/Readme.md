# Install Wordpress instance
In order to test our journey content slots we have provided a way to install your own Wordpress instance completely functional.

## Pre-requisits
### [Docker|https://www.docker.com]

Download and install the Docker Community Edition for your computer:
* [Mac|https://hub.docker.com/editions/community/docker-ce-desktop-mac]
* [Windows|https://hub.docker.com/editions/community/docker-ce-desktop-windows]

This version of Docker includes Docker Compose which we’ll need for our WordPress setup.

* Start Docker
Once Docker is installed, start the application. There will be a prompt for your system password, enter it and after it runs through a few more steps automatically you’ll see Docker running in the toolbar menu in the upper right of your screen. It’s a whale ship carrying cargo, clever little icon.

## Structure
On this folder you can find two files:
* docker-compose.yml
* uploads.ini

## Installation

* Open a terminal
* Execute `docker-compose up` and wait for it.
* Open a browser and navigate to `http://localhost:8000`
* Follow the steps of a regular Wordpress installation

## Enabling API calls

* Navigate to `http://localhost:8000/wp-admin/options-permalink.php``
* Click on `Custom Structure` radio button on `Common Settings` section
* Select *%post_id%* button so the input contains `/%post_id%/`.

