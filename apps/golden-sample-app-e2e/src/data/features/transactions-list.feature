Feature: Transaction Filtering
  As a user
  I want to filter transactions by search term
  So that I can find specific transactions quickly

  Background:
    Given I am on the transactions page
    And there are transactions in the list

  Scenario: Filter transactions by search term
    When I enter "KLM" in the search field
    Then I should see the following transactions:
      | recipient | amount    |
      | KLM       | 23.84     |
      | KLM       | 24.01     |
      | KLM       | 0.00      |
      | KLM       | 15,508.37 |
