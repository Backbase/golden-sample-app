import { Component, Input } from "@angular/core";
import { SocialNetworks } from "../../model/SocialNetwork";

@Component({
    selector: 'bb-social-networks',
    templateUrl: 'social-networks.component.html',
})
export class SocialNetworksComponent {
    @Input()
    socialNetworks: SocialNetworks = [];
}