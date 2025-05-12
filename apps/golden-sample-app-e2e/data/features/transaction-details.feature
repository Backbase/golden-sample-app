Feature: Transaction Details Validation
  As a user
  I want to view transaction details
  So that I can verify the transaction information is correct

  @e2e @transactions @transactions-details @mocks
  Scenario: Validate transaction details display
    Given I am on the transactions page
    When I open the transaction details for transaction "007jb5"
    Then I should see the following transaction details:
      | Field        | Value               |
      | recipient    | Hard Rock Cafe      |
      | date         | Mar 2, 2023         |
      | amount       | 829.25 USD          |
      | category     | Alcohol & Bars      |
      | description  | Beer Bar Salt Lake  |
      | status       | BILLED              |
