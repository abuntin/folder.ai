import { Directory } from "lib/models";
import { list as GCSList } from "../../functions";

export const load = async (directory: Directory) => {

    let documents = await GCSList({ src: directory })


}