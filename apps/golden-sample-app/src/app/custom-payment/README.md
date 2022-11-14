# Add a custom component to Initiate Payments Journey

## Scope

Scope of this example is to explain how to create a custom component and connect it with the out-of-the-box Initiate Payments Journey. The component in this example replaces the out-of-the-box `intiator` group but it can also be used to replace any other configuration group such as `counterparty`, `remittanceInfo` and `schedule` or add a new `additions` configuration group.

## Initate Payments Journey

Initiate Payment journey allows customers create or edit a payment. The journey is fully customizable with a TypeScript configuration to support different payment types, guide on this topic can be found [here](https://community.backbase.com/documentation/Business-Apps-USA/latest/configure_initiate_payment_journey). Check included links or the documentation on backbase.io to learn more about internal workings of the journey and [out-of-the-box configurations](https://community.backbase.com/documentation/Business-Apps-USA/latest/initiate_payment_web_journey) for different payment types.

### Create a payment

When making a payment, the bank customer enters the following information in a payments form:

1. From account / Debit account / Initiator
2. To account / Credit account / Counterparty
3. Amount
4. Payment Schedule

The details are captured in the form through configuration groups below and are provided to the `fields` property of the payment configuration. Check the enum `PaymentBaseFields` for more information. The groups are constructed by selecting one or more of the Payment Components.

- `initiator`
- `counterparty`
- `remittanceInfo`
- `schedule`
- `additions`(Optional)

All out-of-the-box configurations define the above mandatory fields and in addition may have some fields specific to the payment type. These fields are combined together to create a payment config of type `InitiatePaymentConfig` provided to the journey using Injection Token `INITIATE_PAYMENT_CONFIG`. This is demonstrated in `initiate-payment-journey-bundle-module.ts`.

## Custom Initiator Component

The task is to replace the existing component used inside the `initiator` configuration group and replace it with a custom component.

Each configuration group adheres to certain defined types. For example, the out-of-the-box component for `initiator` follows types defined in the interface `InitiatorDetails`. Similarly, counterparty, remittanceInfo and schedule configuration groups adhere to types defined in `CounterPartyDetails`, `RemittanceDetails` and `ScheduleItem` respectively.

Since we decided to replace the initator component, it is mandatory that the new component adhers to the type which the OOTB component was following. It is mandatory for the payments journey business logic to work correctly and integrate with the Banking Services. Any deviation from the type will likely cause issues while validating or submitting the payment order.

Look inside `components/initiator` to see the component in action.