import { createMocks } from '@backbase/foundation-ang/data-http';
/**
* Mocks provider for /wp-json/wp/v2/media/{id} URL pattern
*/
export const DefaultHttpServiceMediaIdGetMocksProvider = createMocks([{
        urlPattern: "/wp-json/wp/v2/media/{id}",
        method: "GET",
        responses: []
    }]);
/**
* Mocks provider for /wp-json/wp/v2/pages/{id} URL pattern
*/
export const DefaultHttpServicePagesIdGetMocksProvider = createMocks([{
        urlPattern: "/wp-json/wp/v2/pages/{id}",
        method: "GET",
        responses: []
    }]);
/**
* Mocks provider for /wp-json/wp/v2/posts/{id} URL pattern
*/
export const DefaultHttpServicePostsIdGetMocksProvider = createMocks([{
        urlPattern: "/wp-json/wp/v2/posts/{id}",
        method: "GET",
        responses: []
    }]);
export const DefaultHttpServiceMocksProvider = createMocks([
    {
        urlPattern: "/wp-json/wp/v2/media/{id}",
        method: "GET",
        responses: []
    },
    {
        urlPattern: "/wp-json/wp/v2/pages/{id}",
        method: "GET",
        responses: []
    },
    {
        urlPattern: "/wp-json/wp/v2/posts/{id}",
        method: "GET",
        responses: []
    },
]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC5zZXJ2aWNlLm1vY2tzLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy90b21hc2NvcnJhbC9wcm9qZWN0cy9CYWNrYmFzZS9yZXBvcy9wYXltZW50LW9yZGVyLXByZXNlbnRhdGlvbi1zcGVjLWJhY2svdGFyZ2V0L2dlbmVyYXRlZC1zb3VyY2VzL29wZW5hcGkvIiwic291cmNlcyI6WyJhcGkvZGVmYXVsdC5zZXJ2aWNlLm1vY2tzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUdqRTs7RUFFRTtBQUNGLE1BQU0sQ0FBQyxNQUFNLHlDQUF5QyxHQUFhLFdBQVcsQ0FBQyxDQUFDO1FBQ3hFLFVBQVUsRUFBRSwyQkFBMkI7UUFDdkMsTUFBTSxFQUFFLEtBQUs7UUFDYixTQUFTLEVBQUUsRUFDZDtLQUNKLENBQUMsQ0FBQyxDQUFDO0FBQ0o7O0VBRUU7QUFDRixNQUFNLENBQUMsTUFBTSx5Q0FBeUMsR0FBYSxXQUFXLENBQUMsQ0FBQztRQUN4RSxVQUFVLEVBQUUsMkJBQTJCO1FBQ3ZDLE1BQU0sRUFBRSxLQUFLO1FBQ2IsU0FBUyxFQUFFLEVBQ2Q7S0FDSixDQUFDLENBQUMsQ0FBQztBQUNKOztFQUVFO0FBQ0YsTUFBTSxDQUFDLE1BQU0seUNBQXlDLEdBQWEsV0FBVyxDQUFDLENBQUM7UUFDeEUsVUFBVSxFQUFFLDJCQUEyQjtRQUN2QyxNQUFNLEVBQUUsS0FBSztRQUNiLFNBQVMsRUFBRSxFQUNkO0tBQ0osQ0FBQyxDQUFDLENBQUM7QUFFSixNQUFNLENBQUMsTUFBTSwrQkFBK0IsR0FBYSxXQUFXLENBQ2hFO0lBQ0E7UUFDSSxVQUFVLEVBQUUsMkJBQTJCO1FBQ3ZDLE1BQU0sRUFBRSxLQUFLO1FBQ2IsU0FBUyxFQUFFLEVBRWQ7S0FDSjtJQUNHO1FBQ0ksVUFBVSxFQUFFLDJCQUEyQjtRQUN2QyxNQUFNLEVBQUUsS0FBSztRQUNiLFNBQVMsRUFBRSxFQUVkO0tBQ0o7SUFDRztRQUNJLFVBQVUsRUFBRSwyQkFBMkI7UUFDdkMsTUFBTSxFQUFFLEtBQUs7UUFDYixTQUFTLEVBQUUsRUFFZDtLQUNKO0NBQ0EsQ0FDQSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY3JlYXRlTW9ja3MgfSBmcm9tICdAYmFja2Jhc2UvZm91bmRhdGlvbi1hbmcvZGF0YS1odHRwJztcbmltcG9ydCB7IFByb3ZpZGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbi8qKlxuKiBNb2NrcyBwcm92aWRlciBmb3IgL3dwLWpzb24vd3AvdjIvbWVkaWEve2lkfSBVUkwgcGF0dGVyblxuKi9cbmV4cG9ydCBjb25zdCBEZWZhdWx0SHR0cFNlcnZpY2VNZWRpYUlkR2V0TW9ja3NQcm92aWRlcjogUHJvdmlkZXIgPSBjcmVhdGVNb2Nrcyhbe1xuICAgICAgICB1cmxQYXR0ZXJuOiBcIi93cC1qc29uL3dwL3YyL21lZGlhL3tpZH1cIixcbiAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgICByZXNwb25zZXM6IFtcbiAgICBdXG59XSk7XG4vKipcbiogTW9ja3MgcHJvdmlkZXIgZm9yIC93cC1qc29uL3dwL3YyL3BhZ2VzL3tpZH0gVVJMIHBhdHRlcm5cbiovXG5leHBvcnQgY29uc3QgRGVmYXVsdEh0dHBTZXJ2aWNlUGFnZXNJZEdldE1vY2tzUHJvdmlkZXI6IFByb3ZpZGVyID0gY3JlYXRlTW9ja3MoW3tcbiAgICAgICAgdXJsUGF0dGVybjogXCIvd3AtanNvbi93cC92Mi9wYWdlcy97aWR9XCIsXG4gICAgICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICAgICAgcmVzcG9uc2VzOiBbXG4gICAgXVxufV0pO1xuLyoqXG4qIE1vY2tzIHByb3ZpZGVyIGZvciAvd3AtanNvbi93cC92Mi9wb3N0cy97aWR9IFVSTCBwYXR0ZXJuXG4qL1xuZXhwb3J0IGNvbnN0IERlZmF1bHRIdHRwU2VydmljZVBvc3RzSWRHZXRNb2Nrc1Byb3ZpZGVyOiBQcm92aWRlciA9IGNyZWF0ZU1vY2tzKFt7XG4gICAgICAgIHVybFBhdHRlcm46IFwiL3dwLWpzb24vd3AvdjIvcG9zdHMve2lkfVwiLFxuICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICAgIHJlc3BvbnNlczogW1xuICAgIF1cbn1dKTtcblxuZXhwb3J0IGNvbnN0IERlZmF1bHRIdHRwU2VydmljZU1vY2tzUHJvdmlkZXI6IFByb3ZpZGVyID0gY3JlYXRlTW9ja3MoXG4gICAgW1xuICAgIHtcbiAgICAgICAgdXJsUGF0dGVybjogXCIvd3AtanNvbi93cC92Mi9tZWRpYS97aWR9XCIsXG4gICAgICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICAgICAgcmVzcG9uc2VzOiBbXG5cbiAgICBdXG59LFxuICAgIHtcbiAgICAgICAgdXJsUGF0dGVybjogXCIvd3AtanNvbi93cC92Mi9wYWdlcy97aWR9XCIsXG4gICAgICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICAgICAgcmVzcG9uc2VzOiBbXG5cbiAgICBdXG59LFxuICAgIHtcbiAgICAgICAgdXJsUGF0dGVybjogXCIvd3AtanNvbi93cC92Mi9wb3N0cy97aWR9XCIsXG4gICAgICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICAgICAgcmVzcG9uc2VzOiBbXG5cbiAgICBdXG59LFxuXVxuKTtcblxuXG4iXX0=