import { FileRef } from '../file-reference.js';
import { SpigOperation } from '../spig-operation.js';
import { ctx } from '../ctx.js';

export type AttrMap = { [attrValue: string]: FileRef[] };

function returnAllGroups(attrMap: AttrMap, plural: string) {
  return () => {
    const site: any = ctx.config.site;
    if (!site._[plural]) {
      site._[plural] = [];
      Object.keys(attrMap).forEach((attrValue) => {
        const attr = {
          name: attrValue,
          group: attrMap[attrValue].map((fileRef) => fileRef.context()),
        };
        site._[plural].push(attr);
      });
    }
    return site._[plural];
  };
}

function returnGroupFiles(attrMap: { [attrValue: string]: FileRef[] }) {
  return (attrValue: string) => {
    return attrMap[attrValue].map((fileRef) => fileRef.context());
  };
}

export const operation: (
  attrName: string,
  attrsOf: (attrValue: string, files: FileRef[]) => object
) => SpigOperation = (attrName: string, attrsOf: (attrValue: string, files: FileRef[]) => object) => {
  return new (class extends SpigOperation {
    private attrMap: { [attrValue: string]: FileRef[] } = {};

    private groupFilesByAttr(fileRef: FileRef): void {
      let attrValues = fileRef.attr(attrName);

      if (!Array.isArray(attrValues)) {
        attrValues = [attrValues];
      }

      for (const v of attrValues) {
        if (!this.attrMap[v]) {
          this.attrMap[v] = [];
        }
        this.attrMap[v].push(fileRef);
      }
    }

    private addMethodsToSite(): void {
      const site: any = ctx.config.site;
      const singular = attrName;
      const plural = `${attrName}s`;

      // returns all values
      site[plural] = returnAllGroups(this.attrMap, plural);
      site[`${singular}Group`] = returnGroupFiles(this.attrMap);
    }

    constructor() {
      super(
        `group by: ${attrName}`,
        (fileRef) => {
          if (fileRef.hasAttr(attrName)) {
            this.groupFilesByAttr(fileRef);
          }
          return Promise.resolve(fileRef);
        },
        () => {
          this.attrMap = {};
        },
        () => {
          Object.keys(this.attrMap).forEach((attrValue) => {
            attrsOf(attrValue, this.attrMap[attrValue]);
          });
          this.addMethodsToSite();
        }
      );
    }
  })();
};
