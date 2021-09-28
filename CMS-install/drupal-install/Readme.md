# Install Drupal instance
In order to test our journey content slots we have provided a way to install your own Drupal instance completely functional.

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

## Installation

* Open a terminal
* Execute `docker-compose up` and wait for it.
* Open a browser and navigate to `http://localhost:9000`
* Follow the steps of a regular Drupal installation

## Enabling API calls

* Open a browser
* Navigate to `http://localhost/admin/modules`
* *List* tab must be selected
* Click on `+ Add new module` button
* Set the value of `Add from a URL` input to `https://ftp.drupal.org/files/projects/restui-8.x-1.20.tar.gz`. This will install *RESTful Web Services* as well as *REST UI*
* Navigate to `http://localhost/admin/config`
* Locate `WEB SERVICES` section. Click on `REST` item.
* Search `Content` on `Disabled` list and click on `Enable` button. It will open a new page to configure it.
* Keep `Resource` as value for `Granularity`
* Select only `GET` method on `Methods``
* Select `hal_json` and `json` on `Accepted requests formats`
* Select `cookie` on `Authentication providers`
* Click on `Save configuration button` and it will go back to the list, `Content` item will be the only one on `Enabled` list.


