import { nanoid } from 'nanoid'; 
export class IDBroker {
  static acquireID() {
    return nanoid();
  }
}

export default IDBroker;
