Feature: Transaction Details Display
  As a user
  I want to view detailed information about my transactions
  So that I can verify transaction details are correct

  Background:
    Given I am on the transactions list page
    And I have access to my transaction history

  Scenario: View transaction details with all required fields
    When I navigate to transaction details for transaction "007jb5"
    Then I should see the following transaction details:
      | Field        | Value                   |
      | Recipient    | Hard Rock Cafe          |
      | Date         | Mar 11, 2023            |
      | Amount       | $839.25                 |
      | Category     | Alcohol & Bars          |
      | Description  | Beer Bar Salt Lake      |
      | Status       | BILLED                  |

  Scenario: Verify transaction details formatting
    When I navigate to transaction details for transaction "007jb5"
    Then the transaction amount should be formatted with currency symbol
    And the transaction date should be formatted as "Mon D, YYYY"
    And all transaction fields should be properly labeled

  Scenario: Verify transaction details data consistency
    When I navigate to transaction details for transaction "007jb5"
    Then the displayed transaction details should match the stored transaction data
    And all required fields should be present and non-empty