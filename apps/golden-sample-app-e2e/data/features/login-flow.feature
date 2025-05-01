@feature @i18n @e2e @ephemeral
Feature: Login tests

Background: Navigate to Login Page
  Given User navigates to the login page

Scenario: Login as user with wrong credentials
  When User has entered credentials: "${wrongUser.username}" / "${wrongUser.password}"
  And Try to login to the banking app
  Then User should see the failed login error message "${identity.error}"
