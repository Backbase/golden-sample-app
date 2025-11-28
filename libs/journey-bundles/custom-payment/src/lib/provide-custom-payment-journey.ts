import { Router } from '@angular/router';

/**
 * Factory function for the review service
 */
export function reviewServiceFactory(router: Router) {
  return {
    navigateFromSuccess: () => {
      router.navigate(['/transactions']);
    },
    navigateFromCancel: () => {
      router.navigate(['/transactions']);
    },
    navigateFromError: () => {
      router.navigate(['/error']);
    },
    isInModal: () => false,
  };
}
