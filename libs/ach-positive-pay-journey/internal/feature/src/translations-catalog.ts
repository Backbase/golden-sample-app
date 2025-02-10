export interface AchPositivePayJourneyTranslations {
  'ach-positive-pay-journey.heading.title': string;
  'ach-positive-pay-journey.heading.new-blocker.button': string;
}

export const achPositivePayJourneyTranslations: AchPositivePayJourneyTranslations =
  {
    'ach-positive-pay-journey.heading.title': $localize`:ACH positive pay title - 'ACH Positive Pay'|This string is used as the
      title for the heading in the ACH Positive Pay journey component. It is
      presented to the user as the main heading of the page when they are
      viewing the ACH Positive Pay journey. This title is located at the top of
      the ACH Positive Pay journey page.@@ach-positive-pay-journey.heading.title:ACH Positive Pay`,
    'ach-positive-pay-journey.heading.new-blocker.button': $localize`:New ACH Blocker - 'New ACH Blocker'|This string is used as the label for a
      button that opens the New ACH Blocker dialog with a form. It is presented
      to the user as a button to create a new ACH Blocker. This button is
      located in the ACH Positive Pay journey
      page.@@ach-positive-pay-journey.heading.new-blocker.button:New ACH Blocker`,
  };

export interface AchPositivePayNewRuleTranslations {
  'ach-positive-pay.new-rule.title': string;
  'ach-positive-pay.error.default.title': string;
  'ach-positive-pay.new-rule.submit-button': string;
  'ach-positive-pay.new-rule.cancel-button': string;
}
export const achPositivePayNewRuleTranslations: AchPositivePayNewRuleTranslations =
  {
    'ach-positive-pay.new-rule.title': $localize`:ACH positive pay title - 'New ACH Rule'|This string is used as the
            title for the heading in the ACH Positive Pay journey component. It is
            presented to the user as the main heading of the page when they are
            viewing the ACH Positive Pay journey. This title is located at the top
            of the ACH Positive Pay journey page@@ach-positive-pay.new-rule.title:New ACH Rule`,
    'ach-positive-pay.error.default.title': $localize`:Server Error - 'Unknown error occurred. Try to submit the form
                again.'|This string is used as the title for an alert message that
                is displayed when the server throws an error. It is presented to
                the user when an unknown error occurs while submitting the form.
                This message is located in the ACH Positive Pay new rule
                component.@@ach-positive-pay.error.default.title:Unknown error occurred. Try to submit the form again.`,
    'ach-positive-pay.new-rule.submit-button': $localize`:Submit button label - 'Submit'|This string is used as the label for
              the 'Submit' button. It is presented to the user when they are
              submitting a new rule in the ACH Positive Pay feature. This label is
              located within the modal footer section of the
              layout.@@ach-positive-pay.new-rule.submit-button:Submit`,
    'ach-positive-pay.new-rule.cancel-button': $localize`:Cancel button label - 'Cancel'|This string is used as the label for
              the 'Cancel' button. It is presented to the user when they want to
              cancel the entry of a new check in the ACH Positive Pay feature.
              This label is located within the modal footer section of the
              layout.@@ach-positive-pay.new-rule.cancel-button:Cancel`,
  };
