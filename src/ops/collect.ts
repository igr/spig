import slugify from 'slugify';
import * as SpigConfig from '../spig-config';
import { FileRef } from '../file-reference';
import { SpigFiles } from '../spig-files';

type Spig = import('../spig').Spig;

export function collect(spig: Spig, fileRef: FileRef, attrName: string, createFile: boolean): void {
  if (!fileRef.hasAttr(attrName)) {
    return;
  }

  let values = fileRef.attr(attrName);

  if (!Array.isArray(values)) {
    values = [values];
  }

  const site = SpigConfig.site as any;
  let map = site.collections[attrName];

  if (!map) {
    // store new collection
    map = {};
    site.collections[attrName] = map;

    site.pageOfCollection = (collName: string, name: string) => {
      const fileName = `/${slugify(collName)}/${slugify(String(name))}/`;
      return site.pageOf(fileName);
    };
  }

  for (const v of values) {
    let attrFile;

    if (!map[v]) {
      // first time collection is used
      map[v] = [];

      if (!site[attrName]) {
        site[attrName] = [];
      }
      site[attrName].push(v);

      const fileName = `/${slugify(attrName)}/${slugify(String(v))}/index.html`;

      if (createFile) {
        attrFile = spig.addFile(fileName, v);

        attrFile.setAttr('page', true);
        attrFile.setAttr('title', `${attrName}: ${v}`);
        attrFile.setAttr('layout', attrName);
      }
    } else {
      const id = `/${slugify(attrName)}/${slugify(String(v))}/index`;

      if (createFile) {
        attrFile = SpigFiles.lookup(id);
      }
    }

    map[v].push(fileRef.context());
  }
}
