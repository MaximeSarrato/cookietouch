import axios from "axios";
import DTConstants from "../DTConstants";
import Data from "./Data";
import { DataTypes } from "./DataTypes";

export interface IDataResponse<T> {
  id: number;
  object: T;
}

export default class DataManager {

  public static async Init(lang = "fr") {
    this.lang = lang;
  }

  public static get<T extends Data>(type: { new(): T }, ...ids: number[]): Promise<Array<IDataResponse<T>>> {
    return new Promise((resolve, reject) => {
      const params = {
        lang: this.lang,
        v: DTConstants.assetsVersion,
      };
      axios.post(`${DTConstants.config.dataUrl}/data/map?lang=${params.lang}&v=${params.v}`,
        {
          class: type.name,
          ids,
        }).then((response) => {
          const myArray: Array<IDataResponse<T>> = [];
          for (const item in response.data) {
            if (response.data.hasOwnProperty(item)) {
              myArray.push({ id: parseInt(item, 10), object: response.data[item] });
            }
          }
          resolve(myArray);
        });
    });
  }

  private static lang: string;
}
