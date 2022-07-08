import { StoreGlobal } from '../store';
import { dictToUrlHash } from '../../utils/dictToUrlhash';
import { urlhashToDict } from '../../utils/urlhashToDict';

type AddressHashType = {
  chatFilter?: string,
  chatId?: string,
};

export class AddressHash {
  private static getFromStore(): Record<string, string> {
    let tmpHash = StoreGlobal.getStore().addressHash as AddressHashType;
    if (tmpHash === undefined) {
      tmpHash = {
        chatFilter: '',
        chatId: '',
      };
    }
    return tmpHash;
  }

  static setHash(param: string, value: string) {
    const tmpHash = AddressHash.getFromStore();
    tmpHash[param] = value;
    StoreGlobal.set('addressHash', tmpHash);
  }

  static getHash(): AddressHashType {
    return AddressHash.getFromStore();
  }

  static parseAddress() {
    const hsh = urlhashToDict(window.location.hash);
    if ('chatFilter' in hsh) {
      AddressHash.setHash('chatFilter', hsh.chatFilter);
    }
    if ('chatId' in hsh) {
      AddressHash.setHash('chatId', hsh.chatId);
    }
  }

  static getUrlHash(): string {
    return dictToUrlHash(AddressHash.getHash(), { noEmpty: true });
  }
}
