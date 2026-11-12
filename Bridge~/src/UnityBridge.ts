import { Room, setWrapperSdkInfo } from "livekit-client"
import type TypedEmitter from 'typed-emitter';
import { EventEmitter } from 'events';

// Injected by webpack from the Unity package.json
declare const __LK_UNITY_SDK_VERSION__: string;

// Report this SDK as UNITY_WEB instead of JS to the server.
// Runs when the .jspre loads, before C# can create and connect a Room.
setWrapperSdkInfo({ sdk: 'UNITY_WEB', version: __LK_UNITY_SDK_VERSION__ });

export class UnityBridge extends (EventEmitter as new () => TypedEmitter<UnityCallbacks>) {
  private _ready : boolean = false;

  private constructor(){
    super();

    this.once(UnityEvent.BridgeReady, () => {
      this._ready = true;
    });
  }

  public get ready() : boolean  {
    return this._ready;
  }

  public static get instance() : UnityBridge {
    // The UnityBridge is set on window to expose the instance to Unity
    var w = (<any>window);
    return w.lkbridgeinst || (w.lkbridgeinst = new this());
  }

  emit<E extends keyof UnityCallbacks>(event: E, ...args: Parameters<UnityCallbacks[E]>): boolean {
    return super.emit(event, ...args);
  }
};

export enum UnityEvent {
  /**
   * When the Bridge has been initialized.
   */
  BridgeReady = 'bridgeReady',

  /**
   * When a Room has been created in C#
   * (This allows access to the room instance on the js side)
   */
  RoomCreated = 'roomCreated',
}

export type UnityCallbacks = {
  bridgeReady: () => void,
  roomCreated: (room : Room) => void
};
