import {Principal} from "@dfinity/principal";
import UserActor from "./Actor";
import {idlFactory as UserBoxIDL} from "@/did/UserBox.did";
import {idlFactory as DataBoxIDL} from "@/did/DataBox/DataBox.did";
import {idlFactory as KeyManageIDL} from "@/did/keySync.did";
import {idlFactory as exampleIDL} from "@/did/example.did";

class Agent extends UserActor {
    public owner: Principal | undefined;
    private resolveCallback: any;

    constructor() {
        super();
    }

    public awaitGetOwner(): Promise<Principal> {
        return new Promise((resolve, reject) => {
            if (this.owner) {
                resolve(this.owner);
                return;
            }
            this.resolveCallback = resolve;
        });
    }

    public setOwner(owner: Principal) {
        this.owner = owner;
        this.resolveCallback && this.resolveCallback(owner);
    }


    public async createNoIdentityUserBoxActor(canisterId: string) {
        return super.noIdentityActor(UserBoxIDL, canisterId);
    }

    async DataBoxActor(canisterID: string) {
        return super.createActor(DataBoxIDL, canisterID);
    }

    async DataBoxNoIdentityActor(canisterID: string) {
        return super.noIdentityActor(DataBoxIDL, canisterID);
    }

    async KeyManageActor(canisterID: string) {
        return super.createActor(KeyManageIDL, canisterID);
    }

    async KeyManageNoIdentityActor(canisterID: string) {
        return super.noIdentityActor(KeyManageIDL, canisterID);
    }

    async ExampleActor(canisterID: string) {
        return super.createActor(exampleIDL, canisterID);
    }

}

export const GetAgent = new Agent();
