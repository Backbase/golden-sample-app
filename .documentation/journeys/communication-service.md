<!-- .documentation/journeys/communication-service.md -->
#### Communication service or how to communicate between journeys !heading

Communication between journeys allows them to work together without tight coupling. This pattern works the same way for both modern journeyFactory and legacy NgModule patterns.

###### The Communication Pattern

There are 3 key parts of the communication chain:

1. **Source Journey** - Defines what data/signals it can send
   - Defines a communication interface and exports it
   - Example: [Make Transfer Communication](https://github.com/Backbase/golden-sample-app/blob/main/libs/transfer-journey/internal/data-access/src/lib/services/make-transfer-communication/make-transfer-communication.service.ts)

2. **Destination Journey** - Defines what data/signals it expects to receive
   - Also defines a communication interface matching what it expects
   - Example: [Transactions Journey Communication](https://github.com/Backbase/golden-sample-app/blob/main/libs/transactions-journey/internal/data-access/src/lib/services/transactions-journey-communication/transactions-journey-communication.service.ts)

3. **Application Level** - Provides the actual implementation
   - Implements both interfaces (or abstract classes) from source and destination journeys
   - Bridges the two journeys together
   - Must be provided to the journey bundles to avoid breaking lazy loading
   - Example: [Journey Communication Service](https://github.com/Backbase/golden-sample-app/blob/main/apps/golden-sample-app/src/app/services/journey-communication.service.ts)

###### Implementation Example (journeyFactory Pattern)

```typescript
// libs/transfer-journey/internal/data-access/.../make-transfer-communication.service.ts
// SOURCE: Defines what data the transfer journey can send
export interface MakeTransferCommunicationService {
  onTransferComplete(data: TransferData): void;
}

export const MAKE_TRANSFER_JOURNEY_COMMUNICATION_SERVICE = 
  new InjectionToken<MakeTransferCommunicationService>(...);
```

```typescript
// libs/transactions-journey/internal/data-access/.../transactions-journey-communication.service.ts
// DESTINATION: Defines what data transactions journey expects to receive
export interface TransactionsCommunicationService {
  onTransactionViewed(id: string): void;
}

export const TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE =
  new InjectionToken<TransactionsCommunicationService>(...);
```

```typescript
// apps/golden-sample-app/src/app/services/journey-communication.service.ts
// IMPLEMENTATION: Implements both interfaces at the app level
@Injectable({ providedIn: 'root' })
export class JourneyCommunicationService
  implements MakeTransferCommunicationService, TransactionsCommunicationService
{
  onTransferComplete(data: TransferData): void {
    // Handle transfer completion
    console.log('Transfer completed:', data);
    // Maybe trigger navigation to transactions
  }

  onTransactionViewed(id: string): void {
    // Handle transaction view
    console.log('Transaction viewed:', id);
  }
}
```

```typescript
// libs/journey-bundles/transactions/src/lib/transactions.bundle.ts
// CONFIGURATION: Provide the implementation to the journey
@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [
    TransactionsRouteTitleResolverService,
    {
      provide: TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE,
      useExisting: JourneyCommunicationService,  // Use app-level implementation
    },
  ],
})
export class TransactionsModule {}
```

**Important**: Always provide the communication service in the **journey bundle** (not in a global provider). This ensures proper scoping with lazy loading and allows each journey instance to have access to the service.

###### Important Notes

- The communication service from the application level should be provided to the journeys modules in the **bundle files** (to avoid breaking lazy loading)
- Don't forget to provide the service with `useExisting` rather than `useClass` to reference the same instance
- Keep the communication service logic at the app level, not inside journeys
- Use dependency injection and interfaces to keep journeys loosely coupled

###### More Information

For theoretical understanding and best practices, check [Understand communication between journeys](https://backbase.io/documentation/web-devkit/journey-development-advanced/communication-between-journeys) in the Backbase documentation.
