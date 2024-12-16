import { Injectable } from '@angular/core';
import { Environment } from './type';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentService {
  private _environment: Environment | null = null;

  public get environment(): Environment | null {
    return this._environment;
  }

  public initializeEnvironment(environment: Environment) {
    this._environment = environment;
  }
}
